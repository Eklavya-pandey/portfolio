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

export {
  PROJECTS,
  CASE_STUDIES,
  getProjectBySlug,
  getCaseStudy
} from "../../data/projectsData";

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
