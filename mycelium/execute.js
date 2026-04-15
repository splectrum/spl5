const { Buffer, process } = require('./runtime.js')
const fs = require('bare-fs')
const path = require('bare-path')
const { repoRoot } = require('./resolve.js')

const decoder = new TextDecoder()

// Decode Uint8Array or Buffer to string
function str (val) {
  if (typeof val === 'string') return val
  if (val instanceof Uint8Array) return decoder.decode(val)
  return '' + val
}

// Readable log entry — buffers as strings/parsed JSON
function readable (msg) {
  return {
    offset: msg.offset,
    timestamp: msg.timestamp,
    key: msg.key,
    value: msg.value && msg.value.length > 0
      ? { bytes: msg.value.length }
      : null,
    headers: {
      record: {
        schema: msg.headers.record.schema,
        args: msg.headers.record.args
          ? JSON.parse(str(msg.headers.record.args))
          : null
      },
      context: msg.headers.context.map(e => ({
        key: e.key,
        value: str(e.value)
      }))
    }
  }
}

// Nested display — decode value as inner operator
function nested (msg, decode) {
  const r = readable(msg)
  if (msg.value && msg.value.length > 0 && decode) {
    try { r.value = nested(decode(msg.value), decode) }
    catch (e) { /* value is not a message */ }
  }
  return r
}

// Message log — append-only, timestamped files
function logMessage (dir, msg) {
  fs.mkdirSync(dir, { recursive: true })
  const ts = msg.timestamp
  let seq = 0
  while (fs.existsSync(path.join(dir, `${ts}-${seq}.json`))) seq++
  const file = path.join(dir, `${ts}-${seq}.json`)
  fs.writeFileSync(file, JSON.stringify(readable(msg), null, 2))
  return file
}

// Extract a context value by key
function contextValue (envelope, name) {
  let entry = envelope.headers.context.find(e => e.key === name)
  return entry ? str(entry.value) : null
}

// The single operation: execute(envelope) → envelope
// Dispatch reads headers.record.schema.
function execute (envelope) {
  const logDir = path.join(process.cwd(), '_server', 'log')
  const logFile = logMessage(logDir, envelope)

  // Resolve repo root from caller's point of view
  let pov = contextValue(envelope, 'spl.pov')
  let root = pov ? repoRoot(pov) : null

  let ctx = [
    ...envelope.headers.context,
    { key: 'spl.status', value: Buffer.from('received') },
    { key: 'spl.log', value: Buffer.from(logFile) }
  ]
  if (root) {
    ctx.push({ key: 'spl.root', value: Buffer.from(root) })
  }

  return {
    offset: 0,
    timestamp: Date.now(),
    key: envelope.key,
    value: envelope.value,
    headers: {
      record: {
        schema: envelope.headers.record.schema,
        args: envelope.headers.record.args
      },
      context: ctx
    }
  }
}

module.exports = { execute, readable, nested }
