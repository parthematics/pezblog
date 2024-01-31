import { type Database } from "./database.types";

export interface BlogEntry {
  id: number;
  content: string | null;
  created_at: string;
  is_private: boolean;
  last_updated_at: string | null;
  title: string | null;
  user_auth_id: string | null;
  tags: string[] | null;
}

export interface User {
  id: number;
  auth_id: string | null;
  created_at: string;
  email: string | null;
  username: string | null;
}

export type EntriesResponse = Database["public"]["Tables"]["entries"]["Row"][];
export type EntryResponse = Database["public"]["Tables"]["entries"]["Row"];
export type UserResponse = Database["public"]["Tables"]["users"]["Row"];
export type NewEntryResponse =
  Database["public"]["Tables"]["entries"]["Insert"][];
export type SharedEntryResponse =
  Database["public"]["Tables"]["shared_entries"]["Row"];
