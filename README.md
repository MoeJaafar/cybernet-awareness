# cybernet-awareness

Web-based cybersecurity awareness game. LLM-narrated attack scenarios.
Master's thesis prototype, 2026.

## What this is

A scenario-based serious game where the player takes the role of a
university staff member facing realistic cyberattacks (phishing,
credential reuse, USB drops, MFA fatigue, oversharing). Each
scenario unfolds over a few decisions; an LLM narrator explains the
attacker's reasoning and the consequences of each choice, then
debriefs the player on the underlying security concept.

The thesis evaluates whether LLM-driven narration improves
conceptual understanding compared to a silent, scripted-feedback
control condition.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- OpenRouter for LLM inference (free-tier models supported)
- Deployed on Vercel

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in OPENROUTER_API_KEY
npm run dev
```

Open http://localhost:3000.

## Project layout (planned)

```
src/
  app/                    Next.js App Router routes
    page.tsx              Landing
    scenario/[id]/        Scenario runner
    debrief/[id]/         Post-scenario reflection
    api/llm/route.ts      OpenRouter proxy (server-side, hides key)
  lib/
    scenarios/            Scenario definitions (TS data)
    llm.ts                OpenRouter client wrapper
    types.ts              Shared types
  components/
    EmailMockup.tsx
    DecisionPrompt.tsx
    DebriefPanel.tsx
```

## Status

Scaffolding only. Scenarios and LLM integration TBD.
