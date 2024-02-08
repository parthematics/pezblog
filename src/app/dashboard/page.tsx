"use server";

// import DashboardPage from "@/app/dashboard/dashboard";
import { getServerComponentClient } from "@/app/server";
import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("@/app/dashboard/dashboard"));

export default async function Dashboard() {
  const supabase = await getServerComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return <DashboardPage user={error ? null : user} />;
}
