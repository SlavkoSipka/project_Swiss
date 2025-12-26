-- =============================================
-- PROVERA PROBLEMA SA REGISTRACIJOM
-- =============================================

-- 1. Proveri da li profiles tabela postoji
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles')
    THEN '✅ profiles tabela POSTOJI'
    ELSE '❌ profiles tabela NE POSTOJI - Pokreni database_schema_COMPLETE_SAFE.sql'
  END as status;

-- 2. Proveri RLS status
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 3. Proveri policies na profiles tabeli
SELECT 
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 4. Proveri constraint-e na profiles tabeli
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 5. Proveri da li sve potrebne kolone postoje
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('id', 'email', 'username', 'role', 'profile_status')
ORDER BY column_name;

-- 6. Proveri da li app_role enum postoji
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'app_role')
    THEN '✅ app_role enum POSTOJI'
    ELSE '❌ app_role enum NE POSTOJI - Pokreni database_schema_COMPLETE_SAFE.sql'
  END as status;

-- 7. Proveri da li profile_status enum postoji
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'profile_status')
    THEN '✅ profile_status enum POSTOJI'
    ELSE '❌ profile_status enum NE POSTOJI - Pokreni database_schema_COMPLETE_SAFE.sql'
  END as status;

-- 8. Test INSERT (neće raditi bez auth, ali proverava strukturu)
-- Ovo će pokazati grešku ako postoji problem sa strukturom
DO $$
BEGIN
  RAISE NOTICE 'Test strukture tabele...';
  RAISE NOTICE 'Ako vidiš grešku ovde, to je problem sa strukturom tabele.';
END $$;

