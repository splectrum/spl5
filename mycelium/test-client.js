const { Buffer, process } = require('./runtime.js')
const {
  StreamRecord,
  StreamDescriptor,
  ExecuteContext,
  OperatorBag,
  encodeHeader
} = require('./schema.js')
const { execute, nested } = require('./execute.js')

// Inner operator: spl.mycelium.xpath.raw.uri.get
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: '/blog/submissions',
  value: Buffer.alloc(0),
  headers: [
    encodeHeader('spl.data.stream', StreamDescriptor, {
      type: 'spl.mycelium.xpath.raw.uri.get'
    }),
    encodeHeader('spl.mycelium.xpath.raw.uri.get', OperatorBag, {
      args: Buffer.from(JSON.stringify([[{ key: '/blog/submissions' }]]))
    })
  ]
}

// Serialize inner operator — the onion
const innerBytes = StreamRecord.toBuffer(innerOp)

// Execution context wrapping the inner operator
const exec = {
  offset: 0,
  timestamp: Date.now(),
  key: '/blog/submissions',
  value: innerBytes,
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

console.log('--- REQUEST ---')
console.log(JSON.stringify(nested(exec), null, 2))

const response = execute(exec)

console.log('\n--- RESPONSE ---')
console.log(JSON.stringify(nested(response), null, 2))
