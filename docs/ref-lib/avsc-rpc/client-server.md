[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc-rpc](./) > Client and Server

# avsc-rpc Client and Server

Creating RPC endpoints, registering handlers, and
making calls.

---

## Server

A server binds handlers to protocol messages. Each
handler receives a typed request and returns a typed
response through the schema contract.

```javascript
const server = service.createServer()
```

### Registering Handlers

Handler method names are generated from message names
with capitalised first letter:

```javascript
// For message 'exec':
server.onExec((message, cb) => {
  // message is the decoded request (typed by schema)
  // cb(err, response) — response typed by schema
  cb(null, responseMessage)
})
```

To suppress capitalisation:

```javascript
const server = service.createServer({ noCapitalize: true })
server.on_exec((message, cb) => { ... })
```

### Default Handler

Catch-all for unmapped messages:

```javascript
const server = service.createServer({
  defaultHandler (wreq, wres, next) {
    wres.error = 'not implemented'
    next()
  }
})
```

### Server Options

| Option | Default | Description |
|--------|---------|-------------|
| `silent` | `false` | Suppress error logging |
| `strictTypes` | `false` | Strict error type coercion |
| `defaultHandler` | — | Handler for unmapped messages |
| `noCapitalize` | `false` | Preserve message name casing |
| `remoteProtocols` | — | Pre-populate protocol cache |

## Client

A client emits typed messages to a remote server.
Methods are generated from the protocol's message
definitions.

```javascript
const client = service.createClient()
```

### Making Calls

Generated methods match message names:

```javascript
// For message 'exec':
client.exec(message, (err, response) => {
  // err is typed by the error schema
  // response is typed by the response schema
})
```

With options:

```javascript
client.exec(message, { timeout: 5000 }, (err, response) => {
  ...
})
```

### Lower-Level Call

```javascript
client.emitMessage('exec', request, opts, (err, response) => {
  ...
})
```

### Client Options

| Option | Default | Description |
|--------|---------|-------------|
| `server` | — | In-memory server (auto-connects) |
| `transport` | — | Transport stream (auto-creates channel) |
| `buffering` | `false` | Buffer calls before channel ready |
| `timeout` | `10000` | Message timeout in ms |
| `strictTypes` | `false` | Strict error type coercion |
| `channelPolicy` | — | Custom channel selection |
| `remoteProtocols` | — | Pre-populate protocol cache |

## In-Memory Connection

The simplest pattern — client and server in the same
process, no serialization overhead:

```javascript
const server = service.createServer()
server.onExec((message, cb) => {
  cb(null, response)
})

const client = service.createClient({ server })
client.exec(message, (err, res) => { ... })
```

This is the pattern used for testing and for
subject-internal operations where processes
communicate within the same runtime. The RPC boundary
is still enforced — messages are validated against the
schema contract. Only the transport is eliminated.

## Channel Lifecycle

Both client and server expose channel management:

```javascript
// Create a channel on a transport
client.createChannel(transport, opts)
server.createChannel(transport, opts)

// List active channels
client.activeChannels()
server.activeChannels()

// Destroy all channels
client.destroyChannels()
```

Channels are created per-transport. A client may have
multiple channels to different servers. A server may
serve multiple clients simultaneously.

### Events

**Client channels:**
- `'handshake'` — protocol negotiation complete
- `'outgoingCall'` — message sent
- `'eot'` — end of transmission
- `'error'` — channel error

**Server channels:**
- `'handshake'` — protocol negotiation complete
- `'incomingCall'` — message received
- `'eot'` — end of transmission
- `'error'` — channel error

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
