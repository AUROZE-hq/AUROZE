export const FEATURED_PROJECTS = [
  {
    id: 'lovecry',
    title: 'Love Cry',
    url: 'https://lovecry.ca',
    image: 'assets/images/lovecry.png',
    alt: 'Love Cry NGO website preview',
    type: 'NGO Website',
    category: 'Website',
    status: 'live',
    filters: ['featured', 'websites'],
    technologies: ['Next.js', 'CMS', 'SEO'],
    industry: 'Non-Profit / Healthcare',
    caption: 'NGO in Canada supporting child care and youth mental health through safe, healing spaces.'
  },
  {
    id: 'eventix',
    title: 'RSK Eventix',
    url: 'https://rskeventix.com',
    image: 'assets/images/eventix.png',
    alt: 'RSK Eventix ticket booking system preview',
    type: 'Ticket Platform',
    category: 'Website',
    status: 'upcoming',
    filters: ['featured', 'websites', 'upcoming'],
    technologies: ['React', 'Node.js', 'Stripe'],
    industry: 'Events / Entertainment',
    caption: 'Ticket booking system for the UK — launching soon as a product in the coming days.'
  },
  {
    id: 'niro',
    title: 'Niro Hardware',
    url: 'https://niro-hardware.vercel.app',
    image: 'assets/images/nirohardware.png',
    alt: 'Niro Hardware website preview',
    type: 'E-Commerce Website',
    category: 'Website',
    status: 'live',
    filters: ['featured', 'websites'],
    technologies: ['React', 'Vercel', 'SEO'],
    industry: 'Retail / Hardware',
    caption: 'Hardware retail website in Sri Lanka for effortless product discovery and browsing.'
  }
];

export const SERVICES_DATA = [
  {
    id: 'web',
    icon: 'web',
    title: 'Web Development',
    description: 'High-performance websites engineered for clarity, conversion, and long-term scale.',
    features: ['Custom websites', 'Business websites', 'Corporate websites', 'Landing pages', 'CMS', 'E-Commerce', 'SEO Ready', 'Performance Optimized']
  },
  {
    id: 'apps',
    icon: 'mobile',
    title: 'Application Development',
    description: 'Native and cross-platform apps built for speed, reliability, and premium user experience.',
    features: ['Android', 'iOS', 'Cross Platform', 'Flutter', 'React Native', 'Progressive Web Apps']
  },
  {
    id: 'software',
    icon: 'software',
    title: 'Software & System Development',
    description: 'Custom systems that streamline operations and connect every part of your business.',
    features: ['ERP', 'CRM', 'Inventory', 'School Systems', 'Hospital Systems', 'Booking Systems', 'Management Systems', 'Enterprise Solutions']
  },
  {
    id: 'pos',
    icon: 'pos',
    title: 'POS Systems',
    description: 'Cloud-ready point-of-sale platforms for restaurants, cafes, and retail operations.',
    features: ['Restaurant POS', 'Cafe POS', 'Retail POS', 'Cloud POS', 'Kitchen Display', 'Receipt Printing', 'QR Ordering', 'Analytics Dashboard']
  },
  {
    id: 'marketing',
    icon: 'marketing',
    title: 'Digital Marketing',
    description: 'Data-driven campaigns that grow visibility, leads, and measurable business results.',
    features: ['Social Media Marketing', 'SEO', 'Google Ads', 'Facebook Ads', 'Instagram Campaigns', 'Email Marketing', 'Analytics']
  },
  {
    id: 'brand',
    icon: 'brand',
    title: 'Brand Identity',
    description: 'Distinctive brand systems that communicate trust, ambition, and market presence.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Business Cards', 'Packaging', 'Brand Strategy']
  },
  {
    id: 'design',
    icon: 'design',
    title: 'Creative Design',
    description: 'Interface and visual design crafted for impact across digital and physical touchpoints.',
    features: ['UI Design', 'UX Design', 'Graphic Design', 'Social Media Creatives', 'Banner Design', 'Print Design', 'Presentations']
  },
  {
    id: 'photo',
    icon: 'photo',
    title: 'Photography & Videography',
    description: 'Cinematic visuals that elevate products, brands, and corporate storytelling.',
    features: ['Commercial Photography', 'Product Photography', 'Corporate Videos', 'Drone Videos', 'Event Coverage', 'Brand Story Videos']
  },
  {
    id: 'content',
    icon: 'content',
    title: 'Content Creation',
    description: 'Compelling content and motion assets designed to engage and convert audiences.',
    features: ['Content Writing', 'Copywriting', 'Video Editing', 'Social Media Content', 'Motion Graphics', 'Animation']
  },
  {
    id: 'automation',
    icon: 'automation',
    title: 'Business Automation',
    description: 'Intelligent workflows and integrations that eliminate friction and unlock efficiency.',
    features: ['Workflow Automation', 'AI Automation', 'CRM Integration', 'API Integration', 'Payment Integration', 'Email Automation', 'WhatsApp Automation', 'Internal Tools']
  }
];

export const PROCESS_STEPS = [
  { num: '01', icon: 'discovery', title: 'Discovery', desc: 'We map goals, users, and constraints to define a clear product direction.' },
  { num: '02', icon: 'planning', title: 'Planning', desc: 'Architecture, scope, and delivery roadmap aligned to business outcomes.' },
  { num: '03', icon: 'design', title: 'Design', desc: 'Premium UI/UX systems shaped for clarity, emotion, and conversion.' },
  { num: '04', icon: 'dev', title: 'Development', desc: 'Robust engineering with modern stacks, clean code, and scalable foundations.' },
  { num: '05', icon: 'testing', title: 'Testing', desc: 'Rigorous QA across devices, performance, security, and real-world flows.' },
  { num: '06', icon: 'launch', title: 'Launch', desc: 'Deployment, monitoring, and go-live support for a confident release.' },
  { num: '07', icon: 'growth', title: 'Growth', desc: 'Iteration, optimization, and long-term partnership beyond launch day.' }
];

export const TECH_STACK = [
  'React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Firebase',
  'AWS', 'Cloudflare', 'Flutter', 'React Native', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
  'After Effects', 'Premiere Pro', 'Docker', 'GitHub', 'Stripe', 'OpenAI', 'Cursor', 'Supabase',
  'Framer Motion', 'GSAP', 'TailwindCSS'
];

export const WHY_AUROZE = [
  { title: 'Fast Delivery', desc: 'Agile sprints and clear milestones keep momentum high without sacrificing quality.', icon: 'fast' },
  { title: 'Premium Design', desc: 'Every interface is crafted with Awwwards-level attention to detail and motion.', icon: 'design' },
  { title: 'Business Focused', desc: 'We build for outcomes — leads, revenue, efficiency, and measurable growth.', icon: 'business' },
  { title: 'SEO Optimized', desc: 'Technical SEO and performance baked in from day one of every build.', icon: 'seo' },
  { title: 'Scalable Architecture', desc: 'Systems designed to grow with your users, data, and product roadmap.', icon: 'scale' },
  { title: 'Modern Technology', desc: 'Current frameworks and cloud-native tooling for future-proof products.', icon: 'tech' },
  { title: '24/7 Support', desc: 'Reliable post-launch support when your business needs it most.', icon: 'support' },
  { title: 'Transparent Process', desc: 'Clear communication, visible progress, and no surprises along the way.', icon: 'process' }
];

export const TESTIMONIALS = [
  {
    quote: 'Auroze delivered a compassionate, polished website that truly reflects our mission — giving families and youth a safe digital space to find support.',
    team: 'Love Cry Team',
    rating: 5,
    avatar: 'LC'
  },
  {
    quote: 'Every phase of our partnership was built on trust and a shared standard of craft. Our ticket platform exceeded what we envisioned.',
    team: 'RSK Eventix Team',
    rating: 5,
    avatar: 'RE'
  },
  {
    quote: 'They built a clean, responsive platform that connects customers with service providers seamlessly. Working with Auroze was an absolute game changer.',
    team: 'SoulRoots Team',
    rating: 5,
    avatar: 'SR'
  }
];

export const FAQ_ITEMS = [
  {
    q: 'How long does a website take?',
    a: 'Most business websites take 4–8 weeks depending on scope, content, and integrations. Enterprise platforms may require 10–16 weeks with phased delivery.'
  },
  {
    q: 'Do you build mobile apps?',
    a: 'Yes. We build native Android and iOS apps, cross-platform solutions with Flutter and React Native, and progressive web apps for broader reach.'
  },
  {
    q: 'Can you redesign existing systems?',
    a: 'Absolutely. We audit your current platform, preserve what works, and redesign architecture, UX, and performance for modern standards.'
  },
  {
    q: 'Do you provide support?',
    a: 'We offer ongoing maintenance, feature updates, monitoring, and dedicated support packages after launch.'
  },
  {
    q: 'Do you offer hosting?',
    a: 'Yes. We deploy on AWS, Vercel, Cloudflare, and other cloud providers with optimized CI/CD pipelines and security best practices.'
  },
  {
    q: 'Can you automate our business?',
    a: 'We design workflow automations, AI integrations, CRM connections, payment flows, and internal tools tailored to your operations.'
  }
];

/* ==========================================
   PROJECTS PAGE DATA
   ========================================== */

export const PROJECT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'websites', label: 'Websites' },
  { id: 'mobile-apps', label: 'Mobile Apps' },
  { id: 'products', label: 'Products' },
  { id: 'enterprise-systems', label: 'Enterprise Systems' },
  { id: 'pos-systems', label: 'POS Systems' },
  { id: 'upcoming', label: 'Upcoming' }
];

export const PROJECT_STATUS = {
  live: { label: 'Live', class: 'is-live' },
  completed: { label: 'Completed', class: 'is-completed' },
  upcoming: { label: 'Upcoming', class: 'is-upcoming' },
  'in-development': { label: 'In Development', class: 'is-dev' },
  private: { label: 'Private', class: 'is-private' }
};

export const HERO_FEATURED = [
  {
    id: 'soulroots',
    order: 1,
    filters: ['featured', 'websites'],
    title: 'SoulRoots',
    category: 'Website',
    status: 'live',
    image: 'assets/images/soulroots.png',
    alt: 'SoulRoots home maintenance platform preview',
    url: 'https://soulroots.info',
    description: 'A modern home maintenance platform connecting customers with trusted home service providers through a clean, responsive and user-friendly digital experience.',
    features: ['Responsive Website', 'Booking Experience', 'Modern UI', 'SEO Ready'],
    technologies: ['Next.js', 'React', 'Tailwind', 'SEO']
  },
  {
    id: 'btexpress',
    order: 2,
    filters: ['featured', 'mobile-apps', 'upcoming'],
    title: 'BTExpress',
    category: 'Cross Platform',
    status: 'upcoming',
    image: 'assets/images/BTtravells.jpeg',
    alt: 'BTExpress transportation platform preview',
    url: null,
    description: 'An upcoming transportation platform including Android, iOS and Web applications designed for modern travel management and booking experiences.',
    features: ['Android', 'iOS', 'Web'],
    technologies: ['Flutter', 'React', 'Node.js', 'Firebase']
  },
  {
    id: 'canada-pizza-web',
    order: 3,
    filters: ['featured', 'websites', 'upcoming'],
    title: 'Canada Pizza',
    category: 'Website',
    status: 'upcoming',
    image: 'assets/images/pizza.png',
    alt: 'Canada Pizza restaurant website preview',
    url: null,
    client: 'Canada',
    description: 'An upcoming restaurant website for a Canadian pizza brand — featuring menu showcase, online ordering and a premium digital brand experience.',
    features: ['Menu Showcase', 'Online Ordering', 'Modern UI', 'Mobile Ready'],
    technologies: ['Next.js', 'React', 'Tailwind', 'SEO']
  }
];

export const UPCOMING_PRODUCTS = [
  {
    id: 'exam-engine',
    filters: ['products', 'upcoming'],
    title: 'Exam Engine',
    category: 'Education Platform',
    status: 'upcoming',
    statusNote: 'Launching September',
    badge: 'Premium Product',
    image: 'assets/images/exam.png',
    alt: 'Exam Engine education platform preview',
    description: 'A comprehensive examination platform designed for schools, universities, teachers and students with support for multiple examination types across five countries.',
    features: ['Online Exams', 'Question Banks', 'IQ Tests', 'Analytics', 'University Exams', 'Teacher Dashboard', 'Student Portal'],
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
  },
  {
    id: 'filmism',
    filters: ['products', 'upcoming'],
    title: 'FILMISM',
    category: 'Entertainment',
    status: 'in-development',
    badge: null,
    image: 'assets/images/flim.png',
    alt: 'FILMISM movie discovery platform preview',
    description: 'A movie information platform providing movie details, discovery tools and entertainment insights with a modern user experience.',
    features: ['Movie Discovery', 'Details & Reviews', 'Modern UX'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind']
  },
  {
    id: 'confidential',
    filters: ['products', 'upcoming'],
    title: 'Confidential Product',
    category: 'Private Project',
    status: 'private',
    confidential: true,
    description: 'Currently under development for strategic reasons. Additional information cannot be publicly disclosed at this stage.',
    features: [],
    technologies: []
  }
];

export const ENTERPRISE_SYSTEMS = [
  {
    id: 'famia',
    filters: ['enterprise-systems'],
    title: 'FAMIA System',
    category: 'Enterprise Platform',
    status: 'completed',
    client: 'Canada',
    description: 'Business management platform developed for a Canadian client to streamline operations and improve workflow efficiency.',
    features: ['Operations Management', 'Workflow Automation', 'Reporting'],
    technologies: ['React', 'Node.js', 'PostgreSQL']
  },
  {
    id: 'retail-mgmt',
    filters: ['enterprise-systems'],
    title: 'Retail Management System',
    category: 'Enterprise Platform',
    status: 'completed',
    description: 'Custom hardware-integrated inventory and billing solution connecting two physical stores into one centralized management platform.',
    features: ['Shared Inventory', 'Billing', 'Stock Tracking', 'Sales Reports', 'Customer Management'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Hardware Integration']
  },
  {
    id: 'advanced-inventory',
    filters: ['enterprise-systems'],
    title: 'Advanced Inventory System',
    category: 'Enterprise Platform',
    status: 'completed',
    description: 'Enterprise inventory management platform integrated with specialized hardware for synchronized business operations across multiple locations.',
    features: ['Multi-location Sync', 'Hardware Integration', 'Real-time Stock'],
    technologies: ['React', 'Node.js', 'AWS', 'IoT']
  }
];

export const POS_SOLUTIONS = [
  {
    id: 'canada-pizza',
    filters: ['pos-systems'],
    title: 'Canada Pizza System',
    category: 'Restaurant POS',
    status: 'completed',
    client: 'Canada',
    image: 'assets/images/pizzeria.png',
    alt: 'Canada Pizza System restaurant POS preview',
    description: 'Customized restaurant POS solution with inventory management, billing, kitchen workflow and reporting.',
    features: ['Restaurant POS', 'Retail POS', 'Kitchen Display', 'Billing', 'Analytics', 'Inventory POS'],
    technologies: ['React', 'Node.js', 'Cloud POS']
  }
];

export const POS_TYPES = [
  'Restaurant POS', 'Retail POS', 'Pizza POS', 'Cloud POS',
  'Inventory POS', 'Kitchen Display', 'Billing', 'Analytics'
];

export const PROJECT_DEV_PROCESS = [
  { title: 'Idea', icon: 'idea' },
  { title: 'Research', icon: 'research' },
  { title: 'Design', icon: 'design' },
  { title: 'Development', icon: 'dev' },
  { title: 'Testing', icon: 'testing' },
  { title: 'Launch', icon: 'launch' },
  { title: 'Support', icon: 'support' }
];

export const PROJECT_TECH_MARQUEE = [
  'React', 'Next.js', 'Node', 'Flutter', 'React Native', 'MongoDB', 'Firebase',
  'AWS', 'Docker', 'OpenAI', 'Stripe', 'TypeScript', 'Tailwind', 'Framer Motion'
];

export const PROJECT_TIMELINE = [
  { year: '2022', title: 'Company Started' },
  { title: 'Client Projects' },
  { title: 'Systems' },
  { title: 'Products' },
  { title: 'International Projects' },
  { title: 'Upcoming Launches' },
  { title: 'Future Innovations' }
];
