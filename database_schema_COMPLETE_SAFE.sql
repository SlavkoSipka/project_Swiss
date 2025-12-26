-- =============================================
-- KOMPLETNA BAZA PODATAKA ZA NICEMODELS.CH
-- SAFE VERSION - Koristi DROP IF EXISTS i CREATE IF NOT EXISTS
-- =============================================

-- =============================================
-- BRISANJE POSTOJEĆIH OBJEKATA (OPREZNO!)
-- =============================================

-- Prvo obrišemo views (jer zavise od tabela)
DROP VIEW IF EXISTS active_banners_by_region CASCADE;
DROP VIEW IF EXISTS active_stories CASCADE;
DROP VIEW IF EXISTS top_models_by_views CASCADE;

-- Obrišemo triggers
DROP TRIGGER IF EXISTS trigger_check_favorites_limit ON public.favorites;
DROP TRIGGER IF EXISTS trigger_check_video_limit ON public.videos;
DROP TRIGGER IF EXISTS trigger_check_photo_limit ON public.photos;
DROP TRIGGER IF EXISTS trigger_auto_assign_region ON public.model_details;

-- Obrišemo functions
DROP FUNCTION IF EXISTS check_favorites_limit() CASCADE;
DROP FUNCTION IF EXISTS check_video_limit() CASCADE;
DROP FUNCTION IF EXISTS check_photo_limit() CASCADE;
DROP FUNCTION IF EXISTS delete_expired_stories() CASCADE;
DROP FUNCTION IF EXISTS auto_assign_region() CASCADE;

-- Obrišemo tabele u ispravnom redoslijedu (zbog foreign keys)
DROP TABLE IF EXISTS public.admin_actions CASCADE;
DROP TABLE IF EXISTS public.verification_requests CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.click_tracking CASCADE;
DROP TABLE IF EXISTS public.search_logs CASCADE;
DROP TABLE IF EXISTS public.profile_views CASCADE;
DROP TABLE IF EXISTS public.availability CASCADE;
DROP TABLE IF EXISTS public.languages CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.rentals CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.city_tours CASCADE;
DROP TABLE IF EXISTS public.model_categories CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.gift_cards CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.story_views CASCADE;
DROP TABLE IF EXISTS public.status_updates CASCADE;
DROP TABLE IF EXISTS public.stories CASCADE;
DROP TABLE IF EXISTS public.networking_credits CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.banner_clicks CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.banner_placements CASCADE;
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.shop_products CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.pricing_plans CASCADE;
DROP TABLE IF EXISTS public.model_regions CASCADE;
DROP TABLE IF EXISTS public.regions CASCADE;
DROP TABLE IF EXISTS public.company_details CASCADE;
DROP TABLE IF EXISTS public.model_details CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Obrišemo enum tipove
DROP TYPE IF EXISTS banner_position CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS subscription_type CASCADE;
DROP TYPE IF EXISTS profile_status CASCADE;
DROP TYPE IF EXISTS app_role CASCADE;

-- =============================================
-- ENUM TIPOVI
-- =============================================

CREATE TYPE app_role AS ENUM ('user', 'model', 'company', 'admin');
CREATE TYPE profile_status AS ENUM ('pending', 'active', 'suspended', 'deleted');
CREATE TYPE subscription_type AS ENUM ('free_offline', 'basic_online', 'premium', 'company_basic', 'company_premium');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE banner_position AS ENUM ('top', 'sidebar_left', 'sidebar_right', 'middle', 'bottom', 'popup');

-- =============================================
-- OSNOVNE TABELE
-- =============================================

-- 1. PROFILI (Prošireno sa svim potrebnim poljima iz PDF-a)
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE,
  full_name text,
  email text NOT NULL UNIQUE, -- Email se ne može mijenjati (PDF zahtjev)
  avatar_url text,
  role app_role DEFAULT 'user',
  profile_status profile_status DEFAULT 'pending',
  is_verified boolean DEFAULT false, -- Za plaćenu verifikaciju
  is_verified_photos boolean DEFAULT false, -- 100% verified pictures
  customer_number text UNIQUE, -- Broj kupca iz PDF-a
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. DETALJI MODELA (Prošireno)
CREATE TABLE public.model_details (
  id uuid NOT NULL,
  location_city text,
  location_country text,
  postal_code text, -- Za automatsko određivanje regije (PDF zahtjev)
  address text, -- Može se neovisno mijenjati (PDF)
  phone_number text, -- Može se neovisno mijenjati (PDF)
  bio text, -- Kratak opis iz PDF-a
  height integer,
  weight integer,
  age integer,
  bust_size text,
  hair_color text,
  eye_color text,
  ethnicity text,
  body_type text,
  services text[], -- Polja za potvrdu za ponude usluga (PDF)
  price_per_hour numeric,
  price_per_night numeric,
  accepts_couples boolean DEFAULT false,
  accepts_outcall boolean DEFAULT false,
  accepts_incall boolean DEFAULT true,
  speaks_languages text[],
  working_hours text,
  
  -- Limiti iz PDF-a
  max_photos integer DEFAULT 20, -- Najviše 20 fotografija (modeli)
  max_videos integer DEFAULT 3,  -- Najviše 3 videa (modeli)
  max_regions integer DEFAULT 1, -- Samo jedno područje besplatno
  
  -- Timings
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT model_details_pkey PRIMARY KEY (id),
  CONSTRAINT model_details_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 3. DETALJI TVRTKE/KOMPANIJE (PDF zahtjev)
CREATE TABLE public.company_details (
  id uuid NOT NULL,
  company_name text NOT NULL,
  company_type text CHECK (company_type IN ('club', 'agency', 'studio', 'other')),
  location_city text,
  location_country text,
  postal_code text,
  address text,
  phone_number text,
  website_url text,
  description text,
  
  -- Limiti iz PDF-a za tvrtke
  max_photos integer DEFAULT 10, -- Tvrtke imaju 10 fotografija (PDF)
  max_videos integer DEFAULT 0,  -- Bez videa za tvrtke
  max_regions integer DEFAULT 1, -- Jedno područje, svako dodatno uz naplatu
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT company_details_pkey PRIMARY KEY (id),
  CONSTRAINT company_details_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- REGIJE I LOKACIJE (PDF zahtjev)
-- =============================================

-- 4. REGIJE
CREATE TABLE public.regions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, -- Zurich, Basel, Bern, etc.
  country_code text NOT NULL DEFAULT 'CH',
  postal_codes text[], -- Array poštanskih brojeva za automatsko određivanje
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT regions_pkey PRIMARY KEY (id)
);

-- 5. MODEL-REGIJE (Many-to-Many sa plaćanjem)
CREATE TABLE public.model_regions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  region_id uuid NOT NULL,
  is_primary boolean DEFAULT false, -- Prva regija je besplatna
  is_paid boolean DEFAULT false, -- Druga i ostale regije uz naplatu
  valid_until timestamp with time zone, -- Kada ističe plaćena regija
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT model_regions_pkey PRIMARY KEY (id),
  CONSTRAINT model_regions_unique UNIQUE (model_id, region_id),
  CONSTRAINT model_regions_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT model_regions_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id) ON DELETE CASCADE
);

-- =============================================
-- SUBSCRIPTION SISTEM (PDF - Trajanje comp kartice)
-- =============================================

-- 6. PRICING PLANS (Trgovina sa ~30 ponuda)
CREATE TABLE public.pricing_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  plan_type subscription_type NOT NULL,
  price numeric NOT NULL,
  duration_days integer NOT NULL, -- Trajanje u danima
  
  -- Šta plan uključuje
  max_photos integer,
  max_videos integer,
  max_regions integer,
  includes_verification boolean DEFAULT false,
  includes_top_rotation boolean DEFAULT false, -- Rotacija na vrh (PDF - 10x dnevno)
  includes_status_updates boolean DEFAULT false, -- 24h status updates
  includes_networking integer DEFAULT 0, -- Broj besplatnih networking zahtjeva
  
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT pricing_plans_pkey PRIMARY KEY (id)
);

-- 7. SUBSCRIPTIONS (Aktivne pretplate)
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL, -- Model ili tvrtka
  plan_id uuid NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  
  -- Važnost pretplate
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  valid_until timestamp with time zone NOT NULL,
  
  -- Nakon uplate, comp kartica odmah online (PDF zahtjev)
  is_active boolean DEFAULT true,
  auto_renew boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.pricing_plans(id)
);

-- =============================================
-- SHOP I PLAĆANJA (PDF - Integrirano trgovina)
-- =============================================

-- 8. SHOP PROIZVODI (Trgovina proizvodi)
CREATE TABLE public.shop_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_type text NOT NULL CHECK (product_type IN (
    'comp_card', 
    'banner', 
    'verification', 
    'additional_region', 
    'additional_photos', 
    'top_rotation',
    'networking_credits',
    'gift_card'
  )),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration_days integer, -- Za pretplate
  quantity_included integer, -- Za dodatke (npr. +10 fotografija)
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT shop_products_pkey PRIMARY KEY (id)
);

-- 9. NARUDŽBE/KUPNJE (Kupnja u max 3 koraka - PDF)
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  order_number text UNIQUE NOT NULL, -- Jedinstveni broj narudžbe
  
  -- Proizvodi u narudžbi
  items jsonb NOT NULL, -- Array proizvoda sa cijenama
  
  -- Cijene
  subtotal numeric NOT NULL,
  tax numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  
  -- Status
  order_status text DEFAULT 'pending' CHECK (order_status IN (
    'pending', 'processing', 'completed', 'failed', 'refunded'
  )),
  
  -- Plaćanje
  payment_method text, -- 'credit_card', 'paypal', 'twint', 'postfinance'
  payment_status payment_status DEFAULT 'pending',
  paid_at timestamp with time zone,
  
  -- Terms acceptance (PDF zahtjev - 2 potvrda)
  terms_accepted boolean DEFAULT false,
  purchase_confirmation boolean DEFAULT false, -- Drugi potvrdni okvir
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.profiles(id)
);

-- 10. PAYMENT TRANSACTIONS (Detalji plaćanja)
CREATE TABLE public.payment_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  payment_provider text NOT NULL, -- stripe, paypal, twint, postfinance
  transaction_id text UNIQUE, -- ID od payment providera
  amount numeric NOT NULL,
  currency text DEFAULT 'CHF',
  status payment_status DEFAULT 'pending',
  
  -- Metapodaci
  payment_method_details jsonb,
  error_message text,
  
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  
  CONSTRAINT payment_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT payment_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);

-- =============================================
-- BANNER SISTEM (PDF - Baneri)
-- =============================================

-- 11. BANNER PLACEMENTS (Mjesta za banere)
CREATE TABLE public.banner_placements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL, -- 'Top Homepage', 'Sidebar', etc.
  position banner_position NOT NULL,
  max_banners integer DEFAULT 3, -- Max 3 različita banera po mjestu (PDF)
  dimensions text, -- '728x90', '300x250', etc. (max 3 dimenzije - PDF)
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  
  CONSTRAINT banner_placements_pkey PRIMARY KEY (id)
);

-- 12. BANNERS (Oglasni baneri)
CREATE TABLE public.banners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL, -- Samo tvrtke mogu imati banere (PDF)
  placement_id uuid NOT NULL,
  
  -- Banner podaci
  banner_url text NOT NULL, -- Slika banera
  link_url text, -- Gdje vodi klik
  alt_text text,
  
  -- Regije (Standardno 3 regije, sve regije uz različitu cijenu - PDF)
  regions uuid[], -- Array region ID-ova
  
  -- Aktivnost
  is_active boolean DEFAULT true,
  starts_at timestamp with time zone NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  
  -- Rotation (Rotirajući, naizmjenično na vrhu - PDF)
  rotation_order integer DEFAULT 0,
  last_rotated_at timestamp with time zone,
  
  -- Statistika
  impressions_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT banners_pkey PRIMARY KEY (id),
  CONSTRAINT banners_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT banners_placement_id_fkey FOREIGN KEY (placement_id) REFERENCES public.banner_placements(id)
);

-- 13. BANNER CLICKS (Tracking klikova)
CREATE TABLE public.banner_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  banner_id uuid NOT NULL,
  clicked_by uuid, -- Može biti null za anonimne
  ip_address text,
  user_agent text,
  clicked_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT banner_clicks_pkey PRIMARY KEY (id),
  CONSTRAINT banner_clicks_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.banners(id) ON DELETE CASCADE
);

-- =============================================
-- NETWORKING SISTEM (PDF - Umrežavanje)
-- =============================================

-- 14. CONNECTIONS/NETWORKING (Umrežavanje modela i tvrtki)
CREATE TABLE public.connections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL, -- Onaj koji šalje zahtjev
  receiver_id uuid NOT NULL, -- Onaj koji prima zahtjev
  connection_type text NOT NULL CHECK (connection_type IN (
    'model_to_model',    -- Model-model jednom besplatno (PDF)
    'company_to_model'   -- Pet besplatnih zahtjeva tvrtki (PDF)
  )),
  
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'rejected', 'cancelled'
  )),
  
  -- Plaćanje (PDF - svaka dodatna veza uz naplatu, plaća model koji traži)
  is_paid boolean DEFAULT false,
  paid_amount numeric,
  
  -- Svaki model može u bilo kojem trenutku prekinuti umrežavanje (PDF)
  can_disconnect boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  
  CONSTRAINT connections_pkey PRIMARY KEY (id),
  CONSTRAINT connections_unique UNIQUE (requester_id, receiver_id),
  CONSTRAINT connections_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT connections_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 15. NETWORKING CREDITS (Praćenje besplatnih zahtjeva)
CREATE TABLE public.networking_credits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  
  -- Za modele
  model_to_model_free_used integer DEFAULT 0, -- Jednom besplatno
  model_to_model_total_paid integer DEFAULT 0,
  
  -- Za tvrtke  
  company_to_model_free_used integer DEFAULT 0, -- Pet besplatno
  company_to_model_total_paid integer DEFAULT 0,
  
  -- Kupljeni krediti
  purchased_credits integer DEFAULT 0,
  
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT networking_credits_pkey PRIMARY KEY (id),
  CONSTRAINT networking_credits_unique UNIQUE (profile_id),
  CONSTRAINT networking_credits_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- STORIES I STATUS UPDATES (PDF - Ažuriranja na 24h)
-- =============================================

-- 16. STORIES (24-satne priče kao Instagram)
CREATE TABLE public.stories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
  media_url text NOT NULL,
  thumbnail_url text,
  caption text,
  
  -- Bez tvrtki (PDF - samo modeli)
  -- 24-satno trajanje
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  
  -- Direktan prelaz na comp karticu (PDF)
  views_count integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT stories_pkey PRIMARY KEY (id),
  CONSTRAINT stories_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 17. STATUS UPDATES (Tekstualni statusni update)
CREATE TABLE public.status_updates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  message_text text NOT NULL,
  active_until timestamp with time zone NOT NULL, -- Aktivno na određeno vrijeme
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT status_updates_pkey PRIMARY KEY (id),
  CONSTRAINT status_updates_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 18. STORY VIEWS (Praćenje pregleda)
CREATE TABLE public.story_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL,
  viewer_id uuid, -- Može biti null za anonimne
  ip_address text,
  viewed_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT story_views_pkey PRIMARY KEY (id),
  CONSTRAINT story_views_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE
);

-- =============================================
-- GALERIJE (PHOTOS & VIDEOS sa limitima)
-- =============================================

-- 19. PHOTOS (Sa ograničenjima iz PDF-a)
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  photo_url text NOT NULL,
  thumbnail_url text,
  
  -- Verifikacija (100% verified pictures - PDF/and6)
  is_verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  verified_by uuid,
  
  is_primary boolean DEFAULT false, -- Glavna slika
  display_order integer DEFAULT 0,
  
  -- Statistika
  views_count integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT photos_pkey PRIMARY KEY (id),
  CONSTRAINT photos_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 20. VIDEOS (Sa ograničenjima iz PDF-a)
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  duration integer, -- u sekundama
  title text,
  description text,
  
  -- Statistika
  views_count integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT videos_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- GIFTING SISTEM (PDF - Darivanje comp-kartice)
-- =============================================

-- 21. GIFT CARDS (Darovi za dame)
CREATE TABLE public.gift_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  gifted_by uuid NOT NULL, -- Posjetitelj koji daruje
  gifted_to uuid NOT NULL, -- Model koji prima
  product_id uuid NOT NULL, -- Što se daruje (comp card, credits, etc.)
  
  message text, -- Poruka uz dar
  is_redeemed boolean DEFAULT false,
  redeemed_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  
  CONSTRAINT gift_cards_pkey PRIMARY KEY (id),
  CONSTRAINT gift_cards_gifted_by_fkey FOREIGN KEY (gifted_by) REFERENCES public.profiles(id),
  CONSTRAINT gift_cards_gifted_to_fkey FOREIGN KEY (gifted_to) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT gift_cards_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.shop_products(id)
);

-- =============================================
-- FAVORITI (PDF - Do 50 omiljenih modela)
-- =============================================

-- 22. FAVORITES (Ograničeno na 50 po korisniku)
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  model_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_unique UNIQUE (user_id, model_id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT favorites_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- PORUKE (MESSAGING)
-- =============================================

-- 23. MESSAGES (Slanje poruka putem app/web - PDF)
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message_text text NOT NULL,
  
  -- Attachments
  attachments jsonb, -- Array attachment URL-ova
  
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- REVIEWS I OCJENJIVANJE
-- =============================================

-- 24. REVIEWS (Samo zvjezdice? - PDF)
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  
  -- Samo zvjezdice bez komentara posjetitelja (PDF opcija)
  allow_comment boolean DEFAULT true,
  
  -- Moderation
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id)
);

-- =============================================
-- KATEGORIJE (Escort, Trans, etc.)
-- =============================================

-- 25. CATEGORIES
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL, -- 'Escort', 'Trans', 'Massage', etc.
  slug text UNIQUE NOT NULL,
  description text,
  icon_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 26. MODEL KATEGORIJE (Many-to-Many)
CREATE TABLE public.model_categories (
  model_id uuid NOT NULL,
  category_id uuid NOT NULL,
  
  CONSTRAINT model_categories_pkey PRIMARY KEY (model_id, category_id),
  CONSTRAINT model_categories_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT model_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);

-- =============================================
-- CITY TOURS (Turneje kao and6.com)
-- =============================================

-- 27. CITY TOURS
CREATE TABLE public.city_tours (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  city_name text NOT NULL,
  region_id uuid,
  country text NOT NULL DEFAULT 'Switzerland',
  start_date date NOT NULL,
  end_date date NOT NULL,
  description text,
  contact_info text,
  is_active boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT city_tours_pkey PRIMARY KEY (id),
  CONSTRAINT city_tours_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT city_tours_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id)
);

-- =============================================
-- JOBS (Oglasi za posao)
-- =============================================

-- 28. JOBS
CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  posted_by uuid NOT NULL, -- Tvrtka ili klub
  title text NOT NULL,
  description text NOT NULL,
  location_city text,
  location_country text,
  region_id uuid,
  
  job_type text CHECK (job_type IN ('full-time', 'part-time', 'freelance', 'temporary')),
  salary_range text,
  
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.profiles(id),
  CONSTRAINT jobs_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id)
);

-- =============================================
-- RENTALS (Iznajmljivanje stanova)
-- =============================================

-- 29. RENTALS
CREATE TABLE public.rentals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  posted_by uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location_city text,
  location_country text,
  region_id uuid,
  address text,
  
  price_per_day numeric,
  price_per_week numeric,
  price_per_month numeric,
  
  property_type text CHECK (property_type IN ('apartment', 'room', 'studio', 'club', 'office')),
  
  -- Detalji
  bedrooms integer,
  bathrooms integer,
  square_meters integer,
  
  amenities text[], -- WiFi, parking, etc.
  photos_urls text[],
  
  is_available boolean DEFAULT true,
  available_from date,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT rentals_pkey PRIMARY KEY (id),
  CONSTRAINT rentals_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.profiles(id),
  CONSTRAINT rentals_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id)
);

-- =============================================
-- BOOKINGS (Rezervacije)
-- =============================================

-- 30. BOOKINGS
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  model_id uuid NOT NULL,
  
  booking_date date NOT NULL,
  booking_time time,
  duration_hours integer,
  location_type text CHECK (location_type IN ('incall', 'outcall')),
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  total_price numeric,
  notes text,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id),
  CONSTRAINT bookings_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- JEZICI
-- =============================================

-- 31. LANGUAGES
CREATE TABLE public.languages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  language_code text NOT NULL, -- 'en', 'de', 'fr', 'it', etc.
  language_name text NOT NULL, -- 'English', 'German', etc.
  proficiency_level text CHECK (proficiency_level IN ('basic', 'intermediate', 'fluent', 'native')),
  
  CONSTRAINT languages_pkey PRIMARY KEY (id),
  CONSTRAINT languages_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- DOSTUPNOST (Radno vrijeme)
-- =============================================

-- 32. AVAILABILITY
CREATE TABLE public.availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  
  CONSTRAINT availability_pkey PRIMARY KEY (id),
  CONSTRAINT availability_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- ANALYTICS I PRAĆENJE (PDF - Analiza broja posjetitelja)
-- =============================================

-- 33. PROFILE VIEWS (Procjena klikova - PDF)
CREATE TABLE public.profile_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  viewer_id uuid, -- Null za anonimne
  ip_address text,
  user_agent text,
  referrer_url text,
  viewed_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT profile_views_pkey PRIMARY KEY (id),
  CONSTRAINT profile_views_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 34. SEARCH LOGS (Za analytics i SEO)
CREATE TABLE public.search_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid, -- Null za anonimne
  search_query text,
  filters jsonb, -- JSON sa filterima
  region_id uuid,
  results_count integer,
  clicked_result_id uuid, -- Koji profil je kliknut
  
  searched_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT search_logs_pkey PRIMARY KEY (id),
  CONSTRAINT search_logs_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id)
);

-- 35. CLICK TRACKING (Procjena klikova)
CREATE TABLE public.click_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  click_type text NOT NULL CHECK (click_type IN (
    'profile_view', 
    'phone_click', 
    'whatsapp_click', 
    'email_click',
    'website_click',
    'photo_view',
    'video_view'
  )),
  
  clicked_by uuid, -- Null za anonimne
  ip_address text,
  
  clicked_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT click_tracking_pkey PRIMARY KEY (id),
  CONSTRAINT click_tracking_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- NOTIFIKACIJE
-- =============================================

-- 36. NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text CHECK (notification_type IN (
    'message', 
    'booking', 
    'review', 
    'connection_request',
    'subscription_expiring',
    'system',
    'gift_received'
  )),
  
  is_read boolean DEFAULT false,
  link_url text,
  metadata jsonb,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- VERIFICATION REQUESTS (Plaćena verifikacija - PDF)
-- =============================================

-- 37. VERIFICATION REQUESTS
CREATE TABLE public.verification_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('profile', 'photo', 'video', 'identity')),
  
  -- Dokumenti za verifikaciju
  documents jsonb, -- Array dokumenata (ID, selfie, etc.)
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'additional_info_needed')),
  
  -- Admin review
  reviewed_by uuid,
  review_notes text,
  reviewed_at timestamp with time zone,
  
  -- Uz naknadu (PDF)
  is_paid boolean DEFAULT false,
  paid_amount numeric,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT verification_requests_pkey PRIMARY KEY (id),
  CONSTRAINT verification_requests_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- =============================================
-- ADMIN LOGS (Za praćenje admina)
-- =============================================

-- 38. ADMIN ACTIONS
CREATE TABLE public.admin_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action_type text NOT NULL,
  target_table text,
  target_id uuid,
  description text NOT NULL,
  metadata jsonb,
  ip_address text,
  
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT admin_actions_pkey PRIMARY KEY (id),
  CONSTRAINT admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);

-- =============================================
-- INDEKSI ZA PERFORMANSE
-- =============================================

-- Profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_customer_number ON public.profiles(customer_number);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Model Details
CREATE INDEX idx_model_details_location ON public.model_details(location_country, location_city);
CREATE INDEX idx_model_details_postal_code ON public.model_details(postal_code);

-- Regions
CREATE INDEX idx_regions_country ON public.regions(country_code);
CREATE INDEX idx_model_regions_model_id ON public.model_regions(model_id);
CREATE INDEX idx_model_regions_region_id ON public.model_regions(region_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_subscriber ON public.subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_valid_until ON public.subscriptions(valid_until);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Orders
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(order_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Banners
CREATE INDEX idx_banners_company ON public.banners(company_id);
CREATE INDEX idx_banners_placement ON public.banners(placement_id);
CREATE INDEX idx_banners_active ON public.banners(is_active, expires_at);

-- Stories
CREATE INDEX idx_stories_model ON public.stories(model_id);
CREATE INDEX idx_stories_expires ON public.stories(expires_at);
CREATE INDEX idx_stories_created ON public.stories(created_at DESC);

-- Photos & Videos
CREATE INDEX idx_photos_model_id ON public.photos(model_id);
CREATE INDEX idx_photos_verified ON public.photos(is_verified);
CREATE INDEX idx_videos_model_id ON public.videos(model_id);

-- Messages
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_model_id ON public.favorites(model_id);

-- Reviews
CREATE INDEX idx_reviews_model_id ON public.reviews(model_id);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved);

-- Analytics
CREATE INDEX idx_profile_views_model ON public.profile_views(model_id, viewed_at);
CREATE INDEX idx_click_tracking_model ON public.click_tracking(model_id, click_type);
CREATE INDEX idx_search_logs_searched_at ON public.search_logs(searched_at DESC);

-- City Tours
CREATE INDEX idx_city_tours_dates ON public.city_tours(start_date, end_date);
CREATE INDEX idx_city_tours_active ON public.city_tours(is_active);

-- Jobs & Rentals
CREATE INDEX idx_jobs_region ON public.jobs(region_id, is_active);
CREATE INDEX idx_rentals_region ON public.rentals(region_id, is_available);

-- Connections
CREATE INDEX idx_connections_requester ON public.connections(requester_id);
CREATE INDEX idx_connections_receiver ON public.connections(receiver_id);
CREATE INDEX idx_connections_status ON public.connections(status);

-- =============================================
-- FUNKCIJE ZA AUTOMATIZACIJU
-- =============================================

-- Funkcija za automatsko određivanje regije prema poštanskom broju
CREATE OR REPLACE FUNCTION auto_assign_region()
RETURNS TRIGGER AS $$
DECLARE
  found_region_id uuid;
BEGIN
  IF NEW.postal_code IS NOT NULL THEN
    SELECT id INTO found_region_id
    FROM public.regions
    WHERE NEW.postal_code = ANY(postal_codes)
    LIMIT 1;
    
    IF found_region_id IS NOT NULL THEN
      INSERT INTO public.model_regions (model_id, region_id, is_primary, is_paid)
      VALUES (NEW.id, found_region_id, true, false)
      ON CONFLICT (model_id, region_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_assign_region
AFTER INSERT OR UPDATE OF postal_code ON public.model_details
FOR EACH ROW
EXECUTE FUNCTION auto_assign_region();

-- Funkcija za brisanje isteklih priča
CREATE OR REPLACE FUNCTION delete_expired_stories()
RETURNS void AS $$
BEGIN
  DELETE FROM public.stories
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Funkcija za provjeru limita fotografija
CREATE OR REPLACE FUNCTION check_photo_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
  max_allowed integer;
BEGIN
  SELECT COUNT(*) INTO current_count
  FROM public.photos
  WHERE model_id = NEW.model_id;
  
  SELECT max_photos INTO max_allowed
  FROM public.model_details
  WHERE id = NEW.model_id;
  
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Photo limit reached. Maximum allowed: %', max_allowed;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_photo_limit
BEFORE INSERT ON public.photos
FOR EACH ROW
EXECUTE FUNCTION check_photo_limit();

-- Funkcija za provjeru limita videa
CREATE OR REPLACE FUNCTION check_video_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
  max_allowed integer;
BEGIN
  SELECT COUNT(*) INTO current_count
  FROM public.videos
  WHERE model_id = NEW.model_id;
  
  SELECT max_videos INTO max_allowed
  FROM public.model_details
  WHERE id = NEW.model_id;
  
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Video limit reached. Maximum allowed: %', max_allowed;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_video_limit
BEFORE INSERT ON public.videos
FOR EACH ROW
EXECUTE FUNCTION check_video_limit();

-- Funkcija za provjeru limita favorita (max 50)
CREATE OR REPLACE FUNCTION check_favorites_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
BEGIN
  SELECT COUNT(*) INTO current_count
  FROM public.favorites
  WHERE user_id = NEW.user_id;
  
  IF current_count >= 50 THEN
    RAISE EXCEPTION 'Favorites limit reached. Maximum allowed: 50';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_favorites_limit
BEFORE INSERT ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION check_favorites_limit();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Photos policies (svi mogu videti)
CREATE POLICY "Photos are viewable by everyone" ON public.photos
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own photos" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = model_id);

CREATE POLICY "Users can delete own photos" ON public.photos
  FOR DELETE USING (auth.uid() = model_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = model_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- =============================================
-- VIEWS ZA LAKŠI PRISTUP PODACIMA
-- =============================================

-- View za top modele (po pregledima)
CREATE VIEW top_models_by_views AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  COUNT(pv.id) as total_views,
  md.location_city,
  md.location_country
FROM public.profiles p
JOIN public.model_details md ON p.id = md.id
LEFT JOIN public.profile_views pv ON p.id = pv.model_id
WHERE p.role = 'model' AND p.profile_status = 'active'
GROUP BY p.id, p.full_name, p.avatar_url, md.location_city, md.location_country
ORDER BY total_views DESC;

-- View za aktivne priče
CREATE VIEW active_stories AS
SELECT 
  s.*,
  p.full_name,
  p.avatar_url,
  p.username
FROM public.stories s
JOIN public.profiles p ON s.model_id = p.id
WHERE s.expires_at > now()
ORDER BY s.created_at DESC;

-- View za aktivne banere po regiji
CREATE VIEW active_banners_by_region AS
SELECT 
  b.*,
  c.full_name as company_name,
  bp.name as placement_name,
  bp.position
FROM public.banners b
JOIN public.profiles c ON b.company_id = c.id
JOIN public.banner_placements bp ON b.placement_id = bp.id
WHERE b.is_active = true 
  AND b.starts_at <= now() 
  AND b.expires_at >= now()
ORDER BY b.rotation_order;

-- =============================================
-- KRAJ SCHEMA
-- =============================================

-- Dodatni komentari:
COMMENT ON TABLE public.profiles IS 'Glavni profili korisnika - posjetitelji, modeli, tvrtke, admini';
COMMENT ON TABLE public.model_regions IS 'Many-to-many veza modela i regija - prva besplatno, ostale uz naplatu';
COMMENT ON TABLE public.subscriptions IS 'Aktivne pretplate - comp kartice odmah online nakon uplate';
COMMENT ON TABLE public.banners IS 'Oglasni baneri - rotirajući, max 3 po mjestu, samo za tvrtke';
COMMENT ON TABLE public.connections IS 'Umrežavanje - model-model jednom besplatno, tvrtka-model 5 puta besplatno';
COMMENT ON TABLE public.stories IS '24-satne priče - samo modeli, bez tvrtki';
COMMENT ON TABLE public.gift_cards IS 'Darivanje comp-kartica posjetitelja modelima';
COMMENT ON TABLE public.favorites IS 'Omiljeni modeli - max 50 po posjetitelju';

