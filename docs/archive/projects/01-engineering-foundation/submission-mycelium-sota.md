# Submission: Mycelium — State of the Art Positioning

Thought from spl5 project 01-engineering-foundation.

Expected outputs: reference page (comprehensive state
of art positioning), conversation piece.

---

## Context

Mycelium is a data fabric where immutable records form
the base layer and all mutable structures are derived
projections. Data is organized as git-backed
repositories representing subject realities. The
primitive is a record (key → content, opaque bytes)
within nested contexts. Operations are minimal (list,
read, create, update, del, move, copy). Three layers
separate logical, capability, and physical concerns.

This document positions mycelium against the current
state of the art (2025-2026) across all relevant
dimensions of data architecture.

---

## 1. Immutable Data Architectures

### Event Sourcing and CQRS

**Kurrent** (formerly EventStoreDB, rebranded Dec 2024)
is the most mature dedicated event store. ~150
customers, 50M+ downloads. Purpose-built for event
sourcing with globally ordered immutable event logs.

**Axon Framework** dominates the JVM ecosystem with
70M+ downloads. Axon Server 2025.0 broke Java-only
constraints, adding polyglot support via gRPC.

**Marten + Wolverine** ("Critter Stack") leads in
.NET, building event store and document store on
PostgreSQL. Recent releases added distributed async
projection processing.

**EventSourcingDB** is a notable newcomer (1.0 May
2025). Single static binary, zero dependencies. Uses
CloudEvents format. Own query language (EventQL).
SDKs across seven languages. Version 1.1 introduced
Dynamic Consistency Boundaries.

**Datomic** (Rich Hickey, now maintained by Nubank
with 100M+ customers) treats data as immutable facts
(datoms). Transactions add facts but never update or
remove. Now Apache 2.0, available as embeddable
"Datomic Local." The purest expression of "facts as
data" in production.

### Unsolved Problems

- Schema evolution across long-lived event streams
  has no universal solution
- Projection rebuild cost at scale is expensive and
  operationally risky
- Eventual consistency between write and read models
  creates UX challenges
- Operational complexity: teams need 18+ months to
  become proficient
- Cross-aggregate transactions architecturally
  discouraged but practically needed

### Mycelium's Position

Mycelium's immutable records are conceptually event
sourcing's immutable events. Key difference: the
primitive is a record (key → content), not an event.
Events describe transitions; records describe state.
Closer to Datomic's "facts as data" than to
traditional event sourcing. "All mutable structures
are derived" maps directly to CQRS read models.

Mycelium places immutability at the base layer of
the entire fabric. Everything mutable is derived.
This is stronger than event sourcing (immutable event
stream) or lakehouse formats (immutable snapshots).
Mycelium does not have an immutable component; it is
an immutable foundation with mutable projections.

---

## 2. Data Lakehouse / Open Table Formats

### Current State

**Apache Iceberg** dominates with 78.6% exclusive
adoption. Engine-agnostic with native support in
Spark, Flink, Trino, Snowflake, and others. Metadata
architecture (manifest lists, manifests, data files)
creates immutable snapshots per transaction.

**Delta Lake** holds 39.3% adoption. Spark-native,
deep Databricks integration. UniForm (Delta 3.0)
allows reading Delta as Iceberg, suggesting
convergence.

**Apache Hudi** strong for streaming ingestion and
frequent upserts via record-level index.

**Apache Paimon** (formerly Flink Table Store) is
streaming-first, using LSM-tree file organization to
unify batch and stream.

**DuckLake** (May 2025, from DuckDB team). Key
innovation: metadata in a SQL database, data in
Parquet on object storage. Supports atomic
cross-table operations. A fundamentally simpler
approach.

All formats are fundamentally immutable: every write
creates a new snapshot referencing new data files.
Time travel queries reference historical snapshots.
Schema evolution at metadata layer without rewriting
data.

### Unsolved Problems

- Garbage collection of old snapshots: no clean
  answer for "keep everything forever efficiently"
- Cross-table transactions remain difficult
- Small file problem from frequent streaming writes
- Catalog interoperability across engines

### Mycelium's Position

Lakehouse formats expose one paradigm (tables) to
multiple engines. Mycelium exposes one immutable base
to multiple paradigms — file, XPath, relational,
document. The consumer chooses their entire data
model, not just their engine. No access format is
privileged (P4).

DuckLake's insight of SQL metadata + open data is
relevant: mycelium uses git for metadata (context
definitions) while physical substrates vary.
Iceberg's manifest-tree is conceptually similar to
git's commit tree.

---

## 3. Decentralised Data

### Data Mesh

Data mesh has reached the "slope of enlightenment."
Key lessons:

- Cultural change is the largest barrier (18-24
  months)
- Pure mesh is rare: most implementations are
  mesh + fabric hybrids
- GoDaddy: mesh for 300 teams, 60% cost reduction
- Kroger: mesh ownership + fabric governance

### Data Fabric

Global market USD 3.1B (2025), projected USD 12.5B
by 2035. Gartner positions it as the architecture
automating governance across environments.

### Decentralised Storage

**IPFS** remains dominant for content addressing.
60%+ of Web3 dApps use IPFS/Filecoin. Limitations:
no built-in persistence, latency issues.

**Filecoin** announced Onchain Cloud (Jan 2026),
repositioning to full-stack decentralized cloud.

**Arweave** launched AO (Hyper-Parallel Computing,
Feb 2025), a compute layer on permanent storage.
"Pay once, store forever."

### Mycelium's Position

Data mesh distributes ownership across human teams
(organisational). Mycelium distributes data itself
across autonomous reality bubbles (ontological).
No central authority; addressing by ownership.

Data fabric creates unified integration. Mycelium
has no unified layer — only coupling between
realities through shared immutable records.

IPFS is infrastructure (storage/retrieval). Mycelium
is a data model. IPFS could serve as a physical
layer underneath mycelium. They operate at different
abstraction levels.

---

## 4. Version-Controlled Data

### Current State

**LakeFS** is the enterprise leader. Git-like
versioning on existing data lakes. In Nov 2025,
lakeFS acquired DVC, consolidating the two largest
data versioning communities.

**Dolt** is the most literal "git for data": a
MySQL-compatible database where every table has
branch, merge, diff, clone. Limited to structured
tabular data.

**DVC** (Data Version Control) continues as
independent open source. Extends git with pointer
files for large datasets.

**Project Nessie** provides git-like versioning at
the catalog level for Iceberg. Branch, tag, commit
on table metadata without copying data.

### What Works, What Doesn't

Works: branching, isolated environments, audit
trails, rollback, diff on structured data.

Doesn't work well: merging conflicting data changes,
scaling to massive datasets, cross-repository lineage,
schema conflicts during merge.

### Mycelium's Position

This is the closest existing category. Key
differentiator: existing tools bolt git semantics
onto databases (Dolt) or data lakes (LakeFS, Nessie).
Mycelium starts from git as the native substrate and
builds data operations on top.

Git provides a full graph of evolution across parallel
lines — richer than lakehouse point-in-time snapshots.

Mycelium's "subject realities" model may be a better
framing than trying to merge divergent data states:
each repository is an independent view, shared reality
emerges from interaction.

---

## 5. Content-Addressable Storage

### Current State

**IPFS** remains the reference implementation.
Content identified by CID, distributed hash table.
Mature but operationally complex.

**Iroh** (n0 inc) is a Rust-based modular networking
stack using BLAKE3 content addressing. Explicitly not
IPFS-compatible. Components: iroh-blobs (content
transfer), iroh-gossip (pub-sub), iroh-docs
(eventually-consistent KV store). Targeting 1.0 late
2025.

**Veilid** (Cult of the Dead Cow, launched DEF CON
31) combines TOR-like privacy with IPFS-like content
addressing. Pre-1.0 but actively maintained (v0.5.3,
March 2026).

### Key Patterns

- Content addressing as primitive: data identified by
  hash, not location
- Addressing separated from storage
- Deduplication as natural consequence
- Integrity verification built into the address

### Mycelium's Position

Content addressing is deeply compatible with
mycelium's immutable-first architecture. Git is
already a content-addressable system (objects by SHA
hash). Mycelium implicitly uses CAS at the substrate
level.

Iroh's modular approach (blobs, gossip, docs as
separate concerns) mirrors mycelium's decomposition.
The CAS mutability challenge maps to mycelium's
"immutable records, mutable projections" split.

---

## 6. P2P Data Systems

### Hypercore Protocol (Holepunch/Pear)

The foundation: a secure, distributed, append-only
log. Flat in-order Merkle tree, blake2b-256 hashing,
ed25519 signing. Sparse replication — download only
what you need.

**Hyperbee** — append-only B-tree on a Hypercore.
Sorted key-value store with range queries, history
stream, diff stream, sub-databases, snapshots,
atomic batches. Every modification creates a new
version.

**Hyperdrive** — P2P file system built on Hyperbee
(file metadata) + Hyperblobs (file content on a
second Hypercore). Supports files of any size. Sparse
by default.

**Autobase** — multi-writer layer solving Hypercore's
single-writer limitation. Each participant has their
own Hypercore. A causal DAG tracks dependencies.
Autobase linearizes all writers into a deterministic
order, producing a merged view (typically a Hyperbee).
Event sourcing over a causal DAG.

**Corestore** — manages collections of Hypercores.
All keys derived from a single master key.
Namespacing prevents collisions. Single replicate()
call handles all cores.

**Keet** (flagship app) uses the full stack: messages
as Hypercore appends, rooms as Autobase instances,
Hyperbee as state engine, Hyperdrive for file
transfers, Hyperswarm/HyperDHT for discovery.

**Pear Platform** organizes app data through a
platform Corestore. Applications are Hyperdrives
replicated P2P via pear:// links. Built on Bare, a
minimal cross-platform JavaScript runtime.

### CRDTs and Local-First

**Automerge** reached production with 2.0. Mature
CRDT for nested JSON-like structures. Automerge-repo
provides networking/storage adapters.

**Yjs** dominates collaborative text editing. Each
client has an append-only log of CRDT updates.

The local-first movement is growing significantly.
FOSDEM 2026 hosted its first dedicated devroom. Key
sync engines: ElectricSQL, Jazz, PowerSync, Zero.
Linear (issue tracker) is the poster child.

### Mycelium's Position

Hypercore's append-only log is architecturally
similar to mycelium's immutable records. The full
Holepunch stack demonstrates P2P data at production
scale. Particularly relevant:

- Autobase's event sourcing over causal DAG is the
  multi-writer pattern mycelium would need for
  cross-subject interaction
- Hyperbee's versioned B-tree validates the
  "immutable base, derived views" pattern
- Sparse replication is critical for subject
  realities where participants need only their
  relevant subset
- CRDTs could provide conflict-free merging where
  git merge falls short

The local-first pattern (work locally, sync when
connected) maps to mycelium's git-backed model where
each repository operates independently.

The Holepunch stack is the most natural physical
substrate for mycelium's P2P ambitions. Hypercore as
the immutable append-only layer, Hyperbee for
indexed views, Hyperdrive for file-based contexts,
Autobase for multi-writer coordination. The Splectrum-
Holepunch proposal explores this alignment in detail.

---

## 7. Blockchain-Adjacent Databases

### What Happened

**Amazon QLDB** fully deprecated July 31, 2025.
AWS recommended migrating to Aurora PostgreSQL
with ledger extensions.

**BigchainDB** minimal visible development activity.

**Ceramic Network** underwent major transition.
3Box Labs (Ceramic) + Textile (Tableland) merged to
form **Recall Network** — decentralized protocol for
AI agent reputation. Ceramic transitioning to
ceramic-one, deprecating js-ceramic and ComposeDB.

The "blockchain database" category has largely
failed as a standalone market. Useful ideas
(immutable logs, cryptographic verification) absorbed
into mainstream databases: Postgres ledger
extensions, SQL Server ledger tables, Oracle
Blockchain Table.

### Mycelium's Position

QLDB deprecation is cautionary: don't build on
proprietary immutable infrastructure. Ceramic's
pivot shows pure decentralized data is hard to
sustain without a specific use case.

Mycelium's approach is trust-model-agnostic:
blockchain is optional consensus at boundaries, not
structural dependency. Git commits are already
cryptographically linked and immutable. Mycelium
doesn't need blockchain for its core immutability
guarantee.

---

## 8. Graph Databases and Knowledge Graphs

### Current State

**Neo4j** remains dominant. Leaning into AI with
GraphRAG (>90% accuracy on complex queries where
vector retrieval scores ~0%). Neo4j Aura Agent
enables AI agents on graph data.

**TerminusDB** is the most relevant to mycelium:
immutable graph database with git-like semantics.
Delta encoding, succinct data structures (13.57
bytes per triple). Branch, merge, push, pull, clone,
time-travel, diff. DFRNT assumed stewardship 2025.
Claims 92% faster multi-branch queries than Neo4j.

**Dgraph** acquired by Istari Digital (Oct 2025).
Native GraphQL. Integration into data fabric.

### Mycelium's Position

TerminusDB's architecture (delta-encoded immutable
graphs with git semantics) is the closest existing
system to mycelium's vision applied to graph data.

GraphRAG shows graph structures are becoming essential
for AI reasoning over connected data. If mycelium
contexts form graphs of relationships, graph
traversal and reasoning become important.

Mycelium contexts are already graph-like: recursive
nesting, cascading references, cross-subject
coupling. The graph is implicit in the structure.

---

## 9. AI-Native Data Systems

### Agent Memory

A new category: persistent memory for AI agents.
Three tiers becoming standard:

**Mem0** leads (~48K GitHub stars, $24M funding Oct
2025). Exclusive integration as AWS Agent SDK memory
provider. Extracts memories from interactions. 91%
lower p95 latency, 90% token savings.

**Letta** (formerly MemGPT) uses three-tier model:
core memory (always in-context, like RAM), archival
memory (searchable, like disk), recall memory
(conversation history).

**Zep** emphasizes temporal and episodic memory —
interactions as meaningful sequences, not flat logs.

Three scopes becoming standard: **episodic** (past
interactions), **semantic** (facts and preferences),
**procedural** (learned behaviors).

### Vector Databases

Market maturing with clear segmentation. Pinecone
(enterprise default), Milvus (industrial scale),
Qdrant (cost efficient), Weaviate (hybrid search +
knowledge graph), Chroma (prototyping). PostgreSQL
with pgvector absorbing the bottom of the market.

### Graph Memory for Agents

Moved from experimental (2024) to production (2026).
Vector memory retrieves semantically similar facts;
graph memory retrieves relationally connected facts.
Production systems increasingly combine both.

### Mycelium's Position

Agent memory maps remarkably well to mycelium.
Mem0's extract-store-retrieve is event sourcing for
agent interactions. Letta's three tiers could be
mycelium contexts at different levels. Zep's
temporal structure is an append-only log of
experiences.

Mycelium's subject realities could serve as the data
substrate for agent memory: versioned, structured,
temporal, multi-scope. Each agent's knowledge and
history as a git-backed repository.

---

## 10. Reactive/Event-Driven Architectures

### Current State

**Apache Kafka** remains the de facto standard.
Ecosystem expanding: Kafka + Flink for real-time,
diskless variants (AutoMQ), serverless (WarpStream).

**Redpanda** made a dramatic pivot, rebranding as
"Agentic Data Plane" (Oct 2025). Acquired Oxla
(SQL engine). ADP provides streaming, SQL, OIDC
agent identity, AI gateway, audit trails. Claims
10x better tail latency than Kafka.

**NATS JetStream** fills the lightweight niche:
built-in persistence, exactly-once delivery, KV
store, simpler operations. Ideal for event sourcing
and audit logs.

### Key Trend

Convergence of streaming and AI: event streaming is
becoming AI agent infrastructure. Governance built
into the streaming layer.

### Mycelium's Position

Git is mycelium's change propagation mechanism.
The question: is git's push/pull sufficient for
real-time reactivity, or does a streaming layer
complement it?

NATS JetStream is interesting for its lightweight
footprint — potentially serving as the realtime
complement to git's durable-but-not-realtime model.

---

## Summary Positioning

| Dimension | State of Art | Mycelium |
|---|---|---|
| Immutability | Feature of components | Base layer of entire fabric |
| Decentralisation | Organisational (mesh) or infrastructural (IPFS) | Ontological — autonomous reality bubbles |
| Versioning | Bolted onto databases or data lakes | Intrinsic — git as native substrate |
| Blockchain | Native dependency or absent | Optional consensus at boundaries |
| Access | Multi-engine over one paradigm | Multi-paradigm over one immutable base |
| Trust | Binary: trusted or trustless | Trust-agnostic, hardened at boundaries |
| Data world | Assumed queryable whole | Logical totality; only realities instantiated |
| P2P | Infrastructure layer (Hypercore, IPFS) | Data model that uses P2P as physical layer |
| Agent memory | Dedicated systems (Mem0, Letta) | Native fit — versioned, structured, multi-scope |
| Graph | Separate database category | Implicit in context structure |
| Grounding | None claimed | Splectrum seed principles |

## What the Landscape Validates

1. **Immutable-first is mainstream.** Every major
   trend converges on immutability as base layer.
2. **Derived views from immutable bases is proven.**
   CQRS, lakehouse time travel, event sourcing
   projections all demonstrate viability.
3. **Git semantics for data are gaining traction.**
   Nessie, LakeFS, Dolt, TerminusDB. None start from
   git as native substrate.
4. **Content addressing is foundational.** IPFS,
   Iroh, git itself validate the pattern.
5. **Agent memory needs what mycelium provides.**
   Persistent, versioned, structured, temporal,
   multi-scope.

## What the Landscape Warns

1. **Schema evolution is the hardest unsolved
   problem.** Mycelium's opaque-bytes primitive
   sidesteps it at the record level but will face it
   at the interpretation layer.
2. **Data merge is much harder than code merge.**
   Subject realities as independent views may be a
   better framing than merge.
3. **Pure decentralization has struggled.** QLDB
   deprecated, BigchainDB stalled, Ceramic pivoted.
   Useful patterns survive in pragmatic architectures.
4. **Operational complexity kills adoption.** Event
   sourcing, IPFS, data mesh all report this.
5. **The market converges on hybrid approaches.**
   Purity loses to pragmatism.

## Where Mycelium Is Genuinely Novel

No existing system combines all of:
- Git as native physical substrate (not bolted on)
- Content-opaque records (model does not interpret)
- Nested contexts with metadata-driven traversal
- Three-layer separation (logical/capability/physical)
- Subject realities as independently-operated repos
- Philosophical grounding (Splectrum seed principles)

Closest analogues: TerminusDB (immutable graph +
git semantics), Datomic (immutable facts + time
travel). Neither uses git as actual substrate,
neither has mycelium's context/traversal model.
