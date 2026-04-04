import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";

// Load env
const envConfig = dotenv.parse(fs.readFileSync(".env.local"));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function investigate() {
  console.log("Fetching dc_settings...");
  const { data: settings, error: err1 } = await supabase.from("dc_settings").select("*").limit(1);
  console.log("Settings:", settings, err1?.message);

  console.log("Fetching auto_responses...");
  const { data: ar, error: err2 } = await supabase.from("auto_responses").select("*").limit(1);
  console.log("auto_responses:", ar, err2?.message);

  console.log("Fetching dc_auto_responses...");
  const { data: dar, error: err3 } = await supabase.from("dc_auto_responses").select("*").limit(1);
  console.log("dc_auto_responses:", dar, err3?.message);
}

investigate();
