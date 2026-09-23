# Source Catalog

All sources were accessed **2026-08-25**. "Current" means the fetched page reflected the current documentation surface on that date; it is not a claim that the underlying feature is stable.

## Primary Sources

| ID | Source | Publisher | Date shown | Quality and relevance |
|---|---|---|---|---|
| VSC-1 | [Agent customization](https://code.visualstudio.com/docs/agents/concepts/customization) | Microsoft, VS Code | Edited 2026-08-19 | Primary decision model distinguishing context, workflow, role, capability, and deterministic enforcement. |
| VSC-2 | [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions) | Microsoft, VS Code | Edited 2026-08-19 | Current file locations, scopes, priority, `applyTo`, diagnostics, and instruction-writing guidance. |
| VSC-3 | [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files) | Microsoft, VS Code | Edited 2026-08-19 | Current `.prompt.md` format, manual invocation, tool priority, and Agent Host limitation. |
| VSC-4 | [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) | Microsoft, VS Code | Edited 2026-08-19 | Current VS Code skill discovery, progressive loading, forked context, and vendor extensions. |
| VSC-5 | [Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents) | Microsoft, VS Code | Edited 2026-08-19 | `.agent.md`, tools, models, subagents, handoffs, hooks, scope, and security guidance. |
| VSC-6 | [MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers) | Microsoft, VS Code | Edited 2026-08-19 | MCP configuration, trust, secrets, resources/prompts/tools, sandboxing, and portability caveats. |
| VSC-7 | [Agent hooks](https://code.visualstudio.com/docs/agent-customization/hooks) | Microsoft, VS Code | Edited 2026-08-19 | Preview hook lifecycle, JSON I/O, deterministic control, compatibility, and code-execution risks. |
| VSC-8 | [Context](https://code.visualstudio.com/docs/agents/concepts/context) | Microsoft, VS Code | Edited 2026-08-19 | Current model of assembled context, indexing, implicit context, and session hygiene. |
| VSC-9 | [Context engineering guide](https://code.visualstudio.com/docs/agents/guides/context-engineering-guide) | Microsoft, VS Code | Edited 2026-08-19 | Practical context workflow, anti-patterns, maintenance, and measures of success. |
| VSC-10 | [Subagents](https://code.visualstudio.com/docs/agents/run/subagents) | Microsoft, VS Code | Edited 2026-08-19 | Context isolation, stateless delegation, custom worker restrictions, and orchestration patterns. |
| VSC-11 | [AI security](https://code.visualstudio.com/docs/agents/run/security) and [approvals](https://code.visualstudio.com/docs/agents/run/approvals) | Microsoft, VS Code | Edited 2026-08-19 | Concrete trust boundaries, prompt-injection controls, approvals, sandboxing, and enterprise policy. |
| GH-1 | [Repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) | GitHub | Current | Repository-wide, path-specific, and agent instruction behavior on GitHub surfaces. |
| GH-2 | [About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | GitHub | Current | Supported Copilot surfaces and project/personal skill locations. |
| GH-3 | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents) and [create custom agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents) | GitHub | Current | GitHub agent-profile scope, format, tools, MCP, targets, and cross-surface caveats. |
| GH-4 | [Customize workflows with hooks](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks) | GitHub | Current | GitHub cloud-agent hook format and default-branch requirement. |
| AS-1 | [Agent Skills specification](https://agentskills.io/specification) | Agent Skills project | Current | Normative portable directory/frontmatter constraints, progressive disclosure, and validation. |
| AS-2 | [Agent Skills overview](https://agentskills.io/what-are-skills) | Agent Skills project | Current | Plain-language rationale and three-stage loading model. |
| ANT-1 | [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | Anthropic | Current | First-party implementation details, runtime differences, security, and cross-surface limitations. |
| ANT-2 | [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic Applied AI | 2025-09-29 | Strong primary practitioner synthesis on context budgets, retrieval, compaction, memory, and subagents. |
| ANT-3 | [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Anthropic | 2024-12-19; page warns landscape changed | Foundational workflow/agent distinction and composable orchestration patterns; retain with staleness warning. |
| OAI-1 | [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) | OpenAI | Current | Current message authority, context windows, prompt versioning, testing, RAG, and product deprecations. |
| OAI-2 | [Function calling](https://developers.openai.com/api/docs/guides/function-calling) | OpenAI | Current | Tool contracts, strict schemas, deferred loading, token cost, and tool design. |
| OAI-3 | [Retrieval](https://developers.openai.com/api/docs/guides/retrieval) | OpenAI | Current | Vector search, source metadata, filtering, ranking, chunking, and synthesis mechanics. |
| OAI-4 | [Working with evals](https://developers.openai.com/api/docs/guides/evals) | OpenAI | Current; Evals platform shutdown scheduled 2026-11-30 | Useful eval lifecycle; API product is being deprecated, so retain the method, not the platform recommendation. |
| OAI-5 | [Instruction hierarchy](https://openai.com/index/the-instruction-hierarchy/) | OpenAI Research | 2024-04-19 | Primary research rationale for privileged instructions and resistance to lower-trust conflicts. |
| MCP-1 | [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture) | Model Context Protocol project | Current spec line 2026-07-28 | Current host/client/server architecture and tools/resources/prompts distinction. |
| MCP-2 | [MCP specification](https://modelcontextprotocol.io/specification/latest) | Model Context Protocol project | Current | Normative protocol and trust principles. Use `latest` because dated 2025 links now resolve toward newer versions. |
| MCP-3 | [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) | Model Context Protocol project | Current | Detailed local-server, OAuth, token, SSRF, scope, and consent threats. |
| NIST-1 | [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) | NIST | RMF 1.0: 2023-01-26; GenAI Profile: 2024-07-26 | Vendor-neutral governance frame; page notes RMF 1.0 is under revision. |

## Strong Secondary / Community-Governance Sources

| ID | Source | Publisher | Date shown | Quality and relevance |
|---|---|---|---|---|
| OWASP-1 | [LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | OWASP GenAI Security Project | 2025 | Community standard; corroborates direct/indirect injection, least privilege, isolation, approvals, and adversarial tests. |
| ANT-REF | [anthropics/skills](https://github.com/anthropics/skills) | Anthropic | Continuously updated | First-party examples. Mixed licensing: many Apache-2.0; document skills are source-available, not open source. Examples require local testing. |

## Excluded or Qualified Sources

- Search snippets and AI-generated summaries were not used as evidence.
- Several older GitHub customization URLs returned 404 and were replaced by current concept/how-to pages.
- OpenAI prompt-object and Evals product guidance is in active deprecation. The general practices of code review, fixtures, graders, and regression evaluation remain supported by other sources, but these APIs should not anchor a new repository design.
- VS Code hooks, skill forked contexts, agent-scoped hooks, and several Agent Host features are marked Preview or Experimental and should be isolated behind compatibility checks.
