# Decision Matrix: What to Use Where

Start with the behavioral requirement, not the filename. VS Code's own model separates persistent context, repeatable work, roles, capabilities, and enforcement; Anthropic independently recommends adding agentic complexity only when a simpler prompt, retrieval call, or fixed workflow fails evaluation ([VS Code customization](https://code.visualstudio.com/docs/agents/concepts/customization), [Anthropic agents](https://www.anthropic.com/engineering/building-effective-agents)).

## Primary Matrix

| Need | Default primitive | Why | Do not use as the default when... |
|---|---|---|---|
| Non-obvious project facts and standards needed on most tasks | Repository instruction file | Automatic, team-versioned baseline | The rule applies only to one file family or task; always-on context has recurring token and conflict cost ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)). |
| Language, directory, framework, or test-specific rule | File-scoped instruction | Loads by glob/task rather than globally | The work is a reusable procedure with scripts/resources; use a skill instead. |
| Personal response preference across projects | User/global instruction | Correct personal scope | It encodes team policy or architecture; commit that at repository/organization scope. |
| A short saved command run intentionally | Reusable prompt | Direct, parameterizable, low ceremony | It must work in cloud/Agent Host contexts that do not support host prompt files, or needs supporting resources; prefer a skill ([VS Code prompts](https://code.visualstudio.com/docs/agent-customization/prompt-files)). |
| Reusable domain procedure with references, templates, or scripts | Agent Skill | Portable folder, progressive disclosure, composable resources | It must always apply, or activation must be deterministic rather than model-selected ([Agent Skills spec](https://agentskills.io/specification)). |
| Stable role with a bounded tool/model set | Custom agent | Bundles persona, instructions, tools, model, and optional workers | The difference is only one task prompt; use a prompt or skill. |
| Narrow independent investigation or parallel specialist | Subagent | Isolated context, summarized return, distinct tools/model | The task needs continuous conversational state or frequent user interaction ([VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents)). |
| Read or mutate an external system | Tool/function | Typed action contract and observable result | Static knowledge or guidance is enough. Do not emulate APIs through prose. |
| Portable integration exposing tools/resources/prompts | MCP server | Standard host-client-server boundary | A local function is simpler, no reuse exists, or the server would unnecessarily widen trust and supply-chain exposure ([MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)). |
| An action must run or a call must be blocked | Hook/policy/code | Deterministic lifecycle execution | You merely want stylistic guidance; hooks execute code and add operational risk ([VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks)). |
| Durable task state or cross-session facts | Memory/context file or external state | Survives context resets and compaction | The information is authoritative shared documentation; memory is not a substitute for source-of-truth docs ([Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). |
| Large or frequently changing knowledge corpus | Retrieval/RAG | Selects relevant chunks at request time | The corpus is tiny/stable enough for direct references, or freshness/provenance cannot be governed. |
| Predictable multi-step process | Coded workflow / prompt chain | Deterministic routing, gates, and auditability | The required steps cannot be predicted; then agentic orchestration may fit. |
| Unpredictable decomposition across specialists | Agent orchestration | Dynamic routing and synthesis | A single agent or fixed workflow meets quality targets; orchestration multiplies cost and failure paths. |

## Selection Dimensions

Score candidate designs against these questions:

1. **Frequency:** One-off belongs in the user request; repeated explicit task in a prompt; recurring discoverable procedure in a skill; near-universal rule in instructions.
2. **Determinism:** If failure is unacceptable, move the requirement from prose into schemas, hooks, CI, policy, or application code. Structured schemas constrain shape, not semantic correctness ([OpenAI Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/)).
3. **Capability:** Add a tool only when the model needs current data or an action. Keep initial tool sets small and defer uncommon tools because definitions consume context and too many ambiguous tools reduce selection accuracy ([OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).
4. **Isolation:** Use a fresh session/subagent for independent research, high-volume tool traces, alternative approaches, or untrusted material; return a bounded artifact with provenance.
5. **Portability:** Prefer Agent Skills and MCP for cross-host reuse, but test client extensions. Treat `.agent.md`, `.prompt.md`, `applyTo`, handoffs, hook event names, and settings as adapters, not standards ([Agent Skills spec](https://agentskills.io/specification), [MCP spec](https://modelcontextprotocol.io/specification/latest)).
6. **Sharing:** Put personal preferences at user scope, project behavior in the repository, and true cross-project governance at organization scope. Choose the narrowest scope that matches ownership ([VS Code customization](https://code.visualstudio.com/docs/agents/concepts/customization)).
7. **Lifecycle:** Static stable facts can be committed; dynamic facts should be retrieved with timestamps and source IDs; ephemeral task state belongs in a plan/checkpoint; learned memory needs expiry and review.
8. **Enforcement:** Instructions express intent. Enforcement belongs in permissions, sandboxing, validators, hooks, CI, or server-side authorization ([VS Code security](https://code.visualstudio.com/docs/agents/run/security)).

## Overlaps and Composition

- **Instructions + skill:** instructions state repository invariants; a skill performs the procedure. Link rather than copy.
- **Agent + skill:** agent establishes role/tools; skills supply optional capabilities. Avoid embedding every skill body in the agent.
- **Prompt + agent:** prompt chooses a task variant; agent owns stable role and tools. In VS Code, prompt-file tool lists override referenced-agent tool lists, a vendor-specific precedence rule ([VS Code prompts](https://code.visualstudio.com/docs/agent-customization/prompt-files)).
- **MCP + skill:** MCP exposes an integration; a skill teaches the workflow for using it. Neither should carry credentials.
- **Hook + instructions:** instruction explains the policy; hook enforces the check. Protect hook scripts from agent edits.
- **RAG + agentic search:** pre-retrieve cheap, likely context; let the agent fetch more by stable identifiers when uncertainty remains. Preserve source metadata in both paths.

## Anti-Patterns

- One giant always-on instruction file containing standards, tutorials, task prompts, tool docs, and examples.
- Copying the same rule into repository instructions, agents, prompts, and skills. Conflicts become order-dependent; VS Code explicitly does not guarantee ordering among combined instruction files ([VS Code instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)).
- Using prose to enforce destructive-action safety, schema validity, or mandatory tests.
- A custom agent for every command, or a skill for a two-line one-off prompt.
- Exposing all tools, wildcard MCP permissions, or write tools to planning/review agents.
- Treating retrieved text, issue comments, web pages, tool output, or skill dependencies as trusted instructions.
- Deep recursive handoffs without budgets, stop conditions, ownership, and an aggregation contract.
- Storing secrets in prompts, skill assets, agent frontmatter, MCP config, logs, or memory.
- Measuring asset count instead of task success, correction rate, tool errors, cost, latency, and security incidents.
