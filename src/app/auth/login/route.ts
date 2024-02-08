"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Database } from "@/app/server/database.types";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const requestData = (await request.json()) as {
    emailOrUsername: string;
    password: string;
  };
  const email = requestData.emailOrUsername.includes("@")
    ? requestData.emailOrUsername
    : undefined;
  const username = !requestData.emailOrUsername.includes("@")
    ? requestData.emailOrUsername
    : undefined;
  const password = requestData.password;

  if (!email && !username) {
    return NextResponse.json({
      error: "username or email required",
      onField: "emailOrUsername",
    });
  }
  if (!password) {
    return NextResponse.json({
      error: "password required",
      onField: "password",
    });
  }

  if (email) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log("error while signing in with email: ", error);
    }
    return NextResponse.json({ user: data.user, session: data.session, error });
  }

  if (username) {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single();

    if (error || !data?.email) {
      return NextResponse.json({
        error: "user not found",
        onField: "emailOrUsername",
      });
    }

    const { data: signInResponse, error: usernameLoginError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });

    return NextResponse.json({
      user: signInResponse.user,
      session: signInResponse.session,
      error: usernameLoginError,
      ...(usernameLoginError ? { onField: "password" } : {}),
    });
  }
}
