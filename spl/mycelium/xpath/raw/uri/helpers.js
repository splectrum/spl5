const path = require('bare-path')
const { Buffer } = require('spl/mycelium/runtime')
const {
  OperatorBag,
  getStreamDescriptor,
  findHeader
} = require('spl/mycelium/schema')

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

// Read operator bag value from headers
function operatorValue (headers) {
  let desc = getStreamDescriptor(headers)
  if (!desc) return null
  let entry = findHeader(headers, desc.type)
  if (!entry) return null
  let bag = entry.value
  if (Buffer.isBuffer(bag) || bag instanceof Uint8Array) {
    try { bag = OperatorBag.fromBuffer(bag) } catch (e) { return null }
  }
  return bag.value || null
}

// Read execution context — already unpacked by execute handler
function execContext (headers) {
  let entry = findHeader(headers, 'spl.mycelium.process.execute')
  if (!entry) return null
  return entry.value
}

// Resolve a key to an absolute filesystem path.
// Key is relative to local root. / = local root.
// local root is relative to repo root. / = repo root.
// Always forward — never above repo root.
function resolvePath (headers, key) {
  let ctx = execContext(headers)
  if (!ctx || !ctx.root) return null
  let localRel = ctx.root.local.startsWith('/') ? ctx.root.local.slice(1) : ctx.root.local
  let keyRel = key.startsWith('/') ? key.slice(1) : key
  let resolved = path.join(ctx.root.repo, localRel, keyRel)
  // Never escape repo root
  if (!resolved.startsWith(ctx.root.repo)) return null
  return resolved
}

module.exports = { str, decodeArgs, operatorValue, execContext, resolvePath }
