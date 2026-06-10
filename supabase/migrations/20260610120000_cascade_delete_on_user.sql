-- Cuando se borra un usuario de auth.users, se eliminan en cascada:
-- profiles → bets, club_ranking

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_auth_user_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.bets
  DROP CONSTRAINT bets_user_id_fkey;
ALTER TABLE public.bets
  ADD CONSTRAINT bets_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.club_ranking
  DROP CONSTRAINT club_ranking_user_id_fkey;
ALTER TABLE public.club_ranking
  ADD CONSTRAINT club_ranking_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
