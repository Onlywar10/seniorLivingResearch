import type { Metadata } from "next";
import { ModelSection } from "@/components/plan/model";

export const metadata: Metadata = { title: "Financial model" };

export default function Page() {
  return <ModelSection />;
}
