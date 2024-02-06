import Navbar from "@/app/navbar";
import { getServerComponentClient } from "@/app/server";

export default async function SignupLayout({
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
