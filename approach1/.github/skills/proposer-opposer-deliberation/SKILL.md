---
name: proposer-opposer-deliberation
description: "Runs structured proposal and opposition cycles with explicit objection dispositions, alignment gates, and targeted decision reopening. Use when architecture, design, or implementation decisions need independent challenge without endless debate."
argument-hint: "Provide the phase, proposal, and decision to deliberate"
---

# Proposer-Opposer Deliberation

Use independent proposal and challenge to improve consequential decisions. The Opposer does not automatically win; the Proposer does not dismiss objections merely to preserve momentum.

Within each phase, both roles apply the same craft standard from different positions: Proposer owns the work; Opposer independently tests it. Architecture values simplicity with necessary rigor, design values intentional experience and craft, and implementation values correct minimal code.

## Gates

1. **REVIEW THE ACTUAL WORK.** The Opposer independently inspects source artifacts or implementation, not only the Proposer's summary.
2. **DISPOSE EVERY MATERIAL OBJECTION.** A phase cannot align while a Critical objection is unresolved or a High objection lacks an explicit disposition.
3. **REQUIRE NEW INFORMATION FOR REPEAT DEBATE.** If another cycle adds no evidence, reasoning, alternative, or changed constraint, record the disagreement and decide.
4. **REOPEN NARROWLY.** Later evidence reopens the smallest affected decision or phase and only the downstream work it can change.
5. **RESPECT CRAFT OWNERSHIP.** A phase may challenge another phase when evidence shows material impact, but it cannot casually override decisions outside its expertise.
6. **MATCH DEBATE TO IMPACT.** Critical and High objections receive explicit responses. Medium objections are handled together and do not block alignment unless their combined effect is High. Low objections are recorded as optional improvements without a response cycle.

## Cycle

1. **Propose:** Proposer creates or updates the phase artifact and decision record.
2. **Challenge:** Opposer identifies substantive objections, failure paths, contradictions, edge cases, and credible alternatives.
3. **Respond:** Proposer evaluates each objection against product intent, evidence, constraints, and trade-offs.
4. **Revise:** Proposer changes the proposal where warranted and records dispositions.
5. **Final review:** Opposer verifies the revision and remaining dispositions.
6. **Align:** Orchestrator decides whether the phase gate passes.

## Objection Record

For each material objection record:

- ID, severity, confidence, and concise impact statement;
- affected decision and failure scenario;
- evidence or reasoning;
- recommended alternative or mitigation;
- Proposer response; and
- final disposition.

## Severity And Debate Weight

- `Critical`: likely to make the product unsafe, unlawful, infeasible, fundamentally incorrect, or unable to achieve a core outcome. Blocks alignment until resolved or disproven.
- `High`: materially threatens an approved outcome, reliability, security, accessibility, maintainability, delivery, or user experience. Requires explicit disposition before alignment.
- `Medium`: bounded weakness with a viable workaround or limited impact. Address in the current revision when efficient; otherwise defer with rationale. Does not independently block alignment.
- `Low`: minor polish, local improvement, or low-impact preference. Record briefly if useful; no Proposer response or repeat review is required.

Confidence is separate from severity. Use `High`, `Medium`, or `Low` confidence based on evidence strength. Low-confidence Critical or High concerns require targeted validation, not extended speculative debate.

The Opposer reports the smallest set of independent, decision-relevant objections, ordered by severity. Merge duplicates and symptoms with the same root cause. Do not inflate severity to force action.

Allowed dispositions:

- `Resolved`: proposal changed and concern addressed.
- `Rejected`: objection considered and rejected with rationale.
- `Accepted trade-off`: concern is valid; decision is retained with residual risk.
- `Deferred`: outside current scope, with owner or trigger when known.
- `Revisit later`: acceptable now, with a defined condition that reopens it.
- `Unresolved`: more evidence, work, or a user decision is required.

## Alignment Gate

A phase is sufficiently aligned when no Critical objection is unresolved; every High objection has a defensible disposition; cumulative Medium risk is acceptable; important decisions and trade-offs are documented; and the current proposal is internally coherent. Low objections never block alignment. Alignment is a current baseline, not permanent approval.

## Reopening Protocol

Record the original decision, reopening trigger, new evidence or reasoning, revised decision or reaffirmation, affected downstream decisions, and required revalidation. Continue from the earliest affected point without restarting unrelated work.
