const { contextHeader } = require('../../../../schema.js')
const { withContext } = require('../../../../process/dispatch')

// spl.mycelium.xpath.raw.uri.remove
// Stub.

module.exports = function remove (record) {
  return withContext(record, [
    contextHeader('spl.status', 'completed'),
    contextHeader('spl.op', 'remove (stub)')
  ])
}
