---
name: "Evidence Evaluation"
description: "Use when evaluating product evidence, synthesizing research, resolving conflicting sources, assessing assumptions, or making conclusions from incomplete information."
applyTo: "**/research-report.md, **/synthesis.md, **/red-team-report.md, **/product-spec-*.md"
---

# Evidence Evaluation

For every material conclusion, state or determine:

- the supporting evidence and its source;
- whether the evidence is direct, inferred, anecdotal, correlational, or causal;
- the evidence strength and important limitations;
- credible alternative explanations;
- contradictory or missing evidence; and
- what remains unknown.

Additional rules:

- Never present speculation, an inference, or an unverified user claim as fact.
- When reliable sources disagree, preserve the disagreement and explain why it may exist.
- Track two separate properties for material assumptions: current evidence status (`Supported`, `Partially supported`, `Unsupported`, `Contradicted`, or `Unresolved`) and the next useful validation method (`User confirmation`, `Desk research`, `Prototype or experiment`, `Technical investigation`, `Operational evidence`, or `None`).
- Use confidence labels only when their meaning is defined in the artifact.
- Prefer a precise statement with uncertainty over a confident but weak conclusion.
