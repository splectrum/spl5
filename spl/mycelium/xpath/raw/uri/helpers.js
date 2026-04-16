const {
  OperatorBag,
  getStreamDescriptor
} = require('../../../schema.js')

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

module.exports = { str, decodeArgs }
