---
name: implementation-planning-execution
description: "Implements approved architecture and design with the minimum clean, reliable, maintainable code needed, using incremental validation and preserving decision history. Use when coding, revising implementation, or escalating an upstream conflict."
argument-hint: "Provide the approved specification, architecture, design, and implementation scope"
---

# Implementation Planning And Execution

Translate the current aligned specification, architecture, and design into working software. Follow [Product Implementation](../../instructions/implementation.instructions.md).

Prioritize correctness, simplicity, readability, maintainability, reliability, accessibility, relevant performance, and testability, in that order unless product evidence requires a different trade-off. The governing question is: **What is the simplest, cleanest, most reliable code that faithfully implements the current design and architecture?**

## Gates

1. **INSPECT BEFORE CHANGING.** Read relevant code, tests, architecture, design system, conventions, dependencies, and current decisions before the first edit.
2. **IMPLEMENT AGAINST CURRENT BASELINES.** Do not silently alter approved product, architecture, or design decisions. Record a deviation or request reopening when the baseline creates a genuine conflict.
3. **VALIDATE EACH SLICE.** After a substantive edit, run the cheapest behavior-focused check that can falsify it before widening scope.
4. **FINISH WITH EXECUTABLE EVIDENCE.** Completion requires relevant tests, static checks, builds, and user-facing verification where the environment supports them.
5. **JUSTIFY DEPENDENCIES AND ABSTRACTIONS.** Prefer the platform, standard library, and existing project capabilities. Add indirection only when it removes demonstrated complexity or supports an approved boundary.

## Method

1. Determine the current aligned scope, dependencies, acceptance signals, and unresolved risks.
2. Inspect the nearest implementation surface and existing patterns. Form a falsifiable local hypothesis before editing.
3. Break work into thin, dependency-aware slices that produce testable behavior.
4. Implement the smallest coherent slice with explicit behavior, clear names, simple control flow, focused functions, straightforward data flow, and established project infrastructure.
5. Validate behavior, errors, accessibility, security, performance, and design fidelity in proportion to risk. For visual interfaces, inspect rendered desktop and mobile states when tooling is available.
6. Record consequential implementation decisions, deviations, accepted shortcuts, migration needs, and upstream conflicts.
7. Repeat until the agreed scope is implemented and focused validation passes.

Before adding a dependency, verify that platform, standard-library, or existing project capabilities are insufficient and that the maintenance and security cost is justified. Before adding an abstraction, verify a demonstrated repeated need and that it makes the code clearer. Do not abstract hypothetical requirements, optimize without evidence, add wrapper APIs without meaningful value, or remove small duplication at the cost of indirection.

## Decision Handling

Implementation may fill unspecified details using product intent and project conventions. It may not silently redefine a higher-level decision. When evidence demonstrates that an approved architecture or design prevents the intended outcome or creates unacceptable risk, stop the affected slice and recommend reopening with the concrete evidence and downstream impact.

## Output

Maintain `implementation/implementation-decisions.md` with decision ID, status, context, governing requirement or upstream decision, alternatives, implementation choice and rationale, consequences, validation, deviations, revisit trigger, and date.

Report changed files, behavior delivered, validation run and results, deviations, blockers, and any reopening recommendation.
