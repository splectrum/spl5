[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [Mycelium](./) > Stream Record Design

# Stream Record Design

Design discussion for the Kafka record structure in
mycelium — the stream record schema, the headers
model, stream types, and schema aliasing.

This document captures the design progression, not
just the result. The reasoning matters as much as the
structure.

---

## Starting Point

The prototyping iteration (spl5) proved the RPC chain
end-to-end: AVRO message schema, RPC server, CLI
submitting to server, in-memory pipeline. The message
schema worked but the headers design was provisional —
a fixed record with two fields (`record` and `context`
array) that served the prototype but didn't reflect the
architecture.

The existing design documents established the
principles:

- The Kafka record is the form data takes in motion
  ([Kafka Design Scope](kafka-design-scope))
- Headers carry context that was implicit in the tree
  ([Message](message))
- Dispatch reads a single path in headers
  ([Protocol](protocol))
- AVRO schemas are facts in the fabric — present or
  absent, self-describing
  ([AVRO Design Scope](avro-design-scope))

The question was: how should headers actually work?

---

## What Is Settled

Four of the five Kafka record fields are settled.
They map directly from the Kafka record grammar and
the implementation confirmed them:

- **offset** — order of arrival. Always meaningful.
  `long`, default 0.
- **timestamp** — historicity. The moment of
  extraction. `long`.
- **key** — identity. What makes this datum
  addressable. `string`.
- **value** — the data payload. Opaque bytes. Starts
  empty, fills during execution. `bytes`.

These four are the Kafka record's contribution to
mycelium. No open questions.

The fifth field — **headers** — is where everything
was still open.

---

## The Headers Problem

The prototype had headers as a structured AVRO record
with fixed fields:

```
headers: {
  record: { schema: string, args: bytes },
  context: [{ key: string, value: bytes }]
}
```

The reference library described headers differently —
as a flat property bag with an AVRO schema as namespace
authority, where `record` sits alongside other
properties like tracing IDs.

Neither matched the architecture's principles:

- The fixed structure constrains what headers can
  carry. Adding a new concern means changing the
  schema.
- The prototype's `context` array was a pragmatic
  catch-all without self-description.
- The "headers about headers" self-description
  mechanism was called out as an open area in the
  Kafka design scope.

---

## Headers as Open Key-Value List

The resolution: headers is a flat list of key-value
entries. Each entry is a namespace key (string) and a
data value.

```
headers: [{ key: string, value: ... }]
```

The key is a fully qualified namespace path. The value
is data according to the schema that the key names.

This is the entire mechanism. No fixed fields inside
headers. No structural constraints on what can be
carried. The list is open-ended — any number of
entries, each self-identifying through its key.

### Why This Works

The key IS the schema name — or an alias of one. This
means:

- **Self-discovery.** Enumerate the keys, you have a
  list of schemas present on this record. No registry
  lookup needed. The schemas are facts — present or
  absent.

- **Direct access.** You know what you want — read the
  entry with that key, decode with that schema. If it's
  not there, it's not there. Architecture of absence.

- **Interrogation.** You don't know what's there —
  list the keys, discover what schemas are present,
  decide what to do.

Two access modes on the same structure. Direct is a
lookup. Interrogation is an enumeration. Same list,
no additional mechanism.

This maps to the xpath pattern — flat addressing
(I know the path, give me the value) versus query
(what's at this path?). Same duality, one level up.

---

## Stream Types

A stream type is the identity of a Kafka record in
motion. It says what this record *is* in the stream —
not its data schema (which is always the common record
schema), but its functional identity.

Examples:

- `spl.mycelium.process.execute` — an execution
  context. Sets a processing mode.
- `spl.mycelium.process.debug` — a debug context.
- `spl.mycelium.xpath.raw.uri.get` — a raw URI get
  operation. Has a method signature: args in, output
  out.

Stream types are not all the same kind of thing. Some
are context wrappers (they set how processing happens).
Some are operators (they define what happens). The
architecture is free to define stream type categories
as needed — their implementation is owned by us.

The term "stream type" replaces "data in motion type"
— same concept, more concise.

---

## The Data Namespace

AVRO data schemas live in the `spl.data` namespace.
This is the carrier concern — the structural
vocabulary.

- `spl.data.stream.record` — the common Kafka record
  schema. What avsc-rpc declares. Every stream record
  has this shape.
- `spl.data.stream.operator` — the base property bag
  schema. `args` and `value`.
- `spl.data.mycelium.process.execute` — specific
  schema extending the base with `mode`.

The `spl.data` namespace is separate from
`spl.mycelium` (the fabric), `spl.splectrum` (the
language layer), and `spl.haicc` (the cognition layer).
Data schemas are carrier. The namespaces that use them
are meaning. The `spl.data` namespace mirrors the
structure of the namespaces it serves —
`spl.data.mycelium.process` provides carrier schemas
for `spl.mycelium.process` stream types.

---

## The Stream Descriptor

Every stream record carries an `spl.data.stream` entry
in its headers. This is the record's self-description
— the minimum required to get handling started.

### Resolved, Not Encoded

The `spl.data.stream` entry is special. Its value is
not opaque bytes — it is a resolved AVRO record,
defined as a union branch in the header value type:

```
header.value: [ bytes | spl.data.stream.descriptor ]
```

When the header key is `spl.data.stream`, the value is
the descriptor record — structured, typed, directly
readable after deserialization. No `fromBuffer()` call,
no schema lookup. The happy path — dispatch on stream
type — is zero decoding overhead.

All other header entries use the `bytes` branch and
are decoded on demand.

### Descriptor Fields

```
spl.data.stream.descriptor {
  type:  string                          — the stream type
  args:  null | { type: string,          — typed input reference
                  value: bytes }
  value: null | { type: string,          — typed payload reference
                  value: bytes }
}
```

The `type` field is the stream type name — the
dispatch key. Always present.

The `args` and `value` fields are typed references —
each carries a schema name and encoded data. Null
means not applicable. This is the base property bag
that every stream type conforms to:

- **Operators** have `args` (input data, method
  arguments). Value starts null, fills with method
  output on execution.
- **Context types** have `args` null (no input data
  in the operator sense, though the specific schema
  carries context-specific fields like `mode`). Value
  references the wrapped inner record.
- Both patterns use the same base structure. The
  distinction is usage, not schema.

### Efficient Happy Path

The descriptor is resolved during AVRO deserialization
of the record itself. The server reads
`headers[n].value.type` as a plain string — no
additional decode step. Dispatch is:

1. Deserialize the record (one pass)
2. Find the `spl.data.stream` entry (list scan)
3. Read `.type` (it's a string, already there)
4. Route

Everything beyond this — reading args, decoding the
inner record, looking up specific schemas — is cold
path, paid for only when a handler needs it.

---

## The Dual Entry Pattern

A stream record carries its stream type data in two
header entries:

1. **`spl.data.stream`** — the descriptor. Carries
   `type`, `args`, `value` in the base schema. This is
   the data **in context** of the current request.
   Generic code reads this. It contains exactly the
   base fields — enough for dispatch, pipeline
   processing, generic handling.

2. **The stream type's own key** — e.g.,
   `spl.mycelium.process.execute`. Carries the full
   record for that specific type — base fields plus
   type-specific fields (like `mode` for execute).
   This is the data **out of context** — standing on
   its own, readable by its own specific schema.

The duplication is the point. Two entries, two
lenses, two consumers:

- **Generic code** reads the base descriptor. Gets
  `type`, `args`, `value`. Enough to dispatch, route,
  log, forward. Never needs the specific schema.

- **The handler** reads the specific type's entry.
  Gets everything — base fields plus `mode`, debug
  level, or whatever the specific schema defines. Uses
  AVRO's "readable as" — the specific schema is a
  superset of the base.

Neither needs to know about the other's schema. The
base is what the pipeline always needs. The specific
is what the handler needs. Both are in the same flat
list. The base is always resolved (zero-cost). The
specific is decoded on demand.

---

## One Base Schema

All stream type property bags share one base
structure: `args` and `value`. There is no separate
schema hierarchy for operators versus contexts. The
base is:

```
spl.data.stream.operator {
  args:  null | bytes
  value: null | bytes
}
```

An operator has args populated, value fills on
execution. A context has args null, value references
the wrapped record. A bare passthrough has both null.
Same schema, different usage patterns. The stream type
name tells you which pattern applies — not the data
schema.

Specific types extend the base with additional fields:

```
spl.data.mycelium.process.execute {
  args:  null | bytes
  value: null | bytes
  mode:  string       — sync, queue, dry-run
}
```

Written with the specific schema, readable as the base.
AVRO's schema resolution handles this natively — a
reader with fewer fields reads data from a writer with
more fields. Extra fields are ignored.

Generic code reads everything as the base. Specific
handlers read their own schema. One write, many reads.

---

## The Onion Revisited

The original message design described nested records —
the onion. An execution context wrapping an operator,
both as complete Kafka records with the same shape.

The new design preserves this nesting but clarifies
what each layer is:

**Outer record:**
- Data schema: `spl.data.stream.record`
- Stream type (in headers): `spl.mycelium.process.execute`
- Value: a complete inner record (serialized bytes)

**Inner record:**
- Data schema: `spl.data.stream.record` (same shape)
- Stream type (in headers): `spl.mycelium.xpath.raw.uri.get`
- Value: empty, fills with method output on execution

The execution context is a wrapper. Its value *is*
the operation it wraps — a complete stream record
carrying its own headers, its own stream type, its own
property bag. The wrapper sets the processing mode.
The operation defines what happens.

The `spl.data.stream` descriptor in the outer record
declares that value contains a `spl.data.stream.record`
(through the `value` typed reference). The descriptor
in the inner record has `value: null` — value is the
data payload, filled on execution.

Peeling the onion is: read the descriptor's `value`
typed reference, deserialize the bytes as another
`spl.data.stream.record`, read its descriptor, repeat.

---

## Schema Aliasing

A stream type name is a fully qualified namespace path.
It maps to an AVRO data schema through the alias
mapping. Multiple stream type names can point to the
same data schema.

`spl.mycelium.xpath.raw.uri.get` and
`spl.mycelium.xpath.raw.uri.put` are different
operations — different stream types, different
functional identities. But their property bags have
the same structure: both carry args, both use value.
They alias the same data schema:
`spl.data.stream.operator`.

This is the carrier/meaning separation at the schema
level. The name is the meaning — it identifies the
operation, the language game, the protocol context.
The AVRO schema is the carrier — it describes the
data shape. Many meanings, few carriers.

### The Alias Mapping

All AVRO data schemas live under `spl.data.*` in the
`_schema` tree as `.avsc` files. Everything outside
`spl.data.*` is a stream type name that aliases to a
data schema.

The mapping lives in a single flat file:
`_schema/alias-mapping.txt`. Two columns — alias name
and schema name. Loaded once on server start into an
in-memory map.

```
spl.mycelium.process.execute       spl.data.mycelium.process.execute
spl.mycelium.process.debug         spl.data.mycelium.process.execute
spl.mycelium.xpath.raw.uri.get     spl.data.stream.operator
spl.mycelium.xpath.raw.uri.put     spl.data.stream.operator
spl.mycelium.xpath.raw.uri.remove  spl.data.stream.operator
```

No directory tree for aliases. No individual alias
files. The mapping is a single fact, easy to read,
easy to update. The `_schema` filesystem tree only
holds actual `.avsc` schema definitions under
`spl/data/`.

### Consequences

**The namespace grows freely.** Creating a new
operation, a new stream type, a new protocol — add a
line to the alias mapping. The meaning space is
combinatorial. The structural vocabulary stays tight.

**New data schemas are the exception.** A new schema
is needed only when the structure itself is genuinely
new — new fields, new shape. Most of the time, you're
creating meaning (new namespace path), not carrier
(new AVRO schema).

**Aliases can be switched.** A stream type can be
repointed to a different data schema without changing
the namespace identity. Change one line in the mapping.

**AVRO's native aliases complement this.** AVRO's
`aliases` field on a schema definition handles the
reverse direction — the schema declares what names it
can be read as. This is used during schema evolution
(writer/reader resolution). The alias mapping file
handles the forward direction — given a name, find the
schema. Both directions are needed.

---

## The Local Schema Registry

Schemas live in `_schema` on the repo root node.
Underscore prefix — it is metadata. The node carries
its own type vocabulary.

```
_schema/
  alias-mapping.txt
  spl/data/
    stream/
      record.avsc
      descriptor.avsc
      operator.avsc
    mycelium/
      process/
        execute.avsc
```

Reality is local. Each repository has its own schema
registry. What types a subject reality can speak is
determined by what schemas are present in its `_schema`
tree.

- **Self-contained.** Lift the repo, the schemas
  travel with it. No external registry dependency.
- **Discoverable.** Walk the tree to find what schemas
  exist. Read `alias-mapping.txt` to find what stream
  types are available.
- **Cascading.** A child node could carry its own
  `_schema` that overrides or extends the root's
  schemas. Protocol resolution on the ancestor axis
  finds the nearest `_schema` entry. Same mechanism as
  everything else.

The loader reads `.avsc` files by namespace path,
checks the alias mapping for stream type names, and
caches parsed types. Schemas are loaded on demand and
kept in memory.

---

## The Common Record Schema

The AVRO schema declared to avsc-rpc:

```
spl.data.stream.record {
  offset:    long     (default 0)
  timestamp: long
  key:       string
  value:     bytes    (default empty)
  headers:   array of spl.data.stream.header {
    key:   string
    value: [ bytes | spl.data.stream.descriptor {
      type:  string
      args:  null | spl.data.stream.typed {
        type:  string
        value: bytes
      }
      value: null | spl.data.stream.typed
    }]
  }
}
```

One schema. Headers is a flat list. The descriptor is
a union branch — resolved during deserialization.
Everything else is bytes, decoded on demand.

---

## The RPC Server's Job

1. Receive a record (`spl.data.stream.record`)
2. Find the `spl.data.stream` header entry
3. Read `.type` — already a string, zero-cost
4. Dispatch on the stream type name
5. If the handler needs specifics: find the type's
   own header entry, decode with the specific schema
6. If value contains another record: peel and recurse

---

## What This Design Resolves

**Header self-description** — the open area from the
Kafka design scope. The `spl.data.stream` descriptor
is the self-description mechanism. It tells you what
the record is and what its args and value contain.

**Fixed vs flexible headers** — resolved in favour of
the open list. No fixed fields, no structural
constraints. The descriptor provides the minimum.
Everything else is additional entries.

**Dispatch efficiency** — the descriptor is resolved
during deserialization. The happy path is zero
additional decoding.

**Dispatch mechanism** — the stream type in the
descriptor is the dispatch key. One path, one
mechanism, every message.

**Base vs specific schemas** — one base schema for all
stream types (`args`, `value`). Specific schemas
extend with additional fields. AVRO resolution handles
the many-reads pattern.

**The dual entry** — base descriptor for generic
handling, type-specific entry for handler-specific
data. Data in context and data out of context, in the
same flat list.

**Schema management** — data schemas under `spl.data`,
alias mapping for everything else. The `_schema` tree
on the repo root is the local registry. Reality is
local.

**The onion** — preserved as nesting. Context wraps
operation. Both are `spl.data.stream.record`. The
descriptor's typed references declare what value
contains. Peeling is deserialization.

---

## Open Areas

**Context accumulation** — as a record travels, it
accumulates header entries. How is ordering preserved?
Can entries be overwritten, or are they append-only?
Does the processing pipeline add entries or modify
existing ones?

**Schema cascading** — child nodes with their own
`_schema` overriding the root's schemas. The mechanism
is clear (ancestor axis resolution) but the
implementation is future work.

**Alias entry repetition** — the stream type's own
header entry alongside the base descriptor. The design
is resolved (data in context vs out of context) but the
implementation is deferred until we need it.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
