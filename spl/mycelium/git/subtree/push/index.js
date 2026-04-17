const git = require('git')
const { contextHeader, findHeader } = require('spl/mycelium/schema')
const { withContext } = require('spl/mycelium/process/dispatch')
const { operatorValue } = require('spl/mycelium/xpath/raw/uri/helpers')

const EXEC_KEY = 'spl.mycelium.process.execute'

module.exports = function push (record) {
  let ctx = findHeader(record.headers, EXEC_KEY)
  if (!ctx || !ctx.value || !ctx.value.root) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.push: no execution context')
    ])
  }

  let repo = ctx.value.root.repo
  let reality = git.detectReality(repo, ctx.value.root.local)

  let prefix
  if (reality.mode === 'subtree') {
    prefix = reality.prefix
  } else {
    let val = operatorValue(record.headers)
    if (!val) {
      return withContext(record, [
        contextHeader('spl.error', 'git.subtree.push: specify prefix or invoke from subtree')
      ])
    }
    prefix = val.toString()
  }

  let result = git.subtrees.push(repo, prefix)

  if (result.error || result.code !== 0) {
    return withContext(record, [
      contextHeader('spl.error', 'git.subtree.push: ' + (result.error || result.stderr || 'failed'))
    ])
  }

  return withContext(record, [
    contextHeader('spl.status', 'completed')
  ])
}
