-- Re-enable Row Level Security before going live.
-- Public (anon key) can only SELECT. Only authenticated (logged-in admin) can write.
-- Run this whole file in the Supabase SQL Editor.

-- ---------- categories ----------
alter table categories enable row level security;
drop policy if exists "public read" on categories;
drop policy if exists "authenticated write" on categories;
create policy "public read" on categories for select to anon, authenticated using (true);
create policy "authenticated write" on categories for all to authenticated using (true) with check (true);

-- ---------- sections ----------
alter table sections enable row level security;
drop policy if exists "public read" on sections;
drop policy if exists "authenticated write" on sections;
create policy "public read" on sections for select to anon, authenticated using (true);
create policy "authenticated write" on sections for all to authenticated using (true) with check (true);

-- ---------- subsections ----------
alter table subsections enable row level security;
drop policy if exists "public read" on subsections;
drop policy if exists "authenticated write" on subsections;
create policy "public read" on subsections for select to anon, authenticated using (true);
create policy "authenticated write" on subsections for all to authenticated using (true) with check (true);

-- ---------- items ----------
alter table items enable row level security;
drop policy if exists "public read" on items;
drop policy if exists "authenticated write" on items;
create policy "public read" on items for select to anon, authenticated using (true);
create policy "authenticated write" on items for all to authenticated using (true) with check (true);

-- ---------- variants ----------
alter table variants enable row level security;
drop policy if exists "public read" on variants;
drop policy if exists "authenticated write" on variants;
create policy "public read" on variants for select to anon, authenticated using (true);
create policy "authenticated write" on variants for all to authenticated using (true) with check (true);

-- ---------- storage: menu-images bucket ----------
-- Bucket itself should stay marked "Public" in Storage settings (that's what lets
-- <img> tags load images with no auth). RLS on storage.objects only governs
-- writes made through the API (upload/replace/delete from admin.html).
drop policy if exists "authenticated upload menu-images" on storage.objects;
drop policy if exists "authenticated update menu-images" on storage.objects;
drop policy if exists "authenticated delete menu-images" on storage.objects;

create policy "authenticated upload menu-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'menu-images');

create policy "authenticated update menu-images" on storage.objects
  for update to authenticated using (bucket_id = 'menu-images');

create policy "authenticated delete menu-images" on storage.objects
  for delete to authenticated using (bucket_id = 'menu-images');
