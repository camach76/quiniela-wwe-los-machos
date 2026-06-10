-- ============================================================
-- Seed: Usuarios de prueba
-- Ejecutar en el SQL Editor del dashboard de Supabase
-- (requiere permisos de service_role, disponibles en el editor)
-- ============================================================

DO $$
DECLARE
  test_uid  uuid := '00000000-0000-0000-0000-000000000001';
  admin_uid uuid := '00000000-0000-0000-0000-000000000002';
BEGIN
  -- Usuario de prueba: test@test.com / test123
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, role, aud,
    confirmation_token, recovery_token,
    email_change_token_new, email_change_token_current,
    email_change, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    test_uid,
    '00000000-0000-0000-0000-000000000000',
    'test@test.com',
    crypt('test123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"test"}',
    'authenticated', 'authenticated',
    '', '', '', '', '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  -- Usuario admin: admin@admin.com / admin123
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, role, aud,
    confirmation_token, recovery_token,
    email_change_token_new, email_change_token_current,
    email_change, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    admin_uid,
    '00000000-0000-0000-0000-000000000000',
    'admin@admin.com',
    crypt('admin123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"admin"}',
    'authenticated', 'authenticated',
    '', '', '', '', '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  -- auth.identities es requerido para signInWithPassword — sin esto el login falla
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES
    (
      gen_random_uuid(), test_uid,
      jsonb_build_object('sub', test_uid::text, 'email', 'test@test.com', 'email_verified', true, 'phone_verified', false),
      'email', test_uid::text, now(), now(), now()
    ),
    (
      gen_random_uuid(), admin_uid,
      jsonb_build_object('sub', admin_uid::text, 'email', 'admin@admin.com', 'email_verified', true, 'phone_verified', false),
      'email', admin_uid::text, now(), now(), now()
    )
  ON CONFLICT (provider, provider_id) DO NOTHING;

  -- El trigger on_auth_user_created crea los profiles automáticamente.
  -- Solo necesitamos setear el role admin:
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = admin_uid;

END;
$$;
