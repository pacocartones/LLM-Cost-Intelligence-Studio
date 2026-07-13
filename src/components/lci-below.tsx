import { useState } from "react";
import { MODELS, PROVIDERS, FAQ_ITEMS, type Provider } from "../lib/lci-data";

/* --------------------------------- CATALOG ------------------------------- */

export function CatalogSection() {
  const [filter, setFilter] = useState<Provider | "all">("all");
  const grouped = filter === "all" ? MODELS : MODELS.filter((m) => m.provider === filter);

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Catalog"
        title="14 models across 6 providers · every price source-linked"
        blurb="Filter by provider. Each row links to the vendor's official pricing page."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All providers</FilterChip>
        {(Object.keys(PROVIDERS) as Provider[]).map((p) => (
          <FilterChip key={p} active={filter === p} onClick={() => setFilter(p)}>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: PROVIDERS[p].color }} />
            {PROVIDERS[p].label}
          </FilterChip>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {grouped.map((m) => {
          const info = PROVIDERS[m.provider];
          return (
            <article key={m.id} className="panel flex flex-col p-5 transition hover:border-accent/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{m.name}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">{m.tier} · {m.tag}</div>
                </div>
                <a href={info.url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 px-2.5 py-1 text-xs hover:border-accent">
                  <span className="h-2 w-2 rounded-full" style={{ background: info.color }} />
                  {info.label}
                </a>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{m.bestFor}.</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <MetaCell label="Input" value={`$${m.inputPrice}/M`} />
                <MetaCell label="Output" value={`$${m.outputPrice}/M`} />
                <MetaCell label="Context" value={`${(m.context / 1000).toLocaleString()}k`} />
              </dl>
              <div className="mt-auto flex items-center justify-between pt-4 text-[0.7rem] text-muted-foreground">
                <span>verified {m.verified}</span>
                <a href={m.pricingUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">Source ↗</a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:text-foreground"
      }`}>
      {children}
    </button>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface-2/40 p-2">
      <div className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="num text-sm font-semibold">{value}</div>
    </div>
  );
}

/* -------------------------------- METHODOLOGY ---------------------------- */

export function MethodologySection() {
  return (
    <section id="methodology" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Methodology"
        title="How the numbers are built"
        blurb="Transparent enough that a finance review can rebuild them in a spreadsheet."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MethodCard title="Source-linked pricing" body="Every price ships with a link to the vendor's official page and a `last verified` date. Refresh cadence is tracked per provider — no scraped or crowd-sourced data." />
        <MethodCard title="Per-request formula" body="cost = (fresh_input × in_rate + cached × cached_rate + output × out_rate) / 1M. Multiplied by requests/day × days/month for the run-rate." />
        <MethodCard title="What is excluded" body="Retrieval APIs, tool calls, storage, egress and human-in-the-loop time. Layer them in when the workload is committed — token economics are only the first cut." />
      </div>
      <div className="mt-8 rounded-xl border border-border/70 bg-surface-2/40 p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Open source.</strong> Data catalog and formulas live in the{" "}
        <a href="https://github.com/pacocartones/llm-cost-intelligence-studio" target="_blank" rel="noreferrer" className="text-accent underline">
          GitHub repo
        </a>. PRs to add a provider are welcome — include the pricing source URL and a screenshot for verification.
      </div>
    </section>
  );
}

function MethodCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

/* ----------------------------------- FAQ --------------------------------- */

export function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="FAQ"
        title="Common questions"
        blurb="If your finance team asks it, it probably lives here."
      />
      <div className="mt-8 divide-y divide-border/60 rounded-xl border border-border/70 bg-surface/40">
        {FAQ_ITEMS.map((item, i) => (
          <details key={i} className="group p-5 open:bg-surface-2/30">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-foreground list-none">
              {item.q}
              <span aria-hidden className="text-muted-foreground transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

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
