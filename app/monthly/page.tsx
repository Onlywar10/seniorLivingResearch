import type { Metadata } from "next";
import { MonthlySection } from "@/components/plan/monthly";

export const metadata: Metadata = { title: "Month by month" };

export default function Page() {
  return <MonthlySection />;
}
