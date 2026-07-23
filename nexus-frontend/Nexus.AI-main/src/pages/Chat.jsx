import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Cpu, Sparkles, BookOpen, AlertTriangle } from "lucide-react";

// 3D Parallax Tilt Card Wrapper
function TiltWrapper({ children, className = "", onClick = null }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor position relative to center of card
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates: -1 to 1
    const px = x / (width / 2);
    const py = y / (height / 2);
    
    // Convert to rotation angles: max 12 degrees
    const rotateX = -py * 12;
    const rotateY = px * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`transition-all duration-200 ease-out ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memorySize, setMemorySize] = useState(0);
  const [apiStatus, setApiStatus] = useState("checking");
  const [pipelineStep, setPipelineStep] = useState(0);

  const pipelineSteps = [
    { id: 1, label: "Input Tokenization" },
    { id: 2, label: "FAISS Semantic Retrieval" },
    { id: 3, label: "Context Prompt Assembly" },
    { id: 4, label: "LoRA Target Generation" },
    { id: 5, label: "Memory Index Decay" }
  ];

  // Deployed FastAPI server (configurable via VITE_API_URL)
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check backend health & memory size on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API}/`);
        if (res.ok) {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch (err) {
        setApiStatus("offline");
      }
    };
    checkStatus();
  }, [API]);

  const sendMessage = async (customText = null) => {
    const text = customText || input;
    if (!text.trim() || loading) return;

    if (!customText) setInput("");

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setPipelineStep(1);

    // Visual step sequence
    const t1 = setTimeout(() => setPipelineStep(2), 250);
    const t2 = setTimeout(() => setPipelineStep(3), 550);
    const t3 = setTimeout(() => setPipelineStep(4), 850);

    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, top_k: 3 })
      });

      const data = await res.json();
      
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setPipelineStep(5);
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.response || "No response received." }
      ]);
      
      // Increment local mock memory size
      setMemorySize(prev => prev + 1);

      setTimeout(() => setPipelineStep(0), 1200);

    } catch (error) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setPipelineStep(0);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error contacting NEXUS server. Make sure the backend is running." }
      ]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const starterPrompts = [
    {
      title: "Fire Emergency",
      desc: "What is the procedure if a fire starts?",
      icon: <AlertTriangle className="w-5 h-5 text-red-400 font-bold" />,
      text: "fire detected in building"
    },
    {
      title: "Injury First Aid",
      desc: "How do I treat a standard burn injury?",
      icon: <BookOpen className="w-5 h-5 text-blue-400 font-bold" />,
      text: "how to treat a burn injury"
    },
    {
      title: "RAG Capability",
      desc: "Test how the AI remembers context.",
      icon: <Sparkles className="w-5 h-5 text-purple-400 font-bold" />,
      text: "sports news today"
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080B] text-white flex font-inter pt-20 overflow-hidden relative">
      
      {/* 3D Perspective Grid Background (Floating effect) */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: "perspective(800px) rotateX(60deg) translateY(-200px) translateZ(-100px)",
          maskImage: "linear-gradient(to bottom, transparent, black 80%)"
        }}
      />

      {/* Floating 3D Glowing Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-20 animate-pulse duration-5000" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-20 animate-pulse duration-7000" />

      {/* Sleek Glassmorphic Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-[#080B10]/40 backdrop-blur-2xl p-6 hidden lg:flex flex-col justify-between z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none tracking-tight">Nexus.AI</h2>
              <span className="text-xs text-white/40 font-medium">Sovereign Intellect</span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Engine Info (3D Tilt card) */}
          <div className="space-y-4">
            <TiltWrapper className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 shadow-xl transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-3">System Parameters</span>
              
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-white/60">Status</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    apiStatus === "online" ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-rose-500 shadow-lg shadow-rose-500/50"
                  }`} />
                  {apiStatus === "online" ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">RAG Index</span>
                <span className="text-white font-medium">{memorySize} Seeds</span>
              </div>
            </TiltWrapper>

            {/* Live Pipeline Flow Panel */}
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 shadow-xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block">Execution Flow</span>
              
              <div className="space-y-2.5">
                {pipelineSteps.map((step) => {
                  const isDone = pipelineStep > step.id;
                  const isActive = pipelineStep === step.id;

                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                        isActive 
                          ? "text-blue-400 font-bold" 
                          : isDone 
                            ? "text-emerald-400 font-medium opacity-85" 
                            : "text-white/35"
                      }`}
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        {isActive ? (
                          <>
                            <span className="absolute w-3 h-3 rounded-full bg-blue-500/50 animate-ping" />
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                          </>
                        ) : isDone ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-white/20 bg-transparent" />
                        )}
                      </div>
                      <span className="truncate">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        <button 
          onClick={clearChat}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-white/70 hover:text-rose-400 transition-all duration-300 font-medium text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Clear Conversation
        </button>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col justify-between relative z-10">
        
        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <AnimatePresence>
              {messages.length === 0 ? (
                // Empty state greeting
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-12 space-y-8 text-center"
                >
                  <div className="space-y-3">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent drop-shadow-xl">
                      Evolving Intelligence
                    </h1>
                    <p className="text-white/40 text-base max-w-lg mx-auto font-medium">
                      Nexus.AI leverages local FAISS vector databases and LLM orchestration to provide contextual, sovereign reasoning.
                    </p>
                  </div>

                  {/* 3D Tilt Starter prompts cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 max-w-2xl mx-auto">
                    {starterPrompts.map((p, idx) => (
                      <TiltWrapper
                        key={idx}
                        onClick={() => sendMessage(p.text)}
                        className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 text-left shadow-lg"
                      >
                        <div className="mb-4 p-2 w-fit rounded-xl bg-white/[0.03]">
                          {p.icon}
                        </div>
                        <h3 className="font-bold text-sm mb-1.5 text-white group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">
                          {p.desc}
                        </p>
                      </TiltWrapper>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-4 max-w-3xl ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role !== "user" && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`px-5 py-3.5 rounded-2xl leading-relaxed text-sm max-w-xl shadow-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 border border-white/10 text-white rounded-tr-none"
                          : "bg-white/[0.02] backdrop-blur-md border border-white/5 text-white/95 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-white/80" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex gap-4 items-center opacity-70"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md animate-pulse">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex gap-1.5 items-center bg-white/[0.02] border border-white/5 px-5 py-3.5 rounded-2xl rounded-tl-none">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Dock (Glassmorphic float) */}
        <div className="p-6 border-t border-white/5 bg-[#06080B]/60 backdrop-blur-xl relative">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              className="flex-1 bg-white/[0.01] hover:bg-white/[0.02] focus:bg-white/[0.03] border border-white/10 focus:border-blue-500/50 outline-none px-5 py-4 rounded-2xl text-sm transition-all duration-300 placeholder:text-white/20 shadow-inner"
              placeholder="Query the sovereign knowledge base..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}