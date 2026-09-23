---
name: implementation-orchestration
description: "Coordinates Proposer and Opposer through Architect, Designer, and Developer phases from an approved specification, preserving craft ownership, provisional alignment, targeted reopening, and downstream revalidation."
argument-hint: "Provide the approved product specification or ask to resume implementation"
---

# Implementation Orchestration

Build a coherent product from the current approved specification. Follow [Product Implementation](../../instructions/implementation.instructions.md) and [Proposer-Opposer Deliberation](../proposer-opposer-deliberation/SKILL.md).

## Gates

1. **VERIFY THE INPUT BASELINE.** Begin only from a current `product-spec-final.md` or an explicitly approved equivalent. If it is stale, exploratory, or materially incomplete, return to product development.
2. **ALIGN BEFORE DEPENDENCE.** Downstream work may begin only when the decisions it relies on are aligned; unrelated work may proceed when dependencies are independent.
3. **KEEP ROLES INDEPENDENT.** Proposer owns proposals and implementation. Opposer owns challenge. Orchestrator owns phase transitions, reopening, and final completion.
4. **REOPEN ON EVIDENCE, NOT DIFFICULTY.** Implementation inconvenience alone does not invalidate architecture or design; a demonstrated conflict with product outcomes, constraints, feasibility, or unacceptable risk can.
5. **VALIDATE WORKING SOFTWARE.** Completion requires executable validation of important behavior, not artifact agreement alone.
6. **DECIDE AT THE RIGHT LEVEL.** Let each phase be strongly opinionated about its craft and conservative outside it; resolve cross-phase disagreement through evidence and explicit trade-offs rather than authority.

## Phases

### Architecture

Proposer operates as Architect and applies [Architecture Planning](../architecture-planning/SKILL.md). Opposer operates as Architecture Reviewer and applies [Architecture Opposition](../architecture-opposition/SKILL.md). Align only when the architecture is the simplest responsible fit for actual requirements, including necessary robustness.

### Experience And Design

Proposer operates as Designer and applies [Experience and Design Planning](../design-planning/SKILL.md) against the current specification and architecture. Opposer operates as Design Critic and applies [Design Opposition](../design-opposition/SKILL.md). Align only when the experience is intentional, coherent, accessible, well-crafted, and faithful to product identity. Reopen architecture when design evidence exposes a genuine architectural constraint.

### Implementation

Proposer operates as Developer and applies [Implementation Planning and Execution](../implementation-planning-execution/SKILL.md). Opposer operates as Development Reviewer and applies [Implementation Opposition](../implementation-opposition/SKILL.md) to actual code and behavior. Align only when the implementation is correct, minimal, readable, reliable, maintainable, accessible, and validated.

Each phase uses `Propose -> Challenge -> Respond -> Revise -> Final review -> Align`. Response and repeat review focus on Critical and High objections plus cumulative Medium risk. Low findings do not trigger another cycle. Skip repeated steps when there is no material objection or revision to inspect; record why.

## State And Artifacts

Track the current phase, proposal version, objections and dispositions, aligned decisions, accepted trade-offs, deferred issues, reopening events, downstream impacts, and validation results.

Canonical artifacts:

- `architecture/architecture-plan.md`, `architecture-review.md`, `architecture-decisions.md`, `architecture-risks.md`
- `design/design-spec.md`, `design-review.md`, `design-decisions.md`, `design-system-notes.md`, `design-review-checklist.md`
- `implementation/implementation-decisions.md`, `implementation-review.md`

At the top of each artifact record status, update date, source inputs, and material limitations. Mark downstream artifacts `Stale` when a reopened decision can change them. Preserve superseded decisions in history rather than rewriting the past.

## Reopening

Reopen when new evidence contradicts an assumption, a later requirement exposes an upstream weakness, a constraint invalidates a decision, an unacceptable consequence appears, or a materially better option changes the trade-off. Record the trigger and impact, reconsider the smallest affected decision, then revalidate only affected downstream work.

## Completion Gate

The product is complete for the agreed scope when all three phases are currently aligned; no Critical objection is unresolved; High objections are resolved or explicitly accepted with residual risk; approved requirements and relevant design states are implemented; focused tests, static checks, and user-facing validation pass where available; and known limitations, deferred work, and accepted trade-offs are documented.