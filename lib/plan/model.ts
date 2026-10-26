// The financial model: pure functions, no React. scripts/check-plan.ts runs these in Node.

export type Inputs = {
  signed: number; // paying communities signed by month 12 (before churn)
  alpha: number; // alpha communities converting at month 1
  mix: number; // % of new communities on Community Life
  websitePrice: number;
  clPrice: number;
  foundingPrice: number;
  churn: number; // % of paying communities lost each month
  runCost: number; // running cost + card fees per community per month
  perOrg: number; // average communities per organisation
  p1Fixed: number; // Phase 1 build and alpha cost per month, Nov 2026 – Jun 2027 (Catapult pays)
  p2Fixed: number; // Phase 2 fixed monthly cost before Adam is paid
  adam: number; // Adam's monthly cost once paid
  p3Fixed: number; // Phase 3 fixed monthly cost
  catapultCovers: boolean;
};

export const PLAN_DEFAULTS: Inputs = {
  signed: 80,
  alpha: 12,
  mix: 80,
  websitePrice: 349,
  clPrice: 649,
  foundingPrice: 519,
  churn: 1,
  runCost: 59,
  perOrg: 5,
  p1Fixed: 3400,
  p2Fixed: 21970,
  adam: 6300,
  p3Fixed: 35770,
  catapultCovers: true,
};

export const MONTH_NAMES = ["Jul 2027", "Aug 2027", "Sep 2027", "Oct 2027", "Nov 2027", "Dec 2027", "Jan 2028", "Feb 2028", "Mar 2028", "Apr 2028", "May 2028", "Jun 2028"];

export type Month = { m: number; label: string; paying: number; revenue: number; cost: number; result: number; adamPaid: boolean };
export type Milestone = { name: string; n: number; revenue: number; cost: number; margin: number | null };

export function computeModel(inp: Inputs) {
  const extra = inp.catapultCovers ? 0 : 1500;
  const mix = inp.mix / 100, churn = inp.churn / 100;
  const fixedPre = inp.p2Fixed + extra;
  const fixedPost = inp.p2Fixed + inp.adam + extra;
  const avgPrice = mix * inp.clPrice + (1 - mix) * inp.websitePrice;
  const contrib = avgPrice - inp.runCost;
  const newTotal = Math.max(0, inp.signed - inp.alpha);
  const newPerMonth = newTotal / 11;

  let alphaN = inp.alpha, otherN = 0, cum = 0;
  let adamMonth: number | null = null;
  const months: Month[] = [];
  for (let m = 1; m <= 12; m++) {
    if (m > 1) { alphaN *= 1 - churn; otherN = otherN * (1 - churn) + newPerMonth; }
    const paying = alphaN + otherN;
    const revenue = alphaN * inp.foundingPrice + otherN * avgPrice;
    const running = paying * inp.runCost;
    if (adamMonth === null && revenue - running >= fixedPost) adamMonth = m;
    const fixed = adamMonth !== null ? fixedPost : fixedPre;
    const cost = fixed + running;
    const result = revenue - cost;
    cum += result;
    months.push({ m, label: MONTH_NAMES[m - 1], paying, revenue, cost, result, adamPaid: adamMonth !== null });
  }
  const last = months[11];
  const be = (f: number) => (contrib > 0 ? Math.ceil(f / contrib) : Infinity);
  const breakEvenPre = be(fixedPre), breakEvenPost = be(fixedPost);

  const setupPerOrg = 2500 + 1000 * inp.perOrg + 1000 + mix * 250 * inp.perOrg;
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
    months, avgPrice, contrib, fixedPre, fixedPost, newPerMonth, newTotal,
    paying12: last.paying, revenue12: last.revenue, arr12: last.revenue * 12,
    cost12: last.cost, result12: last.result, margin12: last.revenue > 0 ? last.result / last.revenue : 0,
    adamMonth, cumResult: cum, breakEvenPre, breakEvenPost,
    setupCash, orgs, orgsPerMonth: orgs / 11, phases,
  };
}

export type ModelResult = ReturnType<typeof computeModel>;

// ---- Month by month, with setup fees and the First 10 Organisations credit ----

export type CashOptions = {
  includeSetup: boolean; // count one-time setup fees as income in the month they're paid
  creditFirst10: boolean; // First 10 Organisations offer: their setup is credited back, so it isn't kept
};

export type CashRow = {
  label: string; phase: string; paying: number; revenue: number;
  setup: number; credit: number; cost: number; result: number; cum: number;
};

export const CREDIT_ORGS = 10; // the offer covers the first 10 paying organisations…
export const CREDIT_COMMUNITIES = 100; // …up to 100 communities in total

const BUILD_MONTHS = ["Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027"];

// Year-1 rows (Jul 2027 – Jun 2028). New organisations sign from month 2 and pay setup up front.
// With the credit on, setup from the first 10 organisations (up to 100 communities) is shown
// as owed back: we collect it now but credit it against their second year, so it isn't ours to keep.
export function year1Cash(inp: Inputs, opt: CashOptions): CashRow[] {
  const r = computeModel(inp);
  const mix = inp.mix / 100;
  const setupPerOrg = 2500 + 1000 * inp.perOrg + 1000 + mix * 250 * inp.perOrg;
  const creditOrgCap = Math.min(CREDIT_ORGS, CREDIT_COMMUNITIES / inp.perOrg);
  let orgsSoFar = 0, cum = 0;
  return r.months.map((m) => {
    const newOrgs = m.m > 1 ? r.newPerMonth / inp.perOrg : 0;
    const credited = Math.max(0, Math.min(newOrgs, creditOrgCap - orgsSoFar));
    orgsSoFar += newOrgs;
    const setup = opt.includeSetup ? newOrgs * setupPerOrg : 0;
    const credit = opt.includeSetup && opt.creditFirst10 ? credited * setupPerOrg : 0;
    const result = m.revenue + setup - credit - m.cost;
    cum += result;
    return { label: m.label, phase: `Year 1 · M${m.m}`, paying: m.paying, revenue: m.revenue, setup, credit, cost: m.cost, result, cum };
  });
}

// The first 12 calendar months from development start: 8 months of build and alpha
// (no revenue; alpha is free), then the first 4 months of Year 1.
export function first12Cash(inp: Inputs, opt: CashOptions): CashRow[] {
  let cum = 0;
  const build = BUILD_MONTHS.map((label, i): CashRow => {
    const result = -inp.p1Fixed;
    cum += result;
    return { label, phase: i < 4 ? "Build" : "Alpha live", paying: 0, revenue: 0, setup: 0, credit: 0, cost: inp.p1Fixed, result, cum };
  });
  const y1 = year1Cash(inp, opt).slice(0, 4).map((row) => {
    cum += row.result;
    return { ...row, cum };
  });
  return [...build, ...y1];
}

export function cashTotals(rows: CashRow[]) {
  const sum = (k: keyof CashRow) => rows.reduce((a, r) => a + (r[k] as number), 0);
  const low = rows.reduce((a, r) => (r.cum < a.cum ? r : a), rows[0]);
  return { revenue: sum("revenue"), setup: sum("setup"), credit: sum("credit"), cost: sum("cost"), result: sum("result"), low };
}

// The plan's published numbers. The model must reproduce them (±1 community, ±2%).
export function runPlanChecks() {
  const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
  const pct = (a: number, b: number) => Math.abs(a - b) <= Math.abs(b) * 0.02;
  const d = computeModel(PLAN_DEFAULTS);
  const s50 = computeModel({ ...PLAN_DEFAULTS, signed: 50 });
  const s110 = computeModel({ ...PLAN_DEFAULTS, signed: 110 });
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
