# 🎯 AND6-LIKE PORTAL - FEATURES CHECKLIST

## ✅ ŠTO VEĆ IMATE (U VAŠOJ BAZI)
- [x] Profili korisnika (profiles)
- [x] Detalji modela (model_details)
- [x] Status updates
- [x] Stories (24h)
- [x] Subscriptions sistem

## 🔨 ŠTO TREBA DODATI - BACKEND (BAZA)

### 📸 Media Management
- [ ] **Photos tabla** - galerija slika za svaki profil
- [ ] **Videos tabla** - video galerija
- [ ] **Verified photos badge** - polje za verifikaciju slika

### 💬 Komunikacija
- [ ] **Messages tabla** - direktne poruke između korisnika
- [ ] **Notifications tabla** - notifikacije
- [ ] **Reviews tabla** - komentari i recenzije (5-star rating)

### 🎪 Dodatne Funkcionalnosti
- [ ] **City Tours** - turneje po gradovima
- [ ] **Jobs tabla** - oglasi za poslove
- [ ] **Rentals tabla** - iznajmljivanje prostora/apartmana
- [ ] **Bookings** - rezervacije/appointmenti
- [ ] **Favorites** - omiljeni profili
- [ ] **Categories** - Escort, Trans, Couples, etc.
- [ ] **Languages** - jezici koje model govori
- [ ] **Availability** - radno vreme/dostupnost
- [ ] **Profile views** - brojač pregleda profila
- [ ] **Search logs** - analytics pretrage

### 🔐 Security & Auth
- [ ] **Row Level Security (RLS)** policies
- [ ] **Admin role** za moderaciju
- [ ] **Verification sistem** - verifikacija profila
- [ ] **Report system** - prijavljivanje neprikladnog sadržaja

## 🎨 FRONTEND FUNKCIONALNOSTI

### 🏠 Homepage
- [ ] Hero sekcija sa pozivom na akciju
- [ ] Pretraga po lokaciji (dropdown sa gradovima)
- [ ] Filter panel (kategorije: Escort, Trans, Couples, etc.)
- [ ] "New Girls" sekcija
- [ ] "Today's Stories" carousel (24h stories)
- [ ] Featured/Premium profiles

### 📋 Listings & Search
- [ ] **Grid/List view** profila
- [ ] **Advanced filters:**
  - Lokacija (država, grad)
  - Kategorija (Escort, Trans, etc.)
  - Cena (range slider)
  - Uzrast (range slider)
  - Usluge (checkboxes)
  - Dostupnost (danas, sutra, etc.)
  - Verified only
- [ ] **Sortiranje:**
  - Najnoviji
  - Najpopularniji
  - Najjeftiniji/Najskuplji
  - Najbliži
- [ ] **Pagination** ili infinite scroll
- [ ] **Map view** - mapa sa pinovima

### 👤 Profile Page (Model)
- [ ] **Glavni info:**
  - Ime, uzrast, lokacija
  - Telefon, WhatsApp dugme
  - Cena po satu
  - Verified badge (ako je verifikovan)
  - Online/Offline status
- [ ] **Photo gallery** (lightbox za puno ekran)
- [ ] **Video gallery**
- [ ] **Bio/Opis**
- [ ] **Spisak usluga** (services list)
- [ ] **Jezici** koje govori
- [ ] **Radno vreme**
- [ ] **Reviews sekcija** (rating + komentari)
- [ ] **Dugmad:**
  - Call/SMS
  - WhatsApp
  - Send Message
  - Add to Favorites
  - Share profile
  - Report
- [ ] **Similar profiles** (related)
- [ ] **Active status message** (24h short notice)

### 📱 User Features
- [ ] **Registration/Login** (email/password)
- [ ] **User dashboard:**
  - Favorites
  - Messages inbox
  - Bookings (past & upcoming)
  - Notifications
  - Settings
- [ ] **Model dashboard:**
  - Manage photos/videos
  - Edit profile
  - Manage availability
  - Post status updates
  - Post stories
  - View statistics (views, messages, bookings)
  - Inbox
  - Reviews management

### 📍 Additional Pages
- [ ] **City Tours page** - lista turnejа
- [ ] **Jobs page** - oglasi za poslove
- [ ] **Rent page** - iznajmljivanje
- [ ] **Latest Actions** - feed sa aktivnostima
- [ ] **Daily Ads** - dnevni oglasi
- [ ] **About/Contact**
- [ ] **Terms & Privacy Policy**

### 🌍 Internationalization
- [ ] Multi-language support (EN, DE, FR, IT, ES, etc.)
- [ ] Language switcher u navigaciji

### 💳 Premium Features (Opciono)
- [ ] **Subscription plans** za modele
  - Basic (free)
  - Premium (featured placement)
  - VIP (top placement + extra features)
- [ ] **Payment integration** (Stripe/PayPal)
- [ ] **Credits sistem** za klijente (unlock private photos, etc.)

### 📊 Admin Panel
- [ ] **Dashboard** - statistika sajta
- [ ] **Manage users** (approve, ban, verify)
- [ ] **Manage profiles** (approve, feature, delete)
- [ ] **Moderate reviews**
- [ ] **Manage categories**
- [ ] **Manage locations** (cities/countries)
- [ ] **Settings** (site-wide)

## 🚀 TEHNIČKI STACK (PREPORUKA)

### Frontend
- **Framework:** Next.js 14+ (React) ili Nuxt 3 (Vue)
- **Styling:** Tailwind CSS
- **UI Library:** Shadcn/ui ili DaisyUI
- **State Management:** Zustand ili Pinia
- **Maps:** Leaflet ili Google Maps
- **Image Upload:** Uploadcare ili Cloudinary

### Backend
- **Database:** ✅ Supabase PostgreSQL (već konfigurisano)
- **Auth:** ✅ Supabase Auth
- **Storage:** Supabase Storage (slike/video)
- **Real-time:** Supabase Realtime (messages, notifications)
- **API:** Supabase REST API + Edge Functions

### DevOps
- **Hosting:** Vercel (frontend) + Supabase (backend)
- **CDN:** Cloudflare ili Vercel Edge
- **Analytics:** Plausible ili Google Analytics

## 📝 PRIORITET IMPLEMENTACIJE

### Phase 1: MVP (Minimum Viable Product)
1. ✅ Auth sistem (login/register)
2. ✅ Profili (create, edit, view)
3. ✅ Photo upload
4. ✅ Osnovna pretraga i filteri
5. ✅ Listings page
6. ✅ Profile page

### Phase 2: Core Features
7. ✅ Messages sistem
8. ✅ Favorites
9. ✅ Reviews/Ratings
10. ✅ Status updates
11. ✅ Stories (24h)
12. ✅ Bookings

### Phase 3: Advanced Features
13. ✅ City Tours
14. ✅ Jobs & Rentals
15. ✅ Video gallery
16. ✅ Advanced search (map view)
17. ✅ Multi-language
18. ✅ Admin panel

### Phase 4: Premium & Optimization
19. ✅ Subscription plans
20. ✅ Payment integration
21. ✅ SEO optimization
22. ✅ Performance tuning
23. ✅ Mobile app (opciono)

---

## 🎯 SLEDEĆI KORAK

Da li želite da:
1. **Krenem sa frontendom?** (Next.js/React dizajn)
2. **Prvo popunim bazu?** (testni podaci za demo)
3. **Napravim API funkcije?** (CRUD za sve tabele)
4. **Sve odjednom?** (full-stack od početka)

Recite mi šta želite i krećemo! 🚀

