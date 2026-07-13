import { useMemo, useState } from "react";
import { MODELS, computeMonthlyCost, fmtUSD, type Model, type Scenario } from "../lib/lci-data";

export function ForecastSection({ scenario, selected }: { scenario: Scenario; selected: Model }) {
  const [growth, setGrowth] = useState(15);
  const [priceDrift, setPriceDrift] = useState(0);
  const [horizon, setHorizon] = useState(12);

  const points = useMemo(() => {
    const base = computeMonthlyCost(selected, scenario).monthlyCost;
    const cheapest = MODELS
      .map((m) => computeMonthlyCost(m, scenario).monthlyCost)
      .reduce((a, b) => Math.min(a, b), Infinity);

    return Array.from({ length: horizon + 1 }, (_, i) => {
      const g = Math.pow(1 + growth / 100, i);
      const p = 1 + (priceDrift / 100) * (i / horizon);
      return { month: i, current: base * g * p, cheapest: cheapest * g * p };
    });
  }, [selected, scenario, growth, priceDrift, horizon]);

  const max = Math.max(...points.map((p) => p.current), 1);
  const width = 720; const height = 240; const pad = 32;
  const x = (i: number) => pad + (i / horizon) * (width - pad * 2);
  const y = (v: number) => height - pad - (v / max) * (height - pad * 2);

  const linePath = (key: "current" | "cheapest") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p[key])}`).join(" ");
  const areaPath =
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.current)}`).join(" ") +
    " " + points.slice().reverse().map((p, i) => `L ${x(horizon - i)} ${y(p.cheapest)}`).join(" ") + " Z";

  const totalCurrent = points.reduce((s, p) => s + p.current, 0);
  const totalCheapest = points.reduce((s, p) => s + p.cheapest, 0);

  return (
    <section id="forecast" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Step 03 · Forecast"
        title="Stress-test the budget"
        blurb="Pull growth and price-drift levers. Shaded area is the savings vs the cheapest routing option."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="panel p-6">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Monthly cost forecast">
            <defs>
              <linearGradient id="savingsFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-savings)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-savings)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
              <line key={i} x1={pad} x2={width - pad} y1={pad + f * (height - pad * 2)} y2={pad + f * (height - pad * 2)}
                stroke="var(--color-border)" strokeDasharray="2 4" />
            ))}
            <path d={areaPath} fill="url(#savingsFill)" />
            <path d={linePath("cheapest")} fill="none" stroke="var(--color-savings)" strokeWidth={2} />
            <path d={linePath("current")} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} />
            <text x={width - pad} y={y(points[points.length - 1].current) - 8} textAnchor="end"
              fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-mono)">
              {fmtUSD(points[points.length - 1].current)}/mo
            </text>
            <text x={width - pad} y={y(points[points.length - 1].cheapest) + 14} textAnchor="end"
              fill="var(--color-savings)" fontSize="11" fontFamily="var(--font-mono)">
              {fmtUSD(points[points.length - 1].cheapest)}/mo
            </text>
          </svg>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Month 0</span>
            <span>Month {horizon}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <Legend color="var(--color-accent)" label={`${selected.name} (current)`} />
            <Legend color="var(--color-savings)" label="Cheapest routing option" />
          </div>
        </div>

        <div className="panel space-y-5 p-6">
          <ForecastSlider label={`Traffic growth · ${growth}%/mo`} min={0} max={40} value={growth} onChange={setGrowth} />
          <ForecastSlider label={`Price drift · ${priceDrift > 0 ? "+" : ""}${priceDrift}% over horizon`} min={-30} max={30} value={priceDrift} onChange={setPriceDrift} />
          <ForecastSlider label={`Horizon · ${horizon} months`} min={3} max={24} value={horizon} onChange={setHorizon} />

          <div className="mt-4 border-t border-border/60 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total on {selected.name.split(" ")[0]}</span><span className="num font-semibold">{fmtUSD(totalCurrent)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total on cheapest</span><span className="num font-semibold text-savings">{fmtUSD(totalCheapest)}</span></div>
            <div className="mt-2 flex justify-between border-t border-border/60 pt-2">
              <span className="text-muted-foreground">Savings headroom</span>
              <span className="num font-semibold text-savings">{fmtUSD(totalCurrent - totalCheapest)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForecastSlider({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (n: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      </div>
      <input
        type="range" min={min} max={max} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="lci-slider"
        style={{ ["--_p" as string]: `${pct}%` }}
      />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2 w-4 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

function SectionHead({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <div className="max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-muted-foreground">{blurb}</p>
    </div>
  );
}
