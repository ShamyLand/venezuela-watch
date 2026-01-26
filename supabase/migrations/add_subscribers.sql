-- Create subscribers table
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true
);

-- RLS Policies
alter table subscribers enable row level security;

-- Only service_role (backend) can view/add subscribers for now to prevent spam via public API if not protected
-- But for the Subscribe API to work with client anon key, we might need an insert policy, 
-- OR we use the service_role key in the API route (which is safer). 
-- Let's stick to using service_role in the Next.js API route.

-- Allow read access to service role only (default off)
create policy "Enable access to service role"
  on subscribers
  using ( auth.role() = 'service_role' )
  with check ( auth.role() = 'service_role' );
