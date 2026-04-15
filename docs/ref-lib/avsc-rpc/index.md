[In Wonder - The World of Splectrum](../../) > [Engineering](../) > avsc-rpc

# avsc-rpc — Avro RPC Protocol

Reference for avsc-rpc — the Avro RPC protocol layer
that provides mycelium's process boundary enforcement.

---

## What avsc-rpc Is

avsc-rpc is the Avro RPC/IPC implementation extracted
from avsc v5 and maintained as a standalone library for
the Bare runtime. Service definition, client/server
creation, transport channels, middleware, and protocol
negotiation.

The RPC layer was removed from avsc in v6
([PR #428](https://github.com/mtth/avsc/pull/428)).
This module preserves and maintains it independently.

**Source:** [github.com/bare-for-pear/avsc-rpc](https://github.com/bare-for-pear/avsc-rpc)
**Extracted from:** commit `dd82783` of mtth/avsc

## Why avsc-rpc Is Constitutive

RPC is not a communication mechanism in mycelium. It is
the process boundary enforcement mechanism.

Two processes communicating through RPC can only see
each other through the schema contract. No shared
objects, no classpath leakage, no hidden state. Even
in local in-memory execution, the RPC boundary
guarantees that only schema-conformant messages pass.
This is what makes the architecture's claim —
no transitive dependencies between processes — a
physical fact rather than a convention.

Transport pluggability is a consequence, not the
motivation. The same schema contract holds whether the
transport is in-memory, TCP, or HTTP. The transport
adapts to context. The boundary is invariant.

This makes avsc-rpc constitutive alongside avsc itself.
Together they provide the complete Avro primitive:
types and serialization from avsc, protocol and
boundary from avsc-rpc.

See [AVRO Design Scope](../mycelium/avro-design-scope)
— section 11, RPC as Constitutive Dependency — for the
full architectural role.

## What the Fork Changes

The extraction adapted the code for standalone use on
Bare:

| Concern | Upstream (avsc v5) | Fork |
|---------|--------------------|------|
| Streams | `stream.Transform` | `streamx.Transform` |
| Buffer | `buffer` | `bare-buffer` |
| Events | `events` | `bare-events` |
| Streams | `stream` | `bare-stream` |

Additional adaptations:

- **streamx transport** — all frame encoder/decoder
  classes use streamx.Transform. Two-parameter
  `_transform(buf, cb)` — no encoding argument.
- **v5/v6 compatibility bridge** (`compat.js`) —
  avsc-rpc was written against avsc v5. The fork pairs
  it with avsc v6. The bridge handles hash result
  types (Uint8Array to Buffer), restored utility
  functions, and `process.nextTick` polyfill via
  `queueMicrotask`.
- **Peer dependency on avsc** — types and utils are
  imported directly from the avsc sibling. Both
  libraries live together under `lib/`.

## Reference Pages

- [Service Definition](services.md) — protocols,
  messages, Service.forProtocol, type resolution
- [Client and Server](client-server.md) — creating
  clients and servers, handler registration, options
- [Transports](transports.md) — in-memory, TCP,
  HTTP, channel lifecycle, stateful vs stateless
- [Middleware](middleware.md) — request/response
  chain, use patterns
- [Wire Protocol](wire-protocol.md) — handshake,
  framing, Netty compatibility, protocol negotiation
- [Barification](barification.md) — streamx
  adaptation, v5/v6 bridge, platform dependencies

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
