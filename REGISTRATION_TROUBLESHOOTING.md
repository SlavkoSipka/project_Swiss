# 🔧 Registration Troubleshooting Guide

## Problem: "Database error saving new user"

Ova greška se javlja kada Supabase pokušava da kreira auth user-a, ali ne uspeva zbog problema sa bazom.

---

## ✅ Rešenja (Redosled):

### 1. **Proveri da li `profiles` tabela postoji**

```sql
SELECT * FROM profiles LIMIT 1;
```

**Ako ne postoji**, pokreni:
```sql
database_schema_COMPLETE_SAFE.sql
```

---

### 2. **Proveri RLS Policies**

```sql
-- Pokreni u Supabase SQL Editor:
database_auto_create_profile_trigger.sql
```

Ovo će kreirati policies koje dozvoljavaju:
- ✅ Svi mogu da vide profile (SELECT)
- ✅ Korisnici mogu da kreiraju svoj profil (INSERT WHERE auth.uid() = id)
- ✅ Korisnici mogu da ažuriraju svoj profil (UPDATE WHERE auth.uid() = id)

---

### 3. **Proveri Email Confirmation**

U Supabase Dashboard:
- Authentication → Settings → Email Auth
- **"Confirm email"** → **OFF** (za development)
- Klikni **"Save changes"**

Ako je ON, korisnik mora da potvrdi email pre nego što se kreira profil.

---

### 4. **Proveri Constraint-e**

```sql
-- Proveri da li email ili username već postoje
SELECT email, username FROM profiles 
WHERE email = 'test@example.com' OR username = 'testuser';
```

**Ako postoji**, koristi drugi email/username.

---

### 5. **Proveri Browser Console**

Kada se registruješ, proveri browser console (F12) za:
```
=== AUTH ERROR ===
Message: [tačna greška]
Status: [status code]
```

---

## 📋 Checklist

- [ ] `profiles` tabela postoji
- [ ] RLS policies su postavljene (`database_auto_create_profile_trigger.sql`)
- [ ] Email confirmation je OFF (za development)
- [ ] Email/username nisu već korišćeni
- [ ] Proverio browser console za detalje greške

---

## 🐛 Najčešći Uzroci

1. **RLS Policy blokira INSERT**
   - Rešenje: Pokreni `database_auto_create_profile_trigger.sql`

2. **Email confirmation uključen**
   - Rešenje: Isključi u Supabase Dashboard

3. **Profiles tabela ne postoji**
   - Rešenje: Pokreni `database_schema_COMPLETE_SAFE.sql`

4. **Unique constraint violation**
   - Rešenje: Koristi drugi email/username

---

## 📞 Ako i dalje ne radi:

1. Proveri browser console za tačnu grešku
2. Proveri Supabase Dashboard → Logs za server-side greške
3. Proveri da li su svi SQL fajlovi pokrenuti:
   - `database_schema_COMPLETE_SAFE.sql`
   - `database_auto_create_profile_trigger.sql`
   - `database_registration_wizard_integration.sql`

---

**Status**: ✅ Error Handling Poboljšan | ⏳ Proveri Console za Detalje

