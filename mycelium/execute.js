const { Buffer, process } = require('./runtime.js')
const fs = require('bare-fs')
const path = require('bare-path')
const { repoRoot } = require('./resolve.js')
const {
  StreamRecord,
  StreamDescriptor,
  ExecuteContext,
  OperatorBag,
  encodeHeader,
  decodeHeader,
  findHeader,
  headerKeys
} = require('./schema.js')

const decoder = new TextDecoder()

function str (val) {
  if (typeof val === 'string') return val
  if (val instanceof Uint8Array) return decoder.decode(val)
  return '' + val
}

// --- Readable Display ---
//
// Decode a stream record into a human-readable object.
// Decodes known header types. Unknown headers show as
// { bytes: N }.

const KNOWN_TYPES = {
  'spl.data.stream': StreamDescriptor,
  'spl.mycelium.process.execute': ExecuteContext
}

// Make decoded values readable — bytes as strings,
// parse JSON where possible
function readableValue (val) {
  if (val === null || val === undefined) return null
  if (val instanceof Uint8Array || Buffer.isBuffer(val)) {
    let s = str(val)
    try { return JSON.parse(s) } catch (e) { return s }
  }
  if (typeof val === 'object') {
    let out = {}
    for (let k of Object.keys(val)) out[k] = readableValue(val[k])
    return out
  }
  return val
}

function readableHeader (entry) {
  let type = KNOWN_TYPES[entry.key]
  if (type) {
    try { return { key: entry.key, value: readableValue(decodeHeader(entry, type)) } }
    catch (e) { /* fall through */ }
  }
  // Operator bags
  try { return { key: entry.key, value: readableValue(decodeHeader(entry, OperatorBag)) } }
  catch (e) { /* fall through */ }
  // Raw bytes — try as string
  return { key: entry.key, value: str(entry.value) }
}

function readable (msg) {
  return {
    offset: msg.offset,
    timestamp: msg.timestamp,
    key: msg.key,
    value: msg.value && msg.value.length > 0
      ? { bytes: msg.value.length }
      : null,
    headers: msg.headers.map(readableHeader)
  }
}

// Nested display — decode value as inner stream record
function nested (msg) {
  let r = readable(msg)
  if (msg.value && msg.value.length > 0) {
    try { r.value = nested(StreamRecord.fromBuffer(msg.value)) }
    catch (e) { /* value is not a stream record */ }
  }
  return r
}

// --- Message Log ---

function logMessage (dir, msg) {
  fs.mkdirSync(dir, { recursive: true })
  let ts = msg.timestamp
  let seq = 0
  while (fs.existsSync(path.join(dir, `${ts}-${seq}.json`))) seq++
  let file = path.join(dir, `${ts}-${seq}.json`)
  fs.writeFileSync(file, JSON.stringify(readable(msg), null, 2))
  return file
}

// --- Execute ---
//
// 1. Read spl.data.stream descriptor → stream type
// 2. Log the message
// 3. Resolve repo root from caller pov
// 4. Return enriched record

function execute (envelope) {
  let logDir = path.join(process.cwd(), '_server', 'log')
  let logFile = logMessage(logDir, envelope)

  // Read stream descriptor
  let streamEntry = findHeader(envelope.headers, 'spl.data.stream')
  let streamDesc = streamEntry
    ? decodeHeader(streamEntry, StreamDescriptor)
    : { type: 'unknown' }

  // Find caller's point of view
  let povEntry = findHeader(envelope.headers, 'spl.pov')
  let pov = povEntry ? str(povEntry.value) : null
  let root = pov ? repoRoot(pov) : null

  // Build response headers: original + status context
  let responseHeaders = [
    ...envelope.headers,
    { key: 'spl.status', value: Buffer.from('received') },
    { key: 'spl.log', value: Buffer.from(logFile) }
  ]
  if (root) {
    responseHeaders.push(
      { key: 'spl.root', value: Buffer.from(root) }
    )
  }

  return {
    offset: 0,
    timestamp: Date.now(),
    key: envelope.key,
    value: envelope.value,
    headers: responseHeaders
  }
}

module.exports = { execute, readable, nested }
