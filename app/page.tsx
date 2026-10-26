import { CONTENT as C } from "@/lib/plan/content";
import { SideNav, TopNav } from "@/components/plan/nav";
import { ModelExplorer } from "@/components/plan/model-explorer";
import { Asks, Market, Offers, Pricing, Product, Risks, Summary, Team, Timeline } from "@/components/plan/sections";

export default function Home() {
  return (
    <>
      <a className="skip" href="#summary">Skip to the summary</a>
      <div className="shell">
        <SideNav />
        <main id="main">
          <TopNav />
          <Summary />
          <Product />
          <Market />
          <Pricing />
          <Offers />
          <Timeline />
          <Team />
          <ModelExplorer />
          <Risks />
          <Asks />
          <footer><span>{C.meta.footer}</span><span>CMS Plus · built on Catapult</span></footer>
        </main>
      </div>
    </>
  );
}
