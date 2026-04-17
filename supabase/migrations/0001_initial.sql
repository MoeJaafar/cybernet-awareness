-- CyberNet — initial schema.
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New Query).

-- One row per participant session. Created on /consent, finished
-- when the participant reaches /done.
create table sessions (
    id           uuid primary key default gen_random_uuid(),
    created_at   timestamptz not null default now(),
    finished_at  timestamptz
);

-- Generic event log. Every meaningful user action (consent, pretest
-- answer, in-game choice, posttest answer, survey response) is one
-- row. The `type` field says what happened; `payload` carries the
-- details as JSON.
--
-- Event types:
--   consent         {}
--   pretest         { questionId, answer, correct }
--   choice          { scenarioId, sceneId, choiceLabel, attackerWon }
--   posttest        { questionId, answer, correct }
--   survey          { questionId, value }
--   session_end     {}
create table events (
    id          uuid primary key default gen_random_uuid(),
    session_id  uuid not null references sessions(id) on delete cascade,
    ts          timestamptz not null default now(),
    type        text not null,
    payload     jsonb not null default '{}'::jsonb
);
create index on events (session_id, ts);
create index on events (type);

-- Row-Level Security: the anon key can only insert, never read or
-- delete. Analysis uses the service key or a read-only Postgres role.
alter table sessions enable row level security;
alter table events enable row level security;

create policy "anon can insert sessions"
    on sessions for insert
    to anon
    with check (true);

create policy "anon can insert events"
    on events for insert
    to anon
    with check (true);
