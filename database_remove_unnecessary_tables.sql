-- =============================================
-- UKLANJANJE NEPOTREBNIH TABELA
-- Prema zahtevima za nicemodels.ch
-- =============================================

-- ⚠️ OPREZ: Ova skripta briše tabele koje NISU potrebne prema zahtevima
-- Prvo napravite backup baze podataka!

-- =============================================
-- BRISANJE NEPOTREBNIH TABELA
-- =============================================

-- 1. city_tours - NIJE u zahtevima
DROP TABLE IF EXISTS public.city_tours CASCADE;

-- 2. jobs - NIJE u zahtevima
DROP TABLE IF EXISTS public.jobs CASCADE;

-- 3. languages - NIJE potrebno (jezici su u model_details.speaks_languages kao array)
DROP TABLE IF EXISTS public.languages CASCADE;

-- 4. model_languages - NIJE potrebno (duplikat, jezici su u model_details.speaks_languages)
DROP TABLE IF EXISTS public.model_languages CASCADE;

-- 5. model_rates - NIJE potrebno (cene su u model_details kao price_per_hour i price_per_night)
DROP TABLE IF EXISTS public.model_rates CASCADE;

-- =============================================
-- PROVERA - Koje tabele su zadržane
-- =============================================

-- ✅ ZADRŽANE TABELE (36 tabela):
-- 1. admin_actions
-- 2. banner_clicks
-- 3. banner_placements
-- 4. banners
-- 5. categories
-- 6. click_tracking
-- 7. company_details
-- 8. connections
-- 9. favorites
-- 10. gift_cards
-- 11. messages
-- 12. model_categories
-- 13. model_details
-- 14. model_regions
-- 15. model_services
-- 16. model_services_for
-- 17. networking_credits
-- 18. notifications
-- 19. orders
-- 20. payment_transactions
-- 21. photos
-- 22. pricing_plans
-- 23. profile_views
-- 24. profiles
-- 25. regions
-- 26. rentals (✅ zadržano - spomenuto kao "Razno – odjeljak za najam stanova")
-- 27. reviews
-- 28. search_logs
-- 29. services
-- 30. shop_products
-- 31. status_updates
-- 32. stories
-- 33. story_views
-- 34. subscriptions
-- 35. verification_requests
-- 36. videos

-- =============================================
-- NAPOMENA
-- =============================================

-- Jezici se čuvaju u model_details.speaks_languages kao text[] array
-- Cene se čuvaju u model_details kao price_per_hour i price_per_night
-- Radno vrijeme se čuva u model_details kao working_hours, working_hours_type i custom_schedule

-- =============================================
-- KRAJ
-- =============================================

