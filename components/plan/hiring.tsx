"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { AFTER_YEAR_1, computeModel, MONTH_NAMES, STAFF_ORDER, type Inputs, type StaffKey } from "@/lib/plan/model";
import { fmt$ } from "@/lib/plan/format";
import { useModel } from "./model-state";

const SLOTS = [...MONTH_NAMES.map((n) => n.replace(" 20", " ’")), "Later"]; // 12 Year-1 months + after Year 1

const PEOPLE: Record<StaffKey, { name: string; role: string; salary: string; cost: (i: Inputs) => string; tone: string }> = {
  hubert: { name: "Hubert", role: "Developer, full-time", salary: "$62k salary", cost: (i) => `${fmt$(i.hubertFT)}/mo (part-time ${fmt$(i.hubertPT)} until then)`, tone: "#2563eb" },
  sales: { name: "Sales associate", role: "Demos, proposals, closing", salary: "$55k base + commission", cost: (i) => `${fmt$(i.salesCost)}/mo + ${i.commission}% of their communities’ monthly fees`, tone: "#9333ea" },
  adam: { name: "Adam", role: "Head of Senior Living", salary: "$62k salary", cost: (i) => `${fmt$(i.adam)}/mo`, tone: "#ea580c" },
};

function PersonIcon({ k, size = 30 }: { k: StaffKey; size?: number }) {
  return (
    <span className="hire-avatar" style={{ width: size, height: size, background: PEOPLE[k].tone }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
        <circle cx="12" cy="8" r="4" fill="#fff" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#fff" />
      </svg>
    </span>
  );
}

const slotLabel = (slot: number) => (slot === AFTER_YEAR_1 ? "after Year 1" : MONTH_NAMES[slot - 1]);

// Drag each person to the month they start full-time. A faint marker shows the month revenue
// would first cover them; "Reset to automatic" puts everyone back on that rule.
export function HiringPlanner({ inputs, compact = false }: { inputs: Inputs; compact?: boolean }) {
  const { hires, setHires, cashOpt } = useModel();
  const auto = useMemo(() => computeModel(inputs, {}, cashOpt).hired, [inputs, cashOpt]);
  const actual = useMemo(() => computeModel(inputs, hires, cashOpt).hired, [inputs, hires, cashOpt]);
  const anyChosen = STAFF_ORDER.some((k) => hires[k] !== undefined);
  const set = (k: StaffKey, slot: number | undefined) => setHires((h) => {
    const next = { ...h };
    if (slot === undefined) delete next[k]; else next[k] = Math.max(1, Math.min(AFTER_YEAR_1, slot));
    return next;
  });

  return (
    <div className={`hiring ${compact ? "compact" : ""}`}>
      <div className="hiring-top">
        <div>
          {compact ? null : <h3>Who joins full-time, and when</h3>}
          <p className="muted small">{compact ? "Drag each person to the month they start full-time. Left alone, each starts the first month revenue covers them (Adam, then Hubert, then the sales associate); the faint dot marks that month." : null}{compact ? null : <>Drag each person to the month they start. Left alone, each starts the first month revenue covers them, in order: Adam, then Hubert, then the sales associate. Setup fees count towards that when they’re switched on. The faint dot marks that month.</>}</p>
        </div>
        <button type="button" className="btn" disabled={!anyChosen} onClick={() => setHires({})}>Reset to automatic</button>
      </div>
      <div className="hire-grid" role="group" aria-label="Hiring months">
        <div className="hire-head" aria-hidden="true">
          <span />
          <div className="hire-slots">{SLOTS.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
        {STAFF_ORDER.map((k) => (
          <HireRow key={k} k={k} inputs={inputs} slot={actual[k] ?? AFTER_YEAR_1} autoSlot={auto[k] ?? AFTER_YEAR_1} chosen={hires[k] !== undefined}
            onMove={(slot) => set(k, slot)} onAuto={() => set(k, undefined)} />
        ))}
      </div>
    </div>
  );
}

function HireRow({ k, inputs, slot, autoSlot, chosen, onMove, onAuto }: {
  k: StaffKey; inputs: Inputs; slot: number; autoSlot: number; chosen: boolean;
  onMove: (slot: number) => void; onAuto: () => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const p = PEOPLE[k];
  const slotAt = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return Math.max(1, Math.min(AFTER_YEAR_1, Math.floor(((clientX - r.left) / r.width) * AFTER_YEAR_1) + 1));
  };
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onMove(slotAt(e.clientX));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) onMove(slotAt(e.clientX));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
    if (e.key in step) { e.preventDefault(); onMove(slot + step[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); onMove(1); }
    else if (e.key === "End") { e.preventDefault(); onMove(AFTER_YEAR_1); }
    else if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); onAuto(); }
  };
  const pos = (s: number) => `calc(${((s - 0.5) / AFTER_YEAR_1) * 100}% )`;

  return (
    <div className="hire-row">
      <div className="hire-who">
        <PersonIcon k={k} />
        <div>
          <b>{p.name}</b>
          <span>{p.salary} · {p.cost(inputs)}</span>
          <span className={chosen ? "hire-status chosen" : "hire-status"}>
            {slot === AFTER_YEAR_1 ? "Not in Year 1" : `From ${slotLabel(slot)}`} · {chosen ? <button type="button" className="linkish" onClick={onAuto}>your choice, undo</button> : "when revenue covers it"}
          </span>
        </div>
      </div>
      <div className="hire-track" ref={track} onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
        {SLOTS.map((s, i) => <span key={s} className={`hire-cell ${i + 1 >= slot ? "on" : ""}`} style={{ "--tone": p.tone } as React.CSSProperties} />)}
        {chosen && autoSlot !== slot ? <span className="hire-ghost" style={{ left: pos(autoSlot), borderColor: p.tone }} title={`Revenue covers ${p.name} from ${slotLabel(autoSlot)}`} /> : null}
        <span className="hire-chip" role="slider" tabIndex={0}
          aria-label={`${p.name} starts full-time`} aria-valuemin={1} aria-valuemax={AFTER_YEAR_1} aria-valuenow={slot}
          aria-valuetext={slot === AFTER_YEAR_1 ? "after Year 1" : slotLabel(slot)}
          style={{ left: pos(slot) }} onKeyDown={onKeyDown}>
          <PersonIcon k={k} size={34} />
        </span>
      </div>
    </div>
  );
}

// The summary's read-only view of the hiring plan: who starts full-time, when, and what they cost.
// Changes are made on the Month by month page.
export function HiringDisplay({ inputs }: { inputs: Inputs }) {
  const { hires, cashOpt } = useModel();
  const actual = useMemo(() => computeModel(inputs, hires, cashOpt).hired, [inputs, hires, cashOpt]);
  const anyChosen = STAFF_ORDER.some((k) => hires[k] !== undefined);
  return (
    <div className="hiring-display">
      <h3>Who joins full-time, and when</h3>
      <ul>
        {STAFF_ORDER.map((k) => {
          const slot = actual[k];
          return (
            <li key={k}>
              <PersonIcon k={k} size={26} />
              <div>
                <b>{PEOPLE[k].name}</b>
                <span>{slot ? `From ${MONTH_NAMES[slot - 1]}` : "Not in Year 1"} · {PEOPLE[k].salary}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="muted small">
        {anyChosen ? "Using the start months set on the financial model page." : "Each starts the first month revenue (and setup fees) covers them."}{" "}
        <Link href="/model">Change start months →</Link>
      </p>
    </div>
  );
}
