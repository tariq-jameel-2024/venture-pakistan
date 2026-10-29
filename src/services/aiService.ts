import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlannerInput, GeneratedTrip, generateMockItinerary, getDestination } from "../data/travel";

const apiKey = process.env.VITE_GEMINI_API_KEY || (typeof import.meta !== "undefined" && (import.meta as any).env ? (import.meta as any).env.VITE_GEMINI_API_KEY : "");
const ai = new GoogleGenAI({ apiKey });

const dayPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    day: { type: Type.INTEGER, description: "Day number, e.g. 1" },
    title: { type: Type.STRING, description: "Short, catchy title for the day" },
    morning: { type: Type.STRING, description: "Morning activities" },
    afternoon: { type: Type.STRING, description: "Afternoon activities" },
    evening: { type: Type.STRING, description: "Evening activities" },
    dining: { type: Type.STRING, description: "Dining recommendations" },
    stayNote: { type: Type.STRING, nullable: true, description: "Optional note about accommodation for the night" },
  },
  required: ["day", "title", "morning", "afternoon", "evening", "dining"],
};

const budgetBreakdownSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transport: { type: Type.INTEGER, description: "Transport cost in PKR" },
    accommodation: { type: Type.INTEGER, description: "Accommodation cost in PKR" },
    activities: { type: Type.INTEGER, description: "Activities cost in PKR" },
    food: { type: Type.INTEGER, description: "Food cost in PKR" },
    guide: { type: Type.INTEGER, description: "Guide cost in PKR" },
    total: { type: Type.INTEGER, description: "Total cost in PKR" },
  },
  required: ["transport", "accommodation", "activities", "food", "guide", "total"],
};

const generatedTripSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    destinationId: { type: Type.STRING },
    destination: { type: Type.STRING },
    region: { type: Type.STRING },
    createdAt: { type: Type.STRING },
    duration: { type: Type.INTEGER },
    travelers: { type: Type.INTEGER },
    budget: { type: Type.STRING },
    travelStyle: { type: Type.STRING },
    pace: { type: Type.STRING },
    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
    itinerary: { type: Type.ARRAY, items: dayPlanSchema },
    costing: budgetBreakdownSchema,
    insiderNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    packing: { type: Type.ARRAY, items: { type: Type.STRING } },
    bestTime: { type: Type.STRING },
    travelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    status: { type: Type.STRING, enum: ["Planning", "Ready to Book", "Confirmed"] },
  },
  required: [
    "id", "destinationId", "destination", "region", "createdAt", "duration", 
    "travelers", "budget", "travelStyle", "pace", "interests", "itinerary", 
    "costing", "insiderNotes", "packing", "bestTime", "travelTips", "status"
  ],
};

export async function generateAITrip(input: PlannerInput): Promise<GeneratedTrip> {
  if (!apiKey) {
    console.warn("No Gemini API key found. Falling back to mock generator.");
    return generateMockItinerary(input);
  }

  try {
    const dest = getDestination(input.destinationId);
    
    const prompt = `You are Tariq, a Karakoram Route Architect & Verified Mountain Guide of Pakistan.
Your job is to curate a highly personalized, practical, and breathtaking itinerary for a user visiting Pakistan.
They want to visit: ${dest.name} (${dest.region}).
Duration: ${input.days} days
Travelers: ${input.travelers}
Budget tier: ${input.budget}
Pace: ${input.pace}
Travel Style: ${input.travelStyle}
Key Interests: ${input.interests.join(", ")}

Generate a complete itinerary adhering to the exact JSON schema provided.
Use realistic costs in PKR.
Make sure the tone is knowledgeable, welcoming, and highlights hidden gems.
The starting price for this destination is usually around ${dest.startingPrice} PKR per person, adjust based on budget, travelers, and days.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: generatedTripSchema,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const trip = JSON.parse(response.text) as GeneratedTrip;
    
    // Ensure IDs and metadata are solid
    trip.id = `trip_ai_${Date.now().toString(36)}`;
    trip.destinationId = dest.id;
    trip.destination = dest.name;
    trip.region = dest.region;
    trip.createdAt = new Date().toISOString();
    trip.duration = input.days;
    trip.travelers = input.travelers;
    trip.budget = input.budget;
    trip.travelStyle = input.travelStyle;
    trip.pace = input.pace;
    trip.interests = input.interests;
    trip.status = "Planning";

    return trip;
  } catch (error) {
    console.error("AI Generation failed:", error);
    console.warn("Falling back to mock generator.");
    return generateMockItinerary(input);
  }
}
