const git = require('git')
const { contextHeader, findHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { operatorValue } = require('spl/mycelium/xpath/raw/uri/helpers')

const EXEC_KEY = 'spl.mycelium.process.execute'

module.exports = function add (record) {
  let ctx = findHeader(record.headers, EXEC_KEY)
  if (!ctx || !ctx.value || !ctx.value.root) {
    return withContext(record, [
      contextHeader('spl.error', 'git.add: no execution context')
    ])
  }

  let repo = ctx.value.root.repo
  let paths = operatorValue(record.headers)
  if (!paths) paths = '.'
  else paths = paths.toString()

  let result = git.add(repo, paths.split(/\s+/))

  if (result.code !== 0) {
    return withContext(record, [
      contextHeader('spl.error', 'git.add: ' + (result.stderr || 'failed'))
    ])
  }

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
