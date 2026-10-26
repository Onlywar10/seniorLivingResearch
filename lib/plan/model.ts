// The financial model: pure functions, no React. scripts/check-plan.ts runs these in Node.

export type Inputs = {
  signed: number; // paying communities signed by month 12 (before churn)
  alpha: number; // alpha communities converting at month 1
  alphaMix: number; // % of alpha communities on Community Life (the rest on Website), at founding prices
  mix: number; // % of new communities on Community Life
  websitePrice: number;
  clPrice: number;
  foundingPrice: number;
  churn: number; // % of paying communities lost each month
  runCost: number; // running cost + card fees per community per month
  perOrg: number; // average communities per organisation
  p1Fixed: number; // Phase 1 build and alpha cost per month, Nov 2026 – Jun 2027 (Catapult pays)
  p2Fixed: number; // Phase 2 fixed monthly cost before Adam is paid (written plan only: everyone hired at launch)
  staged: boolean; // bring Adam on full-time, then Hubert, then the sales associate, each once revenue covers them
  otherFixed: number; // non-staff monthly costs from launch: tools, ads, trade shows, travel
  hubertPT: number; // Hubert part-time (contractor) until he goes full-time
  hubertFT: number; // Hubert full-time: $62k salary plus taxes and health
  salesCost: number; // sales associate: $60k base plus taxes and health
  commission: number; // % commission on first-year contract value of new communities, once the sales associate starts
  adam: number; // Adam's monthly cost once paid
  p3Fixed: number; // Phase 3 fixed monthly cost
  catapultCovers: boolean;
};

export const PLAN_DEFAULTS: Inputs = {
  signed: 80,
  alpha: 20,
  alphaMix: 80,
  mix: 80,
  websitePrice: 349,
  clPrice: 649,
  foundingPrice: 519,
  churn: 1,
  runCost: 59,
  perOrg: 5,
  p1Fixed: 3400,
  p2Fixed: 21970,
  staged: true,
  otherFixed: 4170,
  hubertPT: 2400,
  hubertFT: 6200,
  salesCost: 6200,
  commission: 10,
  adam: 5600, // $62k salary plus payroll taxes (the plan loaded $70k to $6,300, about 8%)
  p3Fixed: 35770,
  catapultCovers: true,
};

export const MONTH_NAMES = ["Jul 2027", "Aug 2027", "Sep 2027", "Oct 2027", "Nov 2027", "Dec 2027", "Jan 2028", "Feb 2028", "Mar 2028", "Apr 2028", "May 2028", "Jun 2028"];

// Staged hiring: who joins full-time, in the order the plan wants them.
export type StaffKey = "hubert" | "sales" | "adam";
export const STAFF_ORDER: StaffKey[] = ["adam", "hubert", "sales"];
// Month each person starts full-time: 1–12 = Year 1 month, 13 = after Year 1. Missing = automatic
// (the first month revenue, after every existing cost, also covers them).
export type Hires = Partial<Record<StaffKey, number>>;
export const AFTER_YEAR_1 = 13;

export type Month = { m: number; label: string; paying: number; revenue: number; setup: number; credit: number; fixed: number; running: number; cost: number; result: number; adamPaid: boolean; starts: StaffKey[] };
export type Milestone = { name: string; n: number; revenue: number; cost: number; margin: number | null };

// cash: whether one-time setup fees (less any First 10 credit) count as income. When they do,
// they also count towards whether a month can cover the next hire.
export function computeModel(inp: Inputs, hires: Hires = {}, cash: CashOptions = NO_SETUP) {
  const extra = inp.catapultCovers ? 0 : 1500;
  const mix = inp.mix / 100, churn = inp.churn / 100;
  const avgPrice = mix * inp.clPrice + (1 - mix) * inp.websitePrice;
  // Commission at the planned signing rate, for break-even maths.
  const planCommission = (Math.max(0, inp.signed - inp.alpha) / 11) * avgPrice * 12 * (inp.commission / 100);
  const fullTeam = inp.otherFixed + inp.hubertFT + inp.salesCost + planCommission + extra;
  const fixedPre = inp.staged ? fullTeam : inp.p2Fixed + extra;
  const fixedPost = inp.staged ? fullTeam + inp.adam : inp.p2Fixed + inp.adam + extra;
  const contrib = avgPrice - inp.runCost;
  // Alpha communities pay founding prices: Community Life $519, Website at list.
  const alphaPrice = (inp.alphaMix / 100) * inp.foundingPrice + (1 - inp.alphaMix / 100) * inp.websitePrice;
  const newTotal = Math.max(0, inp.signed - inp.alpha);
  const newPerMonth = newTotal / 11;
  const setupPerOrg = 2500 + 1000 * inp.perOrg + 1000 + mix * 250 * inp.perOrg;
  const creditOrgCap = Math.min(CREDIT_ORGS, CREDIT_COMMUNITIES / inp.perOrg);
  let orgsSoFar = 0;

  let alphaN = inp.alpha, otherN = 0, cum = 0;
  let adamMonth: number | null = null;
  const hired: Record<StaffKey, number | null> = { hubert: null, sales: null, adam: null };
  const months: Month[] = [];
  for (let m = 1; m <= 12; m++) {
    if (m > 1) { alphaN *= 1 - churn; otherN = otherN * (1 - churn) + newPerMonth; }
    const paying = alphaN + otherN;
    const revenue = alphaN * alphaPrice + otherN * avgPrice;
    const running = paying * inp.runCost;
    // Setup fees: new organisations pay up front in the month they sign (from month 2).
    const newOrgs = m > 1 ? newPerMonth / inp.perOrg : 0;
    const credited = Math.max(0, Math.min(newOrgs, creditOrgCap - orgsSoFar));
    orgsSoFar += newOrgs;
    const setup = cash.includeSetup ? newOrgs * setupPerOrg : 0;
    const credit = cash.includeSetup && cash.creditFirst10 ? credited * setupPerOrg : 0;
    let fixed: number;
    const starts: StaffKey[] = [];
    if (inp.staged) {
      const commissionNow = (m > 1 ? newPerMonth : 0) * avgPrice * 12 * (inp.commission / 100);
      const staff = () => (hired.hubert ? inp.hubertFT : inp.hubertPT) + (hired.sales ? inp.salesCost + commissionNow : 0) + (hired.adam ? inp.adam : 0);
      const extraCost = (k: StaffKey) => (k === "hubert" ? inp.hubertFT - inp.hubertPT : k === "sales" ? inp.salesCost + commissionNow : inp.adam);
      const start = (k: StaffKey) => { hired[k] = m; starts.push(k); };
      // Chosen months first, then automatic hires in order, each only once revenue covers it.
      for (const k of STAFF_ORDER) if (hired[k] === null && hires[k] === m) start(k);
      for (const k of STAFF_ORDER) {
        if (hired[k] !== null || hires[k] !== undefined) continue;
        const earlier = STAFF_ORDER.slice(0, STAFF_ORDER.indexOf(k));
        if (earlier.some((e) => hired[e] === null)) break;
        if (revenue + setup - credit - running - inp.otherFixed - extra - staff() >= extraCost(k)) start(k); else break;
      }
      fixed = inp.otherFixed + extra + staff();
      adamMonth = hired.adam;
    } else {
      if (adamMonth === null && revenue - running >= fixedPost) { adamMonth = m; starts.push("adam"); }
      fixed = adamMonth !== null ? fixedPost : fixedPre;
    }
    const cost = fixed + running;
    const result = revenue - cost;
    cum += result;
    months.push({ m, label: MONTH_NAMES[m - 1], paying, revenue, setup, credit, fixed, running, cost, result, adamPaid: adamMonth !== null, starts });
  }
  const last = months[11];
  const be = (f: number) => (contrib > 0 ? Math.ceil(f / contrib) : Infinity);
  const breakEvenPre = be(fixedPre), breakEvenPost = be(fixedPost);

  const orgs = newTotal / inp.perOrg;
  const setupCash = orgs * setupPerOrg;

  const milestone = (name: string, n: number, revenue: number, cost: number): Milestone => ({ name, n, revenue, cost, margin: revenue > 0 ? (revenue - cost) / revenue : null });
  const nEob = avgPrice > 0 ? Math.ceil(50000 / avgPrice) : 0;
  const n1m = avgPrice > 0 ? Math.ceil(1e6 / 12 / avgPrice) : 0;
  const bePaid = isFinite(breakEvenPost);
  const phases = [
    milestone("Phase 1 · build and alpha", 0, 0, inp.p1Fixed),
    milestone("Phase 2 · break-even", breakEvenPost, bePaid ? breakEvenPost * avgPrice : 0, bePaid ? fixedPost + breakEvenPost * inp.runCost : 0),
    milestone("End of beta · $600k ARR", nEob, 50000, fixedPost + nEob * inp.runCost),
    milestone("Phase 3 · $1M ARR spin-out", n1m, 1e6 / 12, inp.p3Fixed + extra + n1m * inp.runCost),
  ];

  return {
    months, avgPrice, alphaPrice, contrib, fixedPre, fixedPost, newPerMonth, newTotal,
    paying12: last.paying, revenue12: last.revenue, arr12: last.revenue * 12,
    cost12: last.cost, result12: last.result, margin12: last.revenue > 0 ? last.result / last.revenue : 0,
    adamMonth, hired, cumResult: cum, breakEvenPre, breakEvenPost,
    setupCash, orgs, orgsPerMonth: orgs / 11, phases,
  };
}

export type ModelResult = ReturnType<typeof computeModel>;

// ---- Month by month, with setup fees and the First 10 Organisations credit ----

export const NO_SETUP: CashOptions = { includeSetup: false, creditFirst10: false };
export const DEFAULT_CASH: CashOptions = { includeSetup: true, creditFirst10: false };

export type CashOptions = {
  includeSetup: boolean; // count one-time setup fees as income in the month they're paid
  creditFirst10: boolean; // First 10 Organisations offer: their setup is credited back, so it isn't kept
};

export type CashRow = {
  label: string; phase: string; paying: number; revenue: number;
  setup: number; credit: number; fixed: number; running: number; cost: number; result: number; cum: number;
};

export const CREDIT_ORGS = 10; // the offer covers the first 10 paying organisations…
export const CREDIT_COMMUNITIES = 100; // …up to 100 communities in total

const BUILD_MONTHS = ["Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027"];

// Year-1 rows (Jul 2027 – Jun 2028). New organisations sign from month 2 and pay setup up front.
// With the credit on, setup from the first 10 organisations (up to 100 communities) is shown
// as owed back: we collect it now but credit it against their second year, so it isn't ours to keep.
const STARTS_LABEL: Record<StaffKey, string> = { hubert: "Hubert full-time", sales: "sales associate starts", adam: "Adam paid" };

// What the build and alpha months (Nov 2026 – Jun 2027) cost before any revenue: the debt Year 1 starts with.
export const buildCost = (inp: Inputs) => BUILD_MONTHS.length * inp.p1Fixed;

// opening: the running total carried into July (pass −buildCost to start Year 1 from the build debt).
export function year1Cash(inp: Inputs, opt: CashOptions, hires: Hires = {}, opening = 0): CashRow[] {
  const r = computeModel(inp, hires, opt);
  let cum = opening;
  return r.months.map((m) => {
    const { setup, credit } = m;
    const result = m.revenue + setup - credit - m.cost;
    cum += result;
    return { label: m.label, phase: [`Year 1 · M${m.m}`, ...m.starts.map((k) => STARTS_LABEL[k])].join(" · "), paying: m.paying, revenue: m.revenue, setup, credit, fixed: m.fixed, running: m.running, cost: m.cost, result, cum };
  });
}

// The first 12 calendar months from development start: 8 months of build and alpha
// (no revenue; alpha is free), then the first 4 months of Year 1.
export function first12Cash(inp: Inputs, opt: CashOptions, hires: Hires = {}): CashRow[] {
  let cum = 0;
  const build = BUILD_MONTHS.map((label, i): CashRow => {
    const result = -inp.p1Fixed;
    cum += result;
    return { label, phase: i < 4 ? "Build" : "Alpha live", paying: 0, revenue: 0, setup: 0, credit: 0, fixed: inp.p1Fixed, running: 0, cost: inp.p1Fixed, result, cum };
  });
  const y1 = year1Cash(inp, opt, hires).slice(0, 4).map((row) => {
    cum += row.result;
    return { ...row, cum };
  });
  return [...build, ...y1];
}

export function cashTotals(rows: CashRow[]) {
  const sum = (k: keyof CashRow) => rows.reduce((a, r) => a + (r[k] as number), 0);
  const low = rows.reduce((a, r) => (r.cum < a.cum ? r : a), rows[0]);
  const start = rows[0].cum - rows[0].result, end = rows[rows.length - 1].cum;
  return { revenue: sum("revenue"), setup: sum("setup"), credit: sum("credit"), fixed: sum("fixed"), running: sum("running"), cost: sum("cost"), result: sum("result"), low, start, end };
}

// The written business plan assumed 12 alpha communities, all on Community Life at $519.
// The checks run the model with those inputs to prove the method still reproduces the plan.
// It also hired the whole Phase 2 team at launch rather than in stages.
export const WRITTEN_PLAN: Inputs = { ...PLAN_DEFAULTS, alpha: 12, alphaMix: 100, staged: false, adam: 6300 };

// The plan's published numbers. The model must reproduce them (±1 community, ±2%).
export function runPlanChecks() {
  const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
  const pct = (a: number, b: number) => Math.abs(a - b) <= Math.abs(b) * 0.02;
  const d = computeModel(WRITTEN_PLAN);
  const s50 = computeModel({ ...WRITTEN_PLAN, signed: 50 });
  const s110 = computeModel({ ...WRITTEN_PLAN, signed: 110 });
  const checks: [string, number | null, boolean][] = [
    ["Expected: ≈75 paying at month 12", d.paying12, near(d.paying12, 75, 1)],
    ["Expected: ARR ≈$524k", d.arr12, pct(d.arr12, 524000)],
    ["Expected: monthly cost ≈$32.7k", d.cost12, pct(d.cost12, 32700)],
    ["Expected: monthly result ≈+$11.0k", d.result12, pct(d.result12, 11000)],
    ["Expected: margin ≈25%", d.margin12, Math.abs(d.margin12 - 0.25) <= 0.02],
    ["Expected: Adam covered from month 9", d.adamMonth, d.adamMonth === 9],
    ["Expected: Year-1 operating result ≈−$17k", d.cumResult, pct(d.cumResult, -17000)],
    ["Expected: setup cash ≈$129k", d.setupCash, pct(d.setupCash, 129000)],
    ["Slow (50 signed): ≈47 paying", s50.paying12, near(s50.paying12, 47, 1)],
    ["Slow (50 signed): ARR ≈$322k", s50.arr12, pct(s50.arr12, 322000)],
    ["Fast (110 signed): ≈104 paying", s110.paying12, near(s110.paying12, 104, 1)],
    ["Fast (110 signed): ARR ≈$726k", s110.arr12, pct(s110.arr12, 726000)],
  ];
  const list = checks.map(([name, value, pass]) => ({ name, value, pass }));
  return { pass: list.every((c) => c.pass), checks: list };
}

// Every month the model covers, Nov 2026 – Jun 2028: build and alpha, then Year 1, with one
// running total throughout. The financial model page shows any window of these.
export function allMonths(inp: Inputs, opt: CashOptions, hires: Hires = {}): CashRow[] {
  const build = first12Cash(inp, opt, hires).slice(0, BUILD_MONTHS.length);
  return [...build, ...year1Cash(inp, opt, hires, -buildCost(inp))];
}
