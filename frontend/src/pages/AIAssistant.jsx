import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp } from "lucide-react";
import api from "../services/api.js";

const SUGGESTIONS = ["Summarize my tasks", "Plan my day"];

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setTyping(true);
    try {
      const res = await api.post("/ai/chat", { message: content });
      setMessages((m) => [...m, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles size={22} className="text-primary" /> WorkBoard AI
        </h2>
        <p className="text-sm text-muted mt-1">Your intelligent work assistant.</p>
      </div>

      <div className="flex-1 card p-5 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="font-semibold">How can I help you today?</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="btn-secondary text-xs py-3">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm wb-animate-in ${
                  m.role === "user" ? "bg-primary text-white" : "bg-elevated text-text"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-elevated rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-4 flex items-center gap-2 rounded-input border border-border bg-elevated px-3.5 py-2"
        >
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Ask WorkBoard AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <ArrowUp size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
