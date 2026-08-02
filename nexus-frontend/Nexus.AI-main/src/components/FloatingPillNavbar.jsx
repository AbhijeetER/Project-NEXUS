import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

const TABS = ["Home", "Chat"];

const ROUTES = {
  Home: "/",
  Chat: "/chat",
};

export default function FloatingPillNavbar() {
  const [show, setShow] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY && currentY > 60) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: show ? 0 : -80, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
                 flex items-center justify-center"
    >
      <div
        ref={containerRef}
        className="nav-glass relative flex items-center justify-center
                   px-3 py-2
                   rounded-full w-fit"
      >
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1 relative" style={{ color: 'var(--text-primary)' }}>
          {TABS.map((tab) => (
            <Tab
              key={tab}
              route={ROUTES[tab]}
              containerRef={containerRef}
              setCursor={setCursor}
            >
              {tab}
            </Tab>
          ))}

          <Cursor cursor={cursor} />

        
          <SignedOut>
            <SignInButton mode="modal">
              <button className="ml-3 px-4 py-2 text-sm rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors">
                Signup / Login
              </button>
            </SignInButton>
          </SignedOut>

          
          <SignedIn>
            <a
              href="https://nexus-code-editor.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-4 py-2 text-sm rounded-full bg-[#2d4a72] text-white hover:bg-[#3a5f8f] transition-colors border border-white/10"
            >
              Code Editor
            </a>

            <div className="ml-3">
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </div>
          </SignedIn>
        </ul>

        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="md:hidden px-4 py-2 text-sm rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
        >
          Menu
        </button>


        {mobileOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                       rounded-xl p-3 flex flex-col gap-2 md:hidden"
            style={{ background: 'rgba(17,24,39,0.95)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          >
            {TABS.map((tab) => (
              <li key={tab} className="px-4 py-2 rounded-lg text-gray-200 hover:bg-white/8 hover:text-white transition-colors">
                <Link
                  to={ROUTES[tab]}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full"
                >
                  {tab}
                </Link>
              </li>
            ))}

            <SignedOut>
              <li className="px-4 py-2">
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Signup / Login
                  </button>
                </SignInButton>
              </li>
            </SignedOut>

     
            <SignedIn>
              <li className="px-4 py-2">
                <a
                  href="https://nexus-code-editor.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block px-4 py-2 rounded-lg bg-[#2d4a72] border border-white/10 text-white text-center hover:bg-[#3a5f8f] transition-colors"
                >
                  Code Editor
                </a>
              </li>

              <li className="px-4 py-2 flex justify-center">
                <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
              </li>
            </SignedIn>
          </motion.ul>
        )}
      </div>
    </motion.nav>
  );
}


const Tab = ({ children, setCursor, containerRef, route }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current || !containerRef.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setCursor({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onMouseLeave={() => setCursor((prev) => ({ ...prev, opacity: 0 }))}
      className="relative z-10 px-4 py-2 cursor-pointer
                 text-gray-200 text-sm font-medium hover:text-white transition-colors"
    >
      <Link to={route}>{children}</Link>
    </li>
  );
};

const Cursor = ({ cursor }) => {
  return (
    <motion.div
      animate={{
        left: cursor.left,
        width: cursor.width,
        opacity: cursor.opacity,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute top-1/2 -translate-y-1/2 
                 h-8 rounded-full bg-black z-0"
    />
  );
};