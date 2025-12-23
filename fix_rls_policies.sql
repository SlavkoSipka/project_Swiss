-- =============================================
-- FIX RLS POLICIES - Omogući javni pristup
-- =============================================

-- 1. Omogući RLS na svim tabelama
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- 2. Drop stare policies ako postoje
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public model_details are viewable by everyone" ON public.model_details;
DROP POLICY IF EXISTS "Photos are viewable by everyone" ON public.photos;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Languages are viewable by everyone" ON public.languages;
DROP POLICY IF EXISTS "Availability is viewable by everyone" ON public.availability;

-- 3. Kreiraj nove policies - SVI mogu da čitaju
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Public model_details are viewable by everyone" 
  ON public.model_details FOR SELECT 
  USING (true);

CREATE POLICY "Photos are viewable by everyone" 
  ON public.photos FOR SELECT 
  USING (true);

CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Languages are viewable by everyone" 
  ON public.languages FOR SELECT 
  USING (true);

CREATE POLICY "Availability is viewable by everyone" 
  ON public.availability FOR SELECT 
  USING (true);

-- ✅ GOTOVO! Sada svi mogu da čitaju profile bez prijave

