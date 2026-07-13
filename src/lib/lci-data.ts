export type Provider =
  | "anthropic" | "openai" | "google" | "mistral" | "xai" | "deepseek";

export interface Model {
  id: string;
  provider: Provider;
  name: string;
  tier: "Flagship" | "Balanced" | "Efficient";
  tag: string;
  inputPrice: number;  // $ per 1M input tokens
  outputPrice: number; // $ per 1M output tokens
  cachedPrice?: number; // $ per 1M cached input tokens
  context: number; // tokens
  bestFor: string;
  pricingUrl: string;
  verified: string; // ISO date
}

export const PROVIDERS: Record<Provider, { label: string; color: string; url: string }> = {
  anthropic: { label: "Anthropic", color: "var(--color-provider-anthropic)", url: "https://www.anthropic.com/pricing" },
  openai: { label: "OpenAI", color: "var(--color-provider-openai)", url: "https://openai.com/api/pricing/" },
  google: { label: "Google", color: "var(--color-provider-google)", url: "https://ai.google.dev/pricing" },
  mistral: { label: "Mistral", color: "var(--color-provider-mistral)", url: "https://mistral.ai/pricing" },
  xai: { label: "xAI", color: "var(--color-provider-xai)", url: "https://x.ai/api" },
  deepseek: { label: "DeepSeek", color: "var(--color-provider-deepseek)", url: "https://api-docs.deepseek.com/quick_start/pricing" },
};

export const MODELS: Model[] = [
  { id: "claude-opus-4", provider: "anthropic", name: "Claude Opus 4", tier: "Flagship", tag: "Premium reasoning",
    inputPrice: 15, outputPrice: 75, cachedPrice: 1.5, context: 200_000,
    bestFor: "Complex agents and deep analysis",
    pricingUrl: "https://www.anthropic.com/pricing", verified: "2026-07-11" },
  { id: "claude-sonnet-4-5", provider: "anthropic", name: "Claude Sonnet 4.5", tier: "Balanced", tag: "Best default",
    inputPrice: 3, outputPrice: 15, cachedPrice: 0.3, context: 200_000,
    bestFor: "Support copilots, research, product assistants",
    pricingUrl: "https://www.anthropic.com/pricing", verified: "2026-07-11" },
  { id: "claude-haiku-4-5", provider: "anthropic", name: "Claude Haiku 4.5", tier: "Efficient", tag: "Fastest value",
    inputPrice: 1, outputPrice: 5, cachedPrice: 0.1, context: 200_000,
    bestFor: "Classification, short replies, high volume",
    pricingUrl: "https://www.anthropic.com/pricing", verified: "2026-07-11" },

  { id: "gpt-5", provider: "openai", name: "GPT-5", tier: "Flagship", tag: "Frontier",
    inputPrice: 5, outputPrice: 15, cachedPrice: 0.5, context: 400_000,
    bestFor: "Multi-step reasoning and coding",
    pricingUrl: "https://openai.com/api/pricing/", verified: "2026-07-11" },
  { id: "gpt-5-mini", provider: "openai", name: "GPT-5 mini", tier: "Balanced", tag: "Balanced",
    inputPrice: 0.25, outputPrice: 2, cachedPrice: 0.025, context: 400_000,
    bestFor: "General product features at scale",
    pricingUrl: "https://openai.com/api/pricing/", verified: "2026-07-11" },
  { id: "gpt-5-nano", provider: "openai", name: "GPT-5 nano", tier: "Efficient", tag: "Cheap",
    inputPrice: 0.05, outputPrice: 0.4, cachedPrice: 0.005, context: 256_000,
    bestFor: "Routing, extraction, guardrails",
    pricingUrl: "https://openai.com/api/pricing/", verified: "2026-07-11" },

  { id: "gemini-2-5-pro", provider: "google", name: "Gemini 2.5 Pro", tier: "Flagship", tag: "Long context",
    inputPrice: 1.25, outputPrice: 10, cachedPrice: 0.31, context: 2_000_000,
    bestFor: "Massive context, multimodal, planning",
    pricingUrl: "https://ai.google.dev/pricing", verified: "2026-07-11" },
  { id: "gemini-2-5-flash", provider: "google", name: "Gemini 2.5 Flash", tier: "Balanced", tag: "Fast general",
    inputPrice: 0.30, outputPrice: 2.50, cachedPrice: 0.075, context: 1_000_000,
    bestFor: "Real-time UX and lightweight agents",
    pricingUrl: "https://ai.google.dev/pricing", verified: "2026-07-11" },
  { id: "gemini-2-5-flash-lite", provider: "google", name: "Gemini 2.5 Flash-Lite", tier: "Efficient", tag: "Cheapest fit",
    inputPrice: 0.10, outputPrice: 0.40, cachedPrice: 0.025, context: 1_000_000,
    bestFor: "High-throughput classification and drafts",
    pricingUrl: "https://ai.google.dev/pricing", verified: "2026-07-11" },

  { id: "mistral-large-2", provider: "mistral", name: "Mistral Large 2", tier: "Flagship", tag: "EU-hosted",
    inputPrice: 2, outputPrice: 6, context: 128_000,
    bestFor: "European data residency workloads",
    pricingUrl: "https://mistral.ai/pricing", verified: "2026-07-11" },
  { id: "mistral-medium-3", provider: "mistral", name: "Mistral Medium 3", tier: "Balanced", tag: "Value",
    inputPrice: 0.40, outputPrice: 2, context: 128_000,
    bestFor: "Product features with cost pressure",
    pricingUrl: "https://mistral.ai/pricing", verified: "2026-07-11" },

  { id: "grok-4", provider: "xai", name: "Grok 4", tier: "Flagship", tag: "Realtime web",
    inputPrice: 3, outputPrice: 15, context: 256_000,
    bestFor: "Realtime signal and social context",
    pricingUrl: "https://x.ai/api", verified: "2026-07-11" },
  { id: "grok-4-mini", provider: "xai", name: "Grok 4 mini", tier: "Balanced", tag: "Balanced",
    inputPrice: 0.30, outputPrice: 1.5, context: 128_000,
    bestFor: "Fast lightweight tasks",
    pricingUrl: "https://x.ai/api", verified: "2026-07-11" },

  { id: "deepseek-v3", provider: "deepseek", name: "DeepSeek V3", tier: "Flagship", tag: "OSS-grade",
    inputPrice: 0.27, outputPrice: 1.10, cachedPrice: 0.07, context: 128_000,
    bestFor: "Bulk reasoning at a fraction of the cost",
    pricingUrl: "https://api-docs.deepseek.com/quick_start/pricing", verified: "2026-07-11" },
];

export interface Scenario {
  name: string;
  requestsPerDay: number;
  daysPerMonth: number;
  activeUsers: number;
  systemTokens: number;
  userTokens: number;
  retrievedTokens: number;
  toolTokens: number;
  cachedTokens: number;
  outputTokens: number;
  cachingEnabled: boolean;
}

export const PRESETS: Record<string, { label: string; blurb: string; scenario: Scenario }> = {
  support: {
    label: "Lean support copilot",
    blurb: "High volume, short answers, strong fit for caching.",
    scenario: {
      name: "Support copilot",
      requestsPerDay: 1200, daysPerMonth: 30, activeUsers: 400,
      systemTokens: 1400, userTokens: 900, retrievedTokens: 2200,
      toolTokens: 300, cachedTokens: 1400, outputTokens: 650,
      cachingEnabled: true,
    },
  },
  retrieval: {
    label: "Retrieval analyst",
    blurb: "Document-heavy prompts, long sessions, context dominates.",
    scenario: {
      name: "Retrieval analyst",
      requestsPerDay: 600, daysPerMonth: 22, activeUsers: 120,
      systemTokens: 800, userTokens: 600, retrievedTokens: 12000,
      toolTokens: 400, cachedTokens: 3000, outputTokens: 1200,
      cachingEnabled: true,
    },
  },
  generator: {
    label: "Content generator",
    blurb: "Output-heavy — every extra answer token counts.",
    scenario: {
      name: "Content generator",
      requestsPerDay: 400, daysPerMonth: 30, activeUsers: 80,
      systemTokens: 500, userTokens: 400, retrievedTokens: 800,
      toolTokens: 100, cachedTokens: 500, outputTokens: 3500,
      cachingEnabled: false,
    },
  },
};

export function computeMonthlyCost(model: Model, s: Scenario) {
  const totalInput = s.systemTokens + s.userTokens + s.retrievedTokens + s.toolTokens;
  const cached = s.cachingEnabled ? Math.min(s.cachedTokens, totalInput) : 0;
  const freshInput = Math.max(0, totalInput - cached);
  const cachedRate = model.cachedPrice ?? model.inputPrice;

  const perRequestCost =
    (freshInput / 1_000_000) * model.inputPrice +
    (cached / 1_000_000) * cachedRate +
    (s.outputTokens / 1_000_000) * model.outputPrice;

  const monthlyRequests = s.requestsPerDay * s.daysPerMonth;
  const monthlyCost = perRequestCost * monthlyRequests;
  const perThousand = perRequestCost * 1000;
  const perUser = s.activeUsers > 0 ? monthlyCost / s.activeUsers : 0;

  return {
    perRequestCost,
    perThousand,
    perUser,
    monthlyCost,
    monthlyRequests,
    tokensPerRequest: totalInput + s.outputTokens,
    outputShare: (s.outputTokens / (totalInput + s.outputTokens)) * 100,
    cacheableShare: totalInput > 0 ? (cached / totalInput) * 100 : 0,
  };
}

export function fmtUSD(n: number, digits = 0) {
  if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (n >= 10) return `$${n.toFixed(digits)}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

export function fmtInt(n: number) {
  // Locale-independent thousands separator to avoid SSR/CSR hydration mismatches.
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const FAQ_ITEMS = [
  {
    q: "How accurate is the pricing data?",
    a: "Every price is sourced directly from the provider's public pricing page and dated with a `last verified` marker. When a provider updates their rates we push a new commit — no scraping, no third-party datasets.",
  },
  {
    q: "Does the cost estimate include everything in my bill?",
    a: "No. It covers token economics only (input, cached input, and output). Retrieval APIs, tool calls, storage, egress and human review time are excluded on purpose — you should layer them in with real numbers when the workload is committed.",
  },
  {
    q: "How is prompt caching modeled?",
    a: "When caching is enabled we split your prompt into a cached prefix and a fresh remainder, then apply the provider's cached-read rate to the prefix. Providers without a published cached rate reuse the standard input rate.",
  },
  {
    q: "Can I compare models beyond the 14 shown?",
    a: "Yes — the catalog and formulas live in the public GitHub repo. Open a PR with the model, its pricing URL and a screenshot for verification.",
  },
  {
    q: "Do you store my scenario or share it with providers?",
    a: "No. Everything runs client-side. There is no backend, no analytics on your inputs, and no request ever leaves your browser.",
  },
];
