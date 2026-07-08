-- Spine app: Supabase schema v1
-- Paste entire file into Supabase SQL Editor and run once.

-- ============ TABLES ============

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  timezone text not null default 'America/New_York',
  reminder_evening boolean not null default true,
  reminder_weekly boolean not null default true,
  current_phase text not null default 'phase_0',
  created_at timestamptz not null default now()
);

create table if not exists habit_definitions (
  id text primary key,
  label text not null,
  description text,
  input_type text not null check (input_type in ('boolean','count')),
  target_value numeric,
  sort_order int not null,
  active boolean not null default true
);

create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  back_score int check (back_score between 1 and 10),
  stress_score int check (stress_score between 1 and 10),
  sleep_hours numeric(3,1) check (sleep_hours between 0 and 14),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists habit_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  habit_id text not null references habit_definitions(id),
  value numeric not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, log_date, habit_id)
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = template row, copied on first login
  title text not null,
  description text,
  category text not null check (category in ('medical','pt','labs','training','checkpoint')),
  criteria_text text,
  target_date date,
  status text not null default 'todo' check (status in ('todo','scheduled','done','skipped')),
  completed_at date,
  notes text,
  sort_order int not null default 100
);

create table if not exists flare_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_on date not null,
  ended_on date,
  severity int check (severity between 1 and 10),
  suspected_trigger text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  content_md text not null,
  risk_flag text check (risk_flag in ('green','amber','red')),
  model text,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- ============ RLS ============

alter table profiles enable row level security;
alter table daily_logs enable row level security;
alter table habit_entries enable row level security;
alter table milestones enable row level security;
alter table flare_events enable row level security;
alter table weekly_reports enable row level security;
alter table push_subscriptions enable row level security;
alter table habit_definitions enable row level security;

create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own logs" on daily_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own habits" on habit_entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own milestones" on milestones for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "read milestone templates" on milestones for select using (user_id is null);
create policy "own flares" on flare_events for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own reports" on weekly_reports for select using (user_id = auth.uid());
create policy "own push" on push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "read habit defs" on habit_definitions for select using (true);

-- ============ SEED: habits ============

insert into habit_definitions (id, label, description, input_type, target_value, sort_order) values
 ('sleep_window',  'Sleep window',   '8.25h in bed, fixed wake time',                      'boolean', null, 1),
 ('walks',         'Walks',          '5-10 min walks spread across the day',               'count',   3,    2),
 ('mcgill_big3',   'McGill Big 3',   'Curl-up, side plank, bird dog',                      'boolean', null, 3),
 ('hip_openers',   'Hip openers',    '90/90 switches, couch stretch, goblet hold',         'boolean', null, 4),
 ('sit_stand',     'Position changes','Changed position every 30-45 min at desk',          'boolean', null, 5),
 ('morning_rule',  'Morning rule',   'No loaded flexion in the first hour after waking',   'boolean', null, 6)
on conflict (id) do nothing;

-- ============ SEED: milestone templates (user_id null; app copies to user on first login) ============

insert into milestones (user_id, title, description, category, criteria_text, sort_order) values
 (null, 'Book PT eval (MDT/strength clinician)', 'Use the script: directional preference assessment + progressive loading program; mention flexion stretching nearly triggered spasms', 'pt', null, 10),
 (null, 'PT eval done: hip mobility screen', 'Hip flexion + internal rotation screened (clinical exam, NOT imaging); left-knee single-leg mechanics checked', 'pt', null, 20),
 (null, 'Directional preference result recorded', 'Extension bias confirmed or ruled out via MDT exam / prone press-up response', 'pt', null, 30),
 (null, 'Labs drawn: ferritin + HbA1c', 'One draw. Lab chapter CLOSED after this regardless of result', 'labs', null, 40),
 (null, 'Sorensen baseline recorded', 'Prone hold to failure; note seconds. Target 150+ later', 'training', null, 50),
 (null, 'Side plank baseline both sides', 'Note seconds each side; flag asymmetry over 10 percent', 'training', null, 60),
 (null, 'Phase 1 complete (weeks 0-6)', null, 'training', 'Daily floor automatic; protein ~1.6 g/kg routine; creatine decision made once', 70),
 (null, 'One full month spasm-free', null, 'checkpoint', null, 80),
 (null, 'Phase 2 exit criteria met', null, 'training', 'Sorensen 150+ sec; side planks symmetric 60-75 sec; hinge automatic under moderate load; 1 month spasm-free', 90),
 (null, 'Month-4 relapse checkpoint', 'Predicted urge to drop routine / add new project. Hold the WIP limit and maintenance floor', 'checkpoint', null, 100),
 (null, 'Burpee reintroduction gate', null, 'training', 'Pain-free loaded hinging AND one PT review of jump-landing mechanics', 110),
 (null, 'Deadlift returned to full range/load', 'With coach; trap bar from blocks first', 'training', null, 120),
 (null, 'Maintenance floor automatic (month 9)', '10 min daily + 2 lifts/week is default life', 'checkpoint', null, 130),
 (null, 'Escalation review (only if needed, month 9-12)', 'If spasms still frequent after full execution: physiatrist (PM&R), not a surgeon', 'medical', null, 140)
on conflict do nothing;

-- ============ updated_at trigger ============

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_daily_logs_updated on daily_logs;
create trigger trg_daily_logs_updated before update on daily_logs for each row execute function set_updated_at();

drop trigger if exists trg_habit_entries_updated on habit_entries;
create trigger trg_habit_entries_updated before update on habit_entries for each row execute function set_updated_at();
