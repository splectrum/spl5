const { Buffer, process } = require('../../mycelium/runtime.js')
const net = require('bare-net')
const { service } = require('../protocol.js')
const {
  StreamRecord,
  OperatorBag,
  ExecuteContext,
  streamHeader,
  typedRef,
  encodedHeader
} = require('../../mycelium/schema.js')
const { repoRoot } = require('../../mycelium/resolve.js')
const { nested } = require('../display.js')

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

// Resolve roots on the client side
const local = process.cwd()
const repo = repoRoot(local)

if (!repo) {
  console.error('spl: not inside a repository')
  process.exit(1)
}

// Build inner operator
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: Buffer.alloc(0),
  headers: [
    streamHeader(schema,
      typedRef('spl.data.stream.operator', OperatorBag, {
        args: args.length ? Buffer.from(JSON.stringify(args)) : null,
        value: null
      })
    )
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
    // Base descriptor — dispatch info
    streamHeader('spl.mycelium.process.execute',
      null,
      { type: 'spl.data.stream.record', value: innerBytes }
    ),
    // Type-specific — execution context properties
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
