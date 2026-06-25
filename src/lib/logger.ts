import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function logAction(userName: string, action: string, details: string, platform: string = "dashboard") {
  try {
    const { data, error } = await supabase.from("audit_logs").insert([{
      user_name: userName,
      action,
      details,
      platform
    }]);
    if (error) {
      console.error("[LOGGER ERROR] Supabase error:", error);
    } else {
      console.log(`[LOGGER SUCCESS] Logged action: ${action}`);
    }
  } catch (err) {
    console.error("[LOGGER EXCEPTION] Failed to log action", err);
  }
}
