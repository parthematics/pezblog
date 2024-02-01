"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "./server";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAuthUserId(localStorage.getItem("user_auth_id"));
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/" passHref>
        pezblog
      </Link>
      <div>
        {!authUserId ? (
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
              <a
                onClick={(e) => {
                  router.push("/");
                  e.preventDefault();
                  localStorage.removeItem("user_auth_id");
                  signOut();
                  setAuthUserId(null);
                }}
              >
                logout
              </a>
              {/* logout */}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
