# AI Product Development System

A multi-agent workflow for turning an initial idea into a well-reasoned product specification.

## Architecture

The system is intentionally separated into:

- **Prompts** — convenient entry points for recurring tasks.
- **Instructions** — shared rules and quality standards.
- **Skills** — reusable methodologies and workflows.
- **Agents** — specialized workers responsible for distinct jobs.
- **Hooks** — event-driven automation, to be added only when there is a concrete need.

The core flow is:

```text
Idea
  ↓
Discovery
  ↓
Research
  ↓
Synthesis
  ↓
Product Specification
  ↓
Red Team
  ↓
Revision
  ↓
Final Specification
```

The orchestrator should make this process adaptive rather than blindly sequential.

---

# Phase 1 — Create Shared Instructions

## 1. Product-thinking instructions

Command:

```text
/create-instructions
```

Prompt:

> Create project instructions for product discovery and product thinking.
>
> The AI must not assume that the user's idea should become a digital product, app, website, SaaS product, AI product, or any other specific solution unless the user explicitly establishes that.
>
> Start by understanding the user's underlying problem, motivation, desired outcome, target people, context, constraints, and current alternatives.
>
> Distinguish clearly between:
> - problem
> - user/person affected
> - desired outcome
> - assumptions
> - constraints
> - potential solutions
>
> Do not prematurely convert vague ideas into product requirements.
>
> When important information is missing, ask focused questions rather than inventing answers.
>
> Explicitly distinguish facts, user-provided information, assumptions, hypotheses, recommendations, and conclusions.
>
> Actively identify ambiguity, contradictions, unsupported assumptions, and areas requiring validation.
>
> The goal is to help the user think clearly and eventually arrive at a strong product opportunity and specification, not merely to produce a polished document.

## 2. Research instructions

Command:

```text
/create-instructions
```

Prompt:

> Create project instructions for product and market research.
>
> Research should investigate the problem space rather than merely search for direct competitors.
>
> Look for:
> - direct competitors
> - indirect competitors
> - adjacent solutions
> - non-digital alternatives
> - successful products and companies
> - failed products, shutdowns, pivots and unsuccessful launches
> - relevant case studies
> - user complaints and pain points
> - market and industry data
> - behavioral evidence
> - relevant academic or expert research
>
> Prefer credible primary sources and high-quality secondary sources.
>
> Cite sources for factual claims.
>
> Actively search for contradictory evidence and evidence that challenges the user's assumptions.
>
> Never treat the existence of competitors as evidence that an opportunity is viable.
>
> Clearly separate evidence from interpretation and recommendations.

## 3. Evidence instructions

Command:

```text
/create-instructions
```

Prompt:

> Create project instructions for evaluating evidence during product research and synthesis.
>
> For every important conclusion, consider:
> - What evidence supports it?
> - How strong is that evidence?
> - Is it direct or inferred?
> - Could there be an alternative explanation?
> - Is there contradictory evidence?
> - What remains unknown?
>
> Do not present speculation as fact.
>
> When sources disagree, explicitly surface the disagreement instead of arbitrarily choosing one.
>
> Identify assumptions that require user validation, research validation, experimentation, or additional evidence.

## 4. Product-spec instructions

Command:

```text
/create-instructions
```

Prompt:

> Create project instructions for writing product specifications.
>
> A product specification should emerge from the validated problem and synthesis process rather than being generated prematurely.
>
> The specification should clearly distinguish:
> - problem
> - target users
> - goals
> - non-goals
> - user needs
> - proposed solution
> - core experiences
> - functional requirements
> - non-functional requirements
> - edge cases
> - constraints
> - dependencies
> - assumptions
> - risks
> - success metrics
> - open questions
>
> Do not add features simply to make the specification appear comprehensive.
>
> Every significant requirement should have a rationale.
>
> Prefer a focused, coherent product over a collection of loosely related features.

---

# Phase 2 — Create Skills

## 5. Discovery skill

Command:

```text
/create-skill
```

Prompt:

> Create a reusable skill called Product Discovery.
>
> The skill should guide an AI through turning a vague product idea into a structured understanding of the underlying opportunity.
>
> The AI should:
> 1. Understand the user's initial idea.
> 2. Identify what is known versus unknown.
> 3. Ask focused questions one area at a time rather than overwhelming the user.
> 4. Understand the underlying problem.
> 5. Identify who experiences the problem.
> 6. Understand the context and frequency of the problem.
> 7. Understand how people currently solve it.
> 8. Identify desired outcomes.
> 9. Identify constraints.
> 10. Surface assumptions.
> 11. Explore alternative solution directions without committing prematurely.
>
> Do not assume the solution must be digital.
>
> Continue asking questions until there is enough clarity to create an Idea Brief.
>
> Produce an Idea Brief containing the problem, users, context, desired outcome, current alternatives, constraints, assumptions, possible solution directions, unresolved questions, and confidence level.

## 6. Competitive research skill

Command:

```text
/create-skill
```

Prompt:

> Create a reusable skill called Competitive and Market Research.
>
> Given an Idea Brief, research the relevant problem space online.
>
> Investigate direct competitors, indirect competitors, adjacent solutions, non-digital alternatives, successful products, failed products, shutdowns, pivots, case studies, user complaints, market evidence, expert opinions, and relevant behavioral or academic research.
>
> Do not limit the research to products that look similar to the proposed solution.
>
> For successful examples, determine what appears to have contributed to success.
>
> For failed examples, determine what appears to have contributed to failure.
>
> Look specifically for evidence that challenges the assumptions in the Idea Brief.
>
> Produce a structured Research Report with sources, evidence, insights, contradictions, risks, opportunities, and open questions.

## 7. Evidence synthesis skill

Command:

```text
/create-skill
```

Prompt:

> Create a reusable skill called Evidence Synthesis.
>
> Combine the user's Idea Brief with the Research Report.
>
> Compare the user's assumptions against external evidence.
>
> Identify:
> - supported assumptions
> - unsupported assumptions
> - contradicted assumptions
> - new insights
> - gaps in the user's thinking
> - opportunities
> - risks
> - important uncertainties
>
> Do not blindly merge the research into the user's idea.
>
> Challenge the original framing when the evidence warrants it.
>
> If a contradiction requires information that only the user can provide, ask the user for clarification.
>
> Produce a Synthesis document that explains what we currently believe, why we believe it, what has changed from the original idea, and what remains uncertain.

## 8. Product specification skill

Command:

```text
/create-skill
```

Prompt:

> Create a reusable skill called Product Specification.
>
> Use the Idea Brief and Synthesis to develop a product specification only after the problem and opportunity are sufficiently understood.
>
> The skill should define:
> - problem statement
> - target users
> - user needs
> - goals
> - non-goals
> - proposed solution
> - product principles
> - core user journeys
> - functional requirements
> - non-functional requirements
> - edge cases
> - constraints
> - dependencies
> - assumptions
> - risks
> - success metrics
> - open questions
>
> Do not invent requirements merely to make the document longer.
>
> Where important information is uncertain, explicitly mark it as an assumption or open question.

## 9. Red-team skill

Command:

```text
/create-skill
```

Prompt:

> Create a reusable skill called Product Spec Red Team.
>
> The purpose is to aggressively challenge a product specification rather than improve it politely.
>
> Assume the product could fail and systematically investigate why.
>
> Challenge:
> - problem validity
> - user desirability
> - frequency and severity of the problem
> - proposed solution
> - product scope
> - user behavior assumptions
> - adoption
> - retention
> - competitive differentiation
> - business viability
> - technical feasibility
> - data dependencies
> - privacy and trust
> - accessibility
> - edge cases
> - failure states
> - abuse cases
> - operational complexity
> - scalability
> - strategic risks
>
> Look for second-order effects and failure scenarios.
>
> Classify findings as Critical, High, Medium, or Low severity.
>
> For every significant finding, explain the problem, why it matters, the evidence or reasoning behind it, and a recommended mitigation.
>
> Do not protect the original idea from criticism.

## 10. Orchestration skill

Command:

```text
/create-skill
```

Prompt:

> Create a reusable skill called Product Development Orchestration.
>
> The skill should manage the end-to-end process of turning an initial idea into a high-quality product specification.
>
> The process consists of:
>
> 1. Discovery
> 2. Research
> 3. Evidence synthesis
> 4. Product specification
> 5. Red-team review
> 6. Revision
> 7. Final specification
>
> Do not blindly execute every stage sequentially.
>
> Determine the appropriate next step based on the current state of the work.
>
> If the idea is insufficiently understood, return to Discovery.
>
> If important evidence is missing, perform additional Research.
>
> If research contradicts the user's assumptions, surface the contradiction and ask the user for clarification when necessary.
>
> If the specification contains major weaknesses, send it through another synthesis/revision cycle.
>
> Continue red-team review until there are no unresolved Critical issues and remaining High issues are explicitly documented.
>
> Maintain clear artifacts throughout the process:
> - idea-brief.md
> - research-report.md
> - synthesis.md
> - product-spec-draft.md
> - red-team-report.md
> - product-spec-final.md
>
> The orchestrator should prioritize correctness, clarity and evidence over speed or document completeness.

---

# Phase 3 — Create the Five Agents

## 11. Discovery Agent

Command:

```text
/create-agent
```

Prompt:

> Create a specialized agent called Product Discovery.
>
> Its responsibility is to help the user clarify an idea before defining a product.
>
> It should use the Product Discovery skill and Product Thinking instructions.
>
> It must not assume the solution is digital.
>
> It should behave as a thoughtful product strategist and interviewer, asking focused questions and helping the user organize their thinking.
>
> Its primary output is idea-brief.md.
>
> It should not write a final product specification.

## 12. Research Agent

Command:

```text
/create-agent
```

Prompt:

> Create a specialized agent called Product Researcher.
>
> Its responsibility is to investigate the problem space surrounding an Idea Brief using online research.
>
> It should use the Competitive and Market Research skill, Research instructions, and Evidence instructions.
>
> It should investigate both successful and failed examples and actively seek evidence that contradicts the user's assumptions.
>
> It should produce research-report.md with source citations.
>
> It should not turn research findings into a product specification.

## 13. Synthesis Agent

Command:

```text
/create-agent
```

Prompt:

> Create a specialized agent called Product Synthesizer.
>
> Its responsibility is to compare the Idea Brief against the Research Report and determine what we should currently believe.
>
> It should use the Evidence Synthesis skill and Evidence instructions.
>
> It must identify contradictions, unsupported assumptions, new opportunities, risks, and unresolved questions.
>
> It should challenge the user's original framing when evidence warrants it.
>
> When a contradiction cannot be resolved from available evidence, ask the user for clarification.
>
> Its primary output is synthesis.md.

## 14. Red-Team Agent

Command:

```text
/create-agent
```

Prompt:

> Create a specialized agent called Product Red Team.
>
> Its responsibility is to aggressively challenge product specifications and attempt to identify why they could fail.
>
> It should use the Product Spec Red Team skill and Product Spec instructions.
>
> It must be adversarial rather than agreeable.
>
> It should examine desirability, usability, business viability, technical feasibility, edge cases, failure modes, accessibility, trust, competition, adoption, retention, and strategic risks.
>
> It should produce red-team-report.md with severity-ranked findings and recommended mitigations.
>
> It should never assume that the specification is correct simply because it has already been approved by another agent.

## 15. Orchestrator Agent

Create this last.

Command:

```text
/create-agent
```

Prompt:

> Create a specialized agent called Product Orchestrator.
>
> Its responsibility is to manage the complete product-development workflow from initial idea to final product specification.
>
> It should use the Product Development Orchestration skill and coordinate the Product Discovery, Product Researcher, Product Synthesizer, Product Specification, and Product Red Team capabilities.
>
> It should maintain the following artifacts:
> - idea-brief.md
> - research-report.md
> - synthesis.md
> - product-spec-draft.md
> - red-team-report.md
> - product-spec-final.md
>
> It should decide what stage is needed next based on the quality and completeness of the current information rather than blindly following a fixed sequence.
>
> It should ask the user questions whenever a critical decision cannot reasonably be inferred.
>
> It should never silently resolve major contradictions by inventing information.
>
> It should prioritize evidence, critical thinking, user intent, and product coherence.
>
> Its final responsibility is to deliver the strongest defensible product specification possible, including unresolved assumptions, risks, and open questions.

---

# Phase 4 — Create Entry-Point Prompts

## 16. Main product-development prompt

Command:

```text
/create-prompt
```

Prompt:

> Create a reusable prompt called Develop Product Idea.
>
> When invoked, start the Product Orchestrator workflow.
>
> Begin with the user's raw idea, regardless of how incomplete or vague it is.
>
> Do not assume the solution is an app, website, software product, AI product, or any other digital product.
>
> Guide the user through discovery, research, synthesis, specification and red-team review as appropriate.
>
> Ask questions when necessary and use online research when external evidence would improve the outcome.
>
> Maintain the project's product artifacts throughout the process.
>
> The ultimate output should be a well-reasoned product specification rather than simply a polished interpretation of the user's initial idea.

This should become the primary entry point:

```text
/develop-product-idea
```

## 17. Research-only prompt

Command:

```text
/create-prompt
```

Prompt:

> Create a reusable prompt called Research Product Idea.
>
> When invoked, research the user's current product idea or Idea Brief without attempting to create the final product specification.
>
> Investigate competitors, indirect alternatives, successful and failed examples, case studies, market evidence, user pain points, behavioral evidence, and relevant expert or academic research.
>
> Actively search for contradictory evidence.
>
> Produce or update research-report.md with source citations, findings, implications, contradictions, risks, opportunities and open questions.

This should become:

```text
/research-product-idea
```

---

# Final Project Structure

After creating everything, the project should look approximately like this:

```text
.github/
│
├── agents/
│   ├── product-orchestrator.agent.md
│   ├── product-discovery.agent.md
│   ├── product-researcher.agent.md
│   ├── product-synthesizer.agent.md
│   └── product-red-team.agent.md
│
├── instructions/
│   ├── product-thinking.instructions.md
│   ├── research.instructions.md
│   ├── evidence.instructions.md
│   └── product-spec.instructions.md
│
├── prompts/
│   ├── develop-product-idea.prompt.md
│   └── research-product-idea.prompt.md
│
└── skills/
    ├── product-discovery/
    │   └── SKILL.md
    ├── competitive-research/
    │   └── SKILL.md
    ├── evidence-synthesis/
    │   └── SKILL.md
    ├── product-specification/
    │   └── SKILL.md
    ├── red-team-review/
    │   └── SKILL.md
    └── product-development-orchestration/
        └── SKILL.md
```

Working artifacts:

```text
my-product/
│
├── idea-brief.md
├── research-report.md
├── synthesis.md
├── product-spec-draft.md
├── red-team-report.md
└── product-spec-final.md
```

---

# Phase 5 — Do Not Create Yet: Hooks

Do **not** create a hook initially.

First validate that the agent/skill/artifact workflow works.

Later, hooks could automate things such as:

```text
When product-spec-draft.md changes
        ↓
run red-team review
```

or:

```text
When research-report.md changes
        ↓
validate citations
```

Hooks should be introduced only once you have a concrete repetitive event that you want automated.

---

# Recommended Build Order

Create the components in exactly this order:

```text
1. Product-thinking instructions
2. Research instructions
3. Evidence instructions
4. Product-spec instructions

5. Product Discovery skill
6. Competitive Research skill
7. Evidence Synthesis skill
8. Product Specification skill
9. Red-Team skill
10. Orchestration skill

11. Product Discovery agent
12. Product Researcher agent
13. Product Synthesizer agent
14. Product Red Team agent
15. Product Orchestrator agent

16. Develop Product Idea prompt
17. Research Product Idea prompt
```

Once finished, your normal workflow should be as simple as:

```text
/develop-product-idea
```

Give it a rough idea. The orchestrator should decide whether to ask questions, research, synthesize, draft, red-team, revise, or finalize.
