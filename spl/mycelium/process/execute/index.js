const { StreamRecord, ExecuteContext, contextHeader, findHeader } = require('../../schema.js')
const { dispatch, withContext } = require('../dispatch')

// spl.mycelium.process.execute
//
// Execution context. Peels the onion, unpacks the
// execution context, dispatches the inner record,
// packs the result back for the boundary.
//
// Inside the process, header values are plain objects.
// Packing happens at boundary crossings only.

const EXEC_KEY = 'spl.mycelium.process.execute'

function execute (record) {
  if (!record.value || record.value.length === 0) {
    return withContext(record, [
      contextHeader('spl.error', 'execute: no inner record in value')
    ])
  }

  // Peel: deserialise inner record from value
  let inner
  try {
    inner = StreamRecord.fromBuffer(record.value)
  } catch (e) {
    return withContext(record, [
      contextHeader('spl.error', 'execute: value is not a stream record')
    ])
  }

  // Unpack execution context
  let execEntry = findHeader(record.headers, EXEC_KEY)
  let ctx = null
  if (execEntry) {
    try { ctx = ExecuteContext.fromBuffer(execEntry.value) }
    catch (e) { /* already unpacked or invalid */ }
    if (!ctx && typeof execEntry.value === 'object') ctx = execEntry.value
  }

  // Propagate unpacked context to inner record
  if (ctx) {
    inner = {
      offset: inner.offset,
      timestamp: inner.timestamp,
      key: inner.key,
      value: inner.value,
      headers: [...inner.headers, { key: EXEC_KEY, value: ctx }]
    }
  }

  let result = dispatch(inner)

  // Pack result back for the boundary (into value)
  // Re-encode the execute context in result headers
  let resultHeaders = result.headers.map(h => {
    if (h.key === EXEC_KEY && typeof h.value === 'object' && !Buffer.isBuffer(h.value)) {
      return { key: h.key, value: ExecuteContext.toBuffer(h.value) }
    }
    return h
  })

  return {
    offset: record.offset,
    timestamp: Date.now(),
    key: record.key,
    value: StreamRecord.toBuffer({
      offset: result.offset,
      timestamp: result.timestamp,
      key: result.key,
      value: result.value,
      headers: resultHeaders
    }),
    headers: [
      ...record.headers,
      contextHeader('spl.status', 'executed')
    ]
  }
}

module.exports = execute
