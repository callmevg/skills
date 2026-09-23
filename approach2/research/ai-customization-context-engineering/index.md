# AI Customization and Context Engineering Research Pack

**Status:** Complete research pack  
**Research date:** 2026-08-25  
**Purpose:** Evidence-backed source material for designing future AI instructions, prompts, skills, agents, tools, MCP integrations, hooks, memory/retrieval systems, and orchestration.

## Start Here

- [Research brief](00-brief.md): scope, questions, exclusions, evidence rules, and completion criteria.
- [Synthesis](30-synthesis.md): core conclusions, layered model, context construction, security, evaluation, and maturity roadmap.
- [Decision matrix](35-decision-matrix.md): what to use where, selection dimensions, composition, and anti-patterns.
- [Repository blueprint](36-repository-blueprint.md): scalable directories, naming, metadata, ownership, dependencies, evals, and deprecation.
- [AI design inputs](40-ai-design-inputs.md): directly reusable triggers, workflow, constraints, output contract, failure modes, and evaluation prompts.

## Evidence

- [Source catalog](10-source-catalog.md): 29 retained official/standards sources plus qualifications, dates, and access notes.
- [Research notes](20-research-notes.md): atomic findings for each primitive, context engineering, evaluation, maintenance, and security.
- [Open questions](90-open-questions.md): unresolved interoperability, memory, provenance, compaction, version conflicts, access limits, and freshness watchlist.

## Findings at a Glance

1. Select assets by the layer they control: context, task, role, capability, workflow, persistence, or enforcement.
2. Keep always-on context minimal; use progressive disclosure, retrieval, and isolated workers for detail.
3. Treat instructions as probabilistic guidance. Put guarantees in code, schemas, permissions, hooks, sandboxing, and CI.
4. Agent Skills and MCP offer portable cores; host discovery, metadata, agents, hooks, and precedence remain adapters.
5. Treat every customization and integration as maintained software: owner, version, license, dependencies, tests, threat model, and deprecation.
6. Add orchestration only after a simpler prompt, retrieval call, tool, or fixed workflow fails measurable criteria.

## Navigation by Task

| Task | Read |
|---|---|
| Choose instruction vs prompt vs skill vs agent | [Decision matrix](35-decision-matrix.md) |
| Understand all primitives | [Research notes](20-research-notes.md) |
| Design context, compaction, memory, or RAG | [Synthesis](30-synthesis.md) |
| Organize a repository | [Repository blueprint](36-repository-blueprint.md) |
| Author a future customization | [AI design inputs](40-ai-design-inputs.md) |
| Review security/trust | [Research notes](20-research-notes.md#3-security-and-trust-boundaries) and [Synthesis](30-synthesis.md#security-architecture) |
| Verify source or freshness | [Source catalog](10-source-catalog.md) and [Open questions](90-open-questions.md) |

## Filing Rule

Add new evidence to the source catalog and atomic notes first. Update synthesis only when evidence changes a conclusion. Put unresolved or version-sensitive claims in open questions. Avoid copying the same rule into multiple files; link to its canonical treatment.