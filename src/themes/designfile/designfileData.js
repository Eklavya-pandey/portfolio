/**
 * Design File Theme — Data Layer (NAVEEN_PORTFOLIO.fig)
 * Reads real content and shared PROJECTS source directly.
 * 5 Pages matching site nav: Home, Work, About, Playground, Contact.
 */
import {
  PROJECTS,
  EXPERIENCES,
  FREELANCE_ROLES,
  EDUCATION,
  CERTIFICATIONS,
  SKILL_GROUPS
} from '../editorial/editorialData';
import { EDITORIAL_CONTENT } from '../editorial/editorialContent';
import { portfolioData } from '../../data/portfolioData';

export {
  PROJECTS,
  EXPERIENCES,
  FREELANCE_ROLES,
  EDUCATION,
  CERTIFICATIONS,
  SKILL_GROUPS,
  EDITORIAL_CONTENT,
  portfolioData
};

/* ─── 4 Navigation Pages matching virtual Figma design file structure ─── */
export const PAGES = [
  { id: 'home', label: 'Home', icon: '◆' },
  { id: 'work', label: 'Work', icon: '◆' },
  { id: 'about', label: 'About', icon: '◆' },
  { id: 'contact', label: 'Contact', icon: '◆' }
];

/* ─── Dedicated Artboard Frame per Page ─── */
export const PAGE_FRAMES = {
  home: [
    { id: 'frame-home', page: 'home', name: '# Home', tag: '00 // HOME', w: 1120 }
  ],
  work: [
    { id: 'frame-work', page: 'work', name: '# Work', tag: '01 // WORK', w: 1120 }
  ],
  about: [
    { id: 'frame-about', page: 'about', name: '# About', tag: '02 // ABOUT', w: 1120 }
  ],
  contact: [
    { id: 'frame-contact', page: 'contact', name: '# Contact', tag: '03 // CONTACT', w: 1120 }
  ]
};

/* ─── Layers Tree per Page with Exact 16px Indent Per Level ─── */
export const PAGE_LAYERS = {
  home: [
    {
      id: 'frame-home',
      label: '# Home',
      fullName: 'Home Portfolio Artboard (1120px)',
      type: 'frame',
      children: [
        {
          id: 'hdr-group',
          label: 'Header & Navigation',
          fullName: 'Top Navigation Bar (6 Cols)',
          type: 'frame',
          children: [
            { id: 'hdr-logo', label: 'Logo: NAVEEN.', fullName: 'Brand Logo', type: 'text' },
            { id: 'hdr-loc', label: 'Location: Goa, IN', fullName: 'Location Label', type: 'text' },
            { id: 'hdr-nav', label: 'Nav: Work, About, Contact', fullName: 'Primary Nav Links', type: 'component' },
            { id: 'hdr-cv', label: 'Action: Download CV', fullName: 'Download CV Button', type: 'component' }
          ]
        },
        {
          id: 'hero-group',
          label: 'Hero Section',
          fullName: 'Hero Section (1.65fr / 1fr)',
          type: 'frame',
          children: [
            { id: 'hero-headline', label: 'Headline: NAVEEN PANDEY.', fullName: 'Display Headline Anton', type: 'text' },
            { id: 'hero-tag', label: 'Tag: Fintech & Wealth', fullName: 'Role & Specialization Tag', type: 'text' },
            { id: 'hero-ctas', label: 'CTAs: View Work + CV', fullName: 'Action Buttons', type: 'component' },
            { id: 'hero-facts', label: '3 Key Facts', fullName: 'High-Frequency Fintech Facts', type: 'component' },
            { id: 'hero-intro', label: 'Intro Bio Cell', fullName: 'Sentence-Case Bio', type: 'text' },
            { id: 'hero-stats', label: 'Stats: 10+ Shipped / 5 Yrs', fullName: 'Stats Duo Grid', type: 'component' },
            { id: 'hero-portrait', label: 'Portrait: Real Photo Frame', fullName: 'Portrait Photo Frame', type: 'component' }
          ]
        },
        {
          id: 'band-group',
          label: 'Status Band',
          fullName: 'Current Status & Availability',
          type: 'frame',
          children: [
            { id: 'band-year', label: 'Year: (2026)', fullName: 'Vertical Year Indicator', type: 'text' },
            { id: 'band-company', label: 'Company: Neo Wealth', fullName: 'Neo Wealth & Asset Mgmt', type: 'text' },
            { id: 'band-status', label: 'Status: Open to Roles', fullName: 'Availability Action', type: 'component' }
          ]
        },
        {
          id: 'worked-with-group',
          label: 'Worked With Strip',
          fullName: 'Worked With Client Strip (6 Cells)',
          type: 'frame',
          children: [
            { id: 'worked-with-lbl', label: 'Label: WORKED WITH', fullName: 'Worked With Yellow Label', type: 'text' }
          ]
        },
        {
          id: 'featured-work-group',
          label: 'Selected Work',
          fullName: 'Selected Work (3 Projects with Outcomes)',
          type: 'frame',
          children: [
            { id: 'stock-trading-app', label: '01 Stock Trading App', fullName: 'Project: Stock Trading App (2 platforms / ANDROID + iOS)', type: 'component', projectId: 'stock-trading-app' },
            { id: 'investment-modules', label: '02 Investment Modules', fullName: 'Project: Investment Modules (1.2% → 4.4% / CONVERSION)', type: 'component', projectId: 'investment-modules' },
            { id: 'markets-overview', label: '03 Design System', fullName: 'Project: Design System (4 apps / ONE SHARED SYSTEM)', type: 'component', projectId: 'markets-overview' },
            { id: 'home-view-all-cta', label: 'Action: View All Work', fullName: 'View All Work Link', type: 'component' }
          ]
        },
        {
          id: 'about-teaser-group',
          label: 'About Teaser',
          fullName: 'Who I Am & Skills Teaser',
          type: 'frame',
          children: [
            { id: 'about-star', label: 'Emblem: Asterisk', fullName: '6-Point Asterisk SVG', type: 'vector' },
            { id: 'about-bio', label: 'Bio: Who I Am (2 Sentences)', fullName: 'Specific Approach & BP Equities Result', type: 'text' },
            { id: 'about-more-cta', label: 'Action: More About Me', fullName: 'About Page Link', type: 'component' },
            { id: 'about-skills', label: 'Skills: 5 Items (No Arrows)', fullName: 'Core Skills Index', type: 'component' }
          ]
        },
        {
          id: 'cta-group',
          label: 'Contact CTA',
          fullName: 'Footer Action & Socials',
          type: 'frame',
          children: [
            { id: 'cta-headline', label: 'Headline: Hiring a Fintech Designer?', fullName: 'Red Headline Banner', type: 'text' },
            { id: 'cta-email', label: 'Email & Copy Action', fullName: 'Contact Action Block', type: 'component' },
            { id: 'cta-socials', label: 'Find Me: LinkedIn, Behance, WhatsApp', fullName: 'Full Social Links', type: 'component' }
          ]
        }
      ]
    }
  ],
  work: [
    {
      id: 'frame-work',
      label: '# Work',
      fullName: 'Work Portfolio Artboard',
      type: 'frame',
      children: [
        {
          id: 'editorial-header',
          label: 'Header & Navigation',
          fullName: '6-Column Editorial Nav Bar',
          type: 'frame',
          children: [
            { id: 'logo-brand', label: 'Brand: NAVEEN', fullName: 'Brand Monogram', type: 'text' },
            { id: 'logo-location', label: 'Location: Goa, IN', fullName: 'Location Tag', type: 'text' },
            { id: 'nav-work', label: 'Nav: WORK', fullName: 'Work Page Tab', type: 'component' },
            { id: 'nav-about', label: 'Nav: ABOUT', fullName: 'About Page Tab', type: 'component' },
            { id: 'nav-contact', label: 'Nav: CONTACT', fullName: 'Contact Page Tab', type: 'component' },
            { id: 'nav-cv', label: 'Action: DOWNLOAD CV', fullName: 'Resume Download Button', type: 'component' }
          ]
        },
        {
          id: 'work-header',
          label: 'Hero & Filters',
          fullName: 'Work Hero & 5 Category Filters',
          type: 'frame',
          children: [
            { id: 'work-headline', label: 'Headline: SELECTED WORK.', fullName: 'Selected Work Title', type: 'text' },
            { id: 'work-intro', label: 'Intro: Trading apps, modules...', fullName: 'Work Subtitle', type: 'text' },
            { id: 'work-counter', label: 'Counter: SHOWING X OF 8 PROJECTS', fullName: 'Dynamic Results Counter', type: 'text' },
            { id: 'work-filters', label: 'Filters: ALL, FINTECH, DESIGN SYSTEM, AI, WEB', fullName: '5-Column Filter Row', type: 'component' }
          ]
        },
        {
          id: 'work-grid',
          label: 'Projects Stack (8 Projects)',
          fullName: 'Projects Catalog Stack',
          type: 'frame',
          children: PROJECTS.map((p) => ({
            id: p.id,
            label: `Row: ${p.title.length > 20 ? p.title.slice(0, 18) + '...' : p.title}`,
            fullName: `Project Row: ${p.title}`,
            type: 'component',
            projectId: p.id
          }))
        },
        {
          id: 'cta-group',
          label: 'Contact CTA',
          fullName: 'Footer Action & Socials',
          type: 'frame',
          children: [
            { id: 'cta-headline', label: 'Headline: Hiring a Fintech Designer?', fullName: 'Red Headline Banner', type: 'text' },
            { id: 'cta-email', label: 'Email & Copy Action', fullName: 'Contact Action Block', type: 'component' },
            { id: 'cta-socials', label: 'Find Me: LinkedIn, Behance, WhatsApp', fullName: 'Full Social Links', type: 'component' }
          ]
        }
      ]
    }
  ],
  about: [
    {
      id: 'frame-about',
      label: '# About',
      fullName: 'About Portfolio Artboard',
      type: 'frame',
      children: [
        {
          id: 'about-header',
          label: 'Header',
          fullName: 'About Header',
          type: 'frame',
          children: [
            { id: 'about-hero-title', label: 'Headline', fullName: 'Headline: PRODUCT DESIGNER.', type: 'text' },
            { id: 'about-hero-ctas', label: 'CTAs', fullName: 'CTAs: Download CV + View Work', type: 'component' }
          ]
        },
        {
          id: 'about-whoiam',
          label: 'Who I Am',
          fullName: 'Yellow Cell + Bio Narrative',
          type: 'frame',
          children: [
            { id: 'whoiam-yellow-cell', label: 'Cell: WHO I AM.', fullName: 'Yellow WHO I AM. Cell', type: 'component' },
            { id: 'whoiam-prose', label: 'Narrative Prose', fullName: '1-Paragraph Career Statement', type: 'text' }
          ]
        },
        {
          id: 'about-experience',
          label: 'Experience (5 Roles)',
          fullName: 'Headline: EXPERIENCE. & 5 Roles Timeline',
          type: 'frame',
          children: [
            { id: 'exp-row-neo', label: 'Neo Wealth (2 Internal Tools)', fullName: 'Role: Product Designer, Neo Wealth', type: 'component' },
            { id: 'exp-row-bp', label: 'BP Equities (1.2% → 4.4%)', fullName: 'Role: Product Designer, BP Equities', type: 'component' },
            { id: 'exp-row-skydreams', label: 'Skydreams (5 Clients · 100%)', fullName: 'Role: Product Designer, Skydreams', type: 'component' },
            { id: 'exp-row-pigeon', label: 'Pigeon Edu (2,000+ Students)', fullName: 'Role: UI & Graphic Designer, Pigeon Edu', type: 'component' },
            { id: 'exp-row-freelance', label: 'Freelance (3 Engagements)', fullName: 'Role: Product Designer, Freelance', type: 'component' }
          ]
        },
        {
          id: 'about-edu-certs',
          label: 'Education & 11 Certifications',
          fullName: 'Education & 11 Verified Certifications',
          type: 'frame',
          children: [
            { id: 'about-education', label: 'B.Tech Civil (ABES College)', fullName: 'Education: B.Tech Civil Engineering', type: 'component' },
            { id: 'about-certifications', label: '11 Certifications (01-11)', fullName: '11 Verified Industry Certifications', type: 'component' }
          ]
        },
        {
          id: 'about-skills',
          label: 'Skills (5 Groups, 3+2 Grid)',
          fullName: 'Categorized Skill Architecture',
          type: 'frame',
          children: [
            { id: 'skills-product', label: 'Product Design', fullName: 'Product Design Competencies', type: 'component' },
            { id: 'skills-research', label: 'Research & Strategy', fullName: 'Research & Strategy Competencies', type: 'component' },
            { id: 'skills-tools', label: 'Design Tools', fullName: 'Design Tools & Applications', type: 'component' },
            { id: 'skills-ai', label: 'AI & Prototyping', fullName: 'AI & Prototyping Tools', type: 'component' },
            { id: 'skills-visual', label: 'Visual & Marketing', fullName: 'Visual & Marketing Design', type: 'component' }
          ]
        }
      ]
    }
  ],
  contact: [
    {
      id: 'frame-contact',
      label: '# Contact',
      fullName: 'Contact Portfolio Artboard',
      type: 'frame',
      children: [
        {
          id: 'contact-hero-group',
          label: 'Contact Hero & Open To',
          fullName: 'Hero & Availability Grid',
          type: 'frame',
          children: [
            { id: 'contact-headline', label: 'Headline: HIRING A FINTECH DESIGNER?', fullName: 'Contact Display Headline', type: 'text' },
            { id: 'contact-open-cell', label: 'Yellow Cell: OPEN TO', fullName: 'Availability & What to Expect', type: 'component' }
          ]
        },
        {
          id: 'contact-body-row',
          label: 'Contact Details & Form',
          fullName: 'Contact Channels & Message Form',
          type: 'frame',
          children: [
            { id: 'contact-channels', label: 'Contact Details & Find Me', fullName: 'Email, Base & Social Links', type: 'component' },
            { id: 'contact-form-box', label: 'Send a Message Form', fullName: 'Interactive Inquiry Form', type: 'component' }
          ]
        }
      ]
    }
  ],
  playground: [
    {
      id: 'frame-playground-hero',
      label: '03 / PLAYGROUND',
      fullName: 'Playground Hero Frame',
      type: 'frame',
      children: [
        { id: 'pg-hero-title', label: 'Headline', fullName: 'Headline: SMALL EXPERIMENTS.', type: 'text' }
      ]
    },
    {
      id: 'frame-playground-fonts',
      label: 'Font Pairing',
      fullName: 'Font Pairing Studio Frame',
      type: 'frame',
      children: [
        { id: 'fonts-specimen-bar', label: 'Specimen Tester', fullName: 'Live Interactive Specimen Tester Input', type: 'component' },
        { id: 'fonts-presets-grid', label: 'Font Presets', fullName: '6 Technical Type Pairings Grid', type: 'component' }
      ]
    },
    {
      id: 'frame-playground-typing',
      label: 'Speed Typing',
      fullName: 'Speed Typing Benchmark Frame',
      type: 'frame',
      children: [
        { id: 'typing-tester', label: 'Typing Test', fullName: 'Speed Typing Test (WPM & Accuracy)', type: 'component' }
      ]
    },
    {
      id: 'frame-playground-ascii',
      label: 'Terminal ASCII',
      fullName: 'Terminal ASCII Art Studio Frame',
      type: 'frame',
      children: [
        { id: 'ascii-generator', label: 'ASCII Canvas', fullName: 'ASCII Art Canvas & Charset Controls', type: 'component' }
      ]
    }
  ]
};

/* ─── Easter Egg E2 Comment Notes (Exact cycling sequence) ─── */
export const COMMENT_NOTES = [
  'Hire me? Yes.',
  'Yes, the ticker is intentional.',
  'Case studies coming soon.'
];

/* ─── Version History (Resume Facts Only — Easter Egg 9) ─── */
export const VERSION_HISTORY = [
  {
    version: 'v4.0',
    period: 'Dec 2025 to present',
    company: 'Neo Wealth and Asset Management',
    desc: 'Stock-trading app UX, design QA, cross-platform design system.'
  },
  {
    version: 'v3.0',
    period: 'Feb 2024 to Dec 2025',
    company: 'BP Equities',
    desc: 'Mutual Funds, Option Chain and WealthBasket modules, conversion 1.2% to 4.4%.'
  },
  {
    version: 'v2.0',
    period: 'May 2023 to Jan 2024',
    company: 'Skydreams',
    desc: '5 client web projects, 100% first-launch approval.'
  },
  {
    version: 'v1.0',
    period: 'Nov 2021 to Apr 2023',
    company: 'Pigeon Edu Technology',
    desc: 'Website and sales dashboard, study material for 2,000+ students.'
  }
];

/* ─── Assets: Real Components (Read-only list in edit mode) ─── */
export const ASSETS_COMPONENTS = [
  { id: 'btn-primary', name: 'Primary Button', category: 'Buttons', preview: 'VIEW WORK →', type: 'CTA button with arrow icon' },
  { id: 'btn-secondary', name: 'Secondary Button', category: 'Buttons', preview: 'DOWNLOAD CV', type: 'Outlined technical button' },
  { id: 'card-project', name: 'Project Card', category: 'Cards', preview: 'Case Study Card', type: 'Crosshatch cover, 2x2 metrics, preview link' },
  { id: 'chip-tag', name: 'Tag Chip', category: 'Tags', preview: 'FIGMA', type: 'Mono uppercase tech badge' },
  { id: 'header-section', name: 'Section Header', category: 'Typography', preview: '01 // FEATURED_WORK', type: 'Technical section indicator line' }
];

/* ─── Variables: Real Tokens (Read-only list in edit mode) ─── */
export const VARIABLES_TOKENS = [
  { name: 'Color / Accent', value: '#FF5A1F', group: 'Color' },
  { name: 'Color / Selection Blue', value: '#0D99FF', group: 'Color' },
  { name: 'Color / Text Dark', value: '#1E1E1E', group: 'Color' },
  { name: 'Color / Secondary Muted', value: '#6B6B6B', group: 'Color' },
  { name: 'Color / Border Subtle', value: '#E6E6E6', group: 'Color' },
  { name: 'Color / Canvas Dark', value: '#2C2C2C', group: 'Color' },
  { name: 'Typography / Display H1', value: '48px / 1.1', group: 'Typography' },
  { name: 'Typography / Section H2', value: '24px / 1.25', group: 'Typography' },
  { name: 'Typography / Body Regular', value: '16px / 1.5', group: 'Typography' },
  { name: 'Typography / Chrome UI', value: '13px / 1.4', group: 'Typography' },
  { name: 'Typography / Mono Meta', value: '11px / 1.2', group: 'Typography' },
  { name: 'Spacing / XS', value: '4px', group: 'Spacing' },
  { name: 'Spacing / S', value: '8px', group: 'Spacing' },
  { name: 'Spacing / M', value: '16px', group: 'Spacing' },
  { name: 'Spacing / L', value: '24px', group: 'Spacing' },
  { name: 'Spacing / XL', value: '48px', group: 'Spacing' },
  { name: 'Spacing / Frame Gap', value: '80px', group: 'Spacing' }
];

/* ─── 10 Easter Egg Definitions for Discovery Counter ─── */
export const EASTER_EGG_DEFS = [
  { id: 1, name: "Naveen's Reply", hint: "Drop a comment on the canvas and wait for a response." },
  { id: 2, name: "Auto-Layout Preview", hint: "Try pressing Shift+A without anything selected." },
  { id: 3, name: "Distance Measurement", hint: "Hold Alt while hovering over an element." },
  { id: 4, name: "Zero-History Undo", hint: "Try undoing (Cmd+Z) when the history is completely empty." },
  { id: 5, name: "Save Attempt", hint: "Try saving your edits with Cmd+S." },
  { id: 6, name: "Make Logo Bigger", hint: "Ask the ⌘K command menu to make something bigger." },
  { id: 7, name: "Context Menu", hint: "Right-click anywhere on the design canvas." },
  { id: 8, name: "Outline View", hint: "Toggle wireframe outline mode with Cmd+Shift+Y." },
  { id: 9, name: "Version History", hint: "Inspect the file version chip in the header." },
  { id: 10, name: "Dev Mode", hint: "Inspect code by toggling Dev Mode with Shift+D." }
];

/* ─── Helper: Get Project by ID ─── */
export function getProjectById(id) {
  if (!id) return null;
  return PROJECTS.find((p) => p.id === id) || null;
}

/* ─── Helper: Get Frame by ID ─── */
export function getFrameById(frameId, page = 'home') {
  const frames = PAGE_FRAMES[page] || PAGE_FRAMES.home;
  const match = frames.find((f) => f.id === frameId);
  if (match) return match;
  for (const pageKey of Object.keys(PAGE_FRAMES)) {
    const found = PAGE_FRAMES[pageKey]?.find((f) => f.id === frameId);
    if (found) return found;
  }
  return null;
}

/* ─── Easter Eggs Storage Helpers (sessionStorage) ─── */
export function getDiscoveredEasterEggs() {
  try {
    const raw = sessionStorage.getItem('fig_easter_eggs');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordEasterEgg(id) {
  try {
    const current = getDiscoveredEasterEggs();
    if (!current.includes(id)) {
      const next = [...current, id];
      sessionStorage.setItem('fig_easter_eggs', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('fig_egg_found', { detail: { id, all: next } }));
      return next;
    }
    return current;
  } catch {
    return [];
  }
}
