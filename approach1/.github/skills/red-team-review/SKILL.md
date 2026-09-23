---
name: red-team-review
description: "Aggressively challenge a product specification for problem validity, desirability, adoption, retention, differentiation, viability, feasibility, trust, privacy, accessibility, abuse, operations, scale, and strategic failure. Use to produce a severity-ranked Red Team Report before finalization."
argument-hint: "Red-team the current product specification draft"
---

# Product Spec Red Team

## Posture

Assume the specification may fail where credible pathways exist. Seek disconfirming evidence and concrete failure paths rather than polishing the proposal. Follow [Product Specification](../../instructions/product-spec.instructions.md), [Evidence Evaluation](../../instructions/evidence.instructions.md), and [Product Artifacts](../../instructions/product-artifacts.instructions.md).

Critique the specification fairly: distinguish a documented defect from a question, missing evidence, preference, or speculative risk. Do not manufacture certainty or severity.

## Procedure

1. Read `product-spec-draft.md` and the current source material it relies on. Record missing or stale inputs when they prevent or weaken a meaningful review.
2. Reconstruct the product's causal chain: problem exists, target user encounters it, proposed action is adopted, experience creates value, value repeats or sustains the intended outcome, and the operating model remains viable.
3. Try to break each link using artifact evidence, external evidence when needed, counterexamples, and plausible alternative explanations.
4. Review:
   - problem validity, frequency, severity, and existing behavior;
   - user desirability, incentives, switching costs, adoption, activation, retention, and abandonment;
   - scope coherence, usability, accessibility, edge cases, and failure recovery;
   - differentiation, substitutes, distribution, economics, and business viability;
   - technical feasibility, data quality and availability, dependencies, security, privacy, and trust;
   - abuse cases, vulnerable populations, second-order effects, and unintended incentives;
   - operational complexity, support, moderation, compliance, rollout, and scalability; and
   - strategic risks, ecosystem reactions, and ways metrics could be misleading or gamed.
5. Trace requirements back to needs and evidence. Flag unsupported scope, missing acceptance signals, and metrics that cannot decide anything.
6. For each finding, describe the failure scenario, affected users or goals, evidence or reasoning, consequence, confidence, mitigation, and residual uncertainty.
7. Search for interactions between findings and second-order effects, not just isolated defects.
8. Identify the strongest parts of the specification only when doing so clarifies which risks are already controlled.
9. Write or replace `red-team-report.md`. Do not directly revise the specification during review.

## Severity

- `Critical`: invalidates the core opportunity or makes launch unsafe, unlawful, technically impossible, or unable to produce the intended outcome; must be resolved before finalization.
- `High`: likely to materially harm adoption, outcomes, trust, viability, or delivery; must be mitigated or explicitly accepted and documented.
- `Medium`: meaningful weakness with bounded impact or a credible workaround; should be addressed or tracked.
- `Low`: limited impact, polish concern, or low-probability issue; may be deferred.

Severity reflects impact and likelihood supported by reasoning, not rhetorical emphasis.

## Confidence

- `High`: direct evidence or multiple credible inputs support the failure path.
- `Medium`: the path is credible but relies on limited or indirect evidence.
- `Low`: the impact could be severe, but the path is currently speculative and needs targeted validation.

Keep confidence separate from severity. A low-confidence Critical finding remains a validation blocker until resolved or disproven; it is not evidence that failure is certain.

## Red Team Report Format

1. `Review Scope and Inputs`
2. `Verdict` - `Blocked`, `Revise`, or `Ready with documented risks`, with rationale.
3. `Finding Summary` - ID, title, severity, confidence, affected area, and disposition.
4. `Detailed Findings` - problem, failure scenario, why it matters, evidence/reasoning, confidence, mitigation, validation, and residual risk.
5. `Cross-Cutting and Second-Order Risks`
6. `Missing Evidence and Tests`
7. `Required Revisions` - ordered by decision impact.
8. `Accepted or Deferred Risks` - owner and rationale if known.
9. `Exit-Criteria Assessment` - unresolved Critical and High findings.

Verdict routing:

- `Blocked`: resolve stale or missing inputs, a Critical finding, or a required user decision before finalization.
- `Revise`: triage findings and revise the appropriate source artifact or specification.
- `Ready with documented risks`: proceed to the orchestration exit criteria; the verdict alone does not authorize finalization.
