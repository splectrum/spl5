const fs = require('bare-fs')
const path = require('bare-path')
const { contextHeader } = require('../../../../schema.js')
const { withContext } = require('../../../../process/dispatch')
const { resolvePath } = require('../helpers.js')

// spl.mycelium.xpath.raw.uri.put
//
// Write raw content to a path. Key is the URI path,
// resolved against repo root. Value carries the data
// to write.

module.exports = function put (record) {
  let target = resolvePath(record.headers, record.key)

  if (!target) {
    return withContext(record, [
      contextHeader('spl.error', 'put: no execution context — cannot resolve path')
    ])
  }

  // Ensure parent directory exists
  let dir = path.dirname(target)
  fs.mkdirSync(dir, { recursive: true })

  // Write content
  fs.writeFileSync(target, record.value)

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
