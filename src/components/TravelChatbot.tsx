"use client";
import { useState, useEffect, useRef, useId } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { BUSINESS_WHATSAPP } from "../data/travel";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: Array<{
    type: "plan" | "view" | "whatsapp";
    payload: string;
    label: string;
    url?: string;
  }>;
  timestamp: string;
  isError?: boolean;
}

interface TravelChatbotProps {
  onPlanDestination?: (destinationId: string) => void;
  onNavigateDestination?: (destinationId: string) => void;
}

const WELCOME_TEXT =
  "Assalam-o-Alaikum! Welcome to Venture Pakistan. I'm your AI Travel Assistant. Ask me about Pakistan's beautiful destinations, tour packages, travel budgets, itineraries, or booking options.";

const SUGGESTED_QUESTIONS = [
  "What are the best places to visit in Pakistan?",
  "Show me available tour packages",
  "What is the starting price of a Hunza tour?",
  "Plan a 3-day trip to Swat",
  "What is the best time to visit northern Pakistan?",
  "How can I book a tour?",
];

export function TravelChatbot({
  onPlanDestination,
  onNavigateDestination,
}: TravelChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowId = useId();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content: WELCOME_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  // Auto-scroll when messages change or loading state toggles
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    setErrorMsg(null);
    setInput("");
    setLastUserPrompt(prompt);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Send to /api/chat (proxied to Express server)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to receive AI response.");
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message,
        actions: data.actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMsg(err.message || "Could not reach the travel assistant. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserPrompt) {
      handleSend(lastUserPrompt);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: WELCOME_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setErrorMsg(null);
    setInput("");
  };

  const handleActionClick = (action: {
    type: "plan" | "view" | "whatsapp";
    payload: string;
    label: string;
    url?: string;
  }) => {
    if (action.type === "plan") {
      setIsOpen(false);
      onPlanDestination?.(action.payload);
    } else if (action.type === "view") {
      setIsOpen(false);
      onNavigateDestination?.(action.payload);
    } else if (action.type === "whatsapp") {
      const waUrl =
        action.url ||
        `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(
          `Hello Tariq,\nI would like to inquire about ${action.payload}.`
        )}`;
      window.open(waUrl, "_blank", "noopener");
    }
  };

  // Simple Markdown-like renderer for formatted messages
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Headers (### or ##)
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-display text-[15.5px] font-semibold text-champagne mt-2 mb-1">
            {trimmed.replace(/^###\s+/, "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-display text-[16.5px] font-bold text-champagne mt-2.5 mb-1.5">
            {trimmed.replace(/^##\s+/, "")}
          </h3>
        );
      }

      // Unordered lists (- or *)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemText = trimmed.replace(/^[-*]\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-[13px] leading-relaxed">
            <span className="text-champagne shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-champagne" />
            <span>{renderInlineFormatting(itemText)}</span>
          </div>
        );
      }

      // Numbered lists (1. 2.)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-[13px] leading-relaxed">
            <span className="font-bold text-champagne shrink-0 tabular text-[12px]">{numMatch[1]}.</span>
            <span>{renderInlineFormatting(numMatch[2])}</span>
          </div>
        );
      }

      // Dividers
      if (trimmed === "---") {
        return <hr key={idx} className="my-2.5 border-ivory/10" />;
      }

      // Default paragraph
      return (
        <p key={idx} className="text-[13px] leading-relaxed my-1">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    });
  };

  // Inline formatting: **bold** and *italic*
  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-ivory">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="italic text-champagnelight">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* ================= FLOATING TRIGGER BUTTON ================= */}
      {/* Positioned cleanly above bottom nav on mobile, and above FloatingWhatsApp on desktop */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={chatWindowId}
        aria-label="Chat with Tariq AI Travel Assistant"
        className="btn-press group fixed bottom-[76px] right-4 z-[66] flex items-center gap-2.5 rounded-full border border-champagne/40 bg-ink/90 p-3 text-ivory shadow-[0_8px_25px_rgba(201,168,106,0.22)] backdrop-blur-xl hover:border-champagne hover:bg-coal md:bottom-24 md:right-8 md:px-4 md:py-3"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-ink shadow-inner">
          <Sparkles size={17} className="transition-transform group-hover:rotate-12" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        </span>
        <div className="hidden flex-col items-start text-left md:flex">
          <span className="text-[12px] font-extrabold tracking-wide text-ivory">Ask Tariq AI</span>
          <span className="text-[10px] font-semibold text-champagne/80">Pakistan Guide</span>
        </div>
      </button>

      {/* ================= CHAT WINDOW MODAL / DRAWER ================= */}
      {isOpen && (
        <div
          id={chatWindowId}
          role="dialog"
          aria-modal="true"
          aria-label="Tariq AI Travel Assistant Window"
          className="fixed inset-x-3 bottom-20 z-[75] flex max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-champagne/30 bg-ink/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 md:inset-auto md:bottom-24 md:right-8 md:h-[600px] md:w-[410px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ivory/10 bg-coal/80 px-4 py-3 md:px-5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-champagne/40 bg-ink text-champagne">
                <Compass size={19} />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-coal bg-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-[16px] font-bold tracking-wide text-ivory">Venture Pakistan</h3>
                  <span className="rounded bg-champagne/20 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-champagne">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-ivory/50">Verified Pakistan Travel Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reset conversation"
                aria-label="Clear conversation"
                className="btn-press flex h-8 w-8 items-center justify-center rounded-full text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
                className="btn-press flex h-8 w-8 items-center justify-center rounded-full text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
                      isUser
                        ? "rounded-tr-sm bg-champagne font-medium text-ink"
                        : "rounded-tl-sm border border-ivory/10 bg-coal/90 text-ivory/90"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div>{renderFormattedContent(msg.content)}</div>
                    )}
                  </div>

                  {/* Actions Chips (if any) */}
                  {!isUser && msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[88%]">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(act)}
                          className="btn-press inline-flex items-center gap-1.5 rounded-full border border-champagne/40 bg-ink/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-champagne hover:bg-champagne hover:text-ink transition-colors"
                        >
                          {act.type === "plan" && <Calendar size={12} />}
                          {act.type === "view" && <Compass size={12} />}
                          {act.type === "whatsapp" && <ExternalLink size={12} />}
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="mt-1 px-1 text-[10px] font-semibold text-ivory/35">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-ivory/10 bg-coal/80 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-champagne typing-dot" />
                  <span className="h-2 w-2 rounded-full bg-champagne typing-dot [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-champagne typing-dot [animation-delay:0.4s]" />
                  <span className="ml-2 text-[11.5px] font-medium text-ivory/60">Tariq is preparing advice...</span>
                </div>
              </div>
            )}

            {/* Error Banner with Retry */}
            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-ivory">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-[12px] leading-relaxed text-rose-200">
                    {errorMsg}
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <button
                    onClick={handleRetry}
                    className="btn-press rounded-full bg-rose-500/20 px-3 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-500/30"
                  >
                    Retry Question
                  </button>
                </div>
              </div>
            )}

            {/* Suggested Question Chips (only shown early in conversation) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ivory/40">Suggested Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="btn-press rounded-xl border border-ivory/15 bg-ink/70 px-3 py-1.5 text-left text-[11.5px] font-semibold text-ivory/75 hover:border-champagne/60 hover:text-ivory hover:bg-coal/90 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-ivory/10 bg-coal/90 p-3 md:p-3.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Ask in English, Urdu, or Roman Urdu..."
                  disabled={isLoading}
                  maxLength={1000}
                  className="w-full resize-none rounded-xl border border-ivory/15 bg-ink/80 px-3.5 py-2.5 text-[13px] text-ivory placeholder-ivory/40 focus:border-champagne focus:outline-none disabled:opacity-50"
                  style={{ maxHeight: "90px" }}
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-champagne text-ink disabled:opacity-40 hover:bg-champagnelight transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold text-ivory/30 px-1">
              <span>Verified Pakistan Route Data · Real-time AI</span>
              <span>{input.length}/1000</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
