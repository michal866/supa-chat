import { createClient } from "@supabase/supabase-js";
import type { Database } from "../assets/supabase";

export const env = {
  production: false,
  supabaseUrl: "https://gdrwznuyaryrewbxdrha.supabase.co/",
  supabasePublishableKey: "sb_publishable_Duu5kH3KdtqsRGxe6nBp_g__L6OLMZW",
};

export const redirects = {
  passwordReset: "http://localhost:5200",
  afterSignUp: "http://localhost:5200",
};

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabasePublishableKey,
);
