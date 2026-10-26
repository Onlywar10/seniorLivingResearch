// Edit wording and numbers here. Tags: "estimate" = planning assumption · "derived" = our arithmetic · "draft" = a stated plan figure not yet tested with buyers.
export const CONTENT = {
  meta: {
    title: "Kinward — One-Year Plan",
    subtitle: "Draft for discussion · prepared for Jason Jeffery, Catapult",
    date: "25 Oct 2026",
    footer: "Draft for discussion · figures are planning estimates · 25 Oct 2026"
  },

  summary: {
    pitch: "Kinward brings families and the public into the daily life of a senior living community.",
    elevator: [
      "When did your families last see what Grandma actually did this week? In most communities, they only hear when something goes wrong. When someone looks at your website, do they see a sales brochure that looks just like the four others they’re comparing, or do they see your community?",
      "Kinward fixes both. Your staff post an activity, a menu or a photo once, and it goes everywhere: onto your website, into large-print flyers for residents, and out to families by text and email.",
      "Families feel close to their loved ones, and people looking for a home for their aging parents see real daily life before they tour. Kinward replaces both your website vendor and your engagement app, for less than buying both.",
      "We’re starting with five operators this spring. Could I show you what it would look like for one of your communities?"
    ],
    question: "Your question on 11 Oct: assuming the MVP is built, where are we one year from now?",
    facts: [
      ["What it is", "One system that runs a senior living community’s public website and keeps families in touch by text, email and print. Built on Catapult’s existing website platform, which already runs hundreds of school districts’ sites."],
      ["Who it’s for first", "California assisted living and memory care operators that run 2–20 communities."],
      ["What Catapult provides", "The platform, hosting, texting registration, insurance, legal, bookkeeping and payroll, and the costs of building the product before it earns money."],
      ["How it’s sold", "Monthly, per community, in three plans. Each plan includes everything in the one before. Website: $349, the community’s website on its own. Community Life: $649, the website plus family messaging, large-print print and the family app. Complete: $1,149, adds marketing tools to fill apartments, available from about mid-2028. New customers also pay a one-time setup fee, about $9,500 for an operator with five communities."],
      ["Who’s doing it", "Adam (Head of Senior Living: product, sales and operations), Hubert (developer), Tim (customer success, unpaid for now) and a sales associate, with Dave from Catapult as technical mentor and Jason as business mentor. Adam, Hubert and the sales associate go full-time as revenue covers each of them."]
    ],
    cards: [
      { value: "$349 / $649 / $1,149", label: "Website / Community Life (website + families) / Complete (adds marketing), per community per month. Each plan includes the one before", tag: "draft" },
      { value: "100 paying", label: "Communities paying by June 2028: 20 from the free pilot, 30 from the waitlist at launch, the rest signed month by month", tag: "estimate" },
      { value: "≈$684k", label: "Annual recurring revenue (12 × monthly subscription revenue) in June 2028", tag: "derived" },
      { value: "≈48 communities", label: "Paying communities needed to cover every monthly cost once the whole team is paid. Reached at launch in July 2027", tag: "derived" },
      { value: "Jul 2027 – Jun 2028", label: "Year 1, the first 12 months of sales. Building starts Nov 2026; the free pilot runs Mar–Jun 2027", tag: "estimate" },
      { value: "≈$27k", label: "Cost of building and piloting, Nov 2026 – Jun 2027, paid by Catapult", tag: "estimate" },
      { value: "≈45%", label: "Operating margin in June 2028: what’s left of revenue after every cost, all salaries included", tag: "derived" },
      { value: "≈53%", label: "Operating margin at about $1M a year in revenue, the point where it could become its own company", tag: "derived" }
    ],
    timelineTitle: "When the milestones land",
    timeline: [
      { when: "Nov 2026", label: "Building starts", detail: "Adam and Hubert build on Catapult’s platform, with Dave mentoring" },
      { when: "Feb 2027", label: "Usable product", detail: "Ready for the first pilot organisations" },
      { when: "Mar 2027", label: "Free pilot goes live", detail: "Up to 5 California operators, 90 days against agreed results" },
      { when: "Jun 2027", label: "First revenue", detail: "The pilot’s 20 communities start paying" },
      { when: "Jul 2027", label: "Launch", detail: "On sale to everyone; 30 waitlist communities join; every monthly cost covered; the team goes full-time" },
      { when: "Q2 2028", label: "Complete plan on sale", detail: "Marketing tools to help fill apartments" },
      { when: "Jun 2028", label: "100 paying communities", detail: "About $684k in annual recurring revenue, at a 45% margin" },
    ],
    tagNote: "Tags: draft = a stated plan figure not yet tested with buyers · estimate = a planning assumption · derived = calculated from the other figures.",
    glossaryTitle: "Terms used on this page",
    glossary: [
      ["Alpha (free pilot)", "Up to five California operators use Kinward free for 90 days from March 2027. If it meets the results agreed with them, they start paying in June 2027 at a founding price (Community Life $519, Website $349)."],
      ["Beta launch", "July 2027, when Kinward goes on sale to everyone. It’s the start of Year 1."],
      ["Waitlist", "About 30 communities expected to sign up before launch and start paying in July 2027."],
      ["Beta offer", "The waitlist pays its setup fee up front and gets it back as a discount spread over its first 12 months of subscription."],
      ["Setup fee", "One-time charge for building each operator’s sites and loading their content: $2,500 for the main site, $1,000 per community, plus $1,000 and $250 per community for family set-up on Community Life."],
      ["Churn", "Communities that cancel. The plan assumes 1% a month."],
      ["Running total", "Every month’s result added up since building started in November 2026: how far behind or ahead the business is overall."],
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
      title: "How alpha works",
      steps: [
        { name: "Pre-alpha", body: "We build the new site alongside the old one, load calendars, menus and apartments, import family contacts, train staff and take baselines." },
        { name: "Day 0", body: "Once the agreed acceptance list is met, the organisation switches its DNS within the agreed number of days. The 90-day clock starts." },
        { name: "90 days live", body: "Success criteria measured; feedback calls every two weeks; check-ins at day 30, 60 and 90; a day-90 decision." }
      ],
      terms: [
        "Free through alpha, with no setup fee, until the success criteria are met. Then a 24-month subscription starts at the founding price (Community Life $519, Website $349), locked for the term; increases are capped at 5% a year after it.",
        "Not met at day 90: alpha extends free in 30-day steps, up to 180 days after go-live. After that they convert or leave owing nothing.",
        "They can cancel any time before converting, or decline within 10 business days of the results, and owe nothing. After converting, leaving early takes 60 days’ notice and three months’ fees.",
        "In return: a named decision-maker, a champion per community, baselines, feedback calls, and the DNS switch within the agreed days. Miss the switch and alpha ends; miss their own commitments and the free extension doesn’t apply.",
        "They own their content and can export it any time. Anonymised, aggregated activity data may improve the product; nothing that identifies a resident, family member or staff member leaves their organisation."
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
      { name: "Beta offer · the waitlist", rows: [
        ["Who", "The first 30 communities: the beta waitlist, joining at the beta launch in July 2027"],
        ["Setup", "Paid up front, then returned as a discount spread across their first 12 months of subscription"],
        ["Monthly", "List price ($349 / $649)"],
        ["Commitment", "Two-year contract (suggested); leaving early breaks it and its penalties apply"],
        ["Why", "Real scarcity and a reason to join the waitlist before launch"]
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
      { lane: 1, row: 0, from: 0, to: 0, label: "Recruit alpha", milestone: true },
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
      ["Adam", "Head of Senior Living, Catapult: product, sales, marketing, operations", "Unpaid; developing alongside Hubert and preparing sales", "First full-time hire: $62k salary once revenue covers it (from the beta launch, Jul 2027)", "$62k (for now)"],
      ["Tim", "Customer success: onboarding, training, support, research", "Unpaid", "Free (for now)", "Free (for now)"],
      ["Hubert", "Developer: senior living features, imports, the app", "Part-time, 20 hrs a week at $30/hr, contractor", "Full-time at $62k once revenue covers it, after Adam (from Jul 2027)", "Full-time; more developers as needed"],
      ["Sales associate", "Demos, proposals, closing; conference and outreach pipeline", "—", "Starts once revenue covers it, after Hubert (from Jul 2027): $55k base + 10% of the monthly fees of the communities they sign", "Same"],
      ["Dave (Catapult)", "Mentor and technical guidance; platform decisions", "From 1 Nov", "Catapult’s call", "Catapult’s call"],
      ["Jason (Catapult)", "Business mentor: strategy, pricing and sales guidance", "From 1 Nov", "Catapult’s call", "Catapult’s call"]
    ],
    capacity: [
      "Onboarding about 15 hours per community, plus about 5 per organisation for kickoff.",
      "Support 2 hours or less per community a month after day 30.",
      "Expected case: about 260 hours a month by month 12, roughly 1.6 people. Tim covers most of it; Hubert helps with builds.",
      "It pinches around month 9 (month 7–8 in the fast case). The first Phase 3 hire is onboarding and support, or a second developer, whichever is tighter."
    ]
  },

  model: {
    intro: "Move any input, drag a hire or change the timeframe, and every number, chart and table recalculates. The marks on each slider show where the plan sits. Everything is a planning estimate.",
    coverNote: "Catapult covers insurance, legal, bookkeeping and payroll"
  },

  monthly: {
    intro: "The same model, month by month. Each month’s result is revenue minus every cost; the running total adds them up. Moves with the sliders on the financial model page.",
    setupLabel: "Include setup fees",
    setupNote: "One-time fees paid up front by each new organisation: about $9,500 for five communities on Community Life.",
    creditLabel: "Beta offer: setup returned as a discount",
    creditNote: "The first 30 communities (the beta waitlist) pay setup up front and get it back as a discount spread evenly over their first 12 months of subscription.",
    first12Title: "The first 12 months: Nov 2026 – Oct 2027",
    first12Intro: "From the day development starts. Eight months of build and alpha (Catapult pays these costs; alpha is free until it converts in June), then the first four months of sales.",
    first12Short: "From the day building starts: eight months of building and the free pilot (the pilot communities start paying in June), then the first four months of sales.",
    year1Short: "The 12 months from the July 2027 launch. The running total starts from what building and the pilot cost before launch.",
    allTitle: "Nov 2026 – Jun 2028: from building to 100 communities",
    summaryTitle: "Month by month",
    year1Title: "Year 1: Jul 2027 – Jun 2028",
    year1Intro: "The 12 months from beta launch, when revenue starts. The running total starts from the build and alpha costs carried in (Nov 2026 – Jun 2027), so it shows when that debt is paid back."
  },

  scenarios: {
    intro: "The plan’s three cases differ only in how many communities sign by month 12. They recalculate from the model’s other inputs, so change a price or a cost above and these move too.",
    reading: [
      "In the expected case setup fees cover the early-month losses, so Year 1 needs no outside money (Catapult carries the build and alpha).",
      "But the beta waitlist’s setup comes back to them as a discount over their first 12 months, so treat that cash as an advance on their subscription.",
      "The slow case needs cover for its losses, or a later sales hire. The fast case needs the Phase 3 hires sooner."
    ],
    share: "About 75 paying communities is roughly 0.5% of the 14,000 assisted living and memory care communities with 26+ beds, and $508k is about 0.3% of the $153M engagement market."
  },

  objections: {
    intro: "The objections we expect on sales calls, in the buyer’s own words, with how we answer and what backs the answer up. Drafted from our offer work; none has been tested on an operator yet, so treat the answers as first drafts to refine on alpha calls.",
    groups: [
      { theme: "Value and price", items: [
        { q: "We already pay for LifeLoop or Go Icon.", who: "COO", answer: "They run engagement behind a login; none of them builds or runs the public website. Kinward puts the same community life on the website, in front of prospects and AI search, as well as on families’ phones. Their calendar can feed in, or Community Life replaces both the engagement app and the website for less than paying for both.", proof: "A side-by-side of what reaches the public website today vs with Kinward. Offer idea: a switch credit of up to 3 months of their remaining fees, paid out in the second year." },
        { q: "Budgets are tight. Is it worth it?", who: "COO or CFO", answer: "Compare it with the stack, not one vendor: website, engagement, messaging, AI chat and content bought separately run about $700–1,600 per community per month, plus about 20 hours of staff time. Community Life at $649 replaces two of those bills for less than one.", proof: "The monthly scorecard, baseline vs day 90: staff time, families reached, website freshness. Offer ideas: budget-season start (sign in Q3–Q4, bill from January), setup spread over 6 months, and the Pays-For-Itself guarantee once alpha proves the numbers." },
        { q: "Isn’t this just a cheaper website vendor, or a cheaper engagement app?", who: "Anyone comparing quotes", answer: "It’s a Community Life Platform: post once and it reaches the website, families by text and email, large-print print and AI search. Nobody else spans both halves, and nobody puts menus, news and apartments live on community pages.", proof: "The demo of one sample community end to end; the always-current guarantee (a menu or calendar more than 7 days out of date because of us means that month is free)." },
        { q: "Prices will go up once we’re locked in.", who: "CFO", answer: "Prices are locked for the term, and increases after it are capped at 5% a year. Many vendors in this market use multi-year renewals with no stated cap.", proof: "The cap written into the contract." },
      ]},
      { theme: "Trust", items: [
        { q: "You’re new. Will you be around?", who: "COO", answer: "Kinward is a branch of Catapult, an established website and CMS company that hosts the systems of hundreds of school districts. They get a proven platform, not a start-up experiment.", proof: "Powered by Catapult; full export of their content and contacts at any time." },
        { q: "Our property system already does this.", who: "COO or IT", answer: "Property systems like Yardi run units, leases and resident portals; they don’t publish a community’s daily life to its website and families. We connect to them rather than replace them, starting with the CRM and later live availability.", proof: "Inquiries routed to their CRM from day one; property-system integration on the roadmap (Stage 7)." },
      ]},
      { theme: "Adoption", items: [
        { q: "My staff won’t use another tool.", who: "Executive director", answer: "Posting takes a photo and one sentence from the phone, with a weekly reminder. Existing calendars and menus come in from a PDF or photo, and a ready-made content library means nothing starts empty. One entry replaces retyping the same news in five places.", proof: "The share of communities posting weekly without our help, tracked in alpha." },
        { q: "Families won’t sign up or read it.", who: "Executive director", answer: "There’s no app to download: families get updates by text and email in their own language, plus a weekly digest built automatically.", proof: "Family opt-in by day 30 and weekly open rates. Offer idea: a Family Night launch kit, where we run the first sign-up event with each community." },
      ]},
      { theme: "Switching", items: [
        { q: "Switching from our agency or website is a nightmare.", who: "VP of marketing", answer: "We do the migration. The new site is built alongside the old one and the switch only happens once the agreed acceptance list is met.", proof: "The migration guarantee: no broken pages or lost rankings, or we fix it and credit a month." },
        { q: "Moving the website will hurt our Google ranking.", who: "VP of marketing", answer: "Every old page address is mapped and redirected so rankings carry over, and each community gets a live-facts feed that search engines and AI tools can read and cite.", proof: "Search traffic stable after launch; the migration guarantee; a free AI Visibility Audit before they buy." },
        { q: "We can’t commit before we’ve seen it work.", who: "COO", answer: "Founding partners pay nothing until the results we agree together are met. After that, every customer gets a 90-day risk-free switch, and can start with one community before rolling out.", proof: "The alpha agreement’s success criteria; the 90-day risk-free switch." },
        { q: "If we leave, we lose everything.", who: "COO", answer: "They own their content and contacts and can export all of it at any time.", proof: "A full data export, written into the agreement." },
      ]},
      { theme: "Control and compliance", items: [
        { q: "Legal and IT will slow this down: texting consent, privacy.", who: "COO", answer: "It carries public, community-level information only, no resident care records, which keeps it outside HIPAA. Texting registration and consent records are handled in onboarding, and every community site shows its California licence number.", proof: "Texting registered within about 14 days; consent records kept per family." },
        { q: "Corporate needs brand control across all our communities.", who: "VP of marketing", answer: "Central templates and branding, shared content across every community site, and approvals by role.", proof: "Brand templates on every channel; one dashboard across communities." },
        { q: "I’m afraid wrong information goes out to families.", who: "Executive director or COO", answer: "A manager approves every family message before it goes (emergencies skip the queue), and staff see exactly where each post went and who it reached.", proof: "Approval logs and delivery tracking per message." },
      ]},
    ],
  },

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
