"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { computeModel, DEFAULT_CASH, PLAN_DEFAULTS, yearOneMonth, type CashOptions, type Hires, type Inputs, type ModelResult } from "@/lib/plan/model";

// The chosen period, as positions in the Nov 2026 – Jun 2028 month list.
export type Window = { from: number; to: number };
export const DEFAULT_WINDOW: Window = { from: 0, to: 11 }; // the first 12 months: Nov 2026 – Oct 2027

type ModelState = {
  state: Inputs;
  setState: React.Dispatch<React.SetStateAction<Inputs>>;
  hires: Hires;
  setHires: React.Dispatch<React.SetStateAction<Hires>>;
  cashOpt: CashOptions;
  setCashOpt: React.Dispatch<React.SetStateAction<CashOptions>>;
  win: Window;
  setWin: (w: Window | ((w: Window) => Window)) => void;
  end: number; // Year-1 month the period ends on (≤ 0: before sales start)
  plan: ModelResult; // the plan's own settings, over the same period
  r: ModelResult;
};

const Ctx = createContext<ModelState | null>(null);

// Lives in the root layout, so the reader's settings, hiring plan and period carry between pages.
export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Inputs>(PLAN_DEFAULTS);
  const [hires, setHires] = useState<Hires>({});
  // Setup fees count by default, and feed into when each person can be hired.
  const [cashOpt, setCashOpt] = useState<CashOptions>(DEFAULT_CASH);
  const [win, setWinRaw] = useState<Window>(DEFAULT_WINDOW);
  const end = yearOneMonth(Math.max(win.from, win.to));
  // A target is "by the end of the period", so a new period starts again from the plan's pace.
  const setWin = useCallback((w: Window | ((w: Window) => Window)) => {
    setWinRaw(w);
    setState((s) => (s.target === null ? s : { ...s, target: null }));
  }, []);
  const plan = useMemo(() => computeModel(PLAN_DEFAULTS, {}, DEFAULT_CASH, end), [end]);
  const r = useMemo(() => computeModel(state, hires, cashOpt, end), [state, hires, cashOpt, end]);

  // Print always shows the plan's defaults, then restores the reader's settings.
  useEffect(() => {
    let saved: Inputs | null = null;
    const before = () => { flushSync(() => setState((s) => { saved = s; return PLAN_DEFAULTS; })); };
    const after = () => { if (saved) setState(saved); saved = null; };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, []);

  return <Ctx.Provider value={{ state, setState, hires, setHires, cashOpt, setCashOpt, win, setWin, end, plan, r }}>{children}</Ctx.Provider>;
}

export function useModel() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useModel must be used inside ModelProvider");
  return v;
}
