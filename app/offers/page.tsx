import type { Metadata } from "next";
import { Offers } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Offers we’re exploring" };

export default function Page() {
  return <Offers />;
}
