const net = require('bare-net')
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
  .on('connection', (con) => {
    con.on('error', () => {}) // suppress connection close errors
    server.createChannel(con)
  })
  .listen(PORT, () => {
    console.log('spl server listening on port ' + PORT)
  })
