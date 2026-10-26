import type { Metadata } from "next";
import { Timeline } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Timeline" };

export default function Page() {
  return <Timeline />;
}
