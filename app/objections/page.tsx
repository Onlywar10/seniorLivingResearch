import type { Metadata } from "next";
import { Objections } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Objections" };

export default function Page() {
  return <Objections />;
}
