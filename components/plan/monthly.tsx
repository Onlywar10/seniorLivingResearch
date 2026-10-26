"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { Chart, registerables, type Plugin, type TooltipItem } from "chart.js";
import { CONTENT as C } from "@/lib/plan/content";
import { buildCost, cashTotals, first12Cash, year1Cash, PLAN_DEFAULTS, type CashOptions, type CashRow } from "@/lib/plan/model";
import { fmt$, fmtN } from "@/lib/plan/format";
import { useModel } from "./model-state";
import { Tag } from "./ui";
import { HiringDisplay } from "./hiring";

Chart.register(...registerables);

// Profit and loss read as plainly green and red; the brand accent stays for everything else.
const INK = "#1d2422", ACC = "#16a34a", NEG = "#dc2626", GRID = "#eceeec";

type MarkedChart = Chart & { $mark?: { index: number; text: string } | null };

// A dashed vertical line at the month revenue starts.
const markLine: Plugin = {
  id: "markLine",
  afterDatasetsDraw(chart) {
    const mark = (chart as MarkedChart).$mark;
    if (!mark) return;
    const x0 = chart.scales.x.getPixelForValue(mark.index - 1), x1 = chart.scales.x.getPixelForValue(mark.index);
    const x = (x0 + x1) / 2;
    const { top, bottom } = chart.chartArea;
    const c = chart.ctx;
    c.save(); c.strokeStyle = INK; c.setLineDash([4, 4]); c.lineWidth = 1;
    c.beginPath(); c.moveTo(x, top); c.lineTo(x, bottom); c.stroke(); c.setLineDash([]);
    c.fillStyle = INK; c.font = `600 11px ${getComputedStyle(document.body).fontFamily}`; c.textAlign = "left";
    c.fillText(mark.text, x + 6, bottom - 8); c.restore();
  },
};

function CashChart({ rows, mark, label, opening = 0 }: { rows: CashRow[]; mark?: { index: number; text: string }; label: string; opening?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);
  useEffect(() => {
    const ff = getComputedStyle(document.body).fontFamily;
    chart.current = new Chart(ref.current!, {
      data: { labels: [], datasets: [
        { type: "bar", label: "Monthly result", data: [], backgroundColor: [], borderRadius: 3, maxBarThickness: 28, order: 2 },
        { type: "line", label: "Running total", data: [], borderColor: INK, backgroundColor: INK, borderWidth: 2, pointRadius: 2.5, pointHoverRadius: 4, tension: 0.2, order: 1 },
      ]},
      options: {
        maintainAspectRatio: false, animation: { duration: 260 },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: INK, padding: 10, cornerRadius: 6, callbacks: { label: (c: TooltipItem<"bar">) => ` ${c.dataset.label}: ${fmt$(c.parsed.y ?? 0, { plus: true })}` } },
        },
        scales: {
          x: { grid: { display: false }, border: { color: "#cfd3cf" }, ticks: { color: "#6b7471", font: { family: ff, size: 11 }, maxRotation: 0, autoSkip: true, autoSkipPadding: 8 } },
          y: { grid: { color: GRID }, border: { display: false }, ticks: { color: "#6b7471", font: { family: ff, size: 11 }, maxTicksLimit: 7, callback: (v: number | string) => fmt$(Number(v), { k: true }) } },
        },
      },
      plugins: [markLine],
    } as never);
    return () => { chart.current?.destroy(); chart.current = null; };
  }, []);
  useEffect(() => {
    const ch = chart.current;
    if (!ch) return;
    const lead = opening ? 1 : 0; // a "Start" point for the carried-in balance
    ch.data.labels = [...(lead ? ["Start"] : []), ...rows.map((r) => r.label.replace(" 20", " ’"))];
    ch.data.datasets[0].data = [...(lead ? [null] : []), ...rows.map((r) => r.result)];
    (ch.data.datasets[0] as unknown as { backgroundColor: string[] }).backgroundColor = [...(lead ? [ACC] : []), ...rows.map((r) => (r.result < 0 ? NEG : ACC))];
    ch.data.datasets[1].data = [...(lead ? [opening] : []), ...rows.map((r) => r.cum)];
    (ch as MarkedChart).$mark = mark ?? null;
    ch.update();
  });
  return <div className="canvas-box"><canvas ref={ref} role="img" aria-label={label} /></div>;
}

// Revenue in green; every cost rolled into one Total costs column. The summary's compact
// version fits half the page without scrolling: no Stage column, setup fees net of any
// credit in one "Setup kept" column, and amounts in thousands.
export function CashTable({ rows, opt, compact = false, opening = 0 }: { rows: CashRow[]; opt: CashOptions; compact?: boolean; opening?: number }) {
  const t = cashTotals(rows);
  const showSetup = opt.includeSetup, showCredit = !compact && opt.includeSetup && opt.creditFirst10;
  const f = (v: number, plus = false) => fmt$(v, { plus, k: compact });
  const money = (v: number, plus = false) => <span className={v < 0 ? "neg" : ""}>{f(v, plus)}</span>;
  const setupCol = (setup: number, credit: number) => (compact ? setup - credit : setup);
  return (
    <div className={compact ? "cash-table-fit" : "table-wrap"}>
      <table className={`cash-table ${compact ? "compact" : ""}`}>
        <thead>
          <tr>
            <th scope="col">Month</th>
            {compact ? null : <th scope="col">Stage</th>}
            <th scope="col" className="r pay">Paying</th>
            <th scope="col" className="r">Revenue</th>
            {showSetup ? <th scope="col" className="r">{compact ? "Setup kept" : "Setup fees"}</th> : null}
            {showCredit ? <th scope="col" className="r">Owed back</th> : null}
            <th scope="col" className="r">Total costs</th><th scope="col" className="r">Result</th><th scope="col" className="r">Running total</th>
          </tr>
        </thead>
        <tbody>
          {opening ? (
            <tr className="pre carried">
              <th scope="row" colSpan={compact ? 1 : 2}>{compact ? "Carried in" : `Carried in: running total before ${rows[0].label}`}</th>
              <td className="pay" />
              <td colSpan={2 + (showSetup ? 1 : 0) + (showCredit ? 1 : 0)} />
              <td className="r num strong" colSpan={2}>{money(opening, true)}</td>
            </tr>
          ) : null}
          {rows.map((r) => (
            <tr key={r.label} className={r.paying === 0 ? "pre" : ""}>
              <th scope="row">{compact ? r.label.replace(" 20", " ’") : r.label}</th>
              {compact ? null : <td className="muted">{r.phase}</td>}
              <td className="r num pay">{r.paying ? fmtN(r.paying, compact ? 0 : 1) : "—"}</td>
              <td className="r num rev">{f(r.revenue)}</td>
              {showSetup ? <td className="r num rev">{setupCol(r.setup, r.credit) ? f(setupCol(r.setup, r.credit)) : "—"}</td> : null}
              {showCredit ? <td className="r num">{r.credit ? money(-r.credit) : "—"}</td> : null}
              <td className="r num">{f(r.cost)}</td>
              <td className="r num">{money(r.result, true)}</td>
              <td className="r num strong">{money(r.cum, true)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={compact ? 1 : 2}>{compact ? "Total" : `${rows.length}-month total`}</th>
            <td className="pay" />
            <td className="r num rev">{f(t.revenue)}</td>
            {showSetup ? <td className="r num rev">{f(setupCol(t.setup, t.credit))}</td> : null}
            {showCredit ? <td className="r num">{money(-t.credit)}</td> : null}
            <td className="r num">{f(t.cost)}</td>
            <td className="r num" colSpan={2}>{money(t.result, true)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function View({ id, title, intro, rows, opt, mark, compact = false, opening = 0 }: { id: string; title: string; intro: string; rows: CashRow[]; opt: CashOptions; mark?: { index: number; text: string }; compact?: boolean; opening?: number }) {
  const t = cashTotals(rows);
  const Heading = compact ? "h3" : "h2";
  return (
    <section className={`cash-view ${compact ? "compact" : ""}`} aria-labelledby={`${id}-h`}>
      <div className="cash-head">
        <Heading id={`${id}-h`}>{title}</Heading>
        <p className="muted small">{intro}</p>
      </div>
      {opening ? (
        <dl className="cash-stats">
          <div><dt>Debt carried in</dt><dd className="neg">{fmt$(opening, { k: true })}</dd><span>build and alpha, Nov 2026 – Jun 2027</span></div>
          <div><dt>12-month result</dt><dd className={t.result < 0 ? "neg" : ""}>{fmt$(t.result, { k: true, plus: true })}</dd></div>
          <div><dt>Ends Year 1 at</dt><dd className={t.end < 0 ? "neg" : ""}>{fmt$(t.end, { k: true, plus: true })}</dd><span>{t.end < 0 ? "still owed" : "debt paid back"}</span></div>
          <div><dt>Lowest point</dt><dd className={Math.min(opening, t.low.cum) < 0 ? "neg" : ""}>{fmt$(Math.min(opening, t.low.cum), { k: true, plus: true })}</dd><span>{t.low.cum < opening ? t.low.label : "at the start"}</span></div>
        </dl>
      ) : (
        <dl className="cash-stats">
          <div><dt>12-month result</dt><dd className={t.result < 0 ? "neg" : ""}>{fmt$(t.result, { k: true, plus: true })}</dd></div>
          <div><dt>Lowest point</dt><dd className={t.low.cum < 0 ? "neg" : ""}>{fmt$(Math.min(0, t.low.cum), { k: true, plus: true })}</dd><span>{t.low.cum < 0 ? t.low.label : "never below zero"}</span></div>
          <div><dt>Costs</dt><dd>{fmt$(t.cost, { k: true })}</dd></div>
          <div><dt>Revenue{opt.includeSetup ? " + setup kept" : ""}</dt><dd>{fmt$(t.revenue + t.setup - t.credit, { k: true })}</dd></div>
        </dl>
      )}
      <figure className="chart" style={{ margin: 0 }}>
        <div className="legend"><span><i style={{ background: ACC }} />Month in profit</span><span><i style={{ background: NEG }} />Month at a loss</span><span><i style={{ background: INK }} />Running total</span></div>
        <CashChart rows={rows} mark={mark} opening={opening} label={`${title}: monthly result as bars and running total as a line`} />
      </figure>
      {compact ? (
        <details className="fold cash-fold">
          <summary>Costs and revenue for each month</summary>
          <div className="fold-body"><CashTable rows={rows} opt={opt} opening={opening} compact /></div>
        </details>
      ) : <CashTable rows={rows} opt={opt} opening={opening} />}
    </section>
  );
}

function Toggles({ opt, setOpt }: { opt: CashOptions; setOpt: React.Dispatch<React.SetStateAction<CashOptions>> }) {
  const M = C.monthly;
  return (
    <div className="cash-toggles" role="group" aria-label="What to count">
      <label className="toggle">
        <input type="checkbox" checked={opt.includeSetup} onChange={(e) => setOpt((o) => ({ ...o, includeSetup: e.target.checked }))} />
        <span>{M.setupLabel}<small>{M.setupNote}</small></span>
      </label>
      <label className={`toggle ${opt.includeSetup ? "" : "off"}`}>
        <input type="checkbox" checked={opt.creditFirst10} disabled={!opt.includeSetup} onChange={(e) => setOpt((o) => ({ ...o, creditFirst10: e.target.checked }))} />
        <span>{M.creditLabel} <Tag k="estimate" /><small>{M.creditNote}</small></span>
      </label>
    </div>
  );
}

// The summary page version: plan settings (with the shared hiring plan), charts and
// headline figures, and the monthly tables folded away.
export function MonthlySummary() {
  const { hires, cashOpt: opt, setCashOpt: setOpt } = useModel();
  const first12 = useMemo(() => first12Cash(PLAN_DEFAULTS, opt, hires), [opt, hires]);
  const year1 = useMemo(() => year1Cash(PLAN_DEFAULTS, opt, hires, -buildCost(PLAN_DEFAULTS)), [opt, hires]);
  const M = C.monthly;
  return (
    <>
      <Toggles opt={opt} setOpt={setOpt} />
      <HiringDisplay inputs={PLAN_DEFAULTS} />
      <div className="cash-pair">
        <View id="sum-first12" title={M.first12Title} intro={M.first12Short} rows={first12} opt={opt} mark={{ index: 8, text: "Revenue starts" }} compact />
        <View id="sum-year1" title={M.year1Title} intro={M.year1Short} rows={year1} opt={opt} opening={-buildCost(PLAN_DEFAULTS)} compact />
      </div>
      <p className="small"><Link href="/model">Change the settings, timeframe and hires on the financial model →</Link></p>
    </>
  );
}
