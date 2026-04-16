const fs = require('bare-fs')
const { Buffer } = require('../../../../runtime.js')
const { getStreamDescriptor, contextHeader } = require('../../../../schema.js')
const { withContext } = require('../../../../process/dispatch')
const { resolvePath } = require('../helpers.js')

// spl.mycelium.xpath.raw.uri.get
//
// Read raw content at a path. Key is the URI path,
// resolved against repo root from execution context.
// Value fills with the file content on success.

module.exports = function get (record) {
  let target = resolvePath(record.headers, record.key)

  if (!target) {
    return withContext(record, [
      contextHeader('spl.error', 'get: no execution context — cannot resolve path')
    ])
  }

  if (!fs.existsSync(target)) {
    return withContext(record, [
      contextHeader('spl.error', 'get: not found — ' + record.key)
    ])
  }

  let stat = fs.statSync(target)

  if (stat.isDirectory()) {
    // List directory entries
    let entries = fs.readdirSync(target)
    return {
      offset: record.offset,
      timestamp: Date.now(),
      key: record.key,
      value: Buffer.from(JSON.stringify(entries)),
      headers: [
        ...record.headers,
        contextHeader('spl.status', 'completed'),
        contextHeader('spl.content.type', 'directory')
      ]
    }
  }

  // Read file
  let content = fs.readFileSync(target)
  return {
    offset: record.offset,
    timestamp: Date.now(),
    key: record.key,
    value: Buffer.from(content),
    headers: [
      ...record.headers,
      contextHeader('spl.status', 'completed'),
      contextHeader('spl.content.type', 'file')
    ]
  }
}
