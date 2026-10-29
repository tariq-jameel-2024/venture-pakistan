import { create } from "zustand";
import { ToastItem } from "../components/ui";
import { GeneratedTrip, PlannerInput, STORAGE_KEYS, getDestination, readJSON, writeJSON, whatsappLink, tripWhatsappMessage } from "../data/travel";

interface PlannerDefaults {
  days: number;
  travelers: number;
  budget: PlannerInput["budget"];
}

interface TravelStore {
  // Persisted state
  favorites: Set<string>;
  trips: GeneratedTrip[];
  theme: "dark" | "light";
  
  // Toasts
  toasts: ToastItem[];
  toast: (message: string, kind?: ToastItem["kind"]) => void;

  // Modal / UI states
  searchOpen: boolean;
  favOpen: boolean;
  tripsOpen: boolean;
  plannerOpen: boolean;
  profileOpen: boolean;
  detailId: string | null;
  activeTrip: GeneratedTrip | null;
  itineraryOpen: boolean;
  explorerId: string;
  plannerPreset: string;
  heartPing: string | null;
  plannerDefaults: PlannerDefaults;

  // Actions
  init: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  setSearchOpen: (open: boolean) => void;
  setFavOpen: (open: boolean) => void;
  setTripsOpen: (open: boolean) => void;
  setPlannerOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  setDetailId: (id: string | null) => void;
  setActiveTrip: (trip: GeneratedTrip | null) => void;
  setItineraryOpen: (open: boolean) => void;
  setExplorerId: (id: string) => void;
  setPlannerPreset: (preset: string) => void;

  toggleFav: (id: string) => void;
  openPlanner: (destinationId?: string, overrides?: { days?: number; travelers?: number; budget?: PlannerInput["budget"] }) => void;
  handleGenerated: (trip: GeneratedTrip) => void;
  saveTrip: (trip: GeneratedTrip) => void;
  deleteTrip: (id: string) => void;
  updateStatus: (id: string, status: GeneratedTrip["status"]) => void;
  bookTrip: (t: GeneratedTrip) => void;
}

function applyThemeToDOM(theme: "dark" | "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    if (body) {
      body.classList.add("light");
      body.classList.remove("dark");
    }
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    if (body) {
      body.classList.remove("light");
      body.classList.add("dark");
    }
  }
}

export const useTravelStore = create<TravelStore>((set, get) => ({
  favorites: new Set(),
  trips: [],
  theme: "dark",
  toasts: [],
  
  searchOpen: false,
  favOpen: false,
  tripsOpen: false,
  plannerOpen: false,
  profileOpen: false,
  detailId: null,
  activeTrip: null,
  itineraryOpen: false,
  explorerId: "hunza",
  plannerPreset: "hunza",
  heartPing: null,
  plannerDefaults: { days: 5, travelers: 2, budget: "Comfort" },

  setSearchOpen: (open) => set({ searchOpen: open }),
  setFavOpen: (open) => set({ favOpen: open }),
  setTripsOpen: (open) => set({ tripsOpen: open }),
  setPlannerOpen: (open) => set({ plannerOpen: open }),
  setProfileOpen: (open) => set({ profileOpen: open }),
  setDetailId: (id) => set({ detailId: id }),
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  setItineraryOpen: (open) => set({ itineraryOpen: open }),
  setExplorerId: (id) => set({ explorerId: id }),
  setPlannerPreset: (preset) => set({ plannerPreset: preset }),

  toast: (message, kind = "success") => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message, kind }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },

  init: () => {
    const favorites = new Set(readJSON<string[]>(STORAGE_KEYS.favorites, []));
    const trips = readJSON<GeneratedTrip[]>(STORAGE_KEYS.trips, []);
    
    let theme: "dark" | "light" = "dark";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.theme);
      if (saved === "light" || saved === "dark") {
        theme = saved;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        theme = "light";
      }
      applyThemeToDOM(theme);
    }
    
    set({ favorites, trips, theme });
  },

  toggleTheme: () => {
    const current = get().theme;
    const nextTheme: "dark" | "light" = current === "light" ? "dark" : "light";
    set({ theme: nextTheme });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
      applyThemeToDOM(nextTheme);
    }
    get().toast(
      nextTheme === "light"
        ? "Light Theme activated — Soft off-white luxury canvas"
        : "Dark Theme activated — Charcoal & gold luxury canvas",
      "info"
    );
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
      applyThemeToDOM(theme);
    }
  },

  toggleFav: (id) => {
    set((state) => {
      const next = new Set(state.favorites);
      const d = getDestination(id);
      if (next.has(id)) {
        next.delete(id);
        state.toast(`${d.shortName} removed from favorites.`, "info");
      } else {
        next.add(id);
        state.toast(`${d.shortName} added to your favorites.`);
      }
      
      writeJSON(STORAGE_KEYS.favorites, [...next]);

      setTimeout(() => set({ heartPing: null }), 450);
      return { favorites: next, heartPing: id };
    });
  },

  openPlanner: (destinationId = "hunza", overrides) => {
    set((state) => {
      const newDefaults = { ...state.plannerDefaults };
      if (overrides) {
        newDefaults.days = Math.min(14, Math.max(1, overrides.days ?? state.plannerDefaults.days));
        newDefaults.travelers = Math.min(12, Math.max(1, overrides.travelers ?? state.plannerDefaults.travelers));
        newDefaults.budget = overrides.budget ?? state.plannerDefaults.budget;
      }
      return {
        plannerPreset: destinationId,
        plannerDefaults: newDefaults,
        detailId: null,
        favOpen: false,
        tripsOpen: false,
        plannerOpen: true,
      };
    });
  },

  handleGenerated: (trip) => {
    set({ plannerOpen: false, activeTrip: trip, itineraryOpen: true });
    get().toast("Your itinerary is ready.");
  },

  saveTrip: (trip) => {
    set((state) => {
      if (state.trips.some((t) => t.id === trip.id)) return state;
      const next = [trip, ...state.trips];
      writeJSON(STORAGE_KEYS.trips, next);
      state.toast("Journey saved successfully.");
      return { trips: next };
    });
  },

  deleteTrip: (id) => {
    set((state) => {
      const next = state.trips.filter((t) => t.id !== id);
      writeJSON(STORAGE_KEYS.trips, next);
      state.toast("Trip removed.", "info");
      return { trips: next };
    });
  },

  updateStatus: (id, status) => {
    set((state) => {
      const next = state.trips.map((t) => (t.id === id ? { ...t, status } : t));
      writeJSON(STORAGE_KEYS.trips, next);
      state.toast(`Trip marked as “${status}”.`, "info");
      return { trips: next };
    });
  },

  bookTrip: (t) => {
    window.open(whatsappLink(tripWhatsappMessage(t)), "_blank", "noopener");
    get().toast("Opening WhatsApp to confirm your booking…", "info");
  }
}));
