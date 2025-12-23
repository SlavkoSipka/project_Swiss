-- =============================================
-- DODATNE TABELE ZA AND6-LIKE PORTAL
-- =============================================

-- 1. GALERIJA SLIKA
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  photo_url text NOT NULL,
  is_verified boolean DEFAULT false,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT photos_pkey PRIMARY KEY (id),
  CONSTRAINT photos_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 2. VIDEO GALERIJA
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  duration integer, -- u sekundama
  title text,
  description text,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT videos_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 3. KOMENTARI I RECENZIJE
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id)
);

-- 4. FAVORITI
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  model_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT favorites_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT favorites_unique UNIQUE (user_id, model_id)
);

-- 5. PORUKE (MESSAGING)
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message_text text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 6. CITY TOURS (Turneje)
CREATE TABLE public.city_tours (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  city_name text NOT NULL,
  country text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT city_tours_pkey PRIMARY KEY (id),
  CONSTRAINT city_tours_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 7. POSLOVI (JOBS)
CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  posted_by uuid NOT NULL, -- club ili model
  title text NOT NULL,
  description text NOT NULL,
  location_city text,
  location_country text,
  job_type text CHECK (job_type IN ('full-time', 'part-time', 'freelance')),
  salary_range text,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.profiles(id)
);

-- 8. IZNAJMLJIVANJE (RENTALS)
CREATE TABLE public.rentals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  posted_by uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location_city text,
  location_country text,
  price_per_day numeric,
  price_per_month numeric,
  property_type text CHECK (property_type IN ('apartment', 'room', 'studio', 'club')),
  is_available boolean DEFAULT true,
  photos_urls text[], -- array URL-ova slika
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rentals_pkey PRIMARY KEY (id),
  CONSTRAINT rentals_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.profiles(id)
);

-- 9. REZERVACIJE/BOOKINGS
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  model_id uuid NOT NULL,
  booking_date date NOT NULL,
  booking_time time,
  duration_hours integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id),
  CONSTRAINT bookings_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 10. JEZICI KOJE MODEL GOVORI
CREATE TABLE public.languages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  language_code text NOT NULL, -- 'en', 'de', 'fr', etc.
  language_name text NOT NULL,
  CONSTRAINT languages_pkey PRIMARY KEY (id),
  CONSTRAINT languages_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 11. RADNO VREME / DOSTUPNOST
CREATE TABLE public.availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Ned, 6=Sub
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  CONSTRAINT availability_pkey PRIMARY KEY (id),
  CONSTRAINT availability_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 12. VIEWS/PREGLEDI PROFILA
CREATE TABLE public.profile_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL,
  viewer_id uuid, -- može biti null za anonimne
  ip_address text,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_views_pkey PRIMARY KEY (id),
  CONSTRAINT profile_views_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 13. KATEGORIJE/TIPOVI (Escort, Trans, etc)
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 14. MODEL KATEGORIJE (Many-to-Many)
CREATE TABLE public.model_categories (
  model_id uuid NOT NULL,
  category_id uuid NOT NULL,
  CONSTRAINT model_categories_pkey PRIMARY KEY (model_id, category_id),
  CONSTRAINT model_categories_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT model_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);

-- 15. NOTIFIKACIJE
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('message', 'booking', 'review', 'system')),
  is_read boolean DEFAULT false,
  link_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 16. SEARCH LOGS (za analytics)
CREATE TABLE public.search_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  search_query text,
  filters jsonb, -- JSON sa filterima (grad, cena, etc)
  results_count integer,
  searched_at timestamp with time zone DEFAULT now(),
  CONSTRAINT search_logs_pkey PRIMARY KEY (id)
);

-- =============================================
-- INDEXI ZA PERFORMANSE
-- =============================================

CREATE INDEX idx_photos_model_id ON public.photos(model_id);
CREATE INDEX idx_videos_model_id ON public.videos(model_id);
CREATE INDEX idx_reviews_model_id ON public.reviews(model_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_model_id ON public.favorites(model_id);
CREATE INDEX idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_city_tours_dates ON public.city_tours(start_date, end_date);
CREATE INDEX idx_bookings_model_date ON public.bookings(model_id, booking_date);
CREATE INDEX idx_profile_views_model_id ON public.profile_views(model_id);
CREATE INDEX idx_model_details_location ON public.model_details(location_country, location_city);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- =============================================
-- ROW LEVEL SECURITY (RLS) - OSNOVNI PRIMERI
-- =============================================

-- Omogući RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy za čitanje slika (svi mogu videti)
CREATE POLICY "Photos are viewable by everyone" ON public.photos
  FOR SELECT USING (true);

-- Policy za dodavanje slika (samo vlasnik)
CREATE POLICY "Users can insert their own photos" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = model_id);

-- Policy za poruke (samo pošiljalac i primalac)
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy za bookings (klijent i model)
CREATE POLICY "Users can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = model_id);

