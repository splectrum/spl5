const avro = require('avsc')

// --- The Common Record Schema ---
//
// spl.data.stream.record — the Kafka record shape.
// Every stream record has this schema. Declared once
// to the RPC protocol. Headers is an open key-value
// list — each entry identified by namespace key,
// data encoded per that key's schema.

const StreamRecord = avro.Type.forSchema({
  type: 'record',
  name: 'record',
  namespace: 'spl.data.stream',
  fields: [
    { name: 'offset', type: 'long', default: 0 },
    { name: 'timestamp', type: 'long' },
    { name: 'key', type: 'string' },
    { name: 'value', type: 'bytes', default: '' },
    {
      name: 'headers',
      type: {
        type: 'array',
        items: {
          type: 'record',
          name: 'header',
          namespace: 'spl.data.stream',
          fields: [
            { name: 'key', type: 'string' },
            { name: 'value', type: 'bytes' }
          ]
        }
      },
      default: []
    }
  ]
})

// --- Stream Descriptor Schema ---
//
// spl.data.stream — the base header descriptor.
// Always present in headers. The minimum to get
// record handling started: the stream type.

const StreamDescriptor = avro.Type.forSchema({
  type: 'record',
  name: 'descriptor',
  namespace: 'spl.data.stream',
  fields: [
    { name: 'type', type: 'string' }
  ]
})

// --- Stream Type Schemas ---
//
// Each stream type has a property bag schema.
// The stream type name is the key in headers.
// The schema defines the property bag structure.
// Multiple stream type names can alias to the
// same schema.

// spl.mycelium.process.execute — execution context.
// Wraps an operation. Value contains the inner
// stream record.
const ExecuteContext = avro.Type.forSchema({
  type: 'record',
  name: 'execute',
  namespace: 'spl.mycelium.process',
  fields: [
    { name: 'mode', type: 'string', default: 'sync' }
  ]
})

// Base operator schema — the method signature pattern.
// args in, value out. Used by operator stream types.
// Multiple operator type names alias to this schema.
const OperatorBag = avro.Type.forSchema({
  type: 'record',
  name: 'operator',
  namespace: 'spl.data.stream',
  fields: [
    { name: 'args', type: ['null', 'bytes'], default: null }
  ]
})

// --- Header Helpers ---
//
// Encode a (key, typed value) into a header entry.
// Decode a header entry given the schema for its key.

function encodeHeader (key, type, value) {
  return { key, value: type.toBuffer(value) }
}

function decodeHeader (entry, type) {
  return type.fromBuffer(entry.value)
}

// Find a header entry by key
function findHeader (headers, key) {
  return headers.find(h => h.key === key)
}

// List all header keys
function headerKeys (headers) {
  return headers.map(h => h.key)
}

module.exports = {
  StreamRecord,
  StreamDescriptor,
  ExecuteContext,
  OperatorBag,
  encodeHeader,
  decodeHeader,
  findHeader,
  headerKeys
}
