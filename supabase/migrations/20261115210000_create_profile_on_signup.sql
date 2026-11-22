-- Crée le profil public.users dans la même transaction que le compte auth.users.
-- Si le pseudo est déjà pris, l'insertion du profil échoue et Supabase annule
-- toute l'inscription : il ne peut plus exister de compte sans profil.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, username)
  values (
    new.id,
    -- pseudo envoyé par le front via signUp({ options: { data: { username } } })
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      split_part(new.email, '@', 1) || '_' || left(new.id::text, 4)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Permet au formulaire d'inscription de vérifier si un pseudo est libre.
-- La RLS de users empêche de lire les profils des autres : cette fonction
-- répond seulement oui ou non, sans exposer aucune donnée.
create or replace function public.username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.users where lower(username) = lower(trim(p_username))
  );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- Le front n'insère plus lui-même dans users : la politique d'insertion devient inutile.
drop policy if exists "users_insert_own" on public.users;
