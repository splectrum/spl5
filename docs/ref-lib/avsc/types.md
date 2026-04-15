[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc](./) > Type System

# avsc Type System

The Avro type system as implemented in avsc. This is
the carrier language — the structural vocabulary
through which mycelium articulates data.

---

## Type.forSchema

The primary entry point. Takes an Avro schema
definition and returns a Type instance that can
encode, decode, validate, and compare values.

```javascript
const avro = require('avsc')

const type = avro.Type.forSchema({
  type: 'record',
  name: 'spl.mycelium.Message',
  fields: [
    { name: 'offset', type: 'long', default: 0 },
    { name: 'timestamp', type: 'long' },
    { name: 'key', type: 'string' },
    { name: 'value', type: 'bytes', default: '' },
    { name: 'headers', type: 'Headers' }
  ]
})
```

### Options

| Option | Description |
|--------|-------------|
| `logicalTypes` | Map of logical type names to implementations |
| `namespace` | Default namespace for unqualified names |
| `noAnonymousTypes` | Require all types to be named |
| `registry` | Shared type registry for cross-schema references |
| `typeHook` | Intercept type creation |
| `wrapUnions` | Union representation strategy |

## Type.forValue

Infers a schema from a JavaScript value. Useful for
quick prototyping — the inferred type can encode any
structurally compatible value.

```javascript
const type = avro.Type.forValue({
  key: '/blog/submissions',
  value: Buffer.from('hello')
})
```

## Primitive Types

| Avro Type | JavaScript Type | Size |
|-----------|----------------|------|
| `null` | `null` | 0 bytes |
| `boolean` | `boolean` | 1 byte |
| `int` | `number` | 1–5 bytes (varint) |
| `long` | `number` | 1–10 bytes (varint) |
| `float` | `number` | 4 bytes |
| `double` | `number` | 8 bytes |
| `bytes` | `Buffer` | variable |
| `string` | `string` | variable |

All primitives use Avro's binary encoding — varints
for integers, IEEE 754 for floats, length-prefixed for
bytes and strings.

## Complex Types

### Record

Named type with ordered fields. The fundamental
structure in mycelium — every message, every schema
contract, every protocol definition is a record.

```javascript
{
  type: 'record',
  name: 'spl.mycelium.operator.Record',
  fields: [
    { name: 'schema', type: 'string' },
    { name: 'args', type: ['null', 'bytes'], default: null }
  ]
}
```

Fields support defaults, ordering hints, and
documentation. Field order determines binary layout.

### Enum

Named type with a fixed set of symbols.

```javascript
{
  type: 'enum',
  name: 'Mode',
  symbols: ['SYNC', 'ASYNC', 'FIRE_AND_FORGET']
}
```

### Array

Ordered collection of a single item type.

```javascript
{ type: 'array', items: 'string' }
```

### Map

Key-value pairs. Keys are always strings. Values are
a single type.

```javascript
{ type: 'map', values: 'bytes' }
```

### Union

One of several types. Represented as a JSON array.

```javascript
['null', 'string', 'bytes']
```

Avro unions carry a type index — the decoder knows
which branch was encoded. This is what makes the
`['null', 'bytes']` pattern work for optional fields
without ambiguity.

### Fixed

Fixed-size byte array.

```javascript
{ type: 'fixed', name: 'Hash', size: 16 }
```

## Logical Types

Logical types attach semantic meaning to a physical
type. The physical type carries the data. The logical
type declares what it means.

```javascript
class TimestampType extends avro.types.LogicalType {
  _fromValue (val) { return new Date(val) }
  _toValue (date) { return +date }
  _resolve (type) {
    if (avro.Type.isType(type, 'long')) {
      return this._fromValue
    }
  }
}

const type = avro.Type.forSchema({
  type: 'long',
  logicalType: 'timestamp'
}, { logicalTypes: { timestamp: TimestampType } })
```

This is the carrier/meaning separation at the type
level. The `long` carries. The `timestamp` means.
Same binary representation, different interpretation
depending on which logical type is in scope.

## Schema Evolution

Avro's native schema resolution — writer schema versus
reader schema — is the mechanism behind mycelium's
relational type system. A reader does not ask "is this
type X." It asks "can this record be read as X."

```javascript
const writerType = avro.Type.forSchema({
  type: 'record',
  name: 'Event',
  fields: [
    { name: 'id', type: 'long' },
    { name: 'name', type: 'string' }
  ]
})

const readerType = avro.Type.forSchema({
  type: 'record',
  name: 'Event',
  fields: [
    { name: 'id', type: 'long' },
    { name: 'name', type: 'string' },
    { name: 'source', type: 'string', default: 'unknown' }
  ]
})

// Reader can read writer's data — new field gets default
const resolver = readerType.createResolver(writerType)
const val = readerType.fromBuffer(buf, resolver)
```

Resolution rules:

- **Reader adds a field with default** — compatible.
  The default fills in.
- **Writer has extra fields** — compatible. Reader
  ignores them.
- **Type promotion** — int to long, float to double.
  Compatible.
- **Name mismatch** — incompatible. The nominal gate
  enforces language commitment.

This is not versioning machinery. It is discovery at
the point of contact.

## Type Methods

Every Type instance provides:

| Method | Description |
|--------|-------------|
| `toBuffer(val)` | Encode value to binary |
| `fromBuffer(buf, resolver?, noCheck?)` | Decode binary to value |
| `isValid(val)` | Check value conforms |
| `compare(val1, val2)` | Sort-order comparison |
| `compareBuffers(buf1, buf2)` | Binary-level comparison |
| `clone(val, opts?)` | Deep copy with optional coercion |
| `createResolver(writerType)` | Schema evolution resolver |
| `schema(opts?)` | Return the JSON schema |
| `fingerprint(algorithm?)` | Schema hash |
| `random()` | Generate random conforming value |

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
