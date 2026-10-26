"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CONTENT as C } from "@/lib/plan/content";
import { DEFAULT_CASH, runPlanChecks, MONTH_NAMES, PLAN_DEFAULTS, type Inputs, type ModelResult } from "@/lib/plan/model";
import { useModel } from "./model-state";
import { fmt$, fmtN } from "@/lib/plan/format";
import { SectionHead } from "./ui";
import { HiringPlanner } from "./hiring";
import { DEFAULT_SERIES, DEFAULT_WINDOW, Explorer, ExplorerControls, type SeriesKey, type Window } from "./explorer";

type NumKey = Exclude<keyof Inputs, "catapultCovers" | "staged">;
type Control = { key: NumKey; label: string; min: number; max: number; step: number; f: (v: number) => string };

const money = (v: number) => fmt$(v);
const count = (v: number) => fmtN(v);
const pctf = (v: number) => `${v}%`;

const GROUPS: { id: string; group: string; items: Control[] }[] = [
  { id: "customers", group: "Customers", items: [
    { key: "signed", label: "Paying communities signed by month 12", min: 20, max: 200, step: 1, f: count },
    { key: "alpha", label: "Alpha communities converting at month 1", min: 0, max: 30, step: 1, f: count },
    { key: "alphaMix", label: "Alpha share on Community Life (founding price)", min: 0, max: 100, step: 5, f: pctf },
    { key: "mix", label: "Share on Community Life (vs Website)", min: 0, max: 100, step: 5, f: pctf },
    { key: "churn", label: "Monthly churn", min: 0, max: 7, step: 0.5, f: pctf },
    { key: "perOrg", label: "Average communities per organisation", min: 1, max: 20, step: 1, f: count },
  ]},
  { id: "prices", group: "Prices", items: [
    { key: "websitePrice", label: "Website price", min: 199, max: 599, step: 10, f: money },
    { key: "clPrice", label: "Community Life price", min: 399, max: 999, step: 10, f: money },
    { key: "foundingPrice", label: "Alpha founding price (Community Life)", min: 349, max: 649, step: 10, f: money },
  ]},
  { id: "costs", group: "Costs", items: [
    { key: "runCost", label: "Running cost + card fees per community", min: 30, max: 120, step: 1, f: money },
    { key: "p1Fixed", label: "Build and alpha cost (Nov 2026 – Jun 2027)", min: 0, max: 10000, step: 100, f: money },
    { key: "otherFixed", label: "Tools, ads, trade shows and travel (from launch)", min: 0, max: 15000, step: 10, f: money },
    { key: "p3Fixed", label: "Phase 3 fixed cost (Year 2, Tim free for now)", min: 20000, max: 80000, step: 10, f: money },
  ]},
  { id: "staff", group: "Staff pay", items: [
    { key: "adam", label: "Adam ($62k + payroll taxes)", min: 0, max: 12000, step: 100, f: money },
    { key: "hubertPT", label: "Hubert part-time, until full-time", min: 0, max: 6000, step: 100, f: money },
    { key: "hubertFT", label: "Hubert full-time ($62k + taxes and health)", min: 3000, max: 12000, step: 100, f: money },
    { key: "salesCost", label: "Sales associate ($60k base + taxes and health)", min: 3000, max: 12000, step: 100, f: money },
    { key: "commission", label: "Sales commission on first-year contracts", min: 0, max: 20, step: 1, f: pctf },
  ]},
];
const TABS = [...GROUPS.map((g) => ({ id: g.id, label: g.group })), { id: "hiring", label: "Hiring dates" }, { id: "setup", label: "Setup fees" }];

// The plan's three cases: only the communities signed by month 12 differs.
const SCENARIOS = [
  { id: "slow", label: "Slow", note: "50 signed", inputs: { ...PLAN_DEFAULTS, signed: 50 } },
  { id: "expected", label: "Expected", note: "80 signed", inputs: PLAN_DEFAULTS },
  { id: "fast", label: "Fast", note: "110 signed", inputs: { ...PLAN_DEFAULTS, signed: 110 } },
];

const be = (n: number) => (isFinite(n) ? fmtN(n) : "never");
const noSubscribe = () => () => {};
const same = (a: Inputs, b: Inputs) => (Object.keys(a) as (keyof Inputs)[]).every((k) => a[k] === b[k]);

function Delta({ v, p, kind, betterHigh = true }: { v: number; p: number; kind: "n" | "$" | "pct"; betterHigh?: boolean }) {
  const diff = v - p;
  const eps = kind === "pct" ? 0.0005 : kind === "n" ? 0.05 : 1;
  if (Math.abs(diff) < eps || (!isFinite(v) && !isFinite(p))) return <span className="o-delta muted">same as plan</span>;
  const good = betterHigh ? diff > 0 : diff < 0;
  const txt = !isFinite(diff) ? "no break-even" : kind === "pct" ? `${diff > 0 ? "+" : "−"}${fmtN(Math.abs(diff) * 100, 1)} pts`
    : kind === "n" ? `${diff > 0 ? "+" : "−"}${fmtN(Math.abs(diff), Math.abs(diff) < 10 ? 1 : 0)}` : fmt$(diff, { k: true, plus: true });
  return <span className={`o-delta ${good ? "up" : "down"}`}>{txt} vs plan</span>;
}

// The financial model: one dashboard of controls (scenario presets, assumptions, hiring dates,
// setup fees, timeframe and chart series) driving one chart and one table.
export function ModelSection() {
  const { state, setState, plan, r, hires, setHires, cashOpt, setCashOpt } = useModel();
  const [tab, setTab] = useState("customers");
  const [win, setWin] = useState<Window>(DEFAULT_WINDOW);
  const [show, setShow] = useState<Record<SeriesKey, boolean>>(DEFAULT_SERIES);
  const isTest = useSyncExternalStore(noSubscribe, () => new URLSearchParams(location.search).has("test"), () => false);
  const test = useMemo(() => (isTest ? runPlanChecks() : null), [isTest]);

  // ?test shows the plan reproduction checks above the outputs.
  useEffect(() => {
    if (test) console.log(`[plan-test] ${test.pass ? "PASS" : "FAIL"}`, test.checks);
  }, [test]);

  const set = (k: NumKey, v: number) => setState((s) => ({ ...s, [k]: v }));
  const touched = (items: Control[]) => items.some((it) => state[it.key] !== PLAN_DEFAULTS[it.key]);
  const tabChanged: Record<string, boolean> = {
    ...Object.fromEntries(GROUPS.map((g) => [g.id, touched(g.items)])),
    costs: touched(GROUPS[2].items) || state.catapultCovers !== PLAN_DEFAULTS.catapultCovers,
    hiring: Object.keys(hires).length > 0,
    setup: cashOpt.includeSetup !== DEFAULT_CASH.includeSetup || cashOpt.creditFirst10 !== DEFAULT_CASH.creditFirst10,
  };
  const anyChanged = Object.values(tabChanged).some(Boolean);
  const resetAll = () => { setState(PLAN_DEFAULTS); setHires({}); setCashOpt(DEFAULT_CASH); };
  const group = GROUPS.find((g) => g.id === tab);

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

        <form className="dashboard" aria-label="Model controls" onSubmit={(e) => e.preventDefault()}>
          <div className="dash-top">
            <div className="scenarios" role="group" aria-label="Scenario presets">
              <span className="ctl-label">Scenario</span>
              {SCENARIOS.map((sc) => {
                const on = same(state, sc.inputs);
                return (
                  <button key={sc.id} type="button" className={`chip scen ${on ? "on" : ""}`} aria-pressed={on} onClick={() => setState(sc.inputs)}>
                    <b>{sc.label}</b><span>{sc.note}</span>
                  </button>
                );
              })}
              <span className="muted small scen-note">Presets set every input; adjust anything after.</span>
            </div>
            <button type="button" id="reset" className="btn" disabled={!anyChanged} onClick={resetAll}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7a4.5 4.5 0 1 0 1.4-3.3M2.5 1.8v2.4h2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Reset to plan
            </button>
          </div>

          <div className="dash-tabs" role="tablist" aria-label="Assumptions">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="dash-panel"
                className={`dash-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}{tabChanged[t.id] ? <i className="dash-dot" aria-label="changed from plan" /> : null}
              </button>
            ))}
          </div>

          <div className="dash-panel" id="dash-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {group ? (
              <div className="dash-grid">
                {group.items.map((it) => <Slider key={it.key} it={it} value={state[it.key]} onChange={(v) => set(it.key, v)} />)}
                {tab === "costs" ? (
                  <label className="toggle">
                    <input type="checkbox" id="in-cover" checked={state.catapultCovers} onChange={(e) => setState((s) => ({ ...s, catapultCovers: e.target.checked }))} />
                    <span>{C.model.coverNote}<small>If off, adds $1,500 a month to fixed costs.</small></span>
                  </label>
                ) : null}
              </div>
            ) : tab === "hiring" ? (
              <HiringPlanner inputs={state} compact />
            ) : (
              <div className="dash-grid two">
                <label className="toggle">
                  <input type="checkbox" checked={cashOpt.includeSetup} onChange={(e) => setCashOpt((o) => ({ ...o, includeSetup: e.target.checked }))} />
                  <span>{C.monthly.setupLabel}<small>{C.monthly.setupNote}</small></span>
                </label>
                <label className={`toggle ${cashOpt.includeSetup ? "" : "off"}`}>
                  <input type="checkbox" checked={cashOpt.creditFirst10} disabled={!cashOpt.includeSetup} onChange={(e) => setCashOpt((o) => ({ ...o, creditFirst10: e.target.checked }))} />
                  <span>{C.monthly.creditLabel}<small>{C.monthly.creditNote}</small></span>
                </label>
              </div>
            )}
          </div>

          <ExplorerControls win={win} setWin={setWin} show={show} setShow={setShow} />
        </form>

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

        <Explorer win={win} show={show} />
      </div>
    </section>
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
    </div>
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
