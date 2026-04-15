if (typeof Bare !== 'undefined') require('bare-node-runtime/global')
const avro = require('avsc', typeof Bare !== 'undefined'
  ? { with: { imports: 'bare-node-runtime/imports' } }
  : undefined
)
const { Message } = require('./schema.js')

// Single RPC protocol: execute(Message) → Message
// One code path for every message. Dispatch reads
// headers.record.schema.
const service = avro.Service.forProtocol({
  protocol: 'Execute',
  namespace: 'spl.mycelium.process',
  types: [Message.schema()],
  messages: {
    execute: {
      request: [{ name: 'envelope', type: 'spl.mycelium.Message' }],
      response: 'spl.mycelium.Message'
    }
  }
})

module.exports = { service }
