const { Message } = require('./schema.js')
const { execute, nested } = require('./execute.js')

// Inner operator: xpath.data.uri.get
const innerOp = {
  timestamp: Date.now(),
  key: '/blog/submissions',
  headers: {
    record: {
      schema: 'spl.mycelium.xpath.data.uri.get',
      args: Buffer.from(JSON.stringify([[{ key: '/blog/submissions' }]]))
    }
  }
}

// Serialize inner operator — the onion
const innerBytes = Message.toBuffer(innerOp)

// Exec envelope wrapping the inner operator
const exec = {
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

const decode = (buf) => Message.fromBuffer(buf)

console.log('--- REQUEST ---')
console.log(JSON.stringify(nested(exec, decode), null, 2))

const response = execute(exec)

console.log('\n--- RESPONSE ---')
console.log(JSON.stringify(nested(response, decode), null, 2))
