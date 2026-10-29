import { GoogleGenAI } from "@google/genai";
import { TravelService } from "./travelService";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatAction {
  type: "plan" | "view" | "whatsapp";
  payload: string;
  label: string;
  url?: string;
}

export interface ChatResponse {
  message: string;
  actions: ChatAction[];
}

export class AIService {
  private static getApiKey(): string {
    return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
  }

  private static getModelName(): string {
    return process.env.GEMINI_MODEL || "gemini-3.5-flash";
  }

  /**
   * Parse action tags from AI output, e.g. [ACTION:PLAN:hunza] or [ACTION:WHATSAPP:Hunza Valley]
   */
  private static parseActions(rawText: string): { cleanText: string; actions: ChatAction[] } {
    const actions: ChatAction[] = [];
    const actionRegex = /\[ACTION:(PLAN|VIEW|WHATSAPP):([^\]]+)\]/gi;

    let match: RegExpExecArray | null;
    while ((match = actionRegex.exec(rawText)) !== null) {
      const type = match[1].toLowerCase() as "plan" | "view" | "whatsapp";
      const payload = match[2].trim();

      if (type === "plan") {
        const dest = TravelService.findDestination(payload);
        actions.push({
          type: "plan",
          payload: dest ? dest.id : payload.toLowerCase(),
          label: `Plan ${dest ? dest.name : payload} Trip`
        });
      } else if (type === "view") {
        const dest = TravelService.findDestination(payload);
        actions.push({
          type: "view",
          payload: dest ? dest.id : payload.toLowerCase(),
          label: `Explore ${dest ? dest.name : payload}`
        });
      } else if (type === "whatsapp") {
        const inquiryMsg = TravelService.buildInquiryMessage({ destination: payload });
        const waUrl = TravelService.buildWhatsAppUrl(inquiryMsg);
        actions.push({
          type: "whatsapp",
          payload,
          label: `Inquire on WhatsApp`,
          url: waUrl
        });
      }
    }

    // Strip raw action tags from the user-facing text
    const cleanText = rawText.replace(actionRegex, "").trim();
    return { cleanText, actions };
  }

  /**
   * Generate an AI travel response with strict grounded travel knowledge
   */
  static async generateChatResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error("GEMINI_API_NOT_CONFIGURED");
    }

    // Limit conversation history to the last 8 messages to prevent context overflow
    const recentMessages = messages.slice(-8);

    // Format messages for Google GenAI SDK
    // The SDK accepts contents as array of { role: 'user' | 'model', parts: [{ text }] }
    const formattedContents = recentMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const ai = new GoogleGenAI({ apiKey });
    const model = this.getModelName();
    const systemInstruction = TravelService.getSystemKnowledgeContext();

    try {
      const response = await ai.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 950,
        },
      });

      const responseText = response.text || "";
      if (!responseText.trim()) {
        throw new Error("EMPTY_RESPONSE_FROM_AI");
      }

      const { cleanText, actions } = this.parseActions(responseText);
      return {
        message: cleanText,
        actions,
      };
    } catch (error: any) {
      // Re-throw identifiable errors
      if (error?.message?.includes("API_KEY_INVALID") || error?.status === 400 || error?.status === 403) {
        throw new Error("GEMINI_API_KEY_INVALID");
      }
      throw error;
    }
  }
}
