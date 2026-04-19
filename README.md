# CyberNet

> A scenario-based web serious game for everyday cybersecurity awareness.

**Live demo:** <https://cybernet-awareness.vercel.app>

CyberNet places the player inside five realistic attack scenarios — a phishing email, a password choice, a voice-phishing call, a dropped USB stick, and a public Wi-Fi decision — and walks them through each one as a short branched decision. After each choice, a scripted outcome explains what an attacker would have done with the decision the player made, followed by a narrated debrief that consolidates the underlying security concept.

The app is wrapped in a research study flow (consent → pre-test → five scenarios → post-test → engagement survey → optional demographics → thank-you), so the same build serves as both a public playable demo and the instrument for the accompanying evaluation study.

## The five scenarios

1. **Phishing — IT Helpdesk.** An inbox with a plausible IT-helpdesk message carrying inspectable hotspots on sender, subject, and link. Three decisions: click, report, or delete. The embedded link is itself a trap, so an accidental click routes to the compromised outcome.
2. **Password — Pick your password.** Four candidate passwords are offered (leet-substituted dictionary word, three-word passphrase, short random string, memorable personal pattern). Each candidate routes to one of three outcomes teaching passphrase strength, dictionary-plus-substitution weakness, and name-plus-year predictability.
3. **Vishing — Microsoft Support scam.** A three-phase phone call with a looping ringtone, scripted caller lines voiced by a distinct character, and typed subtitles synchronised to audio playback. Three decisions: comply, hang up and call back, or hang up without callback.
4. **USB drop.** A found USB stick with a handwritten label. Three branches: plug it in, leave it in a shared area, or hand it to IT. Outcomes cover BadUSB, payloaded autorun, and credential-harvesting documents.
5. **Public Wi-Fi.** A mobile Wi-Fi settings screen with three networks: an open hotspot configured as an evil twin, a legitimate café network requiring a captive portal, and cellular tethering as a "don't connect" option. Outcomes consolidate the public-Wi-Fi trust model.

## Design rationale

The design is grounded in three pedagogical frameworks:

- **MDA** (Mechanics, Dynamics, Aesthetics) — maps concrete mechanics to the player's experience and to intended learning outcomes.
- **MOTENS** — a cybersecurity-specific pedagogical model that ties threat scenarios to formative feedback and observable outcomes.
- **Garris input–process–outcome loop** — situates the play-and-debrief loop as the mechanism by which engagement turns into learning.

Six design principles shape the scenarios: embedded feedback at the scene level, progressive difficulty across the sequence, narrative immersion in plausible everyday moments, goal clarity (each decision shows exactly the information the player needs), bounded agency (three-to-four options per decision), and an explicit narrated debrief closing each scenario.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Motion** (formerly Framer Motion)
- **Supabase** (Postgres + REST) for anonymous session and event logging
- **ElevenLabs** for pre-generated narration — generated at dev time, shipped as static mp3 assets, zero runtime API calls
- Deployed on **Vercel**

## Running locally

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + ElevenLabs keys
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | Server-side event insertion |
| `ELEVENLABS_API_KEY` | dev only | Used by the audio-generation script |
| `ELEVENLABS_NARRATOR_VOICE_ID` | dev only | Cinematic narrator voice |
| `ELEVENLABS_DAVID_VOICE_ID` | dev only | Scam caller voice |

### Database

Run `supabase/migrations/0001_initial.sql` in the Supabase SQL Editor to create the `sessions` and `events` tables. Row-Level Security policies are configured for anonymous insert-only access, with a separate read-only role for analysis.

### Audio pipeline

Narration is pre-generated and committed as static assets. Regenerate with:

```bash
npm run gen:audio -- --dry     # preview what would be generated
npm run gen:audio              # generate missing mp3s
npm run gen:audio -- --force   # regenerate everything
```

## Study design

A single-group, within-subjects, pre- and post-test quasi-experimental design. Each participant serves as their own control. This pattern is the modal design reported in recent scenario-based awareness work (see Steen 2021, Bitrián 2024, Le-Nye 2024).

| Step | Route | Instrument |
|---|---|---|
| 1 | `/` | Landing |
| 2 | `/consent` | Informed consent, creates anonymous session |
| 3 | `/briefing` | Framing of the four-step arc |
| 4 | `/pretest` | 10-item multiple-choice knowledge test |
| 5 | `/play` → `/scenario/[id]` | Boot intro + five scenarios |
| 6 | `/posttest` | Same 10 items, presented in reverse order |
| 7 | `/survey` | 11-item Likert engagement survey |
| 8 | `/demographics` | Optional 12-item demographic form |
| 9 | `/done` | Thank-you |

### Data and privacy

- Sessions are keyed only by a random identifier. The application captures no names, no email addresses, and no IP addresses.
- Data are stored in the EU Supabase region.
- Retention: two years from the date of collection.
- Participation is voluntary. Participants may stop at any time by closing the tab.

## Project layout

```
src/
  app/                 Next.js routes (one per study step)
  lib/                 Scenario data, instruments, session state
  components/          UI (scenarios, mocks, audio controls)
scripts/
  generate-audio.ts    Dev-time ElevenLabs pipeline
supabase/
  migrations/          Postgres schema + RLS policies
  clear-data.sql       Utility to wipe collected data
public/
  audio/               Pre-generated narration mp3s
  art/                 SVG art assets
```

## Status

The accompanying user study is in progress at the time of publication. Empirical results (knowledge deltas, engagement, demographic breakdowns) will be reported in a subsequent update of the associated thesis.

## Academic context

CyberNet is the prototype component of a bachelor's thesis at Innopolis University, 2026:

> Jaafar, M. (2026). *Designing and Evaluating Serious Games to Improve Cybersecurity Awareness and Behaviour.* Bachelor's thesis, Innopolis University. Supervisor: Prof. Paolo Ciancarini.

## Licence

MIT. See [`LICENSE`](LICENSE).

## Acknowledgements

Supervised by Prof. Paolo Ciancarini at Innopolis University. Narration generated via ElevenLabs. Data infrastructure by Supabase.
