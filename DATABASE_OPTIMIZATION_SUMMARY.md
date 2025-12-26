# 📊 REZIME OPTIMIZACIJE BAZE PODATAKA

## 🎯 CILJ
Ukloniti sve tabele i polja koja NISU potrebna prema zahtevima za nicemodels.ch

---

## ❌ UKLONJENE TABELE

### 1. **city_tours** 
**Razlog:** Nije spomenuto u zahtevima. City tours nisu deo osnovnih funkcionalnosti.

### 2. **jobs**
**Razlog:** Nije spomenuto u zahtevima. Oglasi za posao nisu deo specifikacije.

### 3. **rentals**
**Status:** ✅ ZADRŽANO - Spomenuto u zahtevima kao "Razno – odjeljak za najam stanova"

### 4. **bookings**
**Razlog:** Nije spomenuto u zahtevima. Rezervacije nisu deo specifikacije.

### 5. **languages** (posebna tabela)
**Razlog:** Jezici su već u `model_details` kao `speaks_languages text[]` array. Nema potrebe za posebnom tabelom.

### 6. **availability** (posebna tabela)
**Razlog:** Radno vrijeme je već u `model_details` kao `working_hours text` i `working_hours_type` sa `custom_schedule jsonb`. Nema potrebe za posebnom tabelom.

### 7. **model_languages** (ako je postojala)
**Razlog:** Jezici su u `model_details.speaks_languages` kao array.

### 8. **model_rates** (ako je postojala)
**Razlog:** Cene su već u `model_details` kao `price_per_hour` i `price_per_night`.

---

## ✅ ZADRŽANE TABELE (36 tabela)

### Osnovne tabele:
1. ✅ **profiles** - Glavni profili (posjetitelji, modeli, tvrtke, admini)
2. ✅ **model_details** - Detalji modela (comp kartice)
3. ✅ **company_details** - Detalji tvrtki (comp kartice)

### Regije:
4. ✅ **regions** - Švicarske regije
5. ✅ **model_regions** - Many-to-many veza model-regija (plaćanje)

### Pretplate i Shop:
6. ✅ **pricing_plans** - Planovi pretplate (~30 ponuda)
7. ✅ **subscriptions** - Aktivne pretplate
8. ✅ **shop_products** - Proizvodi u trgovini
9. ✅ **orders** - Narudžbe (max 3 koraka)
10. ✅ **payment_transactions** - Plaćanja

### Baneri:
11. ✅ **banner_placements** - Mjesta za banere (4-6 mjesta)
12. ✅ **banners** - Oglasni baneri
13. ✅ **banner_clicks** - Tracking klikova

### Networking:
14. ✅ **connections** - Umrežavanje (model-model, company-model)
15. ✅ **networking_credits** - Praćenje besplatnih zahtjeva

### Stories i Status:
16. ✅ **stories** - 24-satne priče (samo modeli)
17. ✅ **status_updates** - Tekstualni status update
18. ✅ **story_views** - Praćenje pregleda priča

### Galerije:
19. ✅ **photos** - Fotografije (max 20 za modele, 10 za tvrtke)
20. ✅ **videos** - Video (max 3 za modele, 0 za tvrtke)

### Gifting:
21. ✅ **gift_cards** - Darivanje comp-kartica

### Korisničke funkcionalnosti:
22. ✅ **favorites** - Omiljeni modeli (max 50)
23. ✅ **messages** - Poruke između korisnika
24. ✅ **reviews** - Recenzije (samo zvjezdice)

### Kategorije i Usluge:
25. ✅ **rentals** - Iznajmljivanje stanova (Razno odjeljak)
26. ✅ **categories** - Kategorije modela
27. ✅ **model_categories** - Many-to-many veza model-kategorija
28. ✅ **services** - Ponude usluga (checkboxovi)
29. ✅ **model_services** - Many-to-many veza model-usluge
30. ✅ **model_services_for** - Za koga model pruža usluge (Men, Women, Couples, etc.)

### Analytics:
31. ✅ **profile_views** - Pregledi profila
32. ✅ **search_logs** - Logovi pretraga
33. ✅ **click_tracking** - Detaljni tracking klikova

### Sistem:
34. ✅ **notifications** - Notifikacije
35. ✅ **verification_requests** - Zahtjevi za verifikaciju (plaćeno)
36. ✅ **admin_actions** - Admin logging

---

## 🔄 IZMJENE U POSTOJEĆIM TABELAMA

### `model_details`:
- ✅ Zadržano: `speaks_languages text[]` (umjesto posebne tabele)
- ✅ Zadržano: `working_hours text` i `working_hours_type` (umjesto posebne tabele)
- ✅ Zadržano: `price_per_hour` i `price_per_night` (umjesto posebne tabele)
- ✅ Dodano: `working_hours_type` sa opcijama ('custom', 'same', '24/7')
- ✅ Dodano: `custom_schedule jsonb` za custom radno vrijeme

### `profiles`:
- ✅ Zadržano: `email` (ne može se mijenjati)
- ✅ Zadržano: `customer_number` (broj kupca)
- ✅ Zadržano: `role` sa opcijom 'company'

---

## 📋 FUNKCIONALNOSTI PREMA ZAHTEVIMA

### ✅ Početna stranica:
- Stories, comp kartice, baneri
- Integrirana trgovina
- Rotirajuće comp kartice (10x dnevno)
- Registracija (model, tvrtka, posjetitelj)
- Regije
- Više jezika
- Analiza posjetitelja

### ✅ Posjetitelji:
- Registracija (email ne može se mijenjati)
- Omiljeni modeli (do 50)
- Darivanje comp-kartica
- Slanje poruka
- Pretraživanje lokacije

### ✅ Comp kartice:
- Za modele i tvrtke
- Max 20 fotografija i 3 videa (tvrtke 10)
- Status update na 24h
- Jedna regija besplatno, dodatne uz naplatu
- Networking (model-model jednom besplatno, tvrtka-model 5 puta besplatno)
- Verifikacija uz naknadu
- Trgovina tijekom trajanja

### ✅ Baneri:
- Naplata
- Max 3 različita banera po mjestu
- Rotirajući
- 4-6 mjesta na homepage
- Standardno 3 regije, sve regije uz različitu cijenu

### ✅ Trgovina:
- Integrirano na nicemodels.ch
- Kupnja u max 3 koraka
- ~30 ponuda
- Plaćanje: kreditna kartica, PayPal, Twint, Postfinance
- Comp kartica/banner odmah online nakon uplate
- Ručno odobrenje kasnije
- 2 potvrdna okvira (terms + purchase confirmation)

---

## 📊 STATISTIKA

| Metrika | Pre | Posle | Razlika |
|---------|-----|-------|---------|
| **Tabele** | 38 | 36 | -2 (-5%) |
| **Enum tipovi** | 5 | 5 | 0 |
| **Functions** | 6 | 5 | -1 |
| **Triggers** | 4 | 4 | 0 |
| **Views** | 3 | 3 | 0 |
| **RLS Policies** | ~12 | ~12 | 0 |

---

## 🎯 REZULTAT

Optimizovana baza podataka sa **36 tabela** koje su sve potrebne prema zahtevima. Uklonjeno je **2 tabele** koje nisu bile eksplicitno zahtevane:

1. ❌ `city_tours` - Nije u zahtevima
2. ❌ `jobs` - Nije u zahtevima  
3. ❌ `bookings` - Nije u zahtevima
4. ❌ `languages` (posebna tabela) - Jezici su u `model_details` kao array
5. ❌ `availability` (posebna tabela) - Radno vrijeme je u `model_details`
6. ❌ `model_languages` - Nije potrebno
7. ❌ `model_rates` - Cene su u `model_details`

Sve ostale tabele su zadržane jer su potrebne za funkcionalnosti iz zahteva.

---

## 📝 NAPOMENA

- **Services tabela** je zadržana jer je potrebna za checkboxove usluga (polja za potvrdu)
- **model_services_for** je zadržana jer omogućava filtriranje po tome za koga model pruža usluge (Men, Women, Couples, etc.)
- Sve tabele za analytics su zadržane jer je u zahtevima spomenuta "Analiza broja posjetitelja" i "Procjena klikova"

---

**Datum:** $(date)
**Fajl:** `database_schema_OPTIMIZED.sql`

