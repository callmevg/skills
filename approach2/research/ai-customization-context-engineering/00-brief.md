# Research Brief: AI Customization and Context Engineering

**Research date:** 2026-08-25  
**Audience:** Authors and maintainers of AI instructions, prompts, skills, agents, tools, and orchestration systems, with special attention to coding agents and GitHub Copilot in VS Code.  
**Goal:** Produce evidence-backed source material that helps a team choose, construct, organize, secure, evaluate, and maintain AI customization assets.

## Scope

The pack covers:

1. Repository, organization, and personal instructions; file-scoped instructions; reusable prompts; Agent Skills; custom agents and subagents; function/tool calling; MCP servers; hooks; memory/context files; retrieval/RAG; and handoffs/orchestration.
2. Instruction authority, static and dynamic context, progressive disclosure, context isolation, retrieval and provenance, context budgets, compaction, conflict control, evaluation, and maintenance.
3. Selection criteria: frequency, determinism, tools, isolation, portability, sharing scope, lifecycle, and enforcement.
4. Scalable repository conventions: layout, names, descriptions, metadata, references, scripts, assets, versions, ownership, tests/evals, deprecation, and dependencies.
5. Practical coding-agent patterns, clearly distinguishing interoperable concepts from VS Code, GitHub Copilot, Anthropic, OpenAI, and MCP-specific formats.
6. Trust boundaries: direct and indirect prompt injection, untrusted retrieval, least privilege, secrets, destructive actions, approvals, licensing, and supply-chain risk.
7. A maturity model and implementation roadmap.

## Key Questions

- What behavioral layer does each primitive control: context, task, role, capability, workflow, or enforcement?
- When should content be always loaded, conditionally loaded, retrieved just in time, or isolated in another context?
- Which formats are portable standards and which are host-specific adapters?
- What belongs in probabilistic model guidance versus deterministic code or policy?
- How should a repository prevent duplication, conflicts, stale knowledge, unsafe dependencies, and untestable behavior?
- What evidence shows that a customization improves outcomes rather than merely adding tokens and complexity?

## Exclusions

- A final production customization for a particular organization.
- Model training, fine-tuning, and benchmark surveys except where they clarify the boundary with in-context customization.
- Exhaustive product feature catalogs or pricing.
- Unverified community conventions presented as standards.

## Freshness and Evidence

- Prefer official material current as of 2026-08-25.
- Record an access date for every retained source and publication/update dates when the page exposes them.
- Treat preview and experimental features as unstable.
- Use vendor documentation only for that vendor's behavior; do not generalize a file location or precedence rule into an interoperability claim.
- Cross-check consequential recommendations, especially context minimization, least privilege, prompt-injection controls, and eval-driven maintenance.

## Completion Criteria

- Every requested primitive has a definition, intended use, overlap, limitation, and at least one citation.
- The pack contains a decision matrix, repository blueprint, security baseline, and maturity roadmap.
- Every substantive synthesis section links to supporting sources.
- Vendor-specific behavior is labeled.
- Contradictions, stale URLs, preview status, and unresolved questions are visible.
- Internal links and Markdown structure pass a local audit.