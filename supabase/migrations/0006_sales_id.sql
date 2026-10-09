-- OneMapTech: Sales ID login support
-- Adds a numeric sales_id column to profiles and derives it automatically
-- from the synthetic auth email prefix (e.g. 22008205@onemaptech.id).

alter table public.profiles
  add column if not exists sales_id text unique;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, sales_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'viewer'),
    case
      when new.email ~ '^[0-9]+@' then split_part(new.email, '@', 1)
      else null
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Backfill sales_id for any existing users with synthetic numeric emails.
update public.profiles
set sales_id = split_part(email, '@', 1)
where sales_id is null
  and email ~ '^[0-9]+@';
