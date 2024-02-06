"use server";

import DashboardPage from "@/app/dashboard/dashboard";
import { getServerComponentClient } from "@/app/server";

export default async function Dashboard() {
  const supabase = await getServerComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return <DashboardPage user={error ? null : user} />;
}
