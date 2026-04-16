const path = require('bare-path')
const {
  OperatorBag,
  getStreamDescriptor,
  findHeader
} = require('../../../schema.js')

const decoder = new TextDecoder()

function str (val) {
  if (typeof val === 'string') return val
  if (val instanceof Uint8Array) return decoder.decode(val)
  return '' + val
}

// Decode operator args from the descriptor's typed reference
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

// Read execution context — already unpacked by execute handler
function execContext (headers) {
  let entry = findHeader(headers, 'spl.mycelium.process.execute')
  if (!entry) return null
  return entry.value
}

// Resolve a key to an absolute filesystem path
function resolvePath (headers, key) {
  let ctx = execContext(headers)
  if (!ctx || !ctx.root) return null
  let rel = key.startsWith('/') ? key.slice(1) : key
  return path.join(ctx.root.repo, rel)
}

module.exports = { str, decodeArgs, execContext, resolvePath }
