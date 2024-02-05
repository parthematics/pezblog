"use server";

import { type Database } from "./database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerComponentClient<Database>({
  cookies,
});

export async function addNewEntry(
  userId: string | null | undefined,
  title?: string | null | undefined,
  content?: string | null | undefined,
  tags?: string[] | null | undefined
) {
  const { data, error } = await supabase
    .from("entries")
    .insert({
      user_auth_id: userId,
      title,
      content,
      tags,
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

export async function getEntry(entryId: number) {
  const { data, error } = await supabase
    .from("entries")
    .select()
    .eq("id", entryId)
    .single();
  return { data, error };
}

export async function deleteEntry(entryId: number) {
  const { data, error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId);
  return { data, error };
}

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("auth_id", userId)
    .single();
  return { data, error };
}

export async function makeEntryPublic(entryId: number) {
  const { data, error } = await supabase
    .from("entries")
    .update({ is_private: false })
    .eq("id", entryId);
  return { data, error };
}

export async function associateEntryWithSharedUid(
  sharingUid: string,
  entryId: number
) {
  const { data, error } = await supabase
    .from("shared_entries")
    .insert({ uid: sharingUid, entry_id: entryId })
    .select();
  return { data, error };
}

export async function getEntryUsingSharedUid(sharingUid: string) {
  const { data, error } = await supabase
    .from("shared_entries")
    .select("entry_id")
    .eq("uid", sharingUid)
    .single();

  if (!error) {
    return await getEntry(data?.entry_id ?? 0);
  } else {
    return { data: null, error };
  }
}

export async function getUsernameFromAuthId(user_auth_id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("auth_id", user_auth_id)
    .single();
  return { data, error };
}

export async function emailExists(email: string) {
  const { error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  return !error;
}

export async function usernameExists(username: string) {
  const { error } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .single();

  return !error;
}
