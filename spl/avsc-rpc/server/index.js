const net = require('bare-net')
const path = require('bare-path')
const fs = require('bare-fs')
const { process } = require('spl/mycelium/runtime')
const { contextHeader } = require('spl/mycelium/schema')
const { service } = require('spl/avsc-rpc/protocol')
const { readable } = require('spl/avsc-rpc/display')
const { dispatch } = require('spl/mycelium/process/dispatch')

// --- Logging ---

function logMessage (dir, msg) {
  fs.mkdirSync(dir, { recursive: true })
  let ts = msg.timestamp
  let seq = 0
  while (fs.existsSync(path.join(dir, `${ts}-${seq}.json`))) seq++
  let file = path.join(dir, `${ts}-${seq}.json`)
  fs.writeFileSync(file, JSON.stringify(readable(msg), null, 2))
  return file
}

// --- RPC Server ---

const PORT = 24950

const server = service.createServer()
  .onExecute(function (envelope, cb) {
    try {
      let logDir = path.join(process.cwd(), '_server', 'log')
      let logFile = logMessage(logDir, envelope)

      let enriched = {
        offset: envelope.offset,
        timestamp: envelope.timestamp,
        key: envelope.key,
        value: envelope.value,
        headers: [
          ...envelope.headers,
          contextHeader('spl.log', logFile)
        ]
      }

      let response = dispatch(enriched)
      cb(null, response)
    } catch (err) {
      cb(err)
    }
  })

net.createServer()
  .on('connection', (con) => {
    con.on('error', () => {})
    server.createChannel(con)
  })
  .listen(PORT, () => {
    console.log('spl server listening on port ' + PORT)
  })
