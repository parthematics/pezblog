import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "./server/database.types";
import LoginForm from "./login";
import Navbar from "./navbar";

export default async function LoginPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

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
