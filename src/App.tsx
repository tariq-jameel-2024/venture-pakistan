"use client";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Navbar, BottomNav, FloatingWhatsApp, ProfileSheet } from "./components/Navbar";
import { PlannerModal, ItineraryView } from "./components/Planner";
import { SearchPalette, FavoritesDrawer } from "./components/Drawers";
import { ToastStack } from "./components/ui";
import { useTravelStore } from "./store/useTravelStore";
import Home from "./views/Home";
import MyTrips from "./views/MyTrips";
import DestinationDetail from "./views/DestinationDetail";
import { whatsappLink, BUSINESS_WHATSAPP } from "./data/travel";
import { ChatBot } from "./components/ChatBot";

function AppContent() {
  const store = useTravelStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    init,
    theme,
    toggleTheme,
    toasts,
    favorites,
    trips,
    searchOpen,
    setSearchOpen,
    favOpen,
    setFavOpen,
    profileOpen,
    setProfileOpen,
    toggleFav,
    openPlanner,
    setDetailId,
  } = store;

  useEffect(() => {
    init();
  }, [init]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const talkToVenture = (destination?: string) => {
    const msg = destination
      ? `Hello Venture Pakistan,\nI would like to plan a trip to ${destination}.\nPlease share options and availability.`
      : `Hello Venture Pakistan,\nI found Venture Pakistan and would like help planning a journey across Pakistan.`;
    window.open(whatsappLink(msg), "_blank", "noopener");
  };

  return (
    <div id="top" className="min-h-[100svh] bg-[#faf8f5] text-gray-950 dark:bg-ink dark:text-ivory transition-colors duration-300">
      {/* ---------- HEADER ---------- */}
      <Navbar
        scrolled={scrolled}
        favCount={favorites.size}
        tripCount={trips.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSearch={() => setSearchOpen(true)}
        onFavorites={() => setFavOpen(true)}
        onTrips={() => navigate("/my-trips")}
        onTalk={() => talkToVenture()}
        onPlan={() => openPlanner()}
      />

      {/* ---------- ROUTES ---------- */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
      </Routes>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-gray-200/90 bg-white pb-24 pt-16 text-gray-900 dark:border-ivory/10 dark:bg-coal dark:text-ivory md:pb-16 transition-colors" aria-label="Site footer">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-display text-[26px] font-medium text-gray-950 dark:text-ivory">
                Venture <span className="italic text-champagne">Pakistan</span>
              </p>
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-gray-600 dark:text-ivory/60">
                Curated journeys across Pakistan. Honest planning, trusted partners, memories that stay.
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => talkToVenture()} className="link-underline text-[13px] font-bold tracking-wide text-gray-600 hover:text-gray-950 dark:text-ivory/60 dark:hover:text-ivory">
                WhatsApp
              </button>
              <a href="#" className="link-underline text-[13px] font-bold tracking-wide text-gray-600 hover:text-gray-950 dark:text-ivory/60 dark:hover:text-ivory">Instagram</a>
              <a href="#" className="link-underline text-[13px] font-bold tracking-wide text-gray-600 hover:text-gray-950 dark:text-ivory/60 dark:hover:text-ivory">Terms</a>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200/90 pt-6 text-[12px] font-semibold text-gray-500 dark:border-ivory/10 dark:text-ivory/40">
            © {new Date().getFullYear()} Venture Pakistan. Designed for the traveler.
          </div>
        </div>
      </footer>

      {/* ---------- BOTTOM NAV (MOBILE) ---------- */}
      <BottomNav
        favCount={favorites.size}
        tripCount={trips.length}
        onHome={() => navigate("/")}
        onExplore={() => navigate("/")}
        onTrips={() => navigate("/my-trips")}
        onFavorites={() => setFavOpen(true)}
        onProfile={() => setProfileOpen(true)}
      />

      <FloatingWhatsApp onClick={() => talkToVenture()} />
      <ChatBot
        onOpenPlanner={(id, overrides) => openPlanner(id, overrides)}
        onOpenDetail={(id) => setDetailId(id)}
      />

      {/* ---------- GLOBAL OVERLAYS ---------- */}
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDestination={(id) => navigate(`/destination/${id}`)}
        onSelectStyle={(id) => { navigate("/"); /* Optional logic */ }}
      />
      <FavoritesDrawer
        open={favOpen}
        onClose={() => setFavOpen(false)}
        favorites={favorites}
        onRemove={(id) => toggleFav(id)}
        onPlan={(id) => openPlanner(id)}
        onBrowse={() => { setFavOpen(false); navigate("/"); }}
      />
      <PlannerModal
        open={store.plannerOpen}
        onClose={() => store.setPlannerOpen(false)}
        presetDestination={store.plannerPreset || "hunza"}
        onGenerated={store.handleGenerated}
        travelersDefault={store.plannerDefaults?.travelers}
        daysDefault={store.plannerDefaults?.days}
        budgetDefault={store.plannerDefaults?.budget}
      />
      <ItineraryView
        open={store.itineraryOpen}
        onClose={() => store.setItineraryOpen(false)}
        trip={store.activeTrip}
        onSave={(trip) => store.saveTrip(trip)}
        saved={store.activeTrip ? store.trips.some(t => t.id === store.activeTrip!.id) : false}
        onBook={(trip) => {
          store.setItineraryOpen(false);
          window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=Hello Venture Pakistan, I would like to book my trip to ${trip.destination}.`, "_blank");
        }}
      />
      <ProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        tripCount={trips.length}
        favCount={favorites.size}
        theme={theme}
        onToggleTheme={toggleTheme}
        onTrips={() => { setProfileOpen(false); navigate("/my-trips"); }}
        onFavorites={() => { setProfileOpen(false); setFavOpen(true); }}
        onTalk={() => talkToVenture()}
      />

      <ToastStack toasts={toasts} />
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
