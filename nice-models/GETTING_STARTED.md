# 🚀 Getting Started - Nice Models Portal

## ✅ Šta je sve spremno:

### 1. **Frontend (100% gotov MVP)**
- ✅ Landing page sa search barom
- ✅ Search stranica sa filterima
- ✅ Profile detail stranica
- ✅ Login/Register sistem
- ✅ Responsive dizajn (mobile-first)
- ✅ Moderne komponente i animacije

### 2. **Backend Setup**
- ✅ Supabase konekcija konfigurisana
- ✅ Auth sistem spreman
- ✅ Database schema definisana

### 3. **Trenutno stanje:**
- 🟢 **Server radi:** http://localhost:3000
- 🟢 **Nema linter grešaka**
- 🟢 **TypeScript konfigurisan**
- 🟢 **Tailwind CSS aktivan**

---

## 📋 SLEDEĆI KORACI:

### KORAK 1: Popuni Supabase bazu

Idi u Supabase Dashboard → SQL Editor i pokreni:

```sql
-- Kopiraj sadržaj iz ../database_schema_extended.sql
-- Paste u SQL Editor i klikni "Run"
```

### KORAK 2: Dodaj test podatke

```sql
-- Primer: Dodaj kategorije
INSERT INTO categories (name, slug, description) VALUES
('Escorts', 'escorts', 'Professional escort services'),
('Trans', 'trans', 'Transgender companions'),
('VIP', 'vip', 'Premium VIP models'),
('Couples', 'couples', 'Couple services');

-- Primer: Dodaj test profil (nakon registracije korisnika)
-- Prvo se registruj na /register, pa dodaj model_details
```

### KORAK 3: Testiraj funkcionalnosti

1. **Otvori sajt:** http://localhost:3000
2. **Registruj se:** http://localhost:3000/register
3. **Login:** http://localhost:3000/login
4. **Pretraži:** http://localhost:3000/search
5. **Pogledaj profil:** http://localhost:3000/profile/1

---

## 🎨 Kako izgleda sajt:

### Landing Page (`/`)
```
┌─────────────────────────────────────┐
│  HEADER (Navigation)                │
├─────────────────────────────────────┤
│  HERO SECTION                       │
│  - Naslov                           │
│  - Search bar (Location, Category)  │
│  - Quick stats (1292 online, etc)  │
├─────────────────────────────────────┤
│  CATEGORIES                         │
│  [Escorts] [Trans] [New] [VIP]     │
├─────────────────────────────────────┤
│  FEATURED PROFILES                  │
│  [Card] [Card] [Card] [Card]       │
├─────────────────────────────────────┤
│  POPULAR LOCATIONS                  │
│  Zurich, Geneva, Basel...          │
├─────────────────────────────────────┤
│  STATS SECTION                      │
├─────────────────────────────────────┤
│  CTA (Call to Action)              │
├─────────────────────────────────────┤
│  FOOTER                            │
└─────────────────────────────────────┘
```

### Search Page (`/search`)
```
┌──────────┬──────────────────────────┐
│ FILTERS  │  PROFILE GRID            │
│          │  ┌────┬────┬────┐       │
│ Category │  │Card│Card│Card│       │
│ Location │  ├────┼────┼────┤       │
│ Age      │  │Card│Card│Card│       │
│ Price    │  ├────┼────┼────┤       │
│ Services │  │Card│Card│Card│       │
│ Verified │  └────┴────┴────┘       │
│          │  [Pagination]            │
└──────────┴──────────────────────────┘
```

### Profile Page (`/profile/[id]`)
```
┌───────────────────────┬──────────┐
│ PROFILE HEADER        │ SIDEBAR  │
│ Name, Age, Location   │ $250/hr  │
│ Rating, Verified      │          │
├───────────────────────┤ [Call]   │
│ PHOTO GALLERY         │ [WhatsApp│
│ [Photo][Photo][Photo] │ [Message]│
├───────────────────────┤ [Book]   │
│ ABOUT ME              │          │
│ Bio text...           │ Pricing  │
├───────────────────────┤ 30min:150│
│ SERVICES OFFERED      │ 1hr: 250 │
│ ✓ GFE ✓ Massage      │          │
├───────────────────────┤ Schedule │
│ LANGUAGES             │ Mon-Fri  │
│ English, German       │ 10-22    │
├───────────────────────┤          │
│ REVIEWS & RATINGS     │          │
│ ⭐⭐⭐⭐⭐ 4.9/5      │          │
└───────────────────────┴──────────┘
```

---

## 🔧 Prilagođavanje (Customization)

### Promeni boje:
Otvori `nice-models/tailwind.config.ts`:
```ts
colors: {
  primary: '#ec4899',    // pink-500
  secondary: '#9333ea',  // purple-600
}
```

### Promeni logo:
Otvori `nice-models/src/components/layout/Header.tsx` i promeni "NICE MODELS" tekst.

### Dodaj svoj Supabase URL:
Već je konfigurisano u `.env.local`!

---

## 🐛 Troubleshooting

### Problem: Server ne startuje
```bash
cd nice-models
rm -rf .next node_modules
npm install
npm run dev
```

### Problem: Supabase greška
- Proveri da li je `.env.local` fajl kreiran
- Proveri da li su URL i KEY tačni u Supabase dashboardu

### Problem: Slike se ne učitavaju
- Next.js zahteva konfiguraciju za eksterne slike
- Dodaj domene u `next.config.js` (već konfigurisano za unsplash.com)

---

## 📊 Šta dalje? (Faza 2)

### Prioritet 1: Real Data
1. Popuni bazu sa pravim profilima
2. Upload slike u Supabase Storage
3. Konektuj frontend sa backend API-jem

### Prioritet 2: Dashboard
1. User dashboard (favorites, messages, bookings)
2. Model dashboard (manage profile, photos, availability)
3. Admin dashboard (approve profiles, moderate content)

### Prioritet 3: Advanced Features
1. Real-time messaging
2. Booking system sa kalendarom
3. Payment integration (Stripe)
4. Email notifications
5. SMS notifications (Twilio)

---

## 🎯 Kako dodati prave podatke:

### 1. Registruj model profil:
```
1. Idi na /register
2. Izaberi "Model" role
3. Registruj se sa emailom i passwordom
```

### 2. Dodaj model details u Supabase:
```sql
-- U Supabase SQL Editor:
INSERT INTO model_details (
  id, 
  location_city, 
  location_country, 
  bio, 
  age, 
  height,
  phone_number, 
  price_per_hour
) VALUES (
  'USER_ID_FROM_AUTH', -- ID iz auth.users tabele
  'Zurich',
  'Switzerland',
  'Hello, I am a professional model...',
  25,
  168,
  '+41 76 123 4567',
  250
);
```

### 3. Upload slike:
```sql
-- Dodaj slike u photos tabelu:
INSERT INTO photos (model_id, photo_url, is_primary) VALUES
('USER_ID', 'https://your-image-url.jpg', true);
```

---

## 🚀 Deploy na Production

### Vercel (Preporučeno):
```bash
1. Push code na GitHub
2. Idi na vercel.com
3. Import GitHub repo
4. Dodaj environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Deploy!
```

### Custom Server:
```bash
npm run build
npm run start
```

---

## 📞 Pomoć

Ako imaš problema:
1. Proveri browser konzolu (F12)
2. Proveri terminal za greške
3. Proveri Supabase logs u dashboardu

---

**🎉 Čestitamo! Vaš Nice Models portal je spreman za razvoj!**

**Trenutno možete:**
- ✅ Videti landing page
- ✅ Pretraživati (mock data)
- ✅ Videti profile (mock data)
- ✅ Registrovati se / Login

**Sledeći korak: Popunite bazu sa pravim podacima!** 🚀

