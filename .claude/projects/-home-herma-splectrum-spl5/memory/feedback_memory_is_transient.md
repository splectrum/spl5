---
name: Memory is transient working context
description: Auto-memory is for between checkpoints only — not for persisting repo state
type: feedback
---

Auto-memory is working context for the current session, cleared on checkpoint. It must not accumulate into a shadow copy of repo state.

**Why:** Once work is committed, the code and git history are the source of truth. Memory that persists beyond a checkpoint duplicates repo state in a less reliable form and nudges future sessions in wrong directions (proven in spl4).

**How to apply:** Don't store implementation details, code patterns, or progress summaries in auto-memory expecting them to persist. Use memory only for orientation during the current work session. The checkpoint reset enforces this mechanically.
