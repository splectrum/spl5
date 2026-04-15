[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc](./) > Container Files

# avsc Container Files

Avro container files — self-describing binary files
that embed the writer schema with the data. The
container is how data travels with its own carrier
description.

---

## What Containers Are

An Avro container file (also called Object Container
File or OCF) bundles:

1. A **header** — magic bytes, writer schema, sync
   marker, optional codec
2. **Data blocks** — sequences of records encoded with
   the writer schema

The writer schema travels with the data. Any reader
with a compatible reader schema can decode the
contents. No external registry needed.

This is AVRO's native answer to the question: how does
data describe itself? The container embeds the carrier
description. The reader brings the meaning lens.

## Reading

```javascript
const avro = require('avsc')

avro.createFileDecoder('./data.avro')
  .on('metadata', (type) => {
    // type is the writer's schema — what the data is
  })
  .on('data', (val) => {
    // val is a decoded record
  })
```

With a reader schema (schema evolution):

```javascript
const readerType = avro.Type.forSchema({ ... })

avro.createFileDecoder('./data.avro', { readerType })
  .on('data', (val) => {
    // val decoded through reader's lens
  })
```

## Writing

```javascript
const schema = {
  type: 'record',
  name: 'Entry',
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'bytes' }
  ]
}

const encoder = avro.createFileEncoder('./out.avro', schema)
encoder.write({ key: '/path', value: Buffer.from('data') })
encoder.write({ key: '/other', value: Buffer.from('more') })
encoder.end()
```

## Header Extraction

Synchronous header reading without streaming the
entire file:

```javascript
const header = avro.extractFileHeader('./data.avro')
// header.meta['avro.schema'] — parsed writer schema
// header.meta['avro.codec'] — compression codec
// header.sync — 16-byte sync marker
```

## Stream Classes

The underlying stream implementations, available for
custom pipelines:

```javascript
const { BlockDecoder, BlockEncoder,
        RawDecoder, RawEncoder } = avro.streams
```

| Class | Direction | Description |
|-------|-----------|-------------|
| `BlockDecoder` | Read | Decodes container-format input |
| `BlockEncoder` | Write | Encodes records into container blocks |
| `RawDecoder` | Read | Decodes raw Avro binary (no container framing) |
| `RawEncoder` | Write | Encodes records as raw Avro binary |

Block streams handle the container format — header,
sync markers, block boundaries. Raw streams handle
bare record sequences — no container overhead.

All stream classes use `bare-stream` Duplex in the
fork.

## Container Structure

```
[magic: 4 bytes "Obj\x01"]
[header: avro record]
  meta: map<string, bytes>
    "avro.schema": writer schema as JSON
    "avro.codec": "null" | "deflate" | "snappy"
  sync: 16 bytes (random marker)
[block]*
  count: long (number of records)
  size: long (byte size of encoded records)
  data: bytes (encoded records, possibly compressed)
  sync: 16 bytes (must match header)
```

The sync marker detects corruption and enables random
access — seek to any sync marker and start reading
blocks from there.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
