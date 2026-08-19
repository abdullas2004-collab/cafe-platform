-- ═══════════════════════════════════════════════════════════════
--  ProfitGuard AI — Complete Supabase Database Setup
--  Run this entire file in: supabase.com → your project → SQL Editor
--  Paste everything, then click "Run"
-- ═══════════════════════════════════════════════════════════════

-- ── EXTENSIONS ──────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- ═══════════════════════════════════════════════════════════════
--  CORE TABLES
-- ═══════════════════════════════════════════════════════════════

-- ── CAFES ───────────────────────────────────────────────────────
create table if not exists cafes (
  id               uuid primary key default gen_random_uuid(),
  owner_user_id    uuid references auth.users(id) on delete set null,
  name             text not null,
  emirate          text not null default 'Dubai',
  trade_license    text,
  cuisine_type     text default 'Cafe',
  seating_capacity int,
  pos_system       text default 'manual',
  owner_phone      text,
  owner_whatsapp   text,
  language         text default 'en',
  plan             text default 'trial',       -- trial | starter | growth | chain
  trial_ends_at    timestamptz,
  foodics_token    text,                        -- encrypted in production
  foodics_refresh  text,
  pos_connected    boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── STAFF ───────────────────────────────────────────────────────
create table if not exists staff (
  id          uuid primary key default gen_random_uuid(),
  cafe_id     uuid references cafes(id) on delete cascade not null,
  name        text not null,
  name_ar     text,
  role        text default 'barista',
  phone       text,
  language    text default 'en',
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ── COMPLIANCE DOCUMENTS ────────────────────────────────────────
create table if not exists compliance_docs (
  id           uuid primary key default gen_random_uuid(),
  cafe_id      uuid references cafes(id) on delete cascade not null,
  doc_type     text not null,
  -- doc_type values: trade_license | health_card | food_permit |
  --                  haccp | pest_control | fire_safety | civil_defense
  holder_name  text,           -- for health cards: staff member name
  doc_number   text,
  issued_date  date,
  expiry_date  date not null,
  file_url     text,           -- Supabase Storage URL
  notes        text,
  status       text generated always as (
    case
      when expiry_date < current_date                          then 'expired'
      when expiry_date < current_date + interval '14 days'    then 'urgent'
      when expiry_date < current_date + interval '60 days'    then 'expiring'
      else 'valid'
    end
  ) stored,
  created_at   timestamptz default now()
);

create index if not exists idx_docs_cafe_expiry
  on compliance_docs(cafe_id, expiry_date);

-- ── INGREDIENTS (Halal & Expiry Tracker) ────────────────────────
create table if not exists ingredients (
  id               uuid primary key default gen_random_uuid(),
  cafe_id          uuid references cafes(id) on delete cascade not null,
  name             text not null,
  name_ar          text,
  name_ur          text,
  batch_number     text,
  halal_cert_no    text,
  is_halal         boolean default true,
  quantity         numeric default 0,
  unit             text default 'L',    -- L | kg | units
  cost_per_unit    numeric,
  supplier_name    text,
  expiry_date      date not null,
  status           text generated always as (
    case
      when expiry_date < current_date                        then 'expired'
      when expiry_date < current_date + interval '3 days'   then 'urgent'
      when expiry_date < current_date + interval '30 days'  then 'expiring'
      else 'valid'
    end
  ) stored,
  created_at       timestamptz default now()
);

create index if not exists idx_ingredients_cafe_expiry
  on ingredients(cafe_id, expiry_date);

-- ── MUNICIPALITY LOGS (daily barista checklist) ─────────────────
create table if not exists municipality_logs (
  id               uuid primary key default gen_random_uuid(),
  cafe_id          uuid references cafes(id) on delete cascade not null,
  staff_id         uuid references staff(id) on delete set null,
  staff_name       text,
  logged_at        timestamptz default now(),
  fridge_temp_c    numeric not null,
  temp_compliant   boolean generated always as (fridge_temp_c <= 4) stored,
  checklist        jsonb default '{}',
  -- checklist: { "cold_chain": true, "hygiene": true, "labels": false, ... }
  tasks_completed  int default 0,
  tasks_total      int default 5,
  all_clear        boolean generated always as (
    (checklist->>'cold_chain')::boolean and
    (checklist->>'hygiene')::boolean and
    (checklist->>'labels')::boolean and
    (checklist->>'pest_control')::boolean and
    (checklist->>'surfaces')::boolean
  ) stored,
  risk_flag        boolean default false,
  risk_details     text,
  ref_number       text unique default
    'PG-' || to_char(now(), 'MMYYYY') || '-' ||
    lpad(floor(random()*999999)::text, 6, '0'),
  created_at       timestamptz default now()
);

create index if not exists idx_logs_cafe_date
  on municipality_logs(cafe_id, logged_at desc);

-- ── DAILY SALES ─────────────────────────────────────────────────
create table if not exists daily_sales (
  id             uuid primary key default gen_random_uuid(),
  cafe_id        uuid references cafes(id) on delete cascade not null,
  sale_date      date not null default current_date,
  menu_item      text not null,
  quantity_sold  int not null default 0,
  milk_ml        numeric,          -- milk used per unit in ml
  coffee_g       numeric,          -- coffee used per unit in grams
  revenue_aed    numeric,
  source         text default 'manual', -- manual | foodics | posrocket
  created_at     timestamptz default now(),
  unique(cafe_id, sale_date, menu_item)
);

create index if not exists idx_sales_cafe_date
  on daily_sales(cafe_id, sale_date desc);

-- ── WASTE LOGS ──────────────────────────────────────────────────
create table if not exists waste_logs (
  id               uuid primary key default gen_random_uuid(),
  cafe_id          uuid references cafes(id) on delete cascade not null,
  ingredient_id    uuid references ingredients(id) on delete set null,
  logged_at        timestamptz default now(),
  ingredient_name  text not null,
  quantity         numeric not null,
  unit             text default 'L',
  reason           text not null,
  -- reason values: expired | over_prep | spillage | trim | other
  cost_lost_aed    numeric,
  logged_by_id     uuid references staff(id) on delete set null,
  logged_by_name   text,
  created_at       timestamptz default now()
);

create index if not exists idx_waste_cafe_date
  on waste_logs(cafe_id, logged_at desc);

-- ── INGREDIENT ORDERS ───────────────────────────────────────────
create table if not exists ingredient_orders (
  id               uuid primary key default gen_random_uuid(),
  cafe_id          uuid references cafes(id) on delete cascade not null,
  order_date       date not null default current_date,
  ingredient_name  text not null,
  standard_qty     numeric,        -- what they usually order
  ai_rec_qty       numeric,        -- what the AI recommended
  quantity_ordered numeric,        -- what they actually ordered
  unit             text default 'L',
  qty_saved        numeric generated always as (
    coalesce(standard_qty, 0) - coalesce(quantity_ordered, 0)
  ) stored,
  cost_per_unit    numeric,
  cost_saved_aed   numeric generated always as (
    (coalesce(standard_qty, 0) - coalesce(quantity_ordered, 0)) *
    coalesce(cost_per_unit, 0)
  ) stored,
  supplier_name    text,
  status           text default 'pending', -- pending | sent | delivered
  created_at       timestamptz default now()
);

create index if not exists idx_orders_cafe_date
  on ingredient_orders(cafe_id, order_date desc);

-- ── SUPPLIERS ───────────────────────────────────────────────────
create table if not exists suppliers (
  id          uuid primary key default gen_random_uuid(),
  cafe_id     uuid references cafes(id) on delete cascade not null,
  name        text not null,
  category    text,   -- dairy | pastry | coffee | produce | other
  phone       text,
  whatsapp    text,
  emoji       text default '🏪',
  notes       text,
  created_at  timestamptz default now()
);

-- ── FINE HISTORY ────────────────────────────────────────────────
create table if not exists fine_history (
  id             uuid primary key default gen_random_uuid(),
  cafe_id        uuid references cafes(id) on delete cascade not null,
  event_date     date not null,
  event_type     text not null,  -- violation | avoided
  violation_type text,
  inspector_ref  text,
  amount_aed     numeric not null,
  outcome        text,
  notes          text,
  created_at     timestamptz default now()
);

-- ── RECIPE SETTINGS ─────────────────────────────────────────────
create table if not exists recipe_settings (
  id            uuid primary key default gen_random_uuid(),
  cafe_id       uuid references cafes(id) on delete cascade not null unique,
  steam_buffer  int default 10,   -- % milk lost to steaming
  latte_milk_ml int default 250,
  latte_coffee_g int default 18,
  flatwhite_milk_ml  int default 180,
  flatwhite_coffee_g int default 18,
  capp_milk_ml  int default 160,
  capp_coffee_g int default 18,
  updated_at    timestamptz default now()
);


-- ═══════════════════════════════════════════════════════════════
--  VIEWS — useful for dashboard queries
-- ═══════════════════════════════════════════════════════════════

-- Today's compliance summary per cafe
create or replace view cafe_compliance_summary as
select
  c.id                                                              as cafe_id,
  c.name,
  c.emirate,
  c.plan,
  c.trial_ends_at,
  count(d.*) filter (where d.status = 'expired')                   as expired_docs,
  count(d.*) filter (where d.status = 'urgent')                    as urgent_docs,
  count(d.*) filter (where d.status = 'expiring')                  as expiring_docs,
  count(d.*) filter (where d.status = 'valid')                     as valid_docs,
  count(i.*) filter (where i.status in ('urgent','expired'))       as expiring_ingredients,
  max(l.logged_at)                                                  as last_log_at,
  count(l.*) filter (where l.logged_at > now() - interval '7 days') as logs_this_week
from cafes c
left join compliance_docs d on d.cafe_id = c.id
left join ingredients     i on i.cafe_id = c.id
left join municipality_logs l on l.cafe_id = c.id
group by c.id, c.name, c.emirate, c.plan, c.trial_ends_at;

-- Monthly savings rollup
create or replace view monthly_savings as
select
  cafe_id,
  date_trunc('month', order_date)::date                            as month,
  sum(cost_saved_aed)                                              as total_saved_aed,
  sum(qty_saved)                                                   as total_qty_saved,
  count(*)                                                         as orders_adjusted
from ingredient_orders
group by cafe_id, date_trunc('month', order_date)
order by month desc;

-- Weekly log compliance rate
create or replace view weekly_compliance_rate as
select
  cafe_id,
  date_trunc('week', logged_at)::date                              as week_start,
  count(*)                                                         as logs_submitted,
  round(avg(tasks_completed::numeric / nullif(tasks_total,0) * 100),1) as avg_score,
  count(*) filter (where risk_flag = true)                         as risk_flags
from municipality_logs
group by cafe_id, date_trunc('week', logged_at)
order by week_start desc;


-- ═══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Ensures each cafe owner only sees their own data
-- ═══════════════════════════════════════════════════════════════

alter table cafes              enable row level security;
alter table staff              enable row level security;
alter table compliance_docs    enable row level security;
alter table ingredients        enable row level security;
alter table municipality_logs  enable row level security;
alter table daily_sales        enable row level security;
alter table waste_logs         enable row level security;
alter table ingredient_orders  enable row level security;
alter table suppliers          enable row level security;
alter table fine_history       enable row level security;
alter table recipe_settings    enable row level security;

-- Helper function: get cafe_id belonging to the logged-in user
create or replace function my_cafe_id()
returns uuid language sql stable as $$
  select id from cafes where owner_user_id = auth.uid() limit 1;
$$;

-- Cafes: owner can read/update their own cafe
create policy "owner reads own cafe" on cafes
  for select using (owner_user_id = auth.uid());
create policy "owner updates own cafe" on cafes
  for update using (owner_user_id = auth.uid());
create policy "owner inserts cafe" on cafes
  for insert with check (owner_user_id = auth.uid());

-- All other tables: owner accesses rows where cafe_id = their cafe
create policy "staff access"           on staff              for all using (cafe_id = my_cafe_id());
create policy "docs access"            on compliance_docs    for all using (cafe_id = my_cafe_id());
create policy "ingredients access"     on ingredients        for all using (cafe_id = my_cafe_id());
create policy "logs access"            on municipality_logs  for all using (cafe_id = my_cafe_id());
create policy "sales access"           on daily_sales        for all using (cafe_id = my_cafe_id());
create policy "waste access"           on waste_logs         for all using (cafe_id = my_cafe_id());
create policy "orders access"          on ingredient_orders  for all using (cafe_id = my_cafe_id());
create policy "suppliers access"       on suppliers          for all using (cafe_id = my_cafe_id());
create policy "fines access"           on fine_history       for all using (cafe_id = my_cafe_id());
create policy "recipe access"          on recipe_settings    for all using (cafe_id = my_cafe_id());


-- ═══════════════════════════════════════════════════════════════
--  SEED DATA — demo cafe for testing (delete in production)
-- ═══════════════════════════════════════════════════════════════

-- Only run this block if you want test data in the dashboard
-- Remove or comment out before going live with real cafes

/*
insert into cafes (name, emirate, trade_license, pos_system, plan, trial_ends_at)
values ('Nightjar Coffee (Demo)', 'Dubai', 'DED-2024-DEMO01', 'Foodics', 'trial',
        now() + interval '14 days');

-- Add demo compliance docs once you have a cafe id — replace <cafe_id> below:
-- insert into compliance_docs (cafe_id, doc_type, holder_name, expiry_date)
-- values
--   ('<cafe_id>', 'trade_license',  null,            '2026-08-14'),
--   ('<cafe_id>', 'health_card',    'Ahmed Al Farsi', '2026-06-03'),
--   ('<cafe_id>', 'health_card',    'Sara Khalid',    '2026-07-01'),
--   ('<cafe_id>', 'health_card',    'Omar Hassan',    '2026-05-18'),
--   ('<cafe_id>', 'food_permit',    null,             '2026-12-31');
*/


-- ═══════════════════════════════════════════════════════════════
--  DONE ✓
--  Your database is ready. Copy your Project URL and anon key
--  from Settings → API and paste them into ProfitGuardAI.jsx:
--
--    const SUPABASE_URL = "https://xxxx.supabase.co";
--    const SUPABASE_KEY = "eyJhbGciOiJ...";
--    const [screen, setScreen] = useState("login");  ← change "app" to "login"
-- ═══════════════════════════════════════════════════════════════
