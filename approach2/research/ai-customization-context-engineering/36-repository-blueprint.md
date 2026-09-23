# Repository Blueprint

## Recommended Layout

Use native discovery locations as thin adapters and keep shared knowledge in canonical files. This preserves host discovery while reducing duplication.

```text
repo/
├── AGENTS.md                         # portable-ish agent onboarding baseline
├── .github/
│   ├── copilot-instructions.md       # concise Copilot repository baseline
│   ├── instructions/
│   │   ├── frontend/react.instructions.md
│   │   └── testing/unit.instructions.md
│   ├── prompts/                      # VS Code-local, user-invoked tasks
│   │   └── review-api.prompt.md
│   ├── agents/                       # host agent profiles
│   │   ├── planner.agent.md
│   │   └── reviewer.agent.md
│   ├── skills/                       # Agent Skills-compatible folders
│   │   └── release-notes/
│   │       ├── SKILL.md
│   │       ├── references/
│   │       ├── scripts/
│   │       └── assets/
│   └── hooks/                        # deterministic host hooks
│       └── security.json
├── .vscode/mcp.json                  # VS Code adapter; no embedded secrets
├── ai/
│   ├── knowledge/                    # canonical architecture/policy/workflow docs
│   ├── schemas/                      # shared output/tool contracts
│   ├── evals/
│   │   ├── cases/
│   │   ├── graders/
│   │   └── baselines/
│   ├── manifests/                    # inventory and dependency graph
│   └── deprecated/                   # migration notes, not active discovery paths
└── CODEOWNERS
```

VS Code recursively discovers instruction files and supports project skills in `.github/skills`, `.claude/skills`, or `.agents/skills`; Agent Skills requires each skill directory's name to match its `name` field ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions), [Agent Skills spec](https://agentskills.io/specification)). If several hosts are required, choose one canonical skill directory and generate or symlink adapters only after verifying each client's discovery rules.

## Naming and Discovery

- Use lowercase kebab-case identifiers: `security-review`, `release-notes`, `react-testing`.
- Name by job/outcome, not persona adjectives: `dependency-audit`, not `careful-expert`.
- Make descriptions act as routing contracts: **what it does**, **when to invoke**, distinctive vocabulary, exclusions, and expected inputs. Skill discovery loads `name` and `description` before the body, so vague metadata is an activation bug ([Agent Skills overview](https://agentskills.io/what-are-skills)).
- Keep nearby assets shallow and purpose-named. The skill specification recommends a short `SKILL.md`, focused references, and shallow links ([Agent Skills spec](https://agentskills.io/specification)).

## Metadata

Use the host's supported frontmatter only. Unknown fields may be ignored, rejected, or create false confidence.

Portable skill core:

```yaml
---
name: release-notes
description: Drafts release notes from verified changes. Use for tagged releases or changelog preparation; not for marketing announcements.
license: Apache-2.0
compatibility: Requires git; optional GitHub read access
metadata:
  owner: developer-experience
  version: "1.2.0"
---
```

`license`, `compatibility`, `metadata`, and experimental `allowed-tools` are defined by the Agent Skills specification; VS Code adds fields such as `argument-hint`, `user-invocable`, `disable-model-invocation`, and experimental `context`, so label those as host extensions ([Agent Skills spec](https://agentskills.io/specification), [VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)).

Maintain a machine-readable inventory outside frontmatter when governance needs exceed host schemas:

```yaml
id: release-notes
kind: skill
owner: developer-experience
status: active
review_by: 2026-11-25
depends_on:
  - knowledge/changelog-policy
  - tool/git-read
supersedes: changelog-writer
risk: low
eval_suite: ai/evals/release-notes
```

## Canonical Content Rules

1. One fact, one owner, one canonical source. Other assets link to it.
2. Instructions contain invariants and decision heuristics, not copied reference manuals.
3. Skills contain workflow and navigation; detailed knowledge goes in `references/`; deterministic transformations go in reviewed `scripts/`; output templates go in `assets/` ([Agent Skills spec](https://agentskills.io/specification)).
4. Agents contain role boundaries, tool allowlists, delegation rules, and output contracts; they reference shared standards.
5. MCP configuration names endpoints and credential inputs, never secret values ([VS Code MCP](https://code.visualstudio.com/docs/agent-customization/mcp-servers)).
6. Hooks call small, independently testable scripts; agent-write access to those scripts requires approval ([VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks)).

## Dependency and Change Management

- Treat links, scripts, packages, MCP servers, models, tools, and other agents as dependencies.
- Pin executable dependencies or record immutable digests where practical; review lockfile and transitive changes.
- Version behavior changes semantically in the inventory. A changed trigger, tool permission, output contract, or security boundary is not "documentation only."
- Require owners for high-risk agents, hooks, MCP configurations, and shared skills.
- Include compatibility notes and a migration path before deprecation. Remove deprecated assets from active discovery paths so routers cannot select them.
- Review dynamic facts on a shorter cadence than stable principles. Attach `last_verified`, source, and expiry metadata to generated indexes or retrieval corpora.

## Tests and Evals

Each asset should have a small behavioral suite:

- **Discovery:** relevant prompts activate the intended asset; near-miss prompts do not.
- **Instruction adherence:** representative and adversarial cases satisfy observable criteria.
- **Tool selection:** allowed tool, denied tool, malformed input, timeout, and unavailable dependency.
- **Security:** direct/indirect injection, secret-seeking, destructive request, privilege escalation, and poisoned retrieved document.
- **Output:** schema/format validation plus semantic checks.
- **Regression:** baseline quality, tokens, latency, tool calls, correction turns, and failure category across supported models/hosts.

OpenAI recommends pinned model snapshots and evals for prompt changes; VS Code's current customization evaluator checks contradictions and can scaffold Waza skill evaluations, though that extension is Preview ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [VS Code customization management](https://code.visualstudio.com/docs/agent-customization/overview)). Keep test cases and graders portable even if a hosted eval product is retired.

## Pull Request Checklist

- Purpose and activation boundary are explicit.
- Canonical sources are linked; no copied policy drift.
- Tool access is minimal and destructive actions require a control outside prose.
- Secrets and personal data are absent.
- Bundled code and licenses were reviewed.
- Positive, negative, edge, and injection evals pass on supported hosts.
- Token/tool impact and compatibility are documented.
- Owner, review date, rollback, and deprecation path are present.