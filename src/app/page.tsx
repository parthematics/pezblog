import { getServerComponentClient } from "@/app/server";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/app/login"));
const Navbar = dynamic(() => import("@/app/navbar"));

export default async function LoginPage() {
  const supabase = await getServerComponentClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={error ? null : user} />
      <LoginForm />
    </>
  );
}
