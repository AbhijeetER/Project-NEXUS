import React, { useEffect, useState } from "react";
import './global.css';
import Chat from "./pages/Chat";
import FloatingPillNavbar from "./components/FloatingPillNavbar";
import Hero from "./Hero";
import Layout from "./components/Layout";
import Signup from "./pages/Signup";
import SignIn from "./pages/Signin";

import { Loader } from "./components/loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the loader has already run in this session
    const hasLoadedBefore = sessionStorage.getItem("hasLoaded");

    if (!hasLoadedBefore) {
      // First time opening this tab → show loader
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasLoaded", "true"); // Prevent loader again
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ErrorBoundary>
      {/* Main App UI */}
      <div className={`transition-all duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
        <FloatingPillNavbar />

        <Routes>
          <Route path="/chat" element={<Chat />} />
         
          <Route element={<Layout />}>
            <Route path="/" element={<Hero />} />
          </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Catch-all 404 Route: Redirects any unknown URL back to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Loader */}
      {loading && (
        <div className="
          fixed inset-0 bg-black
          flex items-center justify-center
          z-[9999]
        ">
          <Loader />
        </div>
      )}
    </ErrorBoundary>
  );
}

export default App;
