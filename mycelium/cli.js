const { Buffer, process } = require('./runtime.js')
const net = require('bare-net')
const { service } = require('./protocol.js')
const {
  StreamRecord,
  StreamDescriptor,
  ExecuteContext,
  OperatorBag,
  encodeHeader
} = require('./schema.js')
const { nested } = require('./execute.js')

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

// Build inner operator — the operation being executed
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: Buffer.alloc(0),
  headers: [
    encodeHeader('spl.data.stream', StreamDescriptor, { type: schema }),
    encodeHeader(schema, OperatorBag, {
      args: args.length ? Buffer.from(JSON.stringify(args)) : null
    })
  ]
}

// Wrap in execution context — the onion
const exec = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: StreamRecord.toBuffer(innerOp),
  headers: [
    encodeHeader('spl.data.stream', StreamDescriptor, {
      type: 'spl.mycelium.process.execute'
    }),
    encodeHeader('spl.mycelium.process.execute', ExecuteContext, {
      mode: 'sync'
    }),
    { key: 'spl.pov', value: Buffer.from(process.cwd()) }
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
