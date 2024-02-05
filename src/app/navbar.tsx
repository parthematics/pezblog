"use client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: User | null }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/" passHref>
        pezblog
      </Link>
      <div>
        {!user ? (
          <>
            <Link href="/" className="mr-4" passHref prefetch>
              login
            </Link>
            <Link href="/signup" className="mr-4" passHref prefetch>
              signup
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="mr-4" passHref>
              dashboard
            </Link>
            <Link legacyBehavior href="/" className="mr-4">
              <a onClick={handleLogout}>logout</a>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
