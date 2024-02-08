"use server";

import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/server/database.types";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ data: null, error: "No file found", url: null });
  }
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`${fileName}`, file);

  if (error) {
    console.error("Error uploading file: ", error);
  }
  return NextResponse.json({
    data: data,
    error: error,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${data?.path}`,
  });
}
