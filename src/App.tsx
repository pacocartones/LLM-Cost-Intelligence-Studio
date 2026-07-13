import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  SiteHeader,
  ProgressRail,
  Hero,
  PlanSection,
  StickyCostBar,
  CompareSection,
  SiteFooter,
  useClipboard,
  useScrollPastHero,
} from "./components/lci";
import {
  MODELS,
  PROVIDERS,
  PRESETS,
  computeMonthlyCost,
  fmtUSD,
  type Model,
  type Scenario,
} from "./lib/lci-data";

// Below-the-fold sections are code-split — they only ship once the user scrolls.
const ForecastSection = lazy(() =>
  import("./components/lci-forecast").then((m) => ({ default: m.ForecastSection })),
);
const CatalogSection = lazy(() =>
  import("./components/lci-below").then((m) => ({ default: m.CatalogSection })),
);
const MethodologySection = lazy(() =>
  import("./components/lci-below").then((m) => ({ default: m.MethodologySection })),
);
const FAQSection = lazy(() =>
  import("./components/lci-below").then((m) => ({ default: m.FAQSection })),
);

const SectionFallback = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
    <div className="h-8 w-64 animate-pulse rounded-md bg-surface-2/50" />
    <div className="mt-6 h-64 animate-pulse rounded-xl bg-surface-2/30" />
  </div>
);

export default function App() {
  const [activePreset, setActivePreset] = useState<string>("support");
  const [scenario, setScenario] = useState<Scenario>(PRESETS.support.scenario);
  const [selected, setSelected] = useState<Model>(
    MODELS.find((m) => m.id === "claude-sonnet-4-5") ?? MODELS[0],
  );
  const [pinned, setPinned] = useState<string[]>([
    "claude-sonnet-4-5",
    "gemini-2-5-flash-lite",
    "gpt-5-mini",
  ]);
  const [activeStep, setActiveStep] = useState<string>("plan");
  const { state: copyState, copy } = useClipboard();
  const scrolledPastHero = useScrollPastHero(700);

  useEffect(() => {
    const ids = ["plan", "compare", "forecast"];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveStep(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const idle = (cb: () => void) =>
      w.requestIdleCallback ? w.requestIdleCallback(cb) : window.setTimeout(cb, 1500);
    idle(() => {
      void import("./components/lci-forecast");
      void import("./components/lci-below");
    });
  }, []);

  const headline = useMemo(() => {
    const current = computeMonthlyCost(selected, scenario);
    const ranked = MODELS.map((m) => ({
      m,
      cost: computeMonthlyCost(m, scenario).monthlyCost,
    })).sort((a, b) => a.cost - b.cost);
    const cheapest = ranked[0];
    return {
      defaultModel: selected,
      cheapest: cheapest.m,
      monthly: current.monthlyCost,
      floor: cheapest.cost,
      savings: Math.max(0, current.monthlyCost - cheapest.cost),
    };
  }, [selected, scenario]);

  const memo = useMemo(() => {
    return [
      `# LLM cost memo — ${scenario.name}`,
      ``,
      `**Current default:** ${selected.name} (${PROVIDERS[selected.provider].label})`,
      `**Modeled run-rate:** ${fmtUSD(headline.monthly)}/mo at ${scenario.requestsPerDay.toLocaleString()} req/day`,
      `**Cheapest fit:** ${headline.cheapest.name} at ${fmtUSD(headline.floor)}/mo`,
      `**Savings headroom:** ${fmtUSD(headline.savings)}/mo by switching or routing`,
      ``,
      `_Source: LLM Cost Intelligence Studio · verified 2026-07-11._`,
    ].join("\n");
  }, [headline, scenario, selected]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <ProgressRail active={activeStep} />
      <main>
        <Hero
          headline={headline}
          memo={memo}
          onCopyMemo={() => copy(memo)}
          copyState={copyState}
        />
        <PlanSection
          scenario={scenario}
          setScenario={setScenario}
          selected={selected}
          setSelected={setSelected}
          activePreset={activePreset}
          setActivePreset={setActivePreset}
        />
        <CompareSection
          scenario={scenario}
          pinned={pinned}
          setPinned={setPinned}
          selectedId={selected.id}
          setSelected={setSelected}
        />
        <Suspense fallback={<SectionFallback />}>
          <ForecastSection scenario={scenario} selected={selected} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CatalogSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <MethodologySection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQSection />
        </Suspense>
      </main>
      <StickyCostBar
        visible={scrolledPastHero}
        monthly={headline.monthly}
        model={selected}
        savings={headline.savings}
        cheapestName={headline.cheapest.name}
      />
      <SiteFooter />
    </div>
  );
}
