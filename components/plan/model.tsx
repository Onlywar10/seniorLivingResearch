"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CONTENT as C } from "@/lib/plan/content";
import { allMonths, DEFAULT_CASH, paceTarget, runPlanChecks, MONTH_NAMES, PLAN_DEFAULTS, type CashRow, type Curve, type Inputs, type ModelResult } from "@/lib/plan/model";
import { useModel } from "./model-state";
import { fmt$, fmtN } from "@/lib/plan/format";
import { SectionHead } from "./ui";
import { HiringPlanner } from "./hiring";
import { DEFAULT_SERIES, Explorer, ExplorerControls, type SeriesKey } from "./explorer";

type NumKey = Exclude<keyof Inputs, "catapultCovers" | "staged" | "target" | "curve" | "planPaying" | "whole">;
type Control = { key: NumKey; label: string; min: number; max: number; step: number; f: (v: number) => string };

const money = (v: number) => fmt$(v);
const count = (v: number) => fmtN(v);
const pctf = (v: number) => `${v}%`;

const GROUPS: { id: string; group: string; items: Control[] }[] = [
  { id: "customers", group: "Customers", items: [
    { key: "alpha", label: "Alpha communities converting in June 2027", min: 0, max: 30, step: 1, f: count },
    { key: "waitlist", label: "Beta waitlist joining at launch (July 2027)", min: 0, max: 80, step: 1, f: count },
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
    { key: "tools", label: "Software and tools (from launch)", min: 0, max: 5000, step: 50, f: money },
    { key: "showsTravel", label: "Trade shows, including travel (from launch)", min: 0, max: 8000, step: 10, f: money },
    { key: "p3Fixed", label: "Phase 3 fixed cost (Year 2, Tim free for now)", min: 20000, max: 80000, step: 10, f: money },
  ]},
  { id: "ads", group: "Ads", items: [
    { key: "ads", label: "Ads/Marketing (from launch)", min: 0, max: 15000, step: 50, f: money },
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

// The plan's three cases are paces of signing: 70, 100 or 130 paying by Jun 2028, applied to the chosen period.
const SCENARIOS = [
  { id: "slow", label: "Slow", note: "70 paying by Jun 2028", inputs: { ...PLAN_DEFAULTS, planPaying: 70 } },
  { id: "expected", label: "Expected", note: "100 by Jun 2028", inputs: PLAN_DEFAULTS },
  { id: "fast", label: "Fast", note: "130 by Jun 2028", inputs: { ...PLAN_DEFAULTS, planPaying: 130 } },
];
const CURVES: { id: Curve; label: string; note: string }[] = [
  { id: "linear", label: "Linear", note: "the same number of new communities each month" },
  { id: "exponential", label: "Exponential", note: "new signings grow by a set % each month" },
  { id: "scurve", label: "S-curve", note: "slow start, fast middle, levelling off" },
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
  const { state, setState, plan, r, hires, setHires, cashOpt, setCashOpt, win, end } = useModel();
  const [tab, setTab] = useState("customers");
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
    customers: touched(GROUPS[0].items) || state.target !== null || state.curve !== PLAN_DEFAULTS.curve || state.growth !== PLAN_DEFAULTS.growth || state.planPaying !== PLAN_DEFAULTS.planPaying,
    costs: touched(GROUPS[2].items) || state.catapultCovers !== PLAN_DEFAULTS.catapultCovers,
    hiring: Object.keys(hires).length > 0,
    setup: cashOpt.includeSetup !== DEFAULT_CASH.includeSetup || cashOpt.creditFirst10 !== DEFAULT_CASH.creditFirst10,
  };
  const anyChanged = Object.values(tabChanged).some(Boolean);
  const resetAll = () => { setState(PLAN_DEFAULTS); setHires({}); setCashOpt(DEFAULT_CASH); };
  const group = GROUPS.find((g) => g.id === tab);

  const endIndex = Math.max(win.from, win.to), startIndex = Math.min(win.from, win.to);
  const rows = useMemo(() => allMonths(state, cashOpt, hires, endIndex).slice(startIndex, endIndex + 1), [state, cashOpt, hires, startIndex, endIndex]);
  const planRows = useMemo(() => allMonths(PLAN_DEFAULTS, DEFAULT_CASH, {}, endIndex).slice(startIndex, endIndex + 1), [startIndex, endIndex]);
  const endLabel = rows[rows.length - 1].label;
  const span = `${rows[0].label} – ${endLabel}`;
  const adamIn = r.adamMonth !== null && r.adamMonth <= end;
  const cards = outputCards(r, plan, rows, planRows, endLabel, end, state.perOrg);
  const opResult = rows.reduce((a, x) => a + x.revenue - x.cost, 0);
  // Setup fees are one-time, so the readout gives the end month both before and after them.
  const last = rows[rows.length - 1];
  const withSetup = r.resultEnd + last.setup - last.credit;
  const setupNote = cashOpt.includeSetup && last.setup > 0 ? `, or ${fmt$(withSetup, { plus: true })} counting that month’s setup fees` : "";
  const readout = end < 1
    ? `This period (${span}) ends before sales start in July 2027: build and alpha only, ${fmt$(opResult, { k: true, plus: true })} net (paid by Catapult)${endIndex >= 7 ? ", with the alpha communities paying from June" : ""}.`
    : `Over ${span}: ${adamIn ? `Adam’s salary is covered from ${MONTH_NAMES[r.adamMonth! - 1]}${cashOpt.includeSetup ? " (counting setup fees)" : ""}` : "Adam’s salary isn’t covered within this period"}, and the period ends with about ${fmtN(r.payingEnd)} paying communities and ${fmt$(r.arrEnd, { k: true })} ARR. In ${endLabel} the business runs at ${fmt$(r.resultEnd, { plus: true })} a month before setup fees${setupNote}.`;
  const pace = Math.round(paceTarget(state, end));
  const planPace = Math.round(paceTarget(PLAN_DEFAULTS, end));
  const target = state.target ?? pace;

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
              <span className="muted small scen-note">Presets set every input to the plan at that pace; adjust anything after.</span>
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
                {tab === "customers" ? (
                  <>
                    <TargetControl value={target} pace={pace} planPace={planPace} disabled={end < 2} endLabel={endLabel} isSet={state.target !== null}
                      onChange={(v) => setState((s) => ({ ...s, target: v }))} onPace={() => setState((s) => ({ ...s, target: null }))} />
                    <div className="ctl">
                      <div className="ctl-top"><span className="ctl-name" id="curve-label">Growth curve to the target</span></div>
                      <div className="curve-chips" role="radiogroup" aria-labelledby="curve-label">
                        {CURVES.map((c) => (
                          <button key={c.id} type="button" role="radio" aria-checked={state.curve === c.id} className={`chip ${state.curve === c.id ? "on" : ""}`}
                            title={c.note} onClick={() => setState((s) => ({ ...s, curve: c.id }))}>{c.label}</button>
                        ))}
                      </div>
                      <p className="ctl-note">{CURVES.find((c) => c.id === state.curve)!.note}</p>
                    </div>
                    {state.curve === "exponential" ? (
                      <Slider it={{ key: "growth", label: "Monthly growth in new signings", min: 0, max: 60, step: 1, f: pctf }} value={state.growth} onChange={(v) => set("growth", v)} />
                    ) : null}
                  </>
                ) : null}
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

          <ExplorerControls show={show} setShow={setShow} />
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
        <p id="readout" className={`readout ${end >= 1 && r.resultEnd < 0 && withSetup < 0 ? "warn" : ""}`}>{readout}</p>

        <Explorer show={show} />
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

// Headline figures for the chosen period, compared with the plan over the same period.
function outputCards(r: ModelResult, plan: ModelResult, rows: CashRow[], planRows: CashRow[], endLabel: string, end: number, perOrg: number) {
  const sum = (xs: CashRow[], f: (x: CashRow) => number) => xs.reduce((a, x) => a + f(x), 0);
  const op = sum(rows, (x) => x.revenue - x.cost), planOp = sum(planRows, (x) => x.revenue - x.cost);
  const setup = sum(rows, (x) => x.setupGross), planSetup = sum(planRows, (x) => x.setupGross);
  const sellingMonths = rows.filter((x) => x.newSigned > 0).length;
  const orgs = sum(rows, (x) => x.newSigned) / perOrg, planOrgs = sum(planRows, (x) => x.newSigned) / PLAN_DEFAULTS.perOrg;
  const inPeriod = (m: number | null) => m !== null && m <= end;
  const adamDelta = inPeriod(r.adamMonth) && inPeriod(plan.adamMonth)
    ? r.adamMonth === plan.adamMonth
      ? <span className="o-delta muted">same as plan</span>
      : <span className={`o-delta ${r.adamMonth! < plan.adamMonth! ? "up" : "down"}`}>{Math.abs(r.adamMonth! - plan.adamMonth!)} month{Math.abs(r.adamMonth! - plan.adamMonth!) > 1 ? "s" : ""} {r.adamMonth! < plan.adamMonth! ? "earlier" : "later"}</span>
    : inPeriod(r.adamMonth) ? null : inPeriod(plan.adamMonth) ? <span className="o-delta down">plan: {MONTH_NAMES[plan.adamMonth! - 1]}</span> : null;
  return [
    { label: `Paying communities, ${endLabel}`, value: fmtN(r.payingEnd), sub: "after churn", delta: <Delta v={r.payingEnd} p={plan.payingEnd} kind="n" /> },
    { label: `ARR, ${endLabel}`, value: fmt$(r.arrEnd, { k: true }), sub: `${fmt$(r.revenueEnd)} a month`, delta: <Delta v={r.arrEnd} p={plan.arrEnd} kind="$" /> },
    { label: `Monthly result, ${endLabel}`, value: <span className={r.resultEnd < 0 ? "neg" : ""}>{fmt$(r.resultEnd, { plus: true })}</span>, sub: `${fmtN(r.marginEnd * 100)}% margin, before setup fees`, delta: <Delta v={r.resultEnd} p={plan.resultEnd} kind="$" /> },
    { label: "Break-even, full team and Adam paid", value: <>{be(r.breakEvenPost)} <span className="o-sub">communities</span></>, sub: `${be(r.breakEvenPre)} before Adam is paid`, delta: <Delta v={r.breakEvenPost} p={plan.breakEvenPost} kind="n" betterHigh={false} /> },
    { label: "Adam’s salary covered from", value: inPeriod(r.adamMonth) ? MONTH_NAMES[r.adamMonth! - 1] : "Not in this period", sub: inPeriod(r.adamMonth) ? `Year-1 month ${r.adamMonth}` : "revenue doesn’t reach it", delta: adamDelta },
    { label: "Operating result over the period", value: <span className={op < 0 ? "neg" : ""}>{fmt$(op, { k: true, plus: true })}</span>, sub: "before setup fees", delta: <Delta v={op} p={planOp} kind="$" /> },
    { label: "Setup fees collected in the period", value: fmt$(setup, { k: true }), sub: "one-time; the waitlist’s comes back as a discount", delta: <Delta v={setup} p={planSetup} kind="$" /> },
    { label: "New organisations needed in the period", value: `≈${fmtN(orgs)}`, sub: sellingMonths ? `about ${fmtN(orgs / sellingMonths, 1)} a month` : "no selling months in this period", delta: <Delta v={orgs} p={planOrgs} kind="n" betterHigh={false} /> },
  ];
}

// The target: paying communities wanted by the end of the period. Starts at the plan's pace.
function TargetControl({ value, pace, planPace, disabled, endLabel, isSet, onChange, onPace }: {
  value: number; pace: number; planPace: number; disabled: boolean; endLabel: string; isSet: boolean;
  onChange: (v: number) => void; onPace: () => void;
}) {
  const min = 0, max = Math.max(200, Math.ceil(planPace * 2.5 / 10) * 10);
  const planPos = (planPace - min) / (max - min);
  return (
    <div className={`ctl target ${disabled ? "off" : ""}`}>
      <div className="ctl-top">
        <label htmlFor="in-target">Target paying communities by {endLabel}</label>
        <output htmlFor="in-target" className={isSet ? "changed" : ""}>{disabled ? "—" : fmtN(value)}</output>
      </div>
      <div className="range">
        <input type="range" id="in-target" min={min} max={max} step={1} value={disabled ? 0 : value} disabled={disabled}
          aria-describedby="sub-target" aria-valuetext={disabled ? "no sales in this period" : `${fmtN(value)} communities`}
          style={{ "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.target.value))} />
        <span className="plan-mark" style={{ left: `calc(9px + (100% - 18px) * ${planPos})` }} aria-hidden="true" />
      </div>
      <div className="ctl-sub" id="sub-target">
        {disabled ? <span>Sales start in July 2027, after this period ends.</span> : <>
          <span>{min}</span><span>plan {fmtN(planPace)}{pace !== planPace ? ` · this pace ${fmtN(pace)}` : ""}</span><span>{max}</span>
        </>}
      </div>
      {isSet && !disabled ? <button type="button" className="linkish small" onClick={onPace}>Back to the scenario’s pace</button> : null}
    </div>
  );
}
