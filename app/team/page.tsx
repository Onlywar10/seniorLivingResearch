import type { Metadata } from "next";
import { Team } from "@/components/plan/sections";

export const metadata: Metadata = { title: "Team and roles" };

export default function Page() {
  return <Team />;
}
