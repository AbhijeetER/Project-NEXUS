import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Assets
import llmfs from "../assets/llmfs.png";
import palms from "../assets/palms.png";
import part8 from "../assets/p8.png";
import improveEngine from "../assets/realimprovement.png";
import agentGotReal from "../assets/agent_got_fr.png";
import pro7 from "../assets/memo.png";
import autogenerate from "../assets/autogenerate.png";

// Minimal Monochrome SVG Icons
function CpuIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M12 9v3M9 15.5L12 12M15 15.5L12 12" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M21 19c0 1.66-4 3-9 3s-9-1.34-9-3" strokeDasharray="none" />
      <path d="M3 5v14M21 5v14" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21.5 2v6h-6M2.5 22v-6h6" />
      <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16" />
    </svg>
  );
}

// Scroll-reveal wrapper component
function BentoCard({ children, className = "", delay = 0 }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`reveal ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-full rounded-2xl bg-[#131b2e]/80 border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.18] hover:bg-[#162036]">
        {children}
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block text-xs font-semibold tracking-widest text-slate-400 uppercase bg-slate-800/60 border border-white/10 px-3.5 py-1 rounded-full mb-4">
          SYSTEM ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100">
          Indigenous Intelligence Grid
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
          Engineered from first principles — a modular, self-improving neural stack designed for sovereign decision-making.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: Hero Large Card (Spans 2 columns on desktop) */}
        <BentoCard className="lg:col-span-2 lg:row-span-1" delay={0}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                FOUNDATIONAL MODEL
              </span>
              <CpuIcon />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              LLM Architecture from Scratch
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-6">
              A ground-up transformer engine operating without legacy parameters. Learns and adapts continuously, bringing sovereign reasoning to distributed infrastructure.
            </p>
          </div>
          <div className="mt-4 rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 max-h-48">
            <img
              src={llmfs}
              alt="LLM Architecture"
              className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-90 transition-all duration-500"
            />
          </div>
        </BentoCard>

        {/* CARD 2: Non-Pseudo Agents (1 Column) */}
        <BentoCard className="lg:col-span-1" delay={100}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                MULTI-AGENT COGNITION
              </span>
              <NetworkIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Non-Scripted Autonomous Agents
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Independent entities — Reader, Writer, and Improver — operating on self-directed decidability to challenge, refine, and evolve outcomes.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>DECISION LOGIC</span>
            <span className="text-slate-300">EMERGENT</span>
          </div>
        </BentoCard>

        {/* CARD 3: Autonomous Code Generation (1 Column) */}
        <BentoCard className="lg:col-span-1" delay={200}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                CODE SYNTHESIS
              </span>
              <CodeIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Algorithmic Self-Reconstruction
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Synthesizes custom algorithms and application logic dynamically. Acts as an active co-developer that evolves system structures on the fly.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SYNTHESIS RATE</span>
            <span className="text-slate-300">REALTIME</span>
          </div>
        </BentoCard>

        {/* CARD 4: Improvement Engine (1 Column) */}
        <BentoCard className="lg:col-span-1" delay={300}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                INNOVATION LOOP
              </span>
              <SparklesIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Continuous Improvement Engine
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              An active background optimization engine. Evaluates past decisions and refines execution pathways continuously without user friction.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>STATE</span>
            <span className="text-slate-300">ALWAYS ACTIVE</span>
          </div>
        </BentoCard>

        {/* CARD 5: Wide Card: Hybrid Intelligent Memory (2 Columns) */}
        <BentoCard className="lg:col-span-2" delay={400}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                  STATE MEMORY
                </span>
                <DatabaseIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Hybrid Memory Architecture
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Combines symbolic recall with neural vector state. Intelligently indexes, stores, or purges contextual information in real-time.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-36">
              <img
                src={pro7}
                alt="Hybrid Memory"
                className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-90 transition-all duration-500"
              />
            </div>
          </div>
        </BentoCard>

        {/* CARD 6: Reinforcement Learning (Full Width or 1 Column span to balance 3x2 grid) */}
        <BentoCard className="lg:col-span-3" delay={500}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                  ONLINE REINFORCEMENT
                </span>
                <RefreshIcon />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">
                Self-Directed Learning & Feedback Loop
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Continuous online refinement loop ensures the multi-agent cognitive cluster gets smarter with every interaction, adapting directly to your workflow.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-md bg-slate-800/60 border border-white/10">
                REINFORCED • NON-STOP
              </span>
            </div>
          </div>
        </BentoCard>

      </div>
    </section>
  );
}
