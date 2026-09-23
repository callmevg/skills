---
name: design-planning
description: "Develops an intentional, well-crafted product experience from an approved specification and architecture, covering information architecture, interaction, visual language, system states, accessibility, responsiveness, and design decisions."
argument-hint: "Provide the product specification, architecture, and existing design context"
---

# Experience And Design Planning

Design an experience that expresses the approved product intent and works within the current architecture. Follow [Product Implementation](../../instructions/implementation.instructions.md).

The governing question is: **What is the clearest, most intentional, and best-crafted experience for this product?** Treat design as a coherent system of product, interaction, content, and visual decisions rather than decoration or isolated screens.

## Gates

1. **DESIGN FROM USER OUTCOMES.** Ground decisions in users, context, tasks, product principles, and constraints rather than visual preference.
2. **INSPECT THE EXISTING SYSTEM.** Reuse established design language, components, assets, content patterns, and platform conventions unless a documented reason justifies change.
3. **DESIGN COMPLETE STATES.** Cover the states required for a usable journey, including loading, empty, error, success, permissions, partial progress, and recovery where relevant.
4. **SURFACE ARCHITECTURE CONFLICTS.** Do not hide an architectural limitation with a brittle interaction workaround; recommend reopening the affected decision.
5. **JUSTIFY VISIBLE ELEMENTS.** Every control and visual treatment must serve user need, hierarchy, feedback, navigation, comprehension, or product identity.

## Method

1. Extract user needs, journeys, product ethos, goals, non-goals, accessibility needs, platforms, content, and technical constraints.
2. Define information architecture, navigation, screen hierarchy, and the interaction model.
3. Specify core flows and relevant alternatives, interruptions, recovery paths, and edge states.
4. Define layout and composition, typography, spacing, rhythm, alignment, color, contrast, iconography, component responsibilities, visual hierarchy, content behavior, feedback, motion, responsiveness, input modes, and platform-specific behavior.
5. Evaluate accessibility across semantics, keyboard and assistive technology, focus, contrast, motion, zoom, text expansion, error recovery, and touch targets as relevant.
6. Record consequential alternatives, trade-offs, assumptions, and validation needs.

Prefer clarity, restraint, hierarchy, consistency, strong defaults, platform-appropriate behavior, and purposeful visual distinction. Reject generic SaaS composition, decoration without purpose, excessive cards, borders, shadows or gradients, unnecessary controls, arbitrary typography, inconsistent spacing, and trend-driven interaction unless product context justifies them.

## Outputs

Create or update:

- `design/design-spec.md`: status and inputs; experience principles; information architecture; journeys; screens and components; interaction and system states; responsive and platform behavior; accessibility; content; risks and validation.
- `design/design-decisions.md`: decision ID; status; context; alternatives; decision and rationale; consequences; architecture dependency; revisit trigger; date.
- `design/design-system-notes.md`: visual and interaction language, typography, spacing, color, iconography, components, motion, content patterns, and intentional deviations from existing systems.
- `design/design-review-checklist.md`: product clarity, journeys, hierarchy, craft, consistency, accessibility, responsive behavior, complete states, extremes, and validation evidence.

Scale detail to complexity. Use visual artifacts when they reduce ambiguity; ensure the written specification still captures behavior and rationale.
