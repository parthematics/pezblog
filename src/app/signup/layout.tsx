import Navbar from "../navbar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../server/database.types";

export default async function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <section>
      <Navbar user={error ? null : user} />
      {children}
    </section>
  );
}
