import { getServerComponentClient } from "@/app/server";
import LoginForm from "@/app/login";
import Navbar from "@/app/navbar";

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
