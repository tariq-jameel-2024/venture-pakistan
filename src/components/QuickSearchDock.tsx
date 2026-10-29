"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Wallet,
  ArrowRight,
  ChevronDown,
  X,
  Check,
  Sparkles,
  SlidersHorizontal,
  Minus,
  Plus,
  Compass,
} from "lucide-react";
import { DESTINATIONS, formatPKR, type PlannerInput } from "../data/travel";

interface QuickSearchDockProps {
  initialValues?: {
    dest: string;
    date: string;
    duration: string;
    travelers: string;
    budget: string;
  };
  onBuildTrip: (params: {
    dest: string;
    days: number;
    travelers: number;
    budget: PlannerInput["budget"];
    date?: string;
  }) => void;
}

const SEASONS = [
  { label: "Spring Blossom", months: "Apr — May", hint: "Apricot blooms & crisp views", val: "2026-05" },
  { label: "Summer Peak", months: "Jun — Aug", hint: "Warm days, open passes & trekking", val: "2026-07" },
  { label: "Golden Autumn", months: "Sep — Oct", hint: "Golden poplar foliage & calm lakes", val: "2026-10" },
  { label: "Winter Magic", months: "Nov — Feb", hint: "Frozen waterfalls & snow peaks", val: "2026-12" },
];

const BUDGET_TIERS: { id: PlannerInput["budget"]; label: string; desc: string; starting: number; badge?: string }[] = [
  { id: "Economy", label: "Economy", desc: "Clean guest houses, reliable transport", starting: 50000 },
  { id: "Comfort", label: "Comfort", desc: "Handpicked 3-4★ boutique stays, private 4x4", starting: 85000, badge: "Most Popular" },
  { id: "Premium", label: "Premium", desc: "Heritage forts, Serena lodges, dedicated guide", starting: 140000 },
  { id: "Luxury", label: "Luxury", desc: "VIP suites, bespoke culinary, private excursions", starting: 250000 },
];

const DURATION_OPTIONS = [
  { days: 3, label: "3 Days", sub: "Quick getaway" },
  { days: 5, label: "5 Days", sub: "Signature balance", recommended: true },
  { days: 7, label: "7 Days", sub: "Deep immersion" },
  { days: 10, label: "10 Days", sub: "Two valleys combined" },
  { days: 14, label: "14 Days", sub: "Grand Karakoram expedition" },
];

export function QuickSearchDock({
  initialValues = {
    dest: "hunza",
    date: "2026-05",
    duration: "5",
    travelers: "2",
    budget: "Comfort",
  },
  onBuildTrip,
}: QuickSearchDockProps) {
  const [dest, setDest] = useState(initialValues.dest);
  const [date, setDate] = useState(initialValues.date);
  const [duration, setDuration] = useState(parseInt(initialValues.duration, 10) || 5);
  const [adults, setAdults] = useState(Math.max(1, parseInt(initialValues.travelers, 10) || 2));
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState<PlannerInput["budget"]>((initialValues.budget as PlannerInput["budget"]) || "Comfort");

  // Popover state for desktop
  const [activePopover, setActivePopover] = useState<null | "dest" | "dates" | "duration" | "travelers" | "budget">(null);
  const [destQuery, setDestQuery] = useState("");

  // Mobile Bottom Sheet state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"dest" | "dates" | "duration" | "travelers" | "budget">("dest");

  const dockRef = useRef<HTMLDivElement>(null);

  const totalTravelers = adults + children;

  const currentDest = useMemo(() => {
    return DESTINATIONS.find((d) => d.id === dest) || DESTINATIONS[0];
  }, [dest]);

  const filteredDestinations = useMemo(() => {
    if (!destQuery.trim()) return DESTINATIONS;
    const q = destQuery.toLowerCase();
    return DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.shortName.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [destQuery]);

  // Click outside to dismiss desktop popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePopover(null);
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Body scroll locking when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileDrawerOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActivePopover(null);
    setMobileDrawerOpen(false);
    onBuildTrip({
      dest,
      days: duration,
      travelers: totalTravelers,
      budget,
      date,
    });
  };

  const getMonthDisplay = (val: string) => {
    if (!val) return "Flexible dates";
    const seasonMatch = SEASONS.find((s) => s.val === val);
    if (seasonMatch) return seasonMatch.label;
    try {
      const [y, m] = val.split("-");
      const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return val;
    }
  };

  return (
    <div ref={dockRef} className="relative z-30 mt-8 w-full max-w-6xl">
      {/* ==============================================================
          DESKTOP DOCK (Hidden below md / 768px)
          ============================================================== */}
      <div className="hidden rounded-2xl border border-gray-200/90 bg-white/95 text-gray-950 p-2 shadow-xl backdrop-blur-2xl dark:border-ivory/15 dark:bg-ink/80 dark:text-ivory dark:shadow-[0_20px_50px_rgba(0,0,0,0.65)] md:block transition-colors">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 items-center gap-1">
          {/* 1. DESTINATION */}
          <div className="relative col-span-3">
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "dest" ? null : "dest")}
              className={`group flex w-full flex-col rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                activePopover === "dest"
                  ? "bg-gray-100 ring-1 ring-champagne/60 dark:bg-ivory/12 dark:ring-champagne/50"
                  : "hover:bg-gray-100/80 dark:hover:bg-ivory/5"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-champagne">
                <MapPin size={12} className="text-champagne" /> Destination
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="truncate text-[15px] font-bold text-gray-950 dark:text-ivory">
                  {currentDest.shortName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 dark:text-ivory/40 transition-transform duration-200 ${
                    activePopover === "dest" ? "rotate-180 text-champagne" : "group-hover:text-gray-700 dark:group-hover:text-ivory"
                  }`}
                />
              </div>
              <span className="truncate text-[11px] text-gray-500 dark:text-ivory/50">{currentDest.region}</span>
            </button>

            {/* Destination Popover */}
            {activePopover === "dest" && (
              <div className="popover-animate absolute left-0 top-[calc(100%+8px)] z-50 w-84 rounded-2xl border border-gray-200 bg-white p-3 text-gray-950 shadow-2xl dark:border-ivory/15 dark:bg-coal/98 dark:text-ivory">
                <div className="mb-2 px-1">
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="Search valleys, peaks..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:border-champagne focus:outline-none dark:border-ivory/10 dark:bg-ink/70 dark:text-ivory dark:placeholder-ivory/40"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 gap-1">
                    {filteredDestinations.map((d) => {
                      const isSelected = d.id === dest;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setDest(d.id);
                            setActivePopover(null);
                          }}
                          className={`flex items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                            isSelected
                              ? "bg-champagne/15 text-champagne border border-champagne/30"
                              : "text-gray-800 hover:bg-gray-100 dark:text-ivory dark:hover:bg-ivory/5"
                          }`}
                        >
                          <img
                            src={d.thumb}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="truncate text-[13.5px] font-bold">{d.name}</span>
                              {isSelected && <Check size={14} className="text-champagne shrink-0 ml-1" />}
                            </div>
                            <span className="block text-[11px] text-gray-500 dark:text-ivory/50">
                              {d.region} · {d.altitude}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. DATES */}
          <div className="relative col-span-2">
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "dates" ? null : "dates")}
              className={`group flex w-full flex-col rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                activePopover === "dates"
                  ? "bg-gray-100 ring-1 ring-champagne/60 dark:bg-ivory/12 dark:ring-champagne/50"
                  : "hover:bg-gray-100/80 dark:hover:bg-ivory/5"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-champagne">
                <CalendarDays size={12} className="text-champagne" /> Travel Month
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="truncate text-[15px] font-bold text-gray-950 dark:text-ivory">
                  {getMonthDisplay(date)}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 dark:text-ivory/40 transition-transform duration-200 ${
                    activePopover === "dates" ? "rotate-180 text-champagne" : "group-hover:text-gray-700 dark:group-hover:text-ivory"
                  }`}
                />
              </div>
              <span className="truncate text-[11px] text-gray-500 dark:text-ivory/50">Season recommendations</span>
            </button>

            {/* Dates Popover */}
            {activePopover === "dates" && (
              <div className="popover-animate absolute left-0 top-[calc(100%+8px)] z-50 w-80 rounded-2xl border border-gray-200 bg-white p-4 text-gray-950 shadow-2xl dark:border-ivory/15 dark:bg-coal/98 dark:text-ivory">
                <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-ivory/50">
                  Recommended Seasons
                </p>
                <div className="space-y-1.5">
                  {SEASONS.map((s) => {
                    const active = date === s.val;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => {
                          setDate(s.val);
                          setActivePopover(null);
                        }}
                        className={`flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-all ${
                          active
                            ? "bg-champagne/15 border border-champagne/40 text-gray-950 dark:text-ivory"
                            : "border border-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-ivory/5 dark:text-ivory/90"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold">{s.label}</span>
                            <span className="rounded bg-gray-100 text-champagne dark:bg-ivory/10 px-1.5 py-0.5 text-[10px] font-semibold">
                              {s.months}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-ivory/50">{s.hint}</p>
                        </div>
                        {active && <Check size={14} className="mt-1 text-champagne shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-gray-200 dark:border-ivory/10 pt-3">
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-ivory/60">
                    Or select specific month:
                    <input
                      type="month"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setActivePopover(null);
                      }}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-bold text-gray-900 [color-scheme:light] focus:border-champagne focus:outline-none dark:border-ivory/15 dark:bg-ink/80 dark:text-ivory dark:[color-scheme:dark]"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 3. DURATION */}
          <div className="relative col-span-2">
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "duration" ? null : "duration")}
              className={`group flex w-full flex-col rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                activePopover === "duration"
                  ? "bg-gray-100 ring-1 ring-champagne/60 dark:bg-ivory/12 dark:ring-champagne/50"
                  : "hover:bg-gray-100/80 dark:hover:bg-ivory/5"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-champagne">
                <Clock size={12} className="text-champagne" /> Duration
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[15px] font-bold text-gray-950 dark:text-ivory">{duration} Days</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 dark:text-ivory/40 transition-transform duration-200 ${
                    activePopover === "duration" ? "rotate-180 text-champagne" : "group-hover:text-gray-700 dark:group-hover:text-ivory"
                  }`}
                />
              </div>
              <span className="truncate text-[11px] text-gray-500 dark:text-ivory/50">
                {duration === 5 ? "Recommended" : `${duration - 1} nights`}
              </span>
            </button>

            {/* Duration Popover */}
            {activePopover === "duration" && (
              <div className="popover-animate absolute left-0 top-[calc(100%+8px)] z-50 w-72 rounded-2xl border border-gray-200 bg-white p-3 text-gray-950 shadow-2xl dark:border-ivory/15 dark:bg-coal/98 dark:text-ivory">
                <p className="mb-2 px-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-ivory/50">
                  Select Trip Length
                </p>
                <div className="space-y-1">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = duration === opt.days;
                    return (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => {
                          setDuration(opt.days);
                          setActivePopover(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                          isSelected
                            ? "bg-champagne/15 border border-champagne/40 text-champagne font-bold"
                            : "border border-transparent text-gray-800 hover:bg-gray-100 dark:text-ivory dark:hover:bg-ivory/5"
                        }`}
                      >
                        <div>
                          <span className="text-[13.5px]">{opt.label}</span>
                          <span className="ml-2 text-[11px] font-normal text-gray-500 dark:text-ivory/45">({opt.sub})</span>
                        </div>
                        {opt.recommended && (
                          <span className="rounded bg-champagne/20 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-champagne">
                            Best
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. TRAVELERS */}
          <div className="relative col-span-2">
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "travelers" ? null : "travelers")}
              className={`group flex w-full flex-col rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                activePopover === "travelers"
                  ? "bg-gray-100 ring-1 ring-champagne/60 dark:bg-ivory/12 dark:ring-champagne/50"
                  : "hover:bg-gray-100/80 dark:hover:bg-ivory/5"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-champagne">
                <Users size={12} className="text-champagne" /> Travelers
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[15px] font-bold text-gray-950 dark:text-ivory">
                  {totalTravelers} {totalTravelers === 1 ? "Traveler" : "Travelers"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 dark:text-ivory/40 transition-transform duration-200 ${
                    activePopover === "travelers" ? "rotate-180 text-champagne" : "group-hover:text-gray-700 dark:group-hover:text-ivory"
                  }`}
                />
              </div>
              <span className="truncate text-[11px] text-gray-500 dark:text-ivory/50">
                {adults} Adult{adults > 1 ? "s" : ""}
                {children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}
              </span>
            </button>

            {/* Travelers Popover */}
            {activePopover === "travelers" && (
              <div className="popover-animate absolute left-0 top-[calc(100%+8px)] z-50 w-72 rounded-2xl border border-gray-200 bg-white p-4 text-gray-950 shadow-2xl dark:border-ivory/15 dark:bg-coal/98 dark:text-ivory">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-gray-950 dark:text-ivory">Adults</p>
                      <p className="text-[11px] text-gray-500 dark:text-ivory/45">Age 13 and above</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        disabled={adults <= 1}
                        className="btn-press flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-800 dark:border-ivory/20 dark:text-ivory disabled:opacity-30"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-[14px] font-bold tabular text-gray-950 dark:text-ivory">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                        className="btn-press flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-champagne dark:border-ivory/20 dark:text-ivory"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-ivory/10 pt-3">
                    <div>
                      <p className="text-[13px] font-bold text-gray-950 dark:text-ivory">Children</p>
                      <p className="text-[11px] text-gray-500 dark:text-ivory/45">Ages 0 — 12</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        disabled={children <= 0}
                        className="btn-press flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-800 dark:border-ivory/20 dark:text-ivory disabled:opacity-30"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-[14px] font-bold tabular text-gray-950 dark:text-ivory">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                        className="btn-press flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-champagne dark:border-ivory/20 dark:text-ivory"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-ivory/10 pt-2.5">
                    <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-ivory/40">
                      Quick select
                    </p>
                    <div className="flex gap-1.5">
                      {[
                        { label: "Solo", a: 1, c: 0 },
                        { label: "Couple", a: 2, c: 0 },
                        { label: "Family", a: 2, c: 2 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setAdults(preset.a);
                            setChildren(preset.c);
                            setActivePopover(null);
                          }}
                          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 py-1 text-center text-[11px] font-bold text-gray-800 hover:border-champagne hover:text-champagne dark:border-ivory/12 dark:bg-ivory/5 dark:text-ivory/80"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. BUDGET */}
          <div className="relative col-span-3">
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === "budget" ? null : "budget")}
              className={`group flex w-full flex-col rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                activePopover === "budget"
                  ? "bg-gray-100 ring-1 ring-champagne/60 dark:bg-ivory/12 dark:ring-champagne/50"
                  : "hover:bg-gray-100/80 dark:hover:bg-ivory/5"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-champagne">
                <Wallet size={12} className="text-champagne" /> Budget Tier
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[15px] font-bold text-gray-950 dark:text-ivory">{budget}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 dark:text-ivory/40 transition-transform duration-200 ${
                    activePopover === "budget" ? "rotate-180 text-champagne" : "group-hover:text-gray-700 dark:group-hover:text-ivory"
                  }`}
                />
              </div>
              <span className="truncate text-[11px] text-gray-500 dark:text-ivory/50">
                {budget === "Comfort" ? "From PKR 85k / person" : "Bespoke tier"}
              </span>
            </button>

            {/* Budget Popover */}
            {activePopover === "budget" && (
              <div className="popover-animate absolute right-0 top-[calc(100%+8px)] z-50 w-80 rounded-2xl border border-gray-200 bg-white p-3 text-gray-950 shadow-2xl dark:border-ivory/15 dark:bg-coal/98 dark:text-ivory">
                <p className="mb-2 px-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-ivory/50">
                  Select Travel Standard
                </p>
                <div className="space-y-1.5">
                  {BUDGET_TIERS.map((tier) => {
                    const isSelected = budget === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          setBudget(tier.id);
                          setActivePopover(null);
                        }}
                        className={`flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-all ${
                          isSelected
                            ? "bg-champagne/15 border border-champagne/40 text-gray-950 dark:text-ivory"
                            : "border border-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-ivory/5 dark:text-ivory/90"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13.5px] font-bold">{tier.label}</span>
                            {tier.badge && (
                              <span className="rounded bg-champagne/20 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-champagne">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-ivory/50">{tier.desc}</p>
                          <p className="mt-1 text-[11px] font-semibold text-champagne">
                            From {formatPKR(tier.starting)}
                          </p>
                        </div>
                        {isSelected && <Check size={14} className="mt-1 text-champagne shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 6. BUILD MY TRIP CTA (Integrated in dock) */}
          <div className="col-span-12 mt-1 flex justify-end px-2 pb-1 pt-1 border-t border-gray-200/80 dark:border-ivory/8">
            <div className="flex w-full items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-gray-600 dark:text-ivory/50 hidden lg:inline">
                Curating with local drivers, heritage stays & transparent pricing.
              </span>
              <button
                type="submit"
                className="glow-champagne group flex items-center justify-center gap-2 rounded-xl bg-champagne px-7 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-gray-950 hover:bg-champagnelight w-full sm:w-auto"
              >
                <span>Build my trip</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ==============================================================
          MOBILE SEARCH BAR (Clean, tap-friendly summary trigger)
          ============================================================== */}
      <div className="block md:hidden">
        <div className="rounded-2xl border border-gray-200/90 bg-white/95 text-gray-900 p-4 shadow-xl backdrop-blur-xl dark:border-ivory/20 dark:bg-ink/90 dark:text-ivory transition-colors">
          <button
            type="button"
            onClick={() => {
              setMobileTab("dest");
              setMobileDrawerOpen(true);
            }}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-champagne/15 text-champagne">
                <MapPin size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-display text-[17px] font-semibold text-gray-950 dark:text-ivory">
                    {currentDest.shortName}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-champagne" />
                  <span className="text-[13px] font-bold text-champagne">{duration} Days</span>
                </div>
                <p className="truncate text-[12px] text-gray-600 dark:text-ivory/55">
                  {getMonthDisplay(date)} · {totalTravelers} {totalTravelers === 1 ? "Traveler" : "Travelers"} · {budget}
                </p>
              </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-champagne dark:border-ivory/15 dark:bg-ivory/5">
              <SlidersHorizontal size={15} />
            </div>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="glow-champagne mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-champagne py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-gray-950"
          >
            <span>Build my trip</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ==============================================================
          MOBILE BOTTOM SHEET MODAL (Stacked, touch-friendly)
          ============================================================== */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-end justify-center md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Trip planner filters"
        >
          {/* Backdrop */}
          <div
            className="modal-backdrop absolute inset-0"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-up sheet */}
          <div className="modal-panel relative flex max-h-[85svh] w-full flex-col rounded-t-3xl border-t border-gray-200 bg-white pb-env text-gray-950 shadow-2xl dark:border-ivory/20 dark:bg-coal dark:text-ivory transition-colors">
            {/* Drag Handle & Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-5 pb-3 pt-3 backdrop-blur-md dark:border-ivory/10 dark:bg-coal/95">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300 dark:bg-ivory/20" />
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[20px] font-semibold text-gray-950 dark:text-ivory">
                    Trip Preferences
                  </h3>
                  <p className="text-[11.5px] text-gray-500 dark:text-ivory/50">
                    Customize your journey details
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-gray-950 dark:border-ivory/15 dark:text-ivory/70 dark:hover:text-ivory"
                  aria-label="Close filters"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Segment Tabs */}
              <div className="no-scrollbar -mx-2 mt-3 flex gap-1.5 overflow-x-auto px-2 pb-1">
                {[
                  { id: "dest", label: currentDest.shortName, icon: MapPin },
                  { id: "dates", label: getMonthDisplay(date).split(" ")[0], icon: CalendarDays },
                  { id: "duration", label: `${duration}d`, icon: Clock },
                  { id: "travelers", label: `${totalTravelers}p`, icon: Users },
                  { id: "budget", label: budget, icon: Wallet },
                ].map((t) => {
                  const active = mobileTab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMobileTab(t.id as any)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                        active
                          ? "bg-champagne text-gray-950 shadow-sm"
                          : "border border-gray-200 bg-gray-100 text-gray-700 dark:border-ivory/15 dark:bg-ivory/5 dark:text-ivory/70"
                      }`}
                    >
                      <Icon size={12} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* TAB 1: DESTINATION */}
              {mobileTab === "dest" && (
                <div className="space-y-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-champagne">
                    Choose Destination
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {DESTINATIONS.map((d) => {
                      const isSelected = d.id === dest;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDest(d.id)}
                          className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all ${
                            isSelected
                              ? "border-champagne bg-champagne/15 text-gray-950 dark:text-ivory"
                              : "border-gray-200 bg-gray-50 text-gray-800 dark:border-ivory/10 dark:bg-ink/40 dark:text-ivory/80"
                          }`}
                        >
                          <img
                            src={d.thumb}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-display text-[16px] font-bold">{d.name}</span>
                              {isSelected && <Check size={16} className="text-champagne shrink-0" />}
                            </div>
                            <span className="block text-[11px] text-gray-500 dark:text-ivory/50">
                              {d.region} · From {formatPKR(d.startingPrice)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: DATES */}
              {mobileTab === "dates" && (
                <div className="space-y-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-champagne">
                    Select Season or Month
                  </p>
                  <div className="space-y-2">
                    {SEASONS.map((s) => {
                      const isSelected = date === s.val;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setDate(s.val)}
                          className={`flex w-full items-start justify-between rounded-2xl border p-3.5 text-left transition-all ${
                            isSelected
                              ? "border-champagne bg-champagne/15 text-gray-950 dark:text-ivory"
                              : "border-gray-200 bg-gray-50 text-gray-800 dark:border-ivory/10 dark:bg-ink/40 dark:text-ivory/80"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold">{s.label}</span>
                              <span className="rounded bg-gray-200 text-champagne dark:bg-ivory/10 px-2 py-0.5 text-[10px] font-semibold">
                                {s.months}
                              </span>
                            </div>
                            <p className="mt-1 text-[11.5px] text-gray-500 dark:text-ivory/55">{s.hint}</p>
                          </div>
                          {isSelected && <Check size={16} className="text-champagne shrink-0 mt-1" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-ivory/10 dark:bg-ink/40">
                    <label className="block text-[12px] font-semibold text-gray-700 dark:text-ivory/70">
                      Or select specific calendar month:
                      <input
                        type="month"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13.5px] font-bold text-gray-900 [color-scheme:light] focus:border-champagne focus:outline-none dark:border-ivory/15 dark:bg-coal dark:text-ivory dark:[color-scheme:dark]"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: DURATION */}
              {mobileTab === "duration" && (
                <div className="space-y-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-champagne">
                    Trip Duration
                  </p>
                  <div className="space-y-2">
                    {DURATION_OPTIONS.map((opt) => {
                      const isSelected = duration === opt.days;
                      return (
                        <button
                          key={opt.days}
                          type="button"
                          onClick={() => setDuration(opt.days)}
                          className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                            isSelected
                              ? "border-champagne bg-champagne/15 text-gray-950 dark:text-ivory font-bold"
                              : "border-gray-200 bg-gray-50 text-gray-800 dark:border-ivory/10 dark:bg-ink/40 dark:text-ivory/80"
                          }`}
                        >
                          <div>
                            <span className="text-[15px]">{opt.label}</span>
                            <span className="ml-2 text-[12px] text-gray-500 dark:text-ivory/50">({opt.sub})</span>
                          </div>
                          {isSelected && <Check size={16} className="text-champagne shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: TRAVELERS */}
              {mobileTab === "travelers" && (
                <div className="space-y-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-champagne">
                    Who is traveling?
                  </p>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4 dark:border-ivory/10 dark:bg-ink/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-bold text-gray-950 dark:text-ivory">Adults</p>
                        <p className="text-[11px] text-gray-500 dark:text-ivory/50">Ages 13+</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                          disabled={adults <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-800 dark:border-ivory/20 dark:text-ivory disabled:opacity-30"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="w-6 text-center font-display text-[18px] font-bold text-gray-950 dark:text-ivory tabular">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-champagne dark:border-ivory/20 dark:text-ivory"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-ivory/10 pt-3">
                      <div>
                        <p className="text-[14px] font-bold text-gray-950 dark:text-ivory">Children</p>
                        <p className="text-[11px] text-gray-500 dark:text-ivory/50">Ages 0 — 12</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                          disabled={children <= 0}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-800 dark:border-ivory/20 dark:text-ivory disabled:opacity-30"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="w-6 text-center font-display text-[18px] font-bold text-gray-950 dark:text-ivory tabular">
                          {children}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:border-champagne dark:border-ivory/20 dark:text-ivory"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BUDGET */}
              {mobileTab === "budget" && (
                <div className="space-y-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-champagne">
                    Choose Budget Standard
                  </p>
                  <div className="space-y-2">
                    {BUDGET_TIERS.map((tier) => {
                      const isSelected = budget === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setBudget(tier.id)}
                          className={`flex w-full items-start justify-between rounded-2xl border p-3.5 text-left transition-all ${
                            isSelected
                              ? "border-champagne bg-champagne/15 text-gray-950 dark:text-ivory"
                              : "border-gray-200 bg-gray-50 text-gray-800 dark:border-ivory/10 dark:bg-ink/40 dark:text-ivory/80"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[15px] font-bold">{tier.label}</span>
                              {tier.badge && (
                                <span className="rounded bg-champagne/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-champagne">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[12px] text-gray-500 dark:text-ivory/55">{tier.desc}</p>
                            <p className="mt-1.5 text-[12px] font-semibold text-champagne">
                              From {formatPKR(tier.starting)} / person
                            </p>
                          </div>
                          {isSelected && <Check size={16} className="text-champagne shrink-0 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="border-t border-gray-200 bg-white/95 p-4 backdrop-blur-md dark:border-ivory/10 dark:bg-coal/95">
              <button
                type="button"
                onClick={handleSubmit}
                className="glow-champagne flex w-full items-center justify-center gap-2 rounded-xl bg-champagne py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-gray-950"
              >
                <span>Build Trip ({currentDest.shortName} · {duration}d)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

