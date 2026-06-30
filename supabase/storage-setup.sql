-- Dealer CRM — Supabase Storage setup for vehicle images
-- Run this in Supabase → SQL Editor if uploads return 403 Forbidden.
--
-- Upload path used by the frontend:
--   dealers/{dealerId}/vehicles/{vehicleId}/{timestamp}-{filename}.webp

-- 1) Bucket (public so getPublicUrl works without signed URLs)
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = excluded.public;

-- 2) Helper: read dealer id without being blocked by RLS on public.dealers
create or replace function public.storage_dealer_prefix()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select id::text
  from public.dealers
  where owner_id = auth.uid()
  limit 1;
$$;

revoke all on function public.storage_dealer_prefix() from public;
grant execute on function public.storage_dealer_prefix() to authenticated;

-- 3) Policies (safe to re-run)
drop policy if exists "vehicle_images_public_read" on storage.objects;
drop policy if exists "vehicle_images_dealer_insert" on storage.objects;
drop policy if exists "vehicle_images_dealer_update" on storage.objects;
drop policy if exists "vehicle_images_dealer_delete" on storage.objects;

-- Anyone can read objects in this bucket (public vehicle pages + inventory cards)
create policy "vehicle_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'vehicle-images');

-- Authenticated dealer owners write only under dealers/{theirDealerId}/...
create policy "vehicle_images_dealer_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.storage_dealer_prefix()
    and public.storage_dealer_prefix() is not null
  );

create policy "vehicle_images_dealer_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.storage_dealer_prefix()
  )
  with check (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.storage_dealer_prefix()
  );

create policy "vehicle_images_dealer_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.storage_dealer_prefix()
  );

-- 4) Diagnostics (optional — run manually while logged in as the dealer user)
-- select public.storage_dealer_prefix() as my_dealer_prefix;
-- select id, owner_id, name from public.dealers where owner_id = auth.uid();
-- select policyname, cmd from pg_policies where schemaname = 'storage' and tablename = 'objects';
