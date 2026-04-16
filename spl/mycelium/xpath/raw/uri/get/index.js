const { Buffer } = require('../../../../runtime.js')
const { getStreamDescriptor, contextHeader } = require('../../../../schema.js')
const { decodeArgs } = require('../helpers.js')

// spl.mycelium.xpath.raw.uri.get
// Stub — actual filesystem operations next step.

module.exports = function get (record) {
  let desc = getStreamDescriptor(record.headers)
  let args = decodeArgs(desc)

  return {
    offset: record.offset,
    timestamp: Date.now(),
    key: record.key,
    value: Buffer.from(JSON.stringify({
      op: 'get',
      key: record.key,
      args: args,
      result: 'stub — not yet implemented'
    })),
    headers: [
      ...record.headers,
      contextHeader('spl.status', 'completed')
    ]
  }
}
