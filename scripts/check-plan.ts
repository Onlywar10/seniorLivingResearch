// Checks that the financial model reproduces the business plan. Run: pnpm check:plan
import { runPlanChecks } from "../lib/plan/model.ts";

const { pass, checks } = runPlanChecks();
for (const c of checks) {
  const v = typeof c.value === "number" ? Math.round(c.value * 100) / 100 : c.value;
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}  (got ${v})`);
}
console.log(pass ? "\nAll checks passed." : "\nSome checks failed.");
process.exit(pass ? 0 : 1);
