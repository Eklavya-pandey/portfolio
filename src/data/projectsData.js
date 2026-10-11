/**
 * Single Authoritative Source of Truth for Projects and Case Studies
 * RULE: One source of truth. Every theme renders from that data. Never copy text into a theme file.
 * A theme changes styling and chrome only; content, copy and section order are identical everywhere.
 */

export const CASE_STUDIES = {
  onestepprint: {
    slug: 'onestepprint',
    title: 'OneStepPrint website redesign',
    header: {
      heroImage: '/assets/projects/onestepprint/hero.jpg',
      heroWebp: '/assets/projects/onestepprint/hero.webp',
      heroAlt: 'OneStepPrint website hero',
      heroPosition: 'center top',
      title: 'OneStepPrint website redesign',
      meta: {
        date: '3 August 2023',
        services: 'UI design and prototyping',
        client: 'Viraj Patel'
        // company row is empty/hidden
      }
    },
    brief: {
      label: 'BRIEF',
      text: 'Viraj ran a printing business and had a single-page, pamphlet-style website. He wanted a multi-page site with a look and feel that matched printing.'
    },
    challenge: {
      label: 'CHALLENGE',
      text: 'Turn a single page into a multi-page site, and make scrolling feel like watching a print job.'
    },
    problem: {
      label: 'PROBLEM',
      items: [
        'Outdated single-page design',
        'Missing essential information',
        'Overwhelming use of colors',
        'No premium feel'
      ]
    },
    audience: {
      label: 'AUDIENCE',
      items: [
        'Businesses and individuals who need custom printing',
        'Skill levels from beginners to design professionals',
        'Different goals: business cards, promotional materials, personal projects'
      ]
    },
    concept: {
      label: 'CONCEPT',
      title: 'Scroll as a print job.',
      intro: 'Four CMYK color dots travel through the site from start to finish.',
      steps: [
        {
          num: 1,
          title: 'Dots enter:',
          desc: 'as the first section scrolls, the four dots pass through a scanner.'
        },
        {
          num: 2,
          title: 'Products come out:',
          desc: 'the products then pass through the scanner, showing the range of printing work.'
        },
        {
          num: 3,
          title: 'Capabilities:',
          desc: 'scrolling further reveals what the company can do.'
        },
        {
          num: 4,
          title: 'Printer graphics:',
          desc: 'printer visuals appear and match the design.'
        }
      ]
    },
    video: {
      src: '/assets/projects/onestepprint/demo.mp4',
      caption: 'Scroll walkthrough of the final website.',
      poster: '/assets/projects/onestepprint/hero.jpg'
    },
    process: {
      label: 'PROCESS',
      items: [
        {
          phase: 'Research',
          detail: 'Reviewed engagement data. High bounce rates matched the outdated design.'
        },
        {
          phase: 'Competitors',
          detail: 'Compared online printers on design, content and experience.'
        },
        {
          phase: 'Ideation',
          detail: 'Content order, navigation, the scroll story, a palette drawn from print colors, and brand messaging.'
        },
        {
          phase: 'Wireframes',
          detail: 'A multi-page structure with clear navigation and separate pages with detailed information.'
        },
        {
          phase: 'Prototype',
          detail: 'I built the scroll prototype in Figma, so the developer could see exactly how the dots, scanner and products move.'
        },
        {
          phase: 'Build',
          detail: 'I sat with the developer to finish the build.'
        }
      ]
    },
    pages: [
      {
        src: '/assets/projects/onestepprint/pages/section-2.jpg',
        caption: 'section-2'
      },
      {
        src: '/assets/projects/onestepprint/pages/section-3.jpg',
        caption: 'section-3'
      },
      {
        src: '/assets/projects/onestepprint/pages/last.jpg',
        caption: 'last'
      }
    ],
    outcome: {
      label: 'OUTCOME',
      text: 'Designed, prototyped and built with the developer.'
    },
    takeaways: {
      label: 'TAKEAWAYS',
      items: [
        'Tie the design to what the business actually does, and visitors remember it.',
        'Motion can carry a story, but the content and navigation have to stay clear.',
        'Data and competitor review show where the real problems are.'
      ]
    }
  }
};

export const PROJECTS = [
  {
    id: 'stock-trading-app',
    tag: 'FINTECH',
    category: 'fintech',
    categories: ['Fintech', 'Mobile'],
    title: 'STOCK TRADING APP',
    tagline: 'End-to-end mobile trading experience engineered for high-frequency precision and zero latency.',
    description: 'Traders needed fast, precise order flow on mobile.',
    image: '/editorial/project1.png',
    imageAlt: 'Stock Trading App interface mockup showing candlestick charts and trade orders',
    stats: [
      { val: '3 mo', lbl: 'DURATION' },
      { val: 'Mobile', lbl: 'PLATFORM' },
      { val: 'UI/UX', lbl: 'ROLE' },
      { val: '6', lbl: 'SCREENS' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  },
  {
    id: 'investment-modules',
    tag: 'FINTECH',
    category: 'fintech',
    categories: ['Fintech', 'Web'],
    title: 'INVESTMENT MODULES',
    tagline: 'Mutual Funds discovery, Option Chain terminal, and WealthBasket thematic investment journeys.',
    description: 'Investors had no single place to discover funds, options and baskets.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    imageAlt: 'Investment Modules dashboard mockup with analytics and SIP calculators',
    stats: [
      { val: '3', lbl: 'MODULES' },
      { val: 'Web/App', lbl: 'PLATFORM' },
      { val: '+266%', lbl: 'CONVERSION' },
      { val: 'BP Equities', lbl: 'CLIENT' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  },
  {
    id: 'markets-overview',
    tag: 'DESIGN SYSTEM',
    category: 'design-system',
    categories: ['Design System', 'Fintech', 'Web'],
    title: 'DESIGN SYSTEM & INFRASTRUCTURE',
    tagline: 'Unified multi-platform financial data visualization architecture powering 4 distinct investor applications.',
    description: 'Four investor apps, four inconsistent interfaces.',
    image: '/editorial/project3.png',
    imagePosition: 'center top',
    imageAlt: 'Design System & Infrastructure component library and token explorer mockup',
    stats: [
      { val: '20', lbl: 'VARIANTS' },
      { val: 'FII/DII', lbl: 'DATA' },
      { val: '4', lbl: 'APPS SYNCED' },
      { val: '140+', lbl: 'DESIGN TOKENS' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  },
  {
    id: 'internal-ai-chatbot',
    tag: 'AI',
    category: 'ai',
    categories: ['AI', 'Internal Tool'],
    title: 'INTERNAL AI CHATBOT & COPILOT',
    tagline: 'Conversational AI assistant for automated portfolio health checkups, intent mapping, and support escalation.',
    description: 'Conversational AI assistant for automated portfolio health checkups, intent mapping, and support escalation.',
    image: '/editorial/project1.png',
    imageAlt: 'Internal AI Chatbot conversational UI mockup with streaming responses',
    stats: [
      { val: '94%', lbl: 'INTENT ACCURACY' },
      { val: '-42%', lbl: 'ESCALATION' },
      { val: '<200ms', lbl: 'STREAMING' },
      { val: 'Neo', lbl: 'LOCATION' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  },
  {
    id: 'distributor-dashboard',
    tag: 'FINTECH',
    category: 'fintech',
    categories: ['Fintech', 'Internal Tool'],
    title: 'DISTRIBUTOR INVOICING DASHBOARD',
    tagline: 'Institutional commission tracking, automated partner invoicing, and client onboarding MIS analytics.',
    description: 'Institutional commission tracking, automated partner invoicing, and client onboarding MIS analytics.',
    image: '/editorial/project2.png',
    imagePosition: 'left top',
    imageAlt: 'Distributor Invoicing Dashboard financial data grid mockup',
    stats: [
      { val: '1,200+', lbl: 'PARTNERS' },
      { val: '24h', lbl: 'INVOICE CYCLE' },
      { val: 'MIS', lbl: 'ANALYTICS' },
      { val: 'Desktop', lbl: 'PLATFORM' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  },
  {
    id: 'onestepprint',
    slug: 'onestepprint',
    tag: 'WEB',
    category: 'web',
    categories: ['Web'],
    title: 'OneStepPrint website redesign',
    tagline: 'Scroll-led storytelling site for an online printing business.',
    description: 'Scroll-led storytelling site for an online printing business.',
    problemLine: 'A single-page pamphlet site needed to become a multi-page, immersive experience.',
    metric: null, // No metric chip, number or stat
    stats: null,
    role: 'UI design and prototyping',
    services: 'UI design and prototyping',
    date: '3 August 2023',
    client: 'Viraj Patel',
    company: '', // Hide company row everywhere
    cover: '/assets/projects/onestepprint/hero.jpg',
    image: '/assets/projects/onestepprint/hero.jpg',
    imagePosition: 'center top',
    imageAlt: 'OneStepPrint website hero',
    caseStudyUrl: '/work/onestepprint',
    hasCaseStudy: true,
    cardLabel: 'VIEW CASE STUDY'
  },
  {
    id: 'pigeon-edu',
    tag: 'WEB',
    category: 'web',
    categories: ['Web'],
    title: 'PIGEON EDU PLATFORM REVAMP',
    tagline: 'Educational software interface, interactive learning components, and student analytics dashboard.',
    description: 'Educational software interface, interactive learning components, and student analytics dashboard.',
    image: '/editorial/project2.png',
    imageAlt: 'Pigeon Edu platform revamp mockup',
    stats: [
      { val: '15K+', lbl: 'STUDENTS' },
      { val: 'Web/App', lbl: 'PLATFORM' },
      { val: 'UI/UX', lbl: 'ROLE' },
      { val: 'EdTech', lbl: 'DOMAIN' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  },
  {
    id: 'ipo-application-flow',
    tag: 'FINTECH',
    category: 'fintech',
    categories: ['Fintech'],
    title: 'IPO APPLICATION & BIDDING FLOW',
    tagline: 'High-speed retail IPO subscription flow with seamless UPI 2.0 autopay mandate verification.',
    description: 'High-speed retail IPO subscription flow with seamless UPI 2.0 autopay mandate verification.',
    image: '/editorial/project1.png',
    imageAlt: 'IPO Application & Bidding flow mockup',
    stats: [
      { val: 'UPI 2.0', lbl: 'PAYMENT' },
      { val: '3 Steps', lbl: 'FLOW' },
      { val: 'Retail', lbl: 'AUDIENCE' },
      { val: 'Shipped', lbl: 'STATUS' }
    ],
    company: '',
    year: '',
    caseStudyUrl: null,
    hasCaseStudy: false,
    cardLabel: null
  }
];

export function getProjectBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return PROJECTS.find(p => p.id === normalized || p.slug === normalized) || null;
}

export function getCaseStudy(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return CASE_STUDIES[normalized] || null;
}
