import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://tshvtyfcklpmrygztldp.supabase.co"; // Replace with correct one from .env if possible
const supabaseKey = process.env.SUPABASE_KEY || ""; 
// Wait, I can just use a bash command `curl` to Supabase, but I don't know the URL. It's in `.env`
