import { initSharedUI } from './shared-ui.js';
import {
  FEATURED_PROJECTS,
  SERVICES_DATA,
  PROCESS_STEPS,
  TECH_STACK,
  WHY_AUROZE,
  TESTIMONIALS,
  FAQ_ITEMS
} from './projects-data.js';

const SERVICE_ICONS = {
  web: '◈',
  mobile: '◎',
  software: '⬡',
  pos: '▣',
  marketing: '◆',
  brand: '✦',
  design: '◇',
  photo: '▶',
  content: '≡',
  automation: '⚡'
};

const PROCESS_SVGS = {
  discovery: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  planning: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  design: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><path d="M4 20l4-12 6 6 10-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="6" r="1.75" fill="currentColor"/></svg>`,
  dev: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3M14 7l-4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  testing: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  launch: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 6.2H19l-5.2 9.8L12 13H7l5-10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 10.5L6 12M14.5 10.5L18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  growth: `<svg class="svc-process-svg" viewBox="0 0 24 24" fill="none"><path d="M4 18h16M6 16l4-5 4 3 5-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const BENTO_ICONS = {
  fast: '⚡',
  design: '✦',
  business: '◈',
  seo: '◎',
  scale: '⬡',
  tech: '◇',
  support: '◆',
  process: '≡'
};

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE_PERF = window.innerWidth <= 768;

  initSharedUI();
  renderContent();
  initPageTransition();
  initHeroServiceReveal();
  initScrollProgress();
  initCursorGlow();
  initMagneticButtons();

  if (!reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(IS_MOBILE_PERF ? 1200 : 600, IS_MOBILE_PERF ? 80 : 40);
    initRevealAnimations();
    initCtaParticles();
    initServiceCardSpotlight();
    initBentoSpotlight();
    initProcessScroll();
    initWorkParallax();
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  }

  initTestimonialsSlider(reducedMotion);
  initFaqAccordion();
  initLazySections();
});

function renderContent() {
  renderServicesGrid();
  renderProcess();
  renderMarquee();
  renderBento();
  renderWork();
  renderTestimonials();
  renderFaq();
}

function renderServicesGrid() {
  const mount = document.getElementById('svc-grid-mount');
  if (!mount) return;

  mount.innerHTML = SERVICES_DATA.map((svc) => `
    <article class="svc-card" data-tilt-card data-lazy>
      <div class="svc-card-glow"></div>
      <div class="svc-card-icon" aria-hidden="true">${SERVICE_ICONS[svc.icon] || '◈'}</div>
      <h3 class="svc-card-title">${svc.title}</h3>
      <p class="svc-card-desc">${svc.description}</p>
      <div class="svc-card-features">
        ${svc.features.map((f) => `<span class="svc-feature-tag">${f}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderProcess() {
  const mount = document.getElementById('svc-process-mount');
  if (!mount) return;

  mount.innerHTML = PROCESS_STEPS.map((step) => `
    <div class="svc-process-step" data-reveal>
      <div class="svc-process-num">${step.num}</div>
      <div class="svc-process-icon" aria-hidden="true">${PROCESS_SVGS[step.icon] || PROCESS_SVGS.discovery}</div>
      <h3 class="svc-process-title">${step.title}</h3>
      <p class="svc-process-desc">${step.desc}</p>
    </div>
  `).join('');
}

function renderMarquee() {
  const mount = document.getElementById('svc-marquee-mount');
  if (!mount) return;

  const pills = TECH_STACK.map((tech) => `<span class="svc-tech-pill">${tech}</span>`).join('');
  mount.innerHTML = `
    <div class="svc-marquee-group">${pills}</div>
    <div class="svc-marquee-group" aria-hidden="true">${pills}</div>
  `;
}

function renderBento() {
  const mount = document.getElementById('svc-bento-mount');
  if (!mount) return;

  mount.innerHTML = WHY_AUROZE.map((item) => `
    <div class="svc-bento-card" data-bento data-reveal>
      <div class="svc-bento-icon" aria-hidden="true">${BENTO_ICONS[item.icon] || '✦'}</div>
      <h3 class="svc-bento-title">${item.title}</h3>
      <p class="svc-bento-desc">${item.desc}</p>
    </div>
  `).join('');
}

function renderWork() {
  const mount = document.getElementById('svc-work-mount');
  if (!mount) return;

  mount.innerHTML = FEATURED_PROJECTS.map((project) => `
    <a href="${project.url}" class="svc-work-card" target="_blank" rel="noopener noreferrer" data-reveal data-parallax-card>
      <div class="svc-work-media">
        <img src="${project.image}" alt="${project.alt}" loading="lazy" data-parallax-img>
      </div>
      <div class="svc-work-body">
        <div class="svc-work-type">${project.type}</div>
        <h3 class="svc-work-title">${project.title}</h3>
        <div class="svc-work-industry">${project.industry}</div>
        <div class="svc-work-tech">
          ${project.technologies.map((t) => `<span>${t}</span>`).join('')}
        </div>
        <div class="svc-work-cta">
          <span>View Project</span>
          <span>→</span>
        </div>
      </div>
    </a>
  `).join('');
}

function renderTestimonials() {
  const mount = document.getElementById('svc-testimonials-mount');
  const dotsMount = document.getElementById('svc-testimonials-dots');
  if (!mount) return;

  mount.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="svc-testimonial-card" data-slide="${i}">
      <div class="svc-testimonial-stars" aria-label="${t.rating} stars">${'★'.repeat(t.rating)}</div>
      <blockquote class="svc-testimonial-quote">"${t.quote}"</blockquote>
      <div class="svc-testimonial-author">
        <div class="svc-testimonial-avatar">${t.avatar}</div>
        <div>
          <div class="svc-testimonial-name">${t.team}</div>
        </div>
      </div>
    </div>
  `).join('');

  if (dotsMount) {
    dotsMount.innerHTML = TESTIMONIALS.map((_, i) => `
      <button class="svc-testimonials-dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Go to testimonial ${i + 1}"></button>
    `).join('');
  }
}

function renderFaq() {
  const mount = document.getElementById('svc-faq-mount');
  if (!mount) return;

  mount.innerHTML = FAQ_ITEMS.map((item, i) => `
    <div class="svc-faq-item" data-faq>
      <button class="svc-faq-trigger" aria-expanded="false" aria-controls="faq-answer-${i}">
        <span>${item.q}</span>
        <span class="svc-faq-icon">+</span>
      </button>
      <div class="svc-faq-answer" id="faq-answer-${i}" role="region">
        <div class="svc-faq-answer-inner">${item.a}</div>
      </div>
    </div>
  `).join('');
}

function initPageTransition() {
  document.body.classList.add('is-loaded');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.from('.svc-top-bar', {
    opacity: 0,
    y: -20,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.1
  });

  gsap.from('.svc-hero-content > *', {
    opacity: 0,
    y: 36,
    filter: 'blur(6px)',
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.2
  });
}

function initHeroServiceReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visual = document.querySelector('.svc-hero-visual');
  const slides = gsap.utils.toArray('[data-cycler-slide]');

  if (!visual || !slides.length) return;

  const resetSlide = (slide) => {
    const name = slide.querySelector('.svc-hero-cycler-name');
    slide.classList.remove('is-active');
    gsap.set(slide, { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
    gsap.set(name, { y: 20, opacity: 0, filter: 'blur(6px)' });
  };

  slides.forEach(resetSlide);

  if (reducedMotion) {
    const first = slides[0];
    first.classList.add('is-active');
    gsap.set(first, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
    gsap.set(first.querySelector('.svc-hero-cycler-name'), { y: 0, opacity: 1, filter: 'blur(0px)' });
    return;
  }

  let currentIndex = 0;
  let cycleTimeline = null;

  const playSlide = (index) => {
    slides.forEach((slide, i) => {
      if (i !== index) resetSlide(slide);
    });

    const slide = slides[index];
    const name = slide.querySelector('.svc-hero-cycler-name');

    slide.classList.add('is-active');
    gsap.set(slide, { visibility: 'visible', pointerEvents: 'auto' });

    cycleTimeline = gsap.timeline({
      onComplete: () => {
        resetSlide(slide);
        currentIndex = (currentIndex + 1) % slides.length;
        playSlide(currentIndex);
      }
    });

    cycleTimeline
      .to(slide, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      .to(name, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }, '<')
      .to({}, { duration: 1.4 })
      .to(name, { opacity: 0, y: -14, filter: 'blur(4px)', duration: 0.35, ease: 'power2.in' })
      .to(slide, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15')
      .to({}, { duration: 0.15 });
  };

  gsap.delayedCall(0.6, () => playSlide(currentIndex));
}

function initScrollProgress() {
  const bar = document.querySelector('.svc-scroll-progress-bar');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.width = `${progress * 100}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCursorGlow() {
  const glow = document.querySelector('.svc-cursor-glow');
  if (!glow || window.innerWidth <= 768) return;

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  const tick = () => {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    requestAnimationFrame(tick);
  };
  tick();
}

function initMagneticButtons() {
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    if (window.innerWidth <= 768) return;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    });
  });
}

function initRevealAnimations() {
  const IS_MOBILE_PERF = window.innerWidth <= 768;
  const smoothScrub = (v) => +(v * (IS_MOBILE_PERF ? 1.38 : 1.2)).toFixed(2);

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 48, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          once: true
        },
        onComplete: () => el.classList.add('is-visible')
      }
    );
  });

  gsap.utils.toArray('.svc-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 60, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        delay: (i % 2) * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          once: true
        }
      }
    );
  });
}

function initCtaParticles() {
  const canvas = document.querySelector('.svc-cta-particles');
  const section = document.querySelector('.svc-final-cta');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  let active = false;
  const particleCount = window.innerWidth <= 768 ? 14 : 30;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      r: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2
    }));
  };

  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  let tick = 0;
  const draw = () => {
    if (!active || document.hidden) {
      rafId = null;
      return;
    }

    tick += 0.02;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      const y = p.y + Math.sin(tick + p.phase) * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 0, ${0.15 + Math.sin(tick + p.phase) * 0.1})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !document.hidden && !rafId) draw();
      if (!active && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }, { rootMargin: '60px' });
    observer.observe(section);
  } else {
    active = true;
    draw();
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && active && !rafId) draw();
  });
}

function initServiceCardSpotlight() {
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('.svc-card').forEach((card) => {
    const glow = card.querySelector('.svc-card-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (glow) {
        glow.style.left = `${x - 100}px`;
        glow.style.top = `${y - 100}px`;
      }
      gsap.to(card, {
        rotateX: (y - rect.height / 2) / -30,
        rotateY: (x - rect.width / 2) / 30,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
  });
}

function initBentoSpotlight() {
  document.querySelectorAll('[data-bento]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${mx}%`);
      card.style.setProperty('--my', `${my}%`);
    });
  });
}

function initProcessScroll() {
  const track = document.querySelector('.svc-process-track');
  const wrap = document.querySelector('.svc-process-track-wrap');
  if (!track || !wrap || window.innerWidth <= 900) return;

  const getScroll = () => Math.max(0, track.scrollWidth - wrap.clientWidth);

  gsap.to(track, {
    x: () => -getScroll(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.svc-process-section',
      pin: false,
      start: 'top 70%',
      end: () => `+=${getScroll() + 200}`,
      scrub: 1.2,
      invalidateOnRefresh: true
    }
  });
}

function initWorkParallax() {
  document.querySelectorAll('[data-parallax-card]').forEach((card) => {
    const img = card.querySelector('[data-parallax-img]');
    if (!img) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(img, {
        x: x * 16,
        y: y * 12,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
    });
  });
}

function initTestimonialsSlider(reducedMotion) {
  const track = document.querySelector('.svc-testimonials-track');
  const dots = document.querySelectorAll('.svc-testimonials-dot');
  const cards = document.querySelectorAll('.svc-testimonial-card');
  if (!track || !cards.length) return;

  let current = 0;
  let intervalId = null;

  const getOffset = (index) => {
    const card = cards[index];
    if (!card) return 0;
    return card.offsetLeft;
  };

  const goTo = (index) => {
    current = ((index % cards.length) + cards.length) % cards.length;
    const offset = getOffset(current);
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.dot, 10));
      resetAuto();
    });
  });

  const resetAuto = () => {
    if (intervalId) clearInterval(intervalId);
    if (!reducedMotion) {
      intervalId = setInterval(() => goTo(current + 1), 5000);
    }
  };

  goTo(0);
  resetAuto();

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1));
      resetAuto();
    }
  }, { passive: true });
}

function initLazySections() {
  const sections = document.querySelectorAll('.svc-grid-section, .svc-process-section, .svc-tech-section, .svc-why-section, .svc-work-section, .svc-testimonials-section, .svc-faq-section, .svc-final-cta');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-lazy-loaded');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '120px 0px', threshold: 0.05 });

  sections.forEach((section) => {
    section.classList.add('is-lazy-pending');
    observer.observe(section);
  });
}

function initFaqAccordion() {
  document.querySelectorAll('[data-faq]').forEach((item) => {
    const trigger = item.querySelector('.svc-faq-trigger');
    const answer = item.querySelector('.svc-faq-answer');
    const inner = item.querySelector('.svc-faq-answer-inner');
    if (!trigger || !answer || !inner) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('[data-faq].is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.svc-faq-trigger')?.setAttribute('aria-expanded', 'false');
          gsap.to(openItem.querySelector('.svc-faq-answer'), { height: 0, duration: 0.4, ease: 'power2.inOut' });
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        gsap.to(answer, { height: 0, duration: 0.4, ease: 'power2.inOut' });
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        gsap.to(answer, { height: inner.offsetHeight, duration: 0.45, ease: 'power2.out' });
      }
    });
  });
}
