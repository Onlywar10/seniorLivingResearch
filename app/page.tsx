import { Summary } from "@/components/plan/sections";
import { PlanProjection } from "@/components/plan/model";
import { MonthlySummary } from "@/components/plan/monthly";

export default function SummaryPage() {
  return (
    <Summary monthly={<MonthlySummary />}>
      <PlanProjection />
    </Summary>
  );
}
