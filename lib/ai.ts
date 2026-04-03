/**
 * Unified AI Service for PulseKit.
 * Supports Groq, Mistral, and OpenRouter through OpenAI-compatible interfaces.
 * All keys are strictly server-side.
 */

import { type AiMessage, type AiProvider } from "@/types";

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
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
    ],
  },
  mistral: {
    baseUrl: "https://api.mistral.ai/v1/chat/completions",
    apiKey: process.env.MISTRAL_API_KEY,
    models: [
      "mistral-large-latest",
      "mistral-small-latest",
      "open-mixtral-8x22b",
    ],
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env.OPENROUTER_API_KEY,
    models: [
      "openai/gpt-4o",
      "anthropic/claude-3.5-sonnet",
      "anthropic/claude-3-5-haiku",
      "google/gemini-2.5-flash",
      "x-ai/grok-2-1212",
      "meta-llama/llama-3.3-70b-instruct",
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-nemo:free",
      "qwen/qwen-2.5-coder-32b-instruct:free",
    ],
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
  
  const attempt = async (prov: AiProvider, targetModel?: string) => {
    const config = PROVIDER_CONFIG[prov];
    if (!config.apiKey) {
      throw new Error(`API Key for ${prov} is missing. Please check your environment variables.`);
    }

    const modelsToTry = targetModel ? [targetModel] : config.models;
    let lastError: unknown;

    for (const currentModel of modelsToTry) {
      try {
        const response = await fetch(config.baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
            ...(prov === "openrouter" ? { "HTTP-Referer": "https://pulsekit.ai", "X-Title": "PulseKit" } : {}),
          },
          body: JSON.stringify({
            model: currentModel,
            messages,
            max_tokens,
            temperature,
            stream,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Invalid API Key for ${prov}: ${errorData.error?.message || response.statusText}`);
          }
          if (response.status === 429 || response.status >= 500) {
            throw new Error(`RATE_LIMIT_OR_DOWN:${response.status}`);
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Failed to communicate with ${prov} using ${currentModel}`);
        }

        return response;
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Model ${currentModel} on ${prov} failed: ${err instanceof Error ? err.message : String(err)}. Trying next...`);
        if (err instanceof Error && err.message.startsWith("Invalid API Key for")) {
          throw err; // Stop trying other models on this provider if auth is bad
        }
      }
    }

    throw lastError || new Error(`All models failed for provider ${prov}`);
  };

  const fallbackQueue: AiProvider[] = ["groq", "openrouter", "mistral"].filter(p => p !== provider) as AiProvider[];

  try {
    return await attempt(provider, model);
  } catch (error: unknown) {
    console.warn(`Primary provider (${provider}) failed: ${error instanceof Error ? error.message : String(error)}. Attempting fallbacks...`);
    
    for (const fallback of fallbackQueue) {
      try {
        console.warn(`Trying fallback provider: ${fallback}...`);
        return await attempt(fallback);
      } catch (fallbackError: unknown) {
        console.warn(`Fallback (${fallback}) failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
        // Continue to the next fallback provider in the queue
      }
    }

    throw new Error(`All AI providers failed. Primary error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
