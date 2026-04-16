const { StreamRecord, contextHeader, findHeader } = require('../../schema.js')
const { dispatch, withContext } = require('../dispatch')

// spl.mycelium.process.execute
//
// Execution context. Peels the onion — deserializes
// value as an inner stream record, copies execution
// context into its headers, dispatches it, puts the
// result back.

const EXEC_KEY = 'spl.mycelium.process.execute'

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

  // Propagate execution context to inner record
  let execEntry = findHeader(record.headers, EXEC_KEY)
  if (execEntry) {
    inner = {
      offset: inner.offset,
      timestamp: inner.timestamp,
      key: inner.key,
      value: inner.value,
      headers: [...inner.headers, execEntry]
    }
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
