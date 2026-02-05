-- Supabase RLS + policies for KITOS

-- Enable row level security on both tables
alter table public.designs enable row level security;
alter table public.variants enable row level security;

-- Public: can read featured designs
drop policy if exists "public_select_featured_designs" on public.designs;
create policy "public_select_featured_designs" on public.designs
for select
using (
  is_featured = true
);

-- Public: can read variants that belong to featured designs
drop policy if exists "public_select_featured_variants" on public.variants;
create policy "public_select_featured_variants" on public.variants
for select
using (
  exists (
    select 1
    from public.designs d
    where d.id = variants.design_id
      and d.is_featured = true
  )
);

-- Authenticated users (your admin login) have full access to designs
drop policy if exists "auth_all_designs" on public.designs;
create policy "auth_all_designs" on public.designs
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Authenticated users have full access to variants
drop policy if exists "auth_all_variants" on public.variants;
create policy "auth_all_variants" on public.variants
for all
using (auth.role() = 'authenticated' or auth.role() = 'service_role')
with check (auth.role() = 'authenticated' or auth.role() = 'service_role');
