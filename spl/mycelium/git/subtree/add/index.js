const git = require('git')
const { contextHeader, findHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { operatorValue } = require('spl/mycelium/xpath/raw/uri/helpers')

const EXEC_KEY = 'spl.mycelium.process.execute'

module.exports = function add (record) {
  let ctx = findHeader(record.headers, EXEC_KEY)
  if (!ctx || !ctx.value || !ctx.value.root) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.add: no execution context')
    ])
  }

  let repo = ctx.value.root.repo
  let val = operatorValue(record.headers)
  if (!val) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.add: need "prefix remote branch [url]"')
    ])
  }

  let parts = val.toString().split(/\s+/)
  if (parts.length < 3) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.add: need "prefix remote branch [url]"')
    ])
  }

  let result = git.subtrees.add(repo, {
    prefix: parts[0],
    remote: parts[1],
    branch: parts[2],
    url: parts[3] || null
  })

  if (result.error || result.code !== 0) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.add: ' + (result.error || result.stderr || 'failed'))
    ])
  }

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
