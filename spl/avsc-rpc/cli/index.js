const { Buffer, process } = require('spl/mycelium/runtime')
const fs = require('bare-fs')
const net = require('bare-net')
const path = require('bare-path')
const { service } = require('spl/avsc-rpc/protocol')
const {
  StreamRecord,
  OperatorBag,
  ExecuteContext,
  NodeRecord,
  streamHeader,
  encodedHeader,
  findHeader
} = require('spl/mycelium/schema')
const { repoRoot } = require('spl/mycelium/resolve')
const { nested } = require('spl/avsc-rpc/display')

const PORT = 24950

// --- Context Resolution ---

let contextMap = null

function loadContext (repo) {
  if (contextMap) return contextMap
  contextMap = {}
  let file = path.join(repo, '_client', 'context.txt')
  if (!fs.existsSync(file)) return contextMap
  let text = fs.readFileSync(file, 'utf-8')
  for (let line of text.split('\n')) {
    line = line.trim()
    if (!line || line.startsWith('#')) continue
    let parts = line.split(/\s+/)
    if (parts.length >= 2) contextMap[parts[0]] = parts[1]
  }
  return contextMap
}

function resolveSchema (name, repo) {
  let map = loadContext(repo)
  return map[name] || name
}

// --- Response Extraction ---

const decoder = new TextDecoder()

function extractResponse (response) {
  if (!response.value || response.value.length === 0) {
    return { error: null, node: null }
  }

  let inner
  try { inner = StreamRecord.fromBuffer(response.value) }
  catch (e) { return { error: 'cannot decode response', node: null } }

  // Check for errors in inner headers
  let errEntry = findHeader(inner.headers, 'spl.error')
  if (errEntry) {
    let msg = Buffer.isBuffer(errEntry.value)
      ? decoder.decode(errEntry.value)
      : String(errEntry.value)
    return { error: msg, node: null }
  }

  // Decode node record from inner value
  if (!inner.value || inner.value.length === 0) {
    return { error: null, node: null }
  }

  let node
  try { node = NodeRecord.fromBuffer(inner.value) }
  catch (e) { return { error: null, node: null } }

  return { error: null, node }
}

function printNode (node) {
  if (node.type === 'branch') {
    let text = Buffer.isBuffer(node.value.contents)
      ? decoder.decode(node.value.contents)
      : String(node.value.contents)
    console.log(text)
  } else {
    if (node.value.type === 'binary') {
      process.stdout.write(Buffer.from(node.value.contents))
    } else {
      let text = Buffer.isBuffer(node.value.contents)
        ? decoder.decode(node.value.contents)
        : String(node.value.contents)
      console.log(text)
    }
  }
}

// --- Parse Arguments ---
//
// spl [raw|meta] <command> [key] [value] [args...]
//
// raw modifier: raw protocol + suppresses extraction
// meta modifier: metadata protocol + extracted output

const argv = typeof Bare !== 'undefined' ? Bare.argv.slice(2) : []
const modifiers = { raw: true, meta: true }
let modifier = null
let argStart = 0

if (argv[0] && modifiers[argv[0]]) {
  modifier = argv[0]
  argStart = 1
}

const command = argv[argStart]
const key = argv[argStart + 1] || ''
const args = argv.slice(argStart + 2)

if (!command) {
  console.error('usage: spl [modifier] <command> [key] [value] [args...]')
  process.exit(1)
}

const cwd = process.cwd()
const repo = repoRoot(cwd)

if (!repo) {
  console.error('spl: not inside a repository')
  process.exit(1)
}

const local = '/' + path.relative(repo, cwd)
const contextKey = modifier ? modifier + '.' + command : command
const schema = resolveSchema(contextKey, repo)

// Build inner operator
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: Buffer.alloc(0),
  headers: [
    streamHeader(schema),
    encodedHeader(schema, OperatorBag, {
      args: args.length > 1 ? Buffer.from(JSON.stringify(args.slice(1))) : null,
      value: args.length ? Buffer.from(args[0]) : null
    })
  ]
}

// Wrap in execution context
const innerBytes = StreamRecord.toBuffer(innerOp)

const exec = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: innerBytes,
  headers: [
    streamHeader('spl.mycelium.process.execute'),
    encodedHeader('spl.mycelium.process.execute', ExecuteContext, {
      args: null, value: null, mode: 'sync',
      root: { repo, local }
    })
  ]
}

// Connect and send
const client = service.createClient()
const con = net.connect(PORT)

con.on('error', (err) => {
  console.error('spl: server not reachable on port ' + PORT)
  console.error('  ' + err.message)
  console.error('  start with: spl-server')
  process.exit(1)
})

client.createChannel(con, { timeout: 5000 })

client.execute(exec, function (err, response) {
  if (err) {
    console.error('spl: ' + err.message)
    process.exit(1)
  }

  if (modifier === 'raw') {
    console.log(JSON.stringify(nested(response), null, 2))
  } else {
    let { error, node } = extractResponse(response)
    if (error) {
      console.error('spl: ' + error)
      process.exit(1)
    }
    if (node) printNode(node)
  }

  con.end()
})
