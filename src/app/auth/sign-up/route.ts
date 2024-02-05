"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/app/server/database.types";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const requestData = (await request.json()) as {
    email: string;
    username: string;
    password: string;
  };
  const { email, username, password } = requestData;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const { error: emailError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  const { error: usernameError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .single();

  if (!emailError) {
    return NextResponse.json({
      error: "email is already in use",
      onField: "email",
    });
  }

  if (!usernameError) {
    return NextResponse.json({
      error: "username is already in use",
      onField: "username",
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  });

  if (error) {
    console.log("error while signing up: ", error);
    return NextResponse.json({
      error: "unknown error signing up user",
      onField: "password",
    });
  }

  if (data?.user) {
    await supabase.from("users").insert({
      auth_id: data?.user.id,
      username,
      email: data?.user.email,
    });
    return NextResponse.json({ user: data.user, session: data.session, error });
  }
}
