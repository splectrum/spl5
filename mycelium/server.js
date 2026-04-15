const net = require('net')
const { service } = require('./protocol.js')
const { execute } = require('./execute.js')

const PORT = 24950

// RPC server — one handler for every message
const server = service.createServer()
  .onExecute(function (envelope, cb) {
    try {
      const response = execute(envelope)
      cb(null, response)
    } catch (err) {
      cb(err)
    }
  })

// TCP transport
net.createServer()
  .on('connection', (con) => { server.createChannel(con) })
  .listen(PORT, () => {
    console.log('spl server listening on port ' + PORT)
  })
