-- OneMapTech: bootstrap admin
--
-- Login memakai Sales ID numerik. Supabase Auth (GoTrue) hanya menerima
-- email/phone sebagai identifier, jadi Sales ID dipetakan ke email sintetis:
--   Sales ID 22008205  ->  22008205@onemaptech.id
--
-- STEP 1: Buat user di Supabase Dashboard > Authentication > Users > Add user
--         Email    : 22008205@onemaptech.id   (ganti dengan Sales ID admin)
--         Password : Powergate27              (ganti sesuai kebutuhan)
--         Centang  : Auto Confirm User
--         Lalu Settings > Authentication: matikan "Enable email confirmations"
--         (email sintetis tidak menerima surat).
--
-- STEP 2: Promosikan user tersebut menjadi admin dengan menjalankan snippet ini.
--         Trigger on_auth_user_created sudah membuat profil 'viewer' + sales_id,
--         jadi cukup update role-nya.

update public.profiles
set role = 'admin'
where sales_id = '22008205';   -- ganti dengan Sales ID admin

-- Reset / ubah password (self-service email tidak tersedia untuk email sintetis):
--   Dashboard > Authentication > Users > pilih user > Reset Password.
--
-- Verifikasi:
-- select id, sales_id, email, full_name, role from public.profiles;
