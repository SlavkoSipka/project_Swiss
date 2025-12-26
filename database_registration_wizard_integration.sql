-- =============================================
-- INTEGRACIJA REGISTRACIONOG WIZARD-A U BAZU
-- Dodavanje svih polja iz 9-step registration procesa
-- =============================================

-- =============================================
-- 1. PROŠIRENJE model_details TABELE
-- =============================================

-- Dodajemo sva polja iz Biography step-a
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS showname text,
ADD COLUMN IF NOT EXISTS slogan text,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('female', 'male', 'trans')),
ADD COLUMN IF NOT EXISTS nationality text,
ADD COLUMN IF NOT EXISTS dress_size text,
ADD COLUMN IF NOT EXISTS shoe_size text,
ADD COLUMN IF NOT EXISTS waist integer,
ADD COLUMN IF NOT EXISTS hip integer,
ADD COLUMN IF NOT EXISTS cup_size text,
ADD COLUMN IF NOT EXISTS pubic_hair text CHECK (pubic_hair IN ('shaved', 'trimmed', 'natural')),
ADD COLUMN IF NOT EXISTS smoking text CHECK (smoking IN ('yes', 'no', 'occasionally')),
ADD COLUMN IF NOT EXISTS drinking text CHECK (drinking IN ('yes', 'no', 'socially')),
ADD COLUMN IF NOT EXISTS special_characteristics text;

-- About Me step
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS description text; -- 25,000 chars max

-- Area/Address step
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS club_name text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS street_number text,
ADD COLUMN IF NOT EXISTS additional_info text,
ADD COLUMN IF NOT EXISTS display_address boolean DEFAULT false;

-- Services step
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS sexual_orientation text CHECK (sexual_orientation IN ('heterosexual', 'bisexual', 'lesbian', 'gay'));

-- Working Hours step
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS working_hours_type text CHECK (working_hours_type IN ('custom', 'same', '24/7')) DEFAULT '24/7',
ADD COLUMN IF NOT EXISTS custom_schedule jsonb, -- Za custom schedule po danima
ADD COLUMN IF NOT EXISTS show_as_night_escort boolean DEFAULT false;

-- Contact Details step - Booleanove
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS show_phone_number boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS viber boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS telegram boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS no_withheld_numbers boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS contact_instructions text CHECK (contact_instructions IN ('sms_and_call', 'sms_only', 'no_sms', 'other')),
ADD COLUMN IF NOT EXISTS skype_id text,
ADD COLUMN IF NOT EXISTS videogirls_url text,
ADD COLUMN IF NOT EXISTS website text;

-- Block Countries
ALTER TABLE public.model_details
ADD COLUMN IF NOT EXISTS block_countries text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS block_mode text CHECK (block_mode IN ('block', 'allow')) DEFAULT 'block';

-- =============================================
-- 2. TABELA ZA JEZIKE SA NIVOIMA
-- =============================================

CREATE TABLE IF NOT EXISTS public.model_languages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  language text NOT NULL,
  level text NOT NULL CHECK (level IN ('basic', 'intermediate', 'fluent', 'native')),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT model_languages_pkey PRIMARY KEY (id),
  CONSTRAINT model_languages_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT model_languages_unique UNIQUE (model_id, language)
);

CREATE INDEX IF NOT EXISTS idx_model_languages_model_id ON public.model_languages(model_id);

-- =============================================
-- 3. TABELA ZA SERVISE (94 servisa u 5 kategorija)
-- =============================================

-- Prvo kreiramo enum za kategorije servisa
DO $$ BEGIN
  CREATE TYPE service_category AS ENUM ('main', 'extra', 'fetish', 'virtual', 'massage');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tabela za servise
CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category service_category NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- Tabela za vezu model-servisi (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.model_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  service_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT model_services_pkey PRIMARY KEY (id),
  CONSTRAINT model_services_unique UNIQUE (model_id, service_id),
  CONSTRAINT model_services_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT model_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_model_services_model_id ON public.model_services(model_id);
CREATE INDEX IF NOT EXISTS idx_model_services_service_id ON public.model_services(service_id);

-- Tabela za "Services Offered For"
CREATE TABLE IF NOT EXISTS public.model_services_for (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  service_for text NOT NULL CHECK (service_for IN ('Men', 'Women', 'Couples', 'Trans', 'Gays', '2+')),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT model_services_for_pkey PRIMARY KEY (id),
  CONSTRAINT model_services_for_unique UNIQUE (model_id, service_for),
  CONSTRAINT model_services_for_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_model_services_for_model_id ON public.model_services_for(model_id);

-- =============================================
-- 4. TABELA ZA CENE (Rates)
-- =============================================

CREATE TABLE IF NOT EXISTS public.model_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  rate_type text NOT NULL CHECK (rate_type IN ('incall', 'outcall')),
  duration text NOT NULL, -- '15 minutes', '1 hour', '2 hours', 'Overnight', etc.
  price numeric NOT NULL,
  currency text DEFAULT 'CHF',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT model_rates_pkey PRIMARY KEY (id),
  CONSTRAINT model_rates_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_model_rates_model_id ON public.model_rates(model_id);
CREATE INDEX IF NOT EXISTS idx_model_rates_type ON public.model_rates(rate_type);

-- =============================================
-- 5. DODAVANJE SVIH 94 SERVIUSA U BAZU
-- =============================================

-- Main Services (17)
INSERT INTO public.services (name, category, display_order) VALUES
  ('69 Position', 'main', 1),
  ('Anal Sex', 'main', 2),
  ('Cum in Mouth', 'main', 3),
  ('Cum on Face', 'main', 4),
  ('Dildo Play/Toys', 'main', 5),
  ('Girlfriend Experience (GFE)', 'main', 6),
  ('Blowjob with Condom', 'main', 7),
  ('Blowjob without Condom', 'main', 8),
  ('Blowjob without Condom to Completion', 'main', 9),
  ('Cumshot on body (COB)', 'main', 10),
  ('Erotic massage', 'main', 11),
  ('Kissing if good chemistry', 'main', 12),
  ('Intimate massage', 'main', 13),
  ('Handjob', 'main', 14),
  ('French Kissing', 'main', 15),
  ('Kissing', 'main', 16),
  ('Sex in Different Positions', 'main', 17)
ON CONFLICT (name) DO NOTHING;

-- Extra Services (32)
INSERT INTO public.services (name, category, display_order) VALUES
  ('A-Level (Anal Sex)', 'extra', 1),
  ('Anal Finger', 'extra', 2),
  ('BDSM', 'extra', 3),
  ('Body to Body Massage', 'extra', 4),
  ('Couples', 'extra', 5),
  ('Deep Throat', 'extra', 6),
  ('Dirty Talk', 'extra', 7),
  ('Domination', 'extra', 8),
  ('Erotic Photos & Videos', 'extra', 9),
  ('Facesitting', 'extra', 10),
  ('Foot Fetish', 'extra', 11),
  ('Golden Shower (Give)', 'extra', 12),
  ('Golden Shower (Receive)', 'extra', 13),
  ('Lapdance', 'extra', 14),
  ('Lesbian Show', 'extra', 15),
  ('Lingam Massage', 'extra', 16),
  ('Mistress', 'extra', 17),
  ('Oral without Condom', 'extra', 18),
  ('Passionate Kissing', 'extra', 19),
  ('Photo & Video', 'extra', 20),
  ('Pornstar Experience (PSE)', 'extra', 21),
  ('Prostate Massage', 'extra', 22),
  ('Role Play', 'extra', 23),
  ('Sex Toys', 'extra', 24),
  ('Spanking', 'extra', 25),
  ('Squirting', 'extra', 26),
  ('Striptease', 'extra', 27),
  ('Submission', 'extra', 28),
  ('Swallow', 'extra', 29),
  ('Tantric Massage', 'extra', 30),
  ('Threesome', 'extra', 31),
  ('Uniforms', 'extra', 32)
ON CONFLICT (name) DO NOTHING;

-- Fetish / Bizarre Services (19)
INSERT INTO public.services (name, category, display_order) VALUES
  ('Age Play', 'fetish', 1),
  ('Ball Busting', 'fetish', 2),
  ('Bondage', 'fetish', 3),
  ('CBT', 'fetish', 4),
  ('Chastity', 'fetish', 5),
  ('Cross Dressing', 'fetish', 6),
  ('Face Slapping', 'fetish', 7),
  ('Feminization', 'fetish', 8),
  ('Financial Domination', 'fetish', 9),
  ('Foot Worship', 'fetish', 10),
  ('Humiliation', 'fetish', 11),
  ('Medical Play', 'fetish', 12),
  ('Pet Play', 'fetish', 13),
  ('Rimming (Giving)', 'fetish', 14),
  ('Rimming (Receiving)', 'fetish', 15),
  ('Strap-on', 'fetish', 16),
  ('Trampling', 'fetish', 17),
  ('Wax Play', 'fetish', 18),
  ('Worship', 'fetish', 19)
ON CONFLICT (name) DO NOTHING;

-- Virtual Services (16)
INSERT INTO public.services (name, category, display_order) VALUES
  ('Cam2Cam', 'virtual', 1),
  ('Phone Chat', 'virtual', 2),
  ('Sexting', 'virtual', 3),
  ('Video Call', 'virtual', 4),
  ('Virtual Girlfriend', 'virtual', 5),
  ('Custom Videos', 'virtual', 6),
  ('Dick Rating', 'virtual', 7),
  ('Feet Pics', 'virtual', 8),
  ('Live Shows', 'virtual', 9),
  ('Premium Snapchat', 'virtual', 10),
  ('Selling Panties', 'virtual', 11),
  ('Selling Photos', 'virtual', 12),
  ('Selling Videos', 'virtual', 13),
  ('Skype Shows', 'virtual', 14),
  ('WhatsApp Services', 'virtual', 15),
  ('OnlyFans', 'virtual', 16)
ON CONFLICT (name) DO NOTHING;

-- Massage Services (10)
INSERT INTO public.services (name, category, display_order) VALUES
  ('Classic Massage', 'massage', 1),
  ('Swedish Massage', 'massage', 2),
  ('Thai Massage', 'massage', 3),
  ('Hot Stone Massage', 'massage', 4),
  ('Aromatherapy', 'massage', 5),
  ('Sports Massage', 'massage', 6),
  ('Reflexology', 'massage', 7),
  ('Shiatsu', 'massage', 8),
  ('Nuru Massage', 'massage', 9),
  ('Body Scrub', 'massage', 10)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE public.model_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_services_for ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_rates ENABLE ROW LEVEL SECURITY;

-- Policies za model_languages
DROP POLICY IF EXISTS "Users can view all languages" ON public.model_languages;
CREATE POLICY "Users can view all languages"
  ON public.model_languages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Models can manage their own languages" ON public.model_languages;
CREATE POLICY "Models can manage their own languages"
  ON public.model_languages FOR ALL
  USING (auth.uid() = model_id);

-- Policies za model_services
DROP POLICY IF EXISTS "Users can view all services" ON public.model_services;
CREATE POLICY "Users can view all services"
  ON public.model_services FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Models can manage their own services" ON public.model_services;
CREATE POLICY "Models can manage their own services"
  ON public.model_services FOR ALL
  USING (auth.uid() = model_id);

-- Policies za model_services_for
DROP POLICY IF EXISTS "Users can view all services_for" ON public.model_services_for;
CREATE POLICY "Users can view all services_for"
  ON public.model_services_for FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Models can manage their own services_for" ON public.model_services_for;
CREATE POLICY "Models can manage their own services_for"
  ON public.model_services_for FOR ALL
  USING (auth.uid() = model_id);

-- Policies za model_rates
DROP POLICY IF EXISTS "Users can view all rates" ON public.model_rates;
CREATE POLICY "Users can view all rates"
  ON public.model_rates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Models can manage their own rates" ON public.model_rates;
CREATE POLICY "Models can manage their own rates"
  ON public.model_rates FOR ALL
  USING (auth.uid() = model_id);

-- =============================================
-- 7. COMMENTS ZA DOKUMENTACIJU
-- =============================================

COMMENT ON TABLE public.model_languages IS 'Jezici koje model govori sa nivoima (basic, intermediate, fluent, native)';
COMMENT ON TABLE public.services IS 'Svi dostupni servisi (94 servisa u 5 kategorija)';
COMMENT ON TABLE public.model_services IS 'Veza između modela i servisa koje nudi';
COMMENT ON TABLE public.model_services_for IS 'Za koga model nudi servise (Men, Women, Couples, Trans, Gays, 2+)';
COMMENT ON TABLE public.model_rates IS 'Cene za incall i outcall sa različitim trajanjem';

COMMENT ON COLUMN public.model_details.showname IS 'Ime koje se prikazuje na profilu';
COMMENT ON COLUMN public.model_details.slogan IS 'Slogan ili ključna reč koja opisuje modela';
COMMENT ON COLUMN public.model_details.description IS 'Opis modela (max 25,000 karaktera)';
COMMENT ON COLUMN public.model_details.working_hours_type IS 'Tip radnog vremena: custom, same, 24/7';
COMMENT ON COLUMN public.model_details.custom_schedule IS 'JSON sa custom rasporedom po danima';
COMMENT ON COLUMN public.model_details.show_as_night_escort IS 'Prikaži kao Night Escort (posle 22h)';
COMMENT ON COLUMN public.model_details.block_countries IS 'Lista zemalja koje treba blokirati ili dozvoliti';
COMMENT ON COLUMN public.model_details.block_mode IS 'block = blokiraj ove zemlje, allow = dozvoli samo ove zemlje';

-- =============================================
-- 8. INDEXI ZA PERFORMANSE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_model_details_showname ON public.model_details(showname);
CREATE INDEX IF NOT EXISTS idx_model_details_gender ON public.model_details(gender);
CREATE INDEX IF NOT EXISTS idx_model_details_working_hours_type ON public.model_details(working_hours_type);
CREATE INDEX IF NOT EXISTS idx_model_details_show_as_night_escort ON public.model_details(show_as_night_escort);

-- =============================================
-- 9. VIEW ZA LAKŠE PRETRAŽIVANJE
-- =============================================

CREATE OR REPLACE VIEW public.model_profile_complete AS
SELECT 
  p.id,
  p.username,
  p.email,
  p.role,
  p.profile_status,
  p.is_verified,
  md.showname,
  md.slogan,
  md.location_city,
  md.location_country,
  md.postal_code,
  md.address,
  md.phone_number,
  md.bio,
  md.height,
  md.weight,
  md.age,
  md.bust_size,
  md.hair_color,
  md.eye_color,
  md.ethnicity,
  md.body_type,
  md.services,
  md.price_per_hour,
  md.price_per_night,
  md.accepts_couples,
  md.accepts_outcall,
  md.accepts_incall,
  md.speaks_languages,
  md.working_hours,
  md.gender,
  md.nationality,
  md.dress_size,
  md.shoe_size,
  md.waist,
  md.hip,
  md.cup_size,
  md.pubic_hair,
  md.smoking,
  md.drinking,
  md.special_characteristics,
  md.description,
  md.club_name,
  md.street,
  md.street_number,
  md.additional_info,
  md.display_address,
  md.sexual_orientation,
  md.working_hours_type,
  md.custom_schedule,
  md.show_as_night_escort,
  md.show_phone_number,
  md.viber,
  md.whatsapp,
  md.telegram,
  md.no_withheld_numbers,
  md.contact_instructions,
  md.skype_id,
  md.videogirls_url,
  md.website,
  md.block_countries,
  md.block_mode,
  md.created_at as model_details_created_at,
  md.updated_at as model_details_updated_at,
  array_agg(DISTINCT ml.language) FILTER (WHERE ml.language IS NOT NULL) as languages,
  array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as services_list,
  array_agg(DISTINCT msf.service_for) FILTER (WHERE msf.service_for IS NOT NULL) as services_for
FROM public.profiles p
LEFT JOIN public.model_details md ON p.id = md.id
LEFT JOIN public.model_languages ml ON p.id = ml.model_id
LEFT JOIN public.model_services ms ON p.id = ms.model_id
LEFT JOIN public.services s ON ms.service_id = s.id
LEFT JOIN public.model_services_for msf ON p.id = msf.model_id
WHERE p.role = 'model'
GROUP BY 
  p.id, p.username, p.email, p.role, p.profile_status, p.is_verified,
  md.showname, md.slogan, md.location_city, md.location_country, md.postal_code,
  md.address, md.phone_number, md.bio, md.height, md.weight, md.age, md.bust_size,
  md.hair_color, md.eye_color, md.ethnicity, md.body_type, md.services, md.price_per_hour,
  md.price_per_night, md.accepts_couples, md.accepts_outcall, md.accepts_incall,
  md.speaks_languages, md.working_hours, md.gender, md.nationality, md.dress_size,
  md.shoe_size, md.waist, md.hip, md.cup_size, md.pubic_hair, md.smoking, md.drinking,
  md.special_characteristics, md.description, md.club_name, md.street, md.street_number,
  md.additional_info, md.display_address, md.sexual_orientation, md.working_hours_type,
  md.custom_schedule, md.show_as_night_escort, md.show_phone_number, md.viber,
  md.whatsapp, md.telegram, md.no_withheld_numbers, md.contact_instructions, md.skype_id,
  md.videogirls_url, md.website, md.block_countries, md.block_mode, md.created_at, md.updated_at;

-- =============================================
-- KRAJ SKRIPTE
-- =============================================

