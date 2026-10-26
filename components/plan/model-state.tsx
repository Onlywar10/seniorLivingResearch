"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { computeModel, PLAN_DEFAULTS, type Inputs, type ModelResult } from "@/lib/plan/model";

type ModelState = {
  state: Inputs;
  setState: React.Dispatch<React.SetStateAction<Inputs>>;
  plan: ModelResult;
  r: ModelResult;
  sc: { s: number; r: ModelResult }[];
  changed: boolean;
};

const Ctx = createContext<ModelState | null>(null);

// Lives in the root layout, so the reader's settings carry from /model to /scenarios.
export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Inputs>(PLAN_DEFAULTS);
  const plan = useMemo(() => computeModel(PLAN_DEFAULTS), []);
  const r = useMemo(() => computeModel(state), [state]);
  const sc = useMemo(() => [50, 80, 110].map((s) => ({ s, r: computeModel({ ...state, signed: s }) })), [state]);
  const changed = (Object.keys(PLAN_DEFAULTS) as (keyof Inputs)[]).some((k) => state[k] !== PLAN_DEFAULTS[k]);

  // Print always shows the plan's defaults, then restores the reader's settings.
  useEffect(() => {
    let saved: Inputs | null = null;
    const before = () => { flushSync(() => setState((s) => { saved = s; return PLAN_DEFAULTS; })); };
    const after = () => { if (saved) setState(saved); saved = null; };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, []);

  return <Ctx.Provider value={{ state, setState, plan, r, sc, changed }}>{children}</Ctx.Provider>;
}

export function useModel() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useModel must be used inside ModelProvider");
  return v;
}
