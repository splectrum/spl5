[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc](./) > Serialization

# avsc Serialization

Avro binary encoding as implemented in avsc. Compact,
self-describing where needed, and deterministic.

---

## Binary Encoding

Avro uses a compact binary format. No field names in
the output, no type tags on primitives. The schema
is the codec — encoder and decoder must agree on the
schema to communicate.

This is the carrier principle made physical. The
binary stream carries content. The schema — present
elsewhere — provides meaning.

```javascript
const type = avro.Type.forSchema({
  type: 'record',
  name: 'Entry',
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'bytes' }
  ]
})

const buf = type.toBuffer({ key: '/path', value: Buffer.from('data') })
// buf is compact binary — no field names, no framing

const val = type.fromBuffer(buf)
// val is { key: '/path', value: <Buffer 64 61 74 61> }
```

## The Tap

avsc's internal binary reader/writer. A cursor over a
byte buffer that reads and writes Avro primitives in
sequence.

The Tap is not public API in the conventional sense,
but it is the mechanism behind all encoding and
decoding. Understanding it clarifies how Avro binary
works.

```javascript
const { Tap } = require('avsc/lib/utils')

const buf = new Uint8Array(1024)
const tap = new Tap(buf)

// Write
tap.writeLong(42)
tap.writeString('hello')

// Read
tap.pos = 0
tap.readLong()    // 42
tap.readString()  // 'hello'
```

Integers use zigzag varint encoding — small values
take fewer bytes. Strings and bytes are length-prefixed
with a varint.

## Schema Fingerprints

Every schema has a deterministic fingerprint — a hash
of its canonical JSON representation. Used for schema
identification without transmitting the full schema.

```javascript
const fp = type.fingerprint('md5')
// 16-byte Buffer — the schema's identity
```

In mycelium, schema fingerprints are used in the RPC
handshake — client and server compare fingerprints to
determine if they share a protocol.

The `platform.js` module provides `getHash()` using
`bare-crypto` for MD5 computation.

## Encoding Characteristics

| Aspect | Detail |
|--------|--------|
| Null | 0 bytes |
| Boolean | 1 byte |
| Int/Long | 1–10 bytes (zigzag varint) |
| Float | 4 bytes (IEEE 754) |
| Double | 8 bytes (IEEE 754) |
| Bytes | varint length + raw bytes |
| String | varint length + UTF-8 bytes |
| Record | concatenated field encodings |
| Array | blocks of [count, items...], terminated by 0 |
| Map | blocks of [count, [key, value]...], terminated by 0 |
| Union | varint branch index + branch encoding |
| Enum | varint symbol index |
| Fixed | raw bytes (size from schema) |

No framing, no delimiters, no padding. The encoding
is fully determined by the schema. Two records of the
same type concatenated in a buffer are distinguishable
only because the schema says where one ends and the
next begins.

## JSON Encoding

avsc also supports JSON encoding for debugging and
interop:

```javascript
const jsonStr = JSON.stringify(type.toJSON(val))
const val = type.fromJSON(JSON.parse(jsonStr))
```

JSON encoding includes type tags for unions and uses
string representations for bytes. Larger than binary
but human-readable.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
