"use client";
import { useEffect, useMemo, useState } from "react";
import {
  X, Sparkles, MapPin, CalendarDays, Users, Wallet, Gauge, Minus, Plus,
  ChevronDown, Check, ArrowRight, Printer, Share2, MessageCircle, Bookmark,
  Compass, Camera, Mountain, UtensilsCrossed, Landmark, ShoppingBag, Tent,
  Clock, FileText, Lightbulb, Backpack, Sun, CircleAlert,
} from "lucide-react";
import {
  DESTINATIONS, LOADING_MESSAGES, formatPKR,
  type GeneratedTrip, type PlannerInput,
} from "../data/travel";
import { generateAITrip } from "../services/aiService";
import { SectionHeading, Reveal, useModalLifecycle } from "./ui";
import { WhatsAppIcon } from "./WhatsAppIcon";

const TRAVEL_STYLE_OPTS = ["Adventure", "Culture", "Relaxation", "Luxury", "Family", "Photography"];
const PACE_OPTS: Array<"Relaxed" | "Balanced" | "Packed"> = ["Relaxed", "Balanced", "Packed"];
const INTEREST_OPTS = [
  { id: "Mountains", icon: Mountain }, { id: "Food", icon: UtensilsCrossed },
  { id: "Photography", icon: Camera }, { id: "History", icon: Landmark },
  { id: "Nature", icon: Tent }, { id: "Shopping", icon: ShoppingBag }, { id: "Adventure", icon: Compass },
];
const BUDGET_OPTS: Array<PlannerInput["budget"]> = ["Economy", "Comfort", "Premium", "Luxury"];

/* ================= planner modal ================= */

export function PlannerModal({
  open, onClose, presetDestination, onGenerated, travelersDefault = 2, daysDefault = 5, budgetDefault = "Comfort",
}: {
  open: boolean;
  onClose: () => void;
  presetDestination: string;
  onGenerated: (trip: GeneratedTrip) => void;
  travelersDefault?: number;
  daysDefault?: number;
  budgetDefault?: PlannerInput["budget"];
}) {
  const [destinationId, setDestinationId] = useState(presetDestination);
  const [days, setDays] = useState(daysDefault);
  const [travelers, setTravelers] = useState(travelersDefault);
  const [budget, setBudget] = useState<PlannerInput["budget"]>(budgetDefault);
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [pace, setPace] = useState<PlannerInput["pace"]>("Balanced");
  const [interests, setInterests] = useState<string[]>(["Mountains", "Photography"]);
  const [generating, setGenerating] = useState(false);
  const [loadMsg, setLoadMsg] = useState(0);
  const [error, setError] = useState("");

  useModalLifecycle(open, () => { if (!generating) onClose(); });
  useEffect(() => {
    if (open) {
      setDestinationId(presetDestination);
      setDays(daysDefault);
      setTravelers(travelersDefault);
      setBudget(budgetDefault);
      setError("");
    }
  }, [open, presetDestination, daysDefault, travelersDefault, budgetDefault]);

  useEffect(() => {
    if (!generating) return;
    const iv = setInterval(() => setLoadMsg((m) => (m + 1) % LOADING_MESSAGES.length), 900);
    return () => clearInterval(iv);
  }, [generating]);

  const toggleInterest = (id: string) =>
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const estimated = useMemo(() => {
    const perDay: Record<string, number> = { Economy: 14000, Comfort: 22000, Premium: 34000, Luxury: 55000 };
    return Math.round((perDay[budget] * days * (1 + (travelers - 1) * 0.55)) / 1000) * 1000;
  }, [budget, days, travelers]);

  const handleGenerate = async () => {
    if (!destinationId) { setError("Please select a destination first."); return; }
    if (interests.length === 0) { setError("Pick at least one interest so we can shape your days."); return; }
    setError("");
    setGenerating(true);
    
    try {
      const trip = await generateAITrip({ destinationId, days, travelers, budget, travelStyle, pace, interests });
      setGenerating(false);
      onGenerated(trip);
    } catch (err) {
      setGenerating(false);
      setError("An error occurred while building your itinerary.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label="Trip planner">
      <div className="modal-backdrop absolute inset-0" onClick={() => { if (!generating) onClose(); }} />
      <div className="modal-panel relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white text-gray-950 dark:border-ivory/12 dark:bg-coal dark:text-ivory md:max-w-3xl md:rounded-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 md:px-8 dark:border-ivory/10">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/20 text-amber-700 dark:bg-champagne/15 dark:text-champagne">
              <Sparkles size={17} />
            </span>
            <div>
              <p className="eyebrow text-amber-700 dark:text-champagne">AI Trip Planner</p>
              <h3 className="font-display text-[22px] font-semibold leading-tight text-gray-950 dark:text-ivory">Your Trip, Your Rules.</h3>
            </div>
          </div>
          <button onClick={() => { if (!generating) onClose(); }} aria-label="Close planner"
            className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-gray-900 dark:border-ivory/15 dark:text-ivory/70 dark:hover:border-champagne dark:hover:text-ivory">
            <X size={18} />
          </button>
        </div>

        {generating ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-champagne/30" style={{ animation: "compassSpin 6s linear infinite" }}>
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-champagne" />
              </span>
              <Compass size={30} className="text-amber-700 dark:text-champagne" />
            </div>
            <h4 className="mt-6 font-display text-[28px] font-medium text-gray-950 dark:text-ivory">Curating your journey…</h4>
            <p className="mt-2 flex items-center gap-2 text-[14px] font-semibold text-gray-600 dark:text-ivory/60" aria-live="polite">
              {LOADING_MESSAGES[loadMsg]}
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-champagne" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </span>
            </p>
            <div className="mt-8 w-full max-w-sm space-y-2.5">
              {[92, 74, 85].map((w, i) => (
                <div key={i} className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-ivory/8">
                  <div className="shimmer-line h-full rounded-full" style={{ width: `${w}%`, animationDelay: `${i * 0.3}s` }} />
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-xs text-[12px] leading-relaxed text-gray-500 dark:text-ivory/35">
              Demo mode — itineraries are composed locally. A live AI concierge can be connected via API later.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
              {/* destination */}
              <label className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50" htmlFor="pl-dest">
                <MapPin size={12} className="mr-1.5 inline text-amber-700 dark:text-champagne" /> Destination
              </label>
              <div className="relative mt-2">
                <select
                  id="pl-dest"
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3.5 text-[15px] font-semibold text-gray-950 focus:border-amber-600 dark:border-ivory/15 dark:bg-ink dark:text-ivory dark:focus:border-champagne"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.region}</option>
                  ))}
                </select>
                <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-ivory/50" />
              </div>

              {/* days + travelers */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 dark:border-ivory/12 dark:bg-ink/60">
                  <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50">
                    <CalendarDays size={13} className="text-amber-700 dark:text-champagne" /> Days · 1–14
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button onClick={() => setDays((d) => Math.max(1, d - 1))} aria-label="Fewer days"
                      className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-amber-600 dark:border-ivory/15 dark:text-ivory dark:hover:border-champagne"><Minus size={16} /></button>
                    <span className="font-display text-[34px] font-semibold text-gray-950 dark:text-ivory tabular">{days}</span>
                    <button onClick={() => setDays((d) => Math.min(14, d + 1))} aria-label="More days"
                      className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-amber-600 dark:border-ivory/15 dark:text-ivory dark:hover:border-champagne"><Plus size={16} /></button>
                  </div>
                  <input type="range" min={1} max={14} value={days} onChange={(e) => setDays(+e.target.value)}
                    aria-label="Trip duration in days" className="mt-3 w-full accent-[#C9A86A]" />
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 dark:border-ivory/12 dark:bg-ink/60">
                  <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50">
                    <Users size={13} className="text-amber-700 dark:text-champagne" /> Travelers · 1–10+
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button onClick={() => setTravelers((t) => Math.max(1, t - 1))} aria-label="Fewer travelers"
                      className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-amber-600 dark:border-ivory/15 dark:text-ivory dark:hover:border-champagne"><Minus size={16} /></button>
                    <span className="font-display text-[34px] font-semibold text-gray-950 dark:text-ivory tabular">{travelers >= 10 ? "10+" : travelers}</span>
                    <button onClick={() => setTravelers((t) => Math.min(12, t + 1))} aria-label="More travelers"
                      className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-amber-600 dark:border-ivory/15 dark:text-ivory dark:hover:border-champagne"><Plus size={16} /></button>
                  </div>
                  <p className="mt-3 text-[12px] text-gray-500 dark:text-ivory/45">Groups of 10+ get custom transport & rates.</p>
                </div>
              </div>

              {/* budget */}
              <p className="mt-6 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50">
                <Wallet size={13} className="text-amber-700 dark:text-champagne" /> Budget tier
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BUDGET_OPTS.map((b) => (
                  <button key={b} onClick={() => setBudget(b)} aria-pressed={budget === b}
                    className={`btn-press rounded-lg border px-3 py-3 text-[13.5px] font-bold ${budget === b ? "border-amber-600 bg-champagne text-gray-950" : "border-gray-300 bg-white text-gray-800 hover:border-amber-600 dark:border-ivory/15 dark:bg-transparent dark:text-ivory/70 dark:hover:border-champagne/50"}`}>
                    {b}
                  </button>
                ))}
              </div>

              {/* style */}
              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50">Travel style</p>
              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
                {TRAVEL_STYLE_OPTS.map((s) => (
                  <button key={s} onClick={() => setTravelStyle(s)} aria-pressed={travelStyle === s}
                    className={`btn-press shrink-0 rounded-full border px-4 py-2.5 text-[13px] font-bold ${travelStyle === s ? "border-amber-600 bg-amber-50 text-amber-800 dark:border-champagne dark:bg-champagne/15 dark:text-champagne" : "border-gray-300 bg-white text-gray-800 dark:border-ivory/15 dark:bg-transparent dark:text-ivory/70"}`}>
                    {s}
                  </button>
                ))}
              </div>

              {/* pace */}
              <p className="mt-5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50">
                <Gauge size={13} className="text-amber-700 dark:text-champagne" /> Travel pace
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {PACE_OPTS.map((p) => (
                  <button key={p} onClick={() => setPace(p)} aria-pressed={pace === p}
                    className={`btn-press rounded-lg border px-3 py-3 text-[13px] font-bold ${pace === p ? "border-teal-600 bg-teal-50 text-teal-900 dark:border-teal dark:bg-teal/20 dark:text-ivory" : "border-gray-300 bg-white text-gray-800 dark:border-ivory/15 dark:bg-transparent dark:text-ivory/70"}`}>
                    {p}
                    <span className="mt-0.5 block text-[10.5px] font-semibold opacity-60">
                      {p === "Relaxed" ? "2 stops/day" : p === "Balanced" ? "3–4 stops" : "Dawn to dusk"}
                    </span>
                  </button>
                ))}
              </div>

              {/* interests */}
              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/50">Interests</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {INTEREST_OPTS.map(({ id, icon: Icon }) => {
                  const on = interests.includes(id);
                  return (
                    <button key={id} onClick={() => toggleInterest(id)} aria-pressed={on}
                      className={`btn-press inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold ${on ? "border-amber-600 bg-champagne text-gray-950" : "border-gray-300 bg-white text-gray-800 dark:border-ivory/15 dark:bg-transparent dark:text-ivory/70"}`}>
                      <Icon size={14} /> {id} {on && <Check size={13} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="mt-5 flex items-center gap-2 rounded-lg border border-copper/40 bg-copper/10 px-4 py-3 text-[13.5px] font-semibold text-amber-800 dark:text-champagnelight" role="alert">
                  <CircleAlert size={16} /> {error}
                </p>
              )}
            </div>

            {/* footer */}
            <div className="border-t border-gray-200 bg-gray-50/90 px-5 py-4 backdrop-blur-md md:px-8 dark:border-ivory/10 dark:bg-ink/60">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/40">Estimated from</p>
                  <p className="font-display text-[24px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(estimated)}</p>
                </div>
                <button onClick={handleGenerate}
                  className="btn-press inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-gray-950 hover:bg-champagnelight md:px-8">
                  <Sparkles size={16} /> Generate my journey
                </button>
              </div>
              <p className="mt-2 text-[11.5px] text-gray-500 dark:text-ivory/35">Estimated pricing may vary depending on season, availability and final booking selections.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= itinerary view ================= */

export function ItineraryView({
  open, onClose, trip, onSave, saved, onBook,
}: {
  open: boolean;
  onClose: () => void;
  trip: GeneratedTrip | null;
  onSave: (t: GeneratedTrip) => void;
  saved: boolean;
  onBook: (t: GeneratedTrip) => void;
}) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));
  const [activeTab, setActiveTab] = useState<"plan" | "cost" | "notes">("plan");

  useModalLifecycle(open, onClose);
  useEffect(() => { if (open) { setOpenDays(new Set([1])); setActiveTab("plan"); } }, [open, trip?.id]);

  if (!open || !trip) return null;
  const toggleDay = (d: number) =>
    setOpenDays((prev) => { const n = new Set(prev); if (n.has(d)) n.delete(d); else n.add(d); return n; });

  const costRows = [
    { label: "Transport & driver", value: trip.costing.transport },
    { label: "Accommodation", value: trip.costing.accommodation },
    { label: "Activities & entry", value: trip.costing.activities },
    { label: "Food & dining", value: trip.costing.food },
    { label: "Local guide & support", value: trip.costing.guide },
  ];

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Itinerary for ${trip.destination}`}>
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="modal-panel relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white text-gray-950 dark:border-ivory/12 dark:bg-ink dark:text-ivory md:max-w-4xl md:rounded-xl">
        {/* document header */}
        <div className="relative shrink-0 overflow-hidden">
          <img src={DESTINATIONS.find((d) => d.id === trip.destinationId)?.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25 dark:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/95 to-white dark:from-ink/40 dark:via-ink/70 dark:to-ink" />
          <div className="relative flex items-start justify-between gap-4 px-5 pb-5 pt-5 md:px-8">
            <div>
              <p className="eyebrow text-amber-700 dark:text-champagne">Your travel document</p>
              <h3 className="mt-2 font-display text-[30px] font-medium leading-[1.05] text-gray-950 dark:text-ivory md:text-[38px]">
                {trip.destination}, <span className="italic text-amber-600 dark:text-champagne">your way.</span>
              </h3>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] font-semibold text-gray-600 dark:text-ivory/65">
                <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-amber-700 dark:text-champagne" /> {trip.duration} days</span>
                <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-amber-700 dark:text-champagne" /> {trip.travelers} travelers</span>
                <span className="inline-flex items-center gap-1.5"><FileText size={13} className="text-amber-700 dark:text-champagne" /> {trip.travelStyle} · {trip.pace}</span>
                <span className="inline-flex items-center gap-1.5"><Wallet size={13} className="text-amber-700 dark:text-champagne" /> {trip.budget}</span>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close itinerary"
              className="btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white/80 text-gray-800 shadow-sm backdrop-blur-md hover:border-gray-950 dark:border-ivory/20 dark:bg-ink/60 dark:text-ivory dark:shadow-none dark:hover:border-champagne">
              <X size={18} />
            </button>
          </div>
          {/* tabs */}
          <div className="relative flex gap-1 border-t border-gray-200 bg-white/90 px-5 backdrop-blur-md md:px-8 dark:border-ivory/10 dark:bg-ink/70" role="tablist" aria-label="Itinerary sections">
            {(["plan", "cost", "notes"] as const).map((t) => (
              <button key={t} role="tab" aria-selected={activeTab === t} onClick={() => setActiveTab(t)}
                className={`btn-press relative px-4 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.16em] ${activeTab === t ? "text-amber-700 dark:text-champagne" : "text-gray-500 hover:text-gray-950 dark:text-ivory/45 dark:hover:text-ivory"}`}>
                {t === "plan" ? "Day by day" : t === "cost" ? "Budget" : "Insider notes"}
                {activeTab === t && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-amber-600 dark:bg-champagne" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          {activeTab === "plan" && (
            <ol className="space-y-3">
              {trip.itinerary.map((d) => {
                const isOpen = openDays.has(d.day);
                return (
                  <li key={d.day} className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/70 shadow-sm dark:border-ivory/12 dark:bg-coal dark:shadow-none">
                    <button onClick={() => toggleDay(d.day)} aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-4 py-4 text-left md:px-5">
                      <span className="font-display text-[15px] font-bold tracking-[0.12em] text-amber-700 dark:text-champagne">
                        {String(d.day).padStart(2, "0")}
                      </span>
                      <span className="h-8 w-px bg-gray-300 dark:bg-ivory/12" aria-hidden="true" />
                      <span className="flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500 dark:text-ivory/40">Day {String(d.day).padStart(2, "0")}</span>
                        <span className="block font-display text-[19px] font-semibold text-gray-950 dark:text-ivory">{d.title}</span>
                      </span>
                      <ChevronDown size={18} className={`shrink-0 text-gray-500 transition-transform dark:text-ivory/50 ${isOpen ? "rotate-180 text-amber-700 dark:text-champagne" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="grid gap-px border-t border-gray-200 bg-gray-200 sm:grid-cols-2 dark:border-ivory/10 dark:bg-ivory/10">
                        {[
                          { t: "Morning", v: d.morning }, { t: "Afternoon", v: d.afternoon },
                          { t: "Evening", v: d.evening }, { t: "Dining suggestion", v: d.dining },
                        ].map((s) => (
                          <div key={s.t} className="bg-white px-4 py-3.5 md:px-5 dark:bg-coal">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal-700 dark:text-teal">{s.t}</p>
                            <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-700 dark:text-ivory/75">{s.v}</p>
                          </div>
                        ))}
                        {d.stayNote && (
                          <div className="bg-white px-4 py-3 sm:col-span-2 md:px-5 dark:bg-coal">
                            <p className="text-[12.5px] text-gray-600 dark:text-ivory/50"><span className="font-bold text-gray-950 dark:text-ivory/70">Stay — </span>{d.stayNote}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {activeTab === "cost" && (
            <div>
              <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-5 text-center md:p-6 dark:border-champagne/25 dark:bg-champagne/8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-gray-500 dark:text-ivory/50">Estimated trip cost</p>
                <p className="mt-1 font-display text-[42px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(trip.costing.total)}</p>
                <p className="text-[12px] text-gray-500 dark:text-ivory/45">{trip.travelers} travelers · {trip.duration} days · {trip.budget} tier</p>
              </div>
              <div className="mt-4 space-y-2">
                {costRows.map((r) => (
                  <div key={r.label} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3 dark:border-ivory/10 dark:bg-coal">
                    <span className="flex-1 text-[14px] font-semibold text-gray-800 dark:text-ivory/80">{r.label}</span>
                    <span className="text-[14px] font-bold text-gray-950 dark:text-ivory tabular">{formatPKR(r.value)}</span>
                  </div>
                ))}
                <div className="mt-2">
                  <div className="flex h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-ivory/10">
                    {["bg-champagne", "bg-teal", "bg-copper", "bg-gray-400 dark:bg-ivory/60", "bg-gray-300 dark:bg-ivory/30"].map((c, i) => (
                      <span key={i} className={c} style={{ width: `${(costRows[i].value / trip.costing.total) * 100}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-gray-500 dark:text-ivory/40">
                Estimated pricing may vary depending on season, availability and final booking selections. Final quote is confirmed on WhatsApp with Venture Pakistan.
              </p>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-5">
              <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-5 dark:border-ivory/12 dark:bg-coal">
                <h5 className="flex items-center gap-2 font-display text-[20px] font-semibold text-gray-950 dark:text-ivory"><Lightbulb size={17} className="text-amber-700 dark:text-champagne" /> Insider travel notes</h5>
                <ul className="mt-3 space-y-2.5">
                  {trip.insiderNotes.map((n, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-gray-700 dark:text-ivory/70">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-champagne" />{n}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-5 dark:border-ivory/12 dark:bg-coal">
                  <h5 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.16em] text-gray-950 dark:text-ivory"><Backpack size={15} className="text-amber-700 dark:text-champagne" /> Packing essentials</h5>
                  <ul className="mt-3 space-y-2 text-[13px] text-gray-600 dark:text-ivory/65">
                    {trip.packing.map((p) => <li key={p} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-teal-700 dark:text-teal" />{p}</li>)}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-5 dark:border-ivory/12 dark:bg-coal">
                    <h5 className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.16em] text-gray-950 dark:text-ivory"><Sun size={15} className="text-amber-700 dark:text-champagne" /> Best time to visit</h5>
                    <p className="mt-2 font-display text-[20px] text-amber-700 dark:text-champagne">{trip.bestTime}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-5 dark:border-ivory/12 dark:bg-coal">
                    <h5 className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-gray-950 dark:text-ivory">Travel tips</h5>
                    <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-gray-600 dark:text-ivory/60">
                      {trip.travelTips.map((t) => <li key={t}>· {t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* sticky actions */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 md:px-8 dark:border-ivory/10 dark:bg-coal">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button onClick={() => onSave(trip)}
              className={`btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.1em] ${saved ? "border-teal-600 bg-teal-50 text-teal-800 dark:border-teal dark:bg-teal/15 dark:text-teal" : "border-gray-300 text-gray-900 hover:border-amber-600 dark:border-ivory/20 dark:text-ivory dark:hover:border-champagne"}`}>
              <Bookmark size={15} className={saved ? "fill-teal-700 dark:fill-teal" : ""} /> {saved ? "Saved to my trips" : "Save this journey"}
            </button>
            <button onClick={() => { try { window.print(); } catch { /* noop */ } }} aria-label="Print itinerary"
              className="btn-press hidden items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-gray-900 hover:border-amber-600 sm:inline-flex dark:border-ivory/20 dark:text-ivory dark:hover:border-champagne">
              <Printer size={15} />
            </button>
            <button onClick={() => onBook(trip)}
              className="btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-white hover:brightness-105 transition-all">
              <WhatsAppIcon size={16} /> Book via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= planner promo section ================= */

export function PlannerSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section id="planner" className="relative scroll-mt-20 overflow-hidden bg-[#f0ece3] py-20 md:py-28 dark:bg-ember">
      <div className="pointer-events-none absolute -right-24 top-10 select-none font-display text-[22vw] font-bold leading-none text-gray-950/[0.03] dark:text-ivory/[0.025] md:text-[16rem]" aria-hidden="true">
        AI
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="AI Trip Planner"
              title={<>Your Trip, <span className="italic text-amber-600 dark:text-champagne">Your Rules.</span></>}
              copy="Tell us your destination, days, budget and pace. Get a day-by-day travel document in seconds — then refine it with Venture Pakistan on WhatsApp."
            />
            <Reveal delay={140}>
              <ul className="mt-8 space-y-4">
                {[
                  { t: "Day-by-day plan", d: "Morning, afternoon, evening — plus dining picks for every day." },
                  { t: "Honest budgeting", d: "Transport, stays, food and activities broken down in PKR." },
                  { t: "Local intelligence", d: "Insider notes, packing lists and timing advice baked in." },
                ].map((f, i) => (
                  <li key={f.t} className="flex gap-4">
                    <span className="font-display text-[20px] font-semibold text-amber-700/80 dark:text-champagne/70 tabular">0{i + 1}</span>
                    <div className="border-l border-gray-300 pl-4 dark:border-ivory/12">
                      <p className="text-[15px] font-bold text-gray-950 dark:text-ivory">{f.t}</p>
                      <p className="mt-0.5 text-[13.5px] text-gray-600 dark:text-ivory/55">{f.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={onOpen}
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-champagne px-8 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-gray-950 hover:bg-champagnelight">
                  <Sparkles size={16} /> Start planning <ArrowRight size={15} />
                </button>
                <p className="flex items-center justify-center gap-2 text-[12px] font-semibold text-gray-500 dark:text-ivory/40 sm:justify-start">
                  <Share2 size={13} /> Free · No sign-up · 60 seconds
                </p>
              </div>
            </Reveal>
          </div>

          {/* preview card */}
          <Reveal delay={150} scale>
            <button onClick={onOpen} className="group block w-full text-left" aria-label="Open the trip planner">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-colors group-hover:border-amber-500/50 dark:border-ivory/12 dark:bg-ink dark:group-hover:border-champagne/40">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5 dark:border-ivory/10">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gray-500 dark:text-ivory/50">Sample output · Hunza 5 days</p>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-teal-800 dark:bg-teal/15 dark:text-teal">Preview</span>
                </div>
                <div className="space-y-2.5 p-5">
                  {[
                    { d: "01", t: "Arrival & First Impressions", open: true },
                    { d: "02", t: "Forts of Karimabad", open: false },
                    { d: "03", t: "Attabad & Gulmit", open: false },
                  ].map((r) => (
                    <div key={r.d} className={`rounded-lg border px-4 py-3 transition-colors ${r.open ? "border-amber-400/60 bg-amber-50/50 dark:border-champagne/40 dark:bg-champagne/[0.06]" : "border-gray-200 dark:border-ivory/10"}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-[15px] font-bold text-amber-700 dark:text-champagne">{r.d}</span>
                        <span className="text-[14px] font-bold text-gray-950 dark:text-ivory">{r.t}</span>
                      </div>
                      {r.open && (
                        <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
                          {["Morning", "Afternoon", "Evening"].map((s) => (
                            <div key={s} className="rounded bg-gray-100 px-2 py-1.5 text-gray-600 dark:bg-ivory/6 dark:text-ivory/55">{s} plan…</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-ivory/10">
                    <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-ivory/50">Estimated total</span>
                    <span className="font-display text-[22px] font-semibold text-amber-700 dark:text-champagne tabular">PKR 185,000</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-ivory/10 dark:bg-coal">
                  <span className="inline-flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.12em] text-amber-700 dark:text-champagne">
                    Build mine now <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

