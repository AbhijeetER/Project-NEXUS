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
                 flex items-center justify-center
                 backdrop-blur-xl rounded-4xl"
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-center 
                   px-3 py-2 
                   bg-white/90 border border-black/10 shadow-lg
                   rounded-full w-fit"
      >
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1 relative">
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
              <button className="ml-3 px-4 py-2 text-sm rounded-full bg-black text-white hover:bg-black/80">
                Signup / Login
              </button>
            </SignInButton>
          </SignedOut>

          
          <SignedIn>
            <a
              href="https://nexus-code-editor.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700"
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
          className="md:hidden px-4 py-2 text-sm rounded-full bg-black text-white"
        >
          Menu
        </button>


        {mobileOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                       bg-white rounded-xl shadow-xl border border-black/10
                       p-3 flex flex-col gap-2 md:hidden"
          >
            {TABS.map((tab) => (
              <li key={tab} className="px-4 py-2 rounded-lg hover:bg-black/5">
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
                    className="w-full px-4 py-2 rounded-lg bg-black text-white"
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
                  className="w-full block px-4 py-2 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700"
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
                 text-black text-sm font-medium hover:text-white"
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