-- ============================================================
-- Admin RLS Policies
-- ============================================================

-- Helper: check if the current user is admin
-- Used in all admin policies below.

-- matches: admin can insert, update, delete
create policy "matches_admin_insert"
  on public.matches for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "matches_admin_update"
  on public.matches for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "matches_admin_delete"
  on public.matches for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- profiles: admin can update any profile (for puntos, aciertos, role changes, etc.)
create policy "profiles_admin_update"
  on public.profiles for update
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- bets: admin can update any bet (for puntos_obtenidos after result)
create policy "bets_admin_update"
  on public.bets for update
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- bets: admin can delete bets (e.g. when deleting a match)
create policy "bets_admin_delete"
  on public.bets for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
