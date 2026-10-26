import type { Metadata } from "next";
import { Pricing } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Tiers and pricing" };

export default function Page() {
  return <Pricing />;
}
