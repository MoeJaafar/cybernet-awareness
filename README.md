# CyberNet

Web-based cybersecurity awareness game. Bachelor's thesis prototype, 2026.

## What this is

A scenario-based serious game where the player faces five realistic
everyday cyberattacks — a phishing email, a password reset, a scam
phone call, a dropped USB stick, and a public Wi-Fi decision. Each
scenario unfolds through interactive choices; scripted outcomes
explain what an attacker would have done with the choice the player
made, then debrief the underlying security concept.

The game is wrapped in a research study flow: informed consent →
pre-test (15 MCQ) → five scenarios → post-test → engagement survey →
done. All events are logged to Supabase for paired pre/post analysis.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Motion (formerly Framer Motion)
- Supabase (Postgres + REST) for event logging
- ElevenLabs for AI-voiced narration (generated at dev time, shipped
  as static mp3 assets)
- Deployed on Vercel

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side event insertion |
| `ELEVENLABS_API_KEY` | Dev only | Audio generation script |
| `ELEVENLABS_NARRATOR_VOICE_ID` | Dev only | Narrator voice |
| `ELEVENLABS_DAVID_VOICE_ID` | Dev only | Scam caller voice |

### Audio generation

Audio is pre-generated and committed as static assets. To regenerate:

```bash
npm run gen:audio -- --dry    # preview what would be generated
npm run gen:audio             # generate missing mp3s
npm run gen:audio -- --force  # regenerate everything
```

### Database

Run `supabase/migrations/0001_initial.sql` in the Supabase SQL Editor
to create the `sessions` and `events` tables.

## Study flow

| Step | Route | What happens |
|---|---|---|
| 1 | `/` | Entrance splash |
| 2 | `/consent` | Informed consent, creates session |
| 3 | `/pretest` | 15 MCQ knowledge questions |
| 4 | `/play` | Boot intro → first scenario |
| 5 | `/scenario/[id]` | Five chained scenarios |
| 6 | `/posttest` | Same 15 MCQ, reversed order |
| 7 | `/survey` | 8 Likert engagement questions |
| 8 | `/done` | Thank you, session cleared |

## Scenarios

1. **Phishing** — Gmail dark-mode mock with clickable link trap and
   inspection hotspots.
2. **Password fortress** — free-typing input with live crack-time
   counter and reactive wall visualisation.
3. **Vishing** — phone-call mock with typed subtitles from a
   Microsoft Support scam caller, then decision options.
4. **USB drop** — physical USB stick on the floor with a tempting
   label. Pick up, leave, or hand to IT.
5. **Public Wi-Fi** — iOS-style Wi-Fi settings screen with an evil
   twin, a legitimate café network, and a mobile-data tether option.

## Project layout

```
src/
  app/
    page.tsx              Entrance splash
    consent/              Informed consent
    pretest/              Pre-test MCQ
    play/                 Boot intro → scenarios
    scenario/[id]/        Scenario runner
    posttest/             Post-test MCQ
    survey/               Engagement survey
    done/                 Thank you
    api/event/            Event logging endpoint
  lib/
    scenarios/            Scenario data (TS)
    instruments/          Pre/post test + survey questions
    beats.ts              Sentence splitter (shared with audio gen)
    audio-paths.ts        Derive mp3 paths from scene IDs
    session.tsx           Session context + localStorage persistence
    supabase.ts           Supabase client
    audio-settings.tsx    Volume context
  components/
    BootSequence.tsx      Opening typed intro
    TypedNarrative.tsx    Typed prose with click-to-advance + audio
    ScenarioRunner.tsx    Scene graph router
    EmailMockup.tsx       Gmail dark-mode mock
    PasswordBuilder.tsx   Free-typing password builder
    PhoneCall.tsx         Phone-call mock with subtitles
    UsbStick.tsx          USB stick visual
    WiFiPicker.tsx        iOS Wi-Fi settings mock
    KnowledgeTest.tsx     MCQ test component (pre + post)
    BgMusic.tsx           Looping background music
    VolumeControl.tsx     Music + narrator volume sliders
scripts/
  generate-audio.ts      ElevenLabs audio generation pipeline
supabase/
  migrations/            SQL schema
public/
  audio/                 Generated mp3s (138 beats + ringtone + bg music)
docs/
  PLAN.md                Full product + study plan
  AUDIO_SCRIPT.md        Audio generation docs
  NEXT_SESSION.md        Session handoff for new Claude sessions
```
