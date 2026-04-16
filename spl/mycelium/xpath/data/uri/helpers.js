const { resolvePath, operatorValue, execContext, str } = require('spl/mycelium/xpath/raw/uri/helpers')

// Any segment with underscore prefix makes the path invisible to data protocol
function hasMetaSegment (key) {
  return key.split('/').filter(Boolean).some(s => s.startsWith('_'))
}

// Filter underscore-prefixed entries from branch listing
function filterData (entries) {
  return entries.filter(e => !e.startsWith('_'))
}

module.exports = { resolvePath, operatorValue, execContext, str, hasMetaSegment, filterData }
