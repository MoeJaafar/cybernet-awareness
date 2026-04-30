-- CyberNet — locale column on sessions.
-- Add this so analyses can split EN vs AR participants. Existing
-- rows backfill to 'en'; new rows are explicit.

alter table sessions
    add column if not exists locale text not null default 'en';

-- Optional sanity check: current locales we expect.
-- Keep open-ended in case more locales are added later.
alter table sessions
    add constraint sessions_locale_known
    check (locale in ('en', 'ar'));
