-- Dealer CRM — Supabase Storage setup for vehicle images
-- Run this in Supabase → SQL Editor if uploads return 403 Forbidden.
--
-- Upload path used by the frontend:
--   dealers/{dealerId}/vehicles/{vehicleId}/{timestamp}-{filename}.webp
--
-- Requires public.current_dealer_id() (reads profiles.dealer_id — same source as table RLS).

-- 1) Bucket (public so getPublicUrl works without signed URLs)
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = excluded.public;

-- 2) Helper: reuse profiles.dealer_id (must already exist for table RLS)
create or replace function public.current_dealer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select dealer_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

revoke all on function public.current_dealer_id() from public;
grant execute on function public.current_dealer_id() to authenticated;

-- 3) Policies (safe to re-run)
drop policy if exists "vehicle_images_public_read" on storage.objects;
drop policy if exists "vehicle_images_dealer_insert" on storage.objects;
drop policy if exists "vehicle_images_dealer_update" on storage.objects;
drop policy if exists "vehicle_images_dealer_delete" on storage.objects;

create policy "vehicle_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'vehicle-images');

create policy "vehicle_images_dealer_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.current_dealer_id()::text
  );

create policy "vehicle_images_dealer_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.current_dealer_id()::text
  )
  with check (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.current_dealer_id()::text
  );

create policy "vehicle_images_dealer_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = 'dealers'
    and (storage.foldername(name))[2] = public.current_dealer_id()::text
  );

-- Diagnostics (optional)
-- select public.current_dealer_id();
-- select dealer_id from public.profiles where id = auth.uid();
