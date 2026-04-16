const { Buffer, process } = require('spl/mycelium/runtime')
const net = require('bare-net')
const path = require('bare-path')
const { service } = require('spl/avsc-rpc/protocol')
const {
  StreamRecord,
  OperatorBag,
  ExecuteContext,
  streamHeader,
  encodedHeader
} = require('spl/mycelium/schema')
const { repoRoot } = require('spl/mycelium/resolve')
const { nested } = require('spl/avsc-rpc/display')

const PORT = 24950

// Parse command line: spl <schema> [key] [args...]
const argv = typeof Bare !== 'undefined' ? Bare.argv.slice(2) : []
const schema = argv[0]
const key = argv[1] || ''
const args = argv.slice(2)

if (!schema) {
  console.error('usage: spl <schema> [key] [args...]')
  process.exit(1)
}

const cwd = process.cwd()
const repo = repoRoot(cwd)

if (!repo) {
  console.error('spl: not inside a repository')
  process.exit(1)
}

const local = '/' + path.relative(repo, cwd)

// Build inner operator
// args[0] is operator value (input data), rest are operator args
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

// Wrap in execution context — the onion
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

  console.log(JSON.stringify(nested(response), null, 2))
  con.end()
})
