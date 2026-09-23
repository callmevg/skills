---
name: skill-review
description: "Reviews and redesigns agent skills, instructions, prompts, and custom agents using adversarial lenses, reference checks, current primary guidance, and focused validation. Use when asked to audit, simplify, harden, or troubleshoot agent customizations."
argument-hint: "Provide the customization file, folder, or review scope"
---

# Skill Review

Review customizations as behavioral contracts: find contradictions, bypasses, stale references, misrouting, and instructions that make a capable model perform worse.

## Gates

1. **REPORT BEFORE EDITING.** Rank findings with evidence and obtain approval before redesigning unless the user explicitly requests immediate fixes.
2. **RESEARCH BEFORE REDESIGNING.** Check current first-party guidance for the target agent platform and any domain whose advice may have changed.
3. **KEEP REVIEWERS READ-ONLY.** The main agent owns synthesis and edits so parallel reviewers cannot create conflicting changes.
4. **VERIFY BEFORE REMOVAL.** Search the whole repository for inbound references before renaming, moving, or deleting a customization.
5. **VALIDATE AFTER EDITING.** Check discovery layout, frontmatter, references, diagnostics, and the behavior contracts changed by the redesign.

## Adversarial Review

Use distinct lenses, in parallel when practical:

- **Contradictions:** incompatible rules, ownership, priorities, or gates.
- **Loopholes:** vague escape clauses, completion laundering, and undefined decision terms.
- **Reference integrity:** exact paths, discovery layout, inbound references, duplication, and drift.
- **Trigger and scope:** false-positive and false-negative descriptions, overlaps, and missing handoffs.
- **Over-steering:** unnecessary procedure, rigid formats, and compounded constraints.
- **Holistic design:** missing capabilities, unclear state transitions, and the smallest coherent architecture.

Each finding includes severity, file and line, a concrete failure scenario, and the smallest credible fix. Deduplicate findings; independent convergence raises confidence. Reject reviewer claims that do not survive direct verification.

## Redesign Principles

- Preserve only load-bearing gates backed by a plausible failure case.
- Match detail to fragility: use exact procedures for deterministic or hazardous operations and high-freedom principles for judgment-heavy work.
- Keep shared rules in one instruction file and reference them instead of duplicating them.
- Treat output structures as defaults unless exact structure is operationally required.
- Keep descriptions specific about both capability and trigger conditions.
- Use progressive disclosure for details that are not needed on every invocation.
- Prefer deterministic scripts or hooks only for checks that are actually machine-verifiable.

## Execution And Verification

1. Make the smallest coherent set of central edits.
2. Update inbound references when a path or name changes.
3. Parse all changed frontmatter and verify each skill name matches its parent directory.
4. Resolve every local Markdown reference and delegated-agent name.
5. Run customization diagnostics and focused behavioral checks.
6. Report changes, validation, and remaining risks. Commit only when the user requests it.