# Mycelium — Architecture Sketch

*Design document — February 2026*
*For discussion and iteration*

---

## The Problem

A thinking project that spans research, exploratory writing, and sustained composition needs to draw on a large body of reference material without drowning in it. Each layer of work has its own purpose, voice, and pace — but they feed each other. Insights flow in all directions: a blog post reframes a source, a book chapter reveals a gap in the research, a new source reshapes what the blog should say next.

Most repo structures are trees. Knowledge networks are not.

## The Name

Mycelium: the underground fungal network that connects individually rooted organisms, allowing them to share nutrients and signals without merging into one thing. Each tree stays itself. The network is the intelligence.

## The Stack

```
┌─────────────────────────────────┐
│  book/                          │  Sustained, architectural writing
│  Pulls from: base, blog         │  Produces: refined formulations
├─────────────────────────────────┤
│  blog/                          │  Exploratory, episodic writing
│  Pulls from: base, audio        │  Produces: crystallised ideas
├─────────────────────────────────┤
│  base/                          │  Research material, sources, audio
│  Raw + preprocessed extracts    │  Produces: AI-friendly context
└─────────────────────────────────┘
```

Each layer is its own git repo with its own CLAUDE.md defining purpose, voice, and boundaries.

## The Base Layer

This is where raw material lives and gets processed into forms that the upper layers can consume without bloating their context.

```
base/
├── CLAUDE.md                  # Purpose: research library and preprocessing
├── sources/
│   ├── texts/                 # PDFs, epubs, articles
│   ├── audio/                 # Recordings, conversations, lectures
│   └── conversations/         # Exported dialogues, notes
├── extracts/
│   ├── rovelli-rqm.md         # Preprocessed: key ideas, quotes, connections
│   ├── kauffman-nk.md         # One extract per source or theme
│   ├── bateson-ecology.md
│   └── ...
├── themes/
│   ├── relational-ontology.md # Cross-source thematic summaries
│   ├── error-and-exploration.md
│   ├── attention-ethics.md
│   └── ...
└── preprocessing/
    └── agents/                # Well-defined extraction tasks
```

**Extracts** are per-source: what matters from this source *for this project*. Not generic summaries — shaped by the framework's concerns.

**Themes** are cross-source: what do Rovelli, Nagarjuna, and Wittgenstein collectively say about relational ontology? These are the high-value context documents that upper layers pull in.

**Preprocessing agents** handle well-defined tasks: transcribe audio, extract key passages, generate thematic summaries. The "well-defined" constraint is important — these are not creative acts, they are distillation.

## The Blog Layer

```
blog/
├── CLAUDE.md                  # Purpose: exploratory writing, Herman's voice
├── drafts/
│   ├── 001-why-error-matters.md
│   ├── 002-rovelli-nagarjuna.md
│   └── ...
├── published/
├── context/                   # Read-only references pulled from base
│   ├── .gitignore             # Not tracked in blog repo
│   └── (symlinks or copies from base/extracts and base/themes)
└── notes/                     # Working notes, fragments, seeds
```

The `context/` directory is the mycelium connection point. It contains material from the base layer that's relevant to current work, but it's not part of the blog repo itself — gitignored, populated by a sync mechanism.

The CLAUDE.md here is crucial. It defines: this is Herman's voice. Exploratory, not didactic. Building from common understanding. The journey, not a programme.

## The Book Layer

```
book/
├── CLAUDE.md                  # Purpose: sustained composition
├── chapters/
├── context/                   # Pulls from base AND blog
│   ├── .gitignore
│   └── (relevant extracts, themes, AND crystallised blog posts)
└── structure/
    └── outline.md
```

Same pattern. The book layer can pull in blog posts as source material — a post that found the right formulation becomes a reference for the chapter that develops the idea further.

## Cross-Pollination: How It Works

The key architectural question. Three mechanisms:

### 1. Context Directories (downstream flow)

Each upper layer has a `context/` directory that receives preprocessed material from lower layers. This is a controlled channel — not "dump everything" but "pull what's relevant to current work."

A sync script or agent populates these based on relevance. The context directory is gitignored so the upper repo stays clean.

### 2. Feedback Tags (upstream flow)

When working in the blog or book layer, if a gap in the base material becomes apparent, a lightweight tagging mechanism flags it:

```markdown
<!-- @base-gap: need extract on Varela's structural coupling concept -->
<!-- @base-gap: theme file on freedom/constitutive-freedom missing -->
```

A periodic agent scans upper layers for these tags and generates tasks for the base layer.

### 3. Promotion (lateral and upward flow)

A blog post that crystallises an idea well enough becomes a reference. It gets copied (or linked) into the base layer's `extracts/` or `themes/` as a first-class source — Herman's own writing alongside Rovelli and Bateson.

This is how the system learns from its own exploration.

## CLAUDE.md as Control Surface

Each repo's CLAUDE.md is where you tell Claude Code:

- **What this repo is for** — its purpose in the stack
- **What voice to use** — exploratory vs. architectural vs. purely extractive
- **What context is available** — where to find reference material
- **What boundaries to respect** — don't bloat, don't drift, don't lecture
- **How to handle the mycelium connections** — when to pull context, how to flag gaps

This is the minimal but sufficient governance layer. No heavy tooling — just clear instructions that shape how the AI collaborates within each space.

## Implementation Path

Start simple, grow as needed:

1. **Base repo** with the framework documents and references file you already have. Add a `CLAUDE.md`. Begin building extracts as you work on blog posts (let demand drive supply).

2. **Blog repo** with a `CLAUDE.md` that defines voice and approach. A `context/` directory with manual copies of relevant base material for now.

3. **The sync mechanism** can start as a manual step ("copy these files into context/") and evolve toward agent-driven as patterns become clear.

4. **The book layer** when you're ready. Not yet.

Don't build infrastructure ahead of need. Let the mycelium grow where the nutrients flow.

---

## Open Questions

- **Git submodules vs. symlinks vs. copy scripts** for the context directories. Submodules are clean but rigid. Symlinks are simple but don't work everywhere. Copy scripts are flexible but need maintenance.

- **Granularity of extracts.** One file per source? Per chapter? Per theme? Probably per source initially, with theme files emerging as cross-cutting patterns become clear.

- **How much preprocessing is "well-defined" enough to automate?** Transcription: yes. Key quote extraction: probably. Thematic synthesis: maybe not — that's where your judgement shapes the project.

- **Versioning the context directories.** If they're gitignored, there's no record of what context was available when a blog post was written. Does that matter? Probably not initially, but might for the book.

- **How does the audio library fit?** Transcription is preprocessing. But audio has qualities that transcription loses. Is there a way to preserve what matters without storing large files in the working repos?
