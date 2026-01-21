-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Sources
create table sources (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null, -- 'API', 'RSS', 'Scraping'
  url text not null,
  language text not null,
  reliability int check (reliability between 1 and 5),
  status text default 'Active', -- 'Active', 'Slow', 'Error'
  last_fetch timestamptz,
  created_at timestamptz default now()
);

-- Table: News
create table news (
  id uuid default uuid_generate_v4() primary key,
  title_original text not null,
  title_fr text,
  source_id uuid references sources(id),
  source_name text, -- Denormalized for easier querying if source_id is null (e.g. from aggregators)
  url text unique not null,
  image_url text,
  published_at timestamptz not null,
  created_at timestamptz default now(),
  category text -- 'Oil', 'Geopolitics', 'Economy', 'OPEC'
);

-- Table: Analyses (Gemini Output)
create table analyses (
  id uuid default uuid_generate_v4() primary key,
  timestamp timestamptz default now(),
  flash_json jsonb,
  report_json jsonb,
  alerts_json jsonb,
  created_at timestamptz default now()
);

-- Table: Oil Prices
create table oil_prices (
  id uuid default uuid_generate_v4() primary key,
  symbol text not null, -- 'BRENT', 'WTI'
  price numeric not null,
  change_percent numeric,
  timestamp timestamptz not null
);

-- RLS Policies (Row Level Security)
alter table sources enable row level security;
alter table news enable row level security;
alter table analyses enable row level security;
alter table oil_prices enable row level security;

-- Public read access (since it's a dashboard for specific users, we can allow public read for simplicity if protected by app login, 
-- but better to restrict if possible. For now, we allow read for anon to make frontend fetch easy without complex auth for this MVP)
create policy "Allow public read sources" on sources for select using (true);
create policy "Allow public read news" on news for select using (true);
create policy "Allow public read analyses" on analyses for select using (true);
create policy "Allow public read oil_prices" on oil_prices for select using (true);

-- Insert Initial Sources
insert into sources (name, type, url, language, reliability) values
('Reuters', 'API', 'https://reuters.com', 'EN', 5),
('Bloomberg', 'API', 'https://bloomberg.com', 'EN', 5),
('Le Monde', 'RSS', 'https://lemonde.fr', 'FR', 5),
('El Nacional', 'RSS', 'https://elnacional.com', 'ES', 4),
('OilPrice.com', 'Scraping', 'https://oilprice.com', 'EN', 4);
