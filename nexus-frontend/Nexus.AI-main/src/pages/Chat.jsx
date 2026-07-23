import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Cpu, Sparkles, BookOpen, AlertTriangle } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memorySize, setMemorySize] = useState(0);
  const [apiStatus, setApiStatus] = useState("checking");

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

    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, top_k: 3 })
      });

      const data = await res.json();
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.response || "No response received." }
      ]);
      
      // Increment local mock memory size
      setMemorySize(prev => prev + 1);

    } catch (error) {
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
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      text: "fire detected in building"
    },
    {
      title: "Injury First Aid",
      desc: "How do I treat a standard burn injury?",
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      text: "how to treat a burn injury"
    },
    {
      title: "RAG Capability",
      desc: "Test how the AI remembers context.",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      text: "sports news today"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090B11] text-white flex font-inter pt-20">
      
      {/* Sleek Glassmorphic Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-[#0C0E15]/60 backdrop-blur-xl p-6 hidden lg:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">Nexus.AI</h2>
              <span className="text-xs text-white/40 font-medium">Sovereign Intellect</span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Engine Info */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block">System Parameters</span>
              
              <div className="flex justify-between items-center text-sm">
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
      <main className="flex-1 flex flex-col justify-between bg-[#090B11] relative">
        
        {/* Background gradient glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

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
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                      Evolving Intelligence
                    </h1>
                    <p className="text-white/40 text-base max-w-lg mx-auto">
                      Nexus.AI leverages local FAISS vector databases and LLM orchestration to provide contextual, sovereign reasoning.
                    </p>
                  </div>

                  {/* Starter cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto">
                    {starterPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(p.text)}
                        className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-left transition-all duration-300 group hover:-translate-y-1"
                      >
                        <div className="mb-3 p-2 w-fit rounded-lg bg-white/[0.04]">
                          {p.icon}
                        </div>
                        <h3 className="font-semibold text-sm mb-1 text-white group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-xs text-white/40 leading-relaxed">
                          {p.desc}
                        </p>
                      </button>
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
                      className={`px-5 py-3.5 rounded-2xl leading-relaxed text-sm max-w-xl ${
                        msg.role === "user"
                          ? "bg-[#1E2538] border border-white/10 text-white rounded-tr-none shadow-lg shadow-blue-950/20"
                          : "bg-[#0D1017] border border-white/5 text-white/95 rounded-tl-none"
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
                <div className="flex gap-1.5 items-center bg-[#0D1017] border border-white/5 px-5 py-3.5 rounded-2xl rounded-tl-none">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Dock */}
        <div className="p-6 border-t border-white/5 bg-[#090B11]/80 backdrop-blur-lg relative">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              className="flex-1 bg-[#0D1017]/80 hover:bg-[#0D1017] focus:bg-[#0D1017] border border-white/10 focus:border-blue-500/50 outline-none px-5 py-4 rounded-2xl text-sm transition-all duration-300 placeholder:text-white/20"
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