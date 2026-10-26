import type { Metadata } from "next";
import { Asks } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Asks of Jason" };

export default function Page() {
  return <Asks />;
}
