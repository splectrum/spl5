# Implementation Notes

Discussion notes for spl5 implementation planning.
Working through the design docs towards a work plan.

## Message Shape

The internal message follows the Kafka record format.
Five fields per record:

- **offset** — position/ordering (managed by
  infrastructure)
- **timestamp** — long int. When.
- **key** — XPath path expression. Where.
- **value** — opaque bytes. What.
- **headers** — array of key-value pairs. Namespaced
  metadata. Extensible.

Offset and timestamp are structural, not metadata.
Headers is purely for extension.

One shape for everything: data operations, function
calls, events, logs, execution traces, audit trails.
Streaming-native internally — can be put straight
onto Kafka topics without transformation.

### Logging

Messages are logged as files using timestamped
filenames: `<ms-since-epoch>-<seq>.json`. The
sequence digit handles collisions within the same
millisecond. Sortable, unique, immutable once written.

An append-only log on the filesystem. The logging is
the Kafka topic implemented as files in a context.
Same pattern as spl4 faf drops, now applied to the
message shape itself.

Debug/logging queues are just another stream of the
same message shape — log messages on timestamp,
offset-compatible.

## Fabric API

Six API contexts, all fabric. Three opaque, three
schema-aware:

| API | Visibility | Content |
|-----|-----------|---------|
| datauri | data nodes | opaque bytes |
| metadatauri | metadata nodes | opaque bytes |
| rawuri | all nodes | opaque bytes |
| data | data nodes | schema-interpreted |
| metadata | metadata nodes | schema-interpreted |
| raw | all nodes | schema-interpreted |

Same three operations (get, put, remove) across all
six. The uri level works with opaque bytes and path
structure. The schema-aware level adds content
interpretation through discovered schemas. Both are
base layer / fabric.

Data for data nodes only. Metadata for metadata
nodes (under context nodes) only — no data mixing.
Raw for all nodes. Keeps querying straightforward,
no mixing of concerns. Raw for special access:
diagnostics, recovery, migration.

The separation is structural, not a filter applied
after the fact. You pick your context and everything
you see belongs there.

### Default File Mapping

Default behaviour: filename is part of the key (as
is the node URI), file contents is value. The
natural filesystem-to-fabric mapping.

Key remapping — where the key comes from somewhere
other than the path — will be used extensively in
mycelium, but is not for this implementation step.

## Metadata Dimension

The single underscore prefix is a structural
primitive of the identifier grammar. It opens a
metadata subtree — a parallel namespace at any node.

`_server` means: a node named `server` in the
metadata dimension of the parent. The prefix is the
dimension selector, not part of the name.

Each underscore prefix encountered opens a new
subtree rooted at that point. Cascading:
`blog/_server/_process` is three trees:
- `blog` — data tree
- `_server` — metadata subtree of blog
- `_process` — metadata subtree of server

Maps to API visibility:
- datauri sees the data tree
- metadatauri sees the metadata subtrees
- rawuri sees everything

### Portability

A metadata subtree is structurally identical to any
other tree. The underscore prefix is just the
dimension marker. Strip the prefix — it's a normal
data tree. Insert it into a data context — it's just
data.

Full subtrees mounted as metadata are portable: lift
and shift. Mount with underscore prefix — metadata.
Mount without — data. Same content, different
dimension.

Metadata subtrees can be developed as standalone
subject realities (their own repos), then mounted
into other subjects via references. A server config,
a schema set, a process library — each a portable
tree that slots into any subject's metadata dimension.

## CLI

The CLI is a subject with its own node. One command:
`spl <logical-type> [data]` — no flags, no options.

Every invocation is two contexts meeting: the CLI
brings what it can do, the CWD brings what's there
to do it on.

### CLI as Server Node

For the first implementation step, the CLI node is
the subject reality's RPC server. It sits as a
metadata node on the repo root: `_server`.

The server node carries what the subject accepts:
registered message types, resolution logic, execution
modes. Local CLI invocations and remote RPC calls hit
the same node — same envelope, same resolution, same
path.

Later: split into client CLI (constructs and sends
envelopes) and server (receives and resolves). No
architectural change — the envelope interface is
already defined. Just deployment factoring.

### Resolution

The logical type resolves against the CWD's ancestor
axis. First match wins, nearest distance. No explicit
protocol/operation split — just a logical type that
resolves through the fabric.

The CLI wraps everything into a resolution envelope
(AVRO record) and dispatches via a single RPC:
`resolve(envelope) → envelope`.

### Execution Modes

From CWD context metadata, not CLI arguments:
- **sync** — resolve, execute, return. Default.
- **queue** — resolve, enqueue, acknowledge.
- **dry-run** — resolve, report, no state change.

### Debug

Debug is context metadata. Present on the ancestor
axis — execution wraps in debug. Remove it — normal
execution resumes. No code change, no restart.

## Resolution Envelope and AVRO

### Message as Envelope

The resolution envelope maps onto the Kafka message
shape. Timestamp, key, value, headers. The envelope
is an AVRO record — the schema is the contract.

Headers use the same key-value model: key is an AVRO
type identifier, value is its value. Key-value all
the way down.

### Logical Types and Physical Schemas

- **Logical types** — functional capability. What can
  be done. Resolved through the fabric.
- **Physical AVRO schemas** — data structure.
  Function + arguments. What the data looks like.
- **Mapping** — logical type maps to physical schema.
  The logical activates, the physical carries.

Single identifier system: an AVRO namespace, a git
repo, a logical type, a protocol, a fabric path —
all the same identifier. One system, multiple
dimensions read through different reader schemas.

Category theory fits naturally: logical types as
morphisms, composition through the fabric, properties
verifiable through the type system. Everything as
typed identifiers makes categorical structure explicit.

### "Is Like" — Readable As

AVRO's reader schema mechanism is "is like." Data
doesn't need to be the target format — it needs to
be readable through it. The conformance test: "can
this be read as" — not "is this identical to."

A logical type identifier declares what something
is like — what reader schemas can successfully read
it. Same data, different readers, different aspects.
Multiple "is like" relationships coexist. No
privileged reading (P4).

### Function Signatures as "Readable As"

Functions don't have strict signatures — only a
"readable as" signature. No "this function takes
exactly these parameters in this format." Just:
here's what I can read. If your input is readable
through my schema, it works. Otherwise it fails —
not "wrong type" but "unreadable."

A function can accept multiple input shapes without
overloading: structured JSON, partial fields, natural
language. All potentially readable through the same
reader schema.

### Natural Language Extension

AVRO will be extended to natural language readers.
A natural language input arrives. Two "read as" steps:

1. Read as logical type → identifies the function
2. Read as function arguments → extracts parameters

The function code never changes. It reads its input
through its own schema. Whether the input was JSON or
extracted from a natural language sentence — the
function sees structured arguments.

Same pipeline, different reader capability. No
separate NLP layer. No adaptation. Just readers that
handle natural language.

This is HAICC built into the fabric: human speaks
naturally, AI reads as structure, function executes.

### Introspection

Introspection is the CLI's own protocol, resolved in
its own context (the `_server` node), not the CWD's.
Different CLI configurations offer different
introspection depth.

## Namespace Structure

### The Backbone

```
spl                          — the framework
spl.mycelium                 — physical pillar
spl.mycelium.fabric          — substrate
spl.mycelium.metadata        — traversal, accumulation
spl.mycelium.data            — schema-aware access
spl.mycelium.process         — watchers, readiness
spl.splectrum                — logical pillar
spl.haicc                    — cognitive pillar
```

Each identifier in the tree has a life. Where that
life is tracked, it will be a repo (subject reality).
Each repo records the life and data specific to its
context — not of potential child contexts. Can be
informational, code, schemas, anything.

### Repo Boundaries Are Deployment

The namespace tree is the logical structure. Repo
boundaries are deployment decisions, not architecture.
Start with one repo holding a subtree section. When a
node's life warrants its own repo, split it out.

For prototyping: one repo, subtree structure following
namespace identifiers. Node boundaries clean even
though one repo wraps them all. Separation later is
lift-and-shift because the structure is already right.

### Node Self-Containment

Each node is self-contained. Its data, its metadata
dimension, its content — all within its own subtree.
No node stores anything about children or siblings.
No shared files at parent level that children depend
on. No index files listing children.

Copy a node in — it brings everything it needs. No
overlap, no conflicts. The tree structure is implicit
in the nesting, not maintained by any node.

The repo structure must support copy-and-paste of
subnodes without overlap. Proving this works in
practice is a key prototyping concern: drop a node
in, does it stand alone, extract it cleanly, does
the metadata dimension cascade, does traversal work.

## Bootstrap (Not in Scope for spl5)

The model: life can only spawn from life. Like a
computer starting from nothing — a minimum unit is
put in place and activated.

**Bootloader** — one-time act. A seed repo (already
alive) cloned to produce new life. Carries the
minimum: substrate operations, resolution envelope
schema, basic traversal metadata. Clone, scaffold,
done.

**Boot** — runs every time the subject activates.
Traversal initialises, contexts accumulate, protocols
discover themselves. The one pre-conditional protocol
that can't be discovered through traversal because
traversal doesn't exist yet.

**Thawing** — git repos are static, frozen.
Activating is thawing: dynamics layer starts on top
of static structure. Can freeze mid-process and
thawing picks up. State is in the fabric, not in
memory.

Every subject reality brought to life goes through
this process, even when continuing where it left off.

The full lifecycle (create from nothing, freeze,
thaw, pick up mid-process) is beyond spl5 scope.
For now: enough to get a working subject reality
running.

## Out of Scope for spl5

### Layers

The layering mechanism — stacked data layers with
read modes and synchronisation. Big subject. Layers
declared in context metadata, discovered during
traversal. Read modes per layer (direct, changelog-
aware, schema-interpreted). Synchronisation modes
(immediate, batched, on-demand). The fabric provides
the stacking infrastructure; specific layer types are
defined by protocol libraries.

### Immutability

Dirty/immutable records, transaction lifecycle,
mutable structures as projections. The principle:
data structures that are stored satisfy immutability
if they can be transformed into an immutable
structure. "Compatible with" — not required to be
immutable now, but transformable when needed.

### Safe Mode

Physical-layer-only access. Raw bytes, no schema
discovery, no interpretation, no process activation,
no layering. The recovery guarantee — when the fabric
has gone wrong, safe mode bypasses everything to reach
the raw physical layer. The floor is always solid.

### Security Model

Mycelium runs in a trusted environment by default.
Hard security boundary sits around the trusted
environment. Public deployment uses reinforced bubbles
with hard security boundaries. Trust is environmental,
not per-entity.

### Logical Type Repos

Natural extension of the namespace structure. Every
logical type as its own git repo. Clone it in — you
have the capability. Remove it — you don't. Including
CLI node variants, meaning languages, persona
definitions. All repos, all namespaced, all equal
standing (P4).

## Execute Message Design

### Self-Contained Computation in Kafka Wrapper

The execute message is a self-contained computation
record wrapped in the Kafka record shape. The same
message goes in and comes back — enriched with the
result.

The Kafka wrapper (offset, timestamp, key, value,
headers) is universal. The value field carries a
typed computation record whose AVRO type name
identifies the message type.

### Message Structure

```
spl.mycelium.execute.Exec {           ← AVRO type = message identity
  offset, timestamp,
  key: "/blog/submissions",            ← current node
  value: spl.mycelium.xpath.rawuri.get {  ← protocol operator
    offset, timestamp,
    key: ...,
    value: <input or output>,          ← opaque bytes
    headers: []
  },
  headers: [...]                       ← extensible metadata
}
```

The outer wrapper is the execution protocol. The
inner message is the protocol operator — also a
Kafka record. Same shape at every level.

### Request and Response

Request: the inner operator's value carries input
arguments. Output is absent.

Response: the same message returns with the inner
operator's value carrying the output. The outer
wrapper, the operator type, and the key are
unchanged.

For get operations, output naturally extends input
(keys → key-values). For transforms where input
and output schemas differ, the operator's value
schema defines both sides: { input, output }.

### Design Properties

- **Self-contained** — the value is the complete
  computation record. In streaming, consumers
  typically discard the Kafka wrapper and work with
  the value only. The inner record carries
  everything: operator, input, output, its own
  timestamps and keys. It can travel, be stored, be
  processed independently of the wrapper. The
  wrapper itself is more than transport — headers
  accumulate trace, debug, execution mode, timing.
  The wrapper is historicity: the memory of how the
  message has been handled. Strip the wrapper, the
  computation is self-contained. Keep the wrapper,
  you have the full journey.
- **Same shape** — Kafka record at every nesting
  level. Universal transport.
- **Computation as data** — the logical type + input
  is an unevaluated expression. After execution, it
  is the resolved value. Same message, different
  state.
- **Enrichment not replacement** — the message
  accumulates its result. Request context preserved.
- **Works sync and async** — echo back pattern is
  the same whether the response returns immediately
  or via a queue.

### Related Patterns

- **Tuple Spaces (Linda)** — request template and
  result share the same shape. Incomplete form
  becomes completed form.
- **Self-Contained Message** (Reactive Design
  Patterns) — input and output context coexist in
  one message.
- **Content Enricher** (Enterprise Integration
  Patterns) — message identity persists through
  enrichment.
- **Free Monads** — computation as data structure.
  Before evaluation: expression. After: value.
- **AVRO schema resolution** — response can have
  additional fields and still be "readable as" the
  same type. Enrichment built into the schema
  mechanism.

### Role of Headers

Headers are for extensible metadata — trace, debug,
execution mode, timing. Not for core message
content. The execution intent (logical type, input,
cwd) lives in the value, not in headers.

### Role of the AVRO Type Name

The AVRO record type name IS the message identity.
`spl.mycelium.execute.Exec` tells the server what
protocol this is. The inner type name
(e.g. `spl.mycelium.xpath.rawuri.get`) tells the
server which operator to resolve. No routing field
needed — the schema is the contract.

## spl5 POC — Implementation Sequence

Start from the server, work outward:

1. **AVRO RPC server** — bare minimum, running. One
   registered message: `spl.cli.execute` wrapping the
   Kafka record shape (timestamp, key, value, headers).

2. **CLI submitting** — `spl` sends execute messages
   to the server. The pipe works end to end.

3. **rawuri implementation** — get, put, remove on
   the filesystem. All nodes visible, opaque bytes.
   Prove fabric operations work through the RPC chain.

4. **Register rawuri on repo root node** — the first
   real metadata node. The API exists in the fabric
   as a context.

5. **Protocol resolution in cli.execute** — ancestor
   axis resolution. CLI resolves the logical type
   against the fabric.

6. **Expand** — add datauri, metadatauri. Learn from
   the prototype.

### Practical Questions to Resolve Early

- **Where does code live?** Likely `_src` metadata
  dimension. Must work with self-contained node
  pattern.
- **Where do schemas live?** `_schemas` metadata
  dimension. Must be discoverable during traversal.
- **AVRO reading implementation** — the "readable as"
  mechanism is central. Resolution envelope, message
  shape, fabric operations all depend on it. Get this
  working early.
- **Node structure proof** — self-contained nodes
  with metadata dimensions must support copy-paste
  without overlap. Prove before building on top.
