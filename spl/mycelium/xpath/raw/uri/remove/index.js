const fs = require('bare-fs')
const { Buffer } = require('../../../../runtime.js')
const { contextHeader } = require('../../../../schema.js')
const { withContext } = require('../../../../process/dispatch')
const { resolvePath } = require('../helpers.js')

// spl.mycelium.xpath.raw.uri.remove
//
// Remove content at a path. Key is the URI path,
// resolved against repo root. Value fills with the
// removed content on success.

module.exports = function remove (record) {
  let target = resolvePath(record.headers, record.key)

  if (!target) {
    return withContext(record, [
      contextHeader('spl.error', 'remove: no execution context — cannot resolve path')
    ])
  }

  if (!fs.existsSync(target)) {
    return withContext(record, [
      contextHeader('spl.error', 'remove: not found — ' + record.key)
    ])
  }

  // Read before removing
  let stat = fs.statSync(target)
  let content = Buffer.alloc(0)

  if (stat.isFile()) {
    content = fs.readFileSync(target)
    fs.unlinkSync(target)
  } else if (stat.isDirectory()) {
    let entries = fs.readdirSync(target)
    content = Buffer.from(JSON.stringify(entries))
    fs.rmdirSync(target, { recursive: true })
  }

  return {
    offset: record.offset,
    timestamp: Date.now(),
    key: record.key,
    value: content,
    headers: [
      ...record.headers,
      contextHeader('spl.status', 'completed')
    ]
  }
}
