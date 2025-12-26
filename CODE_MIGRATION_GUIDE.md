# 🔄 VODIČ ZA MIGRACIJU KODA

## ⚠️ VAŽNO: Ažuriranje koda nakon uklanjanja tabela

Nakon što uklonite nepotrebne tabele, potrebno je ažurirati kod aplikacije.

---

## 📝 FAJLOVI KOJE TREBA AŽURIRATI

### 1. `nice-models/src/lib/api/profiles.ts`

**Problem:** Koristi `model_languages` i `languages` tabele

**Trenutni kod (linija ~209-244):**
```typescript
// Get languages - pokušaj prvo model_languages, pa languages kao fallback
let languages = null
const { data: modelLanguages } = await supabase
  .from('model_languages')
  .select('*')
  .eq('model_id', id)

if (modelLanguages && modelLanguages.length > 0) {
  // Konvertuj model_languages format u format koji očekuje komponenta
  languages = modelLanguages.map(ml => ({
    language_code: ml.language,
    language_name: ml.language
  }))
} else {
  // Fallback na stari languages format
  const { data: oldLanguages } = await supabase
    .from('languages')
    .select('*')
    .eq('model_id', id)

  languages = oldLanguages
}
```

**Novi kod (koristi `model_details.speaks_languages` array):**
```typescript
// Get languages from model_details.speaks_languages array
const { data: modelDetails } = await supabase
  .from('model_details')
  .select('speaks_languages')
  .eq('id', id)
  .single()

// Konvertuj array u format koji očekuje komponenta
const languages = modelDetails?.speaks_languages?.map((lang: string) => ({
  language_code: lang,
  language_name: lang
})) || []
```

---

### 2. `nice-models/src/components/layout/Header.tsx`

**Problem:** Link na `/jobs` stranicu koja više ne postoji

**Trenutni kod (linija ~131-135):**
```tsx
<Link
  href="/jobs"
  className="text-gray-300 hover:text-pink-400 transition-all"
>
  Jobs
</Link>
```

**Rešenje:** Ukloniti ili komentarisati:
```tsx
{/* Jobs link removed - jobs table not in requirements */}
{/* 
<Link
  href="/jobs"
  className="text-gray-300 hover:text-pink-400 transition-all"
>
  Jobs
</Link>
*/}
```

---

### 3. `nice-models/src/components/layout/Footer.tsx`

**Problem:** Link na `/jobs` stranicu

**Trenutni kod (linija ~50-51):**
```tsx
<Link href="/jobs" className="text-gray-400 hover:text-pink-400 transition-all hover:translate-x-1 inline-block font-medium">
  Jobs
</Link>
```

**Rešenje:** Ukloniti ili komentarisati:
```tsx
{/* Jobs link removed - jobs table not in requirements */}
```

---

### 4. `nice-models/src/components/registration/steps/LanguagesStep.tsx`

**Status:** ✅ OVO JE OK - Komponenta već radi sa array formatom

Komponenta već koristi `data.languages` kao array, što je kompatibilno sa `model_details.speaks_languages text[]`.

**Potrebno proveriti:** Da li se jezici čuvaju u `model_details.speaks_languages` prilikom registracije.

---

### 5. `nice-models/src/app/profile/[id]/page.tsx`

**Problem:** Koristi `profileData.languages` koji dolazi iz uklonjene tabele

**Trenutni kod (linija ~85):**
```typescript
languages: profileData.languages?.map((l: any) => l.language_name || l.language || l) || [],
```

**Novi kod:**
```typescript
// Languages come from model_details.speaks_languages array
languages: profileData.model_details?.speaks_languages || [],
```

---

## 🔧 KORACI ZA MIGRACIJU

### Korak 1: Backup baze podataka
```sql
-- Napravite backup pre bilo kakvih izmena
pg_dump your_database > backup_before_migration.sql
```

### Korak 2: Migrirajte podatke (ako ih imate)

#### Migracija jezika iz `languages` ili `model_languages` u `model_details.speaks_languages`:
```sql
-- Ako imate podatke u languages tabeli
UPDATE model_details md
SET speaks_languages = (
  SELECT ARRAY_AGG(DISTINCT language_code)
  FROM languages l
  WHERE l.model_id = md.id
)
WHERE EXISTS (SELECT 1 FROM languages WHERE model_id = md.id);

-- Ako imate podatke u model_languages tabeli
UPDATE model_details md
SET speaks_languages = (
  SELECT ARRAY_AGG(DISTINCT language)
  FROM model_languages ml
  WHERE ml.model_id = md.id
)
WHERE EXISTS (SELECT 1 FROM model_languages WHERE model_id = md.id);
```

#### Migracija cena iz `model_rates` u `model_details`:
```sql
-- Migrirajte incall cene
UPDATE model_details md
SET price_per_hour = (
  SELECT price 
  FROM model_rates mr 
  WHERE mr.model_id = md.id 
    AND mr.rate_type = 'incall' 
    AND mr.duration = '1 hour'
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM model_rates 
  WHERE model_id = md.id 
    AND rate_type = 'incall' 
    AND duration = '1 hour'
);

-- Migrirajte outcall cene (ako je potrebno)
UPDATE model_details md
SET accepts_outcall = true
WHERE EXISTS (
  SELECT 1 FROM model_rates 
  WHERE model_id = md.id 
    AND rate_type = 'outcall'
);
```

### Korak 3: Uklonite tabele
```sql
-- Pokrenite database_remove_unnecessary_tables.sql
```

### Korak 4: Ažurirajte kod aplikacije
- Ažurirajte `profiles.ts` (vidi iznad)
- Uklonite `/jobs` linkove iz Header i Footer
- Ažurirajte `profile/[id]/page.tsx` za jezike

### Korak 5: Testirajte
- Proverite da li se profili učitavaju ispravno
- Proverite da li se jezici prikazuju ispravno
- Proverite da li registracija čuva jezike ispravno

---

## 📋 CHECKLIST

- [ ] Backup baze podataka
- [ ] Migrirajte podatke iz `languages` u `model_details.speaks_languages`
- [ ] Migrirajte podatke iz `model_languages` u `model_details.speaks_languages`
- [ ] Migrirajte podatke iz `model_rates` u `model_details` (ako je potrebno)
- [ ] Uklonite tabele (pokrenite `database_remove_unnecessary_tables.sql`)
- [ ] Ažurirajte `nice-models/src/lib/api/profiles.ts`
- [ ] Uklonite `/jobs` linkove iz Header i Footer
- [ ] Ažurirajte `nice-models/src/app/profile/[id]/page.tsx`
- [ ] Testirajte učitavanje profila
- [ ] Testirajte prikaz jezika
- [ ] Testirajte registraciju sa jezicima

---

## ⚠️ NAPOMENE

1. **Jezici:** Sada se čuvaju kao `text[]` array u `model_details.speaks_languages`
2. **Cene:** Sada se čuvaju kao `price_per_hour` i `price_per_night` u `model_details`
3. **Jobs:** Linkovi su uklonjeni jer `jobs` tabela nije u zahtevima
4. **City Tours:** Nisu u zahtevima, tako da nema potrebe za njima

---

**Datum:** $(date)

