# Stream Record Schema — Working Reference

Current AVRO schema used by the spl5 prototype.
Subject to formal review when prototyping is complete.

---

## Common Record: spl.data.stream.record

Every stream record has this shape. Declared once
to the RPC protocol.

```
spl.data.stream.record {
  offset:    long     (default 0)
  timestamp: long
  key:       string
  value:     bytes    (default empty)
  headers:   array of spl.data.stream.header {
    key:   string
    value: bytes
  }
}
```

Headers is an open key-value list. Each entry is a
namespace key (string) and AVRO-encoded data (bytes).
The key names the schema used to encode the value.

## Stream Descriptor: spl.data.stream

Always present in headers. The record's
self-description — minimum required to start handling.

```
spl.data.stream.descriptor {
  type: string    — the stream type
}
```

## Stream Types

A stream type is the identity of a record in motion.
It says what this record *is* — not its data schema,
but its functional identity.

### Execution Context: spl.mycelium.process.execute

Context wrapper. Sets processing mode. Value contains
the inner stream record being executed.

```
spl.mycelium.process.execute {
  mode: string    (default "sync")
}
```

### Operator Base: spl.data.stream.operator

Method signature pattern. Args in, value out.
Multiple operator stream types alias to this schema.

```
spl.data.stream.operator {
  args: null | bytes    (default null)
}
```

## The Onion — Nested Records

An execution context wrapping a get operation:

```
spl.data.stream.record {
  key: "/blog/submissions",
  value: <inner record, serialized>,
  headers: [
    { key: "spl.data.stream",
      value: { type: "spl.mycelium.process.execute" } },
    { key: "spl.mycelium.process.execute",
      value: { mode: "sync" } },
    { key: "spl.pov",
      value: "/home/user/project" }
  ]
}
```

Peel value:

```
spl.data.stream.record {
  key: "/blog/submissions",
  value: <empty — fills with output>,
  headers: [
    { key: "spl.data.stream",
      value: { type: "spl.mycelium.xpath.raw.uri.get" } },
    { key: "spl.mycelium.xpath.raw.uri.get",
      value: { args: [[{ key: "/blog/submissions" }]] } }
  ]
}
```

## Headers Model

- **Self-discovery:** enumerate keys to find what
  schemas are present on the record
- **Direct access:** read a specific key, decode with
  that schema
- **Open-ended:** any number of entries. Context
  accumulates as the record travels.
- **Key is schema name:** the key names the AVRO
  schema (or alias) used to encode the value

## Dispatch

Read `spl.data.stream` header → get stream type →
dispatch on type name. One path, one mechanism.

## Processing Pipeline

```
arrive   → headers: descriptor + type bag   value: empty/inner
execute  → headers: + status context        value: output
```
