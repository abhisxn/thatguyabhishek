---
name: figma-design-system-custom
description: >
  Use when building a Figma design system or portfolio file using the Figma MCP.
  Triggers when the user asks to build a Figma file, create a design system,
  set up the portfolio in Figma, scaffold a design library, or references
  building pages, tokens, components, or a full site layout inside Figma.
user-invocable: true
metadata:
  version: "1.4"
  author: Abhishek Saxena
  updated: 2026-04-06
  status: ready
  requires: "Figma MCP"
---

# Figma Design System Skill

Builds a complete Figma file end-to-end:
design tokens → typography → components → layout → pages → project template.

Checkpoint model — complete one phase, confirm, then proceed. Never all phases at once.

---

## Prerequisites (already filled for this project)

| # | Question | Answer |
|---|---|---|
| Q1 | Color mode | Dual — dark primary, light available |
| Q2 | Typography | Glory (primary), Manrope (LinkedIn card) |
| Q3 | Visual direction | Editorial-minimal. Brand purple on near-black. linear.app quality. |
| Q4 | Token depth | Tiered — Primitive → Semantic → Component |
| Q5 | Component scope | Full library — atoms + molecules + organisms |
| Q6 | Breakpoints | 375 / 768 / 1280 / 1440px |
| Q7 | Figma target | Existing — figma.com/design/W3X90ArCwhgRQjTnBUvg93/Abhishek-Saxena |
| Q8 | Icon library | Lucide React |

---

## How to Run

1. Confirm Figma MCP is connected
2. Paste the master prompt from `master-prompt.md` into Claude Code
3. Confirm each phase checkpoint before proceeding
4. Run testing rules from `testing-rules.md` as final validation pass

> Do not run all phases in one shot. Use the checkpoint system.
> If Figma MCP errors on a complex component, retry with the simplest variant first.

---

## Phase Overview

| Phase | Figma Page | Output | Checkpoint |
|---|---|---|---|
| 1 | Design Tokens | 50+ variables, 3-tier (Primitive → Semantic → Component) | Variable count |
| 2 | Typography | All text styles with specimens | Style list |
| 3 | Atoms / Molecules / Organisms | Full component library with variants | Component count |
| 4 | Layout & Grid | Grid, spacing, z-index, motion docs | Page complete |
| 5 | Pages (Home → Contact) | 5 pages × 3 breakpoints | All frames exist |
| 6 | Project Page Template | Desktop + mobile template frames | Template complete |

---

## Execution Rules (Never Violate)

- **Naming:** slash notation always — `atom/button/primary`, never `PrimaryButton`
- **Auto Layout:** every frame. No manual x/y.
- **Tokens:** every fill, spacing, radius binds to a Variable. No hardcoded hex.
- **Live code first:** before building any molecule/organism, read the actual component file for exact px values
- **Variants:** one Component Set per component — never duplicate standalone states
- **Sequence:** Tokens → Typography → Atoms → Molecules → Organisms → Layout → Pages → Template. Never skip ahead.
- **Checkpoints:** output `✅ Phase [X] complete. Created: [list]. Ready for Phase [X+1]?` and wait.

---

## Reference Files

- `master-prompt.md` — full master prompt with all token values, component specs, page content
- `testing-rules.md` — mid-build gates, phase validation, pre-handoff checklist
