import type { Metadata } from "next";
import { Product } from "@/components/plan/sections";

export const metadata: Metadata = { title: "The product" };

export default function Page() {
  return <Product />;
}
