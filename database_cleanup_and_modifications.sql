-- =============================================
-- CLEANUP I MODIFIKACIJE BAZE PODATAKA
-- Brisanje nepotrebnih tabela i dodavanje kontakt preferenci
-- =============================================

-- =============================================
-- 1. BRISANJE NEPOTREBNIH TABELA
-- =============================================

-- Bookings tabela nije potrebna (and6.com koristi direktan kontakt)
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Availability tabela nije potrebna (dovoljno je text polje working_hours)
DROP TABLE IF EXISTS public.availability CASCADE;

-- =============================================
-- 2. DODAVANJE KONTAKT PREFERENCI U MODEL_DETAILS
-- =============================================

-- Dodaj kontakt preference za direktan kontakt kao na and6.com
ALTER TABLE public.model_details 
ADD COLUMN IF NOT EXISTS prefers_sms boolean DEFAULT true;

ALTER TABLE public.model_details 
ADD COLUMN IF NOT EXISTS prefers_call boolean DEFAULT true;

ALTER TABLE public.model_details 
ADD COLUMN IF NOT EXISTS prefers_whatsapp boolean DEFAULT true;

ALTER TABLE public.model_details 
ADD COLUMN IF NOT EXISTS prefers_telegram boolean DEFAULT false;

-- =============================================
-- 3. POTVRDA DA working_hours POSTOJI (već je u tabeli)
-- =============================================

-- working_hours text polje već postoji u model_details
-- Može sadržavati: "Mon-Fri 10:00-22:00" ili "24/7" ili "Nach Vereinbarung"

-- =============================================
-- GOTOVO!
-- =============================================

-- Provjerite rezultate:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'model_details' 
-- AND column_name IN ('working_hours', 'prefers_sms', 'prefers_call', 'prefers_whatsapp', 'prefers_telegram');

