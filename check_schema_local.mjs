import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1] || envContent.match(/SUPABASE_URL=(.*)/)?.[1];
const SUPABASE_KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1] || envContent.match(/SUPABASE_KEY=(.*)/)?.[1];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { data, error } = await supabase.from('dc_color_roles').select('*').limit(1);
    console.log("SCHEMA COLUMNS:", data && data.length > 0 ? Object.keys(data[0]) : "Empty table, but success", error);
}
check();
