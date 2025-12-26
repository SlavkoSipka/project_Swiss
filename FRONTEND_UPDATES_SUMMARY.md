# 🎨 FRONTEND UPDATES - And6.com Style

## ✅ ŠTO JE URAĐENO

### 1. **RegisterForm.tsx** - Ažurirano ✅

#### Promjene:
- ✅ Zamijenjeno "Full Name" sa "Username"
- ✅ Dodana 3 radio buttona za tip korisnika:
  - 📝 **Member** (posjetitelj)
  - 💃 **Independent Escort / Private Girl** (model)
  - 🏢 **Escort Agency / Club** (tvrtka)
- ✅ Dodani checkboxovi za Terms & Conditions:
  - Terms & Conditions + Consent Policy
  - Privacy Policy
- ✅ Button stil promijenjen u `bg-pink-600` (jednostavniji)

**Fajl:** `nice-models/src/components/auth/RegisterForm.tsx`

---

### 2. **LoginForm.tsx** - Ažurirano ✅

#### Promjene:
- ✅ **Izbačeni Google i Facebook login buttoni**
- ✅ Dodat "Forgot password?" link
- ✅ Button stil promijenjen u `bg-pink-600`
- ✅ Jednostavniji i čistiji dizajn

**Fajl:** `nice-models/src/components/auth/LoginForm.tsx`

---

### 3. **Login Page** - Ažurirano ✅

#### Promjene:
- ✅ **Izbačeni svi social login buttoni** (Google, Facebook)
- ✅ Dodana **"New customers" sekcija** kao na and6.com:
  - Tekst: "Create your personal account within a minute..."
  - Button: "Create user account"
- ✅ Čist i jednostavan dizajn kao and6.com

**Fajl:** `nice-models/src/app/login/page.tsx`

---

### 4. **Profile Edit Page** - NOVO KREIRANO ✅

Kompletna stranica za editovanje profila modela sa svim poljima!

#### Sekcije:

1. **Basic Information** 👤
   - Full Name / Stage Name
   - Phone Number
   - Bio / Description

2. **Location** 📍
   - City
   - Postal Code (za auto-određivanje regije)
   - Address

3. **Physical Attributes** 📏
   - Age
   - Height (cm)
   - Weight (kg)
   - Bust Size
   - Hair Color (dropdown)
   - Eye Color (dropdown)
   - Body Type (dropdown)

4. **Services Offered** ✅
   Checkboxovi za 21 servis:
   - Girlfriend Experience (GFE)
   - Erotic Massage
   - Tantric Massage
   - Couples
   - Outcall / Incall
   - Anal Sex
   - Oral without condom (OWO)
   - French Kissing
   - 69 Position
   - Striptease
   - Role Play
   - BDSM
   - Fetish
   - Foot Fetish
   - Golden Shower
   - Toys
   - Webcam
   - Dinner Date
   - Overnight
   - Travel Companion

5. **Pricing** 💰
   - Price per Hour (CHF)
   - Price per Night (CHF)

6. **Working Hours** 🕐
   - Tekstualno polje
   - Primjeri: "Mon-Fri 10:00-22:00", "24/7", "Nach Vereinbarung"

7. **Contact Preferences** 📱
   Checkboxovi za:
   - ✅ SMS (default: true)
   - ✅ Call (default: true)
   - ✅ WhatsApp (default: true)
   - ❌ Telegram (default: false)

**Fajl:** `nice-models/src/app/profile/edit/page.tsx`

---

### 5. **Dashboard Page** - NOVO KREIRANO ✅

#### Funkcionalnosti:

- **Header** sa:
  - Avatar (prva slova username-a)
  - Welcome message
  - Logout button

- **Stats Cards** (za modele):
  - 👁️ Profile Views
  - ❤️ Favorites
  - 💬 Unread Messages

- **Quick Actions** grid:
  - ✏️ Edit Profile → `/profile/edit`
  - 📤 Upload Photos → `/photos/upload`
  - 👁️ View Public Profile → `/profile/:id`
  - 📊 Analytics → `/analytics`
  - 💬 Messages → `/messages`
  - ⚙️ Settings → `/settings`

- **Recent Activity** sekcija

**Fajl:** `nice-models/src/app/dashboard/page.tsx`

---

## 🎨 DIZAJN STIL

### Boje:
- **Primary:** `pink-600` / `pink-700`
- **Secondary:** `purple-600`
- **Neutral:** `gray-50` / `gray-100` za pozadine

### Komponente:
- Zaobljeni border-ovi (`rounded-lg`)
- Shadows (`shadow-lg`)
- Hover efekti (scale, color change)
- Čist i minimalistički dizajn kao and6.com

---

## 📱 RESPONSIVE DIZAJN

Sve komponente su **mobile-friendly**:
- Grid layout sa `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Responsive padding i margins
- Mobile navigation optimizovana

---

## 🔄 WORKFLOW

### Za Posjetitelja (Member):
1. **Register** → Odabere "Member"
2. **Login**
3. **Dashboard** → Vidi omiljene modele, poruke
4. Može pregledati profile

### Za Model:
1. **Register** → Odabere "Independent Escort / Private Girl"
2. **Login**
3. **Dashboard** → Vidi stats (views, favorites, messages)
4. **Edit Profile** → Unese sve podatke:
   - Osnovne info
   - Lokaciju
   - Fizičke atribute
   - **Servise** (checkboxovi)
   - Cijene
   - Radno vrijeme
   - Kontakt preference
5. **Upload Photos** → Doda fotografije (max 20)
6. **View Public Profile** → Vidi kako profil izgleda

### Za Tvrtku (Agency/Club):
1. **Register** → Odabere "Escort Agency / Club"
2. **Login**
3. **Dashboard**
4. Može postavljati banere, job oglase, rentals

---

## 🗂️ STRUKTURA FOLDERA

```
nice-models/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx ✅ Ažurirano
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx ✅ NOVO
│   │   └── profile/
│   │       └── edit/
│   │           └── page.tsx ✅ NOVO
│   └── components/
│       └── auth/
│           ├── LoginForm.tsx ✅ Ažurirano
│           └── RegisterForm.tsx ✅ Ažurirano
```

---

## 🚀 SLJEDEĆI KORACI

### 1. Upload Photos Page
Kreirati stranicu za upload fotografija:
- Drag & drop
- Multiple file upload
- Preview prije uploada
- Limit: 20 fotografija za modele

### 2. Public Profile Page
Stranica koja prikazuje javni profil modela:
- Sve informacije iz profile edit
- Galerija fotografija
- Contact buttoni (SMS, Call, WhatsApp, Telegram)
- Stories ako postoje

### 3. Homepage Updates
Ažurirati homepage da ima:
- **Stories sekciju** na vrhu
- **Region selector**
- **Filter opcije** (100% verified, With Video, Has Story)
- **Grid profila** sa slikama

### 4. Search/Filter Page
Stranica sa naprednim filterima kao and6.com:
- Region filter
- Category filter
- Filters: Verified, Video, Story, Comments
- Sort opcije

### 5. Messages System
Implementirati messaging:
- Inbox
- Send message
- Real-time notifications

---

## ✨ ZAKLJUČAK

Frontend je sada **kompletno restrukturiran** da liči na and6.com:

✅ Login i Register forme su čiste i jednostavne  
✅ Bez Google/Facebook login buttona  
✅ Radio buttoni za tipove korisnika  
✅ Terms & Privacy checkboxovi  
✅ Kompletna Profile Edit stranica sa **svim poljima i servisima**  
✅ Dashboard sa stats i quick actions  
✅ Kontakt preference (SMS, Call, WhatsApp, Telegram)  
✅ Responsive i mobile-friendly  

**Sve je spremno za dalju implementaciju fotografija, public profila i search funkcionalnosti!** 🎉

