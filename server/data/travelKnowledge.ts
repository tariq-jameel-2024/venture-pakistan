/**
 * VENTURE PAKISTAN — VERIFIED KNOWLEDGE BASE & GROUND TRUTH
 * This data is strictly grounded in the real platform catalog (src/data/travel.ts).
 * The AI uses this data to answer factual queries and MUST NOT hallucinate missing details.
 */

export interface VerifiedDestination {
  id: string;
  name: string;
  region: string;
  altitude: string;
  startingPricePKR: number;
  duration: string;
  days: number;
  bestSeason: string;
  recommendedStay: string;
  highlights: string[];
  stayType: string;
  transportType: string;
  overview: string;
}

export interface TravelStyleKnowledge {
  id: string;
  title: string;
  description: string;
  startingCostPKR: number;
  duration: string;
}

export interface BudgetTierKnowledge {
  tier: "Economy" | "Comfort" | "Premium" | "Luxury";
  approxPerDayPKR: number;
  description: string;
  typicalStay: string;
}

export const BUSINESS_CONFIG = {
  businessName: "Venture Pakistan",
  tagline: "Curated Pakistan Travel Experiences · Karakoram Route Architect",
  founder: "Tariq",
  role: "Verified Mountain Guide & Northern Pakistan Route Architect",
  experience: "500+ travelers guided since 2019, 4.9 average rating",
  whatsappNumber: "923220254568",
  formattedWhatsApp: "+92 322 0254568",
  email: "hello@venturepakistan.pk",
  websiteUrl: "https://venturepakistan.pk",
};

export const VERIFIED_DESTINATIONS: VerifiedDestination[] = [
  {
    id: "hunza",
    name: "Hunza Valley",
    region: "Gilgit-Baltistan",
    altitude: "2,438 m",
    startingPricePKR: 95000,
    duration: "5 to 7 days",
    days: 5,
    bestSeason: "April to October (Cherry Blossom: April, Autumn: October)",
    recommendedStay: "Serena Inn Karimabad, Luxus Hunza Attabad, or boutique local lodges",
    highlights: [
      "Baltit & Altit Forts (ancient heritage)",
      "Turquoise Attabad Lake boat cruise",
      "Passu Cones cathedral peaks & suspension bridge",
      "Duikar Eagle's Nest viewpoint at sunrise",
      "Khunjerab Pass (Pak-China border at 4,693 m)"
    ],
    stayType: "Heritage boutique lodges, eco-resorts & scenic lakeside glamping",
    transportType: "Private 4x4 Prado / Grand Cabin with high-mountain verified driver",
    overview: "Towering Rakaposhi, apricot and cherry blossoms in spring, golden poplar trees in autumn, and ancient Silk Route castles."
  },
  {
    id: "skardu",
    name: "Skardu & Deosai",
    region: "Gilgit-Baltistan",
    altitude: "2,228 m (Deosai plateau: 4,114 m)",
    startingPricePKR: 110000,
    duration: "6 to 8 days",
    days: 6,
    bestSeason: "June to September (Deosai is snowbound until mid-June)",
    recommendedStay: "Shangrila Resort Kachura, Serena Shigar Fort, Khaplu Palace",
    highlights: [
      "Deosai National Park ('Land of the Giants' high plateau)",
      "Upper & Lower Kachura (Shangrila) Lakes",
      "Sarfaranga Cold Desert stargazing & jeep safari",
      "Historic Serena Shigar Fort (17th century Raja palace)",
      "Khaplu Palace & Royal Gardens",
      "Gateway to K2 and Concordia"
    ],
    stayType: "Heritage palace hotels, luxury lakeside chalets, and alpine camps",
    transportType: "Dedicated 4x4 Land Cruiser for Deosai rough tracks & mountain passes",
    overview: "Gateway to the world's highest peaks, surreal cold deserts, turquoise glacial lakes, and the wild Deosai plains."
  },
  {
    id: "fairy-meadows",
    name: "Fairy Meadows & Nanga Parbat",
    region: "Gilgit-Baltistan",
    altitude: "3,300 m (Nanga Parbat Base Camp: 3,967 m)",
    startingPricePKR: 85000,
    duration: "4 to 5 days",
    days: 4,
    bestSeason: "May to October",
    recommendedStay: "Raikot Sarai wooden cottages, Fairy Meadows alpine huts",
    highlights: [
      "World-famous Raikot Bridge mountain jeep track",
      "Trek through subalpine pine forests to Fairy Meadows",
      "Direct front-row face view of Nanga Parbat (8,126 m Killer Mountain)",
      "Day hike to Beyal Camp & German Viewpoint",
      "Stargazing under crystal dark skies with milky way views"
    ],
    stayType: "Traditional wooden log cabins with wood-burning Bukhari stoves",
    transportType: "Licensed Raikot local 4x4 mountain jeep + guided mule/foot trek",
    overview: "An iconic wilderness adventure leading directly to the colossal ice wall of the 9th highest mountain on Earth."
  },
  {
    id: "swat",
    name: "Swat Valley & Kalam",
    region: "Khyber Pakhtunkhwa",
    altitude: "980 m to 2,000 m (Kalam / Mahodand: 2,865 m)",
    startingPricePKR: 65000,
    duration: "4 to 5 days",
    days: 4,
    bestSeason: "Year-round (Emerald spring/summer, crisp snowy winters in Malam Jabba)",
    recommendedStay: "Serena Swat, Walnut Heights Kalam, Rock City Resort",
    highlights: [
      "Malam Jabba ski resort & scenic chairlift",
      "Mahodand Lake alpine trout waters & Ushu Forest",
      "Kalam riverside cedar pine valleys",
      "Ancient Buddhist monastic ruins at Butkara & Shingardar Stupa",
      "Traditional Swati wood-carved mosques"
    ],
    stayType: "Modern riverside resorts, pine hill chalets & luxury hotels",
    transportType: "Luxury saloon or Hiace on Swat Motorway; 4x4 jeeps for Mahodand",
    overview: "Known as the Switzerland of the East with lush cedar forests, roaring rivers, Buddhist heritage, and alpine lakes."
  },
  {
    id: "chitral",
    name: "Chitral & Kalash Valleys",
    region: "Khyber Pakhtunkhwa",
    altitude: "1,500 m to 2,200 m (Lowari Tunnel access)",
    startingPricePKR: 80000,
    duration: "5 to 6 days",
    days: 5,
    bestSeason: "May to November (Festivals: Chilam Joshi in May, Uchau in Aug, Choimus in Dec)",
    recommendedStay: "Hindukush Heights Chitral, Kalash indigenous guest homes",
    highlights: [
      "Three Kalash valleys: Bumburet, Rumbur, and Birir",
      "Living pagan traditions, beaded headwear, and music festivals",
      "Chitral Shahi Mosque & Royal Fort on the Kunar River",
      "Views of Tirich Mir (7,708 m Hindu Kush monarch)",
      "Traditional handmade Chitrali patti wool crafts"
    ],
    stayType: "Cultural eco-lodges, boutique hillside inns & authentic homestays",
    transportType: "Rugged 4x4 vehicles for narrow Hindu Kush valley roads",
    overview: "The mystical Kalash indigenous culture nestled beneath Tirich Mir in the deep Hindu Kush."
  },
  {
    id: "neelum",
    name: "Neelum Valley",
    region: "Azad Kashmir",
    altitude: "1,600 m to 2,400 m (Ratti Gali: 3,700 m)",
    startingPricePKR: 55000,
    duration: "3 to 5 days",
    days: 4,
    bestSeason: "May to October (Ratti Gali Lake accessible July–September)",
    recommendedStay: "River-facing wooden guest lodges in Keran, Kutton, or Sharda",
    highlights: [
      "Turquoise Ratti Gali alpine glacial lake trek",
      "Sharda Peeth ancient 6th-century temple academy",
      "Arang Kel panoramic 'Pearl of Neelum' hilltop village",
      "Lush emerald Kutton Jagran river water cascades",
      "Scenic views across the Line of Control at Keran"
    ],
    stayType: "Charming riverside wooden lodges, forest rest houses & alpine glamping",
    transportType: "Saloon/coaster up to Keran; mountain 4x4 jeeps for upper passes & lakes",
    overview: "Verdant Kashmir river valleys, roaring mountain waters, walnut orchards, and sapphire alpine lakes."
  },
  {
    id: "lahore",
    name: "Lahore Cultural Heartland",
    region: "Punjab",
    altitude: "217 m",
    startingPricePKR: 45000,
    duration: "2 to 3 days",
    days: 3,
    bestSeason: "October to March (Pleasant mild winters)",
    recommendedStay: "Heritage boutique suites near Walled City, Pearl Continental, Faletti's",
    highlights: [
      "Walled City private heritage walks (Delhi Gate, Shahi Hammam)",
      "Badshahi Mosque & Lahore Fort (UNESCO World Heritage)",
      "Wazir Khan Mosque intricate fresco masterworks",
      "Famous night street dining at Haveli Food Street & Gawalmandi",
      "Wagah Border flag-lowering ceremonial experience"
    ],
    stayType: "Historic luxury colonial hotels and curated boutique suites",
    transportType: "Private air-conditioned chauffeured executive car",
    overview: "The cultural soul of Pakistan, renowned for 1,000 years of Mughal majesty, poetic heritage, and peerless street cuisine."
  },
  {
    id: "gwadar",
    name: "Gwadar & Makran Coastal",
    region: "Balochistan",
    altitude: "Sea level",
    startingPricePKR: 70000,
    duration: "3 to 4 days",
    days: 3,
    bestSeason: "November to March (Mild warm coastal breezes)",
    recommendedStay: "Gwadar Business Center Hotel, Zaver Pearl Continental Gwadar",
    highlights: [
      "Makran Coastal Highway road trip (N-10)",
      "Princess of Hope & Hingol National Park natural rock sphinx",
      "Kund Malir Golden Beach & turquoise Arabian Sea waves",
      "Hammerhead Peninsula sunset at Koh-e-Batil",
      "Traditional Gwadar dhow boat building yards"
    ],
    stayType: "Modern coastal sea-view hotels & beachfront safari tents",
    transportType: "Executive coastal tour coach / 4x4 SUV along Makran Coastal Highway",
    overview: "Where dramatic desert rock spires plunge straight into the turquoise Arabian Sea."
  }
];

export const VERIFIED_TRAVEL_STYLES: TravelStyleKnowledge[] = [
  {
    id: "karakoram",
    title: "High Karakoram Expeditions",
    description: "Iconic alpine journeys across Hunza, Passu, and Skardu with luxury mountain resorts.",
    startingCostPKR: 125000,
    duration: "7 to 10 days"
  },
  {
    id: "cultural",
    title: "Cultural Heartland & Heritage",
    description: "Mughal Lahore, Gandhara Buddhist ruins in Swat, and mystical Kalash tribes.",
    startingCostPKR: 75000,
    duration: "5 to 7 days"
  },
  {
    id: "alpine-trekking",
    title: "Wilderness & Alpine Trekking",
    description: "Fairy Meadows, Nanga Parbat base camp, and Ratti Gali glacial lakes.",
    startingCostPKR: 85000,
    duration: "5 to 6 days"
  },
  {
    id: "coastal",
    title: "Coastal Solitude & Deserts",
    description: "Makran Coastal Highway, Hingol rock formations, and serene Gwadar beaches.",
    startingCostPKR: 70000,
    duration: "3 to 4 days"
  }
];

export const BUDGET_TIERS: BudgetTierKnowledge[] = [
  {
    tier: "Economy",
    approxPerDayPKR: 14000,
    description: "Clean verified local guest houses, shared transport or standard car, essential guided visits.",
    typicalStay: "Comfortable verified family guest houses & budget hotels with hot water and Wi-Fi."
  },
  {
    tier: "Comfort",
    approxPerDayPKR: 22000,
    description: "Quality 3-4 star scenic hotels, private 4x4 or Prado, dedicated local route guide, quality dining.",
    typicalStay: "High-rated valley view hotels, riverside lodges, boutique scenic stays."
  },
  {
    tier: "Premium",
    approxPerDayPKR: 34000,
    description: "Top regional luxury resorts (e.g., Serena, Luxus), premium 4x4 Prado, verified senior mountain guide.",
    typicalStay: "Heritage palaces (Shigar/Khaplu), Serena resorts, lakeview suites."
  },
  {
    tier: "Luxury",
    approxPerDayPKR: 55000,
    description: "VIP private expedition, premier suites, personal expedition architect, VIP permits, bespoke gastronomy.",
    typicalStay: "Presidential suites, private chalets, glamping with bespoke amenities."
  }
];

export const STRICT_GUARDRAIL_RULES = `
=== ANTI-HALLUCINATION & FACTUAL GUARDRAILS ===
1. STARTING PRICES ARE TOUR PACKAGES ONLY:
   - Starting prices listed (e.g. Hunza from 95,000 PKR, Swat from 65,000 PKR) are comprehensive tour packages (including private vehicle/driver, quality stays, route guide, and itinerary management).
   - NEVER quote these starting prices as the cost of an individual bus, train, or flight ticket.

2. STANDALONE TRANSPORT TICKETS (FLIGHTS, BUSES, TRAINS):
   - You DO NOT have live bus, train, or flight ticket prices in the database.
   - If a user asks for ticket fares (e.g. "What is the PIA flight ticket to Skardu?", "Daewoo bus ticket to Swat?"):
     Explicitly state that standalone ticket fares fluctuate dynamically and require live booking through the airline (PIA/Airblue) or bus company (Daewoo/Faisal Movers). Offer to connect them with Tariq on WhatsApp to arrange flights or private transfers as part of their customized package.

3. HOTEL AVAILABILITY & LIVE ROOM RATES:
   - Specific hotel room inventory fluctuates daily by season.
   - Explain that exact dates and room categories are verified directly with the property partners upon inquiry.

4. REAL BOOKING PROCEDURE:
   - Step 1: Inquire or generate a customized itinerary based on days, budget, and travel style.
   - Step 2: Review estimated costing and day-by-day plan.
   - Step 3: Tap 'Chat with Tariq on WhatsApp' to confirm dates, vehicle selection, hotel availability, and finalize booking.
   - No payment or card numbers are collected in the chat.

5. ACCENT & TONE:
   - Persona: Senior AI Travel Assistant for "Venture Pakistan".
   - Welcoming, deeply knowledgeable, honest, mountain-savvy, and respectful.
   - Support English, Urdu, and Roman Urdu fluently.
`;
