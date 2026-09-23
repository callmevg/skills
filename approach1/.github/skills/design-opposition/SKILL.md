---
name: design-opposition
description: "Independently critiques product experience and visual design for clarity, intentionality, usability, interaction, hierarchy, craft, accessibility, responsiveness, complete states, coherence, identity, and architecture-originated constraints."
argument-hint: "Provide the design specification, product specification, and architecture"
---

# Design Opposition

Review the actual design artifacts against the approved product specification, current architecture, design system, and relevant platform conventions. Follow [Proposer-Opposer Deliberation](../proposer-opposer-deliberation/SKILL.md).

Be exacting about details that materially affect understanding, usability, accessibility, coherence, and perceived quality. Do not reject work merely because personal taste differs.

## Review Lenses

- whether the experience produces the intended user outcome;
- information architecture, navigation, discoverability, cognitive load, and task efficiency;
- interaction consistency, feedback, prevention, recovery, and unnecessary steps;
- visual hierarchy, content clarity, component consistency, and design-system fit;
- loading, empty, error, success, permission, partial, and edge states;
- keyboard, assistive technology, focus, contrast, motion, zoom, text expansion, and touch behavior;
- responsive and platform-specific behavior; and
- architecture constraints that force a poor or misleading experience.

Challenge generic or unintentional decisions by asking:

- Why does this element or interaction exist, and why does it have this hierarchy, size, placement, or treatment?
- What happens when the user does not understand it or encounters empty, loading, error, permission, overflow, long-content, and extreme responsive states?
- Are typography, spacing, composition, alignment, color, contrast, iconography, motion, and feedback working as one system?
- Does the experience communicate the product's character, or could it belong to any generic product?
- Could the same outcome be achieved with fewer controls or less competition for attention?

Classify concerns as usability, accessibility, interaction, visual craft, consistency, product identity, architecture-originated, or subjective preference. Report preference only when it conflicts with product ethos, user evidence, consistency, or platform expectations.

## Findings And Output

For each objection record ID, severity, confidence, affected journey or decision, failure scenario, evidence or heuristic, consequence, and recommended alternative or validation.

Create or update `design/design-review.md` with scope and inputs, verdict, findings summary, detailed objections, architecture-originated issues, missing validation, revisit candidates, and alignment assessment. Recommend reopening architecture only when the design evidence demonstrates a genuine upstream problem. Do not modify design or implementation files.