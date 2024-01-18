import { supabase } from "./supabaseClient";
import { User, Session, AuthError } from "@supabase/supabase-js";

interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: AuthError | Error | null;
}

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (data?.user) {
    await supabase.from("users").insert({
      auth_id: data?.user.id,
      username: username,
      email: data?.user.email,
    });
  }

  return { user: data?.user, session: data?.session, error };
}

export async function login(
  email: string | undefined,
  username: string | undefined,
  password: string
): Promise<AuthResponse> {
  if (!email && !username) {
    return { error: new Error("Username or email required.") };
  }
  if (!password) {
    return { error: new Error("Password required.") };
  }

  if (username) {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single();

    if (error || !data || !data.email) {
      return { error: new Error(error?.details || "User not found.") };
    }

    const signInResponse = await supabase.auth.signInWithPassword({
      email: data.email,
      password,
    });

    return {
      user: signInResponse.data.user,
      session: signInResponse.data.session,
      error,
    };
  }

  if (email) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  }
  // Fallback case
  return { error: new Error("Login was unsuccessful. Please check logs.") };
}

export async function addNewEntry(
  userId: string | null | undefined,
  title?: string | null | undefined,
  content?: string | null | undefined
) {
  const { data, error } = await supabase
    .from("entries")
    .insert({
      user_auth_id: userId,
      title: title,
      content: content,
    })
    .select();
  return { data, error };
}

export async function getAllEntries(userId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select()
    .eq("user_auth_id", userId);
  return { data, error };
}
