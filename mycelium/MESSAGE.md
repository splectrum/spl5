# Message Schema — Working Reference

Current AVRO schema used by the spl5 prototype.
This is the working format — subject to formal
AVRO schema review when prototyping is complete.

---

## Kafka Record Shape

Every message is a Kafka record. Same shape at
every nesting level (the onion).

```
spl.mycelium.Message {
  offset:    long     (default 0)
  timestamp: long
  key:       string
  value:     bytes    (default empty)
  headers:   Headers
}
```

## Headers — Property Bag

Headers is a property bag with two concerns:

```
spl.mycelium.message.Headers {
  record:  Record           — the what (operator/schema identification)
  context: [ContextEntry]   — the how (execution metadata, extensible)
}
```

## Record — Schema Identification

Identifies what this message represents and carries
its arguments. `schema` is the working name — it
could identify an operator, a data type, or
something else. To be resolved in formal review.

```
spl.mycelium.operator.Record {
  schema: string       — dispatch key
  args:   null | bytes — operator arguments (default null)
}
```

## Context Entry

Extensible key-value metadata. Accumulates through
the processing pipeline.

```
spl.mycelium.message.ContextEntry {
  key:   string
  value: bytes
}
```

## The Onion — Nested Messages

The exec envelope wraps the inner operator. The
inner operator is serialized to bytes in the exec's
value field. Same Message schema at both layers.

```
process.execute.exec {
  headers: {
    record: {
      schema: "spl.mycelium.process.execute.exec",
      args: { mode: "sync" }
    }
  },
  key: "/blog/submissions",
  value: xpath.data.uri.get {
    headers: {
      record: {
        schema: "spl.mycelium.xpath.data.uri.get",
        args: [[{ key: "/blog/submissions" }]]
      }
    },
    key: "/blog/submissions",
    value: <output — empty until executed>
  }
}
```

## Processing Pipeline

```
arrive   → headers: args          value: empty
validate → headers: args          value: validated input
execute  → headers: args          value: output
error    → headers: args + error  value: partial/empty
```

## Request and Response

Response returns the request enriched. Same message,
more resolved.

- **get** — args: keys. Value empty → filled.
- **put** — args: metadata. Value: data to write → confirmed.
- **delete** — args: keys. Value empty → removed data.
- **noop** — args: null. Value passes through unchanged.

## Dispatch

Single path: `headers.record.schema`. One code path
for every message.
