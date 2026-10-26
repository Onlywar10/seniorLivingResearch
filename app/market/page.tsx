import type { Metadata } from "next";
import { Market } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Market and competitors" };

export default function Page() {
  return <Market />;
}
