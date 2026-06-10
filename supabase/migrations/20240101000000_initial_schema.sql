-- ============================================================
-- Quiniela WWE Los Machos — Schema inicial
-- ============================================================

-- clubs
create table public.clubs (
  id        serial primary key,
  nombre    text   not null unique,
  pais      text   not null,
  logo_url  text   not null
);

-- profiles (vinculado a auth.users)
create table public.profiles (
  id               uuid         not null default auth.uid(),
  username         text         not null unique,
  email            text         not null unique,
  role             text         not null default 'user',
  created_at       timestamptz  not null default now(),
  puntos           int          default 0,
  aciertos         int          default 0,
  total_apostados  int          default 0,
  precision        numeric(5,2) generated always as (
    case
      when total_apostados > 0
        then round((aciertos::numeric / total_apostados::numeric) * 100::numeric, 2)
      else 0::numeric
    end
  ) stored,
  racha            int          default 0,
  constraint profiles_pkey primary key (id)
);

-- matches
create table public.matches (
  id          serial       primary key,
  club_a_id   int          not null references public.clubs(id),
  club_b_id   int          not null references public.clubs(id),
  fecha       timestamptz  not null,
  estadio     text         not null,
  resultado_a int,
  resultado_b int,
  created_at  timestamptz  not null default now()
);

-- bets
create table public.bets (
  id               serial       primary key,
  user_id          uuid         not null references public.profiles(id),
  match_id         int          not null references public.matches(id),
  prediccion_a     int          not null,
  prediccion_b     int          not null,
  created_at       timestamptz  not null default now(),
  puntos_obtenidos int          default 0,
  updated_at       timestamptz  default now(),
  constraint bets_user_match_unique unique (user_id, match_id)
);

-- club_ranking
create table public.club_ranking (
  user_id       uuid         not null references public.profiles(id),
  puntaje_total int          not null default 0,
  updated_at    timestamptz  not null default now(),
  pj            int          default 0,
  g             int          default 0,
  e             int          default 0,
  p             int          default 0,
  gf            int          default 0,
  gc            int          default 0,
  dg            int          generated always as (coalesce(gf, 0) - coalesce(gc, 0)) stored,
  pts           int          default 0,
  forma         text[]       default '{}',
  constraint ranking_pkey primary key (user_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.clubs        enable row level security;
alter table public.matches      enable row level security;
alter table public.bets         enable row level security;
alter table public.club_ranking enable row level security;

-- profiles
create policy "profiles_select_all"   on public.profiles for select using (true);
create policy "profiles_insert_own"   on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"   on public.profiles for update using (auth.uid() = id);

-- clubs (solo lectura pública)
create policy "clubs_select_all"      on public.clubs for select using (true);

-- matches (solo lectura pública)
create policy "matches_select_all"    on public.matches for select using (true);

-- bets
create policy "bets_select_all"       on public.bets for select using (true);
create policy "bets_insert_own"       on public.bets for insert with check (auth.uid() = user_id);
create policy "bets_update_own"       on public.bets for update using (auth.uid() = user_id);

-- club_ranking (solo lectura pública)
create policy "ranking_select_all"    on public.club_ranking for select using (true);

-- ============================================================
-- Trigger: auto-crear perfil al registrarse
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );

  insert into public.club_ranking (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
