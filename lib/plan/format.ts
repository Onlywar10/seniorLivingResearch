export const fmt$ = (v: number, opts: { k?: boolean; plus?: boolean } = {}) => {
  const sign = v < 0 ? "−" : opts.plus && v > 0 ? "+" : "";
  const a = Math.abs(v);
  if (opts.k && a >= 1000) return `${sign}$${(a / 1000).toFixed(a >= 100000 ? 0 : 1)}k`;
  return `${sign}$${Math.round(a).toLocaleString("en-US")}`;
};

export const fmtN = (v: number, d = 0) =>
  (Math.round(v * 10 ** d) / 10 ** d).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// One page per section, in reading order. [path, nav label]
export const PAGES: [string, string][] = [
  ["/", "Summary"], ["/product", "Product"], ["/market", "Market and competitors"],
  ["/model", "Financial model"], ["/team", "Team and roles"], ["/objections", "Objections"],
  ["/offers", "Offers we’re exploring"], ["/asks", "Asks of Jason"],
];
