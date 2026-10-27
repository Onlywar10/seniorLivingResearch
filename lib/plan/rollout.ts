// The product rollout calendar: every phase and milestone from development start (Nov 2026)
// to the end of beta (Jun 2028). Months are counted from Nov 2026 = 0, so Mar 2027 = 4,
// Jul 2027 = 8 and Jun 2028 = 19. Details come from the Alpha Feature List, the App Feature
// Plan, the alpha agreement and the business plan.
import { CONTENT as C } from "./content";

export type RolloutPhase = {
  id: string;
  name: string; // short label on the calendar bar
  title: string; // heading in the detail panel
  from: number;
  to: number;
  row: number; // 0 Build · 1 Customers · 2 Milestones · 3 Trade shows (bars in a row must not overlap)
  kind: "build" | "beta" | "customers" | "milestone" | "show";
  summary: string;
  plans?: string; // which plans this phase feeds
  sections: { heading: string; items: string[] }[];
  agreement?: boolean; // show the alpha agreement PDF button
};

export const ROLLOUT_START = { year: 2026, month: 10 }; // November 2026
export const ROLLOUT_MONTHS = 20;
export const ROLLOUT_ROWS = ["Build", "Customers", "Milestones", "Trade shows"];

const P = C.product;
const app = (i: number) => `${P.app[i].name}: ${P.app[i].body}`;

export const ROLLOUT: RolloutPhase[] = [
  // ---- Build ----
  {
    id: "p1", name: "Alpha Phase 1", title: "Alpha Phase 1 · re-word and re-wire (Nov–Dec 2026)", from: 0, to: 1, row: 0, kind: "build",
    summary: "What Catapult already has, re-worded and re-wired for senior living. Adam and Hubert build; Dave mentors. Starts 1 Nov 2026.",
    plans: "Becomes the base of the Website plan",
    sections: [{ heading: "What it covers", items: P.phase1.items }],
  },
  {
    id: "p2", name: "Alpha Phase 2 · new builds", title: "Alpha Phase 2 · the new builds the MVP needs (Jan–Mar 2027)", from: 2, to: 4, row: 0, kind: "build",
    summary: "What Catapult doesn’t have yet but every senior living community needs. Phases 1 and 2 together are the MVP: usable by about February and finished by the end of March 2027, as alpha goes live.",
    plans: "Completes the Website and Community Life plans",
    sections: [{ heading: "What it covers", items: P.phase2.items }],
  },
  {
    id: "refine", name: "Refine to the alpha metrics", title: "Refinements and adjustments during alpha (Apr–Jun 2027)", from: 5, to: 7, row: 0, kind: "build",
    summary: "With alpha live, building becomes refinements and adjustments so each organisation meets the success criteria we agreed with them.",
    sections: [
      { heading: "What drives the work", items: [
        "Feedback calls every two weeks, and the day-30, day-60 and day-90 check-ins",
        "The adoption targets agreed at kickoff, for example champions trained by day 0, staff posting at least weekly from week 2, family contacts loaded by day 30",
        "The monthly scorecard: posts, families reached, digest views, website freshness, survey results",
        "Anything on the post-launch wish list that helps an organisation hit its targets",
      ] },
    ],
  },
  {
    id: "s34", name: "Stages 3–4 · launch and insights", title: "Beta Stages 3 and 4 · launch build, insights and the design studio (Q3 2027)", from: 8, to: 10, row: 0, kind: "beta",
    summary: "The first beta build after launch: the core app and launch items (Stage 3), then richer daily use and the first engagement insights (Stage 4).",
    plans: "Website and Community Life on sale from July",
    sections: [
      { heading: "Stage 3 · launch build", items: [app(0), "Urgent-message escalation: if an urgent message isn’t confirmed, an automatic call or the next contact is tried", "Enterprise controls: portfolio dashboards, brand controls and approvals across many communities", "Source tagging: every inquiry tagged by source, so marketing later has history"] },
      { heading: "Stage 4 · insights and the design studio", items: [app(1), "Engagement insights: an engagement score per community, most and least popular activities, signs of disengagement", "Full design studio: brand kit, many more templates, resize for every format, publishing to Facebook and Instagram", "Privacy work for personal updates: consent model and privacy review, so App Phase 3 can ship"] },
    ],
  },
  {
    id: "s5", name: "Stage 5 · finish engagement", title: "Beta Stage 5 · finish engagement (Q4 2027)", from: 11, to: 13, row: 0, kind: "beta",
    summary: "Engagement is finished before the move into marketing.",
    plans: "Community Life",
    sections: [{ heading: "What it adds", items: [app(2), "Digital signage and in-room TV: signage pages per community through a partner player, then our own screen management", "Live dining import from MealSuite, DiningRD and similar", "Shared content ecosystem: activities and templates rated across all Kinward communities; licensed content", "Voice calls alongside text, email and push"] }],
  },
  {
    id: "s6", name: "Stage 6 · marketing", title: "Beta Stage 6 · move into marketing (Q1 2028)", from: 14, to: 16, row: 0, kind: "beta",
    summary: "Community life becomes the marketing: prospects see it, and events become leads.",
    plans: "Builds the Complete plan",
    sections: [{ heading: "What it adds", items: ["Community life as prospect nurture: a “life at [community]” digest for prospects until they move in", "Community events as lead generation: prospect RSVPs land in the CRM as warm leads", app(3), "Attribution to tour and move-in, with a marketing scorecard", "Speed-to-lead follow-up: instant reply to every inquiry, then a nurture sequence", "Social posting from community life to Facebook and Instagram", "Reviews and reputation: happy families invited to leave Google reviews"] }],
  },
  {
    id: "s7", name: "Stage 7 · Complete", title: "Beta Stage 7 · marketing toolkit and extended AI (Q2 2028)", from: 17, to: 19, row: 0, kind: "beta",
    summary: "The end of beta: Complete goes on sale at $1,149 per community per month.",
    plans: "Complete launches",
    sections: [{ heading: "What it adds", items: ["Live availability and waitlist alerts driven by the property system (Yardi and similar)", "Cost estimator by care level and apartment, then book a tour", "Email campaigns and landing pages from community content", "Virtual tours: 360° tours and video on apartment pages", "Integrations and security: property systems, more CRMs, single sign-on, API, SOC 2 readiness", "AI that does the work for staff: “Move Thursday’s concert to 7pm and text families”", "Website chat that acts: books tours, RSVPs to events, subscribes people, logs it in the CRM"] }],
  },

  // ---- Customers ----
  {
    id: "recruit", name: "Recruit alpha", title: "Recruiting the alpha organisations (Nov 2026 – Feb 2027)", from: 0, to: 3, row: 1, kind: "customers", agreement: true,
    summary: "Up to 5 California organisations with 1–3 pilot communities each. Alpha agreements signed by about February 2027, and pre-alpha site builds start alongside their current sites ahead of go-live in March.",
    sections: [{ heading: "The alpha agreement in brief", items: P.alphaTerms.terms }],
  },
  {
    id: "alpha", name: "Alpha live · 90 days", title: "Alpha live: how we define success (Mar–Jun 2027)", from: 4, to: 7, row: 1, kind: "customers",
    summary: "Alpha goes live at the beginning of March 2027 and runs 90 days. Success is defined by these metrics: every one must be met for an organisation to convert at the founding price in early June. Targets are starting numbers; baselines are taken 2–4 weeks before go-live, and days count from each community’s go-live.",
    plans: "Converts on a 12-month founding contract: Community Life $454 (30% off), Website $349 (no discount)",
    sections: [
      { heading: "Staff", items: [
        "One entry reaches every channel: every post reaches 3 or more channels (week 1)",
        "Monthly calendar takes less time: down 50% or more on the time diary (day 60)",
        "Fewer hours on communication: down 15 or more hours per community a month (day 60)",
        "Staff post without being chased: an update in 10 of the last 12 weeks, with no help from us after day 30 (day 90)",
        "Training sticks: 80% or more of trained staff post on their own within 14 days (day 30)",
        "Nothing wrong or unapproved goes out: zero (ongoing)",
      ] },
      { heading: "Residents", items: [
        "Residents know what’s on: +15 points, or 75% or more agree, on a short survey (day 90)",
        "Residents feel part of it: +10 points, or 70% or more agree, and at least one resident suggestion becomes a calendar activity per community (day 90)",
      ] },
      { heading: "Families", items: [
        "Families are reachable and opted in: 60% or more of residents’ families by day 30, 70% or more by day 90",
        "Families keep reading: 50% or more of opted-in families view or click the weekly digest (day 30 onward)",
        "Few families leave: 5% or fewer opt out (day 90)",
        "Families know what’s happening: +15 points, or 80% or more agree, with a 25% or higher response rate (day 90)",
        "Families feel included: +15 points, or 70% or more agree, and 2 or more family-open events per community a month (day 90)",
        "Families get involved: replies, sign-ups and attendance rise against baseline (day 90)",
        "Last-minute changes reach everyone fast: website and families updated within 15 minutes (week 1 onward)",
        "Messages arrive: 95% or more delivered, in the right language (day 30)",
      ] },
      { heading: "The public", items: [
        "Every community page stays current: always less than 7 days old (week 2 onward)",
        "The website shows real daily life: this week’s menu, the calendar and recent news live on every community page, and prospects say so at inquiry or tour",
      ] },
      { heading: "Across the board", items: [
        "Fast, repeatable onboarding: 30 days or less, with the second group faster (day 30)",
        "First calendar live within 7 days of kickoff; texting live within 14 days",
        "Little support needed: 2 hours or less per community a month (day 60)",
        "Works at any size: large and small organisations both pass (day 90)",
        "Leadership sees results: a monthly scorecard every month (day 30 onward)",
        "Leadership wants to keep it: yes at 4 or more of 5 organisations in the day-90 interview",
        "Uptime 99.5% or more (ongoing), and a full data export tested once per organisation (day 90)",
      ] },
      { heading: "Alongside the metrics", items: [
        "At least 3 recorded resident, family or staff stories per organisation, and one publishable case study and one willing reference each",
        "Pass rule: every criterion must be met; still to decide whether one or two near-misses can pass if the trend is clearly right",
      ] },
    ],
  },
  {
    id: "selling", name: "Selling Website and Community Life", title: "Selling from the beta launch (Jul 2027 onward)", from: 8, to: 19, row: 1, kind: "customers",
    summary: "Website ($349) and Community Life ($649) go on sale at the beta launch. The beta waitlist, about 30 communities, joins straight away with the beta offer (setup paid up front, then returned as a discount over their first 12 months); new signings follow each month. Complete ($1,149) joins at the end of beta, about Q2 2028.",
    sections: [{ heading: "Where customers come from", items: ["Warm introductions: friends with the Quick Intro, and alpha references", "Conferences, with the show special and on-the-spot Website Previews", "Direct outreach to California licence lists of operators with 2–20 communities, led with the free AI Visibility Audit", "Referrals and partners: a month free per referred community; agencies and Activity Connection", "Content: alpha case studies and “what AI says about your community” posts"] }],
  },

  // ---- Milestones ----
  {
    id: "mvp", name: "Usable MVP", title: "Usable MVP (about Feb 2027)", from: 3, to: 3, row: 2, kind: "milestone",
    summary: "A usable MVP about 3–4 months after development starts, ready for alpha to go live at the beginning of March.",
    sections: [],
  },
  {
    id: "golive", name: "Alpha live", title: "Alpha goes live (beginning of Mar 2027)", from: 4, to: 4, row: 2, kind: "milestone",
    summary: "Each alpha organisation switches its DNS once the agreed acceptance list is met, and the 90 days start.",
    sections: [],
  },
  {
    id: "convert", name: "Alpha converts", title: "Alpha converts: revenue starts (early Jun 2027)", from: 7, to: 7, row: 2, kind: "milestone",
    summary: "Day-90 reviews. Alpha organisations that met their results start paying the founding price: the first revenue.",
    sections: [],
  },
  {
    id: "launch", name: "Beta launch", title: "Beta launch · Year 1 begins (Jul 2027)", from: 8, to: 8, row: 2, kind: "milestone",
    summary: "Website and Community Life go on sale to new customers, and new signings start.",
    sections: [],
  },
  {
    id: "complete", name: "Complete on sale", title: "Complete goes on sale (about Q2 2028)", from: 17, to: 17, row: 2, kind: "milestone",
    summary: "Complete ($1,149) launches with the marketing toolkit and is offered to existing customers.",
    sections: [],
  },

  // ---- Trade shows ----
  {
    id: "leadingage", name: "LeadingAge California", title: "LeadingAge California (18–21 May 2027)", from: 6, to: 6, row: 3, kind: "show",
    summary: "Builds the Year-1 pipeline ahead of the beta launch, with the show special: sign at the show and get a free Website Preview built that week, plus the founding setup credit if spots remain.",
    sections: [],
  },
  {
    id: "calaspring", name: "CALA Spring", title: "CALA Spring (7–9 Jun 2027)", from: 7, to: 7, row: 3, kind: "show",
    summary: "California’s assisted living association conference, a month before the beta launch: the CALA Spring launch and CALA membership. The offer work held the founding price until this show.",
    sections: [],
  },
];
