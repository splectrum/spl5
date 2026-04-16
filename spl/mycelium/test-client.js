const { Buffer, process } = require('./runtime.js')
const {
  StreamRecord,
  OperatorBag,
  ExecuteContext,
  streamHeader,
  typedRef,
  encodedHeader
} = require('./schema.js')
const { repoRoot } = require('./resolve.js')
const { dispatch } = require('./process/dispatch')
const { nested } = require('../avsc-rpc/display.js')

const local = process.cwd()
const repo = repoRoot(local)

// Inner operator: spl.mycelium.xpath.raw.uri.get
const innerOp = {
  offset: 0,
  timestamp: Date.now(),
  key: '/blog/submissions',
  value: Buffer.alloc(0),
  headers: [
    streamHeader('spl.mycelium.xpath.raw.uri.get',
      typedRef('spl.data.stream.operator', OperatorBag, {
        args: Buffer.from(JSON.stringify([[{ key: '/blog/submissions' }]])),
        value: null
      })
    )
  ]
}

const innerBytes = StreamRecord.toBuffer(innerOp)

// Execution context wrapping the inner operator
const exec = {
  offset: 0,
  timestamp: Date.now(),
  key: '/blog/submissions',
  value: innerBytes,
  headers: [
    streamHeader('spl.mycelium.process.execute',
      null,
      { type: 'spl.data.stream.record', value: innerBytes }
    ),
    encodedHeader('spl.mycelium.process.execute', ExecuteContext, {
      args: null, value: null, mode: 'sync',
      root: { repo, local }
    })
  ]
}

console.log('--- REQUEST ---')
console.log(JSON.stringify(nested(exec), null, 2))

const response = dispatch(exec)

console.log('\n--- RESPONSE ---')
console.log(JSON.stringify(nested(response), null, 2))
