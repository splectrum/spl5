[In Wonder - The World of Splectrum](../../) > [Engineering](../) > avsc

# avsc — Avro Type System

Reference for avsc — the pure JavaScript Avro
implementation that provides mycelium's type system,
serialization, and schema resolution.

---

## What avsc Is

avsc is a complete implementation of the
[Apache Avro specification](https://avro.apache.org/docs/1.12.0/specification/)
in pure JavaScript. Types, serialization, schema
evolution, container files, IDL parsing — the full
specification surface in a single library.

Forked from [mtth/avsc](https://github.com/mtth/avsc)
and barified for the Bare runtime.

**Source:** [github.com/bare-for-pear/avsc](https://github.com/bare-for-pear/avsc)
**Upstream:** [github.com/mtth/avsc](https://github.com/mtth/avsc)

## Why avsc Is Constitutive

avsc is not a utility dependency. It is the language
through which mycelium articulates data.

Every message in the fabric is an Avro record. Every
schema contract between processes is expressed in Avro
types. Every protocol operation is defined through Avro
schema definitions. The type system is not a
serialization choice — it is the carrier language
itself.

This makes avsc constitutive. The architecture depends
on it the way it depends on git — not as a tool but as
a substrate. Changes to avsc are changes to the
language the system speaks. It is forked, maintained
locally, and treated as Splectrum code.

See [AVRO Design Scope](../mycelium/avro-design-scope)
for the full architectural role of Avro in mycelium.

## What the Fork Changes

The fork replaces Node.js built-in modules with Bare
equivalents. The Avro API is unchanged.

| Concern | Upstream | Fork |
|---------|----------|------|
| Crypto | `crypto` | `bare-crypto` |
| Filesystem | `fs` | `bare-fs` |
| Path | `path` | `bare-path` |
| Streams | `stream` | `bare-stream` |

Additional adaptations:

- **TextEncoder/TextDecoder polyfill** — Bare's
  text-decoder uses a streaming API. avsc expects the
  WHATWG standard `.decode()` and `.encodeInto()`.
  The polyfill bridges this.
- **Buffer/Uint8Array bridging** — conditional
  handling where Bare's buffer semantics differ from
  Node's global Buffer.
- **Bare-only targeting** — the upstream dual-runtime
  support (Node.js + browser) is removed. One runtime,
  no conditional resolution.

The public API surface is identical to upstream. All
[upstream documentation](https://github.com/mtth/avsc/wiki)
applies.

## Reference Pages

- [Type System](types.md) — schema definition,
  primitives, complex types, logical types, type
  inference, schema evolution
- [Serialization](serialization.md) — encoding,
  decoding, the Tap buffer, schema fingerprints
- [Container Files](containers.md) — block
  encoding/decoding streams, file headers, codecs
- [Schema Parsing](schemas.md) — JSON schemas,
  IDL protocols, import resolution
- [Barification](barification.md) — what was changed
  from upstream, platform dependencies, polyfills

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
