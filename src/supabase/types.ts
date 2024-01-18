export interface BlogEntry {
  id: number;
  content: string | null;
  created_at: string;
  last_updated_at: string | null;
  title: string | null;
  user_id: number | null;
}

export interface User {
  id: number;
  auth_id: string | null;
  created_at: string;
  email: string | null;
  username: string | null;
}
