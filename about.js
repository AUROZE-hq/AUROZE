import { initSharedUI } from './shared-ui.js';
import {
  STORY_TIMELINE,
  HOW_WE_WORK,
  PEOPLE_STATS,
  VALUES,
  WHY_ABOUT,
  AUROZE_LOGO_SVG
} from './about-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initSharedUI();
  renderContent();
  injectTeamLogos();
  initScrollProgress();
  initCursorGlow();
  initMagneticButtons();

  if (!reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(600, 40);
    initPageTransition();
    initHeroParticles();
    initRevealAnimations();
    initTimelineScroll();
    initAromReveal();
    initWorkflowReveal();
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.abt-timeline-item, .abt-workflow-step, .abt-workflow-connector').forEach((el) => el.classList.add('is-visible'));
    document.querySelector('.abt-timeline')?.classList.add('is-drawn');
    revealAromInstant();
  }
});

function renderContent() {
  renderTimeline();
  renderWorkflow();
  renderStats();
  renderValues();
  renderWhy();
}

function injectTeamLogos() {
  const canada = document.getElementById('abt-logo-canada');
  const uk = document.getElementById('abt-logo-uk');
  if (canada) canada.innerHTML = AUROZE_LOGO_SVG.replace('id="abt-silver"', 'id="abt-silver-ca"');
  if (uk) uk.innerHTML = AUROZE_LOGO_SVG.replace('id="abt-silver"', 'id="abt-silver-uk"');
}

function renderTimeline() {
  const mount = document.getElementById('abt-timeline-mount');
  if (!mount) return;

  mount.innerHTML = STORY_TIMELINE.map((item, i) => {
    const arrow = i < STORY_TIMELINE.length - 1 ? '<span class="abt-timeline-arrow">↓</span>' : '';
    return `
      <div class="abt-timeline-item" data-timeline-item>
        <span class="abt-timeline-dot"></span>
        ${item.year ? `<div class="abt-timeline-year">${item.year}</div>` : `<div class="abt-timeline-title">${item.title}</div>`}
        <p class="abt-timeline-text">${item.text}</p>
      </div>
      ${arrow}
    `;
  }).join('');
}

function renderWorkflow() {
  const mount = document.getElementById('abt-workflow-mount');
  if (!mount) return;

  HOW_WE_WORK.forEach((step, i) => {
    if (i > 0) {
      const conn = document.createElement('span');
      conn.className = 'abt-workflow-connector';
      conn.textContent = '↓';
      conn.dataset.workflowConn = '';
      mount.appendChild(conn);
    }
    const el = document.createElement('div');
    el.className = 'abt-workflow-step';
    el.dataset.workflowStep = '';
    el.innerHTML = `
      <div class="abt-workflow-icon">${step.icon}</div>
      <span class="abt-workflow-label">${step.label}</span>
    `;
    mount.appendChild(el);
  });
}

function renderStats() {
  const mount = document.getElementById('abt-stats-mount');
  if (!mount) return;
  mount.innerHTML = PEOPLE_STATS.map((s) => `
    <div class="abt-stat-card" data-reveal>
      <div class="abt-stat-value">${s.value}</div>
      <div class="abt-stat-label">${s.label}</div>
      <div class="abt-stat-desc">${s.desc}</div>
    </div>
  `).join('');
}

function renderValues() {
  const mount = document.getElementById('abt-values-mount');
  if (!mount) return;
  mount.innerHTML = VALUES.map((v) => `
    <div class="abt-bento-card" data-reveal>
      <div class="abt-bento-icon">${v.icon}</div>
      <h3 class="abt-bento-title">${v.title}</h3>
      <p class="abt-bento-desc">${v.desc}</p>
    </div>
  `).join('');
}

function renderWhy() {
  const mount = document.getElementById('abt-why-mount');
  if (!mount) return;
  mount.innerHTML = WHY_ABOUT.map((w) => `
    <div class="abt-why-card" data-reveal>
      <div class="abt-why-icon">${w.icon}</div>
      <h3 class="abt-why-title">${w.title}</h3>
      <p class="abt-why-desc">${w.desc}</p>
    </div>
  `).join('');
}

function initPageTransition() {
  gsap.from('.abt-top-bar', { opacity: 0, y: -20, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  gsap.from('.abt-hero-inner > *', {
    opacity: 0, y: 32, filter: 'blur(6px)',
    duration: 0.85, ease: 'power3.out', stagger: 0.1, delay: 0.2
  });
}

function initHeroParticles() {
  const canvas = document.querySelector('.abt-hero-particles');
  const section = document.querySelector('.abt-hero');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      r: Math.random() * 1.2 + 0.4,
      phase: Math.random() * Math.PI * 2
    }));
  };

  resize();
  window.addEventListener('resize', resize);

  let tick = 0;
  const draw = () => {
    tick += 0.008;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      const a = 0.12 + Math.sin(tick + p.phase) * 0.08;
      ctx.beginPath();
      ctx.arc(p.x, p.y + Math.sin(tick + p.phase) * 0.4, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 0, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

function initScrollProgress() {
  const bar = document.querySelector('.abt-scroll-progress-bar');
  if (!bar) return;
  const update = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCursorGlow() {
  const glow = document.querySelector('.abt-cursor-glow');
  if (!glow || window.innerWidth <= 768) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  const tick = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
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
      gsap.to(btn, {
        x: (e.clientX - rect.left - rect.width / 2) * 0.22,
        y: (e.clientY - rect.top - rect.height / 2) * 0.22,
        duration: 0.4, ease: 'power2.out', overwrite: 'auto'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
    });
  });
}

function initRevealAnimations() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onComplete: () => el.classList.add('is-visible')
      }
    );
  });
}

function initTimelineScroll() {
  const timeline = document.querySelector('.abt-timeline');
  const items = gsap.utils.toArray('[data-timeline-item]');

  ScrollTrigger.create({
    trigger: '.abt-story-section',
    start: 'top 75%',
    once: true,
    onEnter: () => timeline?.classList.add('is-drawn')
  });

  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setTimeout(() => item.classList.add('is-visible'), i * 120);
      }
    });
  });
}

const AROM_LAYOUT = { A: 0, R: 1, O: 2, M: 3 };
const MORA_LAYOUT = { M: 0, O: 1, R: 2, A: 3 };

function initAromReveal() {
  const card = document.querySelector('[data-arom-card]');
  const container = document.querySelector('[data-arom-container]');
  const tag = document.querySelector('[data-arom-tag]');
  const desc = card?.querySelector('.abt-arom-desc');
  if (!card || !container) return;

  const letters = ['A', 'R', 'O', 'M'];
  const charEls = {};
  letters.forEach((L) => {
    charEls[L] = container.querySelector(`[data-arom-letter="${L}"]`);
  });

  const getSlotX = () => {
    const w = container.offsetWidth;
    const spacing = w / 4;
    return [0, 1, 2, 3].map((i) => -w / 2 + spacing * 0.5 + i * spacing);
  };

  const applyLayout = (layout, animateOpts = {}) => {
    const xs = getSlotX();
    letters.forEach((L) => {
      const el = charEls[L];
      if (!el) return;
      gsap.to(el, {
        xPercent: -50,
        yPercent: -50,
        x: xs[layout[L]],
        y: 0,
        duration: animateOpts.duration ?? 0.85,
        ease: animateOpts.ease ?? 'power3.inOut',
        overwrite: 'auto'
      });
    });
  };

  const setMoraStyle = (isMora) => {
    letters.forEach((L) => charEls[L]?.classList.toggle('is-mora-state', isMora));
    if (!tag) return;
    gsap.to(tag, {
      opacity: 0,
      y: 6,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        tag.textContent = isMora ? 'MORA' : 'AROM';
        gsap.to(tag, { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' });
      }
    });
  };

  let morphTl = null;
  let isMora = false;

  const runMorphLoop = () => {
    if (morphTl) morphTl.kill();
    morphTl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

    morphTl
      .to({}, { duration: 1.6 })
      .add(() => {
        isMora = true;
        setMoraStyle(true);
        letters.forEach((L) => {
          const el = charEls[L];
          const dist = Math.abs(MORA_LAYOUT[L] - AROM_LAYOUT[L]);
          gsap.to(el, {
            filter: 'blur(4px)',
            scale: 0.92,
            zIndex: dist > 1 ? 3 : 2,
            duration: 0.28,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        });
      })
      .add(() => applyLayout(MORA_LAYOUT, { duration: 0.9, ease: 'power3.inOut' }), '+=0')
      .to(letters.map((L) => charEls[L]), {
        filter: 'blur(0px)',
        scale: 1,
        zIndex: 1,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.05
      }, '-=0.35')
      .to({}, { duration: 1.8 })
      .add(() => {
        isMora = false;
        setMoraStyle(false);
        letters.forEach((L) => {
          const el = charEls[L];
          const dist = Math.abs(AROM_LAYOUT[L] - MORA_LAYOUT[L]);
          gsap.to(el, {
            filter: 'blur(4px)',
            scale: 0.92,
            zIndex: dist > 1 ? 3 : 2,
            duration: 0.28,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        });
      })
      .add(() => applyLayout(AROM_LAYOUT, { duration: 0.9, ease: 'power3.inOut' }), '+=0')
      .to(letters.map((L) => charEls[L]), {
        filter: 'blur(0px)',
        scale: 1,
        zIndex: 1,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.05
      }, '-=0.35');
  };

  const playIntro = () => {
    const xs = getSlotX();
    const intro = gsap.timeline({
      onComplete: () => runMorphLoop()
    });

    letters.forEach((L, i) => {
      const el = charEls[L];
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: xs[AROM_LAYOUT[L]],
        y: 24,
        opacity: 0,
        filter: 'blur(8px)',
        scale: 0.9
      });
      intro.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.55,
        ease: 'power3.out'
      }, i * 0.35);
    });

    intro.add(() => tag?.classList.add('is-visible'), '-=0.1');
    intro.add(() => desc?.classList.add('is-revealed'), '+=0.15');
  };

  ScrollTrigger.create({
    trigger: card,
    start: 'top 78%',
    once: true,
    onEnter: () => {
      requestAnimationFrame(() => playIntro());
    }
  });

  window.addEventListener('resize', () => {
    const layout = isMora ? MORA_LAYOUT : AROM_LAYOUT;
    applyLayout(layout, { duration: 0.3 });
  });
}

function revealAromInstant() {
  const container = document.querySelector('[data-arom-container]');
  const xs = container ? (() => {
    const w = container.offsetWidth;
    const spacing = w / 4;
    return [0, 1, 2, 3].map((i) => -w / 2 + spacing * 0.5 + i * spacing);
  })() : [0, 0, 0, 0];

  ['A', 'R', 'O', 'M'].forEach((L) => {
    const el = container?.querySelector(`[data-arom-letter="${L}"]`);
    if (el) {
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: xs[AROM_LAYOUT[L]],
        y: 0,
        opacity: 1,
        filter: 'none',
        scale: 1
      });
    }
  });
  document.querySelector('[data-arom-tag]')?.classList.add('is-visible');
  document.querySelector('.abt-arom-desc')?.classList.add('is-revealed');
}

function initWorkflowReveal() {
  const steps = gsap.utils.toArray('[data-workflow-step]');
  const connectors = gsap.utils.toArray('[data-workflow-conn]');

  ScrollTrigger.create({
    trigger: '.abt-workflow-section',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('is-visible'), i * 100);
        if (connectors[i]) setTimeout(() => connectors[i].classList.add('is-visible'), i * 100 + 60);
      });
    }
  });
}
