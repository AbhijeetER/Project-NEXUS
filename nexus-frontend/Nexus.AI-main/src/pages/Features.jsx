import React, { useEffect, useRef } from "react";

// Assets
import llmfs from "../assets/llmfs.png";
import palms from "../assets/palms.png";
import part8 from "../assets/p8.png";
import improveEngine from "../assets/realimprovement.png";
import agentGotReal from "../assets/agent_got_fr.png";
import pro7 from "../assets/memo.png";
import autogenerate from "../assets/autogenerate.png";
import secondLast from "../assets/2nd_last.png";

// Minimal Monochrome SVG Icons
function CpuIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M12 9v3M9 15.5L12 12M15 15.5L12 12" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2" />
    </svg>
  );
}

function PalmsIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 11a2 2 0 0 1 2 2v2a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-5.9-2.3L2 14" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M21 19c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14M21 5v14" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21.5 2v6h-6M2.5 22v-6h6" />
      <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden="true" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

// SEO-Friendly Bento Card Wrapper with IntersectionObserver & Hover Shine
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
    <article
      ref={cardRef}
      className={`reveal ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-shine h-full rounded-2xl bg-[#131b2e]/80 border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.18] hover:bg-[#162036] hover:shadow-2xl">
        {children}
      </div>
    </article>
  );
}

export function Features() {
  return (
    <section aria-labelledby="features-heading" className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <header className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block text-xs font-semibold tracking-widest text-slate-400 uppercase bg-slate-800/60 border border-white/10 px-3.5 py-1 rounded-full mb-4">
          SYSTEM ARCHITECTURE
        </span>
        <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100">
          Indigenous Intelligence Grid
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
          Engineered from first principles — a modular, self-improving neural stack designed for sovereign decision-making and real-time execution.
        </p>
      </header>

      {/* Asymmetric Bento Grid (3 Columns Desktop, 1 Column Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: Hero LLM Architecture (2 Cols Desktop) */}
        <BentoCard className="lg:col-span-2" delay={0}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                FOUNDATIONAL MODEL
              </span>
              <CpuIcon />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-2">
              LLM Architecture Built from Scratch
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl mb-4">
              A ground-up transformer engine operating without borrowed parameters. Pretrained on custom curated datasets to achieve maximum reasoning efficiency.
            </p>
          </div>
          <figure className="mt-2 rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-48 sm:h-56">
            <img
              src={llmfs}
              alt="Project NEXUS LLM Architecture from scratch diagram showing neural model structure"
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
            />
            <figcaption className="sr-only">Project NEXUS LLM Architecture from scratch</figcaption>
          </figure>
        </BentoCard>

        {/* CARD 2: Non-Scripted Multi-Agent (1 Col Desktop) */}
        <BentoCard className="lg:col-span-1" delay={80}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                AUTONOMOUS AGENTS
              </span>
              <NetworkIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Emergent Reader, Writer & Improver
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Independent agent entities operating on self-directed decision logic rather than rigid static scripts to refine and challenge reasoning.
            </p>
          </div>
          <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-36">
            <img
              src={agentGotReal}
              alt="Non-pseudo Multi-Agent Cognitive Framework in Project NEXUS"
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
            />
            <figcaption className="sr-only">Non-pseudo Multi-Agent Cognitive Framework</figcaption>
          </figure>
        </BentoCard>

        {/* CARD 3: Autonomous Code Generation (1 Col Desktop) */}
        <BentoCard className="lg:col-span-1" delay={160}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                CODE SYNTHESIS
              </span>
              <CodeIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Autonomous Code & Logic Generation
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Synthesizes production code, builds application logic, and dynamically optimizes algorithms on the fly.
            </p>
          </div>
          <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-36">
            <img
              src={autogenerate}
              alt="Autonomous Code Generation and Algorithm Design in Project NEXUS"
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
            />
            <figcaption className="sr-only">Autonomous Code Generation</figcaption>
          </figure>
        </BentoCard>

        {/* CARD 4: Improvement Engine (1 Col Desktop) */}
        <BentoCard className="lg:col-span-1" delay={240}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                INNOVATION ENGINE
              </span>
              <SparklesIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Continuous Neural Optimization
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Evaluates past reasoning when at rest and evolves logic during active operation, constantly pushing capabilities forward.
            </p>
          </div>
          <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-36">
            <img
              src={improveEngine}
              alt="Improvement Engine background neural optimization loop"
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
            />
            <figcaption className="sr-only">Improvement Engine optimization loop</figcaption>
          </figure>
        </BentoCard>

        {/* CARD 5: Compact & Touch Power (1 Col Desktop) */}
        <BentoCard className="lg:col-span-1" delay={320}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                PORTABLE POWER
              </span>
              <PalmsIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Power on Palms Infrastructure
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Delivers an entire evolving intelligence ecosystem in a compact, responsive form directly to your fingertips.
            </p>
          </div>
          <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-36">
            <img
              src={palms}
              alt="Project NEXUS Power on Palms compact mobile intelligence interface"
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
            />
            <figcaption className="sr-only">Power on Palms compact mobile interface</figcaption>
          </figure>
        </BentoCard>

        {/* CARD 6: Wide Hybrid Memory (2 Cols Desktop) */}
        <BentoCard className="lg:col-span-2" delay={400}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                  STATE RECALL
                </span>
                <DatabaseIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Hybrid Intelligent Memory Stack
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Autonomously aligns memory pathways, deciding what information to store, retrieve, or discard for maximum precision.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>SYMBOLIC + VECTOR</span>
                <span className="text-slate-300">REALTIME RECALL</span>
              </div>
            </div>
            <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-44">
              <img
                src={pro7}
                alt="Hybrid Memory symbolic and vector state architecture diagram"
                loading="lazy"
                className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
              />
              <figcaption className="sr-only">Hybrid Memory Architecture Diagram</figcaption>
            </figure>
          </div>
        </BentoCard>

        {/* CARD 7: Reinforcement Online Learning (1 Col Desktop) */}
        <BentoCard className="lg:col-span-1" delay={480}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                ONLINE REINFORCEMENT
              </span>
              <RefreshIcon />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
              Reinforcement Online Learning Loop
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Multi-agent reinforcement loops continuously refine reasoning without requiring manual training interventions.
            </p>
          </div>
          <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-36">
            <img
              src={part8}
              alt="Reinforcement online learning multi-agent loop"
              loading="lazy"
              className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
            />
            <figcaption className="sr-only">Reinforcement online learning loop</figcaption>
          </figure>
        </BentoCard>

        {/* CARD 8: Wide Customizable Architecture (2 Cols Desktop) */}
        <BentoCard className="lg:col-span-2" delay={560}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-800/40 px-2.5 py-1 rounded border border-white/5">
                  MODULAR EXTENSIBILITY
                </span>
                <GridIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Customizable Sovereign Grid
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Plug custom workflows, API endpoints, or private knowledge bases directly into the NEXUS engine with full data privacy.
              </p>
            </div>
            <figure className="rounded-xl overflow-hidden border border-white/[0.06] bg-slate-900/50 h-44">
              <img
                src={secondLast}
                alt="Modular Extensibility and Customizable AI Grid Diagram"
                loading="lazy"
                className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-95 transition-all duration-500"
              />
              <figcaption className="sr-only">Customizable Sovereign AI Grid</figcaption>
            </figure>
          </div>
        </BentoCard>

      </div>
    </section>
  );
}
