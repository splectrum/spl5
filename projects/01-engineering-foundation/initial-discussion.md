# Grounding — Pillars, Subjects, Personas

*March 2026 — grounding the engineering in the
seed principles before the spl5 implementation cycle.*

## Context

Between spl5's initial install (Feb 2026) and the
resumption of engineering work (Mar 2026), extensive
philosophical work produced five seed principles (P1-P5)
and a public blog (i-wonder) that tests them against
Wittgenstein, Rorty, Merleau-Ponty, and Rovelli's RQM.

The philosophical and engineering work are now unified
under the name Splectrum. This document grounds the
engineering architecture in the seed principles.

## Splectrum

Splectrum is the whole. Whatever gets built on the
seed principles. Engineering has its own languages
(protocols, APIs). Philosophy has its own languages
(the blog, the conceptual vocabulary). Both are
Splectrum — different language games, same principles
underneath. The principles don't prescribe form; they
are what all forms have in common.

## The Three Pillars — Refined

### Mycelium — The Information World

Mycelium is the information world. Through its web
structure (contexts, references, cascading) it
constructs the subject contexts of participating
entities in that world.

A subject context maps one-to-one to a repository.
It is the point from which a subject experiences
reality — personal (what's local) and shared (what's
accessible through references, protocols, conversations
with other subjects).

### Subjects and the Relational Dynamic

A subject is a dynamic entity that interacts with the
information world through protocols (language games).
When a subject acts on the information world — changing
data — it changes the subject context of other
participating subjects.

This is the relational dynamic: subjects interact with
other entities through the medium of protocols and the
information world. Subjects don't talk to each other
directly. They act on the information world, and those
actions reshape the reality other subjects experience.

This is RQM made operational — properties (data) exist
through interaction (protocols), not in isolation.
A record has no meaning outside a subject context.
A subject context is shaped by the actions of other
subjects. There is no god's-eye view of the information
world — only subject contexts constructed by mycelium's
web structure.

### HAICC — The Software Subject

HAICC is the nature of the software subject
specifically — human-AI collaboration within the
software medium. Not "creative action" generically,
but the particular form of life that is human-AI
collaborative creation in code.

It is the internal process encapsulated within a
subject, with its own interaction patterns designed
to maximise AI autonomy. Each software subject has
its own HAICC instance.

### Splectrum — The Meaning Layer

Splectrum is what emerges when the seed principles
are applied. It is the meaning that gives the
information world and the collaboration process their
purpose. Engineering, philosophy, the blog — all are
Splectrum conversations in different vocabularies.

## Protocols as Language Games

A protocol is a language game: defined rules of
exchange between entities (subjects). Every protocol
operation is a subject changing data, and every data
change is potentially a change in another subject's
context.

"Protocol" is the engineering name. The philosophical
grounding is the same: structured interaction between
participants, with rules that define the form of life.

## The Persona Model

### The Blog as Public Conscious Persona

The blog (i-wonder) is Splectrum's public conscious
persona — a subject in its own right. It receives
"thoughts" from what is happening across Splectrum
and independently decides what to create for public
conversation.

This replaces traditional documentation. Instead of
maintaining a parallel written account of the work:
repos are where reality happens, important information
is made available to the blog as thoughts, and the blog
independently creates the public data store through
conversation.

The blog isn't reporting on Splectrum. It is
Splectrum's public voice — a subject that experiences
the information world from its own POV and converses
with the public.

### Conscious and Unconscious

**Unconscious** — the repo's internal work. Most
activity stays here. The subject does its thing. This
is not hidden, just not elevated.

**Conscious thought** — what a subject deems worth
surfacing. The subject decides what to think. A repo
bubbles information up as a conscious thought when
it judges something fit, ready, or important enough.

**The persona** — exercises judgement over what
becomes public. It may publish, suppress, defer, or
reshape. The persona decides what to say. It is not
a pipe.

Two levels of agency: the subject decides what to
think; the persona decides what to say.

### Interrogating the Unconscious

The unconscious can be interrogated — if we wish to,
and if we have access. This is what cascading
references already provide. The data is there, in the
repo's context. A hidden context is unconscious. A
reference makes it accessible. Access control through
structure, not permissions.

## Naming as Architecture

The names carry the meaning. "Thought", "persona",
"conscious", "unconscious" — they don't describe the
architecture by analogy. They are the architecture's
vocabulary, and using them shapes how entities interact
with it.

Call it "unconscious" and everyone — human or AI —
immediately grasps the relationship: it's there, it's
active, it's not surfaced, it can be interrogated. No
specification needed. The structure and the name do the
work together.

This is P1 in action — language is relational. The
names aren't labels on inert structures; they're part
of how the structures function.

## Working Procedure

The project outcome is public engineering foundation
documentation. The process follows the persona model:

1. Discuss an aspect of the engineering foundation
2. Capture discussion notes in the project
3. When happy with the contents, submit as a thought
   (submission) to i-wonder
4. The persona processes it into a blog post (narrative)
   and reference pages (specs) at
   jules-tenbos.github.io/i-wonder

The reference library is the living engineering
documentation. This repo retains only working material.

## Refining the Pillars — Second Pass

### Mycelium as Fabric

Mycelium is the fabric of the information world. Data
structure, metadata structure, protocol infrastructure.
The raw material from which everything is made.

A subject repo is a specific infilling of this fabric
— filled with its own data, protocols, configuration.
Made of mycelium, not merely using it.

### Subject as Being-in-the-World

A subject is not a wrapper around an actor. It is the
actor-in-its-world — inseparable from its information
context (Heidegger: you cannot be without being in the
world). The repo is simultaneously the subject's
existence and a region of the information world.

The subject and its world are one thing seen two ways.
The engineering spec for "subject" describes what a
subject is in engineering terms — a git-backed
repository structured for specific activities, made
from mycelium fabric.

### HAICC as Collaboration Design

HAICC is specifically about human-AI collaboration:
the autonomy model, the separation between logical and
physical design, the distribution of work across human,
principal AI, and AI agents.

HAICC is not a fabric or a container. It is the design
model for how activities distribute across participants.
It lives within activities, not within subjects as a
whole.

A persona is a subject (mycelium fabric) whose
activities are designed with HAICC. The persona spec
describes a set of activities (intake, production,
scheduling, final edit, etc.) — each with its own
HAICC profile: who does what, what level of autonomy,
where the logical/physical boundary falls. These
profiles evolve as capabilities grow.

### Splectrum as Common Language

Splectrum is the whole because Splectrum is language.
In engineering, this means: what is common to all
language APIs. The shared grammar underneath every
protocol, every interaction. The seed principles as
engineering constraints — what P1-P5 require of any
implementation.

The Splectrum engineering spec will emerge from
building the others. Once mycelium, subject, and HAICC
are specified, the common ground becomes visible from
evidence rather than speculation. Not yet.

## Planned Specs

Three specs, in order:

1. **Mycelium** — the fabric. Data structure, metadata,
   protocols. What everything is made of. How subject
   contexts are constructed.
2. **Subject** — what gets made from the fabric. A
   git-backed repository as an entity's information
   world, structured for specific activities.
3. **HAICC** — the collaboration model. How activities
   distribute across human, principal AI, and AI agents.
   The logical/physical separation. How autonomy
   expands.

A fourth — **Splectrum** (the common language of all
APIs) — will follow when the evidence is there.
