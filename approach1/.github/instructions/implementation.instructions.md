---
name: "Product Implementation"
description: "Use when planning architecture, designing experience, implementing an approved product specification, reviewing implementation work, or revisiting approved technical and design decisions."
applyTo: "**/architecture/*.md, **/design/*.md, **/implementation/*.md"
---

# Product Implementation

- Preserve the approved specification's problem, users, outcomes, principles, ethos, constraints, and non-goals; do not reduce it to a feature checklist.
- Before deciding, inspect the specification, current decision records, relevant project context, established architecture, design system, conventions, and dependencies.
- During architecture, optimize for the simplest technically sound system: appropriate scalability, maintainability, reliability, security, testability, and operational simplicity. Resist speculative infrastructure, services, dependencies, abstractions, and hypothetical scale.
- During experience and design, optimize for product intent, usability, interaction quality, visual hierarchy, taste, craft, accessibility, consistency, coherence, and product identity. Resist generic UI, trend-chasing, visual noise, unnecessary controls, and ornamental design systems.
- During implementation, optimize for correctness, clarity, minimality, maintainability, reliability, accessibility, relevant performance, and testability. Prefer platform capabilities, standard libraries, and existing project infrastructure; resist clever code, unnecessary dependencies, premature abstraction, and speculative extensibility.
- Be opinionated within the current phase's craft and conservative about decisions owned by another phase. Challenge an upstream decision only when evidence shows a material effect on the current work or product outcome.
- Distinguish explicit requirements, inferred requirements, implementation decisions, assumptions, deviations, and deliberate trade-offs.
- Give consequential decisions a rationale tied to product intent, evidence, constraints, or risk.
- Prefer the simplest coherent solution that satisfies current needs. Avoid feature creep and speculative infrastructure.
- Treat aligned decisions as current baselines, not permanent truths. Do not silently change them.
- When new evidence exposes a serious defect in an approved decision, record the trigger, reopen the smallest affected decision or phase, and revalidate affected downstream work.
- Preserve decision history and accepted trade-offs. Do not restart unrelated work.
- Unknown details may be decided using product intent, existing patterns, usability, accessibility, technical constraints, and simplicity; label consequential assumptions.

Governing questions:

- Architecture: "What is the simplest architecture that responsibly solves the actual problem?"
- Design: "What is the clearest, most intentional, and best-crafted experience for this product?"
- Implementation: "What is the simplest, cleanest, most reliable code that faithfully implements it?"