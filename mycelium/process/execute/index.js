const { StreamRecord, contextHeader } = require('../../schema.js')
const { dispatch, withContext } = require('../dispatch')

// spl.mycelium.process.execute
//
// Execution context. Peels the onion — deserializes
// value as an inner stream record, dispatches it,
// puts the result back. The orchestration lives here,
// not in the handlers it invokes.

function execute (record) {
  if (!record.value || record.value.length === 0) {
    return withContext(record, [
      contextHeader('spl.error', 'execute: no inner record in value')
    ])
  }

  let inner
  try {
    inner = StreamRecord.fromBuffer(record.value)
  } catch (e) {
    return withContext(record, [
      contextHeader('spl.error', 'execute: value is not a stream record')
    ])
  }

  let result = dispatch(inner)

  return {
    offset: record.offset,
    timestamp: Date.now(),
    key: record.key,
    value: StreamRecord.toBuffer(result),
    headers: [
      ...record.headers,
      contextHeader('spl.status', 'executed')
    ]
  }
}

module.exports = execute
