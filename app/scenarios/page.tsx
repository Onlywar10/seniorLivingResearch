import type { Metadata } from "next";
import { ScenariosSection } from "@/components/plan/model";

export const metadata: Metadata = { title: "Scenarios" };

export default function Page() {
  return <ScenariosSection />;
}
