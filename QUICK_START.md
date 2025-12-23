# ⚡ QUICK START - Nice Models Portal

## 🚀 Brzi Pregled

**Projekat:** Nice Models - Premium Escort Portal  
**Status:** ✅ MVP Kompletan (Faza 1)  
**Server:** 🟢 Pokrenut na http://localhost:3000  
**Tech Stack:** Next.js 14 + TypeScript + Tailwind + Supabase

---

## 📍 Trenutna Lokacija Fajlova

```
C:\Users\filip\Documents\project_Swiss\
├── nice-models\          ← GLAVNI PROJEKAT (Next.js)
│   ├── src\              ← Izvorni kod
│   ├── .env.local        ← Supabase kredencijali
│   └── package.json
├── database_schema_extended.sql  ← SQL schema
├── FEATURES_CHECKLIST.md         ← Lista features
├── PROJECT_SUMMARY.md            ← Kompletan pregled
└── QUICK_START.md               ← Ovaj fajl
```

---

## ⚡ Brze Komande

### Pokreni Server (ako nije pokrenut)
```bash
cd nice-models
npm run dev
```

### Otvori u Browseru
```
http://localhost:3000           # Landing page
http://localhost:3000/search    # Search stranica
http://localhost:3000/profile/1 # Profile stranica
http://localhost:3000/login     # Login
http://localhost:3000/register  # Register
```

### Zaustavi Server
```
Ctrl + C (u terminalu)
```

### Rebuild (ako nešto ne radi)
```bash
cd nice-models
rm -rf .next
npm run dev
```

---

## 🗄️ Supabase Setup (Ako još nisi uradio)

### 1. Otvori Supabase Dashboard
```
https://supabase.com/dashboard
```

### 2. Idi na SQL Editor
```
Dashboard → SQL Editor → New Query
```

### 3. Kopiraj i pokreni SQL
```sql
-- Kopiraj KOMPLETAN sadržaj iz:
database_schema_extended.sql

-- Paste u SQL Editor
-- Klikni "Run" (ili F5)
```

### 4. Proveri da li su tabele kreirane
```
Dashboard → Table Editor
```

Trebalo bi da vidiš:
- profiles
- model_details
- photos
- videos
- reviews
- favorites
- messages
- bookings
- city_tours
- jobs
- rentals
- categories
- languages
- availability
- notifications
- search_logs

---

## 🎯 Test Scenario (Kako testirati sajt)

### 1. Landing Page
```
✓ Otvori http://localhost:3000
✓ Vidi hero sekciju
✓ Testiraj search bar
✓ Klikni na kategorije
✓ Scroll do featured profiles
✓ Klikni na lokacije
```

### 2. Search Page
```
✓ Klikni "Search" u navigaciji
✓ Testiraj filtere (category, location, price)
✓ Scroll kroz profile cards
✓ Hover preko kartica (vidi quick actions)
✓ Klikni "View Profile"
```

### 3. Profile Page
```
✓ Vidi profile header
✓ Klikni na slike (otvara lightbox)
✓ Navigiraj kroz slike (arrows, ESC)
✓ Scroll do reviews
✓ Testiraj contact buttons
✓ Vidi similar profiles
```

### 4. Auth Pages
```
✓ Klikni "Login" u headeru
✓ Testiraj login formu
✓ Klikni "Register here"
✓ Testiraj register formu
✓ Izaberi role (Client / Model)
```

### 5. Mobile View
```
✓ Otvori DevTools (F12)
✓ Toggle device toolbar (Ctrl+Shift+M)
✓ Testiraj mobile menu (hamburger)
✓ Testiraj responsive layout
```

---

## 🔧 Troubleshooting

### Problem: Server ne startuje
```bash
cd nice-models
rm -rf .next node_modules
npm install
npm run dev
```

### Problem: Port 3000 zauzet
```bash
# Zaustavi proces na portu 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ili pokreni na drugom portu:
npm run dev -- -p 3001
```

### Problem: TypeScript greške
```bash
cd nice-models
npm run build
# Vidi greške i ispravi ih
```

### Problem: Tailwind ne radi
```bash
cd nice-models
rm -rf .next
npm run dev
```

### Problem: Supabase konekcija
```bash
# Proveri .env.local fajl:
cat .env.local

# Trebalo bi da vidiš:
NEXT_PUBLIC_SUPABASE_URL=https://ykzqjwqomaeuppubofid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_59LDwQCZ_WDDMKseQplCwA_-Llwv06w
```

---

## 📝 Dodaj Test Podatke (Brzo)

### 1. Registruj se na sajtu
```
http://localhost:3000/register
- Full Name: Test Model
- Email: test@example.com
- Password: test123
- Role: Model
```

### 2. Uzmi User ID iz Supabase
```
Dashboard → Authentication → Users
- Kopiraj ID prvog korisnika
```

### 3. Dodaj model details
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
  'PASTE_USER_ID_OVDE',
  'Zurich',
  'Switzerland',
  'Hello, I am a professional model offering premium services.',
  25,
  168,
  '+41 76 123 4567',
  250
);
```

### 4. Dodaj kategorije
```sql
INSERT INTO categories (name, slug, description) VALUES
('Escorts', 'escorts', 'Professional escort services'),
('Trans', 'trans', 'Transgender companions'),
('VIP', 'vip', 'Premium VIP models'),
('Couples', 'couples', 'Couple services');
```

---

## 🎨 Customization (Brze Izmene)

### Promeni Logo
```typescript
// nice-models/src/components/layout/Header.tsx
// Linija 16:
<span className="...">
  NICE MODELS  ← Promeni ovo
</span>
```

### Promeni Boje
```typescript
// nice-models/tailwind.config.ts
// Dodaj:
colors: {
  primary: '#ec4899',    // pink-500
  secondary: '#9333ea',  // purple-600
}
```

### Promeni Meta Tags
```typescript
// nice-models/src/app/layout.tsx
// Linija 9-10:
export const metadata: Metadata = {
  title: "Tvoj Naslov",
  description: "Tvoj opis",
}
```

---

## 📊 Šta Dalje?

### Prioritet 1: Prave Podatke
1. ✅ Pokreni SQL schema
2. ✅ Dodaj test profil
3. ✅ Konektuj API (zameni mock data)

### Prioritet 2: Dashboard
1. ⏳ User dashboard
2. ⏳ Model dashboard
3. ⏳ Admin panel

### Prioritet 3: Advanced Features
1. ⏳ Real-time chat
2. ⏳ Booking system
3. ⏳ Payment integration

---

## 🚀 Deploy na Production

### Vercel (5 minuta)
```bash
1. Push code na GitHub:
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo>
   git push -u origin main

2. Idi na vercel.com
3. Import GitHub repo
4. Dodaj env variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Deploy!
```

---

## 📞 Pomoć

### Dokumentacija
- `nice-models/README.md` - Kompletan README
- `nice-models/GETTING_STARTED.md` - Detaljno uputstvo
- `PROJECT_SUMMARY.md` - Pregled projekta
- `FEATURES_CHECKLIST.md` - Lista features

### Linkovi
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind Docs: https://tailwindcss.com/docs

### Browser Console
```
F12 → Console
# Vidi greške i warnings
```

---

## ✅ Checklist Pre Deploy

- [ ] SQL schema pokrenut u Supabase
- [ ] Test profil kreiran
- [ ] Sve stranice testirane
- [ ] Mobile view testiran
- [ ] Auth radi
- [ ] Env variables postavljene
- [ ] Build prolazi (`npm run build`)
- [ ] Nema TypeScript grešaka
- [ ] Nema console errors

---

**🎉 Sve je spremno! Otvori http://localhost:3000 i uživaj!** 🚀

