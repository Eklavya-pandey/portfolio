/**
 * Editorial / Technical Theme Data Layer
 * Comprehensive project case studies, design system tokens, experience metrics, certifications, and skills.
 */

export const TICKER_ITEMS = [
  { id: 'avail', label: 'STATUS', text: 'AVAILABLE FOR Q2/Q3 2026 PROJECTS' },
  { id: 'loc', label: 'LOCATION', text: 'MUMBAI / GOA · REMOTE & HYBRID' },
  { id: 'focus', label: 'SPECIALTY', text: 'FINTECH · TRADING SYSTEMS · AI FLOWS' },
  { id: 'record', label: 'TRACK RECORD', text: '100% FIRST-TIME LAUNCH APPROVAL' },
  { id: 'impact', label: 'IMPACT', text: 'LIFTED AD CONVERSION FROM 1.2% TO 4.4%' },
  { id: 'tz', label: 'TIMEZONE', text: 'IST (UTC +5:30)' }
];

export const PROJECTS = [
  {
    id: 'stock-trading-app',
    tag: 'FINTECH',
    categories: ['Fintech', 'Mobile'],
    title: 'STOCK TRADING APP',
    tagline: 'End-to-end mobile trading experience engineered for high-frequency precision and zero latency.',
    image: '/editorial/project1.png',
    stats: [
      { val: '3 mo', lbl: 'DURATION' },
      { val: 'Mobile', lbl: 'PLATFORM' },
      { val: 'UI/UX', lbl: 'ROLE' },
      { val: '6', lbl: 'SCREENS' }
    ],
    overview: 'Redesigned the flagship mobile stock trading interface for Neo Investment & Finsev from the ground up. The mission was to simplify complex market depth, real-time tick streaming, and instant order placement into a clean, intuitive layout for both novice investors and experienced day traders.',
    challenge: 'Retail traders often abandon platforms due to visual clutter, ambiguous order confirmation feedback, and overwhelming multi-level candlestick charts on small mobile screens.',
    solution: 'Designed a high-density, contrast-optimized dark interface featuring unified order pads, rapid swipe-to-execute gestures, customizable watchlist widgets, and contextual P&L previews.',
    metrics: [
      { val: '+42%', lbl: 'DAILY ACTIVE USERS' },
      { val: '<120ms', lbl: 'PERCEIVED LATENCY' },
      { val: '-38%', lbl: 'ORDER ENTRY ERRORS' },
      { val: '4.8★', lbl: 'APP STORE RATING' }
    ],
    keyDeliverables: [
      'Comprehensive 80+ screen Figma component library with auto-layout v5',
      'High-contrast candlestick & order depth chart visualization system',
      'Rapid one-tap order pad with biometrics confirmation',
      'Live P&L tracking micro-interactions and haptic feedback specifications',
      'Developer handoff with token-synced React Native design tokens'
    ],
    techStack: ['Figma', 'Design Systems', 'Micro-interactions', 'Fintech Charts', 'iOS/Android Guidelines'],
    colorPalette: ['#0A0A0C', '#00D26A', '#FF3B30', '#1F222A', '#FFFFFF']
  },
  {
    id: 'investment-modules',
    tag: 'FINTECH',
    categories: ['Fintech', 'Web'],
    title: 'INVESTMENT MODULES',
    tagline: 'Mutual Funds discovery, Option Chain terminal, and WealthBasket thematic investment journeys.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    stats: [
      { val: '3', lbl: 'MODULES' },
      { val: 'Web/App', lbl: 'PLATFORM' },
      { val: '+266%', lbl: 'CONVERSION' },
      { val: 'BP Equities', lbl: 'CLIENT' }
    ],
    overview: 'Spearheaded zero-to-one product design for three high-impact financial instruments at BP Equities: a retail Mutual Funds explorer with automated SIP calculators, an institutional Option Chain terminal with real-time Greeks, and WealthBasket thematic baskets.',
    challenge: 'Complex derivatives and basket rebalancing mechanics created severe user anxiety and high bounce rates among retail investors unfamiliar with options analytics.',
    solution: 'Engineered intuitive visual payoff diagrams, payoff matrix previews, and step-by-step thematic investment onboarding with transparent risk-reward breakdowns.',
    metrics: [
      { val: '+266%', lbl: 'CAMPAIGN CONVERSION' },
      { val: '40K→61K', lbl: 'COMMUNITY GROWTH' },
      { val: '2 Modules', lbl: 'ZERO-TO-ONE SHIPPED' },
      { val: '100%', lbl: 'COMPLIANCE CLEARANCE' }
    ],
    keyDeliverables: [
      'Real-time Option Chain table with Greeks (Delta, Gamma, Theta, Vega)',
      'Multi-leg options strategy builder with live profit/loss curve preview',
      'Thematic WealthBasket discovery and auto-rebalancing interface',
      'Mutual Fund SIP calculator with compound growth sliders'
    ],
    techStack: ['Figma', 'Derivatives Data Viz', 'Strategy Builder', 'Design Tokens', 'User Journey Mapping'],
    colorPalette: ['#121316', '#FF5E1F', '#2979FF', '#00D26A', '#FFFFFF']
  },
  {
    id: 'markets-overview',
    tag: 'DESIGN SYSTEM',
    categories: ['Design System', 'Fintech', 'Web'],
    title: 'DESIGN SYSTEM & INFRASTRUCTURE',
    tagline: 'Unified multi-platform financial data visualization architecture powering 4 distinct investor applications.',
    image: '/editorial/project3.png',
    stats: [
      { val: '20', lbl: 'VARIANTS' },
      { val: 'FII/DII', lbl: 'DATA' },
      { val: '4', lbl: 'APPS SYNCED' },
      { val: '140+', lbl: 'DESIGN TOKENS' }
    ],
    overview: 'Architected and standardized the core Markets Overview analytics dashboard across web and mobile platforms. Built a modular widget architecture for indices (Nifty, Sensex), heatmaps, sector gainers/losers, FII/DII institutional activity, and global cues.',
    challenge: 'Four disparate legacy investor products each rendered financial data differently, creating fragmented user experiences, duplicated engineering efforts, and inconsistent technical definitions.',
    solution: 'Constructed an institutional-grade design system token system with 140+ components, responsive table hierarchies, customizable dashboard widgets, and strict WCAG 2.1 AA accessibility standards.',
    metrics: [
      { val: '4 Apps', lbl: 'DESIGN REUSE' },
      { val: '3.5x', lbl: 'DEV IMPLEMENTATION SPEED' },
      { val: '140+', lbl: 'DESIGN TOKENS' },
      { val: 'Zero', lbl: 'DESIGN REGRESSIONS' }
    ],
    keyDeliverables: [
      'Multi-device widget library (web, mobile tablet, native iOS/Android)',
      'Institutional market depth & FII/DII flow visualization widgets',
      'Interactive financial heatmap grid with percentage threshold color banding',
      'Design Token Studio pipeline syncing JSON tokens directly with frontend repositories'
    ],
    techStack: ['Figma Tokens', 'Design System Architecture', 'Data Viz', 'WCAG 2.1 AA', 'React Components'],
    colorPalette: ['#FFFFFF', '#E8E8E6', '#FF5E1F', '#1A1A1A', '#6B6B6B']
  },
  {
    id: 'internal-ai-chatbot',
    tag: 'AI',
    categories: ['AI', 'Fintech'],
    title: 'INTERNAL AI CHATBOT & COPILOT',
    tagline: 'Conversational AI assistant for automated portfolio health checkups, intent mapping, and support escalation.',
    image: '/editorial/project1.png',
    stats: [
      { val: '94%', lbl: 'INTENT ACCURACY' },
      { val: '-42%', lbl: 'ESCALATION' },
      { val: '<200ms', lbl: 'STREAMING' },
      { val: 'Neo', lbl: 'LOCATION' }
    ],
    overview: 'Designed an intelligent in-app and web AI conversational copilot helping users navigate complex financial portfolios, trigger account queries, and resolve technical trading inquiries.',
    challenge: 'Customer support teams were overwhelmed with repetitive queries regarding margin requirements, trade status, and account tax documentation.',
    solution: 'Crafted structured generative UI cards, streaming conversational bubbles, contextual suggestion chips, and graceful human-agent escalation handoffs.',
    metrics: [
      { val: '94%', lbl: 'INTENT RECOGNITION' },
      { val: '-42%', lbl: 'TICKET ESCALATION' },
      { val: '4.7/5', lbl: 'USER SATISFACTION' },
      { val: 'Instant', lbl: 'FIRST RESPONSE' }
    ],
    keyDeliverables: [
      'Generative UI component cards for portfolio summaries, P&L, and trade status',
      'Interactive intent chips and conversational flow trees',
      'Real-time streaming text typography and haptic response',
      'Seamless fallback to human concierge advisor interface'
    ],
    techStack: ['Figma', 'AI Interfaces', 'Generative UI', 'Conversational UX', 'Interaction Specs'],
    colorPalette: ['#0B0C10', '#6C5CE7', '#00D26A', '#2D3436', '#FFFFFF']
  },
  {
    id: 'distributor-dashboard',
    tag: 'FINTECH',
    categories: ['Fintech', 'Web'],
    title: 'DISTRIBUTOR INVOICING DASHBOARD',
    tagline: 'Institutional commission tracking, automated partner invoicing, and client onboarding MIS analytics.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    stats: [
      { val: '1,200+', lbl: 'PARTNERS' },
      { val: '24h', lbl: 'INVOICE CYCLE' },
      { val: 'MIS', lbl: 'ANALYTICS' },
      { val: 'Desktop', lbl: 'PLATFORM' }
    ],
    overview: 'Built an institutional-grade B2B distributor portal enabling financial partners and independent wealth advisors to reconcile brokerage commissions, generate automated invoices, and audit client onboarding pipelines.',
    challenge: 'Distributors previously handled commission reconciliation through disjointed spreadsheets, resulting in delayed 30-day payout cycles and high manual accounting overhead.',
    solution: 'Engineered a unified financial dashboard with tabular data grids, instant PDF/CSV invoice generators, payout calculation visualizers, and granular role-based permissions.',
    metrics: [
      { val: '1,200+', lbl: 'ACTIVE DISTRIBUTORS' },
      { val: '-85%', lbl: 'MANUAL RECONCILIATION' },
      { val: '24 Hours', lbl: 'PAYOUT PROCESSING' },
      { val: 'Zero', lbl: 'DISPUTE ESCALATIONS' }
    ],
    keyDeliverables: [
      'High-density data table with sorting, filtering, and custom column calipers',
      'Automated one-click GST invoice generation and digital signature flow',
      'Interactive commission tier calculator with milestone progress bars',
      'Real-time client onboarding pipeline status Kanban'
    ],
    techStack: ['Figma', 'B2B SaaS', 'Data Tables', 'Design Systems', 'Invoicing Workflows'],
    colorPalette: ['#1A1A1A', '#FF5E1F', '#00D26A', '#E8E8E6', '#FFFFFF']
  },
  {
    id: 'skydreams-portfolio',
    tag: 'WEB',
    categories: ['Web'],
    title: 'SKYDREAMS CLIENT PORTFOLIO',
    tagline: 'Five end-to-end web applications and consumer platforms delivered with 100% first-launch client approval.',
    image: '/editorial/project3.png',
    stats: [
      { val: '5', lbl: 'CLIENTS' },
      { val: '100%', lbl: 'APPROVAL' },
      { val: '3 Weeks', lbl: 'AVG CYCLE' },
      { val: 'Full-Cycle', lbl: 'ROLE' }
    ],
    overview: 'Spearheaded comprehensive digital product design across 5 diverse enterprise clients spanning fintech, lifestyle, media, and consumer e-commerce at digital consultancy Skydreams.',
    challenge: 'Each client arrived with aggressive 3-week turnaround schedules, ambiguous requirements, and high expectations for distinctive visual brand identities.',
    solution: 'Implemented structured discovery sprints, rapid modular wireframing, high-fidelity interactive prototypes, and production-ready developer design systems.',
    metrics: [
      { val: '5 Clients', lbl: 'LAUNCHED ON TIME' },
      { val: '100%', lbl: 'FIRST-APPROVAL RATE' },
      { val: '3 Weeks', lbl: 'AVERAGE SPRINT' },
      { val: 'Zero', lbl: 'DELIVERY DELAYS' }
    ],
    keyDeliverables: [
      'Comprehensive design guidelines and component libraries for each client',
      'Responsive web layouts optimized across desktop, tablet, and mobile',
      'Clickable high-fidelity stakeholder prototypes in Figma',
      'Production asset packages with SVG iconography and responsive token maps'
    ],
    techStack: ['Figma', 'Client Discovery', 'Rapid Prototyping', 'Design Systems', 'Responsive Web'],
    colorPalette: ['#111111', '#FF5E1F', '#00D26A', '#FFFFFF', '#6C5CE7']
  },
  {
    id: 'pigeon-edu',
    tag: 'WEB',
    categories: ['Web'],
    title: 'PIGEON EDU PLATFORM REVAMP',
    tagline: 'Educational software interface, interactive learning components, and student analytics dashboard.',
    image: '/editorial/project1.png',
    stats: [
      { val: '+32%', lbl: 'RETENTION' },
      { val: '12+', lbl: 'MODULES' },
      { val: 'Web', lbl: 'PLATFORM' },
      { val: 'EdTech', lbl: 'DOMAIN' }
    ],
    overview: 'Revamped the core learning portal and educator dashboard for Pigeon Edu. Technology, enhancing student course completion, interactive quiz engagement, and instructor performance monitoring.',
    challenge: 'Outdated legacy visual hierarchy caused steep student drop-offs during long-form assessment quizzes and multi-stage course modules.',
    solution: 'Redesigned the learning experience with bite-sized progressive disclosure, gamified progress markers, clear typography contrast, and actionable instructor analytics.',
    metrics: [
      { val: '+32%', lbl: 'STUDENT RETENTION' },
      { val: '12+', lbl: 'COURSES REDESIGNED' },
      { val: '+45%', lbl: 'QUIZ COMPLETION' },
      { val: '4.8★', lbl: 'STUDENT FEEDBACK' }
    ],
    keyDeliverables: [
      'Interactive student course viewer with video playback and note-taking sidecar',
      'Gamified assessment quiz components with instant feedback states',
      'Educator analytics dashboard displaying class completion percentiles',
      'Cohesive responsive design system across desktop and tablet'
    ],
    techStack: ['Figma', 'EdTech Systems', 'Gamification', 'Responsive Web', 'Design Systems'],
    colorPalette: ['#1A1A1A', '#FF5E1F', '#00D26A', '#E8E8E6', '#FFFFFF']
  },
  {
    id: 'ipo-application-flow',
    tag: 'FINTECH',
    categories: ['Fintech', 'AI'],
    title: 'IPO APPLICATION FLOW',
    tagline: 'Streamlined retail IPO bidding pipeline eliminating UPI mandate friction and investor drop-offs.',
    image: '/editorial/project2.png',
    stats: [
      { val: '6', lbl: 'SCREENS' },
      { val: 'JS', lbl: 'STACK' },
      { val: '3', lbl: 'CTA STATES' },
      { val: '100%', lbl: 'APPROVAL' }
    ],
    overview: 'Engineered a seamless retail IPO application flow allowing users to discover upcoming issues, bid across multiple lots, verify UPI auto-mandates, and track allotment statuses in under 90 seconds.',
    challenge: 'Prior IPO bidding flows experienced severe 64% user abandonment at the UPI mandate stage due to unclear timelines, lot cut-off calculations, and complex multi-bid lot mechanics.',
    solution: 'Created a step-by-step progressive disclosure wizard with real-time price-band calculation, automatic lot size multiplier chips, and an interactive visual timeline illustrating when funds are blocked, allotted, and listed.',
    metrics: [
      { val: '92s', lbl: 'AVG. COMPLETION TIME' },
      { val: '-54%', lbl: 'MANDATE FAILURE RATE' },
      { val: '+180%', lbl: 'TOTAL BIDS SUBMITTED' },
      { val: '100%', lbl: 'CLIENT APPROVAL' }
    ],
    keyDeliverables: [
      '3-step progressive bid calculation interface',
      'Dynamic UPI auto-mandate status tracker with push notification states',
      'Financial timeline visualizer for issue subscription periods',
      'Accessibility-audited high contrast dark theme optimized for readability'
    ],
    techStack: ['Figma', 'UX Research', 'Information Architecture', 'Prototyping', 'UPI Flow Specs'],
    colorPalette: ['#0C0D10', '#00E676', '#2979FF', '#1E2028', '#FFFFFF']
  }
];

export const DESIGN_SYSTEM_TOKENS = {
  colors: [
    { name: 'Ink Black', hex: '#1A1A1A', role: 'Primary Typography & Borders', contrast: '15.4:1 AAA' },
    { name: 'Safety Orange', hex: '#FF5E1F', role: 'Brand Accent & Primary CTAs', contrast: '3.8:1 Large' },
    { name: 'Paper Neutral', hex: '#E8E8E6', role: 'Surface Background & Panels', contrast: 'Base Canvas' },
    { name: 'Card White', hex: '#FFFFFF', role: 'Elevated Card Surfaces', contrast: '18.2:1 AAA' },
    { name: 'Technical Green', hex: '#00D26A', role: 'Positive Gains & Live Status', contrast: '4.2:1 AA' },
    { name: 'Muted Slate', hex: '#7A7A78', role: 'Secondary Body & Metadata', contrast: '4.7:1 AA' }
  ],
  typography: [
    { level: 'Display Hero', size: '96px / 7.5vw', weight: '800 ExtraBold', usage: 'Primary Typographic Hero' },
    { level: 'Section Title', size: '32px', weight: '800 ExtraBold', usage: 'Major Section Headlines' },
    { level: 'Card Headline', size: '20px', weight: '800 ExtraBold', usage: 'Project Cards & Modals' },
    { level: 'Body Monospace', size: '14px', weight: '400 Regular', usage: 'Descriptions & Documentation' },
    { level: 'Metadata Pill', size: '11px', weight: '700 Bold', usage: 'Tags, Badges, Metrics' }
  ],
  principles: [
    { title: 'Information Density', desc: 'No decorative fluff. Every pixel delivers intentional context or utility.' },
    { title: 'Strict Monospace Grid', desc: 'Rigid alignment inspired by financial tickers and technical terminal outputs.' },
    { title: 'Tactile Contrast', desc: 'Solid black strokes (#1A1A1A) paired with industrial safety orange (#FF5E1F).' }
  ]
};

export const CERTIFICATIONS = [
  'PMI: Becoming an AI-First Product Leader',
  'PMI: Technical Product Management',
  'PMI: Product Management First Steps',
  'PMI: Product Strategy & Roadmap',
  'Google (Udacity): Product Design',
  'Product School: AI Micro-Certification',
  'Outskill: Generative AI Mastermind',
  'FutureLearn: Digital Skills, User Experience',
  'Coursera: Low-Fidelity Prototype',
  'Infosys Springboard: HTML5, The Language',
  'Simplilearn: Introduction to Front End Development'
];

export const EDUCATION = {
  degree: 'B.TECH · CIVIL ENGINEERING',
  institution: 'ABES Engineering College, Ghaziabad',
  period: '2015 – 2019',
  note: 'Analytical problem-solving and structural thinking, applied to digital product design.'
};

export const SKILL_GROUPS = [
  {
    category: 'Product Design',
    skills: [
      'Product Strategy',
      'UX Strategy',
      'Product Discovery',
      'Interaction Design',
      'Information Architecture',
      'User Flows',
      'Prototyping',
      'UI Design',
      'Wireframes'
    ]
  },
  {
    category: 'Research & Strategy',
    skills: [
      'Design QA (Android/iOS)',
      'Functional QA',
      'UX Research',
      'Stakeholder Interviewing',
      'Feature Scoping'
    ]
  },
  {
    category: 'Design Tools',
    skills: [
      'Figma',
      'Adobe Photoshop',
      'Illustrator',
      'InDesign',
      'HTML & CSS',
      'Postman'
    ]
  },
  {
    category: 'AI & Prototyping Tools',
    skills: [
      'Cursor',
      'Lovable',
      'Framer'
    ]
  },
  {
    category: 'Visual & Marketing Design',
    skills: [
      'Branding',
      'Content Design',
      'Social & Email Campaign Design'
    ]
  }
];

export const EXPERIENCES = [
  {
    id: 'neo',
    role: 'Product Designer',
    company: 'Neo Wealth and Asset Management Pvt. Ltd.',
    location: 'Goa',
    period: 'Dec 2025 – Present',
    summary: 'Leading UX for a new stock-trading app, an internal invoicing dashboard, an AI support chatbot, and a cross-platform design system.',
    metricCards: [
      { val: 'Android + iOS', lbl: 'TRADING APP UX' },
      { val: 'Web + Mobile', lbl: 'DESIGN SYSTEM' },
      { val: '2 internal tools', lbl: 'INVOICING + AI CHATBOT' }
    ],
    bullets: [
      'Lead end-to-end UX for a new stock-trading app, defining information architecture and interaction patterns for complex market data, portfolio, and charting workflows across Android and iOS.',
      'Own design QA across Android and iOS releases, partnering with QA and engineering to validate interaction behaviour, visual fidelity, responsive states, and critical user workflows before launch.',
      'Designed an internal distributor invoicing dashboard, automating manual billing workflows and role-based access for the finance team.',
      'Lead UX research and feature definition for an internal AI support chatbot, mapping support workflows, defining conversation architecture and escalation paths, and translating agent pain points into prioritized product capabilities.',
      'Built a cross-platform design system (web + mobile), adopted by the engineering team to cut new-screen handoff time.'
    ],
    chips: ['Figma', 'Design Systems', 'Design QA', 'Interaction Design', 'UX Research', 'iOS/Android'],
    hasRelatedWork: true
  },
  {
    id: 'bp-equities',
    role: 'Product Designer',
    company: 'BP Equities Pvt. Ltd.',
    location: 'Mumbai',
    period: 'Feb 2024 – Dec 2025',
    summary: 'Designed and shipped Mutual Funds, Option Chain and WealthBasket modules from zero to launch.',
    metricCards: [
      { val: '1.2% → 4.4%', lbl: 'ACQUISITION CONVERSION' },
      { val: '40K → 61K', lbl: 'INSTAGRAM FOLLOWERS' },
      { val: '3 modules', lbl: 'ZERO TO LAUNCH' }
    ],
    bullets: [
      'Designed and shipped Mutual Funds, Option Chain, WealthBasket modules from zero to launch, plus revamped Account and Refer & Earn flows.',
      'Improved acquisition conversion from 1.2% to 4.4% through redesigned landing and acquisition experiences.',
      'Contributed to Instagram growth from 40K to 61K followers through a redesigned content system and ideas for short-form video formats.',
      'Produced marketing collateral (email, brochures, print) supporting acquisition campaigns.'
    ],
    chips: ['Figma', 'Mutual Funds', 'Option Chain', 'WealthBasket', 'Landing Pages'],
    hasRelatedWork: true
  },
  {
    id: 'skydreams',
    role: 'Product Designer',
    company: 'Skydreams',
    location: 'Mumbai',
    period: 'May 2023 – Jan 2024',
    summary: 'End-to-end web design across 5 client engagements.',
    collapsedMetric: '5 clients · 100% first-launch approval',
    metricCards: [
      { val: '5 clients', lbl: 'IDEATION TO LAUNCH' },
      { val: '100%', lbl: 'FIRST-LAUNCH CLIENT APPROVAL' }
    ],
    bullets: [
      'Owned end-to-end web design across 5 client engagements (OneStepPrint, 1Click Capital, Romantique, 1Click Global, Nobz), from ideation to launch.',
      'Partnered directly with developers on implementation, achieving 100% first-launch client approval across all 5 projects.',
      'Designed responsive layouts and user flows that improved site performance and satisfaction.'
    ],
    chips: ['Figma', 'Web Design', 'Responsive Design', 'Prototyping', 'Developer Handoff'],
    hasRelatedWork: false
  },
  {
    id: 'pigeon',
    role: 'UI & Graphic Designer',
    company: 'Pigeon Edu. Technology',
    location: 'Bengaluru',
    period: 'Nov 2021 – Apr 2023',
    summary: 'Web, dashboard and learning material design for an edtech company.',
    collapsedMetric: '2,000+ students',
    metricCards: [
      { val: '2,000+', lbl: 'STUDENTS USING MY STUDY MATERIAL' }
    ],
    bullets: [
      'Revamped website and sales dashboard, improving navigation and user adoption.',
      'Designed complete study material for 2,000+ students, improving readability and usability.',
      'Delivered daily creative assets (posters, social, web) aligned to brand and marketing goals.'
    ],
    chips: ['Figma', 'Adobe Photoshop', 'Illustrator', 'Dashboard Design', 'Study Material Design'],
    hasRelatedWork: false
  }
];

export const FREELANCE_ROLES = [
  {
    role: 'Associate Visual Designer',
    company: 'The Souled Store',
    location: 'Mumbai',
    period: 'Jan 2024 – Feb 2024',
    details: 'Ad campaigns and social content, email campaign UI, contribution to mobile app redesign.'
  },
  {
    role: 'Freelance Graphic Designer',
    company: 'Plus365',
    location: 'Abu Dhabi (UAE)',
    period: 'Jan 2023 – Apr 2023',
    details: 'Brochures and flyers, print-ready marketing assets.'
  },
  {
    role: 'Freelance Graphic Designer',
    company: 'Key Education Foundation',
    location: 'Bengaluru',
    period: 'Feb 2023 – Mar 2023',
    details: '3 educational books for parents and teachers, end-to-end from ideation to print.'
  }
];
