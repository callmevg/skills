---
name: "Product Artifacts"
description: "Use when creating or updating product workflow artifacts. Defines shared status, provenance, confidence, limitation, staleness, and provisional-output rules."
applyTo: "**/idea-brief.md, **/research-report.md, **/synthesis.md, **/product-spec-draft.md, **/red-team-report.md, **/product-spec-final.md"
---

# Product Artifacts

- At the top of each artifact, record its status, update date, source inputs, and material limitations. Evidence-bearing artifacts also state confidence and define the scale used.
- Link source artifacts and preserve source citations rather than copying claims without provenance.
- Mark an artifact `Stale` when an upstream change could alter one of its conclusions, decisions, requirements, or risk dispositions. Name the changed dependency and affected sections.
- Refresh stale inputs before normal downstream work. When the user explicitly needs an interim result, label it `Provisional`, identify stale dependencies, and state what must be revisited.
- A final specification must not depend on a stale artifact. Unknown or unavailable metadata is labeled explicitly rather than invented.
- Do not create empty placeholders or retain required-looking sections that contain no decision-useful information.