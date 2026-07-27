import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../footer";

/* ── Lazy-loaded middle sections ─────────────────────────── */
const Tabs     = lazy(() => import("../pages/tabs"));
const Features = lazy(() => import("../pages/Features").then(m => ({ default: m.Features })));

/* ── Lightweight skeleton for initial layout ─────────────── */
function SectionSkeleton({ height = 320 }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="skeleton" style={{ width: '60%', height: 24, borderRadius: 8 }} />
    </div>
  );
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col text-slate-100 overflow-x-hidden">
      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Hero (rendered by Outlet → Route path="/") */}
        <Outlet />

        {/* ── Middle section: lazy-loaded, staggered reveal ── */}
        <Suspense fallback={<SectionSkeleton height={320} />}>
          <Tabs />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height={500} />}>
          <Features />
        </Suspense>
      </main>

      {/* ── Footer Wrapper: clipped overflow prevents background grid elements from inflating page height ── */}
      <div className="w-full relative overflow-hidden shrink-0">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;