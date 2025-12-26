-- =============================================
-- FIX REGISTRATION ISSUE
-- Proverava i popravlja sve što može blokirati registraciju
-- =============================================

-- 1. Proveri da li profiles tabela postoji
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    RAISE EXCEPTION 'Table profiles does not exist! Please run database_schema_COMPLETE_SAFE.sql first.';
  END IF;
END $$;

-- 2. Proveri da li RLS je enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Obriši sve postojeće policies i kreiraj nove
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- 4. Kreiraj policies koje dozvoljavaju registraciju
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Proveri da li postoje constraint-i koji mogu blokirati
-- Ako email mora biti unique, to je OK
-- Ako username mora biti unique, to je OK

-- 6. Proveri da li postoji neki trigger koji blokira
-- (Ne možemo kreirati trigger na auth.users, ali možda postoji neki drugi)

-- 7. Test query - proveri da li možemo da insert-ujemo
-- (Ovo neće raditi ako nismo autentifikovani, ali je dobar test strukture)
DO $$
BEGIN
  -- Proveri da li sve kolone postoje
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'Column id does not exist in profiles table!';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    RAISE EXCEPTION 'Column email does not exist in profiles table!';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    RAISE EXCEPTION 'Column role does not exist in profiles table!';
  END IF;
  
  RAISE NOTICE 'All required columns exist in profiles table.';
END $$;

-- 8. Proveri da li app_role enum postoji
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    RAISE EXCEPTION 'app_role enum does not exist! Please run database_schema_COMPLETE_SAFE.sql first.';
  END IF;
END $$;

-- 9. Proveri da li profile_status enum postoji
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_status') THEN
    RAISE EXCEPTION 'profile_status enum does not exist! Please run database_schema_COMPLETE_SAFE.sql first.';
  END IF;
END $$;

-- 10. Finalna provera - da li sve radi
DO $$
BEGIN
  RAISE NOTICE 'Registration fix script completed successfully!';
  RAISE NOTICE 'Make sure email confirmation is disabled in Supabase Dashboard:';
  RAISE NOTICE 'Authentication > Settings > Email Auth > Confirm email: OFF';
END $$;

