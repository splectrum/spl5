# Splectrum and Holepunch: An Architecture of Absence

**An exploration of shared interest**

*Jules Ten Bos — In Wonder*

---

## What This Document Is

This is an opening to a conversation between two projects that share an architectural principle — and that could help each other mature.

Holepunch builds peer-to-peer infrastructure — Bare, Pear, Hyperswarm, Hypercore — that already embodies, in working code, a principle that Splectrum has arrived at independently through both theory and engineering.

Splectrum is a framework at the intersection of philosophy of language, systems theory, and software engineering, developed through a blog series at *In Wonder* and an iterative engineering project (spl4). It has three pillars — Mycelium (data interaction), Splectrum (expression and evaluation), and HAICC (human-AI collaborative creation) — each with working code, proven primitives, and open directions of travel.

The core of the shared interest: Holepunch's P2P architecture is a natural substrate for building Splectrum realities — encapsulated contexts where different activities play out with their own rules, their own data, their own capabilities, and structural boundaries that arise from composition rather than policy.

---

## The Shared Principle

Holepunch's peer-to-peer architecture achieves privacy by not creating the conditions for its violation. A centralised server doesn't see your data because the server doesn't exist. The architecture makes surveillance structurally impossible, not merely prohibited.

Splectrum has arrived at the same principle from a different direction — through engineering a data interaction model. Mycelium's core axiom is **structure is behavior**: a context with a bin has soft delete; a flat context skips interior traversal; a context with changelog mode tracks changes. There are no flags, no configuration, no permission checks. What you build is how it behaves. What you don't build doesn't exist as a possibility.

Both projects practice what Splectrum calls an **architecture of absence**: systems where desirable properties emerge from what is *not present* rather than from what is policed. Neither invented this for the other. Both arrived at it through the demands of their respective engineering. The interest is in what happens when the principle is recognised as shared and pursued deliberately across both projects.

---

## P2P as Natural Splectrum Context

This is the broader connection — of which privacy and security are consequences, not the whole story.

Splectrum's central concept is the **context**: an encapsulated space where a particular activity — a "language game" — plays out with its own rules, its own data, its own vocabulary of operations. Contexts nest, compose, and define boundaries structurally. What exists inside a context is what was composed into it. What doesn't exist there is simply absent — not forbidden, not filtered, not policed.

Holepunch's P2P architecture creates exactly these kinds of spaces:

**A Hyperswarm topic is a context.** Peers discover each other around a shared topic. The topic defines who participates and what they share. The boundary is structural — peers outside the topic don't see the traffic, not because it's encrypted (though it is), but because they're not part of the swarm. The context is encapsulated by composition, not by access control.

**A Pear application is a context.** It runs with specific capabilities, connects to specific peers, operates on specific data. With Bare's modular architecture — where every capability is a separate module injected by the host — the application's reality is composed rather than restricted. What modules it receives determines what language game it can play.

**A Hypercore is a context for data.** An append-only, cryptographically signed log that belongs to its creator. Others can replicate it, but only the owner can write. The ownership boundary is structural — built into the data format, not enforced by a server.

**A peer is a context.** It holds its own data, runs its own applications, decides what to share and with whom. Privacy is not a policy applied to the peer — it is the peer's default state. Sharing is the deliberate act; encapsulation is the given.

Each of these maps naturally onto Splectrum's context model. The nesting works too: a peer runs applications (contexts within a context), each connected to swarm topics (contexts that span peers), each operating on Hypercores (data contexts that replicate across boundaries under the owner's control).

This is what makes the overlap more than an analogy. Holepunch has built the infrastructure for encapsulated, composable contexts at the network and data layer. Splectrum has built a model for how contexts work — how they compose, how behavior emerges from structure, how operations resolve through layered capabilities. The two fit together as substrate and model.

---

## Splectrum's Engineering

Splectrum's engineering is organised around three pillars that form a virtuous cycle: entities collaborate and produce meaning (HAICC); meaning formalises into requirements and evaluable expressions (Splectrum); formalised meaning persists as data and evidence accumulates (Mycelium); evidence informs the next cycle.

### Mycelium: The Data Primitive

Mycelium is a data interaction model — independent of physical storage or transmission — built on a single primitive: **record** (key → opaque content) within **context** (container of records, where records can themselves be contexts).

This primitive, proven sufficient across 14 iterative projects spanning storage, changelog, traversal, evaluation, and protocol resolution, required no extensions. The operation set is minimal and complete: list, read, flatten, create, write, delete, append, move — with compound operations composing from primitives.

Mycelium's architecture has three layers:

**Logical** — structures and operations. What exists and what you can do with it. Zero dependency on storage or substrate.

**Capability** — binds logical to physical. Implements operations against a specific substrate. Multiple capabilities are interchangeable — same behavior, different backing.

**Physical** — the substrate itself. Folders, a JSON file, a database, an API, a network call. The physical layer has no opinions.

The context layer sits between logical and capability, providing traversal (walk path, accumulate metadata, nearest distance wins), flat contexts (content not sub-contexts), and metadata-driven behavior. Mutability, changelog mode, and enforcement are driven by metadata accumulated during traversal — structure is behavior, all the way down.

### The Evaluator and Quality Gates

Splectrum includes a working evaluation pipeline: a data-triggered, four-step process (prepare → translate → evaluate → report) that runs as a protocol operation. Quality gates derive from natural language requirements — meaning carries its own verification criteria.

This is entity-neutral: AI evaluating AI output catches real discrepancies. The evaluator doesn't require a specific entity type — it needs a different perspective on the same output.

### Protocol Resolution and the Factory Pattern

spl4's protocol system resolves operations through a map built by scanning protocol directories, using longest-prefix match. All protocol operations follow a uniform factory pattern: async factory taking an execution document, returning a bound operator.

This pattern — where operations are resolved and composed through a structured namespace rather than hardcoded imports — is architecturally analogous to Bare's module resolution.

### Human-AI Collaborative Creation (HAICC)

HAICC treats all entities equally — human, AI, process, tool. No privileged entity type. The aim is maximum beneficial autonomy: if the system can act autonomously, it should; entities participate where they add genuine value. The build cycle is: decide → build → evaluate → evolve.

spl4 itself was built this way — 14 iterative projects, each with structured evaluation, evidence-based decisions, and compounding quality gates. The engineering methodology and the engineering artefacts are the same thing.

---

## Where the Projects Overlap

The overlap is not a single point but a set of natural convergences:

### Encapsulated Contexts as the Organising Principle

Splectrum organises everything as contexts — data, operations, evaluation, process. Holepunch organises everything as encapsulated P2P spaces — peers, swarms, applications, data structures. The structural logic is the same: compose what's inside, and the boundary takes care of itself.

A Mycelium capability binding for Hypercore or Hyperdrive would make this convergence concrete — the same data operations that currently resolve against the filesystem resolving against P2P data structures, without changing the logical layer. Mycelium was designed for this substrate-independence; Holepunch provides the substrate that would prove it.

### Structure as Behavior — Applied to Runtime

Bare's modular architecture — where every capability is a separately injected module — naturally extends the "structure is behavior" principle to code execution. A Pear-distributed application's reality is composed by the modules the host provides. What the application can do is what it was given. What it wasn't given doesn't exist.

This applies to security (unwanted functionality kept out of reality by never being provided), but equally to expressiveness (the module vocabulary shaping what the application can become) and to community (different applications in the same swarm composing different capability sets for different purposes).

### Minimal, Complete, Composable Operations

Mycelium's operation set — eight operations, no extensions needed across 14 projects — demonstrates that a minimal vocabulary can be sufficient for a complex domain. This is directly relevant to designing wrapper APIs for a capability-gated Bare environment, and more broadly to Bare's philosophy of composing from small, purposeful modules rather than shipping a monolithic standard library.

The shared design question: *what minimal set of composable operations generates the richest space of expressible programs?*

### AI-Assisted Development

Both projects have a natural interest in AI as a development partner. Splectrum's HAICC methodology is a working model for human-AI collaborative creation — entity-neutral, evidence-based, iterative. Bare's small, consistent API surface is structurally well-suited to AI generation but currently lacks the documentation and example corpus that would make it accessible to AI.

Splectrum's approach would treat building that corpus as a language-design problem: not just documenting what exists, but structuring the documentation as an optimal vocabulary for AI consumption — the same minimal-complete-composable principle applied to how Bare presents itself to non-human developers.

### Privacy and Community

Holepunch's P2P model creates private-by-default spaces where communities form around shared interests rather than platform affordances. Splectrum's context model provides a framework for how these spaces work internally — how data is structured, how operations compose, how meaning is evaluated, how quality is maintained. P2P provides the infrastructure for decentralised community; Splectrum provides a model for what happens inside that community.

---

## What Bare and Pear Bring to Splectrum

Splectrum's engineering has been developed against the filesystem as its physical substrate. Mycelium's capability layer is proven but bound to a single backing. Bare and Pear open directions that Splectrum's architecture is designed for but has not yet realised:

**P2P as a Mycelium capability.** The same data operations resolving against Hypercore, Hyperdrive, or Hyperswarm — without changing the logical layer. A new capability binding, not a rewrite.

**Pear as distribution.** Splectrum's HAICC cycle produces evaluated, quality-gated artefacts. Pear's P2P distribution lets these propagate without centralised infrastructure — consistent with Splectrum's principles.

**Bare as natural runtime.** spl4's protocol resolution and factory patterns currently run on Node.js. Bare's minimal, modular architecture is a more natural fit — the same "compose what you need" philosophy Splectrum already practices.

**A substrate for encapsulated realities.** Splectrum's claim that constraints are generative — that what a context *cannot* do shapes what it *can* become — needs proof beyond the data layer. Holepunch's P2P contexts, composed with specific capabilities on a minimal runtime, would be that proof in practice.

---

## What Splectrum Brings to Bare and Pear

**"Structure is behavior" as a systematic design principle.** Holepunch practices this at the network layer. Splectrum has named it, engineered around it in data, and can help extend it deliberately into runtime composition, API design, and application architecture.

**A proven data interaction model.** Mycelium's record/context primitive, its operation set, and its logical/capability/physical separation are proven across 14 iterative projects. This layering maps directly onto the architecture a capability-gated Bare environment would need — an existing model that could be adapted, not a design exercise.

**A context model for P2P applications.** How data is structured within a peer, how operations compose, how metadata drives behavior, how traversal resolves through nested contexts — these are engineering questions Splectrum has working answers to, applicable to how Pear applications organise their internal world.

**An evaluation methodology.** The evaluator pipeline — data-triggered, entity-neutral, quality-gated — provides a mechanism for verifying that applications behave as declared, that quality gates compound, and that evidence accumulates. Applicable to application quality, API conformance, and security verification alike.

**API design informed by language design.** Mycelium's demonstrated principle — eight composable operations sufficient for a complex domain — is directly applicable to wrapper API design, and more broadly to Bare's module vocabulary.

**A working model for AI-assisted development.** HAICC's entity-neutral, evidence-based iteration is how spl4 was built. Applied to Bare's ecosystem, it could produce the documentation, type definitions, and examples that would make Bare accessible to AI development — bootstrapping fluency through the same methodology that built Splectrum itself.

**A published intellectual context.** The Splectrum blog series at *In Wonder* provides ongoing public analysis of P2P architecture, privacy, and language structure — engaging seriously with how systems should be built, from a perspective outside the software engineering mainstream.

---

## JavaScript as the Natural Medium

JavaScript on Bare suits this shared interest because of its expressive properties.

JavaScript is weakly structured in ways that serve plurality. Objects are shaped by use, not by class hierarchies. Functions are values. Data and code share syntax. The same surface accommodates different language games — data transformation, event handling, UI composition, protocol logic — each playing by different rules within a single medium. This is how Splectrum's own engineering works: Mycelium operations, protocol resolution, evaluation pipelines, and HAICC process management all inhabit JavaScript, playing different games with different rules.

Bare's minimalism amplifies this: a small, consistent vocabulary forces composition from primitives rather than reliance on pre-built idioms — more generative, less templated, for both human and AI developers. TypeScript adds optional structure where precision is needed, functioning as the grammar of each domain without imposing a single grammar on the whole.

---

## Directions of Travel

These are not plans but areas where the shared interest naturally leads.

**Documentation as first contact.** A consolidated API reference for the `bare-*` module ecosystem, generated using Splectrum's HAICC methodology and formatted for both human developers and LLM context injection. Immediately useful, independently valuable, and a practical demonstration of Splectrum's approach.

**Mycelium capability binding for P2P.** Exploring what a Hypercore or Hyperdrive-backed Mycelium capability looks like — extending Splectrum's proven data model into Holepunch's P2P substrate. A direct test of whether Mycelium's substrate-independence holds in practice, and a first step toward Splectrum contexts running natively on P2P infrastructure.

**Context composition and runtime design.** Developing the idea of Pear applications as composed contexts — where the module vocabulary, data structure, and peer connections together define a reality — informed by Mycelium's proven context model and Bare's modular architecture.

**Wrapper API vocabulary.** If the context-composition direction has merit, the API design for different application domains becomes the creative core — informed by Mycelium's demonstrated principle that a minimal set of composable operations can be sufficient.

**AI-native development.** The longer arc — Bare as a platform that AI can develop against fluently, with Splectrum's HAICC methodology providing the development cycle and evaluation, and the encapsulated context model providing structural safety for AI-generated code.

---

## Contact

Jules Ten Bos
*In Wonder* — [blog URL]
[contact details]

---

*This document grew from a detailed technical analysis of Bare's architecture and its position in the broader landscape of JavaScript runtimes, P2P infrastructure, and AI agent execution. The spl4 engineering repository (github.com/splectrum/spl4) provides full context on Splectrum's engineering work. The technical analysis is available on request.*
