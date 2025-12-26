# 📋 OBJAŠNJENJE UKLANJANJA TABELA

## ❌ UKLONJENE TABELE (5 tabela)

### 1. **city_tours**
**Razlog uklanjanja:** Nije spomenuto u zahtevima za nicemodels.ch

**Alternativa:** Ako bude potrebno u budućnosti, može se dodati kasnije.

---

### 2. **jobs**
**Razlog uklanjanja:** Nije spomenuto u zahtevima za nicemodels.ch

**Alternativa:** Ako bude potrebno u budućnosti, može se dodati kasnije.

---

### 3. **languages**
**Razlog uklanjanja:** Jezici su već implementirani u `model_details` tabeli kao:
- `speaks_languages text[]` - array jezika koje model govori

**Alternativa:** Koristiti `model_details.speaks_languages` array umesto posebne tabele.

**Primer upotrebe:**
```sql
-- Umesto:
SELECT * FROM languages WHERE model_id = '...';

-- Koristiti:
SELECT speaks_languages FROM model_details WHERE id = '...';
```

---

### 4. **model_languages**
**Razlog uklanjanja:** Duplikat funkcionalnosti. Jezici su već u `model_details.speaks_languages` kao array.

**Alternativa:** Koristiti `model_details.speaks_languages` array.

---

### 5. **model_rates**
**Razlog uklanjanja:** Cene su već implementirane u `model_details` tabeli kao:
- `price_per_hour numeric` - cena po satu
- `price_per_night numeric` - cena po noći

**Alternativa:** Koristiti `model_details.price_per_hour` i `model_details.price_per_night` umesto posebne tabele.

**Primer upotrebe:**
```sql
-- Umesto:
SELECT * FROM model_rates WHERE model_id = '...' AND rate_type = 'incall';

-- Koristiti:
SELECT price_per_hour, price_per_night, accepts_incall, accepts_outcall 
FROM model_details 
WHERE id = '...';
```

---

## ✅ ZADRŽANE TABELE (36 tabela)

Sve ostale tabele su zadržane jer su potrebne za funkcionalnosti iz zahteva:

### Osnovne:
- ✅ `profiles` - Glavni profili
- ✅ `model_details` - Detalji modela (comp kartice)
- ✅ `company_details` - Detalji tvrtki (comp kartice)

### Regije:
- ✅ `regions` - Švicarske regije
- ✅ `model_regions` - Many-to-many veza model-regija

### Pretplate i Shop:
- ✅ `pricing_plans` - Planovi pretplate
- ✅ `subscriptions` - Aktivne pretplate
- ✅ `shop_products` - Proizvodi u trgovini
- ✅ `orders` - Narudžbe
- ✅ `payment_transactions` - Plaćanja

### Baneri:
- ✅ `banner_placements` - Mjesta za banere
- ✅ `banners` - Oglasni baneri
- ✅ `banner_clicks` - Tracking klikova

### Networking:
- ✅ `connections` - Umrežavanje
- ✅ `networking_credits` - Praćenje besplatnih zahtjeva

### Stories i Status:
- ✅ `stories` - 24-satne priče
- ✅ `status_updates` - Tekstualni status update
- ✅ `story_views` - Praćenje pregleda priča

### Galerije:
- ✅ `photos` - Fotografije
- ✅ `videos` - Video

### Gifting:
- ✅ `gift_cards` - Darivanje comp-kartica

### Korisničke funkcionalnosti:
- ✅ `favorites` - Omiljeni modeli (max 50)
- ✅ `messages` - Poruke između korisnika
- ✅ `reviews` - Recenzije

### Kategorije i Usluge:
- ✅ `categories` - Kategorije modela
- ✅ `model_categories` - Many-to-many veza model-kategorija
- ✅ `services` - Ponude usluga (checkboxovi)
- ✅ `model_services` - Many-to-many veza model-usluge
- ✅ `model_services_for` - Za koga model pruža usluge

### Rentals:
- ✅ `rentals` - Iznajmljivanje stanova (Razno odjeljak)

### Analytics:
- ✅ `profile_views` - Pregledi profila
- ✅ `search_logs` - Logovi pretraga
- ✅ `click_tracking` - Detaljni tracking klikova

### Sistem:
- ✅ `notifications` - Notifikacije
- ✅ `verification_requests` - Zahtjevi za verifikaciju
- ✅ `admin_actions` - Admin logging

---

## 🔄 MIGRACIJA PODATAKA (ako postoji)

Ako imate podatke u uklonjenim tabelama, evo kako ih migrirati:

### Migracija iz `languages` u `model_details.speaks_languages`:
```sql
-- Ako imate podatke u languages tabeli, migrirajte ih:
UPDATE model_details md
SET speaks_languages = (
  SELECT ARRAY_AGG(language_code)
  FROM languages l
  WHERE l.model_id = md.id
)
WHERE EXISTS (SELECT 1 FROM languages WHERE model_id = md.id);
```

### Migracija iz `model_rates` u `model_details`:
```sql
-- Ako imate podatke u model_rates tabeli, migrirajte ih:
UPDATE model_details md
SET 
  price_per_hour = (
    SELECT price 
    FROM model_rates mr 
    WHERE mr.model_id = md.id 
      AND mr.rate_type = 'incall' 
      AND mr.duration = '1 hour'
    LIMIT 1
  ),
  price_per_night = (
    SELECT price 
    FROM model_rates mr 
    WHERE mr.model_id = md.id 
      AND mr.rate_type = 'incall' 
      AND mr.duration LIKE '%night%'
    LIMIT 1
  )
WHERE EXISTS (SELECT 1 FROM model_rates WHERE model_id = md.id);
```

---

## 📊 STATISTIKA

| Pre | Posle | Uklonjeno |
|-----|-------|-----------|
| 41 tabela | 36 tabela | 5 tabela (-12%) |

---

## ⚠️ VAŽNO

1. **Napravite backup** pre pokretanja SQL skripte
2. **Proverite foreign keys** - neke aplikacije mogu referencirati uklonjene tabele
3. **Migrirajte podatke** ako ih imate u uklonjenim tabelama
4. **Ažurirajte aplikaciju** da ne koristi uklonjene tabele

---

**Datum:** $(date)
**Fajl:** `database_remove_unnecessary_tables.sql`

