# Submission: Mycelium — Top Level Design

Thought from spl5 project 01-engineering-foundation.

Expected outputs: reference spec (mycelium top level
design), conversation piece, state of the art
positioning, vocabulary updates.

---

## What Mycelium Is

Mycelium is the fabric from which realities are
created. It creates repo constructions that model
subject reality. It weaves data and process together.

The dynamic of a subject consists of an algorithmically
driven process triggering based on data state.

## The Fabric

The mycelium is a data fabric into which data and
process are woven through a Common Data Model (CDM).
The CDM structures data using a file/folder tree with
cascading context notes. Each node carries metadata
covering structure requirements, process requirements,
and search. Context notes cascade downward with local
override, scoping what can happen at each level.

### The Primitive

The fabric is built from one primitive:

**Record** = key → content (opaque bytes).
**Context** = bounded area that contains records.
Records can themselves be contexts.

Keys are meaningful only within their containing
context. Content is opaque — the model does not
interpret it. Everything else is layered above.

Proven sufficient across 18 projects. No extensions
required.

### Operations

Seven operations act on the fabric:

| Operation | Category | Description |
|---|---|---|
| list | read | Keys in a context |
| read | read | Content of a record |
| create | write | New record |
| update | write | Overwrite existing record |
| del | write | Remove a record |
| move | compound | Relocate across contexts |
| copy | compound | Duplicate across contexts |

Compound operations compose from primitives. The
operation set is minimal and complete.

## The Boundary

The repository — a git repository — is the boundary.
It constitutes the subject reality as a distinct
entity with its own identity, history, and integrity.
Within the boundary, data is structured but not
ontological — the folder tree and context notes
define functional scope.

## Subject Realities

There is no data world sitting somewhere as a single
system. The data world is a logical totality — the
sum of everything across the fabric. What actually
exists is always mycelium fabric expressed as reality
bubbles.

Each bubble is a scoped, working implementation. The
whole emerges from partial couplings between bubbles
— shared reality is produced by interaction, not
discovered behind it.

## Immutability as Base Layer

Immutability is the default. Two immutable patterns
operate at the base:

- **Atomic immutable records** — a complete fact,
  arrives whole, stays whole.
- **Data change records** — a fact about a change,
  what moved from what to what.

Both are simply records from the fabric's perspective.
The distinction in meaning lives in the CDM context
notes.

Mutable structures — tables, indexes, document
libraries — are projections computed from the
immutable base. They exist for practical work but are
never the source of truth. They can be discarded and
rebuilt from the immutable records.

This is a stronger commitment than event sourcing or
lakehouse formats. Mycelium does not have an immutable
component; it is an immutable foundation with mutable
projections.

## Transaction Lifecycle

Data in progress is mutable and dirty. When a
transaction closes, the same data, in the same
structures, becomes immutable — a clean record in the
fabric, referenceable by the whole mycelium.

Open state before consensus, settled state after. The
same mutable structures serve as working space during
a transaction and become permanent record at its
close. The consensus mechanism is pluggable — a
simple local commit or a full blockchain protocol.

## Context Layer

The context layer sits between the logical interface
and the data:

**Traversal** — walk the path from root to target.
At each segment, check for context definitions
(metadata). Merge into accumulator. Nearest distance
wins — inner context overrides outer.

**Flat contexts** — a context marked flat treats its
interior as content, not sub-contexts. Traversal hops
over physical structure to the resource directly.

**Metadata-driven behavior** — mutability, changelog
mode, and enforcement are driven by metadata
accumulated during traversal. No flags, no
configuration. Structure is behavior.

## Behavioral Principles

**Structure is behavior.** No flags, no configuration.
A context with a bin has soft delete. A flat context
skips interior traversal. What you build is how it
behaves. What you don't build doesn't exist as a
possibility. This is an architecture of absence —
desirable properties emerge from what is not present
rather than from what is policed.

**Nearest distance.** Definitions reside closest to
their realization. Inner overrides outer.

**Data-triggered processing.** Data state drives
progression. Presence/absence determines what happens
next. Stateless steps, data as checkpoint.

## Point of View

The working directory sets the point of view (POV).
POV determines what you can see and how you identify
it.

**Resources** are relative to POV. You can only see
what is in front of you. Paths go forward, never
backward above POV.

**Functionality** — protocol operations — is
root-relative. Regardless of where you stand, all
registered operations are available.

The subject never touches the data world directly.
It only knows the interface — how it interacts with
the data world through its protocols from its POV.

## References

When a resource is behind POV but access is required,
cascading references bring it into view. A reference
creates a local identity for a remote resource.

References are read-only. Modification uses
copy-on-write to the local context. Read wide, write
local.

The graph of references defines the reachable set
from any POV. No reference, no access — structure
determines visibility, not permissions.

## Interaction Modes

**Default mode:** data state propagation. Subjects
react to state changes in the fabric. Decoupled,
reactive, no direct communication needed.

**Conversational mode:** direct protocols between
subjects. A CDM-level process concern, not a fabric
concern.

The mycelium is a propagation medium operating in a
trusted environment. Boundary gating — trust decisions
about what crosses between contexts — is handled by
higher-level process.

## Addressing

Addressing is solved by ownership. The subject
reality that creates data owns it, identified by the
repo's unique endpoint. Cross-references from other
realities trace back to the originating identifier.
Fully decentralised, no central registry.

Within a subject, XPath-style addressing navigates
contexts, accesses records, and reaches metadata
through one uniform scheme.

## The Protocol Stack

Protocols are the languages through which subjects
interact with the fabric. The stack realizes the
logical model:

**mc.xpath** — resolves paths to locations.

**mc.core** — five primitives (list, read, create,
update, del). Buffer in, buffer out. The stable
contract.

**mc.raw** — format interpretation and compound
operations (move, copy). Pre-semantic.

**mc.data** — user data view (.spl filtered out).

**mc.meta** — metadata view (.spl/meta/ scoped).

**mc.proto** — protocol resolution (.spl/proto/).

Each layer adds vocabulary over the one below. The
simplest level has full power. Higher layers add
clarity, not capacity.

## Public Deployment

Subject realities can be encapsulated in reinforced
bubbles and floated into public hostile environments.
The bubbles interact peer-to-peer. The underlying
data remains in the trusted fabric. The bubble is a
disposable projection — if compromised, the trusted
fabric is unaffected.

Trust-model-agnostic: trusted by default, hardened at
boundaries. Blockchain is an optional consensus
mechanism at boundaries, not a structural dependency.

## Alignment with Splectrum Principles

**P1 — Language is relational.** The primitive is a
relation (key → content in context). The fabric is
relational all the way down.

**P2 — Language is the medium through which a subject
experiences reality.** The subject's experienced
reality is the data state the fabric holds in context.
There is no hidden data world behind it.

**P3 — Language is where subjects share knowledge
about reality.** Shared reality emerges from coupling
between subject realities through data state. Like
decoherence, shared reality is produced by interaction.

**P4 — Languages have equal standing in potential.**
Multiple access interfaces, none privileged. Raw file,
XPath, relational, document — all are equal views onto
the same fabric.

**P5 — Together they form a web of growing
complexity.** The fabric grows. What's built persists.
New realities spawn from existing ones.

---

## State of the Art Positioning

### Immutable Data Architectures

Event sourcing, lakehouse table formats (Iceberg,
Delta Lake, Hudi), and immutable databases (Datomic,
EventStoreDB) all use immutability — but as a feature
of specific components. Mycelium places immutability
at the base layer of the entire fabric. Everything
mutable is derived. A stronger commitment than any
current approach.

### Decentralised Data

Data mesh distributes ownership across human teams.
Mycelium distributes data itself across autonomous
reality bubbles — ontological decentralisation, not
organisational. Data fabric creates a unified
integration layer; mycelium has no unified layer, only
coupling between realities through shared immutable
records. IPFS is infrastructure (storage/retrieval);
mycelium is a data model that could use IPFS as a
physical layer.

### Version-Controlled Data

Dolt applies git semantics to tables within a
database. Mycelium makes the git repo the fundamental
unit of data existence and layers multiple access
interfaces on top. Versioning is intrinsic to the
fabric, not a feature bolted onto a database. Compared
to lakehouse time travel, git provides a full graph of
evolution across parallel lines, not just point-in-time
snapshots.

### Blockchain and Trust

Most systems are either blockchain-native or
blockchain-free. Mycelium is blockchain-ready at the
boundary without being blockchain-dependent at the
core. The transaction lifecycle is structurally
identical regardless of the consensus mechanism.
Blockchain slots in as optional consensus for hostile
environments without changing the architecture.

### Access Interface Pluralism

Lakehouse formats expose one paradigm (tables) to
multiple engines. Mycelium exposes one immutable base
to multiple paradigms — file, XPath, RDBMS, document.
The consumer doesn't choose an engine; they choose
their entire data model. No access format is
privileged (P4).

### Summary

| Dimension | State of Art | Mycelium |
|---|---|---|
| Immutability | Feature of components | Base layer of fabric |
| Decentralisation | Organisational or infrastructural | Ontological — autonomous reality bubbles |
| Versioning | Applied to tables or snapshots | Intrinsic via git as boundary |
| Blockchain | Native dependency or absent | Optional consensus at boundaries |
| Access | Multi-engine, one paradigm | Multi-paradigm, one base |
| Trust | Binary — trusted or trustless | Trust-agnostic, hardened at boundaries |
| Data world | Assumed queryable whole | Logical totality; only realities instantiated |
| Grounding | None | Splectrum seed principles |

Mycelium does not compete with any single technology.
It operates at a different level of abstraction — a
data fabric design that could be implemented using
combinations of existing tools while making
architectural commitments none make individually.

---

## Component Areas (Separate Documentation)

- The primitive — record/context model
- Operations — realization across protocol stack
- Context layer — traversal, metadata, changelog
- Addressing — XPath-style navigation
- References — horizontal, vertical, copy-on-write
- Protocol stack — factory pattern, registration,
  resolution, scope isolation
- Implementation patterns — P1-P8
- Bootstrap — startup sequence
- Execution model — execution documents, logging
- Discover — tailored meaning extraction (direction)
