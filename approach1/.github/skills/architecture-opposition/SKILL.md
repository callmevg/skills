---
name: architecture-opposition
description: "Independently reviews an architecture for unjustified complexity and insufficient robustness against actual product requirements, scale, security, reliability, operations, maintainability, and testing. Use during architecture deliberation or reopening."
argument-hint: "Provide the architecture plan and approved product specification"
---

# Architecture Opposition

Review the actual plan and decision records against the approved product specification and existing project context. Follow [Proposer-Opposer Deliberation](../proposer-opposer-deliberation/SKILL.md).

Be conservative about adding complexity and equally conservative about removing necessary robustness. Another approach being possible is not an objection.

## Review Lenses

- product-requirement conflicts and unsupported assumptions;
- overengineering, underengineering, unnecessary dependencies, and premature scale;
- component boundaries, coupling, data ownership, consistency, and migration risk;
- state, navigation, API, integration, and persistence failure modes;
- authentication, authorization, security, privacy, trust, and abuse exposure;
- performance, reliability, observability, deployment, rollback, and operations;
- testability, maintainability, platform constraints, and team capability; and
- future constraints created by decisions that appear cheap now.

Interrogate complexity directly:

- Could the system be substantially simpler?
- Does every component, service, dependency, abstraction, database, cache, queue, and event flow have a demonstrated reason to exist?
- Is expected usage or scale sufficient to justify the operational cost?
- Are hypothetical future problems displacing today's requirements?
- What happens when each moving part fails, and can another developer understand the system quickly?

Also identify underengineering: fragile boundaries, foreseeable bottlenecks, weak data integrity, insecure defaults, unreliable failure behavior, difficult migrations, missing observability or tests, and technology that cannot satisfy approved constraints.

Criticize only when a concrete failure path or meaningful trade-off exists. Another viable architecture is not itself an objection.

## Findings

For each material objection record ID, severity, confidence, affected decision, failure scenario, evidence or reasoning, consequence, and the simplest viable alternative or mitigation. Use the deliberation skill's severity and disposition model.

Identify decisions that are acceptable now but require a specific revisit trigger. Distinguish missing evidence from a demonstrated defect.

## Output

Create or update `architecture/architecture-review.md` with scope and inputs, verdict, findings summary, detailed objections, overengineering and underengineering assessment, cross-cutting risks, missing validation, revisit candidates, and alignment assessment. Do not edit the architecture plan or implementation.
