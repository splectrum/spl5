const fs = require('bare-fs')
const { Buffer } = require('../../../../runtime.js')
const { contextHeader } = require('../../../../schema.js')
const { withContext } = require('../../../../process/dispatch')
const { resolvePath } = require('../helpers.js')

// spl.mycelium.xpath.raw.uri.get
//
// Raw get. Leaf node: file content as bytes.
// Branch node: child node names as bytes.
// No interpretation, no metadata.

module.exports = function get (record) {
  let target = resolvePath(record.headers, record.key)

  if (!target) {
    return withContext(record, [
      contextHeader('spl.error', 'get: no execution context')
    ])
  }

  if (!fs.existsSync(target)) {
    return withContext(record, [
      contextHeader('spl.error', 'get: not found — ' + record.key)
    ])
  }

  let stat = fs.statSync(target)
  let content = stat.isDirectory()
    ? Buffer.from(fs.readdirSync(target).join('\n'))
    : Buffer.from(fs.readFileSync(target))

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
