[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc-rpc](./) > Wire Protocol

# avsc-rpc Wire Protocol

Handshake, framing, and protocol negotiation — how
bytes are structured on the wire.

---

## Handshake

Every new connection (stateful) or every message
(stateless) begins with a handshake. The handshake
determines whether client and server share a protocol.

### Handshake Request

```
{
  clientHash: bytes(16),     — MD5 of client protocol
  clientProtocol: null|string, — full protocol (if needed)
  serverHash: bytes(16),     — expected server protocol hash
  meta: null|map<bytes>      — optional metadata
}
```

### Handshake Response

```
{
  match: enum { BOTH, CLIENT, NONE },
  serverProtocol: null|string, — full protocol (if mismatch)
  serverHash: null|bytes(16),  — server's actual hash
  meta: null|map<bytes>        — optional metadata
}
```

### Resolution

- **BOTH** — client and server protocols match.
  Proceed directly.
- **CLIENT** — server recognises client's protocol
  but client doesn't know server's. Server sends its
  protocol. Client caches it.
- **NONE** — neither recognises the other. Both
  protocols exchanged. Both cache.

After resolution, client and server create an
Adapter — a resolver that maps between the two
protocol versions using Avro's type resolution.
Subsequent messages use the adapter.

This is schema evolution applied to the protocol
level. A client with an older protocol version can
communicate with a newer server if the types are
compatible.

## Framing

Two framing formats are available for binary
transports:

### Standard Frame Encoding

Avro specification framing. Messages are split into
frames, each prefixed with its byte length.

```
[frameLength: 4 bytes, big-endian] [payload: N bytes]
[frameLength: 4 bytes, big-endian] [payload: N bytes]
...
[0x00 0x00 0x00 0x00]  — zero-length frame terminates
```

Used by `FrameEncoder` and `FrameDecoder`.

### Netty Encoding

Java Netty-compatible framing. Default for stateful
binary channels. Interoperates with JVM Avro RPC
implementations.

```
[messageID: 4 bytes] [frameCount: 4 bytes]
[frameLength: 4 bytes] [payload: N bytes]
[frameLength: 4 bytes] [payload: N bytes]
...
```

The message ID enables multiplexing — responses are
matched to requests by ID. Used by `NettyEncoder` and
`NettyDecoder`.

### Stream Classes

All four are streamx.Transform instances:

```javascript
const { streams } = require('avsc-rpc')

// Standard
const enc = new streams.FrameEncoder()
const dec = new streams.FrameDecoder()

// Netty
const enc = new streams.NettyEncoder()
const dec = new streams.NettyDecoder()
```

## Message Wire Format

A single RPC message on the wire:

### Request

```
[handshake request (first message only, stateful)]
[message metadata: map<bytes>]
[method name: string]
[request body: Avro-encoded by message.requestType]
```

### Response

```
[handshake response (first message only, stateful)]
[message metadata: map<bytes>]
[boolean: is-error flag]
[body: Avro-encoded by message.responseType or errorType]
```

The metadata map in each message is distinct from the
handshake metadata. It carries per-message context —
the wire-level equivalent of mycelium's context
entries.

## Multiplexing

Stateful channels multiplex messages over a single
connection using message IDs (4-byte prefix in Netty
encoding). Multiple concurrent requests share one TCP
socket.

The Registry class tracks pending callbacks by ID.
When a response arrives, the ID matches it to the
original request's callback.

```javascript
// Internal — not normally used directly
const registry = new Registry()
const id = registry.add(callback)
// ... later ...
registry.get(id)(err, response)
```

## Protocol Discovery

Discover a remote server's protocol without knowing
it in advance:

```javascript
const { discoverProtocol } = require('avsc-rpc')

discoverProtocol(transport, (err, protocol) => {
  // protocol is the server's Avro protocol definition
  const service = Service.forProtocol(protocol)
  const client = service.createClient()
  client.createChannel(transport)
})
```

Sends a handshake with an intentionally wrong hash.
The server responds with its full protocol. The
client now knows what the server speaks.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
