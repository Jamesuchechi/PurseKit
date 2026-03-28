/**
 * Unified AI Service for PulseKit.
 * Supports Groq, Mistral, and OpenRouter through OpenAI-compatible interfaces.
 * All keys are strictly server-side.
 */

export type AiProvider = "groq" | "mistral" | "openrouter";

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiOptions {
  provider?: AiProvider;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  messages: AiMessage[];
  stream?: boolean;
}

const PROVIDER_CONFIG = {
  groq: {
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.GROQ_API_KEY,
    defaultModel: "llama-3.3-70b-versatile",
  },
  mistral: {
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    apiKey: process.env.MISTRAL_API_KEY,
    defaultModel: "mistral-large-latest",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultModel: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
};

/**
 * Unified generation function.
 * Proxies requests to the appropriate provider.
 */
export async function generateAiResponse({
  provider = "groq",
  model,
  max_tokens = 4096,
  temperature = 0.7,
  messages,
  stream = false,
}: AiOptions) {
  const config = PROVIDER_CONFIG[provider];
  
  if (!config.apiKey) {
    throw new Error(`API Key for ${provider} is missing. Please check your environment variables.`);
  }

  const response = await fetch(config.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      ...(provider === "openrouter" ? { "HTTP-Referer": "https://pulsekit.ai", "X-Title": "PulseKit" } : {}),
    },
    body: JSON.stringify({
      model: model || config.defaultModel,
      messages,
      max_tokens,
      temperature,
      stream,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`AI Provider (${provider}) Error:`, errorData);
    throw new Error(errorData.error?.message || `Failed to communicate with ${provider}`);
  }

  return response;
}
