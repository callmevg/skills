# Synthesis

## Executive Conclusions

1. **Choose by control layer.** Instructions supply persistent guidance; prompts invoke saved tasks; skills package discoverable procedures/resources; agents define roles and capability boundaries; tools/MCP add actions and current data; hooks and application policy enforce behavior. These layers compose, but are not interchangeable ([VS Code customization](https://code.visualstudio.com/docs/agents/concepts/customization)).
2. **Context quality dominates context volume.** The practical target is the smallest high-signal context that carries enough policy, task state, evidence, and tools to succeed. Larger windows do not eliminate relevance dilution, retrieval errors, or context pollution ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [VS Code context](https://code.visualstudio.com/docs/agents/concepts/context)).
3. **Progressive disclosure is the scalable default.** Always load only routing metadata and true invariants; activate procedures, references, and tools when relevant; retrieve detailed evidence just in time; isolate high-volume investigations ([Agent Skills specification](https://agentskills.io/specification), [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)).
4. **Model guidance is not enforcement.** A `must` in prose remains probabilistic. Put mandatory blocks and guarantees in authorization, schemas, hooks, sandboxing, CI, or code, and preserve human approval for consequential actions ([VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks), [OWASP prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)).
5. **Portability has layers.** Agent Skills and MCP provide interoperable cores; host discovery paths, frontmatter extensions, hook events, agent handoffs, precedence, runtime permissions, and sharing semantics remain vendor-specific. Test the same asset on every claimed host ([Agent Skills specification](https://agentskills.io/specification), [MCP specification](https://modelcontextprotocol.io/specification/latest), [GitHub custom agents](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)).
6. **Customization is software.** Version it, own it, review its dependencies and licenses, test positive and adversarial behavior, measure regressions, deprecate it deliberately, and keep secrets outside it ([Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)).

## A Layered Mental Model

```text
Authority:     platform/system > application/developer > user request > untrusted data
Governance:    organization policy > repository policy > personal preference
Context:       static invariants + current task + selected evidence + working state
Capability:    tools/functions + MCP resources/tools/prompts
Workflow:      prompt/skill/agent + handoffs/subagents/orchestrator
Enforcement:   schemas + authorization + approvals + hooks + sandbox + CI
Observability: provenance + traces + evals + ownership + version history
```

The first line is a model/application trust hierarchy; the second is a vendor customization scope. They must not be collapsed. A personal Copilot instruction may have product-specific priority over repository text while still being lower authority than the host's system safety rules ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).

## Constructing Context

### Static core

Include only information that is stable, broadly relevant, hard to infer, and costly to rediscover: product purpose, architectural boundaries, validated build/test commands, non-default conventions, and security constraints. Keep canonical detail in normal project documentation and link it from concise instructions. VS Code recommends this project-documentation-plus-thin-instructions pattern ([VS Code context engineering guide](https://code.visualstudio.com/docs/agents/guides/context-engineering-guide)).

### Dynamic assembly

For each request, assemble:

1. The exact goal, constraints, output contract, and acceptance checks.
2. Current environment state: selected files, errors, diffs, branch, and tool availability.
3. The smallest relevant evidence set, with source, date, trust label, and retrieval query.
4. Only the tool schemas needed now; defer the rest.
5. A compact working state: decisions, open questions, progress, validation, and next action.

This mirrors VS Code's context layers and OpenAI's distinction between developer instructions, user input, and retrieved context ([VS Code context](https://code.visualstudio.com/docs/agents/concepts/context), [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)).

### Progressive disclosure

Build navigation rather than context dumps. Good names and descriptions let a router select an asset. A short `SKILL.md` explains the path. Focused reference files answer one branch. Scripts perform deterministic work without forcing source code into model context. The same principle supports deferred tool search and agentic file retrieval ([Agent Skills specification](https://agentskills.io/specification), [Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)).

### Compaction and memory

Compaction should produce a typed handoff, not a generic summary:

```yaml
goal: ...
constraints: [...]
decisions: [{decision: ..., evidence: ...}]
artifacts_changed: [...]
validation: [{check: ..., result: ...}]
open_questions: [...]
trusted_sources: [...]
next_action: ...
```

Raw old tool output can usually be replaced by findings plus retrievable pointers. Persistent memory should retain useful state with provenance and expiry, but current source-of-truth files and policy always win ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

## Designing Assets

### Instructions

Write atomic, affirmative rules with rationale and a preferred example when ambiguity matters. Avoid restating lint rules the toolchain already enforces. Scope narrowly and diagnose which files were actually loaded. When multiple instructions can apply, eliminate contradictions at source because host ordering may be unspecified ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).

### Prompts and skills

A prompt is a manual task entry point; a skill is a discoverable capability. Both should state inputs, workflow, outputs, stop conditions, and failure behavior. Skills additionally need precise activation metadata, shallow references, dependency/compatibility notes, and audited scripts. Use host-only metadata as optional adapters, not as part of the portable contract ([Agent Skills specification](https://agentskills.io/specification)).

### Agents and orchestration

Agents should be bounded by job, not theatrical persona. The strongest reasons to create one are a stable capability boundary, model choice, delegation policy, or multi-turn workflow. A coordinator should pass each worker a complete task and demand a compact typed result. Keep chains shallow; prefer fixed code paths when steps are predictable ([Anthropic agents](https://www.anthropic.com/engineering/building-effective-agents), [VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents)).

### Tools, MCP, and hooks

Tools are APIs for models: minimize overlap, make invalid states unrepresentable, validate server-side, and return concise results. MCP standardizes exposing such capabilities but adds executable and authorization trust boundaries. Hooks are outside model choice and therefore fit required gates, but their own code/configuration is privileged and must be protected ([OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling), [MCP security](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices), [VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks)).

## Security Architecture

Treat every content channel separately:

| Channel | Default trust | Main control |
|---|---|---|
| Platform/developer policy | High, controlled authors | Review, signed/versioned deployment, minimal content |
| Repository customization | Medium-high after workspace review | CODEOWNERS, branch protection, evals |
| Third-party skill/plugin/hook/MCP | Untrusted until audited | Source/license review, pinning, sandbox, least privilege |
| User input | Authorized intent, untrusted data | Validation, authorization, confirmation |
| Web/retrieval/issues/files/tool output | Untrusted evidence | Delimit as data, provenance, sanitize, isolate, post-fetch review |
| Model output/tool arguments | Untrusted proposal | Schema validation, allowlists, server authorization, approval |
| Memory/compaction | Derived, potentially stale | Provenance, expiry, source-of-truth precedence |

Prompt injection cannot be solved by telling the model to ignore it. Reduce impact by preventing untrusted content from granting authority, minimizing available privileges, requiring approval near high-risk operations, sandboxing execution, validating both input and output, and adversarially evaluating full workflows ([OWASP prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [VS Code approvals](https://code.visualstudio.com/docs/agents/run/approvals)).

## Evaluation and Maintenance Loop

1. Define task success and safety invariants before authoring.
2. Create representative positive, negative, edge, conflict, and injection cases.
3. Record baseline model/host/version, output, tool trace, tokens, latency, and corrections.
4. Make the smallest asset change that targets an observed failure.
5. Re-run behavioral and security suites; compare regressions.
6. Deploy with owner, version, review date, and rollback.
7. Convert production failures into cases; remove rules that no longer add measurable value.

Model snapshots and hosts change behavior, so syntax validation alone is insufficient. Keep test data and graders in the repository rather than binding the design to a hosted eval product whose lifecycle may change ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [OpenAI evals deprecation notice](https://developers.openai.com/api/docs/guides/evals)).

## Maturity Model

| Level | State | Exit criteria |
|---|---|---|
| 0. Ad hoc | Repeated chat instructions, broad tools, no ownership | Inventory recurring tasks, failures, data, and actions. |
| 1. Grounded | Concise repository instructions and canonical docs | Instructions are reviewed, scoped, conflict-free, and validated. |
| 2. Reusable | Prompts/skills for frequent work; repository layout and owners | Clear triggers, resources, dependencies, and positive/negative tests. |
| 3. Governed capability | Role-based agents, minimal tools/MCP, approvals, hooks, provenance | Threat model, secret handling, sandbox/authorization, audit trail, rollback. |
| 4. Evaluated system | Regression/security evals in change workflow; metrics and version matrix | Quality, safety, cost, latency, and activation thresholds gate releases. |
| 5. Adaptive portfolio | Retrieval, compaction, memory, and orchestration tuned by evidence | Automated freshness/deprecation, bounded optimization, human governance. |

**Roadmap:** Do not skip directly to orchestration. First establish source-of-truth documentation and eval cases; then extract repeated procedures into skills; then add capabilities and enforcement; finally add isolated workers or dynamic retrieval only for measured bottlenecks. This follows the shared "simplest thing that works" guidance from Anthropic and VS Code ([Anthropic agents](https://www.anthropic.com/engineering/building-effective-agents), [VS Code context guide](https://code.visualstudio.com/docs/agents/guides/context-engineering-guide)).