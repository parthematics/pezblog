// components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar: React.FC = () => {
  const { session, logout } = useAuth();
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link to="/">pezblog</Link>
      <div>
        {!session?.user?.id ? (
          <Link to="/" className="mr-4">
            login
          </Link>
        ) : null}
        {!session?.user?.id ? (
          <Link to="/signup" className="mr-4">
            signup
          </Link>
        ) : null}
        {session?.user?.id ? (
          <Link to="/dashboard" className="mr-4">
            dashboard
          </Link>
        ) : null}
        {session?.user?.id ? (
          <Link
            to="/"
            className="mr-4"
            onClick={() => {
              logout();
            }}
          >
            logout
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
