"use client";
import { useState, useEffect, useRef, useId } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Compass,
  Calendar,
  ExternalLink,
  Phone,
  HelpCircle,
  MapPin,
  ChevronRight,
} from "lucide-react";
import {
  BUSINESS_WHATSAPP,
  BUSINESS_EMAIL,
  DESTINATIONS,
  TRAVEL_STYLES,
  formatPKR,
  generateItinerary,
  whatsappLink,
  getDestination,
  type Destination,
  type PlannerInput,
} from "../data/travel";
import { WhatsAppIcon } from "./WhatsAppIcon";

export interface BotAction {
  label: string;
  type: "planner" | "detail" | "whatsapp" | "prompt";
  payload: string;
  overrides?: {
    days?: number;
    travelers?: number;
    budget?: PlannerInput["budget"];
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  actions?: BotAction[];
  timestamp: string;
}

interface ChatBotProps {
  onOpenPlanner: (
    destinationId: string,
    overrides?: {
      days?: number;
      travelers?: number;
      budget?: PlannerInput["budget"];
    }
  ) => void;
  onOpenDetail: (destinationId: string) => void;
}

const VENTURE_PHONE_LOCAL = "0322-0254568";
const VENTURE_PHONE_INTL = "+92 322 0254568";

const QUICK_PROMPT_CHIPS = [
  "Hunza 5 days price?",
  "Best places for family",
  "Skardu best season?",
  "How does booking work?",
  "Venture WhatsApp number",
];

const WELCOME_MESSAGE =
  "Assalam-o-Alaikum! I am your **Venture Pakistan Concierge**. Ask me about tour prices, custom budgets, best travel seasons, hotels, transport, or direct booking with Venture Pakistan in English or Roman Urdu.";

export function ChatBot({ onOpenPlanner, onOpenDetail }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowId = useId();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "bot",
        text: WELCOME_MESSAGE,
        actions: [
          { label: "Hunza 5 Days Quote", type: "prompt", payload: "Hunza 5 days price?" },
          { label: "Family Recommendations", type: "prompt", payload: "Best places for family" },
          { label: "Booking Process", type: "prompt", payload: "How does booking work?" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on window open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Helper to detect destination from query text
  const detectDestination = (text: string): Destination | null => {
    const lower = text.toLowerCase();

    // Special aliases
    if (lower.includes("deosai") || lower.includes("shigar") || lower.includes("kachura")) {
      return getDestination("skardu");
    }
    if (lower.includes("passu") || lower.includes("attabad") || lower.includes("karimabad")) {
      return getDestination("hunza");
    }
    if (lower.includes("nanga parbat") || lower.includes("raikot") || lower.includes("beyal")) {
      return getDestination("fairy-meadows");
    }
    if (lower.includes("kalam") || lower.includes("malam jabba") || lower.includes("mahodand")) {
      return getDestination("swat");
    }
    if (lower.includes("kalash") || lower.includes("bumburet") || lower.includes("shandur")) {
      return getDestination("chitral");
    }
    if (lower.includes("arang kel") || lower.includes("keran") || lower.includes("sharda") || lower.includes("kashmir")) {
      return getDestination("neelum");
    }

    // Match by id, name, or shortName
    for (const d of DESTINATIONS) {
      if (
        lower.includes(d.id.toLowerCase()) ||
        lower.includes(d.name.toLowerCase()) ||
        lower.includes(d.shortName.toLowerCase())
      ) {
        return d;
      }
    }

    return null;
  };

  // Helper to extract days count
  const detectDays = (text: string, defaultDays = 5): number => {
    const dayMatch = text.match(/(\d+)\s*(days?|din|nights?|raat|d\b)/i);
    if (dayMatch) {
      const val = parseInt(dayMatch[1], 10);
      if (val >= 1 && val <= 30) return val;
    }
    return defaultDays;
  };

  // Helper to extract traveler count
  const detectTravelers = (text: string, defaultTravelers = 2): number => {
    const travelerMatch = text.match(/(\d+)\s*(people|persons?|travelers?|pax|log|bande|adults?)/i);
    if (travelerMatch) {
      const val = parseInt(travelerMatch[1], 10);
      if (val >= 1 && val <= 25) return val;
    }
    if (/\bcouple\b|\b2\s*pax\b/i.test(text)) return 2;
    if (/\bsolo\b|\balone\b|\bakela\b/i.test(text)) return 1;
    return defaultTravelers;
  };

  // Helper to detect budget tier
  const detectBudget = (text: string): PlannerInput["budget"] => {
    const lower = text.toLowerCase();
    if (lower.includes("sasta") || lower.includes("cheap") || lower.includes("economy") || lower.includes("low budget")) {
      return "Economy";
    }
    if (lower.includes("luxury") || lower.includes("vip") || lower.includes("5 star") || lower.includes("mehanga")) {
      return "Luxury";
    }
    if (lower.includes("premium") || lower.includes("deluxe") || lower.includes("high end")) {
      return "Premium";
    }
    return "Comfort";
  };

  // Intent & Pricing Logic Engine
  const generateBotReply = (userText: string): { text: string; actions?: BotAction[] } => {
    const lower = userText.toLowerCase().trim();
    const dest = detectDestination(userText);
    const days = detectDays(userText, dest ? dest.days : 5);
    const travelers = detectTravelers(userText, 2);
    const budget = detectBudget(userText);

    // 1. Booking, Contact, WhatsApp inquiry
    if (
      /\b(book|booking|confirm|payment|advance|phone|number|contact|whatsapp|call|rabta|email|venture|tariq)\b/i.test(lower)
    ) {
      const targetDest = dest || getDestination("hunza");
      const waMsg = `Hello Venture Pakistan,\nI would like to inquire about booking a tour to ${targetDest.name} (${days} Days, ${travelers} Travelers). Please share details.`;
      return {
        text: `Here is our straightforward **3-step booking procedure**:\n\n1. **Select & Customize:** Choose your destination and select duration, travelers, and budget tier.\n2. **Review Itinerary & Quote:** Get transparent cost estimates covering private 4x4 transport, verified hotels, and mountain route guides.\n3. **Direct WhatsApp Confirmation:** Contact **Venture Pakistan** directly to lock your travel dates, vehicles, and hotel vouchers.\n\n📞 **Direct Contact Details:**\n• Phone: **${VENTURE_PHONE_LOCAL}** (${VENTURE_PHONE_INTL})\n• Email: **${BUSINESS_EMAIL}**\n• WhatsApp: **${VENTURE_PHONE_INTL}**\n\nNo advance payment is taken online; all bookings are finalized directly via WhatsApp.`,
        actions: [
          {
            label: `WhatsApp Venture (${VENTURE_PHONE_LOCAL})`,
            type: "whatsapp",
            payload: waMsg,
          },
          {
            label: `Plan ${targetDest.shortName} Trip`,
            type: "planner",
            payload: targetDest.id,
            overrides: { days, travelers, budget },
          },
        ],
      };
    }

    // 2. Pricing & Cost calculation inquiry
    if (
      /\b(price|cost|budget|rate|kharcha|kitna|pkr|package|quote|charges|expense|rupees|rs)\b/i.test(lower)
    ) {
      const targetDest = dest || getDestination("hunza");
      const itinerary = generateItinerary({
        destinationId: targetDest.id,
        days,
        travelers,
        budget,
        travelStyle: "Culture",
        pace: "Balanced",
        interests: ["Mountains", "Photography"],
      });

      const totalFmt = formatPKR(itinerary.costing.total);
      const transportFmt = formatPKR(itinerary.costing.transport);
      const stayFmt = formatPKR(itinerary.costing.accommodation);
      const foodActFmt = formatPKR(itinerary.costing.food + itinerary.costing.activities);
      const baseStartingFmt = formatPKR(targetDest.startingPrice);

      const waMsg = `Hello Venture Pakistan,\nI am interested in a ${days}-day ${budget} tour to ${targetDest.name} for ${travelers} travelers (Estimated ${totalFmt}). Please share customized package options.`;

      return {
        text: `Here is your customized **${targetDest.name}** cost estimate for **${days} Days** & **${travelers} Travelers** (${budget} Tier):\n\n• **Total Estimated Package:** **${totalFmt}**\n• **Private Transport (4x4 & Fuel):** **${transportFmt}**\n• **Stays & Accommodations:** **${stayFmt}**\n• **Food, Activities & Logistics:** **${foodActFmt}**\n• **Standard Baseline:** From **${baseStartingFmt}** per person\n\n*Note: Standalone flight (PIA) and intercity bus tickets are booked separately or arranged with Venture Pakistan upon request.*`,
        actions: [
          {
            label: `Open Planner (${targetDest.shortName})`,
            type: "planner",
            payload: targetDest.id,
            overrides: { days, travelers, budget },
          },
          {
            label: `Inquire on WhatsApp`,
            type: "whatsapp",
            payload: waMsg,
          },
          {
            label: `View ${targetDest.shortName} Details`,
            type: "detail",
            payload: targetDest.id,
          },
        ],
      };
    }

    // 3. Best Season / Weather inquiry
    if (
      /\b(season|weather|best time|month|kab|mausam|temperature|snow|barish|cherry blossom|autumn|winter|summer)\b/i.test(lower)
    ) {
      const targetDest = dest || getDestination("hunza");
      return {
        text: `**${targetDest.name}** Best Travel Season & Weather:\n\n• **Prime Season:** **${targetDest.bestSeason}**\n• **Altitude:** **${targetDest.altitude}**\n• **Ideal Duration:** **${targetDest.recommendedStay}**\n\n${targetDest.description}\n\n*Seasonal Tip:* In Gilgit-Baltistan, April is the famous Cherry Blossom season, June–August offers pleasant summer weather, and October brings vibrant golden autumn foliage.`,
        actions: [
          {
            label: `Plan Trip in ${targetDest.bestSeason}`,
            type: "planner",
            payload: targetDest.id,
            overrides: { days: targetDest.days, travelers: 2, budget: "Comfort" },
          },
          {
            label: `Explore ${targetDest.shortName}`,
            type: "detail",
            payload: targetDest.id,
          },
        ],
      };
    }

    // 4. Stays & Transport inquiry
    if (
      /\b(hotel|stay|resort|camp|kahan ruk|rehna|lodging|transport|jeep|prado|car|gari|vehicle|driver|road)\b/i.test(lower)
    ) {
      const targetDest = dest || getDestination("hunza");
      return {
        text: `**${targetDest.name}** Stay & Transport Guide:\n\n🏨 **Handpicked Stays:**\n${targetDest.stay}\n\n🚙 **Transport & Routes:**\n${targetDest.transport}\n\n• **Altitude:** **${targetDest.altitude}**\n• **Starting from:** **${formatPKR(targetDest.startingPrice)}** per person\n\nVenture Pakistan partners with verified high-mountain drivers and family-run boutique properties to ensure maximum comfort.`,
        actions: [
          {
            label: `Plan ${targetDest.shortName} Journey`,
            type: "planner",
            payload: targetDest.id,
          },
          {
            label: `WhatsApp for Stays & Transport`,
            type: "whatsapp",
            payload: `Hello Venture Pakistan,\nI would like to ask about hotel and transport options for ${targetDest.name}.`,
          },
        ],
      };
    }

    // 5. Family / Honeymoon Recommendations
    if (
      /\b(family|kids|parents|bachon|bachay|honeymoon|couple|romantic|shaadi)\b/i.test(lower)
    ) {
      const isHoneymoon = /\b(honeymoon|couple|romantic|shaadi)\b/i.test(lower);
      if (isHoneymoon) {
        return {
          text: `**Top Honeymoon Recommendations in Pakistan:**\n\n1. **Hunza Valley** (From **${formatPKR(85000)}**)\n   Luxus Hunza at Attabad Lake, Serena Karimabad, serene apricot orchards, and eagle's nest sunrises.\n2. **Skardu & Shigar** (From **${formatPKR(92000)}**)\n   Serena Shigar Fort Palace (17th-century royal suite), Shangrila Resort, and Sarfaranga cold desert stargazing.\n\nBoth destinations offer privacy, luxury boutique chalets, and breathtaking views.`,
          actions: [
            { label: "Plan Hunza Honeymoon", type: "planner", payload: "hunza", overrides: { days: 6, travelers: 2, budget: "Luxury" } },
            { label: "Plan Skardu Honeymoon", type: "planner", payload: "skardu", overrides: { days: 7, travelers: 2, budget: "Luxury" } },
            {
              label: "Chat on WhatsApp",
              type: "whatsapp",
              payload: "Hello Venture Pakistan,\nI would like to plan a private honeymoon trip. Please suggest customized luxury options.",
            },
          ],
        };
      }

      return {
        text: `**Top Family Tour Recommendations in Pakistan:**\n\n1. **Swat Valley & Kalam** (From **${formatPKR(58000)}**)\n   Smooth motorway access, Malam Jabba ski chairlift, Mahodand Lake, and riverside hotels in Kalam.\n2. **Hunza Valley** (From **${formatPKR(85000)}**)\n   Safe, welcoming, ancient forts, boat cruise on Attabad Lake, and paved Karakoram Highway.\n3. **Neelum Valley, Kashmir** (From **${formatPKR(54000)}**)\n   Gentle mountain streams, lush pine forests, and Arang Kel cable car.\n\nAll three destinations feature vetted family guest lodges and reliable paved road access.`,
        actions: [
          { label: "Plan Swat Family Tour", type: "planner", payload: "swat", overrides: { days: 5, travelers: 4, budget: "Comfort" } },
          { label: "Plan Hunza Family Tour", type: "planner", payload: "hunza", overrides: { days: 6, travelers: 4, budget: "Comfort" } },
          { label: "Plan Neelum Valley Tour", type: "planner", payload: "neelum", overrides: { days: 4, travelers: 4, budget: "Comfort" } },
        ],
      };
    }

    // 6. Specific destination inquiry
    if (dest) {
      return {
        text: `**${dest.name}** (${dest.region}) Overview:\n\n• **Starting from:** **${formatPKR(dest.startingPrice)}** (${dest.duration})\n• **Best Season:** **${dest.bestSeason}**\n• **Altitude:** **${dest.altitude}**\n\n${dest.description}\n\n**Key Highlights:**\n${dest.highlights.map((h) => `• ${h}`).join("\n")}`,
        actions: [
          {
            label: `Plan ${dest.shortName} Trip`,
            type: "planner",
            payload: dest.id,
          },
          {
            label: `View Destination Details`,
            type: "detail",
            payload: dest.id,
          },
          {
            label: `Inquire on WhatsApp`,
            type: "whatsapp",
            payload: `Hello Venture Pakistan, I would like to know more about the ${dest.name} tour package.`,
          },
        ],
      };
    }

    // 7. General greetings / fallback
    if (/\b(hi|hello|salam|assalam|aoa|hey|kese ho|hal chal)\b/i.test(lower)) {
      return {
        text: `Walaikum Assalam! I'm here to help you design your ideal Pakistan journey. You can ask me:\n\n• Tour prices: *"Hunza 5 days price?"* or *"Swat 4 din ka kharcha?"*\n• Weather & Seasons: *"Skardu best season?"*\n• Stays & Jeeps: *"Hunza hotels and transport?"*\n• Recommendations: *"Best places for family trip?"*\n• Booking: *"Venture WhatsApp number"* or *"How does booking work?"*`,
        actions: [
          { label: "Hunza 5 Days Price", type: "prompt", payload: "Hunza 5 days price?" },
          { label: "Family Places", type: "prompt", payload: "Best places for family" },
          { label: "Venture Contact", type: "prompt", payload: "Venture WhatsApp number" },
        ],
      };
    }

    // Default intelligent fallback
    return {
      text: `I'd love to help with that! We organize curated private tours across **Hunza**, **Skardu**, **Fairy Meadows**, **Swat**, **Chitral**, **Neelum Valley**, **Lahore**, and **Gwadar**.\n\nTry asking:\n• *"What is the starting price for Hunza?"*\n• *"Best places for honeymoon?"*\n• *"Skardu 6 days cost for 2 people?"*\n• *"How can I contact Venture Pakistan to book?"*`,
      actions: [
        { label: "Hunza 5 Days Price", type: "prompt", payload: "Hunza 5 days price?" },
        { label: "Best Places for Family", type: "prompt", payload: "Best places for family" },
        { label: "WhatsApp Venture Pakistan", type: "whatsapp", payload: "Hello Venture Pakistan, I need help planning a journey across Pakistan." },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Realistic typing delay (350ms - 550ms)
    setTimeout(() => {
      const reply = generateBotReply(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply.text,
        actions: reply.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action: BotAction) => {
    if (action.type === "planner") {
      setIsOpen(false);
      onOpenPlanner(action.payload, action.overrides);
    } else if (action.type === "detail") {
      setIsOpen(false);
      onOpenDetail(action.payload);
    } else if (action.type === "whatsapp") {
      window.open(whatsappLink(action.payload), "_blank", "noopener");
    } else if (action.type === "prompt") {
      handleSend(action.payload);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: WELCOME_MESSAGE,
        actions: [
          { label: "Hunza 5 Days Quote", type: "prompt", payload: "Hunza 5 days price?" },
          { label: "Family Recommendations", type: "prompt", payload: "Best places for family" },
          { label: "Booking Process", type: "prompt", payload: "How does booking work?" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  // Render text with **bold** highlights in text-champagne
  const renderMessageText = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={lIdx} className="h-1.5" />;
      }

      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={lIdx} className="text-[13px] leading-relaxed my-0.5">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-bold text-champagne">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER BUTTON ================= */}
      {/* Positioned at fixed bottom-[196px] right-4 z-[80] md:bottom-24 md:right-8 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={windowId}
        aria-label="Open Venture Pakistan AI Travel Concierge Chat"
        className="btn-press group fixed bottom-[196px] right-4 z-[80] flex items-center gap-2.5 rounded-full border border-champagne/45 bg-white/95 px-4 py-3 text-gray-950 shadow-xl backdrop-blur-xl hover:border-champagne hover:bg-white dark:bg-ink/95 dark:text-ivory dark:shadow-[0_10px_30px_rgba(201,168,106,0.28)] dark:hover:bg-coal md:bottom-24 md:right-8"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-gray-950 shadow-inner">
          <Sparkles size={17} className="transition-transform group-hover:rotate-12" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        </span>
        <div className="flex flex-col items-start text-left">
          <span className="text-[12px] font-extrabold tracking-wide text-gray-950 dark:text-ivory">AI Concierge</span>
          <span className="text-[10px] font-semibold text-amber-700 dark:text-champagne/85">Instant Quotes</span>
        </div>
      </button>

      {/* ================= EXPANDABLE CHAT WINDOW ================= */}
      {isOpen && (
        <div
          id={windowId}
          role="dialog"
          aria-modal="true"
          aria-label="Venture Pakistan AI Concierge Chat Window"
          className="fixed inset-x-3 bottom-20 z-[85] flex max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white/95 text-gray-950 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-champagne/35 dark:bg-ink/95 dark:text-ivory md:inset-auto md:bottom-24 md:right-8 md:h-[600px] md:w-[410px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/90 px-4 py-3 md:px-5 dark:border-ivory/10 dark:bg-coal/90">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-champagne/40 bg-white text-amber-700 dark:bg-ink dark:text-champagne">
                <Compass size={18} />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-coal" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-[16px] font-bold tracking-wide text-gray-950 dark:text-ivory">Venture Concierge</h3>
                  <span className="rounded bg-champagne/20 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-champagne">
                    Instant AI
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-ivory/50">Verified Pakistan Travel Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="btn-press flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-950 dark:text-ivory/60 dark:hover:bg-ivory/10 dark:hover:text-ivory"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
                className="btn-press flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-950 dark:text-ivory/60 dark:hover:bg-ivory/10 dark:hover:text-ivory"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
                      isUser
                        ? "rounded-tr-sm bg-champagne font-medium text-gray-950"
                        : "rounded-tl-sm border border-gray-200 bg-gray-50 text-gray-900 dark:border-ivory/10 dark:bg-coal/90 dark:text-ivory/90"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      renderMessageText(msg.text)
                    )}
                  </div>

                  {/* Interactive Action Buttons */}
                  {!isUser && msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act)}
                          className="btn-press inline-flex items-center gap-1.5 rounded-full border border-amber-600/40 bg-white px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-amber-800 shadow-sm hover:bg-champagne hover:text-gray-950 dark:border-champagne/40 dark:bg-ink/80 dark:text-champagne dark:hover:bg-champagne dark:hover:text-ink transition-colors"
                        >
                          {act.type === "planner" && <Calendar size={12} />}
                          {act.type === "detail" && <Compass size={12} />}
                          {act.type === "whatsapp" && <WhatsAppIcon size={12} className="text-[#25D366]" />}
                          {act.type === "prompt" && <ChevronRight size={12} />}
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="mt-1 px-1 text-[10px] font-semibold text-gray-400 dark:text-ivory/35">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-gray-200 bg-gray-50 px-4 py-3 dark:border-ivory/10 dark:bg-coal/80">
                  <span className="h-2 w-2 rounded-full bg-champagne typing-dot" />
                  <span className="h-2 w-2 rounded-full bg-champagne typing-dot [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-champagne typing-dot [animation-delay:0.4s]" />
                  <span className="ml-2 text-[11.5px] font-medium text-gray-600 dark:text-ivory/60">Venture Concierge is calculating...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t border-gray-200 bg-gray-50/70 px-3 py-2 dark:border-ivory/10 dark:bg-coal/60">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {QUICK_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="btn-press shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1 text-[11.5px] font-semibold text-gray-700 shadow-sm hover:border-amber-600 hover:text-gray-950 dark:border-ivory/15 dark:bg-ink/75 dark:text-ivory/70 dark:shadow-none dark:hover:border-champagne/60 dark:hover:text-ivory"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Bar */}
          <div className="border-t border-gray-200 bg-gray-50/90 p-3 dark:border-ivory/10 dark:bg-coal/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in English or Roman Urdu..."
                maxLength={500}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-[13px] text-gray-950 placeholder-gray-400 focus:border-amber-600 focus:outline-none dark:border-ivory/15 dark:bg-ink/80 dark:text-ivory dark:placeholder-ivory/40 dark:focus:border-champagne"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-champagne text-gray-950 disabled:opacity-40 hover:bg-champagnelight transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-gray-400 px-1 dark:text-ivory/30">
              <span>Instant Pakistan Travel Concierge</span>
              <span>Direct WhatsApp Handoff</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
