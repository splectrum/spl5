[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc-rpc](./) > Middleware

# avsc-rpc Middleware

Request and response interception on both client and
server. The mechanism for cross-cutting concerns —
tracing, logging, authentication, context propagation.

---

## Model

Middleware functions are registered with `.use()` and
execute in order for each message. They receive the
writable request, writable response, and a `next`
callback to continue the chain.

The chain is bidirectional — middleware can act on
the outgoing request and on the incoming response.

```
client middleware → transport → server middleware → handler
                                                      ↓
client middleware ← transport ← server middleware ← response
```

## Client Middleware

Intercepts outgoing calls and incoming responses:

```javascript
client.use((wreq, wres, next) => {
  // Before: outgoing request
  console.log('calling:', wreq.header.method)

  next(null, (err, prev) => {
    // After: incoming response
    console.log('response received')
    prev(err)
  })
})
```

### wreq (Writable Request)

| Property | Description |
|----------|-------------|
| `wreq.header` | Message header (method name, etc.) |
| `wreq.request` | The typed request object |

### wres (Writable Response)

| Property | Description |
|----------|-------------|
| `wres.response` | The typed response (after handler) |
| `wres.error` | Error value (after handler) |

## Server Middleware

Intercepts incoming calls before the handler:

```javascript
server.use((wreq, wres, next) => {
  // Before handler
  const start = Date.now()

  next(null, (err, prev) => {
    // After handler
    console.log('handled in', Date.now() - start, 'ms')
    prev(err)
  })
})
```

## Chaining

Multiple middleware functions execute in registration
order:

```javascript
server.use(
  tracing,
  authentication,
  logging
)

// Or individually:
server.use(tracing)
server.use(authentication)
server.use(logging)
```

## Use in Mycelium

Middleware is the natural point for context metadata
propagation. The mycelium message shape includes a
context array — key-value pairs that accumulate
through the processing pipeline. Middleware can:

- **Inject context** — add entries to the context
  on the way in (tracing IDs, timestamps, caller
  identity)
- **Read context** — inspect accumulated context
  for routing or authorisation decisions
- **Enrich context** — add entries on the way out
  (execution metadata, timing, handler identity)

The middleware chain and the message context array
serve the same purpose at different levels — the
chain is the runtime mechanism, the context is the
data trail.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
