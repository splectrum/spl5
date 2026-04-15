# Mycelium Design — State of the Art Positioning

## Introduction

This review positions the Mycelium data fabric design against the current state of the art in data architecture, decentralised systems, and immutable data management. The aim is to identify where Mycelium aligns with, diverges from, and extends existing approaches.

---

## 1. Immutable Data Architectures

### Current State

Immutability has moved from a niche pattern to a mainstream architectural principle. The field is converging around several established approaches:

**Event Sourcing and CQRS.** These patterns store state changes as immutable event sequences rather than overwriting current state. The write model produces events; the read model builds materialised views from those events. EventSourcingDB shipped its 1.0 release in 2025, and dedicated frameworks now exist across .NET, Java, TypeScript, and Python ecosystems. The pattern is mature but carries acknowledged complexity — projections, eventual consistency, and event schema evolution remain active challenges.

**Open Table Formats.** Apache Iceberg, Delta Lake, Apache Hudi, and the newer Apache Paimon and DuckLake all manage data on object storage through immutable snapshots and append-only transaction logs. Each snapshot references immutable files; updates are expressed as new files rather than mutations. Time travel, ACID transactions, and schema evolution are standard features. These formats have become the foundation of the data lakehouse model, which by 2025 is an established operating pattern rather than a concept.

**Immutable Databases.** Datomic pioneered time-aware immutable storage, storing all facts with time coordinates. EventStoreDB provides a purpose-built event store. Blockchain-adjacent databases like Amazon QLDB and BigchainDB enforce strict immutability with cryptographic verification.

**Immutable Backups and Storage.** WORM (Write-Once-Read-Many) storage is now a core defence against ransomware, with immutable backup strategies becoming a compliance requirement across healthcare, finance, and government sectors.

### Mycelium's Position

Mycelium shares the immutability-first principle with all of the above but differs in where it places immutability in the architecture. In event sourcing, immutability lives in the event stream — a specialised write model. In lakehouse table formats, immutability lives in the file/snapshot layer beneath a query engine. In both cases, immutability is a feature of a particular component.

In Mycelium, immutability is the base layer of the entire fabric. Everything above it — mutable tables, indexes, document views, subject realities — is derived and disposable. This is a stronger claim than event sourcing or lakehouse formats make. Mycelium does not have an immutable component; it is an immutable foundation with mutable projections.

The two immutable record types (atomic records and data change records) map roughly to event sourcing's distinction between state snapshots and events, but without event sourcing's requirement for a specialised event store or projection infrastructure. The records sit in a file/folder structure accessible through conventional interfaces.

---

## 2. Decentralised Data Architectures

### Current State

**Data Mesh.** Introduced by Zhamak Dehghani in 2019, data mesh has become a strategic framework for enterprise data management by 2026. Its four principles — domain-oriented ownership, data as a product, self-serve data infrastructure, and federated computational governance — address the bottleneck of centralised data teams. Adoption is widespread across large enterprises, with implementations at Netflix, Airbnb, and JPMorgan Chase demonstrating measurable improvements in time-to-insight and scalability.

**Data Fabric.** Where data mesh decentralises ownership, data fabric maintains centralised integration through active metadata, automated governance, and unified access across distributed sources. The two are increasingly seen as complementary rather than competing — data fabric providing the connective infrastructure for a data mesh operating model.

**Content-Addressable Storage (IPFS).** The InterPlanetary File System uses content-based addressing and distributed hash tables to create a peer-to-peer file system. Files are identified by their content hash rather than location, ensuring immutability and verifiability. IPFS serves as a storage layer for Web3 and decentralised applications, with extensions like Filecoin adding economic incentives for storage and Arweave providing permanent archival.

### Mycelium's Position

Mycelium shares data mesh's commitment to decentralised ownership — each repository (subject reality) owns its data, identified by its own unique endpoint. There is no central registry. Addressing is solved by ownership, exactly as data mesh distributes accountability to domain teams.

However, Mycelium differs from data mesh in a fundamental way. Data mesh is an organisational operating model — it distributes responsibility across human teams within an enterprise. Mycelium is a data architecture — it distributes data itself across autonomous reality bubbles that may not correspond to organisational boundaries at all. Data mesh asks "who owns this data?". Mycelium asks "where does this data exist as experienced reality?".

Against data fabric, Mycelium offers something structurally different. Data fabric creates a unified integration layer across distributed sources. Mycelium has no unified layer. It has coupling between subject realities through shared immutable records. Shared reality emerges from interaction, not from a metadata layer imposing coherence.

Against IPFS, Mycelium shares the content-addressable, immutable, peer-to-peer characteristics. But IPFS is infrastructure — a protocol for storing and retrieving files. Mycelium is a data model — it defines how data is structured, how process is woven in, how subject realities are scoped, and how access interfaces are layered. IPFS could plausibly serve as a physical layer underneath Mycelium, but they operate at different levels of abstraction.

---

## 3. Version-Controlled Data

### Current State

**Dolt.** Described as "Git for data", Dolt is a SQL database with full git-style version control — branch, merge, diff, clone, push, pull. It uses a Merkle tree architecture for content-addressable storage, making versioning efficient (only changes are stored incrementally). DoltgreSQL extends this to PostgreSQL compatibility. Dolt is the closest existing system to combining git semantics with relational database functionality.

**Lakehouse Time Travel.** Apache Iceberg, Delta Lake, and Hudi all support time travel — querying data as it existed at any previous point. This is achieved through immutable snapshots referenced by metadata. It provides versioning without requiring git-style branching.

**Git-based Data Management.** Tools like DVC (Data Version Control) and LakeFS use git-like semantics to version data files and datasets, typically layered on top of object storage.

### Mycelium's Position

Mycelium uses git repositories as its boundary — the being, the subject reality. This gives it git's versioning, branching, and history for free. But unlike Dolt, which applies git semantics to tables within a single database, Mycelium applies git at the repository level and uses the file/folder tree as its native data structure, with cascading context notes defining structure and process.

This is a different design point. Dolt makes a single database behave like a git repo. Mycelium makes the git repo the fundamental unit of data existence and layers multiple access interfaces (including relational) on top. The versioning is not a feature bolted onto a database — it is intrinsic to the fabric.

Compared to lakehouse time travel, Mycelium's git-based history is richer — it includes branching, merging, and full provenance by default. Lakehouse snapshots provide point-in-time access; git provides a full graph of how the data evolved across parallel lines of development.

---

## 4. Blockchain and Trust Models

### Current State

Blockchain-based data systems span a wide range — from public permissionless networks (Bitcoin, Ethereum) through permissioned enterprise chains (Hyperledger Fabric) to blockchain-adjacent databases (Amazon QLDB, BigchainDB). The common thread is cryptographically verified, immutable records with distributed consensus.

IPFS combined with blockchain is an active area, where IPFS handles storage and blockchain handles access control, provenance, and transaction records. Filecoin incentivises IPFS storage through a blockchain-based market.

The cost and complexity of blockchain remain barriers for private, trusted environments where the trust problem doesn't exist.

### Mycelium's Position

Mycelium's treatment of blockchain is notably pragmatic. The design is trust-model-agnostic: the transaction lifecycle (open/dirty state → consensus → immutable record) is structurally identical regardless of whether consensus is a simple local commit or a full blockchain protocol.

This means blockchain is an optional plug-in for hostile public environments, not a structural dependency. Most existing blockchain-data architectures are the inverse — they start with blockchain and try to build practical data management on top of it. Mycelium starts with practical data management and leaves a slot for blockchain where the trust model demands it.

The ability to encapsulate subject realities in hardened bubbles for public peer-to-peer interaction, while keeping the underlying fabric in a trusted private space, is a pattern not currently represented in the mainstream landscape. Most systems are either blockchain-native or blockchain-free. Mycelium is blockchain-ready at the boundary without being blockchain-dependent at the core.

---

## 5. Access Interface Pluralism

### Current State

The lakehouse model has driven convergence around multi-engine interoperability — the same data accessible through Spark, Flink, Trino, Presto, DuckDB, and various BI tools. Open table formats like Iceberg are explicitly engine-agnostic, and interoperability efforts (Delta Lake's UniForm) aim to make table formats themselves interchangeable.

Data virtualisation and federation tools (Presto, Trino, Denodo) allow querying across heterogeneous data sources through a unified SQL interface without moving data.

### Mycelium's Position

Mycelium's approach to access interfaces is structurally similar to the lakehouse model's multi-engine access, but applied at a different level. Where lakehouse formats expose one data paradigm (tables) to multiple query engines, Mycelium exposes one immutable base to multiple data paradigms — file, XPath, RDBMS, document repo. The consumer doesn't just choose their engine; they choose their entire data model.

This is a broader form of interface pluralism. No access format is privileged, and none can corrupt the immutable base. The commitment to P4 (equal standing of languages) is architecturally embodied in a way that current systems do not attempt — they typically privilege one paradigm (usually relational) and adapt others to it.

---

## Summary Positioning

| Dimension | Current State of Art | Mycelium |
|---|---|---|
| Immutability | Feature of specific components (event stores, table formats, backup systems) | Base layer of entire fabric; everything mutable is derived |
| Decentralisation | Organisational (data mesh) or infrastructural (IPFS, P2P) | Ontological — subject realities as autonomous data beings |
| Versioning | Applied to tables (Dolt) or snapshots (lakehouse) | Intrinsic via git as the repository boundary |
| Blockchain | Either native dependency or absent | Optional consensus mechanism at boundaries, not structural |
| Access interfaces | Multi-engine over one paradigm | Multi-paradigm over one immutable base |
| Trust model | Binary — trusted or trustless systems | Trust-agnostic; trusted by default, hardened at boundaries |
| Data world | Assumed to exist as a queryable whole | Logical totality only; only subject realities are instantiated |
| Philosophical grounding | None claimed | Splectrum — structural alignment with P0, P2, P3, P4 |

---

## Conclusion

Mycelium does not compete with any single existing technology. It operates at a different level of abstraction — a data fabric design that could be implemented using combinations of existing tools (git, IPFS, relational databases, blockchain protocols) while making architectural commitments that none of those tools make individually.

Its closest relatives are data mesh (for decentralisation philosophy), event sourcing (for immutability-first thinking), and Dolt (for git-based data versioning). But Mycelium combines and extends these into a unified design grounded in Splectrum's philosophical framework, where the strongest differentiator is the inversion: immutability as base rather than feature, mutability as projection rather than default, and the data world as emergent from coupled subject realities rather than a pre-existing whole.

The design is aligned with the direction of the field — immutability, decentralisation, interface pluralism, and event-driven reactivity are all accelerating trends. Mycelium's contribution is to unify them under a single coherent architecture with a philosophical foundation that none of the current systems provide.
