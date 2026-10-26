// The product rollout calendar: every phase and milestone from development start (Nov 2026)
// to the end of beta (Jun 2028). Months are counted from Nov 2026 = 0, so Jul 2027 = 8 and
// Jun 2028 = 19. Details come from the Alpha Feature List and the App Feature Plan.
import { CONTENT as C } from "./content";

export type RolloutPhase = {
  id: string;
  name: string; // short label on the calendar bar
  title: string; // heading in the detail panel
  from: number;
  to: number;
  row: number; // calendar row (bars on the same row must not overlap)
  kind: "build" | "alpha" | "beta" | "milestone";
  summary: string;
  plans?: string; // which plans this phase feeds
  sections: { heading: string; items: string[] }[];
};

export const ROLLOUT_START = { year: 2026, month: 10 }; // November 2026
export const ROLLOUT_MONTHS = 20;
export const ROLLOUT_ROWS = ["Build", "Customers", "Beta stages", "Milestones"];

const P = C.product;
const app = (i: number) => `${P.app[i].name}: ${P.app[i].body}`;

export const ROLLOUT: RolloutPhase[] = [
  {
    id: "p1", name: "Alpha Phase 1", title: "Alpha Phase 1 · re-word and re-wire", from: 0, to: 1, row: 0, kind: "build",
    summary: "What Catapult already has, re-worded and re-wired for senior living. Adam and Hubert build; Dave mentors. Starts 1 Nov 2026.",
    plans: "Becomes the base of the Website plan",
    sections: [{ heading: "What it covers", items: P.phase1.items }],
  },
  {
    id: "p2", name: "Alpha Phase 2 · new builds", title: "Alpha Phase 2 · the new builds the MVP needs", from: 2, to: 7, row: 0, kind: "build",
    summary: "What Catapult doesn’t have yet but every senior living community needs. Phases 1 and 2 together are the MVP; a usable version lands about Feb–Mar 2027 and building carries on through alpha.",
    plans: "Completes the Website and Community Life plans",
    sections: [{ heading: "What it covers", items: P.phase2.items }],
  },
  {
    id: "recruit", name: "Recruit alpha", title: "Recruiting the alpha organisations", from: 0, to: 2, row: 1, kind: "alpha",
    summary: "Up to 5 California organisations with 1–3 pilot communities each, from Jason’s and Tim’s networks and CALA Elevate (2–4 Nov). Alpha agreements signed by about January 2027.",
    sections: [{ heading: "What we ask of each organisation", items: P.alphaTerms.terms.slice(0, 2) }],
  },
  {
    id: "alpha", name: "Alpha live · cohorts 1 and 2", title: "Alpha: two cohorts, 90 days live each", from: 4, to: 7, row: 1, kind: "alpha",
    summary: "Cohort 1 (2–3 organisations) switches over about March 2027 and cohort 2 (1–2) about April; each runs 90 days live against the agreed success criteria, then converts at the founding price.",
    plans: "Converts at the founding price: Community Life $519, Website $349",
    sections: [
      { heading: "How each alpha runs", items: P.alphaTerms.steps.map((s) => `${s.name}: ${s.body}`) },
      { heading: "Terms (draft)", items: P.alphaTerms.terms },
    ],
  },
  {
    id: "s3", name: "Stage 3 · beta begins", title: "Stage 3 · beta begins (Apr–Jul 2027)", from: 5, to: 7, row: 2, kind: "beta",
    summary: "Built during alpha, ready for the beta launch in July 2027.",
    plans: "Website and Community Life go on sale at launch",
    sections: [{ heading: "What it adds", items: [app(0), "Urgent-message escalation: if an urgent message isn’t confirmed, an automatic call or the next contact is tried", "Enterprise controls: portfolio dashboards, brand controls and approvals across many communities", "Source tagging: every inquiry tagged by source from alpha onward, so marketing later has history"] }],
  },
  {
    id: "s4", name: "Stage 4 · insights", title: "Stage 4 · insights and the design studio (Q3 2027)", from: 8, to: 10, row: 2, kind: "beta",
    summary: "Richer daily use of the app and the first engagement insights.",
    plans: "Community Life",
    sections: [{ heading: "What it adds", items: [app(1), "Engagement insights: an engagement score per community, most and least popular activities, signs of disengagement", "Full design studio: brand kit, many more templates, resize for every format, publishing to Facebook and Instagram", "Privacy work for personal updates: consent model and privacy review, so App Phase 3 can ship"] }],
  },
  {
    id: "s5", name: "Stage 5 · finish engagement", title: "Stage 5 · finish engagement (Q4 2027)", from: 11, to: 13, row: 2, kind: "beta",
    summary: "Engagement is finished before the move into marketing.",
    plans: "Community Life",
    sections: [{ heading: "What it adds", items: [app(2), "Digital signage and in-room TV: signage pages per community through a partner player, then our own screen management", "Live dining import from MealSuite, DiningRD and similar", "Shared content ecosystem: activities and templates rated across all CMS Plus communities; licensed content", "Voice calls alongside text, email and push"] }],
  },
  {
    id: "s6", name: "Stage 6 · marketing", title: "Stage 6 · move into marketing (Q1 2028)", from: 14, to: 16, row: 2, kind: "beta",
    summary: "Community life becomes the marketing: prospects see it, and events become leads.",
    plans: "Builds the Complete plan",
    sections: [{ heading: "What it adds", items: ["Community life as prospect nurture: a “life at [community]” digest for prospects until they move in", "Community events as lead generation: prospect RSVPs land in the CRM as warm leads", app(3), "Attribution to tour and move-in, with a marketing scorecard", "Speed-to-lead follow-up: instant reply to every inquiry, then a nurture sequence", "Social posting from community life to Facebook and Instagram", "Reviews and reputation: happy families invited to leave Google reviews"] }],
  },
  {
    id: "s7", name: "Stage 7 · Complete", title: "Stage 7 · marketing toolkit and extended AI (Q2 2028)", from: 17, to: 19, row: 2, kind: "beta",
    summary: "The end of beta: Complete goes on sale at $1,149 per community per month.",
    plans: "Complete launches",
    sections: [{ heading: "What it adds", items: ["Live availability and waitlist alerts driven by the property system (Yardi and similar)", "Cost estimator by care level and apartment, then book a tour", "Email campaigns and landing pages from community content", "Virtual tours: 360° tours and video on apartment pages", "Integrations and security: property systems, more CRMs, single sign-on, API, SOC 2 readiness", "AI that does the work for staff: “Move Thursday’s concert to 7pm and text families”", "Website chat that acts: books tours, RSVPs to events, subscribes people, logs it in the CRM"] }],
  },
  {
    id: "mvp", name: "Usable MVP", title: "Usable MVP", from: 3, to: 3, row: 3, kind: "milestone",
    summary: "A usable MVP 3–4 months after development starts (about Feb–Mar 2027), in time for the first cohort’s switch-over.",
    sections: [],
  },
  {
    id: "conf", name: "Conferences", title: "LeadingAge California and CALA Spring (May 2027)", from: 6, to: 6, row: 3, kind: "milestone",
    summary: "LeadingAge California (18–21 May 2027) and CALA Spring build the Year-1 pipeline, with the show special and on-the-spot Website Previews.",
    sections: [],
  },
  {
    id: "launch", name: "Beta launch", title: "Beta launch · Year 1 begins (Jul 2027)", from: 8, to: 8, row: 3, kind: "milestone",
    summary: "Website ($349) and Community Life ($649) go on sale; the alpha communities convert; the First 10 Organisations offer is in play.",
    sections: [],
  },
  {
    id: "complete", name: "Complete on sale", title: "Complete goes on sale (about Q2 2028)", from: 17, to: 17, row: 3, kind: "milestone",
    summary: "Complete ($1,149) launches with the marketing toolkit and is offered to existing customers.",
    sections: [],
  },
];
