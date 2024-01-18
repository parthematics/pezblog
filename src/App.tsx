import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { SignupForm } from "./components/SignUpForm";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
