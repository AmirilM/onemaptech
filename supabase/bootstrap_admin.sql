-- OneMapTech: bootstrap admin
-- STEP 1: create the user first via Supabase Dashboard > Authentication > Users > Add user
--         (set an email + password, check "Auto Confirm User").
-- STEP 2: replace the email below, then run this snippet.
--         The on_auth_user_created trigger already inserted a 'viewer' profile,
--         so we just promote it to 'admin'.

update public.profiles
set role = 'admin'
where email = 'ganti-dengan-email-admin@onemaptech.id';

-- Verify:
-- select id, email, role from public.profiles;
