import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { CONTENT as C } from "@/lib/plan/content";
import { Pager, SideNav, TopNav } from "@/components/plan/nav";
import { ModelProvider } from "@/components/plan/model-state";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "CMS Plus One-Year Plan", template: "%s · CMS Plus One-Year Plan" },
  description:
    "CMS Plus one-year business plan for Catapult: summary, product, market, pricing, timeline, team, an interactive financial model, scenarios, risks and asks. Draft for discussion.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <div className="shell">
          <SideNav />
          <div className="page-col">
            <TopNav />
            <main id="main">
              <ModelProvider>{children}</ModelProvider>
            </main>
            <Pager />
            <footer><span>{C.meta.footer}</span><span>CMS Plus · built on Catapult</span></footer>
          </div>
        </div>
      </body>
    </html>
  );
}
