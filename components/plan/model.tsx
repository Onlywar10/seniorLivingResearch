"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Chart, registerables, type Plugin } from "chart.js";
import { CONTENT as C } from "@/lib/plan/content";
import { runPlanChecks, MONTH_NAMES, PLAN_DEFAULTS, type Inputs, type ModelResult } from "@/lib/plan/model";
import { useModel } from "./model-state";
import { fmt$, fmtN } from "@/lib/plan/format";
import { SectionHead, Tag } from "./ui";
import { HiringPlanner } from "./hiring";
import { Explorer } from "./explorer";

Chart.register(...registerables);

type NumKey = Exclude<keyof Inputs, "catapultCovers" | "staged">;
type Control = { key: NumKey; label: string; min: number; max: number; step: number; f: (v: number) => string; why?: boolean };

const money = (v: number) => fmt$(v);
const count = (v: number) => fmtN(v);
const pctf = (v: number) => `${v}%`;

const GROUPS: { group: string; items: Control[] }[] = [
  { group: "Customers", items: [
    { key: "signed", label: "Paying communities signed by month 12", min: 20, max: 200, step: 1, f: count },
    { key: "alpha", label: "Alpha communities converting at month 1", min: 0, max: 30, step: 1, f: count },
    { key: "alphaMix", label: "Alpha share on Community Life (founding price)", min: 0, max: 100, step: 5, f: pctf },
    { key: "mix", label: "Share on Community Life (vs Website)", min: 0, max: 100, step: 5, f: pctf },
    { key: "churn", label: "Monthly churn", min: 0, max: 7, step: 0.5, f: pctf },
    { key: "perOrg", label: "Average communities per organisation", min: 1, max: 20, step: 1, f: count },
  ]},
  { group: "Prices", items: [
    { key: "websitePrice", label: "Website price", min: 199, max: 599, step: 10, f: money },
    { key: "clPrice", label: "Community Life price", min: 399, max: 999, step: 10, f: money },
    { key: "foundingPrice", label: "Alpha founding price (Community Life)", min: 349, max: 649, step: 10, f: money },
  ]},
  { group: "Costs (per month)", items: [
    { key: "runCost", label: "Running cost + card fees per community", min: 30, max: 120, step: 1, f: money },
    { key: "p1Fixed", label: "Build and alpha cost (Nov 2026 – Jun 2027)", min: 0, max: 10000, step: 100, f: money },
    { key: "otherFixed", label: "Tools, ads, trade shows and travel (from launch)", min: 0, max: 15000, step: 10, f: money },
    { key: "hubertPT", label: "Hubert part-time, until full-time", min: 0, max: 6000, step: 100, f: money },
    { key: "hubertFT", label: "Hubert full-time ($62k + taxes and health)", min: 3000, max: 12000, step: 100, f: money },
    { key: "salesCost", label: "Sales associate ($60k base + taxes and health)", min: 3000, max: 12000, step: 100, f: money },
    { key: "commission", label: "Sales commission on first-year contracts", min: 0, max: 20, step: 1, f: pctf },
    { key: "adam", label: "Adam’s monthly cost once paid", min: 0, max: 12000, step: 100, f: money },
    { key: "p3Fixed", label: "Phase 3 fixed cost (Year 2, Tim free for now)", min: 20000, max: 80000, step: 10, f: money },
  ]},
];

const INK = "#1d2422", ACC = "#2c6650", GREY = "#9aa29f", GRID = "#eceeec";
const X_LABELS = MONTH_NAMES.map((_, i) => `M${i + 1}`);
const be = (n: number) => (isFinite(n) ? fmtN(n) : "never");
const noSubscribe = () => () => {};
const subscribeResize = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); };

function Delta({ v, p, kind, betterHigh = true }: { v: number; p: number; kind: "n" | "$" | "pct"; betterHigh?: boolean }) {
  const diff = v - p;
  const eps = kind === "pct" ? 0.0005 : kind === "n" ? 0.05 : 1;
  if (Math.abs(diff) < eps || (!isFinite(v) && !isFinite(p))) return <span className="o-delta muted">same as plan</span>;
  const good = betterHigh ? diff > 0 : diff < 0;
  const txt = !isFinite(diff) ? "no break-even" : kind === "pct" ? `${diff > 0 ? "+" : "−"}${fmtN(Math.abs(diff) * 100, 1)} pts`
    : kind === "n" ? `${diff > 0 ? "+" : "−"}${fmtN(Math.abs(diff), Math.abs(diff) < 10 ? 1 : 0)}` : fmt$(diff, { k: true, plus: true });
  return <span className={`o-delta ${good ? "up" : "down"}`}>{txt} vs plan</span>;
}

// Creates the chart once, then pushes fresh data into it after every render.
function useChart(make: (canvas: HTMLCanvasElement) => Chart, update: (chart: Chart) => void) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);
  useEffect(() => {
    setDefaults();
    chart.current = make(ref.current!);
    return () => { chart.current?.destroy(); chart.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (chart.current) { update(chart.current); chart.current.update(); } });
  return ref;
}

type MarkedChart = Chart & { $markIndex?: number | null; $margins?: string[] };

const barLabels: Plugin = {
  id: "barLabels",
  afterDatasetsDraw(chart) {
    const m = (chart as MarkedChart).$margins || [];
    const c = chart.ctx;
    c.save(); c.font = `700 12px ${Chart.defaults.font.family}`; c.textAlign = "center";
    chart.getDatasetMeta(0).data.forEach((bar, i) => {
      const txt = m[i]; if (!txt) return;
      const other = chart.getDatasetMeta(1).data[i];
      c.fillStyle = txt.startsWith("−") ? "#dc2626" : INK;
      c.fillText(txt, (bar.x + other.x) / 2, Math.min(bar.y, other.y) - 8);
    });
    c.restore();
  },
};

const xTitle = (items: { dataIndex: number }[]) => `Month ${items[0].dataIndex + 1} · ${MONTH_NAMES[items[0].dataIndex]}`;
const scales = (yFmt: (v: number | string) => string | number) => ({
  x: { grid: { display: false }, border: { color: "#cfd3cf" }, ticks: { maxRotation: 0, autoSkip: true, autoSkipPadding: 6 } },
  y: { beginAtZero: true, grid: { color: GRID }, border: { display: false }, ticks: { callback: yFmt, maxTicksLimit: 6 } },
});
const k$ = (v: number | string) => `$${Number(v) / 1000}k`;

function setDefaults() {
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.font.size = 11;
  Chart.defaults.color = "#6b7471";
  (Chart.defaults.animation as { duration: number }).duration = 260;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.plugins.tooltip.backgroundColor = INK;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;
}

export function ModelSection() {
  const { state, setState, plan, r, changed, cashOpt, setCashOpt } = useModel();
  const isTest = useSyncExternalStore(noSubscribe, () => new URLSearchParams(location.search).has("test"), () => false);
  const test = useMemo(() => (isTest ? runPlanChecks() : null), [isTest]);
  const narrow = useSyncExternalStore(subscribeResize, () => window.innerWidth < 600, () => false);

  // ?test shows the plan reproduction checks above the outputs.
  useEffect(() => {
    if (test) console.log(`[plan-test] ${test.pass ? "PASS" : "FAIL"}`, test.checks);
  }, [test]);

  const c3Ref = useChart((cv) => new Chart(cv, { type: "bar", data: { labels: [], datasets: [
    { label: "Monthly revenue", data: [], backgroundColor: ACC, borderRadius: 4, maxBarThickness: 46 },
    { label: "Monthly cost", data: [], backgroundColor: "#c9cfcc", borderRadius: 4, maxBarThickness: 46 },
  ]}, options: { layout: { padding: { top: 22 } }, scales: scales(k$), plugins: { tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${fmt$(c.parsed.y ?? 0)}` } } } }, plugins: [barLabels] }),
  (ch) => {
    const short = ["Phase 1", "Break-even", "End of beta", "$1M ARR"];
    ch.data.labels = r.phases.map((p, i) => narrow ? [short[i], p.n ? `${fmtN(p.n)} comm.` : "cost only"] : p.n ? [p.name, `${fmtN(p.n)} communities`] : [p.name, "alpha is free"]);
    ch.data.datasets[0].data = r.phases.map((p) => p.revenue);
    ch.data.datasets[1].data = r.phases.map((p) => p.cost);
    (ch as MarkedChart).$margins = r.phases.map((p) => p.margin == null ? "Cost only" : `${p.margin < 0 ? "−" : ""}${fmtN(Math.abs(p.margin) * 100)}%`);
  });

  const set = (k: NumKey, v: number) => setState((s) => ({ ...s, [k]: v }));
  const cards = outputCards(r, plan, state);
  const readout = r.adamMonth
    ? `At these settings you cover every cost, Adam included, from about month ${r.adamMonth} (${MONTH_NAMES[r.adamMonth - 1]}), and finish Year 1 with about ${fmtN(r.paying12)} paying communities and ${fmt$(r.arr12, { k: true })} ARR at a ${fmtN(r.margin12 * 100)}% margin.`
    : r.result12 >= 0
      ? `At these settings revenue covers the team by month 12, but not Adam’s salary as well: that needs about ${be(r.breakEvenPost)} paying communities and Year 1 ends with ${fmtN(r.paying12)}.`
      : `At these settings Year 1 doesn’t cover its costs: month 12 still runs at ${fmt$(r.result12)} a month, and the year as a whole at ${fmt$(r.cumResult, { k: true })}.`;

  return (
    <section className="section" id="model" aria-labelledby="model-h">
        <div className="inner">
          <SectionHead id="model" title="Financial model" intro={C.model.intro} />
          <div className="model-wrap">
            <form className="inputs" aria-label="Model inputs" onSubmit={(e) => e.preventDefault()}>
              <div className="inputs-top">
                <h3>Your assumptions</h3>
                <button type="button" id="reset" className="btn" disabled={!changed} onClick={() => setState(PLAN_DEFAULTS)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7a4.5 4.5 0 1 0 1.4-3.3M2.5 1.8v2.4h2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Reset to plan
                </button>
              </div>
              {GROUPS.map((gr) => (
                <fieldset key={gr.group}>
                  <legend>{gr.group}</legend>
                  {gr.items.map((it) => <Slider key={it.key} it={it} value={state[it.key]} onChange={(v) => set(it.key, v)} />)}
                  {gr.group.startsWith("Costs") ? (
                    <label className="toggle">
                      <input type="checkbox" id="in-cover" checked={state.catapultCovers} onChange={(e) => setState((s) => ({ ...s, catapultCovers: e.target.checked }))} />
                      <span>{C.model.coverNote}<small>If off, adds $1,500 a month to fixed costs.</small></span>
                    </label>
                  ) : null}
                </fieldset>
              ))}
              <fieldset>
                <legend>Setup fees</legend>
                <label className="toggle">
                  <input type="checkbox" checked={cashOpt.includeSetup} onChange={(e) => setCashOpt((o) => ({ ...o, includeSetup: e.target.checked }))} />
                  <span>{C.monthly.setupLabel}<small>{C.monthly.setupNote}</small></span>
                </label>
                <label className={`toggle ${cashOpt.includeSetup ? "" : "off"}`}>
                  <input type="checkbox" checked={cashOpt.creditFirst10} disabled={!cashOpt.includeSetup} onChange={(e) => setCashOpt((o) => ({ ...o, creditFirst10: e.target.checked }))} />
                  <span>{C.monthly.creditLabel}<small>{C.monthly.creditNote}</small></span>
                </label>
              </fieldset>
            </form>
            <div className="outputs">
              {test ? (
                <div className="test-panel" role="status">
                  <h4>Plan reproduction test: {test.pass ? "PASS" : "FAIL"}</h4>
                  <ul>{test.checks.map((c) => <li key={c.name} className={c.pass ? "" : "fail"}>{c.pass ? "Pass" : "FAIL"} · {c.name} · got {typeof c.value === "number" ? (Math.abs(c.value) > 1000 ? fmt$(c.value) : fmtN(c.value, 2)) : String(c.value)}</li>)}</ul>
                </div>
              ) : null}
              <div className="out-grid" aria-live="polite">
                {cards.map((c) => (
                  <div className="out" key={c.label}>
                    <div className="o-label">{c.label}</div>
                    <div className="o-value num">{c.value}</div>
                    <div className="o-sub">{c.sub}</div>
                    {c.delta}
                  </div>
                ))}
              </div>
              <p id="readout" className={`readout ${r.adamMonth ? "" : "warn"}`}>{readout}</p>
              <HiringPlanner inputs={state} />
              <Explorer />
              <div className="charts">
                <figure className="chart wide" style={{ margin: 0 }}>
                  <h4>Operating margin by phase <Tag k="derived" /></h4>
                  <p className="c-note">Phase 1 is cost only (Catapult). Break-even at {be(r.breakEvenPost)} communities; end of beta at $600k ARR; spin-out at $1M ARR on the Phase 3 cost of {fmt$(state.p3Fixed + (state.catapultCovers ? 0 : 1500))} a month. Average price {fmt$(r.avgPrice)}.</p>
                  <div className="legend"><span><i style={{ background: ACC }} />Monthly revenue</span><span><i style={{ background: "#c9cfcc" }} />Monthly cost</span></div>
                  <div className="canvas-box"><canvas ref={c3Ref} role="img" aria-label="Bar chart of revenue and cost at four milestones, with operating margin" /></div>
                </figure>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

export function ScenariosSection() {
  const { state, sc } = useModel();
  return (
    <section className="section" id="scenarios" aria-labelledby="scenarios-h">
      <div className="inner">
        <SectionHead id="scenarios" title="Scenarios: slow, expected, fast" intro={C.scenarios.intro} />
        <div className="scen-wrap">
          <div className="table-wrap"><ScenarioTable sc={sc} churn={state.churn} /></div>
          <ScenarioChart sc={sc} />
        </div>
        <div className="reading">{C.scenarios.reading.map((t) => <p key={t}>{t}</p>)}</div>
        <p className="share">{C.scenarios.share} <Tag k="derived" /></p>
      </div>
    </section>
  );
}

function ScenarioChart({ sc }: { sc: { s: number; r: ModelResult }[] }) {
  const ref = useChart((cv) => new Chart(cv, { type: "line", data: { labels: X_LABELS, datasets: [
    { label: "Slow", data: [], borderColor: GREY, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, tension: .25 },
    { label: "Expected", data: [], borderColor: ACC, pointRadius: 0, pointHoverRadius: 4, borderWidth: 3, tension: .25 },
    { label: "Fast", data: [], borderColor: INK, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, tension: .25 },
    { label: "Break-even before Adam", data: [], borderColor: "#b6bcb9", borderDash: [5, 5], pointRadius: 0, borderWidth: 1.2 },
    { label: "Break-even with Adam", data: [], borderColor: "#6b7471", borderDash: [5, 5], pointRadius: 0, borderWidth: 1.2 },
  ]}, options: { interaction: { mode: "index", intersect: false }, scales: scales((v) => v), plugins: { tooltip: { callbacks: { title: xTitle, label: (c) => ` ${c.dataset.label}: ${fmtN(c.parsed.y ?? 0)}` } } } } }),
  (ch) => {
    sc.forEach((x, i) => { ch.data.datasets[i].data = x.r.months.map((m) => m.paying); });
    ch.data.datasets[3].data = X_LABELS.map(() => (isFinite(sc[1].r.breakEvenPre) ? sc[1].r.breakEvenPre : null));
    ch.data.datasets[4].data = X_LABELS.map(() => (isFinite(sc[1].r.breakEvenPost) ? sc[1].r.breakEvenPost : null));
  });

  return (
    <figure className="chart" style={{ margin: 0 }}>
      <h4>Paying communities by month</h4>
      <div className="legend"><span><i style={{ background: GREY }} />Slow</span><span><i style={{ background: ACC }} />Expected</span><span><i style={{ background: INK }} />Fast</span><span><i className="dash" style={{ color: "#6b7471" }} />Break-even lines</span></div>
      <div className="canvas-box"><canvas ref={ref} role="img" aria-label="Paying communities by month for the slow, expected and fast cases" /></div>
    </figure>
  );
}

function Slider({ it, value, onChange }: { it: Control; value: number; onChange: (v: number) => void }) {
  const d = PLAN_DEFAULTS[it.key];
  const planPos = (d - it.min) / (it.max - it.min);
  const fill = ((value - it.min) / (it.max - it.min)) * 100;
  return (
    <div className="ctl">
      <div className="ctl-top">
        <label htmlFor={`in-${it.key}`}>{it.label}</label>
        <output htmlFor={`in-${it.key}`} className={value !== d ? "changed" : ""}>{it.f(value)}</output>
      </div>
      <div className="range">
        <input type="range" id={`in-${it.key}`} min={it.min} max={it.max} step={it.step} value={value}
          aria-describedby={`sub-${it.key}`} aria-valuetext={it.f(value)}
          style={{ "--p": `${fill}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.target.value))} />
        <span className="plan-mark" style={{ left: `calc(9px + (100% - 18px) * ${planPos})` }} aria-hidden="true" />
      </div>
      <div className="ctl-sub" id={`sub-${it.key}`}><span>{it.f(it.min)}</span><span>plan {it.f(d)}</span><span>{it.f(it.max)}</span></div>
      {it.why ? (
        <details className="why">
          <summary>What’s in the $21,970?</summary>
          <table><tbody>{C.model.phase2Breakdown.map((row) => (
            <FragmentRows key={row[0]} row={row} />
          ))}</tbody></table>
        </details>
      ) : null}
    </div>
  );
}

function FragmentRows({ row }: { row: string[] }) {
  return (
    <>
      <tr><th scope="row">{row[0]}</th><td className="r num">{row[1]}</td></tr>
      {row[2] ? <tr><td colSpan={2} className="muted">{row[2]}</td></tr> : null}
    </>
  );
}

function outputCards(r: ModelResult, plan: ModelResult, state: Inputs) {
  const adamDelta = r.adamMonth && plan.adamMonth
    ? r.adamMonth === plan.adamMonth
      ? <span className="o-delta muted">same as plan</span>
      : <span className={`o-delta ${r.adamMonth < plan.adamMonth ? "up" : "down"}`}>{Math.abs(r.adamMonth - plan.adamMonth)} month{Math.abs(r.adamMonth - plan.adamMonth) > 1 ? "s" : ""} {r.adamMonth < plan.adamMonth ? "earlier" : "later"}</span>
    : r.adamMonth ? null : <span className="o-delta down">plan: month {plan.adamMonth}</span>;
  return [
    { label: "Paying communities at month 12", value: fmtN(r.paying12), sub: `${fmtN(state.signed)} signed, after churn`, delta: <Delta v={r.paying12} p={plan.paying12} kind="n" /> },
    { label: "ARR at month 12", value: fmt$(r.arr12, { k: true }), sub: `${fmt$(r.revenue12)} a month`, delta: <Delta v={r.arr12} p={plan.arr12} kind="$" /> },
    { label: "Monthly result at month 12", value: <span className={r.result12 < 0 ? "neg" : ""}>{fmt$(r.result12, { plus: true })}</span>, sub: `${fmtN(r.margin12 * 100)}% operating margin`, delta: <Delta v={r.result12} p={plan.result12} kind="$" /> },
    { label: "Break-even, Adam paid", value: <>{be(r.breakEvenPost)} <span className="o-sub">communities</span></>, sub: `${be(r.breakEvenPre)} before Adam is paid`, delta: <Delta v={r.breakEvenPost} p={plan.breakEvenPost} kind="n" betterHigh={false} /> },
    { label: "Adam’s salary covered from", value: r.adamMonth ? `Month ${r.adamMonth}` : "Not in Year 1", sub: r.adamMonth ? MONTH_NAMES[r.adamMonth - 1] : "revenue doesn’t reach it", delta: adamDelta },
    { label: "Operating result over Year 1", value: <span className={r.cumResult < 0 ? "neg" : ""}>{fmt$(r.cumResult, { k: true, plus: true })}</span>, sub: "before setup fees", delta: <Delta v={r.cumResult} p={plan.cumResult} kind="$" /> },
    { label: "Setup cash collected in Year 1", value: fmt$(r.setupCash, { k: true }), sub: "one-time; partly credited back in Year 2", delta: <Delta v={r.setupCash} p={plan.setupCash} kind="$" /> },
    { label: "New organisations needed", value: fmtN(r.orgs, 1), sub: `about ${fmtN(r.orgsPerMonth, 1)} a month`, delta: <Delta v={r.orgs} p={plan.orgs} kind="n" betterHigh={false} /> },
  ];
}

function ScenarioTable({ sc, churn }: { sc: { s: number; r: ModelResult }[]; churn: number }) {
  const rows: [string, (x: { s: number; r: ModelResult }) => React.ReactNode][] = [
    ["Communities signed (before churn)", (x) => fmtN(x.s)],
    [`Paying after ${churn}% monthly churn`, (x) => `≈${fmtN(x.r.paying12)}`],
    ["Annual recurring revenue", (x) => `≈${fmt$(x.r.arr12, { k: true })}`],
    ["Monthly revenue", (x) => fmt$(x.r.revenue12)],
    ["Monthly cost", (x) => <>{fmt$(x.r.cost12)}{x.r.adamMonth ? null : <><br /><span className="muted small">Adam not yet paid</span></>}</>],
    ["Monthly result", (x) => <><span className={x.r.result12 < 0 ? "neg" : ""}>{fmt$(x.r.result12, { plus: true })}</span> <span className="muted small">({fmtN(x.r.margin12 * 100)}%)</span></>],
    ["Adam’s salary covered from", (x) => (x.r.adamMonth ? `Month ${x.r.adamMonth}` : "Not in Year 1")],
    ["Operating result over Year 1", (x) => <span className={x.r.cumResult < 0 ? "neg" : ""}>{fmt$(x.r.cumResult, { k: true, plus: true })}</span>],
    ["Setup fees collected in Year 1", (x) => fmt$(x.r.setupCash, { k: true })],
  ];
  return (
    <table className="scen-table">
      <thead><tr><th scope="col">At month 12</th><th scope="col" className="r">Slow</th><th scope="col" className="r exp">Expected</th><th scope="col" className="r">Fast</th></tr></thead>
      <tbody>{rows.map(([label, f]) => (
        <tr key={label}><th scope="row">{label}</th>{sc.map((x, i) => <td key={x.s} className={`r num ${i === 1 ? "exp" : ""}`}>{f(x)}</td>)}</tr>
      ))}</tbody>
      <caption>Recalculated live from the model’s inputs.</caption>
    </table>
  );
}
