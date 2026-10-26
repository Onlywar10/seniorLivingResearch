// Edit wording and numbers here. Tags: "estimate" = planning assumption · "derived" = our arithmetic · "draft" = a stated plan figure not yet tested with buyers.
export const CONTENT = {
  meta: {
    title: "CMS Plus — One-Year Plan",
    subtitle: "Draft for discussion · prepared for Jason Jeffery, Catapult",
    date: "25 Oct 2026",
    footer: "Draft for discussion · figures are planning estimates · 25 Oct 2026"
  },

  summary: {
    pitch: "CMS Plus brings families and the public into the daily life of a senior living community.",
    elevator: "Staff post an activity, menu or event once, and it appears on the community’s website, goes to families by text and email, and prints as large-print flyers for residents, in a few minutes a week instead of hours.",
    question: "Your question on 11 Oct: assuming the MVP is built, where are we one year from now?",
    facts: [
      ["What", "The website and the family engagement system for senior living communities, on Catapult’s platform"],
      ["Who first", "California assisted living and memory care operators with 2–20 communities"],
      ["Team", "Adam, Tim, Hubert and a sales associate from launch; Dave mentoring from Catapult"],
      ["Catapult covers", "The platform, hosting, texting registration, insurance, legal, bookkeeping, payroll, and the build and alpha"]
    ],
    cards: [
      { value: "$349–1,149", label: "Per community per month: Website $349 · Community Life $649 · Complete $1,149", tag: "draft" },
      { value: "≈75 paying", label: "Communities at month 12: 80 signed, after about 1% leave each month", tag: "estimate" },
      { value: "≈$508k", label: "Annual recurring revenue at month 12, expected case", tag: "derived" },
      { value: "≈50 communities", label: "Break-even with the full team and Adam paid; Adam is the first full-time hire, about month 2", tag: "derived" },
      { value: "Jul ’27 – Jul ’28", label: "Year 1. Development starts Nov 2026; usable MVP Feb–Mar 2027", tag: "estimate" },
      { value: "≈$24–27k", label: "Build and alpha, Nov 2026 – Jun 2027, paid by Catapult", tag: "estimate" },
      { value: "≈28%", label: "Operating margin at month 12, after every cost including Adam", tag: "derived" },
      { value: "≈47%", label: "Operating margin at about $1M ARR, the spin-out point", tag: "derived" }
    ],
    needTitle: "What we need from Catapult",
    need: [
      "The platform, and Dave’s mentoring as before",
      "Hosting and upkeep, and texting registration",
      "Insurance, legal, bookkeeping and payroll",
      "The build and alpha costs, about $24–27k from November to about June"
    ],
    needNote: "Assumed in every number in this plan. Equity and spin-out terms to be agreed over time."
  },

  product: {
    intro: "One product with two halves. Staff post once, and it reaches the website, families by text and email, and large-print paper for residents.",
    halves: [
      { title: "Website and CMS", body: "Each community’s website, with this week’s menu, the activity calendar, news and apartments kept live on every page. Search and AI-answer visibility (SEO and GEO), AI website chat, tour booking into the operator’s CRM, and waitlist alerts." },
      { title: "Engagement and communications", body: "Family messaging by text and email in each family’s language, with manager approval. A weekly digest built automatically, large-print calendars and menus, attendance, surveys and a monthly scorecard for leadership." }
    ],
    positioning: [
      { against: "Against engagement apps", who: "LifeLoop, Go Icon, Sentrics", line: "“We make it public.”", body: "Community life reaches the website and prospects, not just people behind a login." },
      { against: "Against website agencies", who: "IlluminAge, Websites for Senior Living, Senior Living SMART", line: "“We keep it alive.”", body: "The site updates itself from the calendar and menus, instead of going stale after launch." }
    ],
    alphaIntro: "Alpha proves it works; beta makes money. Alpha runs with up to 5 California organisations, 1–3 pilot communities each.",
    phase1: {
      title: "Alpha Phase 1 · what Catapult already has",
      note: "Re-worded and re-wired for senior living, not new building.",
      items: [
        "Multi-site website platform, migration, redirects and the DNS switch",
        "Approvals, shared content across sites, accessibility, compliance basics (incl. the California licence number)",
        "SEO and AI search: a live-facts feed and AI-answer monitoring",
        "Community pages and the community life calendar",
        "Publish once: website, text, email and print",
        "Family messaging, own-domain email, delivery tracking",
        "Basic design studio and website translation",
        "AI website chat that says “I don’t know” rather than guessing"
      ]
    },
    phase2: {
      title: "Alpha Phase 2 · new builds the MVP needs",
      note: "What every community needs for us to be its CMS and engagement system.",
      items: [
        "Live menu and calendar blocks on every community page",
        "Apartments, tour booking routed to the CRM, waitlist alerts",
        "Dining menus, and calendar and menu import from a PDF or photo",
        "Weekly family digest and manager approval for messages",
        "Weekly staff reminder and photo post from the phone",
        "“Where it went” screen: the post on every channel, and how many families it reached",
        "Attendance, surveys, content library, monthly scorecard",
        "AI content assistant (lite), data export and CRM connection"
      ]
    },
    stages: [
      { name: "Alpha Phase 1", when: "Nov – Dec 2026", what: "Re-word and re-wire Catapult’s platform" },
      { name: "Alpha Phase 2", when: "Dec 2026 – Jun 2027", what: "New builds; usable MVP Feb–Mar 2027" },
      { name: "Stage 3", when: "Apr – Jul 2027", what: "Beta begins: the core app, urgent-message escalation" },
      { name: "Stage 4", when: "Q3 2027", what: "Insights, full design studio, richer app" },
      { name: "Stage 5", when: "Q4 2027", what: "Personal updates, signage, voice" },
      { name: "Stage 6", when: "Q1 2028", what: "Marketing: nurture, events as leads, attribution, reviews" },
      { name: "Stage 7", when: "Q2 2028", what: "Complete launches; live availability; extended AI" }
    ],
    stagesNote: "Engagement is finished first, then marketing. Not building: care records, billing, or operations tools such as work orders and transport. We integrate with those, which keeps us outside HIPAA.",
    app: [
      { name: "App Phase 1 · core app", when: "Stage 3", body: "One app, three roles (family, resident, staff). Home feed, events and RSVP, replies, resident “today” view, staff quick post and attendance." },
      { name: "App Phase 2 · richer daily use", when: "Stage 4", body: "Photo albums, the digest and surveys in the app, a shared-tablet mode, read aloud, calendar sync, languages." },
      { name: "App Phase 3 · personal updates", when: "Stage 5", body: "Photos of a family’s own loved one and attendance alerts, with consent, after a privacy review." },
      { name: "App Phase 4 · prospects and voice", when: "Stage 6 on", body: "A prospect view, public event RSVP, voice assistants and an AI assistant that answers from live content." }
    ],
    alphaTerms: {
      title: "How alpha works (draft agreement)",
      steps: [
        { name: "Pre-alpha", body: "We build the new site alongside the old one, load calendars, menus and apartments, import family contacts, train staff and take baselines." },
        { name: "Day 0", body: "Once the agreed acceptance list is met, the organisation switches its DNS within the agreed number of days. The 90-day clock starts." },
        { name: "90 days live", body: "Success criteria measured; feedback calls every two weeks; check-ins at day 30, 60 and 90; a day-90 decision." }
      ],
      terms: [
        "Free through alpha, with no setup fee, until the results we control are met. Then the monthly fee simply starts at the founding price: Community Life $519, Website $349.",
        "In return: a named decision-maker, a staff champion per community, short feedback calls, and a committed DNS switch.",
        "If they don’t switch after the list is met, alpha ends and they lose the service. If they miss their own adoption targets, the guarantee ends but we keep working to win them over.",
        "Anonymised, aggregated activity data may improve the product; nothing that identifies a resident, family member or staff member leaves their organisation.",
        "A planning draft: any real contract gets a lawyer’s review first."
      ]
    }
  },

  market: {
    intro: "The plan doesn’t depend on winning a big share. It depends on closing about one organisation a month.",
    sizes: [
      { value: "≈$153M", label: "a year: engagement software alone for US assisted living and memory care (at about $710 per community per month)", tag: "derived" },
      { value: "≈$470–790M", label: "a year: with websites, marketing tools and services included", tag: "derived" },
      { value: "≈14,000", label: "assisted living and memory care communities with 26 or more beds", tag: "derived" }
    ],
    evidenceKey: "Evidence: A government record · B published by the vendor · C filing or trade press · D software directory (often stale). None of the six publishes a current price list.",
    competitors: [
      { name: "LifeLoop", type: "Engagement", size: "4,700 communities", price: "About $600–1,350 per community per month (VA nursing homes, not assisted living)", ev: "A", lacks: "A public website: community life stays behind a login" },
      { name: "Go Icon", type: "Engagement", size: "2,000+ communities", price: "No usable price; directory listings conflict", ev: "D", lacks: "Website pages: it publishes everywhere except the public site" },
      { name: "Sentrics", type: "Engagement", size: "7,500+ communities", price: "No community price; families pay $7.49 a month for an app upgrade", ev: "B", lacks: "A public website" },
      { name: "IlluminAge", type: "Websites and content", size: "35 years, aging services only", price: "Builds $3,500–10,000+; content $119 a month", ev: "B", lacks: "Family engagement; live menus and calendars on community pages" },
      { name: "Websites for Senior Living", type: "Websites (sold through agencies)", size: "Small", price: "None found: fixed quote per project", ev: "—", lacks: "Family engagement" },
      { name: "Senior Living SMART", type: "Marketing agency", size: "11–50 staff", price: "No current price; agency retainers in this market run $2,500–7,500+ a month", ev: "C", lacks: "Family engagement; a site that updates itself" }
    ],
    where: [
      "Buying the website, engagement, messaging, AI chat and content tools separately costs a community about $700–1,600 a month across four or five vendors; the average single tool is about $710.",
      "Community Life at $649 replaces two of those bills for less than one of them.",
      "Nobody spans both halves, and nobody puts menus, news and apartments live on community pages."
    ]
  },

  tiers: {
    intro: "Each tier contains the one before it. Website publishes to the web; Community Life publishes to people. Upgrading switches channels on; nothing is rebuilt.",
    cards: [
      { name: "Website", price: 349, solves: "“Our website is out of date, hard to update, and doesn’t bring in tours.”", replaces: "A website agency, IlluminAge, Websites for Senior Living, Senior Living SMART", ready: "End of alpha, about mid-2027" },
      { name: "Community Life", price: 649, featured: true, solves: "That, plus “families feel out of the loop, and staff spend hours on calendars, flyers and messages.”", replaces: "An agency site plus an engagement platform (LifeLoop, Go Icon, Quiltt)", ready: "End of alpha, about mid-2027", note: "Includes the website. Goal: 80% or more of communities." },
      { name: "Complete", price: 1149, solves: "Both, plus “we need more move-ins.”", replaces: "All of that, plus marketing tools and part of an agency retainer", ready: "End of beta, about Q2 2028" }
    ],
    noDiscounts: "No discounts in the tiers. Prices and setup fees are fixed; everything else is an offer.",
    average: "At 80% on Community Life the average community pays about $589 a month and leaves about $530 after running costs and card fees.",
    features: [
      ["Website for the organisation and each community, with migration, redirects and the DNS switch", "y", "y", "y"],
      ["Approvals and governance, accessibility, compliance basics, uptime monitoring", "y", "y", "y"],
      ["Community pages, shared content across sites, website translation", "y", "y", "y"],
      ["Activity calendar and dining menus live on the website, with import from PDF or photo", "y", "y", "y"],
      ["SEO and AI search (GEO): live-facts feed, AI-answer monitoring, Google Business Profile", "y", "y", "y"],
      ["AI website chat", "y", "y", "y"],
      ["Apartments, inquiry form, online tour booking routed to the CRM", "y", "y", "y"],
      ["Waitlist and availability alerts, tour confirmations", "y", "y", "y"],
      ["Design studio for web content; stale-page reminders; website analytics", "y", "y", "y"],
      ["Event RSVP", "n", "y", "y"],
      ["“Where it went” publish screen", "n", "y", "y"],
      ["Family messaging by text and email: targeted, translated, manager approval, delivery tracking", "n", "y", "y"],
      ["Email from the community’s own domain", "n", "y", "y"],
      ["Publish once to families and print, including large-print calendars, menus and flyers", "n", "y", "y"],
      ["Design studio for print; content library", "n", "y", "y"],
      ["Weekly staff posting reminder and photo post; reach and replies", "n", "y", "y"],
      ["Attendance tracking; resident suggestions", "n", "y", "y"],
      ["AI content assistant", "n", "y", "y"],
      ["Built-in surveys; monthly scorecard", "n", "y", "y"],
      ["The app (family, resident, staff)", "n", "beta", "y"],
      ["Engagement insights; full design studio", "n", "beta", "y"],
      ["Digital signage and in-room TV", "n", "beta", "y"],
      ["Prospect nurture; community events as leads", "n", "n", "y"],
      ["Attribution to tour and move-in; speed-to-lead follow-up", "n", "n", "y"],
      ["Social posting; reviews and reputation; cost estimator", "n", "n", "y"],
      ["Quarterly results review with us", "n", "n", "y"]
    ],
    setup: [
      { fee: "Website build", amount: "$2,500 for the organisation’s main site + $1,000 per community site", applies: "All tiers", covers: "Build, migration and redirects, the DNS switch, importing calendars and menus, staff training" },
      { fee: "Family set-up", amount: "$1,000 training and setup + $250 per community", applies: "Community Life, Complete", covers: "Importing family contacts, texting registration, family opt-in" }
    ],
    setupNote: "Setup is paid up front. A five-community organisation on Community Life pays about $9,500."
  },

  offers: {
    banner: "Ideas we’re exploring, not commitments. Nothing here is decided until we choose to run it and a buyer says yes. Offers change the terms around the tiers; list prices don’t move.",
    founding: [
      { name: "Alpha Founding Partner", rows: [
        ["Who", "Up to 5 California organisations in alpha, 1–3 pilot communities each"],
        ["Setup", "None. We build the new site alongside the old one"],
        ["Monthly", "Free until the agreed results are met; then Community Life $519, Website $349"],
        ["Commitment", "Named contact, a champion per community, feedback calls, a committed DNS switch"],
        ["Why", "De-risks the switch for them; we earn proof and case studies"]
      ]},
      { name: "First 10 Organisations", rows: [
        ["Who", "The first 10 paying organisations after alpha, up to 100 communities in total"],
        ["Setup", "Paid up front, then credited back in Year 2 on a two-year contract"],
        ["Monthly", "List price ($349 / $649)"],
        ["Commitment", "Two-year contract (suggested); leaving early breaks it and its penalties apply"],
        ["Why", "Real scarcity and a reason to sign early in Year 1"]
      ]}
    ],
    overTime: [
      ["Year 1 (about Jul 2027 – Jul 2028)", "List prices held: $349 · $649 · $1,149 from end of beta", "Price locked for the term"],
      ["Year 2", "About +10% once case studies exist ($379 · $709 · $1,249)", "Increases capped at 5% a year after the term"],
      ["Year 3", "Review against results and competitor prices", "Same 5% cap"]
    ],
    playbook: [
      { group: "Open the conversation", items: [
        ["Free Website Preview", "A snapshot of their new site built from their own calendar, menus and photos"],
        ["Free AI Visibility Audit", "What ChatGPT and Google say about the community, and how stale its menus and calendar are"],
        ["Show special", "Sign at LeadingAge California or CALA Spring: a Preview built that week, plus the founding setup credit if spots remain"]
      ]},
      { group: "Grow the account", items: [
        ["Tier comparison", "“For $300 more, the same website reaches every family and saves staff hours”"],
        ["Land and expand", "Start with 1–3 communities, then roll out across the organisation"],
        ["Next tier free for a while", "Community Life customers who sign in beta get Complete’s marketing free for its first year"]
      ]},
      { group: "Make it easy to say yes", items: [
        ["One community first", "A single pilot community, then expand"],
        ["Setup payment plan", "Setup spread over 6 months"],
        ["Budget-season start", "Sign in Q3–Q4, start billing in January when the new budget opens"]
      ]},
      { group: "Keep them", items: [
        ["Two-year term", "Price locked; increases capped at 5% after"],
        ["Annual prepay", "Pay a year up front, get two months free"],
        ["Results review", "A quarterly review of reach, website freshness, AI answers and inquiries"]
      ]}
    ],
    guarantees: [
      ["Now", "Always-current: a menu or calendar more than 7 days out of date because of us means that month is free. Migration: no broken pages or lost rankings. A 90-day risk-free switch."],
      ["After alpha", "Pays-for-itself: if returned staff time plus family-referral move-ins are worth less than the fees, we refund the difference."],
      ["Later", "Outcome: one extra move-in per community in 12 months, or the year’s fee back, once the evidence exists."]
    ]
  },

  timeline: {
    intro: "Development starts 1 Nov with Adam and Hubert building and Dave mentoring. A usable MVP takes 3–4 months, so Year 1 starts about July 2027.",
    start: { year: 2026, month: 10 },
    months: 21,
    lanes: ["Product", "Customers and sales", "Team and money"],
    items: [
      { lane: 0, row: 0, from: 0, to: 1, label: "Phase 1" },
      { lane: 0, row: 1, from: 1, to: 7, label: "Alpha Phase 2 builds" },
      { lane: 0, row: 0, from: 3, to: 4, label: "Usable MVP", milestone: true, strong: true },
      { lane: 0, row: 0, from: 5, to: 7, label: "App Phase 1 build" },
      { lane: 0, row: 0, from: 8, to: 8, label: "Beta launch", milestone: true, strong: true },
      { lane: 0, row: 1, from: 8, to: 10, label: "Stage 4" },
      { lane: 0, row: 1, from: 11, to: 13, label: "Stage 5" },
      { lane: 0, row: 1, from: 14, to: 16, label: "Stage 6: marketing" },
      { lane: 0, row: 1, from: 17, to: 19, label: "Stage 7: Complete" },
      { lane: 1, row: 0, from: 0, to: 0, label: "Recruit alpha · CALA Elevate", milestone: true },
      { lane: 1, row: 1, from: 1, to: 2, label: "Agreements" },
      { lane: 1, row: 0, from: 4, to: 7, label: "Cohort 1: 90 days live" },
      { lane: 1, row: 1, from: 5, to: 8, label: "Cohort 2" },
      { lane: 1, row: 2, from: 6, to: 6, label: "Conferences (May)", milestone: true },
      { lane: 1, row: 3, from: 7, to: 7, label: "Alpha converts to paid", milestone: true },
      { lane: 1, row: 0, from: 8, to: 20, label: "Year 1 selling: about 1.2 new organisations a month" },
      { lane: 1, row: 1, from: 11, to: 13, label: "Budget season" },
      { lane: 1, row: 2, from: 16, to: 16, label: "Break-even (expected)", milestone: true, strong: true },
      { lane: 1, row: 3, from: 20, to: 20, label: "80 signed · ≈75 paying", milestone: true, strong: true },
      { lane: 2, row: 0, from: 0, to: 7, label: "Build and alpha ≈$3,400 a month (Catapult)" },
      { lane: 2, row: 1, from: 9, to: 9, label: "Adam full-time and paid", milestone: true },
      { lane: 2, row: 2, from: 9, to: 9, label: "Hubert full-time", milestone: true },
      { lane: 2, row: 0, from: 8, to: 20, label: "Year 1 costs grow as each hire is covered" },
      { lane: 2, row: 3, from: 11, to: 11, label: "Sales associate starts", milestone: true },
      { lane: 2, row: 2, from: 20, to: 20, label: "Phase 3 hires begin", milestone: true }
    ],
    note: "Year 1 month 1 is July 2027; month 12 is July 2028. Dates after alpha move if alpha moves."
  },

  team: {
    intro: "The split you described: Catapult contributes the platform; Adam brings sales, marketing, scaling and operations. Each hire waits until revenue can carry it.",
    columns: ["Person", "Role", "Build and alpha (Phase 1)", "Year 1 (Phase 2)", "Year 2 (Phase 3)"],
    rows: [
      ["Adam", "Head of Senior Living, Catapult: product, sales, marketing, operations", "Unpaid; developing alongside Hubert and preparing sales", "First full-time hire: $62k salary once revenue and setup fees cover it (about Aug 2027)", "$62k (for now)"],
      ["Tim", "Customer success: onboarding, training, support, research", "Unpaid", "Free for the first year", "$55k"],
      ["Hubert", "Developer: senior living features, imports, the app", "Part-time, 20 hrs a week at $30/hr, contractor", "Full-time at $62k once revenue and setup fees cover it, after Adam (about Aug 2027)", "Full-time; more developers as needed"],
      ["Sales associate", "Demos, proposals, closing; conference and outreach pipeline", "—", "Starts once revenue and setup fees cover it, after Hubert (about Oct 2027): $60k base + about 10% commission", "Same"],
      ["Dave (Catapult)", "Mentor and technical guidance; platform decisions", "From 1 Nov", "Catapult’s call", "Catapult’s call"]
    ],
    capacity: [
      "Onboarding about 15 hours per community, plus about 5 per organisation for kickoff.",
      "Support 2 hours or less per community a month after day 30.",
      "Expected case: about 260 hours a month by month 12, roughly 1.6 people. Tim covers most of it; Hubert helps with builds.",
      "It pinches around month 9 (month 7–8 in the fast case). The first Phase 3 hire is onboarding and support, or a second developer, whichever is tighter."
    ]
  },

  model: {
    intro: "Move any input and every number, chart and sentence below recalculates. The marks on each slider show where the plan sits. Everything is a planning estimate.",
    phase2Breakdown: [
      ["Staff", "$17,800", "Hubert $7,400 · sales associate $6,200 + commission ≈$4,200 · Tim $0"],
      ["Software and tools", "$1,000", ""],
      ["Acquisition", "$3,170", "Ads $1,500 · trade shows $10k a year · travel $10k a year"]
    ],
    coverNote: "Catapult covers insurance, legal, bookkeeping and payroll"
  },

  monthly: {
    intro: "The same model, month by month. Each month’s result is revenue minus every cost; the running total adds them up. Moves with the sliders on the financial model page.",
    setupLabel: "Include setup fees",
    setupNote: "One-time fees paid up front by each new organisation: about $9,500 for five communities on Community Life.",
    creditLabel: "First 10 Organisations: setup credited back",
    creditNote: "Setup from the first 10 paying organisations (up to 100 communities) is credited against their second year, so it is shown as owed back rather than kept.",
    first12Title: "The first 12 months: Nov 2026 – Oct 2027",
    first12Intro: "From the day development starts. Eight months of build and alpha (no revenue; alpha is free and Catapult pays these costs), then the first four months of sales.",
    first12Short: "From development start: eight months of build and alpha (no revenue), then the first four months of sales.",
    year1Short: "The 12 months from beta launch, when revenue starts. The running total starts from the build and alpha debt.",
    summaryTitle: "Month by month",
    summaryIntro: "The plan’s expected case: 80 communities signed by month 12, 20 of them alpha communities converting in July (80% Community Life at $519, 20% Website at $349). Bars are each month’s result; the line is the running total. Hires are staged: Adam comes on full-time first, then Hubert, then the sales associate, each in the first month revenue (plus setup fees, when switched on) covers them. Start months can be changed on the Month by month page.",
    year1Title: "Year 1: Jul 2027 – Jun 2028",
    year1Intro: "The 12 months from beta launch, when revenue starts. The running total starts from the build and alpha costs carried in (Nov 2026 – Jun 2027), so it shows when that debt is paid back."
  },

  scenarios: {
    intro: "The plan’s three cases differ only in how many communities sign by month 12. They recalculate from the model’s other inputs, so change a price or a cost above and these move too.",
    reading: [
      "In the expected case setup fees cover the early-month losses, so Year 1 needs no outside money (Catapult carries the build and alpha).",
      "But the first 10 organisations’ setup is credited back in Year 2, so treat most of that cash as borrowed from Year 2.",
      "The slow case needs cover for its losses, or a later sales hire. The fast case needs the Phase 3 hires sooner."
    ],
    share: "About 75 paying communities is roughly 0.5% of the 14,000 assisted living and memory care communities with 26+ beds, and $508k is about 0.3% of the $153M engagement market."
  },

  risks: [
    ["No operator has seen it yet", "Prices, tiers and offers are untested.", "Operator conversations start after this meeting; mock demo first; offers tried on alpha calls before they go in the playbook."],
    ["Build time", "A usable MVP takes 3–4 months, which pushes Year 1 to about July 2027; Adam building means less selling before launch.", "Phase 1 is what Catapult already has; Dave mentors; cohorts staggered; May conferences fill the pipeline."],
    ["Adoption", "Staff don’t post; families don’t sign up.", "Weekly posting reminder, photo post from the phone, a content library so nothing starts empty, a champion per community."],
    ["Occupancy link unproven", "Complete’s promise (more move-ins) has no evidence yet.", "Inquiry source tagging from alpha; an outcome guarantee only after the evidence exists."],
    ["Churn", "The plan assumes about 1% of communities leave a month.", "Two-year contracts with penalties for leaving early; quarterly results reviews; measure real churn from month 1."],
    ["Funnel unknown", "We don’t yet know how many conversations it takes to sign an organisation.", "Measure every stage through alpha and beta; set targets from real numbers."],
    ["Capacity", "Onboarding and support reach about 1.6 people by month 12.", "Watch hours per community from alpha; hire in Phase 3 when it pinches."],
    ["Setup cash is borrowed", "The first 10 organisations’ setup is credited back in Year 2.", "Don’t spend it as profit."],
    ["Privacy, texting and licence rules", "Family contact data and consent; texting registration; California requires an RCFE’s licence number in all advertising (Health and Safety Code §1569.681).", "Registration in onboarding; consent records; licence number on every community site; no named-resident data until the app’s privacy review."],
    ["Equity and the spin-out are verbal", "Adam’s upside and the spin-out path depend on it.", "Agree in conversation over time; in writing before Year 1."]
  ],

  asks: [
    { title: "Confirm what Catapult covers", body: "The platform, Dave’s mentoring, hosting and upkeep, texting registration, insurance, legal, bookkeeping and payroll, and the build and alpha costs (about $24–27k from November to about June)." },
    { title: "Dave as mentor", body: "How much of his time, and which build decisions only you can make." },
    { title: "Confirm alpha Phase 1", body: "What survives the move to WordPress; whether the chatbot can go live; how much of the GEO work already exists; what Catapult has for shared content and social posting." },
    { title: "The timeline", body: "A usable MVP 3–4 months after development starts, so Year 1 begins about July 2027. Does that work for you?" },
    { title: "Equity and the spin-out", body: "Agree the shape now (percentage, vesting, departure, the spin-out at about $1M ARR); the detail can follow." },
    { title: "The money split and the name", body: "The platform vs sales-and-operations split you described, and “Powered by Catapult” vs a separate brand name." },
    { title: "Next check-in", body: "What you want to see, and when." }
  ]
};

export type Content = typeof CONTENT;
