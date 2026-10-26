// The financial model: pure functions, no React. scripts/check-plan.ts runs these in Node.

export type Curve = "linear" | "exponential" | "scurve";

export type Inputs = {
  signed: number; // written plan only: communities signed by Jun 2028 (before churn), used when planPaying is null
  planPaying: number | null; // the plan's pace: paying communities by Jun 2028. Sets the default target
  waitlist: number; // beta waitlist: communities that join at the beta launch (Jul 2027), with setup fees
  target: number | null; // paying communities wanted at the end of the chosen period; null = the plan's pace
  curve: Curve; // how new signings build up to the target
  growth: number; // % monthly growth in new signings, for the exponential curve
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
  tools: number; // software and tools, from launch
  ads: number; // ads and marketing programmes, from launch
  showsTravel: number; // trade shows ($10k a year) and travel ($10k a year), from launch
  hubertPT: number; // Hubert part-time (contractor) until he goes full-time
  hubertFT: number; // Hubert full-time: $62k salary plus taxes and health
  salesCost: number; // sales associate: $60k base plus taxes and health
  commission: number; // % commission on first-year contract value of new communities, once the sales associate starts
  adam: number; // Adam's monthly cost once paid
  p3Fixed: number; // Phase 3 (Year 2) fixed monthly cost
  catapultCovers: boolean;
  whole: boolean; // count whole communities (on); off only to reproduce the written plan’s fractional arithmetic
};

export const PLAN_DEFAULTS: Inputs = {
  signed: 80,
  planPaying: 100,
  waitlist: 30,
  target: null,
  curve: "linear",
  growth: 20,
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
  tools: 1000,
  ads: 1500,
  showsTravel: 1670,
  hubertPT: 2400,
  hubertFT: 6200,
  salesCost: 6200,
  commission: 10,
  adam: 5600, // $62k salary plus payroll taxes (the plan loaded $70k to $6,300, about 8%)
  p3Fixed: 29970, // the plan's $35,770 less Tim ($55k, about $5,800 a month): Tim is free for now
  catapultCovers: true,
  whole: true,
};

export const MONTH_NAMES = ["Jul 2027", "Aug 2027", "Sep 2027", "Oct 2027", "Nov 2027", "Dec 2027", "Jan 2028", "Feb 2028", "Mar 2028", "Apr 2028", "May 2028", "Jun 2028"];

// Staged hiring: who joins full-time, in the order the plan wants them.
export type StaffKey = "hubert" | "sales" | "adam";
export const STAFF_ORDER: StaffKey[] = ["adam", "hubert", "sales"];
// Month each person starts full-time: 1–12 = Year 1 month, 13 = after Year 1. Missing = automatic
// (the first month revenue, after every existing cost, also covers them).
export type Hires = Partial<Record<StaffKey, number>>;
export const AFTER_YEAR_1 = 13;

// One month's line items, for the month detail pop-up. Counts are communities; amounts are $ a month.
export type MonthDetail = {
  revenue: { label: string; count?: number; price?: number; amount: number }[];
  costs: { label: string; note?: string; amount: number; group: string }[];
};

export type Month = { m: number; label: string; paying: number; newSigned: number; revenue: number; setupGross: number; setup: number; credit: number; fixed: number; running: number; cost: number; result: number; adamPaid: boolean; starts: StaffKey[]; detail: MonthDetail };
export type Milestone = { name: string; n: number; revenue: number; cost: number; margin: number | null };

// Non-staff monthly costs from launch: tools, ads, trade shows and travel.
const nonStaff = (inp: Inputs) => inp.tools + inp.ads + inp.showsTravel;

// The plan's pace: new communities a month from Year-1 month 2. With planPaying set, it's the
// steady rate that reaches that many paying communities by Jun 2028 (after the alpha and waitlist
// communities and churn); otherwise the written plan's (signed − alpha − waitlist) ÷ 11.
const paceNew = (inp: Inputs) => {
  if (inp.planPaying === null) return Math.max(0, inp.signed - inp.alpha - inp.waitlist) / 11;
  const keep = 1 - inp.churn / 100;
  let reach = 0;
  for (let m = 2; m <= 12; m++) reach += keep ** (12 - m);
  return Math.max(0, (inp.planPaying - (inp.alpha + inp.waitlist) * keep ** 11) / reach);
};

// Paying communities at Year-1 month e if signings follow the plan's pace (the default target).
export function paceTarget(inp: Inputs, e: number) {
  if (e < 1) return 0;
  const keep = 1 - inp.churn / 100;
  let paying = (inp.alpha + inp.waitlist) * keep ** (e - 1);
  for (let m = 2; m <= e; m++) paying += paceNew(inp) * keep ** (e - m);
  return paying;
}

// New communities signed in each Year-1 month (index 1–12) so that paying communities reach the
// target at month e, shaped by the growth curve. Months after e carry on at month e's rate.
export function signings(inp: Inputs, e: number): number[] {
  const out = new Array(13).fill(0);
  const end = Math.min(12, Math.max(1, e));
  out[1] = inp.waitlist; // the beta waitlist joins at launch
  if (inp.target === null && inp.curve === "linear") {
    for (let m = 2; m <= 12; m++) out[m] = paceNew(inp);
    return out;
  }
  if (end < 2) return out;
  const keep = 1 - inp.churn / 100;
  const n = end - 1; // selling months in the period
  const g = inp.growth / 100;
  const weight = (k: number) =>
    inp.curve === "exponential" ? (1 + g) ** k
    : inp.curve === "scurve" ? 1 / (1 + Math.exp(-(k - (n - 1) / 2) * (6 / Math.max(1, n))))
    : 1;
  const w = Array.from({ length: n }, (_, k) => weight(k));
  const W = w.reduce((a, b) => a + b, 0);
  const target = inp.target ?? paceTarget(inp, end);
  const reach = w.reduce((a, wk, k) => a + (wk / W) * keep ** (end - (k + 2)), 0);
  const total = Math.max(0, (target - (inp.alpha + inp.waitlist) * keep ** (end - 1)) / reach);
  w.forEach((wk, k) => { out[k + 2] = (total * wk) / W; });
  for (let m = end + 1; m <= 12; m++) out[m] = out[end];
  return out;
}

// cash: whether one-time setup fees (less any beta-offer credit) count as income. When they do,
// they also count towards whether a month can cover the next hire.
// end: the Year-1 month the chosen period ends on (12 = Jun 2028; 0 or less = before sales start).
export function computeModel(inp: Inputs, hires: Hires = {}, cash: CashOptions = NO_SETUP, end = 12) {
  const e = Math.min(12, end);
  const sched = signings(inp, e);
  const sold = sched.slice(2, Math.max(2, e + 1));
  const joined = e >= 1 ? sched.slice(1, e + 1) : [];
  const avgNew = sold.length ? sold.reduce((a, b) => a + b, 0) / sold.length : paceNew(inp);
  const extra = inp.catapultCovers ? 0 : 1500;
  const mix = inp.mix / 100, churn = inp.churn / 100;
  const avgPrice = mix * inp.clPrice + (1 - mix) * inp.websitePrice;
  // Commission at the planned signing rate (the waitlist pays none), for break-even maths.
  const planCommission = avgNew * avgPrice * 12 * (inp.commission / 100);
  const fullTeam = nonStaff(inp) + inp.hubertFT + inp.salesCost + planCommission + extra;
  const fixedPre = inp.staged ? fullTeam : inp.p2Fixed + extra;
  const fixedPost = inp.staged ? fullTeam + inp.adam : inp.p2Fixed + inp.adam + extra;
  const contrib = avgPrice - inp.runCost;
  // Alpha communities pay founding prices: Community Life $519, Website at list.
  const alphaPrice = (inp.alphaMix / 100) * inp.foundingPrice + (1 - inp.alphaMix / 100) * inp.websitePrice;
  const newTotal = joined.reduce((a, b) => a + b, 0);
  const setupPerOrg = 2500 + 1000 * inp.perOrg + 1000 + mix * 250 * inp.perOrg;
  const creditOrgCap = CREDIT_COMMUNITIES / inp.perOrg;
  let orgsSoFar = 0;
  const discount = new Array(13 + 12).fill(0); // beta-offer discount due in each Year-1 month

  // Communities are whole: signings are rounded so the running total stays on schedule, and
  // churn removes a whole community each time the expected losses add up to one.
  const R = inp.whole ? Math.round : (x: number) => x;
  let alphaN = R(inp.alpha), otherN = 0;
  let signedSoFar = 0, signedExact = 0, lostA = 0, lostAExact = 0, lostO = 0, lostOExact = 0;
  let adamMonth: number | null = null;
  const hired: Record<StaffKey, number | null> = { hubert: null, sales: null, adam: null };
  const months: Month[] = [];
  for (let m = 1; m <= 12; m++) {
    signedExact += sched[m];
    const newSigned = R(signedExact) - signedSoFar;
    signedSoFar += newSigned;
    if (m > 1) {
      lostAExact += alphaN * churn; const la = R(lostAExact) - lostA; lostA += la; alphaN -= la;
      lostOExact += otherN * churn; const lo = R(lostOExact) - lostO; lostO += lo; otherN = otherN - lo + newSigned;
    } else otherN = newSigned;
    const paying = alphaN + otherN;
    const alphaCL = R(alphaN * (inp.alphaMix / 100)), otherCL = R(otherN * mix);
    const revenue = alphaCL * inp.foundingPrice + (alphaN - alphaCL) * inp.websitePrice + otherCL * inp.clPrice + (otherN - otherCL) * inp.websitePrice;
    const running = paying * inp.runCost;
    // Setup fees: new organisations pay up front in the month they sign (from month 2).
    const newOrgs = newSigned / inp.perOrg;
    const credited = Math.max(0, Math.min(newOrgs, creditOrgCap - orgsSoFar));
    orgsSoFar += newOrgs;
    if (cash.includeSetup && cash.creditFirst10 && credited > 0) {
      for (let k = 0; k < 12; k++) discount[m + k] += (credited * setupPerOrg) / 12;
    }
    const setupGross = newOrgs * setupPerOrg;
    const setup = cash.includeSetup ? setupGross : 0;
    const credit = discount[m];
    let fixed: number;
    const starts: StaffKey[] = [];
    let staffLines: MonthDetail["costs"] = [];
    if (inp.staged) {
      // Waitlist communities join without a sale, so no commission on them.
      const commissionNow = (m > 1 ? newSigned : 0) * avgPrice * 12 * (inp.commission / 100);
      const staff = () => (hired.hubert ? inp.hubertFT : inp.hubertPT) + (hired.sales ? inp.salesCost + commissionNow : 0) + (hired.adam ? inp.adam : 0);
      const extraCost = (k: StaffKey) => (k === "hubert" ? inp.hubertFT - inp.hubertPT : k === "sales" ? inp.salesCost + commissionNow : inp.adam);
      const start = (k: StaffKey) => { hired[k] = m; starts.push(k); };
      // Chosen months first, then automatic hires in order, each only once revenue covers it.
      for (const k of STAFF_ORDER) if (hired[k] === null && hires[k] === m) start(k);
      for (const k of STAFF_ORDER) {
        if (hired[k] !== null || hires[k] !== undefined) continue;
        const earlier = STAFF_ORDER.slice(0, STAFF_ORDER.indexOf(k));
        if (earlier.some((e) => hired[e] === null)) break;
        if (revenue + setup - credit - running - nonStaff(inp) - extra - staff() >= extraCost(k)) start(k); else break;
      }
      fixed = nonStaff(inp) + extra + staff();
      adamMonth = hired.adam;
      staffLines = [
        { group: "Team", label: "Adam", note: hired.adam ? "full-time" : "unpaid until revenue covers it", amount: hired.adam ? inp.adam : 0 },
        { group: "Team", label: "Hubert", note: hired.hubert ? "full-time" : "part-time contractor", amount: hired.hubert ? inp.hubertFT : inp.hubertPT },
        { group: "Team", label: "Sales associate", note: hired.sales ? "base pay" : "not hired yet", amount: hired.sales ? inp.salesCost : 0 },
        { group: "Team", label: "Sales commission", note: hired.sales ? `${inp.commission}% of first-year value on ${m > 1 ? newSigned : 0} new communities` : "—", amount: hired.sales ? commissionNow : 0 },
        { group: "Ads and marketing", label: "Ads and marketing programmes", amount: inp.ads },
        { group: "Ads and marketing", label: "Trade shows and travel", amount: inp.showsTravel },
        { group: "Running the business", label: "Software and tools", amount: inp.tools },
        ...(extra ? [{ group: "Running the business", label: "Insurance, legal, bookkeeping and payroll", note: "not covered by Catapult", amount: extra }] : []),
      ];
    } else {
      if (adamMonth === null && revenue - running >= fixedPost) { adamMonth = m; starts.push("adam"); }
      fixed = adamMonth !== null ? fixedPost : fixedPre;
      staffLines = [{ group: "Team", label: "Phase 2 team and fixed costs", note: adamMonth !== null ? "Adam paid" : "before Adam is paid", amount: fixed }];
    }
    const cost = fixed + running;
    const result = revenue - cost;
    const detail: MonthDetail = {
      revenue: [
        { label: "Alpha · Community Life (founding price)", count: alphaCL, price: inp.foundingPrice, amount: alphaCL * inp.foundingPrice },
        { label: "Alpha · Website", count: alphaN - alphaCL, price: inp.websitePrice, amount: (alphaN - alphaCL) * inp.websitePrice },
        { label: "Community Life", count: otherCL, price: inp.clPrice, amount: otherCL * inp.clPrice },
        { label: "Website", count: otherN - otherCL, price: inp.websitePrice, amount: (otherN - otherCL) * inp.websitePrice },
        { label: `Setup fees (${newSigned} new communities)`, amount: setup },
        { label: "Beta offer discount", amount: -credit },
      ],
      costs: [...staffLines, { group: "Running the business", label: "Running costs and card fees", note: `${paying} communities × $${inp.runCost}`, amount: running }],
    };
    months.push({ m, label: MONTH_NAMES[m - 1], paying, newSigned, revenue, setupGross, setup, credit, fixed, running, cost, result, adamPaid: adamMonth !== null, starts, detail });
  }
  const last = months[Math.max(1, e) - 1];
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
    months, avgPrice, alphaPrice, contrib, fixedPre, fixedPost, newTotal, end: e,
    // At the end of the chosen period (month 12 = Jun 2028 by default).
    payingEnd: e >= 1 ? last.paying : 0, revenueEnd: e >= 1 ? last.revenue : 0, arrEnd: e >= 1 ? last.revenue * 12 : 0,
    costEnd: e >= 1 ? last.cost : 0, resultEnd: e >= 1 ? last.result : 0, marginEnd: e >= 1 && last.revenue > 0 ? last.result / last.revenue : 0,
    adamMonth, hired, cumResult: months.slice(0, Math.max(0, e)).reduce((a, m) => a + m.result, 0), breakEvenPre, breakEvenPost,
    setupCash, orgs, orgsPerMonth: orgs / Math.max(1, sold.length), phases,
  };
}

export type ModelResult = ReturnType<typeof computeModel>;

// ---- Month by month, with setup fees and the beta-offer credit ----

export const NO_SETUP: CashOptions = { includeSetup: false, creditFirst10: false };
export const DEFAULT_CASH: CashOptions = { includeSetup: true, creditFirst10: true };

export type CashOptions = {
  includeSetup: boolean; // count one-time setup fees as income in the month they're paid
  creditFirst10: boolean; // beta offer: the first 30 communities' setup comes back as a discount over their first 12 months
};

export type CashRow = {
  label: string; phase: string; paying: number; revenue: number;
  newSigned: number; setupGross: number; setup: number; credit: number; fixed: number; running: number; cost: number; result: number; cum: number;
  detail: MonthDetail;
};

// The beta offer credits setup back for the first 30 communities: the beta waitlist.
export const CREDIT_COMMUNITIES = 30;

const BUILD_MONTHS = ["Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027"];

// Year-1 rows (Jul 2027 – Jun 2028). New organisations sign from month 2 and pay setup up front.
// With the credit on, setup from the first 30 communities (the beta waitlist) comes back
// as a discount: collected up front, then returned evenly across their first 12 months of subscription.
const STARTS_LABEL: Record<StaffKey, string> = { hubert: "Hubert full-time", sales: "sales associate starts", adam: "Adam paid" };

// What the build and alpha months (Nov 2026 – Jun 2027) cost before any revenue: the debt Year 1 starts with.
// Alpha goes live at the beginning of March 2027 and converts after 90 days, so the alpha
// communities start paying in June 2027, the last build month.
const ALPHA_PAYS_FROM = BUILD_MONTHS.indexOf("Jun 2027");
const buildRow = (inp: Inputs, i: number) => {
  const R = inp.whole ? Math.round : (x: number) => x;
  const paying = i >= ALPHA_PAYS_FROM ? R(inp.alpha) : 0;
  const cl = R(paying * (inp.alphaMix / 100));
  const revenue = cl * inp.foundingPrice + (paying - cl) * inp.websitePrice, running = paying * inp.runCost;
  return { paying, revenue, running, cost: inp.p1Fixed + running, result: revenue - inp.p1Fixed - running };
};
// The net cost of build and alpha (Nov 2026 – Jun 2027), carried into Year 1 as debt.
export const buildCost = (inp: Inputs) => -BUILD_MONTHS.reduce((a, _, i) => a + buildRow(inp, i).result, 0);
// Year-1 month for a position in allMonths (Nov 2026 = 0 → −7; Jul 2027 = 8 → 1; Jun 2028 = 19 → 12).
export const yearOneMonth = (index: number) => index - BUILD_MONTHS.length + 1;

// opening: the running total carried into July (pass −buildCost to start Year 1 from the build debt).
export function year1Cash(inp: Inputs, opt: CashOptions, hires: Hires = {}, opening = 0, end = 12): CashRow[] {
  const r = computeModel(inp, hires, opt, end);
  let cum = opening;
  return r.months.map((m) => {
    const { setup, credit } = m;
    const result = m.revenue + setup - credit - m.cost;
    cum += result;
    return { label: m.label, detail: m.detail, newSigned: m.newSigned, setupGross: m.setupGross, phase: [`Year 1 · M${m.m}`, ...m.starts.map((k) => STARTS_LABEL[k])].join(" · "), paying: m.paying, revenue: m.revenue, setup, credit, fixed: m.fixed, running: m.running, cost: m.cost, result, cum };
  });
}

// The first 12 calendar months from development start: 8 months of build and alpha
// (alpha is free until it converts in June), then the first 4 months of Year 1.
export function first12Cash(inp: Inputs, opt: CashOptions, hires: Hires = {}, end = 12): CashRow[] {
  let cum = 0;
  const build = BUILD_MONTHS.map((label, i): CashRow => {
    const b = buildRow(inp, i);
    cum += b.result;
    const phase = i < 4 ? "Build" : i < ALPHA_PAYS_FROM ? "Alpha live" : "Alpha converts";
    const cl = inp.whole ? Math.round(b.paying * (inp.alphaMix / 100)) : b.paying * (inp.alphaMix / 100);
    const detail: MonthDetail = {
      revenue: [
        { label: "Alpha · Community Life (founding price)", count: cl, price: inp.foundingPrice, amount: cl * inp.foundingPrice },
        { label: "Alpha · Website", count: b.paying - cl, price: inp.websitePrice, amount: (b.paying - cl) * inp.websitePrice },
      ],
      costs: [
        { group: "Build and alpha", label: "Build and alpha", note: "Hubert part-time and tools, paid by Catapult", amount: inp.p1Fixed },
        { group: "Running the business", label: "Running costs and card fees", note: `${b.paying} communities × $${inp.runCost}`, amount: b.running },
      ],
    };
    return { label, phase, detail, paying: b.paying, newSigned: 0, revenue: b.revenue, setupGross: 0, setup: 0, credit: 0, fixed: inp.p1Fixed, running: b.running, cost: b.cost, result: b.result, cum };
  });
  const y1 = year1Cash(inp, opt, hires, 0, end).slice(0, 4).map((row) => {
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
// It had no beta waitlist and paced signings from 80 signed by Jun 2028.
export const WRITTEN_PLAN: Inputs = { ...PLAN_DEFAULTS, alpha: 12, alphaMix: 100, staged: false, adam: 6300, p3Fixed: 35770, planPaying: null, waitlist: 0, whole: false };

// The plan's published numbers. The model must reproduce them (±1 community, ±2%).
export function runPlanChecks() {
  const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
  const pct = (a: number, b: number) => Math.abs(a - b) <= Math.abs(b) * 0.02;
  const d = computeModel(WRITTEN_PLAN);
  const s50 = computeModel({ ...WRITTEN_PLAN, signed: 50 });
  const s110 = computeModel({ ...WRITTEN_PLAN, signed: 110 });
  const checks: [string, number | null, boolean][] = [
    ["Expected: ≈75 paying at month 12", d.payingEnd, near(d.payingEnd, 75, 1)],
    ["Expected: ARR ≈$524k", d.arrEnd, pct(d.arrEnd, 524000)],
    ["Expected: monthly cost ≈$32.7k", d.costEnd, pct(d.costEnd, 32700)],
    ["Expected: monthly result ≈+$11.0k", d.resultEnd, pct(d.resultEnd, 11000)],
    ["Expected: margin ≈25%", d.marginEnd, Math.abs(d.marginEnd - 0.25) <= 0.02],
    ["Expected: Adam covered from month 9", d.adamMonth, d.adamMonth === 9],
    ["Expected: Year-1 operating result ≈−$17k", d.cumResult, pct(d.cumResult, -17000)],
    ["Expected: setup cash ≈$129k", d.setupCash, pct(d.setupCash, 129000)],
    ["Slow (50 signed): ≈47 paying", s50.payingEnd, near(s50.payingEnd, 47, 1)],
    ["Slow (50 signed): ARR ≈$322k", s50.arrEnd, pct(s50.arrEnd, 322000)],
    ["Fast (110 signed): ≈104 paying", s110.payingEnd, near(s110.payingEnd, 104, 1)],
    ["Fast (110 signed): ARR ≈$726k", s110.arrEnd, pct(s110.arrEnd, 726000)],
  ];
  const list = checks.map(([name, value, pass]) => ({ name, value, pass }));
  return { pass: list.every((c) => c.pass), checks: list };
}

// Every month the model covers, Nov 2026 – Jun 2028: build and alpha, then Year 1, with one
// running total throughout. The financial model page shows any window of these.
// endIndex: the last month of the chosen period in this list (Nov 2026 = 0, Jun 2028 = 19).
export function allMonths(inp: Inputs, opt: CashOptions, hires: Hires = {}, endIndex = 19): CashRow[] {
  const end = endIndex - BUILD_MONTHS.length + 1;
  const build = first12Cash(inp, opt, hires, end).slice(0, BUILD_MONTHS.length);
  return [...build, ...year1Cash(inp, opt, hires, -buildCost(inp), end)];
}
