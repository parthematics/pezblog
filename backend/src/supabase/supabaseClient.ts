import { createClient } from "@supabase/supabase-js";
import { type Database } from "./database.types";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_API_KEY ?? "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
