const { Service } = require('avsc-rpc')
const { StreamRecord } = require('./schema.js')

// Single RPC protocol: execute(StreamRecord) → StreamRecord
//
// The RPC server declares one schema: spl.data.stream.record.
// Everything else — stream types, property bags, context —
// lives inside the headers entries as AVRO-encoded bytes.
// Dispatch happens at the handling level, not the transport level.

const service = Service.forProtocol({
  protocol: 'Execute',
  namespace: 'spl.mycelium.process',
  types: [StreamRecord.schema()],
  messages: {
    execute: {
      request: [{ name: 'envelope', type: 'spl.data.stream.record' }],
      response: 'spl.data.stream.record'
    }
  }
})

module.exports = { service }
