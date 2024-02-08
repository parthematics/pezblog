import { getServerComponentClient } from "@/app/server";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/app/navbar"));

export async function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerComponentClient();
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
