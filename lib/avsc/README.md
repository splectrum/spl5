# avsc — Bare Runtime Fork

Pure JavaScript [Apache Avro](https://avro.apache.org/docs/1.12.0/specification/) implementation, forked from [mtth/avsc](https://github.com/mtth/avsc) and adapted for the [Bare](https://github.com/holepunchto/bare) runtime.

## What This Is

This is a maintained fork of avsc v6 (`6.0.0-rc.1`) that replaces all Node.js built-in dependencies with their Bare equivalents. The Avro API is unchanged — schema definition, serialization, type inference, schema evolution, container files — all work as documented in the [upstream wiki](https://github.com/mtth/avsc/wiki).

**Upstream:** [github.com/mtth/avsc](https://github.com/mtth/avsc) (MIT)

## What Changed

The fork replaces Node.js built-ins with Bare modules throughout:

| Module | Upstream | Fork |
|--------|----------|------|
| Crypto | `crypto` | `bare-crypto` |
| Filesystem | `fs` | `bare-fs` |
| Path | `path` | `bare-path` |
| Streams | `stream` | `bare-stream` |

Additional changes:

- **TextEncoder/TextDecoder polyfill** (`lib/encoding.js`) — Bare's `text-decoder` module uses a streaming API; avsc expects the WHATWG `.decode()` / `.encodeInto()` API. The polyfill provides standard WHATWG semantics with full UTF-8 support.
- **Conditional Buffer handling** — `utils.js` detects whether `Buffer` is available and falls back to `Uint8Array` operations where needed.
- **Stripped package.json** — no conditional imports, no browser targets. Bare only.

The upstream dual-runtime support (Node.js + browser via `package.json` imports field) was removed. This fork targets Bare exclusively.

## Platform Dependencies

The following Bare modules must be available at runtime:

- `bare-crypto` — hash computation (MD5 for schema fingerprints)
- `bare-fs` — container file I/O
- `bare-path` — IDL import resolution
- `bare-stream` — container encoding/decoding streams

These are platform dependencies — installed via npm into a local `lib/` directory with a `node_modules` symlink. They are not committed to the repository. See `bin/setup` for the installation script.

## API

The public API matches [upstream avsc](https://github.com/mtth/avsc/wiki/API):

```javascript
const avro = require('avsc')
```

### Type System

```javascript
// From schema definition
const type = avro.Type.forSchema({
  type: 'record',
  name: 'Example',
  fields: [
    { name: 'id', type: 'long' },
    { name: 'name', type: 'string' }
  ]
})

const buf = type.toBuffer({ id: 1, name: 'hello' })
const val = type.fromBuffer(buf)
```

```javascript
// From value inference
const type = avro.Type.forValue({ city: 'Amsterdam', visits: 3 })
```

### Schema Parsing

```javascript
// Parse JSON schema text
const type = avro.readSchema('{ "type": "array", "items": "int" }')

// Parse Avro IDL protocol
avro.assembleProtocol('./protocol.avdl', (err, attrs) => { ... })
```

### Container Files

```javascript
// Read Avro container file
avro.createFileDecoder('./data.avro')
  .on('metadata', (type) => { /* writer's type */ })
  .on('data', (val) => { /* decoded record */ })

// Write Avro container file
const encoder = avro.createFileEncoder('./out.avro', schema)
encoder.write(record)
encoder.end()

// Sync header extraction
const header = avro.extractFileHeader('./data.avro')
```

### Streams

```javascript
const { BlockDecoder, BlockEncoder, RawDecoder, RawEncoder } = avro.streams
```

### Built-in Types

```javascript
const { builtins } = avro.types
// NullType, BooleanType, IntType, LongType, FloatType, DoubleType,
// BytesType, StringType, ArrayType, MapType, EnumType, RecordType,
// FixedType, ErrorType, LogicalType, UnwrappedUnionType, WrappedUnionType
```

### Full Export

```javascript
module.exports = {
  Type,                // Main type class — forSchema(), forValue(), etc.
  assembleProtocol,    // Parse Avro IDL with imports
  createFileDecoder,   // Readable stream from container file
  createFileEncoder,   // Writable stream to container file
  extractFileHeader,   // Sync header extraction
  readProtocol,        // Parse protocol from schema object
  readSchema,          // Parse schema from JSON text
  streams,             // { BlockDecoder, BlockEncoder, RawDecoder, RawEncoder }
  types,               // Built-in type constructors
}
```

## Module Structure

```
lib/
  index.js        — entry point, file I/O convenience functions
  types.js        — Avro type system (primitives, complex, logical)
  specs.js        — schema and IDL parsing
  containers.js   — Avro container file stream encoding/decoding
  utils.js        — binary tap, buffer operations, helpers
  platform.js     — platform-specific operations (crypto hash)
  encoding.js     — WHATWG TextEncoder/TextDecoder polyfill
  files.js        — filesystem hooks for IDL import resolution
```

## Upstream Documentation

The avsc API is fully documented in the upstream wiki:

- [API Reference](https://github.com/mtth/avsc/wiki/API)
- [Quickstart](https://github.com/mtth/avsc/wiki/Quickstart)
- [Advanced Usage](https://github.com/mtth/avsc/wiki/Advanced-usage) — logical types, schema evolution, type inference, custom longs
- [Benchmarks](https://github.com/mtth/avsc/wiki/Benchmarks)

All upstream API documentation applies to this fork. The only difference is the runtime environment.

## License

MIT — same as upstream avsc.
