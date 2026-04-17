const git = require('git')
const { contextHeader, findHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { operatorValue } = require('spl/mycelium/xpath/raw/uri/helpers')

const EXEC_KEY = 'spl.mycelium.process.execute'

module.exports = function register (record) {
  let ctx = findHeader(record.headers, EXEC_KEY)
  if (!ctx || !ctx.value || !ctx.value.root) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.register: no execution context')
    ])
  }

  let repo = ctx.value.root.repo
  let val = operatorValue(record.headers)
  if (!val) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.register: need "prefix remote branch"')
    ])
  }

  let parts = val.toString().split(/\s+/)
  if (parts.length < 3) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.register: need "prefix remote branch"')
    ])
  }

  git.subtrees.register(repo, {
    prefix: parts[0],
    remote: parts[1],
    branch: parts[2]
  })

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
