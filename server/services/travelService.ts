import {
  BUSINESS_CONFIG,
  VERIFIED_DESTINATIONS,
  VERIFIED_TRAVEL_STYLES,
  BUDGET_TIERS,
  STRICT_GUARDRAIL_RULES,
  VerifiedDestination
} from "../data/travelKnowledge";

export class TravelService {
  /**
   * Search for a destination by query string (matches name, region, or id)
   */
  static findDestination(query: string): VerifiedDestination | undefined {
    const q = query.toLowerCase().trim();
    return VERIFIED_DESTINATIONS.find(
      (d) =>
        d.id.toLowerCase() === q ||
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
    );
  }

  /**
   * Get all verified destinations
   */
  static getAllDestinations(): VerifiedDestination[] {
    return VERIFIED_DESTINATIONS;
  }

  /**
   * Formats a clean summary of destinations for user queries
   */
  static getDestinationsSummary(): string {
    return VERIFIED_DESTINATIONS.map(
      (d, i) =>
        `${i + 1}. **${d.name}** (${d.region}) — Starting from **PKR ${d.startingPricePKR.toLocaleString()}** (${d.duration}) · Best: ${d.bestSeason}`
    ).join("\n");
  }

  /**
   * Build WhatsApp URL with encoded message
   */
  static buildWhatsAppUrl(message: string): string {
    const cleanNumber = BUSINESS_CONFIG.whatsappNumber.replace(/\D/g, "");
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Build pre-filled inquiry text for WhatsApp
   */
  static buildInquiryMessage(details: {
    destination?: string;
    travelers?: number;
    days?: number;
    budget?: string;
    dates?: string;
  }): string {
    let msg = `Hello Venture Pakistan,\nI am inquiring via the Venture Pakistan AI Assistant regarding a trip across Pakistan.`;
    if (details.destination) msg += `\n- Destination: ${details.destination}`;
    if (details.days) msg += `\n- Duration: ${details.days} Days`;
    if (details.travelers) msg += `\n- Travelers: ${details.travelers}`;
    if (details.budget) msg += `\n- Budget Tier: ${details.budget}`;
    if (details.dates) msg += `\n- Approximate Dates: ${details.dates}`;
    msg += `\n\nPlease let me know available options, vehicle details, and current itinerary recommendations.`;
    return msg;
  }

  /**
   * Assemble the complete system instruction containing verified knowledge
   */
  static getSystemKnowledgeContext(): string {
    const destinationList = VERIFIED_DESTINATIONS.map((d) => `
- Destination: ${d.name} (ID: ${d.id})
  Region: ${d.region} | Altitude: ${d.altitude}
  Starting Package Price: PKR ${d.startingPricePKR.toLocaleString()} per person (Typical duration: ${d.duration}, ${d.days} days)
  Best Season: ${d.bestSeason}
  Key Highlights: ${d.highlights.join("; ")}
  Stay Style: ${d.stayType} (e.g. ${d.recommendedStay})
  Transport: ${d.transportType}
  Overview: ${d.overview}
`).join("\n");

    const travelStyles = VERIFIED_TRAVEL_STYLES.map(
      (s) => `- ${s.title}: ${s.description} (Starting from PKR ${s.startingCostPKR.toLocaleString()}, ${s.duration})`
    ).join("\n");

    const budgetTiers = BUDGET_TIERS.map(
      (b) => `- ${b.tier}: approx PKR ${b.approxPerDayPKR.toLocaleString()} / person / day. ${b.description} Stay: ${b.typicalStay}`
    ).join("\n");

    return `
You are the official Senior AI Travel Assistant for "Venture Pakistan" (https://venturepakistan.pk).
Founder & Lead Guide: Tariq (${BUSINESS_CONFIG.role}, ${BUSINESS_CONFIG.experience}).
WhatsApp: ${BUSINESS_CONFIG.formattedWhatsApp} (${BUSINESS_CONFIG.whatsappNumber})
Email: ${BUSINESS_CONFIG.email}

=== PLATFORM KNOWLEDGE BASE ===

VERIFIED DESTINATIONS & PACKAGE STARTING PRICES:
${destinationList}

VERIFIED TRAVEL STYLES:
${travelStyles}

VERIFIED BUDGET TIERS (ESTIMATED PER DAY):
${budgetTiers}

${STRICT_GUARDRAIL_RULES}

=== INTERACTIVE ACTION TAGS ===
When recommending a specific action, you can append special action tags at the VERY END of your response so the website renders interactive buttons.
Supported action tags:
- To prompt the user to open the trip planner for a destination: [ACTION:PLAN:destination_id] (e.g. [ACTION:PLAN:hunza])
- To prompt the user to view destination details: [ACTION:VIEW:destination_id] (e.g. [ACTION:VIEW:skardu])
- To provide a direct WhatsApp booking link with a pre-filled topic: [ACTION:WHATSAPP:Destination or Inquiry Topic] (e.g. [ACTION:WHATSAPP:Hunza Valley 5-Day Tour])

Only include relevant action tags when directly appropriate to the user's inquiry (maximum 2 action tags per reply).

=== FORMATTING GUIDELINES ===
- Use clear bullet points and bold formatting for easy reading.
- Keep responses friendly, mountain-expert, and concise. Avoid giant walls of text.
- If asked in Urdu or Roman Urdu (e.g. "Hunza janay ke lye kitnay paise chahiye?"), reply in fluent, respectful Roman Urdu or Urdu as requested.
- Always distinguish between full tour packages and individual transport tickets.
`;
  }
}
