const avro = require('../lib/avsc')

// Kafka record shape — the single message format
//
// Headers is a property bag with AVRO schema assigning
// namespace. Contains:
//   record — operator identification (logicalType + args)
//   context — extensible execution metadata
//
// Value is the data payload. Opaque bytes. Starts empty,
// fills during execution.
//
// Dispatch reads headers.record.schema — the single
// routing key for every message.

const Message = avro.Type.forSchema({
  type: 'record',
  name: 'Message',
  namespace: 'spl.mycelium',
  fields: [
    { name: 'offset', type: 'long', default: 0 },
    { name: 'timestamp', type: 'long' },
    { name: 'key', type: 'string' },
    { name: 'value', type: 'bytes', default: '' },
    {
      name: 'headers',
      type: {
        type: 'record',
        name: 'Headers',
        namespace: 'spl.mycelium.message',
        fields: [
          {
            name: 'record',
            type: {
              type: 'record',
              name: 'Record',
              namespace: 'spl.mycelium.operator',
              fields: [
                { name: 'schema', type: 'string' },
                { name: 'args', type: ['null', 'bytes'], default: null }
              ]
            }
          },
          {
            name: 'context',
            type: {
              type: 'array',
              items: {
                type: 'record',
                name: 'ContextEntry',
                namespace: 'spl.mycelium.message',
                fields: [
                  { name: 'key', type: 'string' },
                  { name: 'value', type: 'bytes' }
                ]
              }
            },
            default: []
          }
        ]
      }
    }
  ]
})

module.exports = { Message }
