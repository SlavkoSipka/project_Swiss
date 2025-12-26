# 📊 Registration Wizard - Database Integration

## ✅ Kompletna SQL Integracija

Kreirana je SQL skripta `database_registration_wizard_integration.sql` koja povezuje **sve podatke iz 9-step registration wizard-a** sa bazom podataka.

---

## 🗄️ Šta je Dodato u Bazu

### 1️⃣ **Proširenje `model_details` Tabele**

#### **Biography Step (Step 1/9)**
```sql
- showname (text) - Ime koje se prikazuje
- slogan (text) - Slogan ili ključna reč
- gender (text) - female, male, trans
- nationality (text) - Nacionalnost
- dress_size (text) - Veličina odeće
- shoe_size (text) - Veličina cipela
- waist (integer) - Struk u cm
- hip (integer) - Kukovi u cm
- cup_size (text) - Velicina grudnjaka
- pubic_hair (text) - shaved, trimmed, natural
- smoking (text) - yes, no, occasionally
- drinking (text) - yes, no, socially
- special_characteristics (text) - Tattoos, piercings, etc.
```

#### **About Me Step (Step 2/9)**
```sql
- description (text) - Opis modela (max 25,000 karaktera)
```

#### **Area/Address Step (Step 4/9)**
```sql
- club_name (text) - Ime kluba
- street (text) - Ulica
- street_number (text) - Broj ulice
- additional_info (text) - Dodatne informacije
- display_address (boolean) - Prikaži adresu na sajtu
```

#### **Services Step (Step 5/9)**
```sql
- sexual_orientation (text) - heterosexual, bisexual, lesbian, gay
```

#### **Working Hours Step (Step 6/9)**
```sql
- working_hours_type (text) - custom, same, 24/7
- custom_schedule (jsonb) - JSON sa rasporedom po danima
- show_as_night_escort (boolean) - Prikaži kao Night Escort
```

#### **Contact Details Step (Step 8/9)**
```sql
- show_phone_number (boolean) - Prikaži broj telefona
- viber (boolean) - Dostupan na Viber
- whatsapp (boolean) - Dostupan na WhatsApp
- telegram (boolean) - Dostupan na Telegram
- no_withheld_numbers (boolean) - Ne prihvaća sakrivene brojeve
- contact_instructions (text) - sms_and_call, sms_only, no_sms, other
- skype_id (text) - Skype ID
- videogirls_url (text) - Videogirls URL
- website (text) - Website
```

#### **Block Countries**
```sql
- block_countries (text[]) - Lista zemalja
- block_mode (text) - block ili allow
```

---

### 2️⃣ **Nove Tabele**

#### **`model_languages`** - Jezici sa nivoima
```sql
- model_id (uuid) - FK na profiles
- language (text) - Naziv jezika
- level (text) - basic, intermediate, fluent, native
```

#### **`services`** - Svi dostupni servisi (94 servisa)
```sql
- name (text) - Naziv servisa
- category (enum) - main, extra, fetish, virtual, massage
- display_order (integer) - Redosled prikaza
```

**Kategorije:**
- **Main Services**: 17 servisa
- **Extra Services**: 32 servisa
- **Fetish/Bizarre**: 19 servisa
- **Virtual Services**: 16 servisa
- **Massage Services**: 10 servisa
- **TOTAL: 94 servisa** ✅

#### **`model_services`** - Veza Model-Servisi (Many-to-Many)
```sql
- model_id (uuid) - FK na profiles
- service_id (uuid) - FK na services
```

#### **`model_services_for`** - Za koga model nudi servise
```sql
- model_id (uuid) - FK na profiles
- service_for (text) - Men, Women, Couples, Trans, Gays, 2+
```

#### **`model_rates`** - Cene za Incall/Outcall
```sql
- model_id (uuid) - FK na profiles
- rate_type (text) - incall ili outcall
- duration (text) - 15 minutes, 1 hour, 2 hours, Overnight, etc.
- price (numeric) - Cena
- currency (text) - CHF (default)
```

---

## 📋 Svi Servisi u Bazi

### Main Services (17)
1. 69 Position
2. Anal Sex
3. Cum in Mouth
4. Cum on Face
5. Dildo Play/Toys
6. Girlfriend Experience (GFE)
7. Blowjob with Condom
8. Blowjob without Condom
9. Blowjob without Condom to Completion
10. Cumshot on body (COB)
11. Erotic massage
12. Kissing if good chemistry
13. Intimate massage
14. Handjob
15. French Kissing
16. Kissing
17. Sex in Different Positions

### Extra Services (32)
A-Level (Anal Sex), Anal Finger, BDSM, Body to Body Massage, Couples, Deep Throat, Dirty Talk, Domination, Erotic Photos & Videos, Facesitting, Foot Fetish, Golden Shower (Give/Receive), Lapdance, Lesbian Show, Lingam Massage, Mistress, Oral without Condom, Passionate Kissing, Photo & Video, Pornstar Experience (PSE), Prostate Massage, Role Play, Sex Toys, Spanking, Squirting, Striptease, Submission, Swallow, Tantric Massage, Threesome, Uniforms

### Fetish/Bizarre (19)
Age Play, Ball Busting, Bondage, CBT, Chastity, Cross Dressing, Face Slapping, Feminization, Financial Domination, Foot Worship, Humiliation, Medical Play, Pet Play, Rimming (Giving/Receiving), Strap-on, Trampling, Wax Play, Worship

### Virtual Services (16)
Cam2Cam, Phone Chat, Sexting, Video Call, Virtual Girlfriend, Custom Videos, Dick Rating, Feet Pics, Live Shows, Premium Snapchat, Selling Panties/Photos/Videos, Skype Shows, WhatsApp Services, OnlyFans

### Massage Services (10)
Classic Massage, Swedish Massage, Thai Massage, Hot Stone Massage, Aromatherapy, Sports Massage, Reflexology, Shiatsu, Nuru Massage, Body Scrub

---

## 🔒 Row Level Security (RLS)

Sve nove tabele imaju RLS policies:
- ✅ **SELECT**: Svi korisnici mogu da vide podatke
- ✅ **INSERT/UPDATE/DELETE**: Samo model može da menja svoje podatke

---

## 📊 View za Pretraživanje

Kreiran je view `model_profile_complete` koji kombinuje:
- Profile info
- Model details
- Languages
- Services
- Services For

```sql
SELECT * FROM model_profile_complete WHERE id = 'model-uuid';
```

---

## 🚀 Kako Koristiti

### 1. Pokreni SQL Skriptu u Supabase

```sql
-- Kopiraj ceo sadržaj iz:
database_registration_wizard_integration.sql

-- I pokreni u Supabase SQL Editor
```

### 2. Backend Integracija

Kada model završi registraciju, podaci se čuvaju:

```typescript
// 1. Osnovni podaci u model_details
await supabase
  .from('model_details')
  .update({
    showname: data.showname,
    slogan: data.slogan,
    gender: data.gender,
    // ... sva ostala polja
  })
  .eq('id', userId)

// 2. Jezici
for (const lang of data.languages) {
  await supabase
    .from('model_languages')
    .insert({
      model_id: userId,
      language: lang.language,
      level: lang.level
    })
}

// 3. Servisi
for (const service of [...data.mainServices, ...data.extraServices, ...]) {
  const serviceId = await getServiceId(service)
  await supabase
    .from('model_services')
    .insert({
      model_id: userId,
      service_id: serviceId
    })
}

// 4. Services For
for (const serviceFor of data.servicesFor) {
  await supabase
    .from('model_services_for')
    .insert({
      model_id: userId,
      service_for: serviceFor
    })
}

// 5. Rates
for (const rate of data.incallRates) {
  await supabase
    .from('model_rates')
    .insert({
      model_id: userId,
      rate_type: 'incall',
      duration: rate.duration,
      price: rate.price,
      currency: rate.currency
    })
}
```

---

## ✅ Checklist

- ✅ Sve booleanove iz Contact Details
- ✅ Svi servisi (94 servisa u 5 kategorija)
- ✅ Languages sa nivoima
- ✅ Rates (incall/outcall)
- ✅ Working hours type i custom schedule
- ✅ Block countries
- ✅ Sve fizičke karakteristike
- ✅ RLS policies
- ✅ Indexi za performanse
- ✅ View za pretraživanje

---

## 📝 Napomene

1. **Services** se čuvaju u posebnoj tabeli sa kategorijama
2. **Languages** imaju nivo (basic, intermediate, fluent, native)
3. **Rates** su fleksibilni - može više cena po tipu (incall/outcall)
4. **Custom Schedule** je JSONB za fleksibilno čuvanje rasporeda
5. **Block Countries** je array sa mode (block/allow)

---

**Status**: ✅ SQL Skripta Kompletna | ⏳ Backend Integracija Pending

