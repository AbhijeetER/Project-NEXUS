import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

/* ── Scroll-reveal hook ───────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ── Icon components (inline SVG, no external deps) ─────── */
function IconBrain() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.69 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.69 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}
function IconAgents() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <circle cx="4" cy="10" r="2.5"/>
      <circle cx="20" cy="10" r="2.5"/>
    </svg>
  );
}
function IconImprover() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
}

const CARDS = [
  {
    title: 'LLM',
    label: 'Core Model',
    desc: 'Interact with and customize the language model built from scratch — fully configurable for your use case.',
    link: '/chat',
    icon: <IconBrain />,
    tag: 'Internal',
  },
  {
    title: 'Agentic AI',
    label: 'Autonomous Agents',
    desc: 'Deploy advanced independent agents operating on self-directed logic — no rigid scripts, only emergent reasoning.',
    link: 'https://agentwithoutimproverwith-faiss-jaoks7gsvwlw2qnevmmmtz.streamlit.app/',
    icon: <IconAgents />,
    tag: 'External',
  },
  {
    title: 'AgentAI + Improver',
    label: 'Full Agent Stack',
    desc: 'The complete agent suite: Reader, Writer, and Improver working in sync — the full cognitive loop, live.',
    link: 'https://agentwithimproverandfaiss-bhswws8o7b8pmcbhjda2tt.streamlit.app/',
    icon: <IconImprover />,
    tag: 'External',
  },
];

export default function Tabs() {
  const headerRef = useReveal();

  return (
    <section
      style={{ backgroundColor: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)' }}
      className="w-full py-20 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="reveal reveal-d0 mb-14 text-center">
          <span className="badge-accent mb-4">Try It Live</span>
          <h2
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
            className="text-3xl md:text-4xl font-semibold tracking-tight mt-3"
          >
            Explore the Stack
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-3 text-base max-w-xl mx-auto">
            Every component is independently accessible. Pick the layer that fits your workflow.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card, i) => {
            const isExternal = card.link.startsWith('http');
            return (
              <CardReveal key={i} delay={i + 1}>
                <div
                  className="card-matte card-shine h-full flex flex-col gap-5 p-6 group"
                >
                  {/* Top row: icon + tag */}
                  <div className="flex items-center justify-between">
                    <div
                      style={{ color: '#7ea8d8', background: 'var(--accent-dim)', border: '1px solid rgba(74,111,165,0.25)' }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                    >
                      {card.icon}
                    </div>
                    <span
                      style={{ fontSize: '0.68rem', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
                      className="px-2 py-0.5 rounded-full bg-transparent uppercase tracking-wider"
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {card.label}
                    </p>
                    <h3 style={{ color: 'var(--text-primary)' }} className="text-xl font-semibold mb-2">
                      {card.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }} className="text-sm">
                      {card.desc}
                    </p>
                  </div>

                  {/* CTA */}
                  {isExternal ? (
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'background 0.2s, border-color 0.2s',
                        textDecoration: 'none',
                        width: 'fit-content',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,111,165,0.22)'; e.currentTarget.style.borderColor = 'rgba(74,111,165,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    >
                      Launch →
                    </a>
                  ) : (
                    <Link
                      to={card.link}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'background 0.2s, border-color 0.2s',
                        textDecoration: 'none',
                        width: 'fit-content',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,111,165,0.22)'; e.currentTarget.style.borderColor = 'rgba(74,111,165,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    >
                      Launch →
                    </Link>
                  )}
                </div>
              </CardReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Card with per-element scroll-reveal ─────────────────── */
function CardReveal({ children, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal reveal-d${delay} h-full`}
    >
      {children}
    </div>
  );
}