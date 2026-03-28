import { NextRequest, NextResponse } from "next/server";
import { generateAiResponse, type AiMessage, type AiProvider } from "@/lib/ai";

/**
 * JSON response route for one-shot AI calls.
 * Extracts the content string from the AI provider's response envelope,
 * then JSON.parses it before returning to the client.
 */

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemPrompt, provider, model } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const messages: AiMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await generateAiResponse({
      provider: provider as AiProvider,
      model,
      messages,
      stream: false,
    });

    // Providers return OpenAI-compatible envelope: { choices: [{ message: { content: "..." } }] }
    const envelope = await response.json() as {
      choices: { message: { content: string } }[];
    };

    const content = envelope?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI returned an empty response." }, { status: 502 });
    }

    // The content is expected to be a raw JSON string. Parse it.
    // Strip markdown code fences if the model wrapped the JSON in ```json ... ```
    const stripped = content
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(stripped);
      return NextResponse.json(parsed);
    } catch {
      // If we cannot parse, return the raw content so the client can surface the issue
      return NextResponse.json(
        { error: "AI response was not valid JSON.", raw: stripped },
        { status: 422 }
      );
    }
  } catch (error: unknown) {
    console.error("AI JSON API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
