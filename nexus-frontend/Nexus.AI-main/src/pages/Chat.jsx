import React, { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Deployed FastAPI server (configurable via VITE_API_URL)
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input;

    setInput("");

    // Show user message
    setMessages(prev => [
      ...prev,
      { role: "user", content: text }
    ]);

    setLoading(true);

    try {

      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: text,
          top_k: 3
        })
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.response }
      ]);

    } catch (error) {

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error contacting NEXUS server." }
      ]);

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0C0E14] text-white flex flex-col font-inter">

      <div className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`px-5 py-3 rounded-lg my-2 inline-block ${
                  msg.role === "user"
                    ? "bg-[#1A1F2B] border border-white/10"
                    : "bg-[#141821] border border-white/5"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="bg-[#141821] border border-white/5 px-5 py-3 rounded-lg opacity-70">
              NEXUS is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />

        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#0C0E14]">
        <div className="max-w-3xl mx-auto flex gap-3">

          <input
            className="flex-1 bg-[#141821] border border-white/10 px-4 py-3 rounded-lg"
            placeholder="Ask NEXUS something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 bg-[#1A1F2B] border border-white/10 rounded-lg"
          >
            {loading ? "..." : "Send"}
          </button>

        </div>
      </div>

    </div>
  );
}