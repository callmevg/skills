---
name: product-development-orchestration
description: "Coordinates an adaptive product workflow across discovery, research, synthesis, specification, red-team review, and revision. Use when developing a raw idea, resuming product work, or deciding the next stage from existing evidence and artifacts."
argument-hint: "Describe the product idea or ask to continue the current workflow"
---

# Product Development Orchestration

Produce the strongest decision-useful product specification supported by current evidence and user decisions. Follow the shared [Product Artifacts](../../instructions/product-artifacts.instructions.md) contract.

## Gates

1. **INSPECT BEFORE ROUTING.** Read the latest request, existing artifacts, and equivalent source material before choosing a stage. File absence alone never forces a stage.
2. **USE ONE NEXT ACTION.** Choose the action that resolves the highest-impact uncertainty or advances the user's stated decision; do not run every stage by default.
3. **SURFACE CONSEQUENTIAL UNCERTAINTY.** Never invent a user decision or silently resolve a contradiction that could change the problem, target user, scope, or accepted risk.
4. **RESPECT DEPENDENCIES.** Refresh stale inputs before normal downstream work; use a clearly labeled provisional output only when the shared artifact contract permits it.
5. **FINALIZE ONLY ON CURRENT EVIDENCE.** A final specification cannot depend on stale inputs or unresolved Critical findings.

## Artifact Map

Use these canonical names when a stage produces an artifact:

| Artifact | Owner capability | Purpose |
| --- | --- | --- |
| `idea-brief.md` | Product Discovery | Opportunity and assumptions |
| `research-report.md` | Product Researcher | External evidence and sources |
| `synthesis.md` | Product Synthesizer | Current beliefs and changed framing |
| `product-spec-draft.md` | Product Specification skill | Proposed scope and requirements |
| `red-team-report.md` | Product Red Team | Severity-ranked challenge |
| `product-spec-final.md` | Orchestrator using Product Specification skill | Revised, decision-ready specification |

Artifacts are an audit trail, not prerequisites for their own sake. Existing briefs, interview notes, research, strategy documents, or explicit user decisions may substitute when they contain the needed information; record them as inputs. Create only artifacts that support the current decision.

## Choose The Next Action

- **Discovery:** the problem, affected people, context, current behavior, desired outcome, or binding constraints are unclear enough to change the direction.
- **Research:** external evidence could materially change confidence, alternatives, feasibility, or risk. Skip broad research when it cannot affect the immediate decision; record the evidence limit.
- **Synthesis:** user context and external evidence exist but have not been reconciled, or new evidence changes the framing.
- **User decision:** the next choice depends on intent, authority, ethics, constraints, or risk acceptance rather than discoverable evidence.
- **Specification:** inputs support a coherent direction, or the user needs an explicitly exploratory specification to define hypotheses and validation.
- **Red team:** a current draft needs independent challenge before finalization or a consequential commitment.
- **Revision:** findings or new decisions require changes. Return upstream when they challenge upstream evidence rather than patching requirements.
- **Finalization:** the exit criteria below pass.
- **Pause/stop:** external validation is required, evidence does not justify proceeding, or the user pauses.

## Delegation Contracts

Delegate one bounded question or artifact at a time. Provide source paths, relevant user context, the decision to support, constraints, and the completion gate. Require changed files, key conclusions, blockers, and recommended next action.

- Use **Product Discovery** for `idea-brief.md`; it must not write a product specification.
- Use **Product Researcher** for `research-report.md`; it must cite factual claims and must not define product scope.
- Use **Product Synthesizer** for `synthesis.md`; it must preserve contradictions rather than silently resolve them.
- Apply [Product Specification](../product-specification/SKILL.md) to create or revise specification files.
- Use **Product Red Team** for `red-team-report.md`; it must not directly edit the specification it reviews.

Check returned work against its substantive gate, provenance, and relevant default structure. Do not reject useful work for omitting a section that is irrelevant to the decision. Specialists advise; the orchestrator owns routing and user communication.

## Revision And Finalization

Triage findings as `Resolve`, `Mitigate`, `Accept`, `Defer`, `Dispute with evidence`, or `Needs user decision`. Re-run red-team review after material changes addressing Critical or High findings or introducing comparable risk.

Create `product-spec-final.md` only when:

- every Critical finding is resolved or disproven; a low-confidence Critical finding requires validation, not silent acceptance;
- every High finding is resolved, mitigated, or explicitly accepted with rationale, confidence, and residual risk;
- the specification traces material requirements to needs, goals, evidence, constraints, or mitigations;
- material assumptions, open questions, evidence limits, non-goals, and success criteria remain visible;
- all relied-on inputs are current; and
- no missing user decision could change the committed direction.

The final specification must include a `Decision Record and Residual Risks` section and link to the source artifacts. Never describe the product as validated when the evidence supports only a hypothesis.