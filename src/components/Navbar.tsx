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
        <Link to="/" className="mr-4">
          login
        </Link>
        <Link to="/signup" className="mr-4">
          signup
        </Link>
        <Link to="/dashboard" className="mr-4">
          dashboard
        </Link>
        {session?.user?.id ? (
          <Link to="/" className="mr-4" onClick={() => logout()}>
            logout
          </Link>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
};

export default Navbar;
