---
name: architecture-planning
description: "Develops the simplest responsible technical architecture from an approved product specification, covering components, data, reliability, security, testing, deployment, scale limits, and trade-offs. Use before implementation or when reopening architecture."
argument-hint: "Provide the approved product specification and project context"
---

# Architecture Planning

Create the simplest architecture that can faithfully support the approved product and its credible near-term constraints. Follow [Product Implementation](../../instructions/implementation.instructions.md).

The governing question is: **What is the simplest architecture that responsibly satisfies the actual requirements?** Simplicity means fewer justified moving parts, not omission of failure handling, security, data integrity, observability, testing, or maintainability.

## Gates

1. **GROUND THE PLAN.** Read the approved specification and inspect existing project architecture, dependencies, platform constraints, and established patterns before selecting technology.
2. **COMPARE MEANINGFUL ALTERNATIVES.** Consider alternatives only for decisions with material trade-offs; do not create ceremonial option lists.
3. **MAKE CONSEQUENCES VISIBLE.** Record assumptions, rejected alternatives, lock-in, operational burden, and conditions that should reopen a decision.
4. **JUSTIFY COMPLEXITY.** Every service, dependency, database, cache, queue, event flow, abstraction, and infrastructure layer needs a demonstrated requirement.

## Method

1. Extract product outcomes, non-goals, expected usage, platforms, data, integrations, quality requirements, privacy and security constraints, delivery constraints, and unresolved assumptions.
2. Identify the decisions that constrain multiple parts of the system.
3. Evaluate reasonable approaches against simplicity, product fit, existing context, team capability, delivery risk, maintainability, security, testability, operations, and evidenced usage or scale.
4. Define components and boundaries, data ownership and model, state and navigation architecture where relevant, APIs and integrations, persistence, identity and authorization, failure handling, observability, testing, deployment, and migration strategy in proportion to the product.
5. Separate current requirements from optional evolution paths. Do not implement speculative scale.
6. Validate that every significant requirement has an architectural path and every major component has a product or operational rationale.

Prefer boring, proven technology, standard platform capabilities, clear ownership boundaries, simple data models, and straightforward state flow. Treat microservices, distributed coordination, event-driven architecture, additional databases, caching, queues, and generic abstraction layers as costs that require evidence, not marks of maturity.

## Outputs

Create or update:

- `architecture/architecture-plan.md`: status and inputs; context and quality drivers; system boundaries; component/data/integration views; security and privacy; failure handling; testing and deployment; risks, assumptions, and open questions.
- `architecture/architecture-decisions.md`: stable decision ID; status; context; options considered; decision and rationale; consequences; rejected alternatives; revisit trigger; affected areas; date.
- `architecture/architecture-risks.md`: risk, likelihood and impact, evidence, mitigation, owner when known, validation, residual risk, and trigger for architectural evolution.

Adapt sections to the product. Diagrams should clarify boundaries or flow, not decorate the document.
