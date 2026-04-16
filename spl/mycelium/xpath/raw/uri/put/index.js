const { contextHeader } = require('../../../../schema.js')
const { withContext } = require('../../../../process/dispatch')

// spl.mycelium.xpath.raw.uri.put
// Stub.

module.exports = function put (record) {
  return withContext(record, [
    contextHeader('spl.status', 'completed'),
    contextHeader('spl.op', 'put (stub)')
  ])
}
