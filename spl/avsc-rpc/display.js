const { Buffer } = require('../mycelium/runtime.js')
const { StreamRecord } = require('../mycelium/schema.js')

// Human-readable display for stream records.
// Client/debugging concern — not part of the fabric.

const decoder = new TextDecoder()

function str (val) {
  if (typeof val === 'string') return val
  if (val instanceof Uint8Array) return decoder.decode(val)
  return '' + val
}

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
  if (entry.key === 'spl.data.stream') {
    return { key: entry.key, value: readableValue(entry.value) }
  }
  if (entry.value instanceof Uint8Array || Buffer.isBuffer(entry.value)) {
    return { key: entry.key, value: readableValue(entry.value) }
  }
  return { key: entry.key, value: entry.value }
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

function nested (msg) {
  let r = readable(msg)
  if (msg.value && msg.value.length > 0) {
    try { r.value = nested(StreamRecord.fromBuffer(msg.value)) }
    catch (e) { /* value is not a stream record */ }
  }
  return r
}

module.exports = { readable, nested }
