# Mycelium Design Review

## Overview

Mycelium is a data fabric architecture where immutable records form the base layer and all higher-level structures — mutable tables, document libraries, indexes, subject realities — are derived representations. The design addresses P0 (being implies language — the boundary is the creation) and P2 (language is the medium through which a subject experiences reality) through storage and contextual availability of data state.

The design serves three goals:

1. **Splectrum alignment** — the fabric embodies the philosophical framework at the data level.
2. **Decentralisation alignment** — the architecture is native to decentralised, peer-to-peer, and blockchain-ready thinking.
3. **Frictionless access without lock-in** — one immutable base, many interchangeable interfaces, no privileged access format.

## Core Architecture

### The Fabric

The mycelium is a data fabric into which data and process are woven through a Common Data Model (CDM). The CDM structures data using a file/folder tree with cascading context notes. Each node carries metadata covering structure requirements, process requirements, and search. Context notes cascade downward with local override, scoping what can happen at each level.

### The Boundary

The repository — typically a git repository — is the boundary. It constitutes the subject reality as a distinct entity with its own identity, history, and integrity. Within the boundary, data is structured but not ontological — the folder tree and context notes define functional scope, not nested beings.

### Immutability as Base Layer

The fundamental design commitment: immutability is the default. Two immutable patterns operate at the base:

- **Atomic immutable records** — a complete fact, arrives whole, stays whole.
- **Data change records** — a fact about a change, what moved from what to what.

Both are simply records from the fabric's perspective. The distinction in meaning lives in the CDM context notes.

### Mutable as Derived

Mutable structures — tables, indexes, document libraries — are projections computed from the immutable base. They exist for practical work but are never the source of truth. They can be discarded and rebuilt from the immutable records.

### Transaction Lifecycle

Data in progress is mutable and dirty. When a transaction closes, the same data, in the same structures, becomes immutable — a clean record in the fabric, referenceable by the whole mycelium. This mirrors a blockchain model: open state before consensus, settled state after. The same mutable structures serve as working space during a transaction and become permanent record at its close.

### Access Interfaces

Multiple access layers over a single underlying structure:

- Raw file/folder access at the base.
- XPath syntax for relational queries across the tree.
- Conventional interfaces (RDBMS, document repo) at higher levels.

All are views onto the same fabric. One truth, many access languages. No access format is privileged. The consumer works in whatever paradigm suits them.

### Subject Realities

There is no data world sitting somewhere as a single system. The data world is a logical totality — the sum of everything across the fabric. What actually exists is always mycelium fabric expressed as reality bubbles. Each bubble is a scoped, working implementation. The whole emerges from partial couplings between bubbles, analogous to decoherence — shared reality is produced by interaction, not discovered behind it.

### Interaction Modes

- **Default mode**: data state propagation. Subjects react to state changes in the fabric. Decoupled, reactive, no direct communication needed.
- **High-end intent**: direct conversational protocols between subjects. A CDM-level process concern, not a fabric concern.

The mycelium itself is a propagation medium operating in a trusted environment. Boundary gating — trust decisions about what crosses from private to public or between contexts — is handled by higher-level process.

### Addressing

Addressing is solved by ownership. The subject reality that creates data owns it, identified by the repo's unique endpoint. Cross-references from other realities may rewrite local paths but trace back to the originating identifier. Fully decentralised, no central registry.

### Public Deployment

Subject realities can be encapsulated in reinforced bubbles and floated into public hostile environments. The bubbles interact peer-to-peer. The underlying data remains in the trusted fabric. The bubble is a disposable projection — if compromised, the trusted fabric is unaffected.

---

## Evaluation Against Design Goals

### Goal 1 — Splectrum Alignment

The mycelium maps directly to the Splectrum philosophical framework at the data level.

**P0 — Being implies language.** The repository boundary is the creation. A subject reality comes into existence with its own identity and address through the act of establishing a boundary.

**P2 — Language is the medium through which a subject experiences reality.** The subject's experienced reality is the data state the fabric holds in context. There is no hidden data world behind it. What the subject accesses is what is.

**P3 — Language is where subjects share knowledge about reality.** Shared reality emerges from coupling between subject realities through data state. No centralised shared world is required. Like decoherence, the classical picture is produced by interaction, not discovered behind it.

**P4 — Languages have equal standing in potential.** Multiple access interfaces ensure no single language of access is privileged. RDBMS, document, XPath, file — all are equal views onto the same fabric.

The fabric does not require the philosophical framework to be forced onto it. The design embodies it structurally.

### Goal 2 — Decentralisation Alignment

The architecture is native to decentralised thinking.

**No central authority.** Addressing is ownership-based. Each subject reality names its own data. No central registry is needed.

**Peer-to-peer.** Reality bubbles interact directly in public space. They couple selectively, producing local shared realities without requiring global coherence.

**Trust-model-agnostic.** The mycelium defaults to a trusted environment. In public hostile contexts, blockchain or other consensus mechanisms can gate the transition from dirty to immutable. The fabric does not encode the trust model into the data. An immutable record carries no trace of which mechanism sealed it.

**Frictionless context crossing.** Data moves between public blockchain-gated and private trust-gated contexts without format change. The record is the same regardless of where it came from or which consensus model applied.

**Blockchain-ready without blockchain dependency.** The transaction lifecycle already mirrors blockchain's pattern — open state, consensus, immutable record. Blockchain slots in as an optional consensus mechanism without changing the architecture. Private trusted circles skip it entirely.

### Goal 3 — Frictionless Access Without Lock-In

The design separates truth from interface.

**One immutable base.** All data ultimately rests as immutable records in the fabric. This is the single source of truth.

**Many interchangeable interfaces.** File access, XPath, RDBMS, document repo — all are projections from the same base. None owns the data. None is required. Any can be added, replaced, or removed.

**No access format corruption.** Because the base is immutable, no access interface can corrupt the source. Mutable views are disposable and reconstructable.

**Consumer freedom.** The consumer works in whatever paradigm suits them. The fabric does not impose a data access ideology. New access paradigms can be added as higher-level views without changing the fabric.

**Alignment with modern patterns.** The immutable-base/mutable-derived pattern is consistent with event sourcing, CQRS, append-only logs, and immutable infrastructure. Reality bubbles as deployment units suit containerised, cloud-native, and edge computing architectures. Immutable records with single-read semantics are naturally compatible with caching, CDN distribution, and offline-first patterns.

---

## Implementation Risks

The logical design is internally consistent and meets its three goals. No structural disadvantages have been identified at the logical level. The following are implementation risks — matters of choosing the right tools and engineering practices, not deficiencies in the design itself.

- **Tool selection.** The logical model does not prescribe a specific repository technology. Choosing a tool whose assumptions conflict with the data profile is an implementation decision, not a design flaw.
- **CDM quality.** The mycelium is deliberately simple — storage and contextual availability. Complexity lives in the CDM and process layers above it. Poor design of those layers would undermine the system, but that is an engineering concern.
- **Storage management.** Append-only immutable data grows indefinitely. Managing that growth — through archival, tiering, or other strategies — is an operational concern to be addressed at the appropriate level.
- **Legacy integration.** Existing systems that assume mutability as default require adapter layers. Designing those adapters well is an implementation task.
- **Blockchain integration specifics.** The logical compatibility with blockchain is clear. Practical details — data format alignment, ordering reconciliation — will need to be resolved during implementation.
