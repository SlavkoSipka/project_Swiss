-- =============================================
-- FIX: Dodavanje RLS politike za INSERT na profiles tabelu
-- =============================================
-- Problem: Nedostaje INSERT politika za profiles tabelu
-- Rezultat: "new row violates row-level security policy" greška pri registraciji
-- =============================================

-- Dodaj INSERT politiku za profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- PROVERA
-- =============================================
-- Proverite da li sada možete da kreirate profil:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- Trebalo bi da vidite 3 politike:
-- 1. "Profiles are viewable by everyone" (SELECT)
-- 2. "Users can insert own profile" (INSERT)
-- 3. "Users can update own profile" (UPDATE)

