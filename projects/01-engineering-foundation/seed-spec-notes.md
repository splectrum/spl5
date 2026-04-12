# Splectrum Seed Spec — Notes

Discussion notes: engineering analysis of P1-P5.

## P1 — Language is relational

Language is the interaction medium, the glue around
the entities. Relational by nature.

P1 gives us:

1. **Language** — the interaction medium. The glue
   between entities.
2. **Entities** — units of encapsulated complexity
   that participate in the interactions.

## P2 — Language is the medium through which a subject experiences reality

The subject is the entity with the current POV
reference point. The entity whose personas (interaction
roles) are active. Reality is the information world as
moulded by mycelium, presented to the subject through
its totality of protocols embedded into the fabric.

When you take control of a repo — sit in the pilot's
chair — you experience the information world the way
the subject does. You sit inside the subject looking
out.

Inside the subject there is a team: one human
(typically) and potentially many AIs. They make up the
dynamic of the subject — the internal division of
labour.

P2 gives us:

1. **Subject** — entity with POV, embedded in the
   information world by mycelium. The subject and its
   world are inseparable (Heidegger: being-in-the-world).
2. **Persona** — interaction roles of the subject.
   One persona, many protocols. The persona is the
   role; the protocols are the languages it speaks
   in that role.
3. **Conscious protocols** — the functional purpose.
   What the repo is for. Specific to this subject.
4. **Unconscious protocols** — supporting
   infrastructure. Not specific to the purpose but
   specific to the internal nature of subjects
   generally.
5. **Mycelium's role** — the fabric that takes the
   subject's encapsulated complexity and projects it
   onto / embeds it into the information world.
6. **HAICC** — subject-internal. Not a layer, not
   conscious or unconscious. How the protocols are
   woven together dynamically — the division of
   labour between human and AIs. Embedded in the
   protocol implementations themselves.

## P3 — Language is where subjects share knowledge about reality

Mycelium itself is a language — a medium of
interaction. Entities sharing data is having that data
actively visible from each of those entities.

Mycelium makes entity interactions non-local — places
them in the interface between entities. Sharing happens
in the fabric, not between entities directly. The
fabric determines what gets shared and what doesn't.

P3 is entirely a mycelium concern. The engineering
challenge: how does the fabric make data visible or
not visible across subject contexts?

P3 gives us:

1. **Non-local interaction** — sharing happens in
   the fabric, not between entities directly.
2. **Mycelium as the interface** — it determines
   visibility. Cascading references, context
   structure, hidden contexts.
3. **Sharing is visibility** — data is shared when
   actively visible from multiple subject contexts.
   Not copying, not sending.

## P4 — Languages are inter-relational with equal standing in potential

Protocols can depend on other protocols — dependency
is not hierarchy. Lower protocols provide capability,
higher protocols use it on their own terms. The
direction is bottom-up.

Protocols can work together as a team, each with
their role. Interaction between protocols is driven by
data patterns (local rules), not by orchestration
(protocols managing protocols).

Within a language game, orchestration is fine — that's
the language expressing itself. But one language game
cannot reach across and orchestrate another. Cross-
language interaction is always through data.

The constraint is on the mechanism, not the outcome.
Data-driven protocols working together can produce
orchestration as emergent behaviour. The organism
orchestrates; the neurons don't.

P4 gives us:

1. **No hierarchy** — dependency without control.
   Bottom-up.
2. **Equal standing** — every protocol, every subject,
   every persona has autonomy in its own domain.
3. **Data-driven coordination** — between languages.
   Local rules, not central control.
4. **Orchestration within, not across** — a language
   can orchestrate within its own game. It cannot
   orchestrate another language.

## P5 — Together they form a web of growing complexity

What's built persists. Every subject, every protocol,
every piece of data — once it exists, it's part of the
fabric. New things build on top of existing things.
History accumulates. The information world only grows.

When one simplifies, one simplifies with the knowledge
of complexity in mind. Simplification is compression,
not deletion. The complexity has been experienced,
understood, and folded into something simpler. The
knowledge remains.

P5 gives us:

1. **Web, not tree** — no hierarchy, relational
   structure throughout.
2. **Persistence** — what's built stays. History
   accumulates. We build on top of it.
3. **Growth through diversification** — new subjects,
   new protocols, new personas. Spawn, not
   accumulation.

## Items Extracted

Components that emerged from the P1-P5 analysis:

1. **Data world** — the totality of data.
2. **Mycelium** — the fabric of reality as experienced
   by the subject. Creates the interface between the
   data world and the protocols through which subjects
   interact with it. Data-driven coordination is how
   it works.
3. **Subject** — entity with POV, a git-backed repo.
   The subject never touches data directly — it only
   knows the interface mycelium constructs. The data
   world exists, but the subject only ever experiences
   it through the interface.
4. **Entity** — encapsulated unit of historicity. It
   carries its history — it is its history,
   encapsulated.
5. **Persona** — interaction role of a subject. One
   persona, many protocols.
6. **Protocol** — a language game. The engineering
   expression of language.
7. **Conversation** — the interaction pattern between
   entities through protocols.
8. **Thought** — a packet of data/information. Can be
   conscious or unconscious. Often maps to a document
   or resource.
9. **HAICC** — subject-internal dynamic. The division
   of labour between human and AIs, embedded in
   protocol implementations.
10. **Conscious/unconscious** — purpose protocols vs
    infrastructure protocols within a subject.
11. **Spawn** — growth through diversification. New
    carries its history. Consequence of P5.

## Clarifications

### Subject internals: three layers

Inside a subject, three layers are at play:

1. **Conscious protocols** — the functional purpose.
   What the repo is for. Specific to this subject.
2. **Unconscious protocols** — supporting
   infrastructure. Git, test, tidy, protocol
   resolution. Not specific to the purpose but
   specific to the internal nature of subjects
   generally.
3. **HAICC** — the dynamic woven across both layers.
   The division of labour between human and AIs,
   embedded in the protocol implementations
   themselves. Not a layer — a cross-cutting concern.

### Pilot and copilot

When you sit in the pilot's chair of a subject, you
and AI form the team that *is* the subject. Pilot
and copilot — either can be captain. Who drives
depends on the activity: meaning work — human drives;
implementation — AI drives. The aim is a mixture, with
the boundary shifting as trust and capability grow.

This is HAICC made concrete: not an abstract division
of labour but two entities in a cockpit, taking turns
at the controls.

### Persona: one role, many protocols

A persona is an interaction role, not a protocol.
One persona uses many protocols in service of its
role.

Example: the public conscious persona (the blog) uses
git, mycelium data operations, scheduling, publishing,
editorial processes — all different protocols, all in
service of one role: being Splectrum's public voice.

The persona is the *why*; the protocols are the *how*.

## Philosophy Drives Engineering

The approach is philosophy first, engineering follows.
The seed principles are not a retrospective
justification of engineering decisions — they are the
source. We derive the engineering from them.

P1-P5 gave us the components, the relationships, the
constraints. The engineering spec follows from the
principles, not the other way around.

## Engineering as Conversation

Protocols are conversations, not rigid API calls.
Natural language at the interaction level, rigid
implementation underneath.

This maps to mycelium's three layers: logical (the
conversation — natural language, intent), capability
(the binding — translating conversation to action),
physical (the rigid implementation — code, data
operations).

Subjects interact with protocols by stating intent
and receiving responses. The rigidity is hidden in
the implementation. The experience is conversational.

This means protocol design starts from the
conversation: what does the subject want to say?
The rigid API serves that, not the other way around.

## Seed Spec vs Splectrum Spec

The seed spec is the derivation — what the principles
tell us must exist and how things relate. It says
*what exists*.

The Splectrum spec will say *how everything must
behave* — the shared grammar, the engineering rules
any protocol, subject, or persona must follow. It
emerges from the evidence of building the component
specs. Not yet.

The answer likely lives in mycelium. Mycelium is itself
a language, and it is also the language used by all
other languages to interact with the data world. The
mycelium API may turn out to be the common grammar —
the Splectrum spec sitting in plain sight.

## Mycelium as Engineering Cornerstone

Splectrum is the heart — the principles, the meaning.
But the engineering expression is mycelium. By
projecting everything onto the interaction surface with
the data world, mycelium becomes the cornerstone on
the engineering side.

We know the subject by the imprint it leaves on the
data world.

All the languages that make up the subject — its
protocols, its personas, its HAICC dynamic — are
projected onto the mycelium interface, embedded in
the metadata. You don't look inside the subject to
know it; you read the interface.

```
┌───────────────────────────────────┐
│                                   │
│            data world             │
│                                   │
│                                   │
│             ╭───────╮             │
│            ╱protocols╲            │
│           │  subject  │ ← mycelium│
│            ╲ HAICC  ╱             │
│             ╰───────╯             │
│                                   │
│                                   │
│                                   │
└───────────────────────────────────┘
```

The square is the data world. The circle is the
subject. The line of the circle is mycelium — the
interface between inside and outside. Mycelium creates
the interface from data on one side and protocols on
the other. It doesn't sit inside or outside. It's the
boundary itself.

The subject never touches the data world directly. It
only knows the interface — the protocols through which
mycelium presents the data world. The data world
exists, but the subject only ever experiences it
through the interface.

Mycelium is the medium between being and the world
(Heidegger). It makes the subject's existence concrete
in the information world. Without it, the subject has
no presence, no interface, no reality.

Like Heidegger's analysis — the medium is usually
invisible. You don't notice mycelium when you're
working in a subject, just as you don't notice
language when you're speaking. It only becomes visible
when it breaks or when you step back to examine it.
