"use client";

import { useRef, useState } from "react";
import { ROLLOUT, ROLLOUT_MONTHS, ROLLOUT_ROWS, ROLLOUT_START, type RolloutPhase } from "@/lib/plan/rollout";

const COL = 92; // px per month on the calendar
const monthOf = (i: number) => new Date(ROLLOUT_START.year, ROLLOUT_START.month + i, 1);
const short = (i: number) => monthOf(i).toLocaleString("en-US", { month: "short" });
const when = (p: RolloutPhase) => {
  const a = monthOf(p.from), b = monthOf(p.to);
  const f = (d: Date) => `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
  return p.from === p.to ? f(a) : `${f(a)} – ${f(b)}`;
};
// Phases in calendar order, for previous / next.
const ORDER = [...ROLLOUT].sort((a, b) => a.from - b.from || a.row - b.row);

export function RolloutCalendar() {
  const [selected, setSelected] = useState("p1");
  const scroller = useRef<HTMLDivElement>(null);
  const phase = ROLLOUT.find((p) => p.id === selected)!;
  const idx = ORDER.findIndex((p) => p.id === selected);

  const select = (id: string) => {
    setSelected(id);
    const p = ROLLOUT.find((x) => x.id === id)!;
    const el = scroller.current;
    if (el) el.scrollTo({ left: Math.max(0, p.from * COL - el.clientWidth / 3), behavior: "smooth" });
  };
  const scrollBy = (dir: number) => scroller.current?.scrollBy({ left: dir * COL * 4, behavior: "smooth" });

  return (
    <div className="rollout">
      <div className="rollout-bar">
        <div className="rollout-legend">
          <span><i className="k-build" />Build</span><span><i className="k-alpha" />Alpha customers</span><span><i className="k-beta" />Beta stages</span><span><i className="k-milestone" />Milestone</span>
        </div>
        <div className="rollout-nav">
          <button type="button" className="btn icon" aria-label="Scroll the calendar earlier" onClick={() => scrollBy(-1)}>←</button>
          <button type="button" className="btn icon" aria-label="Scroll the calendar later" onClick={() => scrollBy(1)}>→</button>
        </div>
      </div>

      <div className="rollout-scroll" ref={scroller} tabIndex={0} aria-label="Rollout calendar, Nov 2026 to Jun 2028. Scroll sideways; select a phase to see its details.">
        <div className="rollout-grid" style={{ gridTemplateColumns: `repeat(${ROLLOUT_MONTHS}, ${COL}px)`, gridTemplateRows: `auto auto repeat(${ROLLOUT_ROWS.length}, 52px)` }}>
          {Array.from({ length: ROLLOUT_MONTHS }, (_, i) => {
            const d = monthOf(i);
            const newYear = i === 0 || d.getMonth() === 0;
            return (
              <div key={`m${i}`} className={`r-month ${i >= 8 ? "y1" : ""} ${newYear ? "newyear" : ""}`} style={{ gridColumn: i + 1, gridRow: "1 / span 2" }}>
                <span className="r-year">{newYear ? d.getFullYear() : ""}</span>
                <span>{short(i)}</span>
              </div>
            );
          })}
          {ROLLOUT_ROWS.map((label, r) => (
            <div key={label} className="r-lane" style={{ gridRow: r + 3, gridColumn: `1 / span ${ROLLOUT_MONTHS}` }} aria-hidden="true"><span>{label}</span></div>
          ))}
          {ROLLOUT.map((p) => (
            <button key={p.id} type="button" className={`r-item k-${p.kind} ${p.id === selected ? "on" : ""}`}
              style={{ gridRow: p.row + 3, gridColumn: p.kind === "milestone" ? `${p.from + 1} / span 2` : `${p.from + 1} / span ${p.to - p.from + 1}` }}
              aria-pressed={p.id === selected} aria-controls="rollout-detail" onClick={() => select(p.id)}>
              {p.kind === "milestone" ? <i aria-hidden="true" /> : null}
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <article id="rollout-detail" className={`rollout-detail k-${phase.kind}`} aria-live="polite">
        <div className="rd-head">
          <div>
            <span className="rd-when">{when(phase)}</span>
            <h3>{phase.title}</h3>
          </div>
          <div className="rd-nav">
            <button type="button" className="btn" disabled={idx <= 0} onClick={() => select(ORDER[idx - 1].id)}>← Previous</button>
            <button type="button" className="btn" disabled={idx >= ORDER.length - 1} onClick={() => select(ORDER[idx + 1].id)}>Next →</button>
          </div>
        </div>
        <p className="rd-summary">{phase.summary}</p>
        {phase.plans ? <p className="rd-plans"><b>Plans:</b> {phase.plans}</p> : null}
        {phase.sections.map((s) => (
          <div key={s.heading} className="rd-section">
            <h4>{s.heading}</h4>
            <ul className="ticks">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </article>
    </div>
  );
}
