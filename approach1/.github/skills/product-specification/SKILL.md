---
name: product-specification
description: "Creates or revises focused, testable product specifications from current evidence or equivalent validated context. Use for PRDs, exploratory specs, requirements, journeys, scope, risks, and success criteria."
argument-hint: "Create or revise the product specification from current artifacts"
---

# Product Specification

Follow [Product Specification](../../instructions/product-spec.instructions.md), [Evidence Evaluation](../../instructions/evidence.instructions.md), and [Product Artifacts](../../instructions/product-artifacts.instructions.md).

## Gates And Modes

1. **MAKE THE BASIS VISIBLE.** Use the strongest available inputs: workflow artifacts when present, or equivalent briefs, interviews, research, strategy documents, and explicit user decisions.
2. **REQUIRE A COHERENT CORE.** The problem, target users, desired outcomes, important alternatives, and binding constraints must be explicit enough to choose scope. Otherwise identify the missing decision and return upstream.
3. **LABEL MATURITY HONESTLY.** Use `Decision-ready` only when no unresolved contradiction could change the committed problem or target user. Otherwise use `Exploratory` and frame scope as hypotheses and validation, not approved delivery commitments.
4. **FINALIZE THROUGH ORCHESTRATION.** Write `product-spec-final.md` only after the orchestration exit criteria pass.

## Method

1. Extract the current problem framing, evidence, users, outcomes, constraints, assumptions, risks, and chosen direction.
2. Define goals and non-goals that protect the smallest coherent scope.
3. Explain the proposed solution as a hypothesis and why it is preferable to current alternatives.
4. Describe only the journeys needed to understand trigger, value, recovery, and repeat use.
5. Write testable requirements. Use stable IDs when traceability or change history benefits from them; tie material requirements to a need, goal, constraint, or mitigation.
6. Add non-functional requirements, edge cases, dependencies, data, privacy, trust, accessibility, abuse, operations, and rollout detail in proportion to actual relevance and risk.
7. Define a compact metric set. Each decision metric includes a measure, threshold or comparison, window or cohort where relevant, and the decision it informs.
8. Preserve assumptions and open questions. Validation plans state the hypothesis, method, signal, and decision rule at the level currently knowable.

## Default Structure

Adapt this structure to the product and decision. Omit irrelevant sections rather than filling them with boilerplate.

1. `Status, Inputs, and Evidence Limits`
2. `Problem, Users, and Desired Outcomes`
3. `Goals and Non-Goals`
4. `Proposed Solution and Rationale`
5. `Core Journeys and Requirements`
6. `Relevant Quality, Edge, and Trust Requirements`
7. `Constraints and Dependencies`
8. `Assumptions, Risks, and Validation`
9. `Success Metrics and Decision Criteria`
10. `Open Questions and Traceability`

For a small or exploratory product, combine sections freely. Expand conditional areas only when they affect a decision, acceptance criterion, risk, or delivery plan.
