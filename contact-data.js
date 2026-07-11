export const PROJECT_TYPES = [
  { value: 'website-development', label: 'Website Development' },
  { value: 'mobile-application', label: 'Mobile Application' },
  { value: 'software-system', label: 'Software System' },
  { value: 'pos-system', label: 'POS System' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'brand-design', label: 'Brand Design' },
  { value: 'automation', label: 'Automation' },
  { value: 'ai-solution', label: 'AI Solution' },
  { value: 'other', label: 'Other' }
];

export const SERVICE_TO_PROJECT_TYPE = {
  web: 'website-development',
  apps: 'mobile-application',
  software: 'software-system',
  pos: 'pos-system',
  marketing: 'digital-marketing',
  brand: 'brand-design',
  design: 'brand-design',
  photo: 'brand-design',
  content: 'digital-marketing',
  automation: 'automation'
};

export const BUDGET_RANGES = [
  { value: 'starting', label: 'Starting Project' },
  { value: 'small-business', label: 'Small Business' },
  { value: 'medium-business', label: 'Medium Business' },
  { value: 'enterprise', label: 'Enterprise' }
];

export const TIMELINES = [
  { value: 'urgent', label: 'Urgent' },
  { value: '1-3-months', label: '1–3 Months' },
  { value: '3-6-months', label: '3–6 Months' },
  { value: 'long-term', label: 'Long Term' }
];

export const REFERRAL_SOURCES = [
  { value: 'google', label: 'Google' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'referral', label: 'Referral' },
  { value: 'existing-client', label: 'Existing Client' },
  { value: 'other', label: 'Other' }
];

export const CONTACT_LOCATIONS = ['Canada', 'United Kingdom', 'Sri Lanka'];

export const CONTACT_AVAILABLE = ['Projects', 'Partnerships', 'Consultations'];

export const WHY_BENTO = [
  {
    id: 'global',
    title: 'Global Collaboration',
    description: 'Distributed teams across Canada, the UK and Sri Lanka — aligned for your timezone and goals.'
  },
  {
    id: 'tech',
    title: 'Modern Technology',
    description: 'React, Next.js, Flutter, cloud infrastructure and AI — built with tools that scale.'
  },
  {
    id: 'creative',
    title: 'Creative Solutions',
    description: 'Design-led thinking that balances aesthetics, usability and measurable business impact.'
  },
  {
    id: 'business',
    title: 'Business Focus',
    description: 'Every decision ties back to growth, efficiency and long-term digital value.'
  },
  {
    id: 'scale',
    title: 'Scalable Systems',
    description: 'Architecture designed to evolve — from MVP to enterprise without rebuilding from scratch.'
  },
  {
    id: 'support',
    title: 'Reliable Support',
    description: 'Post-launch maintenance, updates and dedicated partnership beyond delivery day.'
  }
];

export const CONTACT_PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    description: 'Understanding your idea, audience and business goals.'
  },
  {
    step: '02',
    title: 'Strategy',
    description: 'Planning the best digital solution, scope and roadmap.'
  },
  {
    step: '03',
    title: 'Development',
    description: 'Building, iterating and testing your product with precision.'
  },
  {
    step: '04',
    title: 'Launch',
    description: 'Delivering, deploying and supporting your solution long-term.'
  }
];

export const CONTACT_FAQ = [
  {
    q: 'How long does a project take?',
    a: 'Timelines vary by scope. Business websites typically take 4–8 weeks. Mobile apps and custom software range from 8–16 weeks. We provide a clear schedule after discovery.'
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes. We collaborate remotely with clients across Canada, the United Kingdom, Sri Lanka and worldwide — with structured communication and milestone-based delivery.'
  },
  {
    q: 'Can you maintain existing systems?',
    a: 'Absolutely. We audit, modernize and maintain existing platforms — improving performance, security and UX without unnecessary rebuilds.'
  },
  {
    q: 'Do you provide post-launch support?',
    a: 'Yes. We offer maintenance packages, feature updates, monitoring and ongoing technical support after launch.'
  },
  {
    q: 'Can you build custom software?',
    a: 'Yes. We build ERP, CRM, POS, booking systems, automation tools and bespoke enterprise software tailored to your operations.'
  }
];

export const SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/krushanth19/?skipRedirect=true',
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 9h3v10H5V9zm1.5-4a2 2 0 110 4 2 2 0 010-4zM10 9h3v1.4h.05c.55-1 1.8-2.1 3.7-2.1 3.9 0 4.6 2.6 4.6 6v4.7h-3v-4.5c0-1.1 0-2.6-1.6-2.6-1.7 0-1.9 1.3-1.9 2.5v4.6H10V9z" fill="currentColor"/></svg>'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/aurozehq/',
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.8" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor"/></svg>'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=61591792293311',
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 8h2.5V5H14c-2.5 0-4 1.5-4 4v2H7v3h2.5v7H14v-7h2.5l.5-3H14V8.6c0-.8.2-1.5 1.5-1.5z" fill="currentColor"/></svg>'
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/',
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.12-1.5-1.12-1.5-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02A9.3 9.3 0 0112 6.84c.85 0 1.7.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" fill="currentColor"/></svg>'
  },
  {
    id: 'behance',
    label: 'Behance',
    href: 'https://www.behance.net/',
    icon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 11.2c.9-.1 1.6-.5 2.1-1.1.5-.7.7-1.5.7-2.4 0-1.3-.4-2.3-1.3-3.1C8.8 4 7.6 3.6 6 3.6H0v16.8h6.4c1.7 0 3-.4 4-1.2 1-.9 1.5-2.1 1.5-3.6 0-1.1-.3-2-.8-2.7-.5-.7-1.2-1.2-2.1-1.5zM3.4 6.6H5.8c1 0 1.7.2 2.2.7.5.5.8 1.2.8 2.1 0 .9-.3 1.6-.8 2.1-.6.5-1.4.8-2.5.8H3.4V6.6zm3.2 11H3.4v-4.8h3.5c1.2 0 2.1.3 2.7.9.6.6.9 1.4.9 2.4 0 1.1-.3 1.9-1 2.5-.7.6-1.7.9-2.9.9zM17.5 6.8h-5.8V5.2h5.8v1.6zm-.2 8.4c-.8 1-2 1.5-3.5 1.5-1.4 0-2.5-.4-3.3-1.3-.8-.9-1.2-2.1-1.2-3.6 0-1.6.4-2.8 1.3-3.8.9-1 2.1-1.5 3.6-1.5 1.3 0 2.4.4 3.2 1.2.8.8 1.3 1.9 1.4 3.3h-2.5c-.1-.7-.4-1.3-.9-1.7-.5-.4-1.1-.6-1.9-.6-.9 0-1.6.3-2.1 1-.5.6-.8 1.5-.8 2.6 0 1.1.3 2 .8 2.6.5.6 1.2.9 2.1.9.8 0 1.5-.2 2-.7.5-.5.8-1.1.9-1.9h2.5c-.1 1.3-.6 2.4-1.4 3.3z" fill="currentColor"/></svg>'
  }
];
