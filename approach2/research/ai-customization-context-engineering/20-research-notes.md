# Research Notes

These are atomic findings grouped by question. Vendor behavior is labeled. Recommendations are marked **Recommendation**; otherwise notes paraphrase the linked source.

## 1. Customization Primitives

### Repository, global, and file-scoped instructions

- **Concept:** Persistent guidance changes how tasks should be performed; it is not itself a task or executable control. VS Code separates always-on repository files from conditional `.instructions.md` files ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).
- **VS Code/GitHub-specific:** `.github/copilot-instructions.md` applies repository-wide. `.github/instructions/*.instructions.md` can use `applyTo` globs. VS Code also recognizes root `AGENTS.md` and Claude-compatible files; nested `AGENTS.md` behavior is host-dependent/experimental. GitHub documents nearest-file precedence for nested `AGENTS.md`, while VS Code says multiple custom instruction files are combined with no guaranteed order ([GitHub repository instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot), [VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).
- **Vendor-specific priority:** GitHub/VS Code currently prioritize personal over repository over organization instructions, while still supplying all relevant sets. This is not a universal system/developer/user hierarchy ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).
- **Limitation:** Always-on content consumes context on every request and may conflict with other files. Instructions are guidance, not guaranteed enforcement.
- **Recommendation:** Keep globally loaded files short: architecture, non-obvious conventions, build/validation facts, and security invariants. Put narrow rules behind globs or task descriptions.

### Reusable prompts

- **Concept:** A saved, intentionally invoked task template packages what to do, expected output, variables, and perhaps selected tools.
- **VS Code-specific:** `.github/prompts/*.prompt.md` supports frontmatter for `agent`, `model`, `tools`, and argument hints; prompt tool lists override referenced-agent lists. Prompt files are not used by VS Code Agent Host sessions, which directs users toward skills for that surface ([VS Code prompts](https://code.visualstudio.com/docs/agent-customization/prompt-files)).
- **OpenAI-specific lifecycle warning:** OpenAI is deprecating hosted reusable prompt objects and recommends prompts in code with typed inputs, code review, tests, and deployment controls ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)). This does not deprecate repository prompt files in other products.
- **Recommendation:** Use a prompt for a short manual command; promote it to a skill when it needs automatic discovery, portability, resources, or scripts.

### Agent Skills

- **Interoperable core:** An Agent Skill is a directory with required `SKILL.md`, `name`, and `description`; optional scripts, references, and assets are loaded on demand. The specification defines naming, compatibility, license, metadata, progressive disclosure, and validation ([Agent Skills specification](https://agentskills.io/specification)).
- **Progressive disclosure:** Clients initially load metadata, then `SKILL.md` after activation, then referenced resources only as needed. Both the open specification and Anthropic/VS Code implementations describe this three-level model ([Agent Skills overview](https://agentskills.io/what-are-skills), [Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), [VS Code Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)).
- **Extensions differ:** VS Code adds slash-command visibility, model invocation control, and experimental forked context. Anthropic runtime/network/sharing behavior differs among Claude Code, API, and claude.ai. Portability is format-level, not an assurance of identical execution ([Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)).
- **Security:** A skill can contain executable code and external dependencies. Anthropic says to treat installation like software and audit every file; its own example repository contains mixed licenses ([Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), [anthropics/skills](https://github.com/anthropics/skills)).

### Custom agents and subagents

- **Concept:** A custom agent is a stable role/configuration combining instructions and a capability boundary. A subagent is an invocation pattern that delegates a bounded task into an isolated context.
- **VS Code/GitHub-specific:** `.agent.md` profiles can select tools, model, allowed subagents, handoffs, target, MCP servers, and preview hooks. GitHub warns that properties can function differently or be ignored across environments ([VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents), [GitHub custom agents](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)).
- **Isolation:** VS Code subagents receive a focused task, are stateless, cannot be followed up, and return a summary. Custom worker agents can further restrict tools and model. Nested delegation is disabled by default and bounded when enabled ([VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents)).
- **Recommendation:** Define an agent only when role, tool boundary, model, or multi-turn workflow is stable. Define hidden worker agents for specialist delegation; make input/output contracts explicit.

### Tools and function calling

- **Concept:** A tool is a typed or documented capability offered to the model; a tool call is a model request that application code must validate, authorize, execute, and return. The model does not execute a function merely by emitting JSON ([OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)).
- **Contract quality:** Clear names, unambiguous parameters, examples, enums, strict schemas, and minimal overlap improve selection. OpenAI recommends a small initial function set and deferred tool loading; tool definitions count against context. Anthropic likewise warns against bloated, ambiguous tool sets ([OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).
- **Determinism boundary:** Strict schema or constrained decoding can guarantee syntactic shape under stated conditions, not truth, authorization, or semantic correctness ([OpenAI Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/)).
- **Recommendation:** Let code supply values it already knows, validate all arguments, perform authorization server-side, return concise structured errors, and require approval for consequential operations.

### MCP servers

- **Interoperable protocol:** MCP standardizes connections between a host, per-server clients, and servers. Servers expose tools (actions), resources (context), and prompts (templates); MCP does not dictate how a host selects or manages context ([MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)).
- **Trust:** Local servers can execute with client privileges; remote servers cross network and authorization boundaries. MCP's security guidance covers explicit consent, token audience validation, per-client consent, SSRF, local-server sandboxing, and scope minimization ([MCP security](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)).
- **VS Code-specific:** `.vscode/mcp.json` is workspace-shareable, while `.mcp.json`/`~/.copilot/mcp-config.json` have different Agent Host portability. Secrets should use secure inputs/environment files. VS Code can sandbox local stdio servers on macOS/Linux ([VS Code MCP](https://code.visualstudio.com/docs/agent-customization/mcp-servers)).
- **Recommendation:** Use MCP when multiple clients need a governed integration. For one application-local function, direct function calling is often simpler and exposes less supply chain.

### Hooks

- **Concept:** Hooks are host lifecycle callbacks that run code independently of model choice, suitable for enforcement, logging, formatting, and context/state capture.
- **VS Code/GitHub-specific:** Hook files, event names, casing, I/O, matchers, and default-branch rules vary. VS Code hooks are Preview and note incomplete Claude matcher compatibility; GitHub cloud-agent hooks require configuration on the default branch ([VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks), [GitHub hooks](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)).
- **Security:** Hooks execute with host permissions. Agent-controlled input must be parsed as data; scripts and configuration should be protected from agent edits; credentials must not be embedded.

### Memory and context files

- **Concept:** External notes persist task state, decisions, and pointers outside the active context; selected notes can be reloaded after reset or compaction. This differs from authoritative shared instructions and from retrieved corpora.
- **Evidence:** Anthropic describes structured note-taking as persistent memory with low context overhead, alongside compaction and subagents for long-horizon work ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). VS Code documents persistent agent memory as a product capability but its former dedicated memory URL was unavailable in this research pass; treat exact storage and precedence as version-sensitive.
- **Recommendation:** Store source, timestamp, confidence, scope, and expiry. Never let self-authored memory silently override policy, current code, or primary documentation.

### Retrieval and RAG

- **Concept:** Retrieval selects external material at runtime; RAG places selected material into the generation context. Semantic search may find low-keyword-overlap content; metadata filtering, hybrid ranking, thresholds, and chunking affect relevance ([OpenAI retrieval](https://developers.openai.com/api/docs/guides/retrieval)).
- **Dynamic context:** Anthropic distinguishes pre-inference retrieval from agentic just-in-time search using identifiers such as paths, links, and stored queries. A hybrid can front-load high-confidence context and allow further exploration ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).
- **Provenance/security:** Retrieved chunks must retain source identity and trust labels. RAG does not remove prompt injection; OWASP specifically describes poisoned documents influencing outputs ([OWASP prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)).

### Handoffs and orchestration

- **Concept:** A handoff transfers ownership/context to another role; orchestration coordinates routing, sequencing, parallel workers, evaluation loops, and aggregation.
- **Patterns:** Anthropic distinguishes coded workflows from model-directed agents and documents chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer patterns ([Anthropic agents](https://www.anthropic.com/engineering/building-effective-agents)). VS Code handoffs are user-visible transitions; subagents are stateless isolated workers ([VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents), [VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents)).
- **Recommendation:** Prefer code-defined workflows for predictable paths. Use model-driven orchestration only when decomposition is genuinely input-dependent; set budgets, stop conditions, ownership, retry policy, and a result schema.

## 2. Context Engineering

### Authority and trust

- Platform/system instructions define host constraints; developer/application instructions define product policy; user messages express requested work; retrieved content and tool results are usually data, not instructions. OpenAI's current docs place developer messages above user messages, and its instruction-hierarchy research motivates ignoring conflicting lower-privilege instructions ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [OpenAI hierarchy](https://openai.com/index/the-instruction-hierarchy/)).
- Repository instruction precedence is a separate host feature and must not be confused with model message-role authority.
- **Recommendation:** Tag every context item with origin, authority, trust, timestamp, and intended use. Never interpolate untrusted text into a privileged instruction template without a data boundary.

### Static versus dynamic context

- Static context includes system/developer policy, concise repository facts, stable tool descriptions, and canonical examples. Dynamic context includes the request, active files, search results, tool output, current state, and retrieved documents ([VS Code context](https://code.visualstudio.com/docs/agents/concepts/context)).
- **Recommendation:** Static content should be small, stable, and cache-friendly. Dynamic content should be selected for relevance/freshness and carry provenance.

### Progressive disclosure and isolation

- Progressive disclosure loads metadata, then instructions, then resources. It applies to skills, deferred tools, indexes, and repository navigation ([Agent Skills spec](https://agentskills.io/specification), [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)).
- Isolation creates a clean context for a separate task and returns a compact result. It reduces contamination but can lose details at the boundary; delegation prompts need complete inputs and output contracts ([VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents)).

### Budgets, compaction, and context quality

- Context is finite both in hard tokens and useful attention. Anthropic argues for the smallest high-signal set and reports degrading retrieval/attention with growing context; VS Code advises selective context and fresh sessions ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [VS Code context](https://code.visualstudio.com/docs/agents/concepts/context)).
- Compaction summarizes history into a new working state. It can discard subtle dependencies, so tune for recall first; a safe early reduction is replacing old raw tool output with stable findings/pointers ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).
- **Recommendation:** Reserve explicit budget bands for policy, task, evidence, tool schemas, working state, and output. Trigger compaction before hard limits and preserve decisions, constraints, unresolved items, changed artifacts, test status, provenance, and next action.

### Conflict and duplication control

- Combined instructions can have unspecified order, and vendors advise avoiding conflicts ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).
- **Recommendation:** Maintain one canonical rule; use links/adapters; add precedence explicitly when the host supports it; lint for duplicate modal statements (`must`, `never`, `always`) and overlapping globs; test conflict cases.

### Evaluation and maintenance

- Prompts are nondeterministic and model versions differ; OpenAI recommends pinned snapshots and evaluation suites. Its Evals platform is being retired in late 2026, reinforcing that cases/graders should live independently of a hosted product ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [OpenAI evals](https://developers.openai.com/api/docs/guides/evals)).
- VS Code recommends living documents, version control, diagnostics, correction-rate and quality measures, and regular review ([VS Code context guide](https://code.visualstudio.com/docs/agents/guides/context-engineering-guide)).
- **Recommendation:** Evaluate activation, task success, policy adherence, tool safety, groundedness/provenance, cost, latency, and correction turns. Every production failure should become a case before changing instructions.

## 3. Security and Trust Boundaries

- Prompt injection can be direct or embedded in files, websites, retrieved documents, issues, comments, images, or tool output. No prompt-only defense is complete; combine authority separation, least privilege, isolation, validation, and human approval ([OWASP prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [VS Code approvals](https://code.visualstudio.com/docs/agents/run/approvals)).
- Tool permissions should follow least privilege by role and operation. Read-only planning/review should not inherit write or deployment tools. Use incremental authorization and session-scoped approvals ([MCP security](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices), [VS Code security](https://code.visualstudio.com/docs/agents/run/security)).
- Secrets belong in credential stores or runtime injection, never context assets. Assume prompts, tool args, logs, traces, memory, and generated artifacts may be retained or reviewed.
- Destructive, irreversible, external-communication, financial, permission-changing, or production actions require explicit confirmation close to execution, with exact target and parameters.
- Shared skills, hooks, plugins, MCP servers, and scripts are software supply-chain dependencies. Review publisher, source, license, code, network/file access, transitive packages, updates, and revocation path ([Anthropic Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), [MCP security](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)).
- NIST's voluntary AI RMF frames risk work as Govern, Map, Measure, and Manage; use it to assign owners, characterize context/tool risks, evaluate controls, and monitor change rather than treating security as a prompt-writing task ([NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)).
