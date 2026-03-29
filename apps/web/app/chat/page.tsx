"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { sendChat } from "@/lib/api";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What is the H-1B lottery and how does it work?",
  "Which countries offer PR without a job offer?",
  "What's the fastest path from India to Canada?",
  "How do I improve my Express Entry CRS score?",
  "What visas are available for software engineers in Germany?",
  "Compare EU Blue Card vs skilled worker visa Germany",
];

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl",
        isUser && "ml-auto flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser ? "bg-brand-500/20" : "bg-slate-700",
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-brand-400" />
        ) : (
          <Bot className="w-4 h-4 text-slate-400" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[80%]",
          isUser
            ? "bg-brand-500/20 border border-brand-500/20 text-slate-200"
            : "bg-slate-800/80 border border-slate-700/50 text-slate-300",
        )}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await sendChat(msg, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.message },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't connect to the backend. Make sure the API is running on port 8000. (${e.message})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-3">
              <MessageCircle className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-violet-300 font-medium">
                AI Immigration Consultant
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Ask SwiftVisa AI
            </h1>
            <p className="text-slate-400 text-sm">
              Ask anything about visas, immigration, and relocation.
            </p>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {isEmpty ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-brand-400" />
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Powered by Llama 3 70B + real visa policy RAG
                </p>
                <div className="grid sm:grid-cols-2 gap-2 w-full max-w-xl">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs text-slate-400 bg-slate-800/50 border border-slate-700 hover:border-brand-500/40 hover:text-slate-300 rounded-xl px-3.5 py-2.5 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto pb-4 max-h-[60vh]">
                {messages.map((m, i) => (
                  <ChatBubble key={i} msg={m} />
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mt-4 glass-card p-2">
            <div className="flex gap-2">
              <textarea
                className="flex-1 bg-transparent text-slate-200 text-sm placeholder:text-slate-600 resize-none outline-none px-3 py-2.5 min-h-[44px] max-h-[120px]"
                placeholder="Ask about any visa, country, or immigration strategy..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center flex-shrink-0 self-end transition-all active:scale-95"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-700 text-center mt-2">
            Not legal advice. Verify with official sources.
          </p>
        </div>
      </div>
    </div>
  );
}
