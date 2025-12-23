-- =============================================
-- DODAJ MARINA BASEL PROFIL
-- User ID: 8c5f27e0-d04f-42bd-9d56-77cd291a2748
-- =============================================

-- 1. Ažuriraj profiles tabelu (postavi role na 'model')
UPDATE public.profiles 
SET 
  role = 'model',
  is_verified = true,
  full_name = 'Marina Basel'
WHERE id = '8c5f27e0-d04f-42bd-9d56-77cd291a2748';

-- 2. Dodaj model_details
INSERT INTO public.model_details (
  id, 
  location_city, 
  location_country, 
  bio, 
  age, 
  height,
  phone_number, 
  price_per_hour,
  services
) VALUES (
  '8c5f27e0-d04f-42bd-9d56-77cd291a2748',
  'Basel',
  'Switzerland',
  'Hello gentlemen! I am Marina, an elegant, romantic, charming lady with a lot of experience. I love what I do and will make sure you have an unforgettable time. Very discreet private apartment. Available by appointment only.',
  25,
  168,
  '+41 76 513 79 27',
  250,
  ARRAY['GFE (Girlfriend Experience)', 'Massage', 'Outcall', 'Overnight', 'Dinner Date', 'Travel Companion']
);

-- 3. Dodaj slike
INSERT INTO public.photos (model_id, photo_url, is_primary, is_verified, display_order) VALUES
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', true, true, 1),
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', false, true, 2),
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', false, true, 3),
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', false, true, 4);

-- 4. Dodaj jezike
INSERT INTO public.languages (model_id, language_code, language_name) VALUES
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'en', 'English'),
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'de', 'German'),
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 'fr', 'French');

-- 5. Dodaj availability (radno vreme)
INSERT INTO public.availability (model_id, day_of_week, start_time, end_time, is_available) VALUES
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 1, '10:00', '22:00', true),  -- Monday
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 2, '10:00', '22:00', true),  -- Tuesday
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 3, '10:00', '22:00', true),  -- Wednesday
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 4, '10:00', '22:00', true),  -- Thursday
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 5, '10:00', '23:00', true),  -- Friday
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 6, '12:00', '23:00', true),  -- Saturday
('8c5f27e0-d04f-42bd-9d56-77cd291a2748', 0, '10:00', '22:00', false); -- Sunday (closed)

-- GOTOVO! ✅

