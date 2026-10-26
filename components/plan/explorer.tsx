"use client";

import { useEffect, useMemo, useRef } from "react";
import { Chart, registerables, type Plugin, type TooltipItem } from "chart.js";
import { allMonths, cashTotals, STAFF_ORDER, type StaffKey } from "@/lib/plan/model";
import { fmt$, fmtN } from "@/lib/plan/format";
import { useModel } from "./model-state";
import { CashTable } from "./monthly";

Chart.register(...registerables);

const INK = "#1d2422", PROFIT = "#16a34a", LOSS = "#dc2626", REVENUE = "#15803d", COSTS = "#9aa29f", PAYING = "#2563eb", GRID = "#eceeec";
const REVENUE_STARTS = 7; // Jun 2027: alpha converts after 90 days live
const HIRE_NAME: Record<StaffKey, string> = { adam: "Adam", hubert: "Hubert", sales: "Sales" };

export type SeriesKey = "result" | "cum" | "revenue" | "cost" | "paying";
export const DEFAULT_SERIES: Record<SeriesKey, boolean> = { result: true, cum: true, revenue: true, cost: true, paying: false };
const SERIES: { key: SeriesKey; label: string; color: string; dash?: boolean }[] = [
  { key: "result", label: "Monthly result", color: PROFIT },
  { key: "cum", label: "Running total", color: INK },
  { key: "revenue", label: "Revenue (incl. setup kept)", color: REVENUE },
  { key: "cost", label: "Total costs", color: COSTS },
  { key: "paying", label: "Paying communities", color: PAYING, dash: true },
];

const PRESETS: { label: string; from: number; to: number }[] = [
  { label: "First 12 months", from: 0, to: 11 },
  { label: "Everything", from: 0, to: 19 },
  { label: "Year 1", from: 8, to: 19 },
  { label: "Build and alpha", from: 0, to: 7 },
];

type Marks = { index: number; text: string }[];
type MarkedChart = Chart & { $marks?: Marks };

// Dashed lines where revenue starts and where each person goes full-time.
const marksPlugin: Plugin = {
  id: "marks",
  afterDatasetsDraw(chart) {
    const marks = (chart as MarkedChart).$marks || [];
    const { top, bottom } = chart.chartArea;
    const c = chart.ctx;
    const x = chart.scales.x;
    c.save();
    c.font = `600 10.5px ${getComputedStyle(document.body).fontFamily}`;
    marks.forEach((m, i) => {
      const px = (x.getPixelForValue(m.index) + x.getPixelForValue(m.index - 1)) / 2;
      c.strokeStyle = "#6b7471"; c.setLineDash([3, 4]); c.lineWidth = 1;
      c.beginPath(); c.moveTo(px, top); c.lineTo(px, bottom); c.stroke(); c.setLineDash([]);
      c.fillStyle = INK; c.textAlign = "left";
      c.fillText(m.text, px + 4, top + 10 + (i % 3) * 13);
    });
    c.restore();
  },
};

// Timeframe and series controls. They live in the financial model's dashboard and drive Explorer.
export function ExplorerControls({ show, setShow }: {
  show: Record<SeriesKey, boolean>; setShow: React.Dispatch<React.SetStateAction<Record<SeriesKey, boolean>>>;
}) {
  const { state, hires, cashOpt, win, setWin } = useModel();
  const rows = useMemo(() => allMonths(state, cashOpt, hires), [state, cashOpt, hires]);
  const from = Math.min(win.from, win.to), to = Math.max(win.from, win.to);
  return (
      <div className="explorer-controls">
        <div className="timeframe" role="group" aria-label="Timeframe">
          <span className="ctl-label">Timeframe</span>
          <div className="presets">
            {PRESETS.map((p) => (
              <button key={p.label} type="button" className={`chip ${from === p.from && to === p.to ? "on" : ""}`} aria-pressed={from === p.from && to === p.to}
                onClick={() => setWin({ from: p.from, to: p.to })}>{p.label}</button>
            ))}
          </div>
          <label>From <select value={from} onChange={(e) => setWin((w) => ({ ...w, from: Number(e.target.value) }))}>
            {rows.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
          </select></label>
          <label>to <select value={to} onChange={(e) => setWin((w) => ({ ...w, to: Number(e.target.value) }))}>
            {rows.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
          </select></label>
        </div>
        <div className="series" role="group" aria-label="Show on chart">
          <span className="ctl-label">Show</span>
          {SERIES.map((s) => (
            <label key={s.key} className={`chip ${show[s.key] ? "on" : ""}`}>
              <input type="checkbox" checked={show[s.key]} onChange={(e) => setShow((v) => ({ ...v, [s.key]: e.target.checked }))} />
              <i className={s.dash ? "dash" : ""} style={{ background: s.dash ? "none" : s.color, color: s.color }} />{s.label}
            </label>
          ))}
        </div>
      </div>
  );
}

// The single chart and table: the chosen months, from whatever running total is carried in.
export function Explorer({ show }: { show: Record<SeriesKey, boolean> }) {
  const { state, hires, cashOpt, win } = useModel();
  const endIndex = Math.max(win.from, win.to);
  const rows = useMemo(() => allMonths(state, cashOpt, hires, endIndex), [state, cashOpt, hires, endIndex]);

  const from = Math.min(win.from, win.to), to = Math.max(win.from, win.to);
  const view = rows.slice(from, to + 1);
  const opening = from > 0 ? rows[from - 1].cum : 0;
  const t = cashTotals(view);
  const hireIdx = ((): Marks => {
    const out: Marks = [];
    if (from < REVENUE_STARTS && to >= REVENUE_STARTS) out.push({ index: REVENUE_STARTS - from, text: "Revenue starts" });
    STAFF_ORDER.forEach((k) => {
      const name = HIRE_NAME[k];
      const i = view.findIndex((r) => r.phase.includes(k === "adam" ? "Adam paid" : k === "hubert" ? "Hubert full-time" : "sales associate starts"));
      if (i >= 0) out.push({ index: i, text: `${name} starts` });
    });
    return out;
  })();

  return (
    <div className="explorer">
      <dl className="cash-stats">
        <div><dt>{from > 0 ? `Carried in to ${view[0].label}` : "Starting point"}</dt><dd className={opening < 0 ? "neg" : ""}>{fmt$(opening, { k: true, plus: true })}</dd><span>{from > 0 ? "running total before this window" : "development starts"}</span></div>
        <div><dt>Result over these {view.length} months</dt><dd className={t.result < 0 ? "neg" : ""}>{fmt$(t.result, { k: true, plus: true })}</dd><span>revenue {fmt$(t.revenue + t.setup - t.credit, { k: true })} · costs {fmt$(t.cost, { k: true })}</span></div>
        <div><dt>Ends at</dt><dd className={t.end < 0 ? "neg" : ""}>{fmt$(t.end, { k: true, plus: true })}</dd><span>{view[view.length - 1].label}</span></div>
        <div><dt>Lowest point</dt><dd className={Math.min(opening, t.low.cum) < 0 ? "neg" : ""}>{fmt$(Math.min(opening, t.low.cum), { k: true, plus: true })}</dd><span>{t.low.cum < opening ? t.low.label : from > 0 ? "at the start" : "—"}</span></div>
      </dl>

      <ExplorerChart rows={view} opening={opening} show={show} marks={hireIdx} />
      <CashTable rows={view} opt={cashOpt} opening={opening} compact />
    </div>
  );
}

function ExplorerChart({ rows, opening, show, marks }: { rows: ReturnType<typeof allMonths>; opening: number; show: Record<SeriesKey, boolean>; marks: Marks }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);
  useEffect(() => {
    const ff = getComputedStyle(document.body).fontFamily;
    const tick = { color: "#6b7471", font: { family: ff, size: 11 } };
    chart.current = new Chart(ref.current!, {
      data: { labels: [], datasets: [
        { type: "bar", label: "Monthly result", data: [], backgroundColor: [], borderRadius: 3, maxBarThickness: 26, order: 3 },
        { type: "line", label: "Running total", data: [], borderColor: INK, backgroundColor: INK, borderWidth: 2, pointRadius: 2.5, tension: 0.2, order: 1 },
        { type: "line", label: "Revenue (incl. setup kept)", data: [], borderColor: REVENUE, backgroundColor: REVENUE, borderWidth: 2, pointRadius: 0, tension: 0.2, order: 2 },
        { type: "line", label: "Total costs", data: [], borderColor: COSTS, backgroundColor: COSTS, borderWidth: 2, pointRadius: 0, tension: 0, stepped: "middle", order: 2 },
        { type: "line", label: "Paying communities", data: [], borderColor: PAYING, backgroundColor: PAYING, borderWidth: 2, borderDash: [5, 4], pointRadius: 0, tension: 0.2, yAxisID: "y1", order: 2 },
      ]},
      options: {
        maintainAspectRatio: false, animation: { duration: 260 },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: INK, padding: 10, cornerRadius: 6, callbacks: {
            label: (c: TooltipItem<"bar">) => c.dataset.yAxisID === "y1" ? ` ${c.dataset.label}: ${fmtN(c.parsed.y ?? 0, 1)}` : ` ${c.dataset.label}: ${fmt$(c.parsed.y ?? 0, { plus: c.datasetIndex < 2 })}`,
          } },
        },
        scales: {
          x: { grid: { display: false }, border: { color: "#cfd3cf" }, ticks: { ...tick, maxRotation: 0, autoSkip: true, autoSkipPadding: 8 } },
          y: { grid: { color: GRID }, border: { display: false }, ticks: { ...tick, maxTicksLimit: 7, callback: (v: number | string) => fmt$(Number(v), { k: true }) } },
          y1: { position: "right", display: false, beginAtZero: true, grid: { display: false }, border: { display: false }, ticks: { ...tick, maxTicksLimit: 6 } },
        },
      },
      plugins: [marksPlugin],
    } as never);
    return () => { chart.current?.destroy(); chart.current = null; };
  }, []);
  useEffect(() => {
    const ch = chart.current;
    if (!ch) return;
    const lead = opening ? 1 : 0; // a "Start" point for the carried-in balance
    const pad = <T,>(v: T, xs: T[]) => [...(lead ? [v] : []), ...xs];
    ch.data.labels = pad("Start", rows.map((r) => r.label.replace(" 20", " ’")));
    const ds = ch.data.datasets;
    ds[0].data = pad(null as number | null, rows.map((r) => r.result));
    (ds[0] as unknown as { backgroundColor: string[] }).backgroundColor = pad(PROFIT, rows.map((r) => (r.result < 0 ? LOSS : PROFIT)));
    ds[1].data = pad(opening as number | null, rows.map((r) => r.cum));
    ds[2].data = pad(null as number | null, rows.map((r) => r.revenue + r.setup - r.credit));
    ds[3].data = pad(null as number | null, rows.map((r) => r.cost));
    ds[4].data = pad(null as number | null, rows.map((r) => r.paying));
    (["result", "cum", "revenue", "cost", "paying"] as SeriesKey[]).forEach((k, i) => { ds[i].hidden = !show[k]; });
    (ch.options.scales!.y1 as { display: boolean }).display = show.paying;
    (ch as MarkedChart).$marks = marks.map((m) => ({ ...m, index: m.index + lead }));
    ch.update();
  });
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <div className="canvas-box explorer-canvas"><canvas ref={ref} role="img" aria-label="Customisable chart of the selected months: monthly result, running total, revenue, costs and paying communities" /></div>
      {show.paying ? <p className="c-note">Paying communities use the right-hand scale.</p> : null}
    </figure>
  );
}
