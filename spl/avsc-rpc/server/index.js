const net = require('bare-net')
const path = require('bare-path')
const fs = require('bare-fs')
const { process } = require('../../mycelium/runtime.js')
const { repoRoot } = require('../../mycelium/resolve.js')
const { contextHeader, findHeader } = require('../../mycelium/schema.js')
const { service } = require('../protocol.js')
const { readable } = require('../display.js')
const { dispatch } = require('../../mycelium/process/dispatch')

// --- Logging ---

const decoder = new TextDecoder()
function str (val) {
  if (typeof val === 'string') return val
  if (val instanceof Uint8Array) return decoder.decode(val)
  return '' + val
}

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

      let povEntry = findHeader(envelope.headers, 'spl.pov')
      let pov = povEntry ? str(povEntry.value) : null
      let root = pov ? repoRoot(pov) : null

      let enriched = {
        offset: envelope.offset,
        timestamp: envelope.timestamp,
        key: envelope.key,
        value: envelope.value,
        headers: [
          ...envelope.headers,
          contextHeader('spl.log', logFile),
          ...(root ? [contextHeader('spl.root', root)] : [])
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
