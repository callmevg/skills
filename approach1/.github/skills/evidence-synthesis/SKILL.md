---
name: evidence-synthesis
description: "Reconciles user context with external evidence, classifies assumptions, surfaces contradictions, and updates opportunity framing. Use after product research, when evidence changes an idea, or before a consequential product decision."
argument-hint: "Synthesize the current idea brief and research report"
---

# Evidence Synthesis

## Inputs

- User context from `idea-brief.md` or an equivalent brief, decision record, or explicit user input.
- External evidence from `research-report.md` or an equivalent cited source set.
- [Evidence Evaluation](../../instructions/evidence.instructions.md)
- [Product Thinking](../../instructions/product-thinking.instructions.md)
- [Product Artifacts](../../instructions/product-artifacts.instructions.md)

If either side is too incomplete for the requested conclusion, identify the missing input and narrowest way to obtain it. A partial synthesis may document what is known, but its status must show the blocked decision.

## Procedure

1. Extract the material claims, assumptions, goals, constraints, and proposed directions that affect the current decision.
2. Map evidence to each item and preserve its citations and limitations.
3. Assign each material assumption an evidence status:
   - `Supported` - credible evidence directly supports the claim;
   - `Partially supported` - evidence supports only part or relies on important limits;
   - `Unsupported` - no adequate evidence currently supports it;
   - `Contradicted` - credible evidence conflicts with it; or
   - `Unresolved` - available evidence is insufficient or genuinely conflicting.
4. Record confidence, alternatives, and the next useful validation method as separate fields. Use `None` when more validation would not change a decision.
5. Determine whether the original problem framing still holds and explain any evidence-driven change.
6. Separate researchable questions from decisions only the user can make.
7. If a contradiction could change the problem, target user, or chosen direction, request the needed user decision or validation before recommending a decision-ready specification.
8. Recommend one next action and write or update `synthesis.md` without modifying source artifacts merely to make them agree.

## Confidence Scale

- `High`: multiple credible, relevant sources or direct validated evidence; no major unresolved contradiction.
- `Medium`: useful evidence exists but has material limitations or indirectness.
- `Low`: sparse, weak, conflicting, or mostly inferred evidence.

Confidence reflects evidence quality, not enthusiasm or likelihood of commercial success.

## Default Structure

Adapt this structure to the decision:

1. `Status, Inputs, and Current View`
2. `What Changed`
3. `Assumption Assessment` - assumption, evidence status, evidence, confidence, next validation method, and decision impact.
4. `Contradictions and Alternative Explanations`
5. `Revised Opportunity Framing`
6. `Opportunities, Risks, and Important Unknowns`
7. `User Decisions Needed`
8. `Recommended Next Action`