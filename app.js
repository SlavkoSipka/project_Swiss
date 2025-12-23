// Supabase konfiguracija
const SUPABASE_URL = 'https://ykzqjwqomaeuppubofid.supabase.co';
const SUPABASE_KEY = 'sb_publishable_59LDwQCZ_WDDMKseQplCwA_-Llwv06w';

// Inicijalizacija Supabase klijenta
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============= CRUD FUNKCIJE =============

// CREATE - Dodaj novi red u tabelu
async function insertData(tableName, data) {
    try {
        const { data: result, error } = await supabase
            .from(tableName)
            .insert(data)
            .select();
        
        if (error) throw error;
        console.log('✅ Podaci uspešno dodati:', result);
        return result;
    } catch (error) {
        console.error('❌ Greška pri dodavanju:', error.message);
        return null;
    }
}

// READ - Učitaj sve podatke iz tabele
async function getAllData(tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');
        
        if (error) throw error;
        console.log('✅ Podaci učitani:', data);
        return data;
    } catch (error) {
        console.error('❌ Greška pri učitavanju:', error.message);
        return null;
    }
}

// READ - Učitaj podatke sa filterom
async function getFilteredData(tableName, column, value) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq(column, value);
        
        if (error) throw error;
        console.log('✅ Filtrirani podaci:', data);
        return data;
    } catch (error) {
        console.error('❌ Greška pri filtriranju:', error.message);
        return null;
    }
}

// UPDATE - Ažuriraj podatke
async function updateData(tableName, id, newData) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .update(newData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        console.log('✅ Podaci ažurirani:', data);
        return data;
    } catch (error) {
        console.error('❌ Greška pri ažuriranju:', error.message);
        return null;
    }
}

// DELETE - Obriši podatke
async function deleteData(tableName, id) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id)
            .select();
        
        if (error) throw error;
        console.log('✅ Podaci obrisani:', data);
        return data;
    } catch (error) {
        console.error('❌ Greška pri brisanju:', error.message);
        return null;
    }
}

// ============= PRIMERI KORIŠĆENJA =============

// Primer 1: Dodaj novi red
// insertData('users', { name: 'Filip', email: 'filip@example.com' });

// Primer 2: Učitaj sve podatke
// getAllData('users');

// Primer 3: Filtriraj podatke
// getFilteredData('users', 'name', 'Filip');

// Primer 4: Ažuriraj podatke
// updateData('users', 1, { name: 'Filip Updated' });

// Primer 5: Obriši podatke
// deleteData('users', 1);

// ============= DODATNE FUNKCIJE =============

// Pretraživanje teksta (LIKE)
async function searchData(tableName, column, searchTerm) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .ilike(column, `%${searchTerm}%`);
        
        if (error) throw error;
        console.log('✅ Rezultati pretrage:', data);
        return data;
    } catch (error) {
        console.error('❌ Greška pri pretraživanju:', error.message);
        return null;
    }
}

// Sortiranje podataka
async function getSortedData(tableName, column, ascending = true) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order(column, { ascending: ascending });
        
        if (error) throw error;
        console.log('✅ Sortirani podaci:', data);
        return data;
    } catch (error) {
        console.error('❌ Greška pri sortiranju:', error.message);
        return null;
    }
}

// Brojanje redova
async function countRows(tableName) {
    try {
        const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        console.log('✅ Broj redova:', count);
        return count;
    } catch (error) {
        console.error('❌ Greška pri brojanju:', error.message);
        return null;
    }
}

// Real-time subsription (slušaj promene u tabeli)
function subscribeToChanges(tableName, callback) {
    const subscription = supabase
        .channel(`${tableName}_changes`)
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: tableName }, 
            (payload) => {
                console.log('🔔 Promena u bazi:', payload);
                callback(payload);
            }
        )
        .subscribe();
    
    return subscription;
}

// Odjava od real-time praćenja
async function unsubscribe(subscription) {
    await supabase.removeChannel(subscription);
    console.log('✅ Subscription prekinut');
}

console.log('🚀 Supabase je spreman! Pozovite funkcije iz konzole.');

