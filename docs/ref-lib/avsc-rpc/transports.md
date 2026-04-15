[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc-rpc](./) > Transports

# avsc-rpc Transports

How RPC messages move between client and server. The
transport is a deployment concern — the schema contract
is invariant.

---

## Transport Model

avsc-rpc separates the protocol boundary (schema
contract, handshake, message encoding) from the
transport (how bytes move). Handler code is
transport-agnostic. The same service definition works
across all transports.

Two categories:

- **Stateful** — persistent connection, single
  handshake, multiplexed messages. TCP, in-memory.
- **Stateless** — handshake per request, one
  message per connection. HTTP.

## In-Memory

Direct object passing between client and server in
the same process. No serialization, no framing.

```javascript
const client = service.createClient({ server })
```

Or explicitly:

```javascript
const client = service.createClient()
client.createChannel(server.createChannel, {
  objectMode: true
})
```

Used for testing and subject-internal communication.
The RPC boundary is enforced — schema validation
happens — but there is no wire encoding.

## TCP (Stateful)

Persistent connection with a single handshake and
multiplexed messages. The natural transport for
inter-process communication.

```javascript
const net = require('bare-net')

// Server
const tcpServer = net.createServer((socket) => {
  server.createChannel(socket)
})
tcpServer.listen(8090)

// Client
const socket = net.connect(8090)
client.createChannel(socket)
```

The socket is both readable and writable — avsc-rpc
uses it as a duplex transport. Messages are
multiplexed with ID headers so responses match
requests.

### Reconnection

TCP channels do not auto-reconnect. When a connection
drops, the channel emits `'eot'` and is destroyed.
Create a new channel on a new socket.

```javascript
function connect () {
  const socket = net.connect(8090)
  const channel = client.createChannel(socket)
  channel.on('eot', () => {
    // Reconnect after delay
    setTimeout(connect, 1000)
  })
}
```

## HTTP (Stateless)

Request-response pattern. Each message is a complete
interaction — handshake, request, response.

```javascript
client.createChannel((cb) => {
  // cb(err, readable) when response arrives
  const req = http.request(opts, (res) => cb(null, res))
  cb(null, req)  // return writable for request
})
```

The factory function is called for each message.
Suitable for HTTP servers, serverless functions, or
any request-response protocol.

## Channel Options

| Option | Default | Description |
|--------|---------|-------------|
| `objectMode` | `false` | `true`: object passing. `false`: binary framing |
| `noPing` | `false` | Skip initial handshake ping |
| `timeout` | `10000` | Per-channel timeout in ms |
| `endWritable` | `true` | End writable after stateless request |
| `scope` | — | Message ID scoping |
| `serverHash` | — | Pre-populate protocol adapter |

### objectMode

When `true`, messages pass as JavaScript objects —
no serialization. Used for in-memory transports.

When `false` (default), messages are serialized using
Avro binary encoding with wire framing. Two framing
formats are available (see
[Wire Protocol](wire-protocol.md)):

- **Standard** (FrameEncoder/FrameDecoder) — Avro
  specification framing
- **Netty** (NettyEncoder/NettyDecoder) — Java
  Netty-compatible framing, used by default for
  stateful binary channels

## Transport Summary

| Transport | Type | Framing | Multiplexing | Use Case |
|-----------|------|---------|--------------|----------|
| In-memory | Stateful | None (objects) | Yes | Testing, IPC |
| TCP | Stateful | Netty | Yes | Inter-process |
| HTTP | Stateless | Frame | No | Request-response |
| Custom | Either | Configurable | Configurable | Special protocols |

## Custom Transports

Any duplex stream (or pair of readable/writable
streams) can serve as a transport:

```javascript
// Duplex stream
client.createChannel(duplexStream)

// Separate readable/writable
client.createChannel({
  readable: inputStream,
  writable: outputStream
})
```

The transport only needs to deliver bytes reliably.
avsc-rpc handles framing, handshake, multiplexing,
and timeout.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
