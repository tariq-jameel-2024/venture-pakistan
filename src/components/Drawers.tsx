"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  X, Search, Heart, Trash2, MapPin, CalendarDays, Users, Wallet, ArrowRight,
  MessageCircle, Eye, Compass, Mountain, Waves, Landmark, Gem, UsersRound, ChevronRight,
} from "lucide-react";
import { DESTINATIONS, TRAVEL_STYLES, formatPKR, getDestination, type GeneratedTrip } from "../data/travel";
import { useModalLifecycle, Stars } from "./ui";
import { WhatsAppIcon } from "./WhatsAppIcon";

/* ================= global search ================= */

export function SearchPalette({
  open, onClose, onSelectDestination, onSelectStyle,
}: {
  open: boolean;
  onClose: () => void;
  onSelectDestination: (id: string) => void;
  onSelectStyle: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useModalLifecycle(open, onClose);

  useEffect(() => {
    if (open) { setQ(""); setCursor(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open ]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const dests = DESTINATIONS.filter((d) => {
      if (!needle) return true;
      return [d.name, d.shortName, d.region, d.description, ...d.tags, ...d.category]
        .join(" ").toLowerCase().includes(needle);
    }).map((d) => ({ type: "destination" as const, id: d.id, title: d.name, sub: d.region, img: d.thumb, rating: d.rating }));
    const styles = TRAVEL_STYLES.filter((s) => {
      if (!needle) return false;
      return [s.title, s.description].join(" ").toLowerCase().includes(needle);
    }).map((s) => ({ type: "style" as const, id: s.id, title: s.title, sub: s.duration, img: s.image, rating: 0 }));
    return [...dests, ...styles].slice(0, 9);
  }, [q]);

  useEffect(() => setCursor(0), [q]);

  if (!open) return null;

  const pick = (r: (typeof results)[number]) => {
    if (r.type === "destination") onSelectDestination(r.id);
    else onSelectStyle(r.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10dvh] md:pt-[14dvh]" role="dialog" aria-modal="true" aria-label="Search destinations">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="modal-panel-center relative w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950 shadow-2xl dark:border-ivory/15 dark:bg-coal dark:text-ivory">
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-ivory/10">
          <Search size={18} className="shrink-0 text-amber-700 dark:text-champagne" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(results.length - 1, c + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
              if (e.key === "Enter" && results[cursor]) pick(results[cursor]);
            }}
            placeholder="Search mountains, valleys, heritage, coast…"
            className="w-full bg-transparent text-[15px] font-semibold text-gray-950 placeholder:text-gray-400 focus:outline-none dark:text-ivory dark:placeholder:text-ivory/35"
            aria-label="Search destinations and travel styles"
          />
          <kbd className="hidden rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 md:block dark:border-ivory/15 dark:text-ivory/40">ESC</kbd>
        </div>
        <div className="max-h-[52dvh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-4 py-8 text-center text-[14px] text-gray-500 dark:text-ivory/50">
              No matches for “{q}”. Try “mountains”, “fort”, “beach” or “Kalash”.
            </p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => pick(r)}
              onMouseEnter={() => setCursor(i)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${i === cursor ? "bg-gray-100 dark:bg-ivory/10" : "hover:bg-gray-50 dark:hover:bg-ivory/5"}`}
            >
              <img src={r.img} alt="" className="h-11 w-14 shrink-0 rounded object-cover" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold text-gray-950 dark:text-ivory">{r.title}</span>
                <span className="block text-[12px] text-gray-500 dark:text-ivory/50">{r.type === "style" ? `Travel style · ${r.sub}` : r.sub}</span>
              </span>
              {r.rating > 0 ? <Stars rating={r.rating} /> : <ChevronRight size={16} className="text-gray-400 dark:text-ivory/40" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-gray-200 px-5 py-3 text-[11.5px] font-semibold text-gray-500 dark:border-ivory/10 dark:text-ivory/40">
          <Compass size={13} /> Try “lakes”, “desert”, “food”, “trekking” — ↑↓ to navigate, ↵ to open
        </div>
      </div>
    </div>
  );
}

/* ================= favorites drawer ================= */

export function FavoritesDrawer({
  open, onClose, favorites, onRemove, onPlan, onBrowse,
}: {
  open: boolean;
  onClose: () => void;
  favorites: Set<string>;
  onRemove: (id: string) => void;
  onPlan: (id: string) => void;
  onBrowse: () => void;
}) {
  useModalLifecycle(open, onClose);
  if (!open) return null;
  const list = [...favorites].map(getDestination);

  return (
    <div className="fixed inset-0 z-[92] flex justify-end" role="dialog" aria-modal="true" aria-label="Favorite destinations">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <aside className="drawer-right relative flex h-full w-full max-w-md flex-col bg-white text-gray-950 sm:border-l sm:border-gray-200 dark:bg-coal dark:text-ivory dark:sm:border-ivory/12">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-ivory/10">
          <div>
            <p className="eyebrow text-amber-700 dark:text-champagne">Saved for later</p>
            <h3 className="mt-1 font-display text-[26px] font-semibold text-gray-950 dark:text-ivory">Favorites {list.length > 0 && <span className="text-amber-700 dark:text-champagne tabular">({list.length})</span>}</h3>
          </div>
          <button onClick={onClose} aria-label="Close favorites" className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-gray-900 dark:border-ivory/15 dark:text-ivory/70 dark:hover:border-champagne">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {list.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 text-gray-400 dark:border-ivory/12 dark:text-ivory/30">
                <Heart size={24} />
              </span>
              <h4 className="mt-5 font-display text-[24px] font-medium text-gray-950 dark:text-ivory">Nothing saved yet</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600 dark:text-ivory/55">Tap the heart on any destination and it will wait for you here.</p>
              <button onClick={onBrowse} className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-champagne hover:text-gray-950 dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
                Browse destinations <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((d) => (
                <li key={d.id} className="overflow-hidden rounded-lg border border-gray-200 bg-[#faf8f5] dark:border-ivory/12 dark:bg-ink">
                  <div className="flex gap-3 p-3">
                    <img src={d.thumb} alt={d.name} className="h-20 w-24 shrink-0 rounded object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-champagne">{d.region}</p>
                      <p className="truncate font-display text-[19px] font-semibold text-gray-950 dark:text-ivory">{d.name}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <Stars rating={d.rating} />
                        <span className="text-[12.5px] font-bold text-gray-600 dark:text-ivory/60 tabular">from {formatPKR(d.startingPrice)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-gray-200 p-3 dark:border-ivory/10">
                    <button onClick={() => onPlan(d.id)} className="btn-press flex-1 rounded-full bg-champagne py-2.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-gray-950 hover:bg-champagnelight">
                      Plan trip
                    </button>
                    <button onClick={() => onRemove(d.id)} aria-label={`Remove ${d.name}`}
                      className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-rose-600 hover:text-rose-600 dark:border-ivory/15 dark:text-ivory/60 dark:hover:border-copper dark:hover:text-copper">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ================= saved trips drawer ================= */

const STATUS_STYLES: Record<GeneratedTrip["status"], string> = {
  Planning: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-ivory/10 dark:text-ivory/70 dark:border-ivory/15",
  "Ready to Book": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-champagne/15 dark:text-champagne dark:border-champagne/40",
  Confirmed: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal/15 dark:text-teal dark:border-teal/40",
};

export function TripsDrawer({
  open, onClose, trips, onView, onDelete, onBook, onStatus, onPlan,
}: {
  open: boolean;
  onClose: () => void;
  trips: GeneratedTrip[];
  onView: (t: GeneratedTrip) => void;
  onDelete: (id: string) => void;
  onBook: (t: GeneratedTrip) => void;
  onStatus: (id: string, s: GeneratedTrip["status"]) => void;
  onPlan: () => void;
}) {
  useModalLifecycle(open, onClose);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[92] flex justify-end" role="dialog" aria-modal="true" aria-label="My saved trips">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <aside className="drawer-right relative flex h-full w-full max-w-md flex-col bg-white text-gray-950 sm:border-l sm:border-gray-200 dark:bg-coal dark:text-ivory dark:sm:border-ivory/12">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-ivory/10">
          <div>
            <p className="eyebrow text-amber-700 dark:text-champagne">Your travel file</p>
            <h3 className="mt-1 font-display text-[26px] font-semibold text-gray-950 dark:text-ivory">My Trips {trips.length > 0 && <span className="text-amber-700 dark:text-champagne tabular">({trips.length})</span>}</h3>
          </div>
          <button onClick={onClose} aria-label="Close my trips" className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-gray-900 dark:border-ivory/15 dark:text-ivory/70 dark:hover:border-champagne">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {trips.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 text-gray-400 dark:border-ivory/12 dark:text-ivory/30">
                <MapPin size={24} />
              </span>
              <h4 className="mt-5 font-display text-[24px] font-medium text-gray-950 dark:text-ivory">No journeys saved yet.</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600 dark:text-ivory/55">Generate an itinerary and it will be kept here — ready to view, edit or book.</p>
              <button onClick={onPlan} className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gray-950 hover:bg-champagnelight">
                Plan your first journey <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {trips.map((t) => {
                const d = getDestination(t.destinationId);
                return (
                  <li key={t.id} className="overflow-hidden rounded-lg border border-gray-200 bg-[#faf8f5] dark:border-ivory/12 dark:bg-ink">
                    <div className="relative h-28">
                      <img src={d.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />
                      <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-md ${STATUS_STYLES[t.status]}`}>
                        {t.status}
                      </span>
                      <div className="absolute inset-x-3 bottom-2 flex items-end justify-between">
                        <div>
                          <p className="font-display text-[20px] font-semibold leading-none text-white">{t.destination}</p>
                          <p className="mt-1 text-[11.5px] font-semibold text-white/80">
                            {new Date(t.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <p className="font-display text-[18px] font-semibold text-champagne tabular">{formatPKR(t.costing.total)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-2.5 text-[12px] font-bold text-gray-700 dark:text-ivory/60">
                      <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {t.duration}d</span>
                      <span className="inline-flex items-center gap-1"><Users size={12} /> {t.travelers}</span>
                      <span className="inline-flex items-center gap-1"><Wallet size={12} /> {t.budget}</span>
                      <select
                        value={t.status}
                        onChange={(e) => onStatus(t.id, e.target.value as GeneratedTrip["status"])}
                        aria-label="Trip status"
                        className="ml-auto rounded-full border border-gray-300 bg-white px-2 py-1 text-[11.5px] font-bold text-gray-800 dark:border-ivory/15 dark:bg-coal dark:text-ivory/70"
                      >
                        <option>Planning</option>
                        <option>Ready to Book</option>
                        <option>Confirmed</option>
                      </select>
                    </div>
                    <div className="flex gap-2 border-t border-gray-200 p-3 dark:border-ivory/10">
                      <button onClick={() => onView(t)} className="btn-press inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-300 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-gray-900 hover:border-amber-600 hover:text-amber-700 dark:border-ivory/20 dark:text-ivory dark:hover:border-champagne">
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => onBook(t)} className="btn-press inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white hover:brightness-105 transition-all">
                        <WhatsAppIcon size={14} /> Book
                      </button>
                      <button onClick={() => onDelete(t.id)} aria-label={`Delete trip to ${t.destination}`}
                        className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-rose-600 hover:text-rose-600 dark:border-ivory/15 dark:text-ivory/60 dark:hover:border-copper dark:hover:text-copper">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ================= destination detail ================= */

export function DestinationModal({
  open, onClose, destinationId, isFav, onToggleFav, onPlan,
}: {
  open: boolean;
  onClose: () => void;
  destinationId: string;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onPlan: (id: string) => void;
}) {
  useModalLifecycle(open, onClose);
  if (!open) return null;
  const d = getDestination(destinationId);

  return (
    <div className="fixed inset-0 z-[93] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={d.name}>
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <article className="modal-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white text-gray-950 dark:border-ivory/12 dark:bg-coal dark:text-ivory md:max-w-2xl md:rounded-xl">
        <div className="img-frame img-duotone relative h-60 shrink-0 md:h-72">
          <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
          <button onClick={onClose} aria-label="Close details"
            className="btn-press absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-md hover:border-white">
            <X size={18} />
          </button>
          <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">{d.region} · {d.altitude}</p>
            <h3 className="mt-1 font-display text-[34px] font-medium leading-none text-white md:text-[42px]">{d.name}</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-gray-600 dark:text-ivory/65">
            <Stars rating={d.rating} />
            <span>{d.reviews} traveler reviews</span>
            <span>Best: <b className="text-gray-950 dark:text-ivory">{d.bestSeason}</b></span>
          </div>
          <p className="mt-4 text-[14.5px] leading-relaxed text-gray-700 dark:text-ivory/75">{d.longDescription}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {d.tags.map((t) => (
              <span key={t} className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-[12px] font-bold text-gray-700 dark:border-ivory/15 dark:bg-transparent dark:text-ivory/65">{t}</span>
            ))}
          </div>
          <h4 className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gray-500 dark:text-ivory/50">Highlights</h4>
          <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {d.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#faf8f5] px-3 py-2.5 text-[13px] font-semibold text-gray-800 dark:border-ivory/10 dark:bg-ink dark:text-ivory/80">
                <Mountain size={13} className="shrink-0 text-amber-700 dark:text-champagne" /> {h}
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-[#faf8f5] p-4 dark:border-ivory/10 dark:bg-ink">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal">Stay</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-700 dark:text-ivory/70">{d.stay}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-[#faf8f5] p-4 dark:border-ivory/10 dark:bg-ink">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal">Transport</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-700 dark:text-ivory/70">{d.transport}</p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 border-t border-gray-200 bg-white/95 px-5 py-4 backdrop-blur-md md:px-6 dark:border-ivory/10 dark:bg-ink/70">
          <div className="mr-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-ivory/40">Starting from</p>
            <p className="font-display text-[24px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(d.startingPrice)}</p>
          </div>
          <button onClick={() => onToggleFav(d.id)} aria-label="Toggle favorite"
            className={`btn-press flex h-12 w-12 items-center justify-center rounded-full border ${isFav ? "border-champagne bg-champagne text-gray-950" : "border-gray-300 text-gray-700 hover:border-amber-600 dark:border-ivory/20 dark:text-ivory dark:hover:border-champagne"}`}>
            <Heart size={18} className={isFav ? "fill-gray-950" : ""} />
          </button>
          <button onClick={() => onPlan(d.id)}
            className="btn-press inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-champagne hover:text-gray-950 dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
            Plan this trip <ArrowRight size={15} />
          </button>
        </div>
      </article>
    </div>
  );
}

/* ================= style icons ================= */

export function StyleIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  switch (icon) {
    case "mountain": return <Mountain size={size} />;
    case "landmark": return <Landmark size={size} />;
    case "waves": return <Waves size={size} />;
    case "gem": return <Gem size={size} />;
    case "compass": return <Compass size={size} />;
    default: return <UsersRound size={size} />;
  }
}

