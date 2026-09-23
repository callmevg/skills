# Open Questions, Conflicts, and Freshness Risks

## Unresolved Design Questions

1. **Cross-client conformance for Agent Skills:** The core format is standardized, but clients differ in discovery paths, optional metadata, runtime, network, invocation controls, and resource access. A formal cross-client behavior suite would be more valuable than format validation alone ([Agent Skills specification](https://agentskills.io/specification), [Anthropic Skills limitations](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)).
2. **Portable agent profiles and hooks:** `.agent.md`, handoffs, subagent fields, and hooks have compatibility efforts but no equivalent stable cross-vendor standard was found. VS Code notes ignored Claude matchers and GitHub uses different event casing/fields ([VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks), [GitHub hooks](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)).
3. **Memory governance:** Product-level memory behavior changes quickly, and VS Code's dedicated memory concept page returned 404 during this pass. Exact storage, precedence, retention, sync, and deletion behavior need a current product-specific review before implementation.
4. **Instruction conflict semantics:** VS Code says combined instruction file order is not guaranteed, while GitHub documents nearest nested `AGENTS.md` precedence for its surfaces. More host-by-host tests are needed for mixed `copilot-instructions.md`, `AGENTS.md`, `.instructions.md`, organization, and user rules.
5. **Provenance schema:** No cross-vendor standard was found for attaching authority, trust, timestamp, license, retrieval query, and source span to every context item. A repository-local schema is recommended but remains an architectural choice.
6. **Compaction fidelity:** Sources recommend compaction and typed state but do not provide universal quality thresholds. Domain-specific recall tests are needed for lost constraints, decisions, and negative evidence.
7. **Enforcement portability:** Hooks can enforce lifecycle actions in supported hosts, but CI/server-side policy remains the more portable final gate. The correct split depends on where tasks execute.

## Contradictions and Qualifications

- **"Open standard" does not mean identical behavior.** Agent Skills is an open format; VS Code's `context: fork` and invocation flags are extensions, and Anthropic's API requires a particular container/runtime.
- **"Prompt" is overloaded.** It may mean a user message, a reusable host file, an MCP prompt primitive, or a hosted prompt object. OpenAI is retiring its hosted prompt objects, not prompt engineering or every vendor's prompt-file feature ([OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)).
- **MCP versions changed materially.** The current architecture page describes a 2026-07-28 stateless protocol and deprecates earlier client capabilities, while the retained 2025-06-18 page describes stateful connections. New work should target `latest` and explicitly negotiate/version compatibility ([MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture), [MCP latest](https://modelcontextprotocol.io/specification/latest)).
- **Structured output is not semantic correctness.** Schema-conforming values can still be wrong; authorization and business validation remain application responsibilities ([OpenAI Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/)).
- **Sandboxing is not universal.** VS Code documents preview sandboxing on macOS/Linux and no local MCP sandbox on Windows. Cloud and container runtimes have separate boundaries ([VS Code security](https://code.visualstudio.com/docs/agents/run/security)).

## Access Limitations

- Several legacy GitHub URLs returned 404; current concept/how-to pages were used instead.
- OpenAI redirected Codex skills and `AGENTS.md` pages to `learn.chatgpt.com`; those redirected pages were not required for consequential claims because Agent Skills and VS Code/GitHub primary sources covered the requested behavior.
- No authenticated, paid, or private documentation was accessed.
- No host was executed to empirically test precedence or cross-client compatibility; conclusions about behavior are documentation-based.

## Freshness Watchlist

Re-check at least quarterly, and before implementation:

- VS Code pages edited 2026-08-19, especially Preview/Experimental hooks, Agent Host, forked skills, custom agents, nested instructions, and memory.
- GitHub cloud-agent custom agent, hook, organization, and branch behavior.
- MCP `latest` specification and security guidance; current line observed was 2026-07-28.
- Agent Skills specification optional metadata and validator.
- OpenAI reusable prompt and Evals deprecation milestones scheduled for 2026-10/11.
- NIST AI RMF revision status and newer GenAI profile guidance.
- Licenses and commit-pinned contents of external skill/plugin/MCP dependencies.

## Follow-Up Research

1. Build a conformance fixture and run one minimal skill, nested instruction set, custom agent, and hook across each target host.
2. Develop and test a context-item provenance schema.
3. Benchmark activation precision, task success, token cost, and injection resilience for a monolithic versus progressively disclosed repository.
4. Test compaction summaries against hidden "must retain" facts on realistic coding traces.
5. Threat-model one real MCP integration end to end, including OAuth audience, scopes, SSRF, local startup, logs, and revocation.
