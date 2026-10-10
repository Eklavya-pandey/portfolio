// Centralized, theme-agnostic portfolio data for Naveen Kumar Pandey
// Can power Windows 98, Editorial, and Gaming themes without duplication.

export const portfolioData = {
  profile: {
    name: 'NAVEEN KUMAR PANDEY',
    role: 'SR. EXECUTIVE UI/UX DESIGNER • FINTECH • WEB & MOBILE',
    title: 'SR. EXECUTIVE UI/UX DESIGNER • FINTECH • WEB & MOBILE',
    headline: 'Hello, I\'m Naveen Kumar Pandey',
    quote: '“I make complicated things look simple. Sometimes I even know why.”',
    currently: 'Sr. Executive UI/UX Designer',
    focus: 'Product Design • UX Strategy • Fintech',
    enjoy: 'Ideas that actually ship',
    summary: '5 years of experience building fintech platforms, web experiences and mobile products.',
    readmeNote: 'Things I know. Things I use. Things Google occasionally helps with.',
    location: 'Goa, India',
    email: 'naveen85pandey@gmail.com',
    links: {
      linkedin: {
        url: 'https://linkedin.com/in/naveen-pandey85/',
        label: 'linkedin.com/in/naveen-pandey85/'
      },
      behance: {
        url: 'https://behance.net/naveen_pandey',
        label: 'behance.net/naveen_pandey'
      }
    }
  },

  experience: [
    {
      id: 'neo-wealth',
      role: 'Sr. Executive UI/UX Designer',
      company: 'Neo Wealth and Asset Management Pvt. Ltd.',
      period: 'Dec 2025 – Present',
      focus: 'Wealth & Asset Management',
      description: 'Designing institutional and retail wealth management platforms, onboarding funnels, and distributor dashboards.'
    },
    {
      id: 'bp-equities',
      role: 'Sr. Executive UI/UX Designer',
      company: 'BP Equities Pvt. Ltd.',
      period: 'Feb 2024 – Dec 2025',
      focus: 'Fintech • Trading & Equities',
      description: 'Led UI/UX for retail trading platforms, options trading chain, mutual fund flows, and thematic basket investments.'
    },
    {
      id: 'skydreams',
      role: 'UI/UX Designer',
      company: 'Skydreams',
      period: 'May 2023 – Jan 2024',
      focus: 'Digital Agency • Web & Mobile',
      description: 'Created conversion-optimized web designs, brand identities, and cross-platform mobile apps for enterprise clients.'
    },
    {
      id: 'pigeon-edu',
      role: 'UI & Graphic Designer',
      company: 'Pigeon Edu. Technology',
      period: 'Nov 2021 – Apr 2023',
      focus: 'EdTech',
      description: 'Designed educational software interfaces, interactive learning components, and digital marketing materials.'
    }
  ],

  highlights: [
    {
      id: 'exp-years',
      stat: '5 years',
      label: 'Product design experience'
    },
    {
      id: 'conversion',
      stat: '1.2% → 4.4%',
      label: 'Landing page conversion improvement'
    },
    {
      id: 'growth',
      stat: '40K → 61K',
      label: 'Instagram follower growth'
    },
    {
      id: 'projects-delivered',
      stat: '5',
      label: 'Client web projects at Skydreams'
    }
  ],

  education: [
    {
      id: 'btech',
      degree: 'B.Tech — Civil Engineering',
      institution: 'ABES Engineering College, Ghaziabad',
      period: '2015 – 2019'
    }
  ],

  freelanceClients: [
    'The Souled Store',
    'Plus365',
    'Key Education Foundation'
  ],

  skillCategories: [
    {
      id: 'product-design',
      title: 'PRODUCT DESIGN',
      skills: [
        { id: 'skill-product-strategy', label: 'Product Strategy', defaultChecked: true },
        { id: 'skill-ux-strategy', label: 'UX Strategy', defaultChecked: true },
        { id: 'skill-product-discovery', label: 'Product Discovery', defaultChecked: true },
        { id: 'skill-interaction-design', label: 'Interaction Design', defaultChecked: true },
        { id: 'skill-information-architecture', label: 'Information Architecture', defaultChecked: true },
        { id: 'skill-user-flows', label: 'User Flows', defaultChecked: true },
        { id: 'skill-prototyping', label: 'Prototyping', defaultChecked: true },
        { id: 'skill-ui-design', label: 'UI Design', defaultChecked: true },
        { id: 'skill-wireframes', label: 'Wireframes', defaultChecked: true }
      ]
    },
    {
      id: 'research-qa',
      title: 'RESEARCH & QA',
      skills: [
        { id: 'skill-ux-research', label: 'UX Research', defaultChecked: true },
        { id: 'skill-stakeholder-interviewing', label: 'Stakeholder Interviewing', defaultChecked: true },
        { id: 'skill-feature-scoping', label: 'Feature Scoping', defaultChecked: true },
        { id: 'skill-design-qa---android---ios', label: 'Design QA — Android / iOS', defaultChecked: true },
        { id: 'skill-functional-qa', label: 'Functional QA', defaultChecked: true }
      ]
    },
    {
      id: 'design-tools',
      title: 'DESIGN TOOLS',
      skills: [
        { id: 'skill-figma', label: 'Figma', defaultChecked: true },
        { id: 'skill-adobe-photoshop', label: 'Adobe Photoshop', defaultChecked: true },
        { id: 'skill-illustrator', label: 'Illustrator', defaultChecked: true },
        { id: 'skill-indesign', label: 'InDesign', defaultChecked: true },
        { id: 'skill-html---css', label: 'HTML & CSS', defaultChecked: true },
        { id: 'skill-postman', label: 'Postman', defaultChecked: true }
      ]
    },
    {
      id: 'ai-prototyping',
      title: 'AI & PROTOTYPING',
      skills: [
        { id: 'skill-cursor', label: 'Cursor', defaultChecked: true },
        { id: 'skill-lovable', label: 'Lovable', defaultChecked: true },
        { id: 'skill-framer', label: 'Framer', defaultChecked: true }
      ]
    },
    {
      id: 'visual-marketing',
      title: 'VISUAL & MARKETING',
      skills: [
        { id: 'skill-branding', label: 'Branding', defaultChecked: true },
        { id: 'skill-content-design', label: 'Content Design', defaultChecked: true },
        { id: 'skill-social-campaign-design', label: 'Social Campaign Design', defaultChecked: true },
        { id: 'skill-email-campaign-design', label: 'Email Campaign Design', defaultChecked: true }
      ]
    }
  ],

  projects: [
    {
      id: 'stock-trading-app',
      name: 'Stock Trading App',
      type: 'Application',
      location: 'Neo Wealth',
      role: 'Product Designer',
      platform: 'Android + iOS',
      focus: 'Information Architecture, Interaction Design, Market Data, Portfolio, Charts',
      hasDeepDive: true,
      deepDiveKey: 'nova'
    },
    {
      id: 'mutual-funds',
      name: 'Mutual Funds',
      type: 'Product',
      location: 'BP Equities',
      role: 'UI/UX Designer',
      platform: 'Web + Mobile',
      focus: 'Fund Discovery, SIP Calculator, Checkout Flow'
    },
    {
      id: 'option-chain',
      name: 'Option Chain',
      type: 'Product',
      location: 'BP Equities',
      role: 'Lead UX Designer',
      platform: 'Web Trading Terminal',
      focus: 'Real-time Greeks, Strategy Builder, Multi-leg Orders'
    },
    {
      id: 'wealth-basket',
      name: 'WealthBasket',
      type: 'Product',
      location: 'BP Equities',
      role: 'Product Designer',
      platform: 'Mobile App',
      focus: 'Curated Portfolios, Thematic Investing, Rebalancing'
    },
    {
      id: 'distributor-dashboard',
      name: 'Distributor Dashboard',
      type: 'Internal Tool',
      location: 'Neo Wealth',
      role: 'UI/UX Designer',
      platform: 'Desktop Web',
      focus: 'Commission Tracking, Client Onboarding, MIS Reports'
    },
    {
      id: 'ai-support-chatbot',
      name: 'AI Support Chatbot',
      type: 'Internal Tool',
      location: 'Neo Wealth',
      role: 'Interaction Designer',
      platform: 'Web & In-App',
      focus: 'Conversational Flows, Intent Mapping, Escalation Triggers'
    },
    {
      id: 'client-web-projects',
      name: 'Client Web Projects',
      type: 'Web',
      location: 'Skydreams',
      role: 'UI/UX Designer',
      platform: 'Responsive Web',
      focus: 'Brand Sites, E-commerce, Conversion Optimization'
    }
  ],

  caseStudies: {
    nova: {
      id: 'nova',
      badge: 'PORTFOLIO CONCEPT',
      title: 'NOVA INVEST',
      subtitle: 'A simplified investing experience designed to make market information easier to understand and act on.',
      role: 'Product Designer',
      projectType: 'Fintech / Mobile App',
      focus: 'UX Strategy • Information Architecture • Interaction Design • UI Design',
      problem: 'Investment apps can become overwhelming when users are presented with too much market information at once.',
      goal: 'Create a cleaner experience that helps users quickly understand their portfolio, discover opportunities and make informed decisions.',
      approaches: [
        {
          num: '01',
          title: 'Contextual Information Hierarchy',
          desc: 'Surfacing relevant metrics at each decision stage without cluttering initial views.'
        },
        {
          num: '02',
          title: 'Frictionless Order Execution',
          desc: 'Streamlining complex multi-step buy/sell orders into intuitive, predictable flows.'
        },
        {
          num: '03',
          title: 'Actionable Portfolio Insights',
          desc: 'Visualizing P&L and asset allocation with immediate clarity.'
        },
        {
          num: '04',
          title: 'Educational Tooltips & Cues',
          desc: 'Providing inline context for complex financial terminology without cognitive overload.'
        }
      ]
    }
  },

  recycleBin: {
    tagline: '"Ideas that sounded better at 2 AM."',
    status: '7 object(s) | Some ideas were deleted. Some deserved it.',
    items: [
      { id: 'r1', name: 'portfolio_final_v2.fig', type: 'Figma Design', date: '10/15/1999 2:14 AM' },
      { id: 'r2', name: 'portfolio_final_FINAL.fig', type: 'Figma Design', date: '10/16/1999 3:47 AM' },
      { id: 'r3', name: 'new_logo_idea.ai', type: 'Illustrator File', date: '09/22/1999 11:30 PM' },
      { id: 'r4', name: 'dark_mode_everything.fig', type: 'Figma Design', date: '08/05/1999 1:58 AM' },
      { id: 'r5', name: 'landing_page_v7.fig', type: 'Figma Design', date: '07/12/1999 2:33 AM' },
      { id: 'r6', name: 'client_feedback.txt', type: 'Text Document', date: '06/28/1999 9:15 AM' },
      { id: 'r7', name: 'definitely_final.fig', type: 'Figma Design', date: '10/17/1999 4:02 AM' }
    ]
  },

  contact: {
    email: 'naveen85pandey@gmail.com',
    location: 'Goa, India',
    linkedin: {
      url: 'https://linkedin.com/in/naveen-pandey85/',
      label: 'linkedin.com/in/naveen-pandey85/'
    },
    behance: {
      url: 'https://behance.net/naveen_pandey',
      label: 'behance.net/naveen_pandey'
    }
  },

  systemProperties: {
    os: 'Naveen OS 98 Second Edition',
    registeredTo: 'Naveen Kumar Pandey',
    title: 'Sr. Executive UI/UX Designer',
    roleTag: 'FINTECH • WEB & MOBILE',
    quote: '"Yes, unfortunately, this is mine."',
    hardware: 'Intel Pentium II processor, 128 MB RAM, 100% Coffee Powered',
    systemInfo: {
      'SYSTEM TYPE': 'Product Designer',
      'SPECIALIZATION': 'Fintech • Web • Mobile',
      'EXPERIENCE': '5 Years',
      'CURRENT ROLE': 'Sr. Executive UI/UX Designer',
      'LOCATION': 'Goa, India',
      'PRIMARY TOOLS': 'Figma • Photoshop • Illustrator',
      'INTERESTS': 'Product Design • UX Strategy • AI • Research'
    },
    about: "I'm a product designer focused on building useful digital experiences across fintech, web and mobile.\n\nI work across product strategy, UX, interaction design, design systems, research and design QA.",
    systemStatus: {
      'DESIGN SYSTEM': 'ACTIVE',
      'FINTECH MODE': 'ACTIVE',
      'IDEAS': 'RUNNING',
      'COFFEE': 'REQUIRED'
    }
  }
};

export function formatBiosStatusLine(label, status, targetCol = 34) {
  const prefix = label + ' ';
  const dotsNeeded = targetCol - prefix.length - 1;
  const dots = '.'.repeat(Math.max(2, dotsNeeded));
  return `${prefix}${dots} ${status}`;
}

export function formatBiosStatusLeader(label, targetCol = 34) {
  const prefix = label + ' ';
  const dotsNeeded = targetCol - prefix.length - 1;
  const dots = '.'.repeat(Math.max(2, dotsNeeded));
  return `${prefix}${dots} `;
}

export function getVisitorSystemInfo() {
  if (typeof window === 'undefined') {
    return {
      browser: 'N/A',
      platform: 'N/A',
      display: 'N/A',
      cpu: 'N/A',
      memory: 'N/A'
    };
  }

  // 1. Browser
  let browser = 'Standard Browser';
  const ua = navigator.userAgent || '';
  if (ua.includes('Edg/')) {
    browser = 'Microsoft Edge';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Google Chrome';
  } else if (ua.includes('Firefox/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Apple Safari';
  } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
    browser = 'Opera';
  }

  // 2. Platform / OS
  let platform = 'N/A';
  if (navigator.userAgentData?.platform) {
    const rawPlat = navigator.userAgentData.platform;
    if (/macOS/i.test(rawPlat)) platform = 'macOS';
    else if (/Windows/i.test(rawPlat)) platform = 'Windows';
    else if (/Linux/i.test(rawPlat)) platform = 'Linux';
    else if (/Android/i.test(rawPlat)) platform = 'Android';
    else if (/iOS/i.test(rawPlat)) platform = 'iOS';
    else platform = rawPlat;
  } else {
    const p = navigator.platform || '';
    if (/Mac/i.test(p) || /Macintosh/i.test(ua)) {
      platform = 'macOS';
    } else if (/Win/i.test(p) || /Windows/i.test(ua)) {
      platform = 'Windows';
    } else if (/Linux/i.test(p)) {
      platform = 'Linux';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      platform = 'iOS';
    } else if (/Android/i.test(ua)) {
      platform = 'Android';
    } else if (p) {
      platform = p;
    }
  }

  // 3. Display resolution (e.g. 1470x956)
  let display = 'N/A';
  if (window.screen?.width && window.screen?.height) {
    display = `${window.screen.width}x${window.screen.height}`;
  }

  // 4. CPU Cores (e.g. 10 Cores)
  let cpu = 'N/A';
  if (navigator.hardwareConcurrency) {
    cpu = `${navigator.hardwareConcurrency} Cores`;
  }

  // 5. Memory (e.g. 16 GB)
  let memory = 'N/A';
  if (navigator.deviceMemory) {
    memory = `${navigator.deviceMemory} GB`;
  }

  return { browser, platform, display, cpu, memory };
}

export function createBiosGroups(sysInfo = getVisitorSystemInfo()) {
  return [
    {
      id: 'header',
      lines: [
        { text: 'NaveenBIOS 4.0 Release 6.0', highlight: true, className: 'NaveenBios40Release60' },
        { text: '© 2026 Naveen Kumar Pandey', className: 'CopyrightNaveenKumarPandey' },
        { text: 'All Rights Reserved', className: 'AllRightsReserved' }
      ]
    },
    {
      id: 'sysinfo',
      lines: [
        { text: 'Naveen Portfolio System', highlight: true, className: 'NaveenPortfolioSystem' },
        { text: 'BIOS Version 29.01.96', className: 'BiosVersion9501' }
      ]
    },
    {
      id: 'systemDetectionHeader',
      lines: [
        { text: 'System Detection', highlight: true, className: 'SystemDetectionHeader' }
      ]
    },
    {
      id: 'systemDetection',
      lines: [
        { label: 'Browser', status: sysInfo.browser, className: 'SysBrowser' },
        { label: 'Platform', status: sysInfo.platform, className: 'SysPlatform' },
        { label: 'Display', status: sysInfo.display, className: 'SysDisplay' },
        { label: 'CPU Cores', status: sysInfo.cpu, className: 'SysCpu' },
        { label: 'Memory', status: sysInfo.memory, className: 'SysMemory' }
      ]
    },
    {
      id: 'hardware',
      lines: [
        { label: 'Keyboard', status: 'Detected', className: 'KeyboardDetected' },
        { label: 'Mouse', status: 'Detected', className: 'MouseDetected' }
      ]
    },
    {
      id: 'portfolio',
      lines: [
        { label: 'UI/UX Designer', status: 'Detected', className: 'UiUxDesignerDetected' },
        { label: 'Fintech Experience', status: 'Detected', className: 'FintechExperienceDetected' },
        { label: '5 Years Experience', status: 'Detected', className: 'FiveYearsExperienceDetected' },
        { label: 'Design Systems', status: 'Loaded', className: 'DesignSystemsLoaded' },
        { label: 'Product Thinking', status: 'Loaded', className: 'ProductThinkingLoaded' },
        { label: 'Chai', status: 'Detected', className: 'ChaiDetected' }
      ]
    },
    {
      id: 'storage',
      lines: [
        { label: 'Portfolio Drive', status: 'OK', className: 'PortfolioDriveOk' },
        { label: 'Creative Drive', status: 'OK', className: 'CreativeDriveOk' }
      ]
    },
    {
      id: 'startup',
      lines: [
        { text: 'Starting NAVEEN.EXE...', highlight: true, className: 'StartingNaveenExe' },
        { label: 'Loading Portfolio', status: '100%', className: 'LoadingPortfolio100' }
      ]
    },
    {
      id: 'prompt',
      lines: [
        { text: 'Press <ENTER> to continue_', hasCursor: true, highlight: true, className: 'PressEnterToContinue', id: 'press-enter-line' }
      ]
    }
  ];
}

export const biosGroups = createBiosGroups();

portfolioData.createBiosGroups = createBiosGroups;
portfolioData.biosGroups = biosGroups;
portfolioData.biosLines = biosGroups.flatMap(group =>
  group.lines.map(line => ({
    ...line,
    text: line.text || formatBiosStatusLine(line.label, line.status, 34)
  }))
);


