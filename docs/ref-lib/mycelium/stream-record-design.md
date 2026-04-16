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
data record (bytes).

```
headers: [{ key: string, value: bytes }]
```

The key is a fully qualified namespace path. The value
is AVRO-encoded data according to the schema that the
key names.

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
- `spl.data.stream` — the base header descriptor
  schema. The self-description entry.

The `spl.data` namespace is separate from
`spl.mycelium` (the fabric), `spl.splectrum` (the
language layer), and `spl.haicc` (the cognition layer).
Data schemas are carrier. The namespaces that use them
are meaning.

---

## The Base Header Descriptor

Every stream record carries an `spl.data.stream` entry
in its headers. This is the record's self-description
— the minimum required to get handling started.

The base data record contains at least the **stream
type** — the functional identity of this record. For
specific cases, the base can be extended with
additional fields relevant to stream handling.

The `spl.data.stream` entry tells the server: this
record's stream type is X, and its value contains Y.
This is the "headers about headers" mechanism — the
self-description that the Kafka design scope identified
as an open area.

---

## Stream Type as Header Entry

The stream type named in the `spl.data.stream`
descriptor also has its own entry in the headers list.
Its key is the stream type's fully qualified name.
Its value is the stream type's property bag — the
type-specific data.

So a record has at minimum two header entries:

1. `spl.data.stream` — the descriptor. Says what
   stream type this record is, what value contains.
2. The stream type's own key — e.g.,
   `spl.mycelium.process.execute`. Contains the
   type-specific property bag (execution mode,
   arguments, etc.).

Additional entries carry whatever else travels with
the record — provenance, historical data, applied
stream types, tracing, debugging context. Each is
another (key, value) pair. The list grows as the record
travels through the system.

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
declares that value contains a `spl.data.stream.record`.
The `spl.data.stream` descriptor in the inner record
declares that value is the data payload (method output).

Peeling the onion is: read the outer record's value
as another `spl.data.stream.record`, read its headers,
find its stream type, decode its property bag.

---

## Stream Type Categories

Stream types are not all operators. Different
categories have different relationships with value
and different property bag structures:

**Context types** — `spl.mycelium.process.execute`,
`spl.mycelium.process.debug`. Set the processing mode.
Value contains the thing being contextualized (another
stream record). Property bag carries context metadata
(execution mode, debug level).

**Operator types** — `spl.mycelium.xpath.raw.uri.get`,
`spl.mycelium.xpath.raw.uri.put`. Follow the method
signature pattern: args, output. Property bag carries
`args`. Value starts empty, fills with method output
on completion. The property bag's data schema defines
both `args` and `value` — the schema declares what
value means for this operation, even though value
lives at the top level of the record.

Value exists at two levels: **unpacked** as the
top-level record field (this is the data payload in
motion for this Kafka record), and **in the type
schema** (logically, the type defines what value
means). The unpacking is a structural fact — this is
what's moving. The schema is the semantic fact — this
is what it means.

More categories will emerge as the architecture needs
them. The categories are ours to define.

---

## Schema Aliasing

A stream type name is a fully qualified namespace path.
It is also a data schema name — or an alias of one.
Multiple stream type names can point to the same AVRO
data schema.

`spl.mycelium.xpath.raw.uri.get` and
`spl.mycelium.xpath.raw.uri.put` are different
operations — different stream types, different
functional identities. But their property bags may
have the same structure: both carry args, both use
value. They alias the same data schema.

This is the carrier/meaning separation at the schema
level. The name is the meaning — it identifies the
operation, the language game, the protocol context.
The AVRO schema is the carrier — it describes the
data shape. Many meanings, few carriers.

### Consequences

**The namespace grows freely.** Creating a new
operation, a new stream type, a new protocol — in
most cases you create an alias, a new name pointing
to an existing data schema. The meaning space is
combinatorial. The structural vocabulary stays tight.

**New data schemas are the exception.** A new schema
is needed only when the structure itself is genuinely
new — new fields, new shape. Most of the time, you're
creating meaning (new namespace path), not carrier
(new AVRO schema).

**Aliases can be switched.** A stream type can be
repointed to a different data schema without changing
the namespace identity. This makes the structure
flexible — the mapping between name and schema is a
fact in the fabric, not a compile-time binding.

**Self-discovery works through aliases.** Enumerating
the header keys on a record gives you a list of
namespace paths. Each path names a schema (directly
or through alias). The schemas present on the record
are discoverable by reading the keys. No external
registry needed.

---

## The Common Record Schema

The AVRO schema declared to avsc-rpc is simple:

```
spl.data.stream.record {
  offset:    long     (default 0)
  timestamp: long
  key:       string
  value:     bytes    (default empty)
  headers:   array of {
    key:   string
    value: bytes
  }
}
```

This is the one schema the RPC server knows. Every
stream record conforms to it. Everything else — stream
types, property bags, context, provenance — lives
inside the headers entries as AVRO-encoded bytes,
decoded per-key using the schema the key names.

The common schema carries everything without knowing
what's inside. The headers are opaque to the transport.
Meaning is resolved at the handling level, not the
transport level.

---

## The RPC Server's Job

1. Receive a record (`spl.data.stream.record`)
2. Read headers, find the `spl.data.stream` entry
3. Decode it — learn the stream type and what value
   contains
4. Find the stream type's own header entry
5. Decode the property bag using the stream type's
   schema
6. Dispatch on the stream type name
7. If the type is a context wrapper and value contains
   another `spl.data.stream.record` — peel and recurse

---

## What This Design Resolves

**Header self-description** — the open area from the
Kafka design scope. The `spl.data.stream` entry is the
self-description mechanism. It tells you what the
record is and what value contains.

**Fixed vs flexible headers** — resolved in favour of
the open list. No fixed fields, no structural
constraints. The base descriptor provides the minimum.
Everything else is additional entries.

**Dispatch mechanism** — the stream type in the
`spl.data.stream` entry is the dispatch key. One path,
one mechanism, every message.

**Schema management** — aliasing keeps the data schema
count small while the namespace of stream types grows
freely. Self-discovery through key enumeration removes
the need for a registry.

**The onion** — preserved as nesting. Context wraps
operation. Both are `spl.data.stream.record`. The
descriptor declares what value contains. Peeling is
decoding.

---

## Open Areas

**Base descriptor fields** — the `spl.data.stream`
data record needs its minimum fields defined. Stream
type is certain. Value content declaration is certain.
What else belongs in the base?

**Operator base schema** — the pattern of `args` and
`value` as reserved fields for operator-type stream
types. Does this become a formal base schema that
operator property bags extend? Or is it a convention?

**Schema resolution** — how does the server obtain the
schema for a given header key? Schemas are facts in
the fabric — discoverable through traversal. But the
RPC server needs them at message-handling time. How
are they made available?

**Context accumulation** — as a record travels, it
accumulates header entries. How is ordering preserved?
Can entries be overwritten, or are they append-only?
Does the processing pipeline add entries or modify
existing ones?

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*
