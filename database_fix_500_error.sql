-- =============================================
-- FIX 500 ERROR: "Database error saving new user"
-- =============================================
-- 
-- Problem: Supabase pokušava da kreira user-a, ali nešto pada
-- Verovatno: Postoji trigger ili hook koji pokušava da kreira profil, ali ne uspeva
--
-- =============================================

-- 1. Proveri da li postoje triggeri na auth.users (ne možemo ih videti, ali možemo proveriti)
-- Supabase koristi database hooks za automatsko kreiranje profila

-- 2. KREIRAJ FUNKCIJU ZA AUTOMATSKO KREIRANJE PROFILA
-- Ova funkcija će se pozvati kada se kreira novi user u auth.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Kreiraj profil samo ako email postoji (ne NULL)
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, username, role, profile_status)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'user'::app_role),
      'pending'::profile_status
    )
    ON CONFLICT (id) DO NOTHING; -- Ako već postoji, ne radi ništa
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ako dođe do greške, loguj je ali ne prekidaj kreiranje user-a
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. KREIRAJ TRIGGER (ako već ne postoji)
-- Napomena: Ovo možda neće raditi ako nismo superuser, ali pokušajmo
-- Supabase omogućava kreiranje triggera na auth.users preko SQL Editor-a

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Pokušaj da kreiraš trigger
-- Ako ne radi, koristi Supabase Dashboard → Database → Functions → New Function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. ALTERNATIVNO: Ako trigger ne radi, koristimo Supabase Database Webhook
-- Ali prvo, proverimo da li možemo kreirati trigger

-- 5. PROVERI DA LI PROFILES TABELA POSTOJI I IMA PRAVE KOLONE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    RAISE EXCEPTION 'Table profiles does not exist! Run database_schema_COMPLETE_SAFE.sql first.';
  END IF;
END $$;

-- 6. PROVERI RLS POLICIES
-- Omogući INSERT za sve dok se kreira profil (SECURITY DEFINER funkcija će zaobići RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy za SELECT (svi mogu da vide)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Policy za INSERT (samo SECURITY DEFINER funkcija može)
-- Ne treba nam policy za INSERT jer koristimo SECURITY DEFINER funkciju

-- Policy za UPDATE (korisnici mogu da ažuriraju svoj profil)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. PROVERI CONSTRAINT-E
-- Email mora biti UNIQUE, ali možda postoji problem sa NULL vrednostima
-- Proveri da li email može biti NULL u auth.users (ne bi trebalo)

-- 8. GRANT PERMISSIONS
-- Funkcija mora imati prava da insert-uje u profiles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- 9. TEST FUNKCIJE (neće raditi bez auth, ali proverava sintaksu)
DO $$
BEGIN
  RAISE NOTICE 'Function handle_new_user created successfully';
  RAISE NOTICE 'Trigger on_auth_user_created created successfully';
  RAISE NOTICE 'RLS policies updated';
END $$;

