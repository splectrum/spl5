---
title: "Namespace Structure and Repo Template"
type: substantial
status: in-progress
destinations: engineering
---

# Namespace Structure and Repo Template

Substantial submission. The core namespacing structure of the Spl framework and the template for namespace repos as living subject realities.

---

## One Identifier

Every node in the namespace is identified by a single fully qualified name. This name is opaque until read through a conformance schema. The same identifier resolves as:

- **AVRO schema namespace** — schema identity
- **Git repository** — subject reality, endpoint, history
- **Logical type namespace** — meaning language identity
- **Protocol library** — operational capability
- **Fabric context path** — addressable location

These are not mappings. The identifier carries the potential of encapsulated dimensions — each realised when read through a corresponding reader schema. Not "is" each of these, but "is like" — the identifier is readable as schema identity, as repo identity, as logical type, as protocol binding. Which dimensions are active depends on what reader schemas are in scope. The potential is always there. The realisation is contextual.

Within a namespace node, underscore-prefixed names (`_schemas`, `_src`, `_process`) are a further dimension — they identify colocated metadata contexts belonging to the node itself, distinct from child namespace nodes.

## Identifier Grammar

Two structural primitives in the naming language:

- **Dot** — namespace dimension. Separates namespace segments. `spl.mycelium.fabric`.
- **Single underscore prefix** — metadata dimension. Identifies colocated metadata belonging to the node. `_schemas`, `_process`.

These are upfront dimensions of the identifier backbone — not conventions that emerge through use. The grammar is extendable as new dimensions are discovered.

## The Backbone

```
spl                          — the framework. Seed, carrier language, naming grammar.
spl.mycelium                 — physical pillar. Data fabric.
spl.mycelium.fabric          — substrate. Records, contexts, three operations.
spl.mycelium.metadata        — traversal and accumulation.
spl.mycelium.data            — schema-aware interpreted access.
spl.mycelium.process         — watchers, readiness, execution.
spl.splectrum                — logical pillar. Language fabric.
spl.haicc                    — cognitive pillar. Activation fabric.
```

Child nodes below these exist as and when needed. A parent namespace need not exist as a repo for its children to exist. The tree grows from the leaves. A parent repo is born when unique content arises that belongs to the family but not to any child.

## Namespace Repos as Living Subject Realities

Each namespace node is a git repository — a subject reality. The repo does not merely contain code or schemas. It lives the life of the concept it names. Everything that *is* that concept lives in its repo:

- Design thinking and conversation history
- Schemas and protocol definitions
- Source and implementation
- Releases and version history
- Public submissions for the reference library
- Process state and reports

The repo is the source of truth. All external representations — ref lib pages, release artefacts, API documentation — are projections from it.

## No Inheritance

Namespace repos do not inherit from parent namespaces. There is no hierarchy of dependency.

A consuming subject reality is built by extracting node realities from whichever namespace repos it needs and localising them. Read wide, write local. A blog repo might extract schemas from `spl.mycelium.fabric` and process definitions from `spl.mycelium.process` and nothing else. References are selective, not hierarchical.

## Node Realities

A namespace repo is a subject reality that may contain sub-realities. Contexts within a repo are node realities — each containing only what is reality for that context, not potential sub-contexts. A schema context contains schemas. A process context contains process definitions. Neither anticipates nor summarises the other.

Node realities are extraction boundaries. A consumer extracts the specific node realities it needs from a namespace repo. The extracted nodes receive local identity in the consuming repo. The consumer's reality contains only what it actually uses.

The same principle applies at the namespace level. `spl` contains what is uniquely the framework's reality — the seed, the naming grammar. Not overviews of its children. `spl.mycelium` contains what is uniquely the physical pillar's reality. Each node holds its own content and nothing else.

## The Reference Library Surface

Each namespace repo submits its own public-facing content through the standard submissions process. The reference library is assembled from what repos publish about themselves — not authored separately.

The ref lib page for `spl.mycelium.fabric` is what that repo chose to make public. The repo contains the full life. The page is the outward-facing projection.

## Versioning

Versioning is native to the infrastructure. Git provides identity and history. AVRO provides schema evolution through reader/writer resolution. A consuming repo references a specific version of a namespace. Schema conformance handles compatibility.

## Repo Template

The minimum for a namespace repo to be a mycelium subject reality:

A git repo whose name is its fully qualified namespace identifier.

No upfront requirements on content. The repo exists, the name carries the potential. But the naming grammar provides an upfront dimension for metadata: the single underscore prefix. This is a structural primitive of the identifier — like the dot separator for namespaces. Underscore-prefixed contexts (`_schemas`, `_src`, `_process`, `_submissions`) are metadata colocated with the node. They grow as the node's life requires them.

### What Is Absent

No prescribed content. No identity files — the name is the identity. No configuration files. No dependency manifests. Architecture of absence: what you don't build doesn't exist as a possibility.
