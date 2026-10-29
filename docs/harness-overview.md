# Harness overview - how this repo steers AI agents

This repository was built with an AI agent in the driver's seat. Five subsystems
make that collaboration reliable .

| Subsystem | Question it answers | Where it lives |
|---|---|---|
| Instructions | How must I behave in this repo? | `AGENTS.md` - skill mandates, structure conventions, hygiene rules |
| State | What has been done, what's next? | `agents/progress.md` - updated at every milestone gate |
| Feedback | How do I check my own work? | `scripts/verify.sh` (lint → typecheck → tests) + GitHub Actions CI |
| Lifecycle | How do I get from fresh clone to green? | `scripts/init.sh` - env file, `npm ci`, browsers |
| Scope | What is in and out of this build? | Milestones + cut order in `agents/progress.md` |

The loop: `init.sh` boots the repo → `AGENTS.md` governs behavior → work writes
state into `progress.md` → `verify.sh` (and GitHub Actions `ci.yml`) independently confirms it →
the milestone list bounds what may be built at all.

## Intentionally out of scope here

- Heavyweight memory player. Deferred intentionally.
- Maker-checker dual-agent review machinery - the milestone gate plus a human
  reviewer at each gate covers verification without extra orchestration.
- A dedicated milestones document - `progress.md` already carries the miestone
  state; a second file would just drift out of sync.

## Working skills (vendored)

`.agents/skills/` snapshots the cross-harness Agent Skills used on this build:

- `ponytail/` - minimality discipline: the fewest lines that work, no speculative layers.
- `slop-scan/` - scan for typical AI-written-code issues before commits.
- `unslop/` - cut AI tells from any writing,makes it easier for human to read and understand.