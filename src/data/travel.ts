/* ============================================================
   VENTURE PAKISTAN — DATA LAYER
   Config · Destinations · Travel styles · Itinerary engine
   Migration-ready: swap MOCK generator with /api/itinerary later
   ============================================================ */

export const BUSINESS_WHATSAPP = "923220254568";
export const BUSINESS_EMAIL = "hello@venturepakistan.pk";

export const AI_CONFIG = {
  enabled: false,
  endpoint: "/api/itinerary",
};

export const STORAGE_KEYS = {
  trips: "tariq_travel_trips",
  favorites: "tariq_travel_favorites",
  prefs: "tariq_travel_prefs",
  theme: "tariq_travel_theme",
} as const;

/* ---------------- types ---------------- */

export interface Destination {
  id: string;
  name: string;
  shortName: string;
  region: string;
  altitude: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  duration: string;
  days: number;
  bestSeason: string;
  recommendedStay: string;
  category: string[];
  image: string;
  thumb: string;
  description: string;
  longDescription: string;
  tags: string[];
  highlights: string[];
  stay: string;
  transport: string;
  mapX: number; // % coords on stylised Pakistan SVG map
  mapY: number;
}

export interface TravelStyle {
  id: string;
  title: string;
  description: string;
  image: string;
  destinations: string[];
  duration: string;
  startingCost: number;
  icon: string;
}

export interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  dining: string;
  stayNote?: string;
}

export interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  activities: number;
  food: number;
  guide: number;
  total: number;
}

export interface GeneratedTrip {
  id: string;
  destinationId: string;
  destination: string;
  region: string;
  createdAt: string;
  duration: number;
  travelers: number;
  budget: string;
  travelStyle: string;
  pace: string;
  interests: string[];
  itinerary: DayPlan[];
  costing: BudgetBreakdown;
  insiderNotes: string[];
  packing: string[];
  bestTime: string;
  travelTips: string[];
  status: "Planning" | "Ready to Book" | "Confirmed";
}

export const px = (id: number, w = 1200, format: "webp" | "jpeg" = "webp") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&fm=${format}`;

export const pxSrcSet = (id: number) =>
  `${px(id, 640, "webp")} 640w, ${px(id, 1080, "webp")} 1080w, ${px(id, 1920, "webp")} 1920w`;

/* ---------------- destinations ---------------- */

export const DESTINATIONS: Destination[] = [
  {
    id: "hunza",
    name: "Hunza Valley",
    shortName: "Hunza",
    region: "Gilgit-Baltistan",
    altitude: "2,438m",
    rating: 4.9,
    reviews: 412,
    startingPrice: 85000,
    duration: "5 Days",
    days: 5,
    bestSeason: "April — October",
    recommendedStay: "4–5 nights",
    category: ["mountain", "culture", "luxury", "family", "photography"],
    image: px(35171324, 1400),
    thumb: px(35171324, 600),
    description:
      "Apricot orchards, 700-year-old forts and Rakaposhi watching over everything. The valley that converts every sceptic.",
    longDescription:
      "Hunza is where most travellers finally understand northern Pakistan. Ancient forts balance on ridgelines above terraced orchards, the Karakoram Highway threads through it all, and evenings in Karimabad smell of apricot woodsmoke. Tariq's home-ground routes go beyond the viewpoints — into family orchards, hidden terraces and sunrise spots the buses never reach.",
    tags: ["Mountains", "Photography", "Culture", "Fort", "Family"],
    highlights: ["Baltit & Altit Forts", "Attabad Lake boating", "Eagle's Nest sunrise", "Passu Cones", "Khunjerab Pass day trip"],
    stay: "Handpicked riverside lodges & boutique fort-view hotels in Karimabad and Gulmit.",
    transport: "Private Prado / coaster with mountain-experienced driver; KKH route with photo stops.",
    mapX: 68,
    mapY: 16,
  },
  {
    id: "skardu",
    name: "Skardu & Shigar",
    shortName: "Skardu",
    region: "Gilgit-Baltistan",
    altitude: "2,228m",
    rating: 4.9,
    reviews: 386,
    startingPrice: 92000,
    duration: "6 Days",
    days: 6,
    bestSeason: "May — October",
    recommendedStay: "5–6 nights",
    category: ["mountain", "adventure", "photography", "luxury"],
    image: px(35302567, 1400),
    thumb: px(35302567, 600),
    description:
      "Cold deserts, mirror lakes and the gateway to K2. Skardu is raw Karakoram — quieter, wilder, unforgettable.",
    longDescription:
      "Skardu trades Hunza's orchards for something wilder: the Sarfaranga cold desert, Shangrila's mirror lake, Shigar's restored fort-palace and the road toward Concordia. It rewards travellers who want scale — vast valleys, 8,000-metre horizons and nights so clear the Milky Way feels close enough to touch.",
    tags: ["Mountains", "Desert", "Lakes", "Adventure", "Stargazing"],
    highlights: ["Shangrila & Upper Kachura", "Sarfaranga Cold Desert", "Shigar Fort Palace", "Deosai day excursion", "Manthokha Waterfall"],
    stay: "Shigar Fort residence, lake-view resorts and curated guesthouses in Skardu town.",
    transport: "4×4 jeeps for desert & Deosai; private SUV for valley touring.",
    mapX: 74,
    mapY: 24,
  },
  {
    id: "fairy-meadows",
    name: "Fairy Meadows",
    shortName: "Fairy Meadows",
    region: "Diamer · Gilgit-Baltistan",
    altitude: "3,300m",
    rating: 4.8,
    reviews: 294,
    startingPrice: 78000,
    duration: "4 Days",
    days: 4,
    bestSeason: "May — September",
    recommendedStay: "2–3 nights",
    category: ["mountain", "adventure", "photography"],
    image: px(29401243, 1400),
    thumb: px(29401243, 600),
    description:
      "A jeep track, a forest trail, then Nanga Parbat fills the entire sky. No road in Pakistan ends more dramatically.",
    longDescription:
      "The journey is the rite of passage: the famous Raikot jeep track, then a pine-forest trek to a meadow staring straight at Nanga Parbat's 8,126m Rupal Face. Nights are bonfires and galaxies; mornings are the Killer Mountain turning gold. Tariq pairs it with Beyal Camp and Nanga Parbat Base Camp options for strong walkers.",
    tags: ["Trekking", "Nanga Parbat", "Camping", "Adventure"],
    highlights: ["Nanga Parbat viewpoint", "Beyal Camp trek", "Base Camp option", "Bonfire nights", "Raikot jeep track"],
    stay: "Classic wooden cottages on the meadow; camping upgrades available.",
    transport: "Specialist local jeeps on Raikot track + guided trek support.",
    mapX: 62,
    mapY: 26,
  },
  {
    id: "swat",
    name: "Swat Valley",
    shortName: "Swat",
    region: "Khyber Pakhtunkhwa",
    altitude: "1,980m",
    rating: 4.7,
    reviews: 351,
    startingPrice: 58000,
    duration: "4 Days",
    days: 4,
    bestSeason: "March — October",
    recommendedStay: "3–4 nights",
    category: ["mountain", "family", "culture", "relaxation"],
    image: px(37869199, 1400),
    thumb: px(37869199, 600),
    description:
      "Alpine lakes, Buddhist heritage and the easiest great escape from Islamabad. The 'Switzerland of Pakistan' earns it.",
    longDescription:
      "Swat is the most accessible mountain escape — a smooth motorway from Islamabad, then suddenly you're among emerald rivers, alpine lakes like Mahodand and Daral, and 2,000-year-old Buddhist stupas. Ideal for families, first-timers and anyone short on days but long on expectations.",
    tags: ["Lakes", "Family", "Heritage", "Easy Access"],
    highlights: ["Mahodand Lake", "Kalam & Ushu Forest", "Malam Jabba", "Butkara Stupa", "Daral Lake trek"],
    stay: "Riverside hotels in Kalam, boutique stays in Malam Jabba.",
    transport: "Private van/SUV from Islamabad; jeeps for Mahodand & Ushu.",
    mapX: 52,
    mapY: 30,
  },
  {
    id: "chitral",
    name: "Chitral & Kalash",
    shortName: "Chitral",
    region: "Khyber Pakhtunkhwa",
    altitude: "1,494m",
    rating: 4.8,
    reviews: 218,
    startingPrice: 72000,
    duration: "5 Days",
    days: 5,
    bestSeason: "April — October",
    recommendedStay: "4–5 nights",
    category: ["culture", "mountain", "photography", "adventure"],
    image: px(681687, 1400),
    thumb: px(681687, 600),
    description:
      "The Kalash valleys, Tirich Mir views and a culture found nowhere else on earth. Chitral is Pakistan's best-kept story.",
    longDescription:
      "Chitral feels like a country of its own — walnut groves, polo grounds at the world's highest, and the three Kalash valleys where an ancient culture of festivals, music and cedar-wood villages survives. Through the Lowari Tunnel it's now reachable year-round, but it still feels beautifully undiscovered.",
    tags: ["Kalash", "Culture", "Festivals", "Offbeat"],
    highlights: ["Bumburet & Rumbur valleys", "Kalash festivals (seasonal)", "Shandur Polo Ground", "Garam Chashma", "Chitral Fort & bazaar"],
    stay: "Heritage guesthouses in Chitral town; community-run lodges in Kalash valleys.",
    transport: "Private SUV via Lowari Tunnel; local jeeps in Kalash valleys.",
    mapX: 46,
    mapY: 24,
  },
  {
    id: "neelum",
    name: "Neelum Valley",
    shortName: "Neelum",
    region: "Azad Jammu & Kashmir",
    altitude: "1,615m",
    rating: 4.7,
    reviews: 327,
    startingPrice: 54000,
    duration: "4 Days",
    days: 4,
    bestSeason: "April — October",
    recommendedStay: "3–4 nights",
    category: ["mountain", "family", "relaxation", "photography"],
    image: px(15388314, 1400),
    thumb: px(15388314, 600),
    description:
      "A blue river running 200km through pine forests and villages. Arang Kel alone is worth the journey.",
    longDescription:
      "Neelum is Kashmir's long green corridor — the river never leaves your side as you climb from Muzaffarabad through Keran and Sharda to Kel, then hike or ride the chairlift up to Arang Kel's famous meadow-perch. Lush, gentle and deeply relaxing; perfect for couples, families and slow travellers.",
    tags: ["River", "Forest", "Arang Kel", "Family", "Relaxing"],
    highlights: ["Arang Kel meadows", "Sharda & Nardajan", "Keran riverside", "Ratti Gali Lake (seasonal)", "Dhani Waterfall"],
    stay: "Riverside resorts in Keran & Sharda; wooden cottages in Arang Kel.",
    transport: "Private car/van from Islamabad; chairlift + short trek to Arang Kel.",
    mapX: 60,
    mapY: 40,
  },
  {
    id: "lahore",
    name: "Lahore",
    shortName: "Lahore",
    region: "Punjab",
    altitude: "217m",
    rating: 4.8,
    reviews: 445,
    startingPrice: 38000,
    duration: "3 Days",
    days: 3,
    bestSeason: "October — March",
    recommendedStay: "2–3 nights",
    category: ["culture", "food", "heritage", "family", "luxury"],
    image: px(13629907, 1400),
    thumb: px(13629907, 600),
    description:
      "Mughal forts, Sufi shrines and Pakistan's greatest food street. Lahore doesn't whisper — it welcomes you loudly.",
    longDescription:
      "Lahore is Pakistan's beating heart: the Badshahi Mosque and Lahore Fort at sunrise, the Walled City's dozen gates and hidden havelis, Sufi nights at Shah Jamal, and Fort Road Food Street when the mosque glows behind you. Tariq's Lahore is guided by born-and-bred Lahoris who know which nihari pot has simmered longest.",
    tags: ["Heritage", "Food", "Mughal", "City", "Sufi"],
    highlights: ["Badshahi Mosque & Fort", "Walled City walk", "Fort Road Food Street", "Wagah border ceremony", "Shalimar Gardens"],
    stay: "Heritage havelis in the Walled City & premium Gulberg hotels.",
    transport: "Private car with city guide; tuk-tuk experience in Androon Shehr.",
    mapX: 64,
    mapY: 56,
  },
  {
    id: "gwadar",
    name: "Gwadar Coast",
    shortName: "Gwadar",
    region: "Balochistan",
    altitude: "Sea level",
    rating: 4.6,
    reviews: 186,
    startingPrice: 65000,
    duration: "4 Days",
    days: 4,
    bestSeason: "October — March",
    recommendedStay: "3 nights",
    category: ["coastal", "relaxation", "photography", "adventure"],
    image: px(29520172, 1400),
    thumb: px(29520172, 600),
    description:
      "Hammerhead cliffs, desert meeting sea, and sunsets over the Arabian Sea. Pakistan's coast is the plot twist.",
    longDescription:
      "Most visitors never expect Pakistan's coast. The Makran Coastal Highway from Karachi is itself the attraction — the Princess of Hope, Buzi Pass views over the Hingol — before Gwadar's hammerhead peninsula, Koh-e-Batil sunsets and fresh seafood on the harbour. Wild, cinematic and almost empty.",
    tags: ["Beach", "Coast", "Sunset", "Offbeat", "Seafood"],
    highlights: ["Koh-e-Batil sunset point", "Makran Coastal Highway", "Hammerhead & Marine Drive", "Hingol National Park", "Harbour seafood nights"],
    stay: "Sea-view hotels on Marine Drive; curated stopovers on the coastal highway.",
    transport: "Fly Karachi–Gwadar or private SUV via Makran Coastal Highway.",
    mapX: 22,
    mapY: 74,
  },
  {
    id: "deosai",
    name: "Deosai Plains",
    shortName: "Deosai",
    region: "Gilgit-Baltistan",
    altitude: "4,114m",
    rating: 4.8,
    reviews: 164,
    startingPrice: 68000,
    duration: "3 Days",
    days: 3,
    bestSeason: "June — September",
    recommendedStay: "1–2 nights camping",
    category: ["adventure", "mountain", "photography"],
    image: px(27151258, 1400),
    thumb: px(27151258, 600),
    description:
      "The Land of Giants — 3,000 sq km of wildflower plateau at 4,000m, home to Himalayan brown bears.",
    longDescription:
      "Deosai is the second-highest plateau on earth and feels like another planet: rolling wildflower plains, Sheosar Lake's impossible blue, marmots whistling from the grass and, if you're lucky, a distant Himalayan brown bear. Best done as a Skardu add-on or a dedicated expedition with camping under absurd stars.",
    tags: ["Plateau", "Wildlife", "Camping", "Lakes"],
    highlights: ["Sheosar Lake", "Bara Pani & Kala Pani", "Brown bear habitat", "Wildflower season (Jul–Aug)", "Stargazing camp"],
    stay: "Expedition camping on the plains; Skardu base hotels.",
    transport: "High-clearance 4×4 with expedition kit and local spotters.",
    mapX: 70,
    mapY: 30,
  },
  {
    id: "passu",
    name: "Passu & Gojal",
    shortName: "Passu",
    region: "Upper Hunza · GB",
    altitude: "2,840m",
    rating: 4.9,
    reviews: 203,
    startingPrice: 88000,
    duration: "5 Days",
    days: 5,
    bestSeason: "April — October",
    recommendedStay: "2–3 nights",
    category: ["mountain", "adventure", "photography", "culture"],
    image: px(27355461, 1400),
    thumb: px(27355461, 600),
    description:
      "The Passu Cones, Hussaini suspension bridge and glaciers you can walk to. Upper Hunza is the deep cut.",
    longDescription:
      "Beyond central Hunza, Gojal turns cinematic: the cathedral-spike Passu Cones, the swaying Hussaini Bridge over the Hunza River, Batura and Passu glaciers calving within hiking distance, and the road climbing to Khunjerab — the world's highest paved border crossing at 4,693m.",
    tags: ["Cones", "Glaciers", "Khunjerab", "Adventure"],
    highlights: ["Passu Cones viewpoint", "Hussaini Bridge", "Batura Glacier hike", "Khunjerab Pass (4,693m)", "Sost border market"],
    stay: "Glacier-view lodges in Passu; family-run guesthouses in Gulmit.",
    transport: "Private Prado; guided glacier & bridge walks with local porters.",
    mapX: 66,
    mapY: 10,
  },
  {
    id: "kumrat",
    name: "Kumrat Valley & Upper Dir",
    shortName: "Kumrat",
    region: "Khyber Pakhtunkhwa",
    altitude: "2,400m",
    rating: 4.8,
    reviews: 215,
    startingPrice: 65000,
    duration: "5 Days",
    days: 5,
    bestSeason: "May — October",
    recommendedStay: "3–4 nights",
    category: ["mountain", "adventure", "photography"],
    image: px(1366919, 1400),
    thumb: px(1366919, 600),
    description:
      "Towering Deodar forests, the roaring Panjkora River, and the turquoise bowl of Katora Lake. A true pristine wilderness.",
    longDescription:
      "Kumrat Valley and Upper Dir offer an untouched, fairytale-like landscape. From the ancient, towering Kumrat Deodar Forest along the Panjkora River to the high-altitude alpine meadows of Jahaz Banda and the striking, bowl-shaped Katora Lake. Do Kala Chashma's twin springs and hidden Panjkora River Waterfall make this a paradise for trekkers and nature lovers seeking off-grid wilderness.",
    tags: ["Forest", "Lakes", "Trekking", "Off-grid", "Waterfalls"],
    highlights: ["Jahaz Banda Meadows", "Katora Lake Trek", "Kumrat Deodar Forest", "Panjkora River Waterfall", "Do Kala Chashma"],
    stay: "Riverside glamping in Kumrat forest; wooden guesthouses in Thal and Jahaz Banda.",
    transport: "Private SUV to Thal; local 4×4 jeeps for Kumrat forest and Jahaz Banda base.",
    mapX: 48,
    mapY: 28,
  },
];

export const getDestination = (id: string) =>
  DESTINATIONS.find((d) => d.id === id) ?? DESTINATIONS[0];

/* ---------------- travel styles ---------------- */

export const TRAVEL_STYLES: TravelStyle[] = [
  {
    id: "mountain",
    title: "Mountain & Glacier",
    description: "High valleys, hanging glaciers and sunrise summits — the Karakoram at its most cinematic.",
    image: px(15817299, 1000),
    destinations: ["hunza", "skardu", "passu", "fairy-meadows", "kumrat"],
    duration: "5–8 days",
    startingCost: 85000,
    icon: "mountain",
  },
  {
    id: "culture",
    title: "Culture & Heritage",
    description: "Mughal Lahore, Kalash festivals, ancient forts and food streets that never sleep.",
    image: px(15505033, 1000),
    destinations: ["lahore", "chitral", "hunza"],
    duration: "3–6 days",
    startingCost: 38000,
    icon: "landmark",
  },
  {
    id: "coastal",
    title: "Coastal Escape",
    description: "The Makran coast — desert cliffs, empty beaches and Arabian Sea sunsets.",
    image: px(30363540, 1000),
    destinations: ["gwadar"],
    duration: "3–4 days",
    startingCost: 65000,
    icon: "waves",
  },
  {
    id: "luxury",
    title: "Luxury Retreat",
    description: "Fort residences, lake-view suites and private drivers. The north, without compromise.",
    image: px(31665649, 1000),
    destinations: ["hunza", "skardu", "swat"],
    duration: "5–7 days",
    startingCost: 185000,
    icon: "gem",
  },
  {
    id: "adventure",
    title: "High-Altitude Adventure",
    description: "Base camps, 4×4 tracks, suspension bridges and 4,693m border crossings.",
    image: px(13708267, 1000),
    destinations: ["fairy-meadows", "deosai", "passu", "skardu"],
    duration: "4–7 days",
    startingCost: 72000,
    icon: "compass",
  },
  {
    id: "family",
    title: "Family Escape",
    description: "Gentle pacing, easy roads, riverside hotels — built for kids, parents and grandparents.",
    image: px(39639380, 1000),
    destinations: ["swat", "neelum", "lahore"],
    duration: "3–5 days",
    startingCost: 54000,
    icon: "users",
  },
];

/* ---------------- hero / editorial images ---------------- */

export const IMAGES = {
  hero: px(19442083, 1920, "webp"),
  heroMobile: px(19442083, 768, "webp"),
  heroSrcSet: pxSrcSet(19442083),
  heroFallback: px(35171324, 1920, "webp"),
  tariq: '/tariq-main.jpg',
  tariqAlt: '/tariq-small.jpg',
  signature: px(35170643, 1600, "webp"),
  attabad: px(19442077, 1200, "webp"),
  passuRoad: px(27355461, 1200, "webp"),
  lahoreFood: px(15879786, 1000, "webp"),
  kalash: px(681687, 1000, "webp"),
  jeep: px(13708267, 1200, "webp"),
  resort: px(2854553, 1200, "webp"),
  night: px(15839367, 1200, "webp"),
  swatRiver: px(39639380, 1200, "webp"),
};

/* ---------------- itinerary engine (mock / demo mode) ---------------- */

const DAY_TITLES: Record<string, string[]> = {
  hunza: ["Arrival & First Impressions", "Forts of Karimabad", "Attabad & Gulmit", "Passu & Khunjerab", "Eagle's Nest Farewell", "Gojal Slow Day", "Orchard & Village Life"],
  skardu: ["Arrival in Skardu", "Shangrila & Kachura", "Shigar Valley", "Cold Desert & Manthokha", "Deosai Excursion", "Farewell Valleys"],
  "fairy-meadows": ["Road to Raikot", "Trek to the Meadow", "Beyal & Base Camp", "Sunrise & Return"],
  swat: ["Islamabad to Swat", "Kalam & Ushu", "Mahodand Lake", "Malam Jabba & Return"],
  chitral: ["Into the Hindu Kush", "Kalash Valleys", "Shandur & Valleys", "Garam Chashma", "Bazaars & Return"],
  neelum: ["Into the Valley", "Keran & Sharda", "Kel & Arang Kel", "Waterfalls & Return"],
  lahore: ["Walled City & Fort", "Mughal Trail", "Sufi Nights & Farewell"],
  gwadar: ["Coastal Highway", "Hammerhead & Harbour", "Hingol & Sunset", "Marine Drive Farewell"],
  deosai: ["Skardu to the Plains", "Sheosar & Wildlife", "Descent & Farewell"],
  passu: ["Up the Karakoram Highway", "Cones & Bridges", "Glaciers & Khunjerab", "Gulmit Slow Day", "Return via Hunza"],
  kumrat: ["Thal & Panjkora River", "Kumrat Forest & Waterfalls", "Trek to Jahaz Banda", "Katora Lake & Do Kala Chashma", "Descent & Return"],
};

const MORNING_POOL = [
  "Early breakfast with valley views, then an easy start as the light hits the peaks.",
  "Sunrise viewpoint before breakfast — Tariq's team times it so you beat every group.",
  "Slow morning: local breakfast, a short village walk and time to breathe the altitude in.",
  "After breakfast, drive the scenic stretch with planned photo stops (no rushed viewpoints).",
];
const AFTERNOON_POOL = [
  "Guided exploration with a local host — stories, not just sights.",
  "Free time built in: café stop, bazaar wander or a nap with a view. Your call.",
  "Signature experience slot — boating, short hike or heritage walk depending on the day.",
  "Scenic drive with a proper lunch stop at a trusted local kitchen.",
];
const EVENING_POOL = [
  "Golden-hour viewpoint, then dinner at a handpicked spot.",
  "Bonfire / terrace evening with chai and mountain stories from your guide.",
  "Sunset walk through the village, dinner back at the stay.",
  "Early night option or stargazing session — altitude makes the sky absurd.",
];
const DINING_POOL = [
  "Dinner: trusted local kitchen — chapshuro & apricot dessert where available.",
  "Dinner: riverside BBQ night (weather permitting) with fresh trout.",
  "Dinner: traditional platter at the stay — davido, harissa or Lahori chargha by region.",
  "Dinner: food-street crawl with your guide — eat where locals queue.",
];

const INSIDER_POOL: Record<string, string[]> = {
  hunza: [
    "Eagle's Nest at sunrise, not sunset — fewer crowds, better light on Rakaposhi.",
    "Carry small cash for orchard stops; the best apricots are sold from farm gates.",
    "Altit Fort's café terrace has the quietest view in Karimabad. Go at 4pm.",
  ],
  skardu: [
    "Sarfaranga desert is best 1 hour before sunset — long shadows on the dunes.",
    "Upper Kachura at 7am is glass. Boats start later; photographers go early.",
    "Deosai needs a full day and warm layers even in August. Trust us.",
  ],
  default: [
    "Mornings beat afternoons everywhere in the north — light, crowds and weather all favour early starts.",
    "Keep day one deliberately light. Altitude + travel day is why itineraries fail.",
    "Ask your driver to stop. The unplanned 10 minutes become the story you tell.",
  ],
};

const PACKING_BASE = [
  "Layered clothing — mountain weather shifts 15°C in a day",
  "Sturdy walking shoes (broken in, not new)",
  "Power bank + universal adapter",
  "Sunscreen & sunglasses (UV is fierce at altitude)",
  "Small daypack for hikes and viewpoints",
  "CNIC / passport copies + originals",
];

const TIPS_BASE = [
  "Road timings in the north are estimates, not promises — build buffer, enjoy stops.",
  "Friday prayer hours (12–2pm) pause many bazaars; plan food accordingly.",
  "Network coverage is patchy beyond Gilgit/Skardu towns — download offline maps.",
  "Respect photography consent in villages, especially in Kalash valleys.",
];

export interface PlannerInput {
  destinationId: string;
  days: number;
  travelers: number;
  budget: "Economy" | "Comfort" | "Premium" | "Luxury";
  travelStyle: string;
  pace: "Relaxed" | "Balanced" | "Packed";
  interests: string[];
  startDate?: string;
}

const BUDGET_PER_DAY: Record<string, number> = {
  Economy: 14000,
  Comfort: 22000,
  Premium: 34000,
  Luxury: 55000,
};

export const LOADING_MESSAGES = [
  "Checking your travel preferences…",
  "Selecting the right experiences…",
  "Building your route…",
  "Adding local recommendations…",
  "Polishing your travel document…",
];

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMockItinerary(input: PlannerInput): GeneratedTrip {
  const dest = getDestination(input.destinationId);
  const seed = [...input.destinationId].reduce((a, c) => a + c.charCodeAt(0), 0) + input.days * 97 + input.travelers * 13;
  const rand = mulberry(seed);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  const titles = DAY_TITLES[dest.id] ?? DAY_TITLES.hunza;
  const itinerary: DayPlan[] = [];
  for (let i = 0; i < input.days; i++) {
    const isFirst = i === 0;
    const isLast = i === input.days - 1;
    itinerary.push({
      day: i + 1,
      title: isFirst
        ? "Arrival & First Impressions"
        : isLast && input.days > 2
          ? "Farewell & Return Journey"
          : titles[i % titles.length],
      morning: isFirst
        ? `Arrive via the scenic route into ${dest.shortName}. Check in, rest, and take a gentle orientation walk — no rushing on day one.`
        : pick(MORNING_POOL),
      afternoon: isLast && input.days > 2
        ? "Souvenir stop, final viewpoint and the comfortable drive back with lunch en route."
        : pick(AFTERNOON_POOL),
      evening: isFirst
        ? "Welcome dinner and trip briefing with your local host. Early night to adjust."
        : pick(EVENING_POOL),
      dining: pick(DINING_POOL),
      stayNote: `Night ${i + 1}: ${dest.stay.split(".")[0]}.`,
    });
  }

  const perDay = BUDGET_PER_DAY[input.budget] ?? BUDGET_PER_DAY.Comfort;
  const styleFactor = input.travelStyle === "Luxury" ? 1.25 : input.travelStyle === "Adventure" ? 1.1 : 1;
  const paceFactor = input.pace === "Packed" ? 1.12 : input.pace === "Relaxed" ? 0.94 : 1;
  const total = Math.round(((perDay * input.days * (1 + (input.travelers - 1) * 0.55)) * styleFactor * paceFactor) / 1000) * 1000;

  const costing: BudgetBreakdown = {
    transport: Math.round(total * 0.3 / 500) * 500,
    accommodation: Math.round(total * 0.34 / 500) * 500,
    activities: Math.round(total * 0.14 / 500) * 500,
    food: Math.round(total * 0.14 / 500) * 500,
    guide: Math.round(total * 0.08 / 500) * 500,
    total,
  };

  return {
    id: `trip_${Date.now().toString(36)}_${Math.floor(rand() * 1e4)}`,
    destinationId: dest.id,
    destination: dest.name,
    region: dest.region,
    createdAt: new Date().toISOString(),
    duration: input.days,
    travelers: input.travelers,
    budget: input.budget,
    travelStyle: input.travelStyle,
    pace: input.pace,
    interests: input.interests,
    itinerary,
    costing,
    insiderNotes: [...(INSIDER_POOL[dest.id] ?? INSIDER_POOL.default)],
    packing: [...PACKING_BASE],
    bestTime: dest.bestSeason,
    travelTips: [...TIPS_BASE],
    status: "Planning",
  };
}

export const generateItinerary = generateMockItinerary;

/* ---------------- helpers ---------------- */

export const formatPKR = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;

export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function tripWhatsappMessage(t: {
  destination: string;
  duration: number;
  travelers: number;
  budget: string;
  travelStyle: string;
  costing?: { total: number };
}): string {
  return `Hello Venture Pakistan,\nI would like to plan a trip to ${t.destination}.\n\nTrip duration: ${t.duration} days\nTravelers: ${t.travelers}\nBudget tier: ${t.budget}\nTravel style: ${t.travelStyle}${t.costing ? `\nEstimated cost: ${formatPKR(t.costing.total)}` : ""}\n\nPlease help me finalize the itinerary and booking.`;
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
