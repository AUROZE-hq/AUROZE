import { initSharedUI } from './shared-ui.js';
import {
  FEATURED_PROJECTS,
  PROJECT_FILTERS,
  PROJECT_STATUS,
  HERO_FEATURED,
  UPCOMING_PRODUCTS,
  ENTERPRISE_SYSTEMS,
  POS_SOLUTIONS,
  POS_TYPES,
  PROJECT_DEV_PROCESS,
  PROJECT_TECH_MARQUEE,
  PROJECT_TIMELINE
} from './projects-data.js';

const PROJECT_PROCESS_SVGS = {
  idea: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a5 5 0 00-3 9.2V14h6v-1.8A5 5 0 0012 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  research: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  design: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><path d="M4 20l4-12 6 6 10-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="6" r="1.75" fill="currentColor"/></svg>`,
  dev: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3M14 7l-4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  testing: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  launch: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 6.2H19l-5.2 9.8L12 13H7l5-10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  support: `<svg class="prj-process-svg" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v5c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V7l7-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 12.5l2 2 3.5-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE_PERF = window.innerWidth <= 768;

  initSharedUI();
  renderContent();
  initFilter();
  initCardSpotlight();
  initDetailsButtons();
  initPageTransition();
  initScrollProgress();
  initCursorGlow();
  initMagneticButtons();
  initHeroParticles();
  initCtaParticles();

  if (!reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(IS_MOBILE_PERF ? 1200 : 600, IS_MOBILE_PERF ? 80 : 40);
    initRevealAnimations();
    initProcessReveal();
    initTimelineReveal();
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.prj-process-step, .prj-process-conn, .prj-timeline-item, .prj-timeline-arrow').forEach((el) => {
      el.classList.add('is-visible');
    });
  }
});

function statusBadge(status, note) {
  const s = PROJECT_STATUS[status] || PROJECT_STATUS['in-development'];
  const noteHtml = note ? `<span class="prj-status-note">${note}</span>` : '';
  return `<span class="prj-status ${s.class}">${s.label}</span>${noteHtml}`;
}

function techTags(techs) {
  if (!techs?.length) return '';
  return `<div class="prj-card-tech">${techs.map((t) => `<span>${t}</span>`).join('')}</div>`;
}

function featureTags(features) {
  if (!features?.length) return '';
  return `<div class="prj-card-features">${features.map((f) => `<span>${f}</span>`).join('')}</div>`;
}

function cardActions(url, id) {
  const external = url
    ? `<a href="${url}" class="prj-card-btn prj-card-btn--primary" target="_blank" rel="noopener noreferrer">External Link <span>↗</span></a>`
    : '';
  return `
    <div class="prj-card-actions">
      <button type="button" class="prj-card-btn" data-details="${id}">View Details <span>→</span></button>
      ${external}
    </div>`;
}

function renderContent() {
  renderFilter();
  renderFeatured();
  renderUpcoming();
  renderEnterprise();
  renderPos();
  renderProcess();
  renderMarquee();
  renderTimeline();
}

function renderFilter() {
  const mount = document.getElementById('prj-filter-mount');
  if (!mount) return;

  mount.innerHTML = PROJECT_FILTERS.map((f) => `
    <button type="button" class="prj-filter-btn${f.id === 'all' ? ' is-active' : ''}" data-filter="${f.id}">${f.label}</button>
  `).join('');
}

function renderFeatured() {
  const mount = document.getElementById('prj-featured-mount');
  if (!mount) return;

  const heroCards = HERO_FEATURED.map((p) => `
    <article class="prj-card prj-card--large" data-prj-item data-filters="${p.filters.join(' ')}" data-reveal>
      <div class="prj-card-media">
        <span class="prj-card-num">PROJECT ${String(p.order).padStart(2, '0')}</span>
        <img src="${p.image}" alt="${p.alt}" loading="lazy">
        <div class="prj-card-media-overlay"></div>
      </div>
      <div class="prj-card-body">
        <div class="prj-card-meta">
          <span class="prj-card-category">${p.category}</span>
          ${statusBadge(p.status)}
          ${p.client ? `<span class="prj-enterprise-client">${p.client}</span>` : ''}
        </div>
        <h3 class="prj-card-title">${p.title}</h3>
        <p class="prj-card-desc">${p.description}</p>
        ${featureTags(p.features)}
        ${techTags(p.technologies)}
        ${cardActions(p.url, p.id)}
      </div>
    </article>
  `).join('');

  const gridCards = FEATURED_PROJECTS.map((p) => `
    <article class="prj-card" data-prj-item data-filters="${(p.filters || ['featured', 'websites']).join(' ')}" data-reveal>
      <div class="prj-card-media">
        <img src="${p.image}" alt="${p.alt}" loading="lazy">
        <div class="prj-card-media-overlay"></div>
      </div>
      <div class="prj-card-body">
        <div class="prj-card-meta">
          <span class="prj-card-category">${p.category || p.type}</span>
          ${statusBadge(p.status || 'live')}
        </div>
        <h3 class="prj-card-title">${p.title}</h3>
        <p class="prj-card-desc">${p.caption}</p>
        ${techTags(p.technologies)}
        ${cardActions(p.url, p.id)}
      </div>
    </article>
  `).join('');

  mount.innerHTML = `
    <div class="prj-featured-hero">${heroCards}</div>
    <div class="prj-featured-grid">${gridCards}</div>
  `;
}

function renderUpcoming() {
  const mount = document.getElementById('prj-upcoming-mount');
  if (!mount) return;

  mount.innerHTML = UPCOMING_PRODUCTS.map((p) => {
    if (p.confidential) {
      return `
        <article class="prj-product-card prj-product-card--confidential" data-prj-item data-filters="${p.filters.join(' ')}" data-reveal>
          <div class="prj-confidential-lock" aria-hidden="true">🔒</div>
          <div class="prj-product-head">
            ${statusBadge(p.status)}
            <span class="prj-card-category">${p.category}</span>
          </div>
          <h3 class="prj-product-title">Confidential</h3>
          <p class="prj-product-desc">${p.description}</p>
          <button type="button" class="prj-card-btn" data-details="${p.id}">View Details <span>→</span></button>
        </article>`;
    }

    const badge = p.badge ? `<span class="prj-badge-premium">${p.badge}</span>` : '';
    const note = p.statusNote ? statusBadge(p.status, p.statusNote) : statusBadge(p.status);
    const media = p.image ? `
        <div class="prj-product-media">
          <img src="${p.image}" alt="${p.alt || p.title}" loading="lazy">
          <div class="prj-product-media-overlay"></div>
        </div>` : '';

    return `
      <article class="prj-product-card${p.image ? ' prj-product-card--has-media' : ''}" data-prj-item data-filters="${p.filters.join(' ')}" data-reveal>
        ${media}
        <div class="prj-product-body">
        <div class="prj-product-head">${note} ${badge}</div>
        <p class="prj-product-category">${p.category}</p>
        <h3 class="prj-product-title">${p.title}</h3>
        <p class="prj-product-desc">${p.description}</p>
        ${featureTags(p.features)}
        ${techTags(p.technologies)}
        <button type="button" class="prj-card-btn" data-details="${p.id}">View Details <span>→</span></button>
        </div>
      </article>`;
  }).join('');
}

function renderEnterprise() {
  const mount = document.getElementById('prj-enterprise-mount');
  if (!mount) return;

  mount.innerHTML = ENTERPRISE_SYSTEMS.map((p) => `
    <article class="prj-enterprise-card" data-prj-item data-filters="${p.filters.join(' ')}" data-reveal>
      <div class="prj-enterprise-left">
        <div class="prj-card-meta">
          <span class="prj-card-category">${p.category}</span>
          ${statusBadge(p.status)}
        </div>
        <h3 class="prj-enterprise-title">${p.title}</h3>
        ${p.client ? `<p class="prj-enterprise-client">Client — ${p.client}</p>` : ''}
      </div>
      <div class="prj-enterprise-right">
        <p class="prj-card-desc">${p.description}</p>
        ${featureTags(p.features)}
        ${techTags(p.technologies)}
        <button type="button" class="prj-card-btn" data-details="${p.id}">View Details <span>→</span></button>
      </div>
    </article>
  `).join('');
}

function renderPos() {
  const mount = document.getElementById('prj-pos-mount');
  if (!mount) return;

  const types = POS_TYPES.map((t) => `<span class="prj-pos-type">${t}</span>`).join('');

  const cards = POS_SOLUTIONS.map((p) => {
    const illus = p.image
      ? `<div class="prj-pos-illus"><img src="${p.image}" alt="${p.alt || p.title}" loading="lazy"></div>`
      : `<div class="prj-pos-illus" aria-hidden="true">
        <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="30" width="280" height="180" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
          <rect x="36" y="50" width="80" height="50" rx="6" fill="rgba(255,95,0,0.2)"/>
          <rect x="36" y="116" width="248" height="8" rx="4" fill="rgba(255,255,255,0.06)"/>
        </svg>
      </div>`;

    return `
    <article class="prj-pos-card" data-prj-item data-filters="${p.filters.join(' ')}" data-reveal>
      ${illus}
      <div>
        <div class="prj-card-meta">
          <span class="prj-card-category">${p.category}</span>
          ${statusBadge(p.status)}
          ${p.client ? `<span class="prj-enterprise-client">${p.client}</span>` : ''}
        </div>
        <h3 class="prj-card-title">${p.title}</h3>
        <p class="prj-card-desc">${p.description}</p>
        ${featureTags(p.features)}
        ${techTags(p.technologies)}
        <button type="button" class="prj-card-btn" data-details="${p.id}">View Details <span>→</span></button>
      </div>
    </article>`;
  }).join('');

  mount.innerHTML = `<div class="prj-pos-types" data-reveal>${types}</div>${cards}`;
}

function renderProcess() {
  const mount = document.getElementById('prj-process-mount');
  if (!mount) return;

  const parts = [];
  PROJECT_DEV_PROCESS.forEach((step, i) => {
    parts.push(`
      <div class="prj-process-step" data-process-step>
        <div class="prj-process-icon" aria-hidden="true">${PROJECT_PROCESS_SVGS[step.icon] || PROJECT_PROCESS_SVGS.idea}</div>
        <span class="prj-process-label">${step.title}</span>
      </div>`);
    if (i < PROJECT_DEV_PROCESS.length - 1) {
      parts.push(`<div class="prj-process-conn" data-process-conn aria-hidden="true">↓</div>`);
    }
  });
  mount.innerHTML = parts.join('');
}

function renderMarquee() {
  const mount = document.getElementById('prj-marquee-mount');
  if (!mount) return;

  const pills = PROJECT_TECH_MARQUEE.map((t) => `<span class="prj-tech-pill">${t}</span>`).join('');
  mount.innerHTML = `
    <div class="prj-marquee-group">${pills}</div>
    <div class="prj-marquee-group" aria-hidden="true">${pills}</div>
  `;
}

function renderTimeline() {
  const mount = document.getElementById('prj-timeline-mount');
  if (!mount) return;

  const parts = [];
  PROJECT_TIMELINE.forEach((item, i) => {
    parts.push(`
      <div class="prj-timeline-item" data-timeline-item>
        ${item.year ? `<div class="prj-timeline-year">${item.year}</div>` : ''}
        <div class="prj-timeline-title">${item.title}</div>
      </div>`);
    if (i < PROJECT_TIMELINE.length - 1) {
      parts.push(`<div class="prj-timeline-arrow" data-timeline-arrow aria-hidden="true">↓</div>`);
    }
  });
  mount.innerHTML = parts.join('');
}

function initFilter() {
  const bar = document.getElementById('prj-filter-mount');
  if (!bar) return;

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn || btn.classList.contains('is-active')) return;

    bar.querySelectorAll('.prj-filter-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeFilter = btn.dataset.filter;
    applyFilter(activeFilter);
  });
}

function applyFilter(filter) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-prj-item]');
  const sections = document.querySelectorAll('[data-prj-section]');

  const setVisibility = (item, show) => {
    if (reducedMotion) {
      item.classList.toggle('is-filtered-out', !show);
      return;
    }
    if (show) {
      item.classList.remove('is-filtered-out');
      gsap.fromTo(item,
        { opacity: 0, y: 16, scale: 0.98, filter: 'blur(4px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out', overwrite: true }
      );
    } else {
      gsap.to(item, {
        opacity: 0,
        y: -8,
        scale: 0.98,
        filter: 'blur(4px)',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => item.classList.add('is-filtered-out'),
        overwrite: true
      });
    }
  };

  items.forEach((item) => {
    const filters = (item.dataset.filters || '').split(' ');
    const show = filter === 'all' || filters.includes(filter);
    setVisibility(item, show);
  });

  sections.forEach((section) => {
    const sectionFilters = (section.dataset.prjSection || '').split(' ');
    const sectionItems = section.querySelectorAll('[data-prj-item]');
    const hasVisible = filter === 'all' || sectionFilters.includes(filter) ||
      Array.from(sectionItems).some((item) => {
        const f = (item.dataset.filters || '').split(' ');
        return f.includes(filter);
      });

    if (reducedMotion) {
      section.classList.toggle('is-section-hidden', !hasVisible);
      return;
    }

    if (hasVisible) {
      section.classList.remove('is-section-hidden');
      gsap.to(section, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    } else {
      gsap.to(section, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => section.classList.add('is-section-hidden')
      });
    }
  });

  if (filter !== 'all' && !reducedMotion) {
    const firstVisible = document.querySelector('[data-prj-item]:not(.is-filtered-out)');
    if (firstVisible) {
      const section = firstVisible.closest('[data-prj-section]');
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }
}

function initDetailsButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-details]');
    if (!btn) return;
    const target = document.getElementById('prj-cta') || document.getElementById('contact');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function initCardSpotlight() {
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.prj-card, .prj-product-card, .prj-enterprise-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  });
}

function initPageTransition() {
  document.body.classList.add('is-loaded');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.from('.prj-top-bar', { opacity: 0, y: -20, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  gsap.from('.prj-hero-content > *', {
    opacity: 0, y: 36, filter: 'blur(6px)',
    duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.2
  });
}

function initScrollProgress() {
  const bar = document.querySelector('.prj-scroll-progress-bar');
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    bar.style.width = `${pct * 100}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCursorGlow() {
  const glow = document.querySelector('.prj-cursor-glow');
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

  let x = 0;
  let y = 0;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    gsap.to(glow, { x, y, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
  });
}

function initMagneticButtons() {
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.2;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.2;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });
}

function initRevealAnimations() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 48, filter: 'blur(8px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onComplete: () => el.classList.add('is-visible')
      }
    );
  });
}

function initProcessReveal() {
  ScrollTrigger.create({
    trigger: '.prj-process-section',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      const steps = gsap.utils.toArray('[data-process-step]');
      const conns = gsap.utils.toArray('[data-process-conn]');
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('is-visible'), i * 100);
        if (conns[i]) setTimeout(() => conns[i].classList.add('is-visible'), i * 100 + 60);
      });
    }
  });
}

function initTimelineReveal() {
  ScrollTrigger.create({
    trigger: '#prj-timeline',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      const items = gsap.utils.toArray('[data-timeline-item]');
      const arrows = gsap.utils.toArray('[data-timeline-arrow]');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('is-visible'), i * 140);
        if (arrows[i]) setTimeout(() => arrows[i].classList.add('is-visible'), i * 140 + 80);
      });
    }
  });
}

function initHeroParticles() {
  const canvas = document.querySelector('.prj-hero-particles');
  const section = document.querySelector('.prj-hero');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  let active = false;
  const particleCount = window.innerWidth <= 768 ? 16 : 40;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
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

    tick += 0.015;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy + Math.sin(tick + p.phase) * 0.05;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      const alpha = 0.15 + Math.sin(tick + p.phase) * 0.1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 0, ${alpha})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  };

  bindParticleSectionVisibility(section, () => {
    active = true;
    if (!document.hidden && !rafId) draw();
  }, () => {
    active = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}

function bindParticleSectionVisibility(section, onVisible, onHidden) {
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onVisible();
      else onHidden();
    }, { rootMargin: '60px' });
    observer.observe(section);
  } else {
    onVisible();
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && section.getBoundingClientRect().bottom > 0) onVisible();
  });
}

function initCtaParticles() {
  const canvas = document.querySelector('.prj-cta-particles');
  const section = document.querySelector('.prj-final-cta');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  let active = false;
  const particleCount = window.innerWidth <= 768 ? 12 : 25;

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
      const alpha = 0.12 + Math.sin(tick + p.phase) * 0.08;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 0, ${alpha})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  };

  bindParticleSectionVisibility(section, () => {
    active = true;
    if (!document.hidden && !rafId) draw();
  }, () => {
    active = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}
