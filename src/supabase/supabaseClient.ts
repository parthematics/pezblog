import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.REACT_APP_SUPABASE_PROJECT_URL ?? "";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_API_KEY ?? "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
