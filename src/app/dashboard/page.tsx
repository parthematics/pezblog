"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../server/database.types";
import DashboardPage from "./dashboard";

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return <DashboardPage user={error ? null : user} />;
}
