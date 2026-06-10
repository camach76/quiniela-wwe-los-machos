alter table public.profiles
add column if not exists company text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_company_check'
  ) then
    alter table public.profiles
    add constraint profiles_company_check
    check (
      company is null
      or company = any (array['Consult-Us', 'Lignum', 'IGST', 'Zigi'])
    );
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, company)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'company'
  );

  insert into public.club_ranking (user_id)
  values (new.id);

  return new;
end;
$$;
