const fs = require('bare-fs')
const path = require('bare-path')
const { contextHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { resolvePath, operatorValue, hasMetaSegment, isMetaName } = require('spl/mycelium/xpath/metadata/uri/helpers')

// spl.mycelium.xpath.metadata.put
//
// Schema-aware metadata. Only write to metadata paths.

module.exports = function put (record) {
  if (!hasMetaSegment(record.key) && !isMetaName(record.key)) {
    return withContext(record, [
      contextHeader('spl.error', 'put: not a metadata path — ' + record.key)
    ])
  }

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
