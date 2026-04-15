[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc-rpc](./) > Service Definition

# avsc-rpc Service Definition

How protocols become services — the bridge from schema
to executable boundary.

---

## Service.forProtocol

The primary entry point. Takes an Avro protocol and
returns a Service instance that can create clients and
servers.

```javascript
const { Service } = require('avsc-rpc')

const service = Service.forProtocol({
  protocol: 'ExecutionService',
  namespace: 'spl.mycelium.process.execute',
  messages: {
    exec: {
      request: [{ name: 'message', type: 'Message' }],
      response: 'Message'
    }
  },
  types: [
    // Type definitions used by messages
  ]
})
```

The protocol defines the contract. The service
enforces it. Every message that crosses the boundary
is validated against the protocol's type definitions.

### Options

| Option | Description |
|--------|-------------|
| `strictTypes` | Strict error type coercion |

## Protocol Structure

A protocol is an Avro protocol definition — types and
messages scoped under a name and namespace.

```javascript
{
  protocol: 'Name',           // service name
  namespace: 'spl.mycelium',  // Avro namespace
  types: [ ... ],             // shared type definitions
  messages: {
    methodName: {
      request: [ ... ],       // argument fields
      response: 'TypeName',   // return type
      errors: [ ... ],        // error types (optional)
      'one-way': false        // fire-and-forget (optional)
    }
  }
}
```

## Messages

Each message in the protocol becomes a typed RPC
method. The Message class holds the Avro types for
request, response, and errors.

```javascript
const msg = service.message('exec')
msg.name          // 'exec'
msg.requestType   // Avro RecordType for request args
msg.responseType  // Avro Type for response
msg.errorType     // Avro UnionType for errors
msg.oneWay        // boolean
```

## Service Methods

| Method | Description |
|--------|-------------|
| `Service.forProtocol(ptcl, opts)` | Create service from protocol |
| `Service.compatible(client, server)` | Check protocol compatibility |
| `Service.isService(any)` | Type check |
| `service.createClient(opts)` | Create RPC client |
| `service.createServer(opts)` | Create RPC server |
| `service.message(name)` | Get message by name |
| `service.type(name)` | Get type by name |
| `service.hash` | Protocol fingerprint |
| `service.name` | Qualified service name |
| `service.protocol` | Protocol schema object |
| `service.types` | Frozen array of types |
| `service.messages` | Frozen array of messages |

## Protocol Hash

The service hash is the MD5 fingerprint of the
protocol's canonical representation. Used during the
RPC handshake — client and server compare hashes to
determine if they share a protocol before exchanging
messages.

```javascript
service.hash  // Buffer — 16-byte MD5
```

If hashes match, the handshake succeeds immediately.
If not, the server sends its protocol to the client
for resolution. This is Avro's native protocol
negotiation — no external registry.

## Compatibility Check

```javascript
Service.compatible(clientService, serverService)
// true if client's protocol can communicate with server's
```

Uses Avro's type resolution rules — the same
mechanism as schema evolution. A client with fewer
message types can communicate with a richer server.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
