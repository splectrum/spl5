const { Buffer } = require('../../../runtime.js')
const {
  OperatorBag,
  getStreamDescriptor,
  contextHeader
} = require('../../../schema.js')
const { withContext } = require('../../../process/dispatch')

// spl.mycelium.xpath.raw.uri — get/put/remove
//
// Raw URI operators. Stub implementations —
// actual filesystem operations are next step.

const decoder = new TextDecoder()

function str (val) {
  if (typeof val === 'string') return val
  if (val instanceof Uint8Array) return decoder.decode(val)
  return '' + val
}

function decodeArgs (desc) {
  if (!desc || !desc.args) return null
  try {
    let bag = OperatorBag.fromBuffer(desc.args.value)
    if (bag.args) {
      let s = str(bag.args)
      try { return JSON.parse(s) } catch (e) { return s }
    }
    return null
  } catch (e) {
    return null
  }
}

function get (record, dispatch) {
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

function put (record, dispatch) {
  return withContext(record, [
    contextHeader('spl.status', 'completed'),
    contextHeader('spl.op', 'put (stub)')
  ])
}

function remove (record, dispatch) {
  return withContext(record, [
    contextHeader('spl.status', 'completed'),
    contextHeader('spl.op', 'remove (stub)')
  ])
}

module.exports = { get, put, remove }
