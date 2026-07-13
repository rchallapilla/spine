import Anthropic from "@anthropic-ai/sdk";
import { getLlmProvider } from "@/lib/env";
import { LOG_DAY_TOOL } from "@/lib/prompts";

const PARSER_MODEL = "claude-haiku-4-5-20251001";
const COACH_MODEL = "claude-sonnet-4-6";
const TIMEOUT_MS = 15_000;

// Direct Anthropic by default; OpenRouter's Anthropic-compatible endpoint
// when OPENROUTER_API_KEY is set (its "Anthropic skin" accepts the same
// Messages API requests, including tool use, and maps model IDs).
function getClient() {
  const { apiKey, baseURL } = getLlmProvider();
  return new Anthropic({ apiKey, baseURL });
}

// 15s timeout and one retry per the project rules. Each attempt gets its own
// AbortController so the retry is not born already-aborted.
async function withTimeoutAndRetry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const attempt = async (): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fn(controller.signal);
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    return await attempt();
  } catch {
    return attempt();
  }
}

export async function parseQuickLog(system: string, userMessage: string) {
  const client = getClient();

  const response = await withTimeoutAndRetry((signal) =>
    client.messages.create(
      {
        model: PARSER_MODEL,
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: userMessage }],
        tools: [LOG_DAY_TOOL],
        tool_choice: { type: "tool", name: LOG_DAY_TOOL.name },
      },
      { signal },
    ),
  );

  const block = response.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("No structured output from parser");
  }

  return block.input;
}

export async function generateCoachReport(system: string, userMessage: string) {
  const client = getClient();

  const response = await withTimeoutAndRetry((signal) =>
    client.messages.create(
      {
        model: COACH_MODEL,
        max_tokens: 2000,
        system,
        messages: [{ role: "user", content: userMessage }],
      },
      { signal },
    ),
  );

  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n");
}
