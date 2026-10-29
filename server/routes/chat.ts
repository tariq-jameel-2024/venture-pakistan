import { Router, Request, Response } from "express";
import { AIService, ChatMessage } from "../services/aiService";

export const chatRouter = Router();

// Validation helper
function validateMessages(messages: any): { valid: boolean; error?: string; cleanMessages?: ChatMessage[] } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: "The 'messages' field must be a non-empty array of chat messages." };
  }

  const cleanMessages: ChatMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const item = messages[i];
    if (!item || typeof item !== "object") {
      return { valid: false, error: `Message at index ${i} is not a valid object.` };
    }

    if (item.role !== "user" && item.role !== "assistant") {
      return { valid: false, error: `Invalid role at message index ${i}. Role must be 'user' or 'assistant'.` };
    }

    if (typeof item.content !== "string" || !item.content.trim()) {
      return { valid: false, error: `Message content at index ${i} must be a non-empty string.` };
    }

    if (item.content.length > 2000) {
      return { valid: false, error: `Message at index ${i} exceeds maximum length of 2000 characters.` };
    }

    cleanMessages.push({
      role: item.role,
      content: item.content.trim(),
    });
  }

  // Ensure the latest message is from the user
  const lastMessage = cleanMessages[cleanMessages.length - 1];
  if (lastMessage.role !== "user") {
    return { valid: false, error: "The last message in the conversation must be from the user." };
  }

  return { valid: true, cleanMessages };
}

/**
 * POST /api/chat
 * Handles real-time traveler queries
 */
chatRouter.post("/", async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const { valid, error, cleanMessages } = validateMessages(req.body?.messages);

    if (!valid || !cleanMessages) {
      return res.status(400).json({
        success: false,
        error: error || "Invalid chat request format.",
      });
    }

    const userPromptPreview = cleanMessages[cleanMessages.length - 1].content.slice(0, 60);
    console.log(`[Chat API] Received query: "${userPromptPreview}..." (${cleanMessages.length} total messages)`);

    // Call AI Service
    const aiResponse = await AIService.generateChatResponse(cleanMessages);
    const duration = Date.now() - startTime;
    console.log(`[Chat API] Response generated in ${duration}ms with ${aiResponse.actions.length} action(s).`);

    return res.status(200).json({
      success: true,
      message: aiResponse.message,
      actions: aiResponse.actions,
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`[Chat API] Error after ${duration}ms:`, err?.message || err);

    if (err?.message === "GEMINI_API_NOT_CONFIGURED") {
      return res.status(503).json({
        success: false,
        error: "AI service is currently not configured on the server. Please set the GEMINI_API_KEY environment variable.",
        code: "API_KEY_MISSING",
      });
    }

    if (err?.message === "GEMINI_API_KEY_INVALID") {
      return res.status(502).json({
        success: false,
        error: "The configured Gemini API key is invalid or unauthorized. Please verify your credentials.",
        code: "API_KEY_INVALID",
      });
    }

    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while generating the travel response. Please try again or chat with Tariq directly.",
      code: "AI_GENERATION_FAILED",
    });
  }
});
