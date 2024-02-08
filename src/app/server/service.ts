"use server";

import { type Database } from "@/app/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const getServerComponentClient = cache(async () => {
  return createServerComponentClient<Database>({ cookies });
});

export async function addNewEntry(
  userId: string | null | undefined,
  title?: string | null | undefined,
  content?: string | null | undefined,
  tags?: string[] | null | undefined,
  imageUrl?: string | null | undefined
) {
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("entries")
    .insert({
      user_auth_id: userId,
      title,
      content,
      tags,
      image_url: imageUrl,
    })
    .select();
  return { data, error };
}

export async function editEntry(
  entryId: number,
  title?: string | null | undefined,
  content?: string | null | undefined,
  tags?: string[] | null | undefined
) {
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("entries")
    .update({ title: title, content: content, tags: tags })
    .eq("id", entryId);
  return { data, error };
}

export async function getAllEntries(userId: string) {
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("entries")
    .select()
    .eq("user_auth_id", userId);
  return { data, error };
}

export async function getEntry(entryId: number) {
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("entries")
    .select()
    .eq("id", entryId)
    .single();
  return { data, error };
}

export async function deleteEntry(entryId: number) {
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId);
  return { data, error };
}

export async function getUser(userId: string) {
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("auth_id", userId)
    .single();
  return { data, error };
}

export async function makeEntryPublic(entryId: number) {
  const supabase = await getServerComponentClient();
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
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("shared_entries")
    .insert({ uid: sharingUid, entry_id: entryId })
    .select();
  return { data, error };
}

export async function getEntryUsingSharedUid(sharingUid: string) {
  const supabase = await getServerComponentClient();
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
  const supabase = await getServerComponentClient();
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("auth_id", user_auth_id)
    .single();
  return { data, error };
}
