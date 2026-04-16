const fs = require('bare-fs')
const path = require('bare-path')
const { contextHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { resolvePath, operatorValue } = require('spl/mycelium/xpath/raw/uri/helpers')

// spl.mycelium.xpath.raw.put
//
// Schema-aware raw. Full visibility. Filesystem write.

module.exports = function put (record) {
  let target = resolvePath(record.headers, record.key)

  if (!target) {
    return withContext(record, [
      contextHeader('spl.error', 'put: no execution context')
    ])
  }

  let data = operatorValue(record.headers)
  if (!data) {
    return withContext(record, [
      contextHeader('spl.error', 'put: no value to write')
    ])
  }

  let dir = path.dirname(target)
  fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(target, data)

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
