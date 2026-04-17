const git = require('git')
const { contextHeader, findHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { operatorValue } = require('spl/mycelium/xpath/raw/uri/helpers')

const EXEC_KEY = 'spl.mycelium.process.execute'

module.exports = function commit (record) {
  let ctx = findHeader(record.headers, EXEC_KEY)
  if (!ctx || !ctx.value || !ctx.value.root) {
    return withContext(record, [
      contextHeader('spl.error', 'git.commit: no execution context')
    ])
  }

  let repo = ctx.value.root.repo
  let message = operatorValue(record.headers)
  if (!message) {
    return withContext(record, [
      contextHeader('spl.error', 'git.commit: no message')
    ])
  }

  let result = git.commit(repo, message.toString())

  if (result.code !== 0) {
    return withContext(record, [
      contextHeader('spl.error', 'git.commit: ' + (result.stderr || result.stdout || 'failed'))
    ])
  }

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
