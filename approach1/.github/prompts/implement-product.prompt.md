---
name: "Implement Product"
description: "Turn an approved product specification into working software through Proposer/Opposer deliberation operating as Architect, Designer, and Developer, with craft-specific quality standards and targeted reopening."
argument-hint: "Provide product-spec-final.md or ask to resume implementation"
agent: "Implementation Orchestrator"
---

Start or resume the [Implementation Orchestration](../skills/implementation-orchestration/SKILL.md) workflow from the current approved product specification and project state.

Do not jump directly from the specification to coding. Establish only the architecture and experience-design decisions that implementation depends on, independently challenge them, and align each current baseline before dependent work proceeds.

Use Proposer and Opposer independently in each phase:

- **Architect:** find the simplest responsible architecture; resist speculative infrastructure and hypothetical scale.
- **Designer:** create a clear, intentional, accessible, coherent, well-crafted experience; resist generic or ornamental UI.
- **Developer:** implement with correct, minimal, readable, reliable code and justified dependencies and abstractions.

Do not let implementation silently compromise architecture or design, architecture grow for hypothetical requirements, design become generic for implementation convenience, or code become sophisticated for appearance. Preserve decision history and treat alignment as provisional. When later evidence invalidates an earlier decision, reopen the smallest affected point, mark affected downstream work stale, revalidate it, and continue without restarting unrelated work.

Maintain the canonical architecture, design, implementation decision, and review artifacts. Finish with working software validated against the current specification, architecture, design, and accepted trade-offs.
