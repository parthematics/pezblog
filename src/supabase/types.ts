export interface BlogEntry {
  content: string | null;
  created_at: string;
  id: number;
  last_updated_at: string | null;
  title: string | null;
  user_id: number | null;
}

export interface User {
  id: string;
  created_at: string;
  username: string;
  email: string;
  auth_id: string;
}
