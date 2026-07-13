// Temporary smoke test: verifies OpenRouter's Anthropic-compatible endpoint
// with the exact call shapes the app uses (forced tool use + plain text).
// Run: node --env-file=.env.local scripts/test-openrouter.mjs
import Anthropic from "@anthropic-ai/sdk";

const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error("FAIL: OPENROUTER_API_KEY not set");
  process.exit(1);
}

const client = new Anthropic({
  baseURL: "https://openrouter.ai/api",
  apiKey: key,
});

// Mirrors the quick-log parse: Haiku + forced tool_choice.
const TEST_TOOL = {
  name: "log_day",
  description: "Record structured daily log values.",
  input_schema: {
    type: "object",
    properties: {
      back_score: { type: "number" },
      sleep_hours: { type: "number" },
      walks: { type: "number" },
    },
  },
};

async function testParser() {
  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: "Extract daily log values from the user's text using the tool.",
    messages: [{ role: "user", content: "2 walks, back 3, slept 8h" }],
    tools: [TEST_TOOL],
    tool_choice: { type: "tool", name: TEST_TOOL.name },
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block) throw new Error("no tool_use block returned");
  console.log("PASS parser (haiku, tool use):", JSON.stringify(block.input));
}

async function testCoach() {
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 60,
    system: "Reply with exactly one short sentence.",
    messages: [{ role: "user", content: "Say hello in five words or fewer." }],
  });
  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  if (!text.trim()) throw new Error("no text returned");
  console.log("PASS coach (sonnet, text):", text.trim());
}

try {
  await testParser();
  await testCoach();
  console.log("All OpenRouter checks passed.");
} catch (err) {
  console.error("FAIL:", err.message ?? err);
  process.exit(1);
}
