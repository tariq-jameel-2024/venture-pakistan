"use client";
import { useEffect, useState } from "react";
import { Search, Heart, Briefcase, MessageCircle, Menu, X, Home, Compass, User, ArrowRight, Sun, Moon } from "lucide-react";
import { LogoLockup, LogoMark } from "./Logo";
import { useModalLifecycle } from "./ui";
import { BUSINESS_WHATSAPP } from "../data/travel";
import { WhatsAppIcon } from "./WhatsAppIcon";

const LINKS = [
  { label: "Destinations", href: "#destinations" },
  { label: "Explore", href: "#explorer" },
  { label: "How It Works", href: "#how" },
  { label: "About Us", href: "#about" },
];

/* ================= desktop + mobile header ================= */

export function Navbar({
  scrolled,
  favCount,
  tripCount,
  theme = "dark",
  onToggleTheme,
  onSearch,
  onFavorites,
  onTrips,
  onTalk,
  onPlan,
}: {
  scrolled: boolean;
  favCount: number;
  tripCount: number;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  onSearch: () => void;
  onFavorites: () => void;
  onTrips: () => void;
  onTalk: () => void;
  onPlan: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  useModalLifecycle(menuOpen, () => setMenuOpen(false));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-200/80 bg-white/95 text-gray-950 shadow-sm backdrop-blur-xl dark:border-ivory/10 dark:bg-ink/90 dark:text-ivory"
            : "border-b border-gray-200/40 bg-white/80 text-gray-900 backdrop-blur-md dark:border-transparent dark:bg-transparent dark:text-ivory"
        }`}
      >
        {/* desktop bar */}
        <div className={`mx-auto hidden max-w-7xl items-center justify-between px-8 transition-all duration-300 ${scrolled ? "py-3" : "py-5"} lg:flex`}>
          <a href="#top" className="shrink-0" aria-label="Venture Pakistan — home">
            <LogoLockup compact={scrolled} />
          </a>
          <nav className="flex items-center gap-9" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="link-underline text-[13.5px] font-bold tracking-wide text-gray-700 hover:text-gray-950 dark:text-ivory/70 dark:hover:text-ivory transition-all duration-300">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-gray-100/90 border border-gray-200/90 rounded-full px-2 py-1 backdrop-blur-md dark:bg-ivory/5 dark:border-ivory/10">
              <button
                onClick={onToggleTheme}
                aria-label={theme === "light" ? "Switch to Dark Mode (Charcoal Black Theme)" : "Switch to Light Mode (Soft White Theme)"}
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                className="btn-press group relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-200/70 hover:text-champagne dark:text-ivory/75 dark:hover:bg-ivory/10 transition-all duration-300"
              >
                {theme === "light" ? (
                  <Moon size={17} className="transition-transform duration-300 group-hover:-rotate-12 text-champagne" />
                ) : (
                  <Sun size={17} className="transition-transform duration-300 group-hover:rotate-45 text-champagne" />
                )}
              </button>
              <button onClick={onSearch} aria-label="Search"
                className="btn-press flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-200/70 hover:text-gray-950 dark:text-ivory/75 dark:hover:bg-ivory/10 dark:hover:text-ivory transition-all duration-300">
                <Search size={18} />
              </button>
              <button onClick={onFavorites} aria-label={`Favorites, ${favCount} saved`}
                className="btn-press relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-200/70 hover:text-gray-950 dark:text-ivory/75 dark:hover:bg-ivory/10 dark:hover:text-ivory transition-all duration-300">
                <Heart size={18} />
                {favCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-extrabold text-gray-950 tabular">
                    {favCount}
                  </span>
                )}
              </button>
              <button onClick={onTrips} aria-label={`My trips, ${tripCount} saved`}
                className="btn-press relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-200/70 hover:text-gray-950 dark:text-ivory/75 dark:hover:bg-ivory/10 dark:hover:text-ivory transition-all duration-300">
                <Briefcase size={18} />
                {tripCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1 text-[10px] font-extrabold text-white tabular">
                    {tripCount}
                  </span>
                )}
              </button>
            </div>
            
            <span className="mx-2 h-6 w-px bg-gray-300/80 dark:bg-ivory/15" aria-hidden="true" />
            
            <button onClick={onTalk}
              className="glow-whatsapp inline-flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-5 py-2.5 text-[12.5px] font-extrabold uppercase tracking-[0.08em] text-gray-800 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] dark:border-ivory/20 dark:text-ivory transition-all duration-300">
              <WhatsAppIcon size={15} /> WhatsApp
            </button>
            <button onClick={onPlan}
              className="glow-champagne rounded-full bg-champagne px-6 py-2.5 text-[12.5px] font-extrabold uppercase tracking-[0.08em] text-gray-950 hover:bg-champagnelight transition-all duration-300">
              Plan my journey
            </button>
          </div>
        </div>

        {/* mobile / tablet bar */}
        <div className={`flex items-center justify-between px-4 transition-all duration-300 lg:hidden ${scrolled ? "bg-white/95 text-gray-900 py-2.5 backdrop-blur-xl border-b border-gray-200/80 dark:bg-ink/90 dark:text-ivory dark:border-ivory/10" : "bg-white/80 text-gray-900 py-4 backdrop-blur-md border-b border-gray-200/40 dark:bg-transparent dark:text-ivory dark:border-transparent"}`}>
          <a href="#top" aria-label="Venture Pakistan — home">
            <span className="flex items-center gap-2.5">
              <LogoMark size={34} />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[18px] font-semibold text-gray-950 dark:text-ivory">
                  Venture <span className="italic font-medium text-champagne">Pakistan</span>
                </span>
              </span>
            </span>
          </a>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleTheme}
              aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className="btn-press flex h-11 w-11 items-center justify-center rounded-full text-champagne hover:bg-gray-100 dark:hover:bg-ivory/10 transition-colors"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <button onClick={onSearch} aria-label="Search" className="btn-press flex h-11 w-11 items-center justify-center rounded-full text-gray-800 hover:bg-gray-100 dark:text-ivory dark:hover:bg-ivory/10">
              <Search size={19} />
            </button>
            <button onClick={onFavorites} aria-label={`Favorites, ${favCount} saved`} className="btn-press relative flex h-11 w-11 items-center justify-center rounded-full text-gray-800 hover:bg-gray-100 dark:text-ivory dark:hover:bg-ivory/10">
              <Heart size={19} />
              {favCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[9px] font-extrabold text-gray-950 tabular">{favCount}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="btn-press flex h-11 w-11 items-center justify-center rounded-full text-gray-800 hover:bg-gray-100 dark:text-ivory dark:hover:bg-ivory/10">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[85] flex flex-col bg-white text-gray-950 dark:bg-ink dark:text-ivory lg:hidden transition-colors" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-ivory/10">
            <span className="flex items-center gap-2.5">
              <LogoMark size={34} />
              <span className="font-display text-[18px] font-semibold text-gray-950 dark:text-ivory">Venture <span className="italic font-medium text-champagne">Pakistan</span></span>
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-800 dark:border-ivory/15 dark:text-ivory">
              <X size={19} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 pb-6 pt-2" aria-label="Mobile">
            {/* Theme Toggle Bar in Mobile Drawer */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 dark:border-ivory/10 dark:bg-ivory/5 p-3.5 mb-3">
              <div className="flex items-center gap-2.5">
                {theme === "light" ? <Sun size={18} className="text-champagne" /> : <Moon size={18} className="text-champagne" />}
                <span className="text-[13px] font-bold tracking-wide text-gray-900 dark:text-ivory">
                  {theme === "light" ? "Light Mode Active" : "Dark Mode Active"}
                </span>
              </div>
              <button
                onClick={onToggleTheme}
                aria-label="Toggle Theme"
                className="btn-press flex items-center gap-1.5 rounded-lg border border-champagne/40 bg-champagne/15 px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-champagne hover:bg-champagne hover:text-gray-950 transition-colors"
              >
                {theme === "light" ? "Switch to Dark" : "Switch to Light"}
              </button>
            </div>
            {[...LINKS, { label: "Travel Styles", href: "#styles" }, { label: "Signature Journey", href: "#signature" }].map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="modal-panel flex items-center justify-between border-b border-gray-200 dark:border-ivory/10 py-4"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-display text-[26px] font-medium text-gray-950 dark:text-ivory">{l.label}</span>
                <ArrowRight size={17} className="text-champagne" />
              </a>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => { setMenuOpen(false); onTrips(); }}
                className="btn-press rounded-xl border border-gray-300 dark:border-ivory/15 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-gray-900 dark:text-ivory">
                My Trips {tripCount > 0 && `(${tripCount})`}
              </button>
              <button onClick={() => { setMenuOpen(false); onTalk(); }}
                className="glow-whatsapp flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white hover:brightness-105 transition-all">
                <WhatsAppIcon size={18} /> WhatsApp
              </button>
            </div>
            <button onClick={() => { setMenuOpen(false); onPlan(); }}
              className="glow-champagne mt-3 w-full rounded-xl bg-champagne py-4 text-[13px] font-extrabold uppercase tracking-[0.1em] text-gray-950">
              Plan my journey
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

/* ================= bottom nav (mobile app feel) ================= */

export function BottomNav({
  onHome, onExplore, onTrips, onFavorites, onProfile, favCount, tripCount,
}: {
  onHome: () => void;
  onExplore: () => void;
  onTrips: () => void;
  onFavorites: () => void;
  onProfile: () => void;
  favCount: number;
  tripCount: number;
}) {
  const [active, setActive] = useState("home");
  const items = [
    { id: "home", label: "Home", icon: Home, fn: onHome, badge: 0 },
    { id: "explore", label: "Explore", icon: Compass, fn: onExplore, badge: 0 },
    { id: "trips", label: "Trips", icon: Briefcase, fn: onTrips, badge: tripCount },
    { id: "favorites", label: "Saved", icon: Heart, fn: onFavorites, badge: favCount },
    { id: "profile", label: "Profile", icon: User, fn: onProfile, badge: 0 },
  ];
  return (
    <nav aria-label="Mobile navigation"
      className="pb-env fixed inset-x-0 bottom-0 z-[70] border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-ivory/10 dark:bg-ink/95 lg:hidden transition-colors">
      <div className="grid grid-cols-5">
        {items.map(({ id, label, icon: Icon, fn, badge }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => { setActive(id); fn(); }}
              aria-current={on ? "page" : undefined}
              className="btn-press relative flex flex-col items-center gap-1 py-2.5"
            >
              {on && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-champagne" aria-hidden="true" />}
              <span className="relative">
                <Icon size={21} strokeWidth={on ? 2.2 : 1.8} className={on ? "text-champagne" : "text-gray-500 dark:text-ivory/55"} />
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-0.5 text-[9px] font-extrabold text-gray-950 tabular">
                    {badge}
                  </span>
                )}
              </span>
              <span className={`text-[10.5px] font-bold ${on ? "text-champagne" : "text-gray-600 dark:text-ivory/50"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ================= floating WhatsApp ================= */

export function FloatingWhatsApp({ onClick }: { onClick: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      aria-label="Chat with Venture Pakistan on WhatsApp"
      className="glow-whatsapp group fixed bottom-[138px] right-4 z-[65] flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3.5 pr-4 text-white hover:brightness-105 active:scale-95 transition-all md:bottom-8 md:right-8 md:pr-5"
    >
      <div className="relative">
        <WhatsAppIcon size={22} className="h-5.5 w-5.5 text-white" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-200 pulse-status" />
      </div>
      <span className="hidden text-[13px] font-extrabold tracking-wide md:inline">WhatsApp</span>
    </button>
  );
}

/* ================= profile sheet ================= */

export function ProfileSheet({
  open,
  onClose,
  tripCount,
  favCount,
  theme = "dark",
  onToggleTheme,
  onTrips,
  onFavorites,
  onTalk,
}: {
  open: boolean;
  onClose: () => void;
  tripCount: number;
  favCount: number;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  onTrips: () => void;
  onFavorites: () => void;
  onTalk: () => void;
}) {
  useModalLifecycle(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[92] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Profile">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="modal-panel relative w-full max-w-sm overflow-hidden rounded-t-2xl border border-gray-200 bg-white text-gray-900 p-6 dark:border-ivory/12 dark:bg-coal dark:text-ivory sm:rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-champagne">Traveler</p>
          <button onClick={onClose} aria-label="Close profile" className="btn-press flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 dark:border-ivory/15 dark:text-ivory/70">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/15 font-display text-[22px] font-semibold text-champagne">T</span>
          <div>
            <p className="font-display text-[22px] font-semibold text-gray-950 dark:text-ivory">Guest Traveler</p>
            <p className="text-[12.5px] text-gray-600 dark:text-ivory/50">No account needed — everything saves on this device.</p>
          </div>
        </div>
        
        {/* Theme preference row */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-ivory/10 dark:bg-ivory/5">
          <div className="flex items-center gap-2.5">
            {theme === "light" ? <Sun size={17} className="text-champagne" /> : <Moon size={17} className="text-champagne" />}
            <div>
              <p className="text-[12.5px] font-bold text-gray-950 dark:text-ivory">
                {theme === "light" ? "Light Mode (White)" : "Dark Mode (Black)"}
              </p>
              <p className="text-[10.5px] text-gray-500 dark:text-ivory/50">Seamless luxury theme</p>
            </div>
          </div>
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="btn-press rounded-full border border-champagne/40 bg-champagne/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-champagne hover:bg-champagne hover:text-gray-950 transition-colors"
            >
              Switch
            </button>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => { onClose(); onTrips(); }} className="btn-press rounded-lg border border-gray-200 bg-gray-50 p-4 text-left hover:border-champagne/50 dark:border-ivory/12 dark:bg-ink">
            <p className="font-display text-[28px] font-semibold text-champagne tabular">{tripCount}</p>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gray-600 dark:text-ivory/55">Saved trips</p>
          </button>
          <button onClick={() => { onClose(); onFavorites(); }} className="btn-press rounded-lg border border-gray-200 bg-gray-50 p-4 text-left hover:border-champagne/50 dark:border-ivory/12 dark:bg-ink">
            <p className="font-display text-[28px] font-semibold text-champagne tabular">{favCount}</p>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gray-600 dark:text-ivory/55">Favorites</p>
          </button>
        </div>
        <button onClick={() => { onClose(); onTalk(); }} className="btn-press mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-white hover:brightness-105 transition-all">
          <WhatsAppIcon size={17} /> Chat on WhatsApp
        </button>
        <p className="mt-3 text-center text-[11.5px] text-gray-500 dark:text-ivory/35">WhatsApp: +{BUSINESS_WHATSAPP.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4")}</p>
      </div>
    </div>
  );
}

