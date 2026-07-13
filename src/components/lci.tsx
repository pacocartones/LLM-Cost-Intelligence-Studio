import { useEffect, useMemo, useState } from "react";
import {
  MODELS, PROVIDERS, PRESETS, computeMonthlyCost, fmtUSD, fmtInt,
  type Model, type Provider, type Scenario,
} from "../lib/lci-data";

/* -------------------------------- HEADER --------------------------------- */

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[0.7rem] font-bold text-accent-foreground"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--savings))" }}
          >
            LCI
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">LLM Cost Intelligence Studio</div>
            <div className="hidden text-xs text-muted-foreground sm:block">Verified pricing · workload modeling</div>
          </div>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          <a href="#plan" className="hover:text-foreground">Plan</a>
          <a href="#compare" className="hover:text-foreground">Compare</a>
          <a href="#forecast" className="hover:text-foreground">Forecast</a>
          <a href="#catalog" className="hover:text-foreground">Catalog</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a
          href="https://github.com/pacocartones/llm-cost-intelligence-studio"
          target="_blank" rel="noreferrer"
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}

/* -------------------------- STICKY PROGRESS RAIL ------------------------- */

const STEPS = [
  { id: "plan", n: "01", label: "Describe workload" },
  { id: "compare", n: "02", label: "Compare models" },
  { id: "forecast", n: "03", label: "Forecast the bill" },
] as const;

export function ProgressRail({ active }: { active: string }) {
  return (
    <div className="sticky top-[57px] z-30 border-y border-border/50 bg-background/85 backdrop-blur sm:top-[68px]">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 text-sm sm:px-6 sm:py-3">
        {STEPS.map((s, i) => {
          const isActive = active === s.id;
          return (
            <div key={s.id} className="flex shrink-0 items-center gap-2">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
                  isActive
                    ? "chip-active bg-accent/15 text-accent ring-1 ring-accent/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="num text-[0.7rem] opacity-70">{s.n}</span>
                <span className="font-medium">{s.label}</span>
              </a>
              {i < STEPS.length - 1 && <span aria-hidden className="h-px w-6 bg-border sm:w-8" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- HERO ---------------------------------- */

export function Hero({
  headline, memo, onCopyMemo, copyState,
}: {
  headline: { defaultModel: Model; cheapest: Model; monthly: number; floor: number; savings: number };
  memo: string;
  onCopyMemo: () => void;
  copyState: "idle" | "copied";
}) {
  return (
    <section id="top" className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div>
          <div className="eyebrow mb-4">Verified pricing · 6 providers · 14 models</div>
          <h1 className="text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
            Model realistic AI workloads{" "}
            <span className="gradient-savings-text">before you pick the model.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Skip vague token math. Describe your product shape, compare source-linked
            pricing across the frontier, and forecast the monthly bill with the
            confidence a finance review demands.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#plan"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110"
            >
              Start planning →
            </a>
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
            >
              Browse the catalog
            </a>
            <button
              onClick={onCopyMemo}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-savings hover:text-savings"
              aria-label="Copy executive memo to clipboard"
            >
              {copyState === "copied" ? "✓ Memo copied" : "Copy memo"}
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>✓ 6/6 providers verified</span>
            <span>✓ Source-linked pricing</span>
            <span>✓ Last refreshed 2026-07-11</span>
            <span>✓ Token economics only — no marketing math</span>
          </div>
        </div>

        {/* Executive brief card */}
        <aside className="panel-accent p-6" aria-label="Executive brief">
          <div className="eyebrow">Executive brief</div>
          <p className="mt-3 text-sm text-muted-foreground">
            One-paragraph memo you can paste into Slack.
          </p>
          <div className="mt-5 space-y-4 text-sm">
            <Row label="Current default" value={headline.defaultModel.name} sub={PROVIDERS[headline.defaultModel.provider].label} accent />
            <Row label="Monthly run-rate" value={fmtUSD(headline.monthly)} sub={`${fmtInt(headline.defaultModel ? 1200 : 0)} requests/day modeled`} />
            <Row label="Cheapest viable fit" value={headline.cheapest.name} sub={PROVIDERS[headline.cheapest.provider].label} savings />
            <Row label="Savings headroom" value={`${fmtUSD(headline.savings)}/mo`} sub="Switch or route to unlock" savings />
          </div>
          <details className="mt-5 rounded-lg border border-border/70 bg-surface-2/40 p-4 text-xs">
            <summary className="cursor-pointer text-muted-foreground">Preview memo text</summary>
            <pre className="mt-3 whitespace-pre-wrap font-mono text-[0.72rem] text-foreground/90">{memo}</pre>
          </details>
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value, sub, accent, savings }: { label: string; value: string; sub?: string; accent?: boolean; savings?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right">
        <span className={`block text-base font-semibold ${accent ? "text-accent" : ""} ${savings ? "text-savings" : ""}`}>
          {value}
        </span>
        {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
      </span>
    </div>
  );
}

/* -------------------------- STICKY COST FLYOUT --------------------------- */

export function StickyCostBar({
  visible, monthly, model, savings, cheapestName,
}: {
  visible: boolean; monthly: number; model: Model; savings: number; cheapestName: string;
}) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="slide-up pointer-events-auto flex flex-wrap items-center gap-3 rounded-full border border-border/70 bg-background/90 px-4 py-2.5 shadow-float backdrop-blur-xl sm:gap-5 sm:px-6">
        <div className="flex items-baseline gap-2">
          <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Run-rate</span>
          <span className="num text-base font-bold sm:text-lg">{fmtUSD(monthly)}<span className="ml-1 text-xs font-normal text-muted-foreground">/mo</span></span>
          <span className="hidden text-xs text-muted-foreground sm:inline">· {model.name}</span>
        </div>
        {savings > 0 && (
          <>
            <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-baseline gap-2">
              <span className="text-[0.65rem] uppercase tracking-wider text-savings">Save</span>
              <span className="num text-sm font-semibold text-savings">{fmtUSD(savings)}/mo</span>
              <span className="hidden text-xs text-muted-foreground md:inline">→ {cheapestName}</span>
            </div>
          </>
        )}
        <a href="#compare" className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground hover:brightness-110">Compare →</a>
      </div>
    </div>
  );
}

/* --------------------------------- PLAN ---------------------------------- */

export function PlanSection({
  scenario, setScenario, selected, setSelected, activePreset, setActivePreset,
}: {
  scenario: Scenario; setScenario: (s: Scenario) => void;
  selected: Model; setSelected: (m: Model) => void;
  activePreset: string; setActivePreset: (k: string) => void;
}) {
  const result = useMemo(() => computeMonthlyCost(selected, scenario), [selected, scenario]);
  const cheapest = useMemo(() => {
    return MODELS
      .map((m) => ({ m, cost: computeMonthlyCost(m, scenario).monthlyCost }))
      .sort((a, b) => a.cost - b.cost)[0];
  }, [scenario]);

  const update = (patch: Partial<Scenario>) => {
    setActivePreset("custom");
    setScenario({ ...scenario, ...patch });
  };

  return (
    <section id="plan" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Step 01 · Plan"
        title="Describe your workload"
        blurb="Every input recalculates the run-rate live. Start from a preset, then tune."
      />

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Workload presets">
        {Object.entries(PRESETS).map(([key, p]) => {
          const isActive = activePreset === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => { setActivePreset(key); setScenario(p.scenario); }}
              className={`group rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-accent bg-accent/12 text-accent"
                  : "border-border text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              <span className="font-medium">{p.label}</span>
              <span className={`ml-2 text-xs ${isActive ? "text-accent/80" : "text-muted-foreground group-hover:text-accent/80"}`}>{p.blurb}</span>
            </button>
          );
        })}
        {activePreset === "custom" && (
          <span className="pill"><span className="h-1.5 w-1.5 rounded-full bg-savings" /> Custom scenario</span>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* INPUTS */}
        <div className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Scenario inputs</h3>
            <span className="pill"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live recalculation</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Slider label="Requests per day" min={50} max={20000} step={50}
              value={scenario.requestsPerDay}
              onChange={(v) => update({ requestsPerDay: v })}
              format={fmtInt}
              hint="First lever to stress before changing model." />
            <Slider label="Active users" min={10} max={5000} step={10}
              value={scenario.activeUsers} onChange={(v) => update({ activeUsers: v })}
              format={fmtInt}
              hint="Drives per-user economics and pricing tiers." />
            <Slider label="System tokens" min={0} max={5000} step={50}
              value={scenario.systemTokens} onChange={(v) => update({ systemTokens: v })} format={fmtInt}
              hint="Static instructions prepended to every prompt." />
            <Slider label="User tokens" min={0} max={5000} step={50}
              value={scenario.userTokens} onChange={(v) => update({ userTokens: v })} format={fmtInt}
              hint="What the user types or the app assembles per turn." />
            <Slider label="Retrieved context" min={0} max={30000} step={100}
              value={scenario.retrievedTokens} onChange={(v) => update({ retrievedTokens: v })}
              format={fmtInt}
              hint="Biggest hidden driver on RAG-heavy products." />
            <Slider label="Output tokens" min={0} max={8000} step={50}
              value={scenario.outputTokens} onChange={(v) => update({ outputTokens: v })}
              format={fmtInt}
              hint="Usually the fastest lever when spend drifts up." />
            <Slider label="Cached prefix tokens" min={0} max={10000} step={100}
              value={scenario.cachedTokens} onChange={(v) => update({ cachedTokens: v })} format={fmtInt}
              hint="Portion of the prompt reused across requests." />
            <Slider label="Tool / overhead tokens" min={0} max={3000} step={50}
              value={scenario.toolTokens} onChange={(v) => update({ toolTokens: v })} format={fmtInt}
              hint="Function calls, JSON schemas, retries." />
          </div>

          <label className="mt-6 flex items-center gap-3 rounded-lg border border-border/70 bg-surface-2/40 p-3 text-sm">
            <input
              type="checkbox" checked={scenario.cachingEnabled}
              onChange={(e) => update({ cachingEnabled: e.target.checked })}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span>
              Assume prompt caching is enabled ·{" "}
              <span className="text-muted-foreground">
                Applies each provider's cached-read rate to the cached prefix.
              </span>
            </span>
          </label>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Active model
              <select
                value={selected.id}
                onChange={(e) => setSelected(MODELS.find((m) => m.id === e.target.value)!)}
                className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground hover:border-accent focus:border-accent"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {PROVIDERS[m.provider].label} · {m.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={() => setSelected(cheapest.m)}
              className="mt-auto rounded-lg border border-savings/60 bg-savings/10 px-3 py-2 text-xs font-semibold text-savings hover:bg-savings/20"
            >
              ⚡ Switch to cheapest fit ({cheapest.m.name})
            </button>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="space-y-4">
          <div className="panel-accent p-6">
            <div className="eyebrow">Live run-rate</div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <span className="num text-4xl font-bold text-foreground sm:text-5xl">
                {fmtUSD(result.monthlyCost)}
                <span className="ml-2 text-base font-normal text-muted-foreground">/mo</span>
              </span>
              <BudgetPressure value={budgetPressureScore(result.monthlyCost)} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Cost / 1k requests" value={fmtUSD(result.perThousand)} />
              <Stat label="Cost / active user" value={fmtUSD(result.perUser)} />
              <Stat label="Monthly requests" value={fmtInt(Math.round(result.monthlyRequests))} />
              <Stat label="Output share" value={`${result.outputShare.toFixed(0)}%`} />
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow">Cheapest fit for this scenario</div>
                <div className="mt-2 text-xl font-semibold text-savings">{cheapest.m.name}</div>
                <div className="text-xs text-muted-foreground">{PROVIDERS[cheapest.m.provider].label}</div>
              </div>
              <div className="text-right">
                <div className="num text-2xl font-bold">{fmtUSD(cheapest.cost)}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                <div className="text-xs text-savings">
                  Save {fmtUSD(Math.max(0, result.monthlyCost - cheapest.cost))}/mo vs {selected.name.split(" ")[0]}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-2/40 p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Modeling boundary.</strong> Token economics only.
            Retrieval APIs, tool calls, storage and egress are not included — layer them in when the workload is committed.
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, min, max, step, value, onChange, format, hint }: {
  label: string; min: number; max: number; step: number; value: number;
  onChange: (n: number) => void; format: (n: number) => string; hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
          {label}
          {hint && (
            <span
              title={hint}
              aria-label={hint}
              className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full border border-border text-[0.55rem] text-muted-foreground hover:border-accent hover:text-accent"
            >i</span>
          )}
        </label>
        <span className="num text-sm font-semibold">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="lci-slider"
        style={{ ["--_p" as string]: `${pct}%` }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-surface-2/40 p-3">
      <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="num mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function budgetPressureScore(monthly: number) {
  if (monthly < 200) return { score: Math.round(monthly / 4), label: "Healthy", tone: "ok" as const };
  if (monthly < 2000) return { score: 25 + Math.round((monthly - 200) / 25), label: "Watch", tone: "warn" as const };
  return { score: Math.min(99, 75 + Math.round((monthly - 2000) / 200)), label: "Tight", tone: "danger" as const };
}
function BudgetPressure({ value }: { value: { score: number; label: string; tone: "ok" | "warn" | "danger" } }) {
  const color = value.tone === "ok" ? "text-accent" : value.tone === "warn" ? "text-warn" : "text-danger";
  const dot   = value.tone === "ok" ? "bg-accent" : value.tone === "warn" ? "bg-warn" : "bg-danger";
  return (
    <div className="text-right">
      <div className={`flex items-center justify-end gap-1.5 text-xs uppercase tracking-wider ${color}`}>
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        Budget · {value.label}
      </div>
      <div className="num text-sm text-muted-foreground">{value.score}/100</div>
    </div>
  );
}

/* -------------------------------- COMPARE -------------------------------- */

export function CompareSection({ scenario, pinned, setPinned, selectedId, setSelected }: {
  scenario: Scenario; pinned: string[]; setPinned: (ids: string[]) => void;
  selectedId: string; setSelected: (m: Model) => void;
}) {
  const rows = MODELS
    .map((m) => ({ m, r: computeMonthlyCost(m, scenario) }))
    .sort((a, b) => a.r.monthlyCost - b.r.monthlyCost);
  const cheapest = rows[0].r.monthlyCost;

  const toggle = (id: string) => {
    if (pinned.includes(id)) setPinned(pinned.filter((x) => x !== id));
    else if (pinned.length < 4) setPinned([...pinned, id]);
  };

  const ordered = [...rows].sort(
    (a, b) => Number(pinned.includes(b.m.id)) - Number(pinned.includes(a.m.id))
  );

  return (
    <section id="compare" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Step 02 · Compare"
        title="Every model, priced against your workload"
        blurb="Pin up to 4 to keep them at the top. Sorted by monthly cost for the current scenario."
      />

      {/* DESKTOP TABLE */}
      <div className="panel mt-8 hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3 text-right">In / Out $/M</th>
                <th className="px-4 py-3 text-right">$/1k req</th>
                <th className="px-4 py-3 text-right">Monthly</th>
                <th className="px-4 py-3 text-right">vs cheapest</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {ordered.map(({ m, r }) => {
                const delta = r.monthlyCost - cheapest;
                const isPinned = pinned.includes(m.id);
                const isSelected = selectedId === m.id;
                return (
                  <tr key={m.id} className={`border-b border-border/40 last:border-b-0 ${isSelected ? "bg-accent/[0.08]" : isPinned ? "bg-accent/[0.04]" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(m)} className="text-left hover:text-accent" title="Set as active model">
                        <div className="flex items-center gap-2 font-medium">
                          {isSelected && <span aria-label="Active" title="Active model" className="h-1.5 w-1.5 rounded-full bg-accent" />}
                          {m.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.tier} · {m.tag}</div>
                      </button>
                    </td>
                    <td className="px-4 py-3"><ProviderBadge p={m.provider} /></td>
                    <td className="num px-4 py-3 text-right">${m.inputPrice} / ${m.outputPrice}</td>
                    <td className="num px-4 py-3 text-right">{fmtUSD(r.perThousand)}</td>
                    <td className="num px-4 py-3 text-right font-semibold">{fmtUSD(r.monthlyCost)}</td>
                    <td className={`num px-4 py-3 text-right ${delta === 0 ? "text-savings" : "text-muted-foreground"}`}>
                      {delta === 0 ? "★ cheapest" : `+${fmtUSD(delta)}`}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.bestFor}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggle(m.id)}
                        aria-pressed={isPinned}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          isPinned
                            ? "border-accent text-accent"
                            : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                        }`}
                      >
                        {isPinned ? "✓ Pinned" : "Pin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="mt-8 grid gap-3 md:hidden">
        {ordered.map(({ m, r }) => {
          const delta = r.monthlyCost - cheapest;
          const isPinned = pinned.includes(m.id);
          const isSelected = selectedId === m.id;
          return (
            <article key={m.id} className={`panel p-4 ${isSelected ? "border-accent/60" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button onClick={() => setSelected(m)} className="text-left">
                    <div className="flex items-center gap-2 font-semibold">
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                      {m.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.tier} · {m.tag}</div>
                  </button>
                </div>
                <ProviderBadge p={m.provider} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <MiniCell label="In/Out" value={`$${m.inputPrice}/${m.outputPrice}`} />
                <MiniCell label="$/1k" value={fmtUSD(r.perThousand)} />
                <MiniCell label="Monthly" value={fmtUSD(r.monthlyCost)} strong />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={delta === 0 ? "text-savings" : "text-muted-foreground"}>
                  {delta === 0 ? "★ cheapest" : `+${fmtUSD(delta)} vs cheapest`}
                </span>
                <button
                  onClick={() => toggle(m.id)}
                  className={`rounded-full border px-3 py-1 ${isPinned ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
                >
                  {isPinned ? "✓ Pinned" : "Pin"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MiniCell({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface-2/40 p-2">
      <div className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`num mt-0.5 ${strong ? "text-sm font-bold" : "text-xs font-semibold"}`}>{value}</div>
    </div>
  );
}

function ProviderBadge({ p }: { p: Provider }) {
  const info = PROVIDERS[p];
  return (
    <a
      href={info.url} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border/60 px-2.5 py-1 text-xs hover:border-accent"
      title={`Pricing source: ${info.url}`}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: info.color }} />
      {info.label}
    </a>
  );
}

/* --------------------------------- SHARED -------------------------------- */


/* --------------------------------- SHARED -------------------------------- */

function SectionHead({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <div className="max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-muted-foreground">{blurb}</p>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} LLM Cost Intelligence Studio · Data verified 2026-07-11 · Built by <a href="https://github.com/pacocartones" target="_blank" rel="noreferrer" className="hover:text-foreground">@pacocartones</a>.</div>
        <div className="flex flex-wrap gap-4">
          <a href="https://github.com/pacocartones/llm-cost-intelligence-studio" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="#methodology" className="hover:text-foreground">Methodology</a>
          <a href="#catalog" className="hover:text-foreground">Catalog</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------- COPY-TO-CLIPBOARD HOOK ----------------------- */

export function useClipboard() {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      /* ignore */
    }
  };
  return { state, copy };
}

export function useScrollPastHero(threshold = 600) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return past;
}
