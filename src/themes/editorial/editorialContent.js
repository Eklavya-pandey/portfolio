/**
 * EDITORIAL THEME CONTENT CONFIGURATION (Terminal / System Voice)
 * Central repository for all copy, system status, labels, and constants.
 */

export const EDITORIAL_CONTENT = {
  // Navigation
  nav: {
    logo: 'naveen.design',
    version: 'v2.6',
    links: [
      { label: 'Work', href: 'work.html', id: 'work' },
      { label: 'About', href: 'about.html', id: 'about' },
      { label: 'Playground', href: 'playground.html', id: 'playground' },
      { label: 'Contact', href: 'contact.html', id: 'contact' }
    ],
    cta: '> CONTACT'
  },

  // Technical Status Ticker
  ticker: [
    { label: 'STATUS', text: 'OPEN_TO_ROLES' },
    { label: 'LOC', text: 'GOA / REMOTE' },
    { label: 'STACK', text: 'FIGMA · DESIGN_SYSTEMS · AI_FLOWS' },
    { label: 'LOG', text: '10+ PROJECTS_SHIPPED' },
    { label: 'UPTIME', text: '05_YRS' }
  ],

  // Hero Section
  hero: {
    pill: '> PRODUCT DESIGNER',
    headline: 'NAVEEN PANDEY',
    subtext: '> designing interfaces for data-heavy products. from trading dashboards to AI assistants, turning complex systems into clear, usable experiences.',
    stats: [
      { num: '04', label: 'YEARS_EXP' },
      { num: '10+', label: 'SHIPPED' },
      { num: 'GOA', label: 'BASE_LOC' }
    ],
    photo: {
      tag: 'PROFILE.IMG',
      scale: '1:1',
      src: '/assets/me.webp',
      name: 'NAVEEN_KUMAR_PANDEY',
      loc: 'LOC: GOA, IN'
    }
  },

  // Section Headers
  sections: {
    featuredWork: '01 / FEATURED_WORK',
    allWork: '01 / WORK',
    aboutMe: '02 / ABOUT_ME',
    playground: '03 / PLAYGROUND',
    contact: '04 / CONTACT',
    experience: '02 / EXPERIENCE',
    certifications: '04 / CERTIFICATIONS'
  },

  // Filter Categories for Work Page
  filterChips: [
    { id: 'ALL', label: 'ALL' },
    { id: 'FINTECH', label: 'FINTECH' },
    { id: 'DESIGN_SYSTEM', label: 'DESIGN_SYSTEM' },
    { id: 'AI', label: 'AI' },
    { id: 'WEB', label: 'WEB' }
  ],

  // Action Buttons
  buttons: {
    openCase: 'OPEN_CASE →',
    preview: 'PREVIEW →',
    viewAllWork: 'VIEW ALL WORK →',
    readMoreAbout: 'READ MORE →',
    launchTool: 'LAUNCH TOOL →',
    goToContact: 'GO TO CONTACT →',
    resetDefault: 'RESET_DEFAULT',
    contact: '> CONTACT',
    sendEmail: 'SEND DIRECT EMAIL →',
    copyEmail: 'COPY EMAIL ADDRESS'
  },

  // System Notifications / Toasts (Terminal Voice)
  toasts: {
    emailCopied: {
      title: '[OK] EMAIL_COPIED',
      message: 'naveen85pandey@gmail.com copied to clipboard'
    },
    inspectOn: {
      title: '[OK] INSPECT_MODE: ACTIVE',
      message: 'CAD baseline grid & element calipers enabled. Press I or ESC.'
    },
    inspectOff: {
      title: '[WARN] INSPECT_MODE: OFF',
      message: 'Live inspector disabled'
    },
    fontApplied: (name) => ({
      title: '[OK] TYPOGRAPHY_UPDATED',
      message: `Preset activated: ${name}`
    }),
    fontReset: {
      title: '[OK] TYPOGRAPHY_RESET',
      message: 'Reverted to Chakra Petch default'
    },
    audioToggle: (enabled) => ({
      title: enabled ? '[OK] SFX_AUDIO: ENABLED' : '[WARN] SFX_AUDIO: MUTED',
      message: enabled ? 'Interactive audio feedback ON' : 'Audio feedback MUTED'
    })
  }
};
