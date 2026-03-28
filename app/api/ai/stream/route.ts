import { NextRequest } from "next/server";
import { generateAiResponse, type AiMessage, type AiProvider } from "@/lib/ai";

/**
 * SSE (Server-Sent Events) route for AI streaming.
 * Securely proxies requests to the selected provider.
 */

export const runtime = "edge";

interface RequestBody {
  prompt: string;
  systemPrompt?: string;
  provider: AiProvider;
  model: string;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemPrompt, provider, model } = await req.json() as RequestBody;

    const messages: AiMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await generateAiResponse({
      provider: provider as AiProvider,
      model,
      messages,
      stream: true,
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("AI Stream API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
