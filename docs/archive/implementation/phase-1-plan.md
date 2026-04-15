# spl5 Implementation Plan

Consolidated plan for the spl5 prototyping iteration.
Logical design — all physical decisions (language,
framework, file layout) are freedom of the implementer.

---

## Objective

Proof of concept implementing the mycelium fabric
architecture end-to-end. Prove the core chain works:
CLI → RPC server → fabric API → result. Everything
in one repo for prototyping, structured for later
separation into namespace repos.

## Reference

- Public reference library:
  jules-tenbos.github.io/in-wonder/
- Design docs in projects/01-engineering-foundation/

---

## 1. Message Shape

The internal message follows the Kafka record format.
One shape for everything: data operations, function
calls, events, logs, execution traces.

Five fields per record:

- **offset** — position/ordering (managed by
  infrastructure)
- **timestamp** — long int. When.
- **key** — XPath path expression. Where.
- **value** — opaque bytes. What.
- **headers** — array of key-value pairs. Namespaced
  metadata. Extensible. Each key is an AVRO type
  identifier, value is its value.

Request and response use the same shape. Bulk is the
only mode — single is bulk with count one.

### Logging

Messages logged as timestamped files:
`<ms-since-epoch>-<seq>.json`. Sequence digit handles
millisecond collisions. Sortable, unique, immutable.
An append-only log on the filesystem — the Kafka
topic implemented as files in a context.

---

## 2. Fabric API

Six API contexts, all fabric. Three opaque, three
schema-aware. Same three operations across all six:
get, put, remove.

| API | Visibility | Content |
|-----|-----------|---------|
| datauri | data nodes | opaque bytes |
| metadatauri | metadata nodes | opaque bytes |
| rawuri | all nodes | opaque bytes |
| data | data nodes | schema-interpreted |
| metadata | metadata nodes | schema-interpreted |
| raw | all nodes | schema-interpreted |

The uri level is purely structural — navigate,
retrieve, place, remove. The schema-aware level adds
content interpretation through discovered schemas.
Both are base layer / fabric.

Separation is structural: data for data nodes only,
metadata for metadata nodes only, raw for all nodes.
No mixing of concerns.

### Operations

| Operation | Input | Output |
|-----------|-------|--------|
| get | keys | key-values |
| put | key-values | key-values |
| remove | keys | key-values |

### Default File Mapping

Filename is part of the key (node URI), file contents
is value. Key remapping is not in scope for this step.

### Design Principles

- **API group as context** — "get, in the context of
  datauri." The context shapes the behaviour.
- **Raw is full visibility** — the unfiltered physical
  reality. Data and metadata are lenses.
- **Opaque at uri level** — purely structural.
- **Structure is behaviour** — resolution envelope as
  schema fact. No configuration, no flags.
- **Bulk only** — no singular case.

---

## 3. Metadata Dimension

The single underscore prefix is a structural primitive
of the identifier grammar. It opens a metadata
subtree — a parallel namespace at any node.

`_server` means: node named `server` in the metadata
dimension of the parent. The prefix is the dimension
selector, not part of the name.

Each underscore prefix opens a new subtree. Cascading:
`blog/_server/_process` is three trees:
- `blog` — data tree
- `_server` — metadata subtree of blog
- `_process` — metadata subtree of server

Maps to API visibility:
- datauri sees data trees
- metadatauri sees metadata subtrees
- rawuri sees everything

### Portability

Metadata subtrees are structurally identical to any
other tree. Mount with prefix — metadata. Mount
without — data. Full subtrees are portable: lift and
shift. Can be developed as standalone repos and
mounted via references.

### Node Self-Containment

Each node is self-contained. No node stores anything
about children or siblings. No shared files at parent
level. No index files. Copy a node in — it brings
everything. No overlap, no conflicts. Tree structure
is implicit in nesting.

---

## 4. CLI

One command: `spl <logical-type> [data]` — no flags,
no options. The CLI is a subject with its own node.

Every invocation is two contexts meeting: the CLI
brings what it can do, the CWD brings what's there
to do it on.

### CLI as Server Node

For prototyping, the CLI node is the subject reality's
RPC server. Sits as metadata node on repo root:
`_server`. Handles both local CLI invocations and
remote RPC calls — same envelope, same resolution.

Later: factor into client CLI + server. No
architectural change, just deployment.

### Resolution

Logical type resolves against CWD's ancestor axis.
First match wins, nearest distance. CLI wraps into
resolution envelope (AVRO record), dispatches via
single RPC: `resolve(envelope) → envelope`.

### Execution Modes (from context metadata)

- **sync** — resolve, execute, return. Default.
- **queue** — resolve, enqueue, acknowledge.
- **dry-run** — resolve, report, no state change.

### Debug

Context metadata. Present on ancestor axis —
execution wraps in debug. Remove — normal resumes.
No code change, no restart.

---

## 5. AVRO and Resolution

### Resolution Envelope

Maps onto Kafka message shape. The envelope is an
AVRO record — the schema is the contract.

### Logical Types and Physical Schemas

- **Logical types** — functional capability. Resolved
  through the fabric.
- **Physical AVRO schemas** — data structure.
  Function + arguments.
- **Mapping** — logical type maps to physical schema.
  The logical activates, the physical carries.

### Single Identifier System

An AVRO namespace, a git repo, a logical type, a
protocol, a fabric path — all the same identifier.
One system, multiple dimensions read through different
reader schemas.

### "Readable As" — Not Strict Signatures

AVRO reader schema mechanism: "can this be read as."
Functions don't have strict signatures — only a
"readable as" signature. If input is readable through
the function's schema, it works. Otherwise: unreadable.

Multiple input shapes without overloading. Structured
JSON, partial fields, natural language — all
potentially readable through the same reader schema.

### Natural Language Extension (Future)

AVRO extended to natural language readers. Two "read
as" steps: read as logical type (identify function),
read as arguments (extract parameters). Function code
never changes. Same pipeline, different reader.

---

## 6. Namespace Structure

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

### Repo Boundaries Are Deployment

Start with one repo, subtree structure following
namespace identifiers. Separation later is
lift-and-shift. Node boundaries clean even within
one repo.

---

## 7. Implementation Sequence

Start from the server, work outward:

### Step 1 — AVRO RPC Server

Bare minimum server running. One registered message:
`spl.cli.execute` wrapping the Kafka record shape.

### Step 2 — CLI Submitting

`spl` sends execute messages to the server. The pipe
works end to end.

### Step 3 — rawuri Implementation

get, put, remove on the filesystem. All nodes
visible, opaque bytes. Prove fabric operations work
through the RPC chain.

### Step 4 — Register on Root Node

Register rawuri on the repo root node as the first
real metadata node. The API exists in the fabric as
a context.

### Step 5 — Protocol Resolution

Implement ancestor axis resolution in cli.execute.
CLI resolves logical type against the fabric.

### Step 6 — Expand

Add datauri, metadatauri. Learn from prototype. Add
schema-aware APIs when AVRO reading is proven.

### Practical Questions to Resolve During Build

- **Where does code live?** Likely `_src` metadata
  dimension. Must work with node self-containment.
- **Where do schemas live?** Possibly cached in root
  node metadata. To be explored.
- **AVRO reading** — the "readable as" mechanism is
  central. Get working early.
- **Node structure** — prove self-containment and
  copy-paste before building on top.

---

## Not in Scope for spl5

- **Layers** — stacked data layers with read modes
  and synchronisation. Big subject.
- **Immutability** — dirty/immutable records,
  transaction lifecycle. Structures satisfy
  immutability if transformable into immutable form.
- **Safe mode** — physical-layer-only recovery access.
- **Security model** — trusted environment by default,
  reinforced bubbles for public deployment.
- **Logical type repos** — every logical type as its
  own git repo. Natural extension.
- **Bootstrap lifecycle** — bootloader, boot, thawing.
  The full create-from-nothing lifecycle.

---

## Emergent Properties

Properties that fall out of the design:

- **Stateless server** — fabric holds state, message
  carries intent. Server is the meeting point.
- **Caller control** — the message composes full
  intent. Each layer reads its own concerns.
- **Floating execution** — local, remote, embedded.
  The message shape doesn't change.
- **Git as distribution** — execution goes wherever
  the repo goes.
- **Ownership as write boundary** — read anywhere,
  write at origin. No write access — conversation
  with someone who does.
- **One server per subject reality** — subject is
  sovereign. No external orchestrator.
