const { Buffer, process } = require('./runtime.js')
const net = require('bare-net')
const { service } = require('./protocol.js')
const { Message } = require('./schema.js')
const { nested } = require('./execute.js')

const PORT = 24950

// Inner operator: xpath.data.uri.get
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: '/blog/submissions',
  value: Buffer.alloc(0),
  headers: {
    record: {
      schema: 'spl.mycelium.xpath.data.uri.get',
      args: Buffer.from(JSON.stringify([[{ key: '/blog/submissions' }]]))
    },
    context: []
  }
}

// Serialize inner operator — the onion
const innerBytes = Message.toBuffer(innerOp)

// Exec envelope wrapping the inner operator
const exec = {
  offset: 0,
  timestamp: Date.now(),
  key: '/blog/submissions',
  value: innerBytes,
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
  console.error('connection failed — is the server running?')
  console.error(err.message)
})

client.createChannel(con, { timeout: 5000 })

const decode = (buf) => Message.fromBuffer(buf)

console.log('--- REQUEST ---')
console.log(JSON.stringify(nested(exec, decode), null, 2))

client.execute(exec, function (err, response) {
  if (err) {
    console.error('execute failed:', err.message)
    process.exit(1)
  }

  console.log('\n--- RESPONSE ---')
  console.log(JSON.stringify(nested(response, decode), null, 2))

  con.end()
})
