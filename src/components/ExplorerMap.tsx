"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Heart,
  MapPin,
  Mountain,
  CalendarDays,
  Star,
  ArrowRight,
  Plane,
  Eye,
  Compass,
  Layers,
  Sparkles,
  Navigation,
  Clock,
  Check,
} from "lucide-react";
import { DESTINATIONS, formatPKR, type Destination } from "../data/travel";
import { SectionHeading, Reveal } from "./ui";

/* Stylised Pakistan silhouette — decorative, not to scale.
   Markers positioned via destination mapX/mapY percentages. */
function PakistanOutline() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="mapGlow" cx="55%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#5F8E8C" stopOpacity="0.18" />
          <stop offset="55%" stopColor="#5F8E8C" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#5F8E8C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#mapGlow)" rx="2" />
      
      {/* faint coordinate grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={(i + 1) * 10}
          y1="0"
          x2={(i + 1) * 10}
          y2="100"
          stroke="var(--ivory, #F5F1E8)"
          strokeOpacity="0.04"
          strokeWidth="0.25"
        />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={(i + 1) * 10}
          x2="100"
          y2={(i + 1) * 10}
          stroke="var(--ivory, #F5F1E8)"
          strokeOpacity="0.04"
          strokeWidth="0.25"
        />
      ))}

      {/* stylised country silhouette */}
      <path
        d="M63 4 L72 6 L76 12 L74 18 L78 24 L74 30 L70 34 L66 40 L64 48 L60 56 L56 64 L50 72 L44 78 L38 84 L32 88 L26 86 L20 80 L22 72 L28 66 L36 60 L40 52 L38 44 L42 38 L40 30 L44 24 L50 20 L56 14 Z"
        fill="var(--ember, #151B26)"
        stroke="var(--champagne, #C9A86A)"
        strokeOpacity="0.32"
        strokeWidth="0.6"
      />

      {/* mountain hatching — north */}
      {[
        "M58 8l3 2M63 10l3 2M68 12l3 2M60 14l3 2M66 16l3 2",
        "M56 20l3 2M62 22l3 2M68 24l3 2",
        "M52 26l3 2M58 28l3 2M64 30l3 2",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="var(--ivory, #F5F1E8)"
          strokeOpacity="0.16"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      ))}

      {/* sea hint — south */}
      <path
        d="M8 88 Q30 84 52 90 T96 88"
        stroke="var(--teal, #5F8E8C)"
        strokeOpacity="0.35"
        strokeWidth="0.7"
        fill="none"
      />
      <text
        x="10"
        y="95"
        fill="var(--teal, #5F8E8C)"
        fillOpacity="0.6"
        fontSize="3.4"
        letterSpacing="1.5"
        fontFamily="Manrope,sans-serif"
      >
        ARABIAN SEA
      </text>
      <text
        x="66"
        y="8"
        fill="var(--ivory, #F5F1E8)"
        fillOpacity="0.35"
        fontSize="2.8"
        letterSpacing="1.2"
        fontFamily="Manrope,sans-serif"
      >
        KARAKORAM RANGE
      </text>

      {/* Cartographic compass rose in northwest corner */}
      <g transform="translate(14, 14)">
        <circle cx="0" cy="0" r="7" stroke="var(--champagne, #C9A86A)" strokeOpacity="0.22" strokeWidth="0.4" fill="none" />
        <circle cx="0" cy="0" r="4.5" stroke="var(--champagne, #C9A86A)" strokeOpacity="0.15" strokeWidth="0.3" fill="none" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="var(--champagne, #C9A86A)" strokeOpacity="0.4" strokeWidth="0.35" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="var(--champagne, #C9A86A)" strokeOpacity="0.4" strokeWidth="0.35" />
        {/* north needle */}
        <path d="M0 -7 L1.2 -1.5 L0 0 L-1.2 -1.5 Z" fill="var(--champagne, #C9A86A)" />
        <text x="0" y="-8.8" textAnchor="middle" fill="var(--champagne, #C9A86A)" fontSize="2.2" fontWeight="bold">N</text>
      </g>
    </svg>
  );
}

const ROUTES = [
  { from: { x: 58, y: 46 }, to: { x: 68, y: 16 }, label: "Islamabad → Gilgit", time: "45m Scenic Flight", desc: "Past Nanga Parbat" },
  { from: { x: 58, y: 46 }, to: { x: 74, y: 24 }, label: "Islamabad → Skardu", time: "55m Mountain Flight", desc: "K2 & Karakoram view" },
  { from: { x: 58, y: 46 }, to: { x: 46, y: 24 }, label: "Islamabad → Chitral", time: "40m Lowari Flight", desc: "Hindu Kush corridor" },
  { from: { x: 58, y: 46 }, to: { x: 70, y: 64 }, label: "Islamabad → Lahore", time: "4.5h Express Route", desc: "M2 Motorway" },
];

const REGIONS = [
  { id: "all", label: "All Regions" },
  { id: "Gilgit-Baltistan", label: "Gilgit-Baltistan" },
  { id: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
  { id: "Azad Kashmir", label: "Azad Kashmir" },
  { id: "South & Heritage", label: "Punjab & Coast" },
];

export interface ExplorerMapProps {
  activeId: string;
  onSelect: (id: string) => void;
  favorites: Set<string>;
  onToggleFav: (id: string) => void;
  onPlan: (id: string) => void;
  onOpenDetail?: (id: string) => void;
}

export default function ExplorerMap({
  activeId,
  onSelect,
  favorites,
  onToggleFav,
  onPlan,
  onOpenDetail,
}: ExplorerMapProps) {
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [hoveredDestId, setHoveredDestId] = useState<string | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const active: Destination = DESTINATIONS.find((d) => d.id === activeId) ?? DESTINATIONS[0];

  // Filter destinations based on selected region
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      if (d.id === "deosai" || d.id === "passu") return false;
      if (selectedRegion === "all") return true;
      if (selectedRegion === "South & Heritage") {
        return d.region === "Punjab" || d.region === "Balochistan";
      }
      return d.region === selectedRegion;
    });
  }, [selectedRegion]);

  // When active changes, auto-scroll the active chip in the mobile scroller
  useEffect(() => {
    if (!mobileScrollRef.current) return;
    const activeChip = mobileScrollRef.current.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId]);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    // If the currently active destination is not in this region, switch to the first destination in this region
    if (regionId !== "all") {
      const match = DESTINATIONS.find((d) => {
        if (d.id === "deosai" || d.id === "passu") return false;
        if (regionId === "South & Heritage") return d.region === "Punjab" || d.region === "Balochistan";
        return d.region === regionId;
      });
      if (match) onSelect(match.id);
    }
  };

  return (
    <section id="explorer" className="relative scroll-mt-20 bg-[#faf8f5] dark:bg-ink py-20 md:py-28 transition-colors">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Interactive Explorer"
            title={
              <>
                Choose Your <span className="italic text-amber-600 dark:text-champagne">Direction.</span>
              </>
            }
            copy="Eight regions, one country that refuses to be ordinary. Tap a marker to preview the journey — then let Venture Pakistan shape it around you."
          />
          <Reveal delay={120} className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowRoutes((s) => !s)}
              className="btn-press inline-flex items-center gap-2.5 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-gray-800 shadow-sm backdrop-blur-md hover:border-amber-600 hover:text-gray-950 dark:border-ivory/15 dark:bg-coal/60 dark:text-ivory/80 dark:shadow-none dark:hover:border-champagne/60 dark:hover:text-ivory transition-colors"
              aria-pressed={showRoutes}
            >
              <Plane size={15} className={showRoutes ? "text-amber-700 dark:text-champagne" : "text-gray-400 dark:text-ivory/40"} />
              <span>Flight & Road Corridors</span>
              <span className={`relative h-4 w-8 rounded-full transition-colors ${showRoutes ? "bg-amber-600 dark:bg-champagne/90" : "bg-gray-300 dark:bg-ivory/15"}`}>
                <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white dark:bg-ink transition-all ${showRoutes ? "left-4" : "left-0.5"}`} />
              </span>
            </button>
          </Reveal>
        </div>

        {/* Region Filter Bar */}
        <div className="no-scrollbar mt-8 flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by region">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-700 dark:text-champagne/80 mr-1 shrink-0">
            <Layers size={13} /> Region:
          </span>
          {REGIONS.map((r) => {
            const isSelected = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleRegionSelect(r.id)}
                className={`btn-press shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-all duration-300 ${
                  isSelected
                    ? "border-champagne bg-champagne text-gray-950 shadow-md"
                    : "border-gray-300 bg-white text-gray-700 shadow-sm hover:border-amber-600 hover:text-gray-950 dark:border-ivory/15 dark:bg-coal/40 dark:text-ivory/70 dark:shadow-none dark:hover:border-champagne/40 dark:hover:text-ivory"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_390px]">
          {/* ---- Map Canvas ---- */}
          <Reveal className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-ivory/10 dark:bg-coal">
            <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-auto lg:h-[580px]">
              <div className="absolute inset-0">
                <PakistanOutline />
              </div>

              {/* Connecting routes */}
              {showRoutes && (
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" preserveAspectRatio="none">
                  {ROUTES.map((r, i) => {
                    const mx = (r.from.x + r.to.x) / 2 + (i === 2 ? -6 : i === 3 ? 5 : 5);
                    const my = (r.from.y + r.to.y) / 2 - 2;
                    return (
                      <g key={r.label}>
                        <path
                          d={`M${r.from.x} ${r.from.y} Q${mx} ${my} ${r.to.x} ${r.to.y}`}
                          fill="none"
                          stroke="var(--champagne, #C9A86A)"
                          strokeOpacity="0.55"
                          strokeWidth="0.5"
                          className="route-flow"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    );
                  })}
                  {/* Islamabad Central Aviation Hub */}
                  <g>
                    <circle cx="58" cy="46" r="1.4" fill="var(--champagne, #C9A86A)" />
                    <circle cx="58" cy="46" r="2.8" stroke="var(--champagne, #C9A86A)" strokeOpacity="0.4" strokeWidth="0.4" fill="none" />
                    <text x="60.5" y="47.5" fill="var(--ivory, #F5F1E8)" fillOpacity="0.8" fontSize="2.8" fontFamily="Manrope,sans-serif" fontWeight="800">
                      ISB HUB
                    </text>
                  </g>
                </svg>
              )}

              {/* Map Markers */}
              {DESTINATIONS.filter((d) => d.id !== "deosai" && d.id !== "passu").map((d) => {
                const isActive = d.id === active.id;
                const isHovered = hoveredDestId === d.id;
                const isInSelectedRegion =
                  selectedRegion === "all" ||
                  (selectedRegion === "South & Heritage"
                    ? d.region === "Punjab" || d.region === "Balochistan"
                    : d.region === selectedRegion);

                return (
                  <div
                    key={d.id}
                    style={{ left: `${d.mapX}%`, top: `${d.mapY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                      isInSelectedRegion ? "opacity-100 z-20" : "opacity-35 z-10"
                    }`}
                  >
                    <button
                      onClick={() => onSelect(d.id)}
                      onMouseEnter={() => setHoveredDestId(d.id)}
                      onMouseLeave={() => setHoveredDestId(null)}
                      onFocus={() => setHoveredDestId(d.id)}
                      onBlur={() => setHoveredDestId(null)}
                      className="group relative flex items-center justify-center p-2 focus:outline-none"
                      aria-label={`Select ${d.name}, ${d.region}`}
                      aria-pressed={isActive}
                    >
                      <span className="relative flex h-10 w-10 items-center justify-center">
                        {isActive && (
                          <span
                            className="marker-ping absolute inset-0 rounded-full border-2 border-champagne"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                            isActive
                              ? "scale-110 border-champagne bg-champagne text-gray-950 shadow-[0_0_24px_rgba(201,168,106,0.6)]"
                              : "border-gray-300 bg-white/95 text-gray-900 shadow backdrop-blur-sm group-hover:scale-110 group-hover:border-amber-600 group-hover:text-amber-700 dark:border-ivory/30 dark:bg-ink/85 dark:text-ivory dark:shadow-none dark:group-hover:border-champagne dark:group-hover:text-champagne dark:group-hover:shadow-[0_0_16px_rgba(201,168,106,0.4)]"
                          }`}
                        >
                          <MapPin size={15} strokeWidth={isActive ? 2.4 : 2} />
                        </span>
                      </span>

                      {/* Tooltip on marker */}
                      <div
                        className={`pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1 transition-all duration-200 ${
                          isActive
                            ? "border-champagne bg-champagne text-gray-950 shadow-md opacity-100 scale-100"
                            : isHovered
                            ? "border-gray-300 bg-white/95 text-gray-950 shadow-lg opacity-100 scale-100 -translate-y-0.5 dark:border-ivory/20 dark:bg-ink/95 dark:text-ivory"
                            : "border-transparent bg-white/80 text-gray-800 opacity-0 scale-95 dark:bg-ink/80 dark:text-ivory/80"
                        }`}
                      >
                        <p className="text-[11px] font-extrabold leading-tight">{d.shortName}</p>
                        <p className={`text-[9.5px] font-semibold ${isActive ? "text-gray-800" : "text-amber-700 dark:text-champagne"}`}>
                          {d.altitude} · {formatPKR(d.startingPrice)}
                        </p>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Bottom Map Info Footer */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-semibold text-gray-500 dark:text-ivory/45">
                <span className="flex items-center gap-1.5">
                  <Navigation size={12} className="text-amber-700 dark:text-champagne" />
                  Interactive Venture Explorer · Tap any pin
                </span>
                <span className="hidden sm:inline">
                  {filteredDestinations.length} Destinations Available
                </span>
              </div>
            </div>
          </Reveal>

          {/* ---- Destination Preview Panel ---- */}
          <Reveal delay={140} className="flex">
            <article
              key={active.id}
              className="modal-panel flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-950 shadow-xl dark:border-ivory/12 dark:bg-coal dark:text-ivory"
              aria-live="polite"
            >
              <div className="img-frame img-duotone relative h-48 shrink-0">
                <img
                  src={active.image}
                  alt={active.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4 bg-gradient-to-t from-gray-950/85 via-gray-950/40 to-transparent">
                  <div>
                    <span className="rounded-full bg-white/85 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.24em] text-amber-800 shadow-sm backdrop-blur-md dark:bg-ink/75 dark:text-champagne">
                      {active.region}
                    </span>
                    <h3 className="mt-1 font-display text-[26px] font-semibold leading-tight text-white">
                      {active.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => onToggleFav(active.id)}
                    aria-label={favorites.has(active.id) ? `Remove ${active.name} from favorites` : `Save ${active.name} to favorites`}
                    className={`btn-press flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                      favorites.has(active.id)
                        ? "border-champagne bg-champagne text-gray-950 shadow-[0_0_15px_rgba(201,168,106,0.4)]"
                        : "border-white/40 bg-black/50 text-white hover:border-champagne hover:text-champagne"
                    }`}
                  >
                    <Heart size={17} className={favorites.has(active.id) ? "fill-gray-950" : ""} />
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-px bg-gray-200 text-center dark:bg-ivory/10">
                {[
                  { icon: <Mountain size={14} />, label: "Altitude", value: active.altitude },
                  { icon: <CalendarDays size={14} />, label: "Suggested Stay", value: active.recommendedStay.split(" ")[0] + " nights" },
                  { icon: <Star size={14} />, label: "Traveler Rating", value: `${active.rating.toFixed(1)} ★` },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 px-2 py-3 dark:bg-coal">
                    <span className="mx-auto flex items-center justify-center gap-1 text-amber-700 dark:text-champagne">{s.icon}</span>
                    <p className="mt-1 text-[13px] font-bold text-gray-950 tabular dark:text-ivory">{s.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-ivory/45">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Description & Seasonal Info */}
              <div className="flex flex-1 flex-col gap-3.5 p-5">
                <p className="text-[13.5px] leading-relaxed text-gray-700 line-clamp-3 dark:text-ivory/70">
                  {active.description}
                </p>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[12.5px] dark:border-ivory/10 dark:bg-ivory/5">
                  <span className="text-gray-500 flex items-center gap-1.5 dark:text-ivory/50">
                    <Clock size={13} className="text-amber-700 dark:text-champagne" /> Best Season
                  </span>
                  <span className="font-bold text-gray-950 dark:text-ivory">{active.bestSeason}</span>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5">
                  {active.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="rounded-full border border-gray-300 bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700 dark:border-ivory/10 dark:bg-ink/40 dark:text-ivory/65">
                      ✓ {h}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-3 border-t border-gray-200 dark:border-ivory/10">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 dark:text-ivory/40">From</p>
                      <p className="font-display text-[24px] font-semibold text-amber-700 dark:text-champagne tabular leading-none">
                        {formatPKR(active.startingPrice)}
                      </p>
                    </div>
                    <span className="text-[11.5px] font-semibold text-gray-500 dark:text-ivory/50">
                      Standard {active.duration}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {onOpenDetail && (
                      <button
                        onClick={() => onOpenDetail(active.id)}
                        className="btn-press flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white py-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-gray-800 shadow-sm hover:border-amber-600 hover:text-gray-950 transition-colors dark:border-ivory/20 dark:bg-transparent dark:text-ivory dark:shadow-none dark:hover:border-champagne"
                      >
                        <Eye size={14} /> Guide
                      </button>
                    )}
                    <button
                      onClick={() => onPlan(active.id)}
                      className={`btn-press flex items-center justify-center gap-1.5 rounded-full bg-champagne py-2.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-gray-950 hover:bg-champagnelight transition-colors ${
                        onOpenDetail ? "" : "col-span-2 py-3 text-[13px]"
                      }`}
                    >
                      Plan Trip <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Mobile Destination Horizontal Carousel Chips */}
        <div
          ref={mobileScrollRef}
          className="no-scrollbar mt-6 flex gap-2.5 overflow-x-auto pb-2 lg:hidden"
          role="tablist"
          aria-label="Destinations List"
        >
          {filteredDestinations.map((d) => {
            const isSelected = d.id === active.id;
            return (
              <button
                key={d.id}
                data-chip={d.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelect(d.id)}
                className={`btn-press flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[12.5px] font-bold transition-all ${
                  isSelected
                    ? "border-champagne bg-champagne text-gray-950 shadow-md"
                    : "border-gray-300 bg-white text-gray-700 shadow-sm hover:border-amber-600 hover:text-gray-950 dark:border-ivory/15 dark:bg-coal/70 dark:text-ivory/70 dark:shadow-none dark:hover:border-ivory/30"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-gray-950" : "bg-amber-600 dark:bg-champagne"}`} />
                <span>{d.shortName}</span>
                <span className={`text-[11px] tabular ${isSelected ? "text-gray-700" : "text-gray-500 dark:text-ivory/40"}`}>
                  {d.altitude}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MapLegend() {
  return null;
}
