const { Buffer, process } = require('./runtime.js')
const net = require('bare-net')
const { service } = require('./protocol.js')
const { Message } = require('./schema.js')
const { nested } = require('./execute.js')

const PORT = 24950

// Parse command line: spl <schema> [key] [args...]
// Bare.argv: [bare_binary, script_path, ...user_args]
const argv = typeof Bare !== 'undefined' ? Bare.argv.slice(2) : []
const schema = argv[0]
const key = argv[1] || ''
const args = argv.slice(2)

if (!schema) {
  console.error('usage: spl <schema> [key] [args...]')
  process.exit(1)
}

// Build inner operator from command line
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: Buffer.alloc(0),
  headers: {
    record: {
      schema: schema,
      args: args.length ? Buffer.from(JSON.stringify(args)) : null
    },
    context: []
  }
}

// Wrap in exec envelope — the onion
const exec = {
  offset: 0,
  timestamp: Date.now(),
  key: key,
  value: Message.toBuffer(innerOp),
  headers: {
    record: {
      schema: 'spl.mycelium.process.execute.exec',
      args: Buffer.from(JSON.stringify({ mode: 'sync' }))
    },
    context: [
      { key: 'spl.pov', value: Buffer.from(process.cwd()) }
    ]
  }
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

const decode = (buf) => Message.fromBuffer(buf)

client.execute(exec, function (err, response) {
  if (err) {
    console.error('spl: ' + err.message)
    process.exit(1)
  }

  console.log(JSON.stringify(nested(response, decode), null, 2))
  con.end()
})
