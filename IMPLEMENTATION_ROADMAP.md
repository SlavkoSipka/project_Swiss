# 🗺️ IMPLEMENTACIJSKI PLAN ZA NICEMODELS.CH

## Kompletna Roadmap prema PDF zahtjevima i and6.com funkcionalnostima

---

## 📦 ŠTO JE NAPRAVLJENO

### ✅ Fase 1: Database Schema (GOTOVO)
- [x] Kreirana kompletna baza podataka
- [x] 38 tabela sa svim relacijama
- [x] Indeksi za performanse
- [x] Row Level Security (RLS) policies
- [x] Automated functions & triggers
- [x] Views za lakši pristup

**Fajl:** `database_schema_COMPLETE.sql`

---

## 🚀 FAZA 2: BACKEND API (Sljedeći korak)

### 2.1 Supabase Setup
```bash
# Potrebno:
1. Kreirati Supabase projekt
2. Izvršiti database_schema_COMPLETE.sql
3. Konfigurirati Supabase client u projektu
```

### 2.2 API Endpoints - PRIORITET 1 (Shop & Plaćanja)

#### 🏪 Shop API
```typescript
// src/lib/api/shop.ts

// Produkti
GET    /api/shop/products              // Lista svih proizvoda (~30)
GET    /api/shop/products/:id          // Detalji proizvoda
GET    /api/shop/pricing-plans         // Pricing planovi

// Narudžbe (max 3 koraka)
POST   /api/shop/orders                // Kreiranje narudžbe (korak 1)
POST   /api/shop/orders/:id/confirm    // Potvrda narudžbe (korak 2)
POST   /api/shop/orders/:id/pay        // Plaćanje (korak 3)
GET    /api/shop/orders/:id            // Status narudžbe
GET    /api/shop/orders                // Sve narudžbe korisnika
```

#### 💳 Payment API
```typescript
// src/lib/api/payments.ts

POST   /api/payments/stripe            // Stripe payment
POST   /api/payments/paypal            // PayPal payment
POST   /api/payments/twint             // Twint payment
POST   /api/payments/postfinance       // Postfinance payment
POST   /api/payments/webhook           // Payment webhook (auto-aktivacija)
GET    /api/payments/transactions      // Historija transakcija
```

**PDF Zahtjev:**
> "Nakon uplate, comp kartica ili banner odmah su online"

---

### 2.3 API Endpoints - PRIORITET 2 (Regije & Pretplate)

#### 🗺️ Regions API
```typescript
// src/lib/api/regions.ts

GET    /api/regions                     // Sve regije (Zurich, Basel, etc.)
GET    /api/regions/:id                 // Detalji regije
POST   /api/regions/auto-detect         // Auto određivanje po postal code
GET    /api/models/:id/regions          // Regije modela
POST   /api/models/:id/regions          // Dodaj regiju (plaćeno nakon prve)
DELETE /api/models/:id/regions/:regionId // Ukloni regiju
```

**PDF Zahtjev:**
> "Područje se automatski određuje prema poštanskom broju"

#### 📋 Subscriptions API
```typescript
// src/lib/api/subscriptions.ts

GET    /api/subscriptions               // Aktivne pretplate korisnika
POST   /api/subscriptions               // Nova pretplata
PUT    /api/subscriptions/:id           // Update pretplate
DELETE /api/subscriptions/:id/cancel    // Otkaži pretplatu
GET    /api/subscriptions/:id/status    // Status pretplate
```

---

### 2.4 API Endpoints - PRIORITET 3 (Banners)

#### 📢 Banners API
```typescript
// src/lib/api/banners.ts

// Samo za tvrtke
GET    /api/banners/placements          // Dostupna mjesta za banere
GET    /api/banners                     // Baneri tvrtke
POST   /api/banners                     // Kreiranje banera (plaćeno)
PUT    /api/banners/:id                 // Update banera
DELETE /api/banners/:id                 // Obriši banner
GET    /api/banners/:id/stats           // Statistika (impressions, clicks)

// Public
GET    /api/banners/active              // Aktivni baneri za region
POST   /api/banners/:id/click           // Track klika
```

**PDF Zahtjev:**
> "Max. 3 različita banera po mjestu i regiji"
> "Rotirajući, naizmjenično na vrhu"

---

### 2.5 API Endpoints - PRIORITET 4 (Networking)

#### 🤝 Connections API
```typescript
// src/lib/api/connections.ts

// Networking
GET    /api/connections                 // Sve veze korisnika
POST   /api/connections/request         // Zahtjev za povezivanje
POST   /api/connections/:id/accept      // Prihvati zahtjev
POST   /api/connections/:id/reject      // Odbij zahtjev
DELETE /api/connections/:id             // Prekini vezu
GET    /api/connections/credits         // Besplatni krediti

// Plaćanje
POST   /api/connections/buy-credits     // Kupi networking credits
```

**PDF Zahtjev:**
> "Model-model jednom besplatno"
> "Pet besplatnih zahtjeva tvrtki za modele"

---

### 2.6 API Endpoints - PRIORITET 5 (Stories & Status)

#### 📱 Stories API
```typescript
// src/lib/api/stories.ts

// 24-satne priče (samo modeli, bez tvrtki)
GET    /api/stories                     // Sve aktivne priče
GET    /api/stories/:modelId            // Priče modela
POST   /api/stories                     // Nova priča (photo/video)
DELETE /api/stories/:id                 // Obriši priču
POST   /api/stories/:id/view            // Track view
GET    /api/stories/:id/viewers         // Lista viewera

// Status updates
GET    /api/status/:modelId             // Status modela
POST   /api/status                      // Novi status
PUT    /api/status/:id                  // Update statusa
DELETE /api/status/:id                  // Obriši status
```

**PDF Zahtjev:**
> "Ažuriranja statusa na 24 sata (video/fotografija) bez tvrtki"
> "Idite izravno na komp karticu modela s ažuriranja statusa"

---

### 2.7 API Endpoints - PRIORITET 6 (Photos & Videos sa Limitima)

#### 📸 Media API
```typescript
// src/lib/api/media.ts

// Photos (max 20 za modele, 10 za tvrtke)
GET    /api/models/:id/photos           // Sve fotografije
POST   /api/models/:id/photos           // Upload (provjera limita!)
DELETE /api/photos/:id                  // Obriši fotografiju
PUT    /api/photos/:id/primary          // Postavi kao primarnu
POST   /api/photos/:id/verify-request   // Zahtjev za verifikaciju

// Videos (max 3 za modele, 0 za tvrtke)
GET    /api/models/:id/videos           // Svi videi
POST   /api/models/:id/videos           // Upload (provjera limita!)
DELETE /api/videos/:id                  // Obriši video
```

**PDF Zahtjev:**
> "Najviše 20 fotografija i 3 videa (tvrtke 10)"

---

### 2.8 API Endpoints - PRIORITET 7 (Verifikacija)

#### ✅ Verification API
```typescript
// src/lib/api/verification.ts

// Za modele (plaćeno)
POST   /api/verification/request        // Zahtjev za verifikaciju
GET    /api/verification/status         // Status zahtjeva
POST   /api/verification/upload-docs    // Upload dokumenata

// Za admin
GET    /api/admin/verification/pending  // Pending zahtjevi
POST   /api/admin/verification/:id/approve   // Odobri
POST   /api/admin/verification/:id/reject    // Odbij
```

**PDF Zahtjev:**
> "Polje za potvrdu za verifikaciju (uz naknadu)"

---

### 2.9 API Endpoints - PRIORITET 8 (Gifting)

#### 🎁 Gifts API
```typescript
// src/lib/api/gifts.ts

// Darivanje comp-kartica
POST   /api/gifts/send                  // Pošalji dar
GET    /api/gifts/received              // Primljeni darovi
POST   /api/gifts/:id/redeem            // Iskoristi dar
GET    /api/gifts/history               // Historija darova
```

**PDF Zahtjev:**
> "Mogućnost darivanja komp-kartice djevojkama (dar za dame?)"

---

### 2.10 API Endpoints - OSTALO

#### 👤 Profiles API (Prošireno)
```typescript
// src/lib/api/profiles.ts

// Modeli
GET    /api/models                      // Lista modela
GET    /api/models/:id                  // Profil modela
PUT    /api/models/:id                  // Update profila
GET    /api/models/:id/stats            // Statistika (views, clicks)

// Tvrtke
GET    /api/companies                   // Lista tvrtki
GET    /api/companies/:id               // Profil tvrtke
PUT    /api/companies/:id               // Update profila

// Posjetitelji
GET    /api/visitors/:id/favorites      // Favoriti (max 50!)
POST   /api/visitors/:id/favorites      // Dodaj favorit
DELETE /api/visitors/:id/favorites/:modelId  // Ukloni favorit
```

#### 💬 Messages API
```typescript
// src/lib/api/messages.ts

GET    /api/messages                    // Sve poruke
GET    /api/messages/conversations      // Konverzacije
POST   /api/messages                    // Pošalji poruku
PUT    /api/messages/:id/read           // Označi kao pročitano
DELETE /api/messages/:id                // Obriši poruku
```

#### 🔍 Search API
```typescript
// src/lib/api/search.ts

GET    /api/search                      // Pretraga modela
GET    /api/search/filters              // Dostupni filteri
POST   /api/search/log                  // Log pretrage (analytics)
GET    /api/search/suggestions          // Auto-complete suggestions
```

#### 📊 Analytics API
```typescript
// src/lib/api/analytics.ts

GET    /api/analytics/profile-views     // Broj pregleda profila
GET    /api/analytics/clicks            // Klikovi po tipu
GET    /api/analytics/searches          // Search analytics
GET    /api/analytics/top-models        // Top modeli
GET    /api/analytics/visitors          // Broj posjetitelja
```

---

## 🎨 FAZA 3: FRONTEND (UI/UX)

### 3.1 Stranice - PRIORITET 1

#### 🏠 Homepage
```
/
├── Hero sekcija sa search barom
├── Stories/Priče (24h) - rotirajuće
├── Featured modeli - rotirajući comp cards (10x dnevno na vrh)
├── Kategorije (Escort, Trans, Massage, etc.)
├── Baneri (4-6 mjesta, rotirajući)
├── Top modeli po regijama
└── Footer sa linkovima
```

**PDF Zahtjev:**
> "Jasna, jednostavna za korištenje, elegantna, funkcionalna"
> "Rotirajuće comp kartice, najmanje 10 puta dnevno na vrhu"

#### 🔍 Search Page
```
/search
├── Filteri (regija, kategorija, cijena, itd.)
├── "Koristi moju lokaciju" button
├── Grid profila modela
├── Paginacija
└── Banner mjesta
```

**PDF Zahtjev:**
> "Pretraživanje lokacije (upotrijebi moju lokaciju)"

#### 👤 Model Profile (Comp Card)
```
/profile/:id
├── Avatar + Verifikacija badge (100% VERIFIED)
├── Osnovne info (ime, godine, lokacija, regije)
├── Foto galerija (max 20 slika)
├── Video galerija (max 3 videa)
├── Status update (24h)
├── Usluge (checkboxes)
├── Ocjene (samo zvjezdice?)
├── Contact buttons (Phone, WhatsApp, Email)
├── Similar profiles
└── Click tracking na sve elemente
```

**PDF Zahtjev:**
> "Najviše 3 kartice (o meni, kontakt podaci, usluge, fotografije)"

---

### 3.2 Stranice - PRIORITET 2 (Shop)

#### 🏪 Shop/Trgovina
```
/shop
├── Pricing Plans (~30 proizvoda)
├── Comp card packages
├── Banner packages
├── Verification packages
├── Additional regions
├── Networking credits
├── Top rotation
└── Gift cards
```

**Checkout (Max 3 koraka):**
```
/shop/checkout
Step 1: Odabir proizvoda + košarica
Step 2: Potvrda narudžbe + Terms acceptance (2 checkboxa!)
Step 3: Plaćanje (Stripe/PayPal/Twint/Postfinance)
```

**PDF Zahtjev:**
> "Kupnja u najviše tri koraka"
> "Drugi potvrdni okvir (potvrda kupnje uz naknadu)"

---

### 3.3 Stranice - PRIORITET 3 (User Dashboard)

#### 📊 Model Dashboard
```
/dashboard
├── Profil pregled
├── Statistika (views, clicks, messages)
├── Aktivna pretplata
├── Upravljanje fotografijama (upload, delete)
├── Upravljanje videima
├── Stories management
├── Status updates
├── Regije (dodaj/ukloni)
├── Networking (zahtjevi, veze)
├── Poruke
└── Narudžbe/Plaćanja
```

#### 🏢 Company Dashboard
```
/company/dashboard
├── Profil pregled
├── Upravljanje banerima
├── Banner statistika
├── Networking (zahtjevi za modele)
├── Jobs postovi
├── Rentals postovi
└── Narudžbe/Plaćanja
```

#### 👨 Visitor Dashboard
```
/visitor/dashboard
├── Favoriti (max 50)
├── Poruke
├── Bookings
├── Gift history
└── Settings
```

---

### 3.4 Stranice - PRIORITET 4 (Ostalo)

#### Ostale stranice:
```
/login                    // Login forma
/register                 // Registracija (model/company/visitor)
/verify-email             // Email verifikacija
/city-tours               // City tours lista
/jobs                     // Job listings
/rentals                  // Rent listings
/terms                    // Uvjeti korištenja
/privacy                  // Politika privatnosti
/contact                  // Kontakt forma
/admin                    // Admin panel
```

---

## 🛠️ FAZA 4: INTEGRACIJE

### 4.1 Payment Providers
- [ ] **Stripe** - Kreditne kartice
- [ ] **PayPal** - PayPal plaćanja
- [ ] **Twint** - Швајцарски payment sistem
- [ ] **Postfinance** - Швајцарска pošta

### 4.2 File Storage
- [ ] **Supabase Storage** ili **Cloudinary**
  - Upload fotografija (max 20)
  - Upload videa (max 3)
  - Story media (24h auto-delete)
  - Banner images

### 4.3 Multi-language
- [ ] **Next.js i18n** ili **Google Translate API**
  - DE, FR, IT, EN (minimum)
  
**PDF Zahtjev:**
> "Više jezika (Google Translate/Deepl?)"

### 4.4 Geolocation
- [ ] **Google Maps API** ili **Mapbox**
  - "Koristi moju lokaciju"
  - Auto-određivanje regije po postal code

### 4.5 Email Notifications
- [ ] **Resend** ili **SendGrid**
  - Welcome emails
  - Booking confirmations
  - Payment confirmations
  - Subscription expiry warnings

---

## 📱 FAZA 5: MOBILE APP (Opciono)

**PDF Zahtjev:**
> "Sve kompatibilno s mobilnim telefonima (aplikacija?)"

### Opcije:
1. **PWA (Progressive Web App)** - Najlakše
2. **React Native** - Native aplikacija
3. **Flutter** - Crossplatform

---

## 🔐 FAZA 6: SECURITY & COMPLIANCE

### 6.1 Security
- [ ] Row Level Security (RLS) - ✅ DONE
- [ ] Email ne može se mijenjati - ✅ DONE
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting na API
- [ ] CAPTCHA na registraciju
- [ ] Content moderation (AI?)

### 6.2 Legal
- [ ] Terms & Conditions - ✅ Checkbox required
- [ ] Privacy Policy
- [ ] Cookie Consent
- [ ] Age verification (18+)
- [ ] GDPR compliance
- [ ] Content ownership rights

**PDF Zahtjev:**
> "Uvjeti i odredbe te uvjeti korištenja moraju biti prihvaćeni (kvačica)"

---

## 📈 FAZA 7: ANALYTICS & MONITORING

### 7.1 Analytics
- [ ] Google Analytics
- [ ] Visitor analytics (custom) - ✅ DB ready
- [ ] Click tracking - ✅ DB ready
- [ ] Search analytics - ✅ DB ready
- [ ] Banner performance - ✅ DB ready

**PDF Zahtjev:**
> "Analiza broja posjetitelja?"
> "Procjena klikova?"

### 7.2 Monitoring
- [ ] Sentry (Error tracking)
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## 🚀 DEPLOYMENT PLAN

### Phase 1: Beta Launch
1. Setup Supabase production
2. Deploy backend na Vercel/Railway
3. Deploy frontend na Vercel
4. Setup payment accounts
5. Invite first 10 models (beta)

### Phase 2: Soft Launch
1. Open registrations
2. Activate payment system
3. Monitor for bugs
4. Collect feedback

### Phase 3: Public Launch
1. Full marketing campaign
2. SEO optimization
3. Social media presence
4. Partnerships sa klubovima

---

## ⏱️ TIMELINE PROCJENA

### Sprint 1 (2 tjedna): Backend Core
- [ ] Supabase setup
- [ ] Shop API
- [ ] Payment API
- [ ] Subscriptions API

### Sprint 2 (2 tjedna): Backend Features
- [ ] Regions API
- [ ] Banners API
- [ ] Networking API
- [ ] Media API

### Sprint 3 (2 tjedna): Frontend Core
- [ ] Homepage
- [ ] Search
- [ ] Model profiles
- [ ] Auth (login/register)

### Sprint 4 (2 tjedna): Frontend Features
- [ ] Shop & Checkout
- [ ] Dashboards
- [ ] Stories
- [ ] Messages

### Sprint 5 (1 tjedan): Integracije
- [ ] Payment providers
- [ ] File storage
- [ ] Email
- [ ] Geolocation

### Sprint 6 (1 tjedan): Testing & Polish
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Security audit
- [ ] Legal compliance

### Sprint 7 (1 tjedan): Deployment
- [ ] Beta launch
- [ ] Monitoring
- [ ] Feedback collection

**Total: ~9 tjedana (2 mjeseca)**

---

## 💰 REVENUE STREAMS (iz PDF-a)

### Za modele:
1. Online comp card (plaćeno)
2. Dodatne regije (plaćeno)
3. Dodatne fotografije (preko 20)
4. Networking veze (nakon prve besplatne)
5. Verifikacija (plaćeno)
6. Top rotacija (10x dnevno)

### Za tvrtke:
1. Online comp card (plaćeno)
2. Dodatne regije (plaćeno)
3. Baneri (plaćeno - različite cijene)
4. Networking krediti (nakon 5 besplatnih)
5. Job postings?
6. Rental postings?

### Za posjetitelje:
1. Gift cards za modele
2. Premium features?

---

## 📝 ZAKLJUČAK

### ✅ Što je spremno:
1. **Kompletna baza podataka** sa svim tabelama
2. **Database schema** sa constraints i triggers
3. **RLS policies** za security
4. **Detaljni roadmap** za implementaciju

### ⏳ Što treba napraviti:
1. **Backend API** (2-3 tjedna)
2. **Frontend UI** (2-3 tjedna)
3. **Integracije** (1 tjedan)
4. **Testing** (1 tjedan)

### 🎯 Prioriteti:
1. **Shop & Payment system** - Najvažnije!
2. **Regions & Multi-location** - Kritično!
3. **Banner system** - Revenue stream!
4. **Networking** - Unique feature!
5. **Stories & Status** - Engagement!

---

**Ready to start building! 🚀**

Sljedeći korak: **Setup Supabase i izvršavanje `database_schema_COMPLETE.sql`**

