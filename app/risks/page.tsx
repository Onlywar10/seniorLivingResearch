import type { Metadata } from "next";
import { Risks } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Risks" };

export default function Page() {
  return <Risks />;
}
