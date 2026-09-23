---
name: presentation-skills
description: 'Deliver effective presentations, pitch decks, and demos in professional settings. Covers presentation design, delivery techniques, pitch deck structure, demo best practices, audience engagement, storytelling, and handling Q&A. Triggers when the user asks for help with presentations, pitch decks, product demos, investor pitches, keynote talks, public speaking, slide design, or demo preparation.'
license: Proprietary
---

# Presentation Skills

A comprehensive skill for crafting and delivering impactful presentations, pitch decks, and product demos.

## Quick Reference

| Task                          | Guide                                   |
|-------------------------------|-----------------------------------------|
| Presentation structure        | Read [structure.md](structure.md)       |
| Pitch deck / investor pitch   | Read [pitch-deck.md](pitch-deck.md)     |
| Product demos                 | Read [demos.md](demos.md)               |
| Delivery techniques           | Read [delivery.md](delivery.md)         |
| Design & slide aesthetics     | Read [design.md](design.md)             |
| Storytelling                  | Read [storytelling.md](storytelling.md) |
| Handling Q&A                  | Read [qanda.md](qanda.md)               |

---

## How to Use This Skill

1. **Identify the context**: Is this a pitch deck, product demo, status update, keynote, or training?
2. **Read the relevant guide(s)** — start with `structure.md` for framework, then dive into topic-specific guides.
3. **Personalize with your content** — fill in your narrative, data, and visuals.
4. **Review with the checklist** at the bottom of each guide before delivering.

---

## Skill Structure Overview

```
.presentation-skills/
├── SKILL.md                  ← You are here (entry point)
├── structure.md              ← Presentation framework & slide architecture
├── pitch-deck.md             ← Investor/customer pitch deck templates
├── demos.md                  ← Product demo patterns & staging
├── delivery.md               ← Speaking, body language, pacing, nerves
├── design.md                 ← Visual design, color, typography, slides
├── storytelling.md           ← Narrative arcs, framing, emotional hooks
├── qanda.md                  ← Q&A strategies, tough questions, deflection
└── personalization/          ← YOUR personalization folder (create your own files)
    ├── my-audience-notes.md  ← Example: notes on specific audiences
    ├── my-brand-guidelines.md← Example: your company/personal brand rules
    └── templates/            ← Example: reusable slide templates you create
```

---

## Core Principles

### 1. Know Your Why
Every presentation serves a purpose. Define it in one sentence before designing a single slide:
- "I need the VP to approve $50K budget."
- "I need investors to write a check."
- "I need the team to adopt a new process."

### 2. Audience-First Design
- **Executives**: Bottom line first, details in appendix.
- **Engineers**: Architecture and data first, business context last.
- **Customers**: Outcomes and use cases first, specs last.
- **Investors**: Traction and market size first, team second.

### 3. The 10-Slide Default
Unless the context demands more (keynotes, training), keep it to 10 slides or fewer. Shorter is sharper.

### 4. Rehearse Out Loud
Silent reading ≠ silent delivery. Practice at least 3 times speaking aloud. Record yourself once.

### 5. Visuals Over Text
If a slide can be understood in 3 seconds, it's good. If it takes 10 seconds, it's too dense.

---

## Personalization

This skill is designed to be personalized. Create files under `personalization/` to store:

- **Audience profiles**: Notes on specific audiences you frequently present to.
- **Brand guidelines**: Colors, fonts, logos, tone of voice for your organization.
- **Reusable templates**: Slide layouts you've built and want to reapply.
- **Story bank**: Anecdotes, metaphors, and case studies you like to use.
- **Metrics dashboard**: KPIs and numbers you always reference.

**To add your own content:**
1. Create a file under `personalization/` (or `personalization/templates/`).
2. Reference it from the relevant guide using a `<!-- USER: ... -->` comment.
3. The skill will pull from your personalization files when applicable.

---

## Checklist Before Every Presentation

- [ ] Purpose defined in one sentence
- [ ] Audience mapped (what do they care about?)
- [ ] Core message articulated (if they remember only one thing)
- [ ] Slides follow the structure in `structure.md`
- [ ] Every slide has a clear, single takeaway
- [ ] Rehearsed out loud at least 3 times
- [ ] Tech check (projector, mic, clicker, backup file)
- [ ] Q&A prep — anticipated 5 tough questions (see `qanda.md`)
- [ ] Timing — trimmed to leave 10% buffer for discussion
- [ ] Personalization notes reviewed (your brand, stories, metrics)

---

## When to Use Which Guide

| Situation                           | Read First          | Read Next          |
|-------------------------------------|---------------------|--------------------|
| Building a pitch deck               | `structure.md`      | `pitch-deck.md`   |
| Preparing a product demo            | `structure.md`      | `demos.md`        |
| Nerves or stage fright              | `delivery.md`       | `storytelling.md` |
| Slide design problems               | `design.md`         | `structure.md`    |
| Complex topic to simplify           | `storytelling.md`   | `design.md`       |
| High-stakes Q&A likely              | `qanda.md`          | `delivery.md`     |
