const { Buffer } = require('../../runtime.js')
const { getStreamDescriptor, contextHeader } = require('../../schema.js')

// spl.mycelium.process.dispatch
//
// Handler registry + dispatch. Read the stream
// descriptor, route to the handler. Handlers receive
// dispatch as a parameter for recursion.

const handlers = {}

function register (streamType, handler) {
  handlers[streamType] = handler
}

function dispatch (record) {
  let desc = getStreamDescriptor(record.headers)
  if (!desc) {
    return withContext(record, [
      contextHeader('spl.error', 'no spl.data.stream descriptor')
    ])
  }

  let handler = handlers[desc.type]
  if (!handler) {
    return withContext(record, [
      contextHeader('spl.error', 'no handler for ' + desc.type)
    ])
  }

  return handler(record, dispatch)
}

function withContext (record, extra) {
  return {
    offset: record.offset,
    timestamp: Date.now(),
    key: record.key,
    value: record.value,
    headers: [...record.headers, ...extra]
  }
}

module.exports = { dispatch, register, withContext }
