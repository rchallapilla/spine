export function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is not set");
  return url;
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("SUPABASE_ANON_KEY is not set");
  return key;
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return key;
}

export function getAnthropicApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  return key;
}

// If OPENROUTER_API_KEY is set, LLM calls route through OpenRouter's
// Anthropic-compatible endpoint instead of the Anthropic API directly.
export function getLlmProvider(): { apiKey: string; baseURL?: string } {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    return { apiKey: openRouterKey, baseURL: "https://openrouter.ai/api" };
  }
  return { apiKey: getAnthropicApiKey() };
}

export function getCronSecret(): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not set");
  return secret;
}
