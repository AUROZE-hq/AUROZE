import { initSharedUI } from './shared-ui.js';
import { EMAILJS_CONFIG } from './contact-email-config.js';
import {
  PROJECT_TYPES,
  SERVICE_TO_PROJECT_TYPE,
  BUDGET_RANGES,
  TIMELINES,
  REFERRAL_SOURCES,
  CONTACT_LOCATIONS,
  CONTACT_AVAILABLE,
  WHY_BENTO,
  CONTACT_PROCESS,
  CONTACT_FAQ,
  SOCIAL_LINKS
} from './contact-data.js';

const BENTO_ICONS = {
  global: '◎',
  tech: '⬡',
  creative: '✦',
  business: '◈',
  scale: '◇',
  support: '◆'
};

const MIN_SUBMIT_INTERVAL_MS = 30000;
const SUCCESS_MESSAGE = 'Thank you for contacting Auroze. Our team will review your project and get back to you soon.';

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE_PERF = window.innerWidth <= 768;

  initSharedUI();
  renderContent();
  populateFormSelects();
  applySourceParams();
  initForm();
  initFaq();
  initPageTransition();
  initScrollProgress();
  initCursorGlow();
  initMagneticButtons();
  initHeroParticles();

  if (!reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(IS_MOBILE_PERF ? 1200 : 600, IS_MOBILE_PERF ? 80 : 40);
    initRevealAnimations();
    initProcessReveal();
    initFormFieldAnimations();
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.ct-process-step').forEach((el) => el.classList.add('is-visible'));
  }
});

function renderContent() {
  renderInfoCards();
  renderSocial();
  renderBento();
  renderProcess();
  renderFaq();
}

function renderInfoCards() {
  const mount = document.getElementById('ct-info-cards-mount');
  if (!mount) return;

  const locationPills = CONTACT_LOCATIONS.map((loc) => `<span class="ct-location-pill">${loc}</span>`).join('');
  const availablePills = CONTACT_AVAILABLE.map((item) => `<span class="ct-available-pill">${item}</span>`).join('');

  mount.innerHTML = `
    <div class="ct-info-card">
      <div class="ct-info-card-label">Email</div>
      <div class="ct-info-card-value"><a href="mailto:info@auroze.com">info@auroze.com</a></div>
    </div>
    <div class="ct-info-card">
      <div class="ct-info-card-label">Location</div>
      <div class="ct-info-card-value">Virtual Teams</div>
      <div class="ct-location-list">${locationPills}</div>
    </div>
    <div class="ct-info-card">
      <div class="ct-info-card-label">Working Style</div>
      <div class="ct-info-card-value">Remote Collaboration</div>
    </div>
    <div class="ct-info-card">
      <div class="ct-info-card-label">Available For</div>
      <div class="ct-available-list">${availablePills}</div>
    </div>`;
}

function renderSocial() {
  const mount = document.getElementById('ct-social-mount');
  if (!mount) return;

  mount.innerHTML = SOCIAL_LINKS.map((s) => `
    <a href="${s.href}" class="ct-social-btn" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">${s.icon}</a>
  `).join('');
}

function renderBento() {
  const mount = document.getElementById('ct-bento-mount');
  if (!mount) return;

  mount.innerHTML = WHY_BENTO.map((card) => `
    <article class="ct-bento-card" data-reveal>
      <div class="ct-bento-icon" aria-hidden="true">${BENTO_ICONS[card.id] || '◈'}</div>
      <h3 class="ct-bento-title">${card.title}</h3>
      <p class="ct-bento-desc">${card.description}</p>
    </article>
  `).join('');
}

function renderProcess() {
  const mount = document.getElementById('ct-process-mount');
  if (!mount) return;

  mount.innerHTML = CONTACT_PROCESS.map((step) => `
    <div class="ct-process-step" data-process-step>
      <div class="ct-process-num">${step.step}</div>
      <h3 class="ct-process-title">${step.title}</h3>
      <p class="ct-process-desc">${step.description}</p>
    </div>
  `).join('');
}

function renderFaq() {
  const mount = document.getElementById('ct-faq-mount');
  if (!mount) return;

  mount.innerHTML = CONTACT_FAQ.map((item, i) => `
    <div class="ct-faq-item" data-faq-item>
      <button type="button" class="ct-faq-trigger" aria-expanded="false" aria-controls="ct-faq-${i}">
        <span>${item.q}</span>
        <span class="ct-faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="ct-faq-answer" id="ct-faq-${i}" role="region">
        <div class="ct-faq-answer-inner">${item.a}</div>
      </div>
    </div>
  `).join('');
}

function populateFormSelects() {
  fillSelect('ct-project-type', PROJECT_TYPES);
  fillSelect('ct-budget', BUDGET_RANGES);
  fillSelect('ct-timeline', TIMELINES);
  fillSelect('ct-referral', REFERRAL_SOURCES);
}

function fillSelect(id, options) {
  const select = document.getElementById(id);
  if (!select) return;

  options.forEach((opt) => {
    const el = document.createElement('option');
    el.value = opt.value;
    el.textContent = opt.label;
    select.appendChild(el);
  });
}

function applySourceParams() {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'home';
  const service = params.get('service');
  const type = params.get('type');

  const sourceInput = document.getElementById('ct-source-page');
  const inquiryInput = document.getElementById('ct-inquiry-type');
  const projectTypeSelect = document.getElementById('ct-project-type');

  if (sourceInput) sourceInput.value = from;

  if (from === 'services') {
    if (inquiryInput) inquiryInput.value = 'service-inquiry';
    const mapped = service ? SERVICE_TO_PROJECT_TYPE[service] : null;
    if (mapped && projectTypeSelect) projectTypeSelect.value = mapped;
  } else if (from === 'projects') {
    if (inquiryInput) inquiryInput.value = 'project-inquiry';
    if (type && projectTypeSelect) projectTypeSelect.value = type;
    else if (projectTypeSelect && !projectTypeSelect.value) projectTypeSelect.value = 'other';
  } else {
    if (inquiryInput) inquiryInput.value = 'general-inquiry';
  }

  if (params.get('scroll') === 'form') {
    requestAnimationFrame(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function initForm() {
  const form = document.getElementById('ct-project-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors();

    const data = collectFormData(form);
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      showFieldErrors(errors);
      return;
    }

    if (data.website) return;

    const lastSubmit = Number(sessionStorage.getItem('auroze-last-submit') || 0);
    if (Date.now() - lastSubmit < MIN_SUBMIT_INTERVAL_MS) {
      showFormError('Please wait a moment before submitting again.');
      return;
    }

    setSubmitLoading(true);
    hideFormStatus();

    try {
      await sendFormEmail(data);
      sessionStorage.setItem('auroze-last-submit', String(Date.now()));
      showFormSuccess();
      form.reset();
      applySourceParams();
    } catch (err) {
      showFormError(err.message || 'Something went wrong. Please try again or email info@auroze.com directly.');
    } finally {
      setSubmitLoading(false);
    }
  });
}

function collectFormData(form) {
  return {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    company: form.company.value.trim(),
    country: form.country.value.trim(),
    project_type: form.project_type.value,
    budget: form.budget.value,
    description: form.description.value.trim(),
    timeline: form.timeline.value,
    referral: form.referral.value,
    source_page: form.source_page.value,
    inquiry_type: form.inquiry_type.value,
    website: form.website.value.trim()
  };
}

function validateForm(data) {
  const errors = {};

  if (!data.name) errors.name = 'Full name is required.';
  if (!data.email) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address.';
  if (!data.project_type) errors.project_type = 'Please select a project type.';
  if (!data.description) errors.description = 'Please describe your project.';
  else if (data.description.length < 20) errors.description = 'Please provide at least 20 characters.';

  return errors;
}

function showFieldErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = document.querySelector(`[data-error="${field}"]`);
    const input = document.getElementById(`ct-${field.replace(/_/g, '-')}`) || document.querySelector(`[name="${field}"]`);
    if (errorEl) errorEl.textContent = message;
    if (input) input.classList.add('is-error');
  });
}

function clearFormErrors() {
  document.querySelectorAll('.ct-field-error').forEach((el) => { el.textContent = ''; });
  document.querySelectorAll('.ct-input, .ct-select, .ct-textarea').forEach((el) => el.classList.remove('is-error'));
}

async function sendFormEmail(data) {
  const projectLabel = PROJECT_TYPES.find((p) => p.value === data.project_type)?.label || data.project_type;
  const budgetLabel = BUDGET_RANGES.find((b) => b.value === data.budget)?.label || data.budget || 'Not specified';
  const timelineLabel = TIMELINES.find((t) => t.value === data.timeline)?.label || data.timeline || 'Not specified';
  const referralLabel = REFERRAL_SOURCES.find((r) => r.value === data.referral)?.label || data.referral || 'Not specified';

  const payload = {
    from_name: data.name,
    from_email: data.email,
    reply_to: data.email,
    to_email: EMAILJS_CONFIG.toEmail,
    phone: data.phone || 'Not provided',
    company: data.company || 'Not provided',
    country: data.country || 'Not provided',
    project_type: projectLabel,
    budget: budgetLabel,
    message: data.description,
    timeline: timelineLabel,
    referral_source: referralLabel,
    source_page: data.source_page,
    inquiry_type: data.inquiry_type,
    subject: `New Project Inquiry — ${projectLabel} — ${data.name}`
  };

  const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

  if (serviceId && templateId && publicKey && typeof emailjs !== 'undefined') {
    emailjs.init(publicKey);
    await emailjs.send(serviceId, templateId, payload);
    return;
  }

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(EMAILJS_CONFIG.toEmail)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      _subject: payload.subject,
      _template: 'table',
      _captcha: 'false',
      name: data.name,
      email: data.email,
      phone: payload.phone,
      company: payload.company,
      country: payload.country,
      project_type: projectLabel,
      budget: budgetLabel,
      description: data.description,
      timeline: timelineLabel,
      referral: referralLabel,
      source_page: data.source_page,
      inquiry_type: data.inquiry_type
    })
  });

  if (!response.ok) {
    throw new Error('Unable to send your request. Please email info@auroze.com directly.');
  }

  const result = await response.json();
  if (result.success === false) {
    throw new Error(result.message || 'Submission failed.');
  }
}

function setSubmitLoading(loading) {
  const btn = document.getElementById('ct-submit-btn');
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle('is-loading', loading);
}

function showFormSuccess() {
  const el = document.getElementById('ct-form-success');
  const err = document.getElementById('ct-form-error');
  if (err) err.classList.remove('is-visible');
  if (el) {
    el.textContent = SUCCESS_MESSAGE;
    el.classList.add('is-visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function showFormError(message) {
  const el = document.getElementById('ct-form-error');
  const ok = document.getElementById('ct-form-success');
  if (ok) ok.classList.remove('is-visible');
  if (el) {
    el.textContent = message;
    el.classList.add('is-visible');
  }
}

function hideFormStatus() {
  document.getElementById('ct-form-success')?.classList.remove('is-visible');
  document.getElementById('ct-form-error')?.classList.remove('is-visible');
}

function initFaq() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const trigger = item.querySelector('.ct-faq-trigger');
    const answer = item.querySelector('.ct-faq-answer');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.ct-faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          const t = openItem.querySelector('.ct-faq-trigger');
          const a = openItem.querySelector('.ct-faq-answer');
          if (t) t.setAttribute('aria-expanded', 'false');
          if (a) {
            if (reducedMotion) a.style.height = '0';
            else gsap.to(a, { height: 0, duration: 0.35, ease: 'power2.inOut' });
          }
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        if (reducedMotion) answer.style.height = '0';
        else gsap.to(answer, { height: 0, duration: 0.35, ease: 'power2.inOut' });
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        if (reducedMotion) {
          answer.style.height = 'auto';
        } else {
          gsap.set(answer, { height: 'auto' });
          const h = answer.offsetHeight;
          gsap.fromTo(answer, { height: 0 }, { height: h, duration: 0.4, ease: 'power2.out' });
        }
      }
    });
  });
}

function initPageTransition() {
  document.body.classList.add('is-loaded');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.from('.ct-top-bar', { opacity: 0, y: -20, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  gsap.from('.ct-hero-content > *', {
    opacity: 0, y: 36, filter: 'blur(6px)',
    duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.2
  });
}

function initScrollProgress() {
  const bar = document.querySelector('.ct-scroll-progress-bar');
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCursorGlow() {
  const glow = document.querySelector('.ct-cursor-glow');
  if (!glow || window.innerWidth <= 768) return;

  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

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
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });
}

function initHeroParticles() {
  const canvas = document.getElementById('ct-hero-particles');
  const section = document.querySelector('.ct-hero');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  let active = false;
  const count = window.innerWidth <= 768 ? 14 : 28;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
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

    tick += 0.012;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      const alpha = 0.1 + Math.sin(tick + p.phase) * 0.08;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 0, ${alpha})`;
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
}

function initRevealAnimations() {
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
}

function initProcessReveal() {
  const steps = gsap.utils.toArray('[data-process-step]');
  if (!steps.length) return;

  steps.forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, y: 40, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          once: true
        },
        onComplete: () => step.classList.add('is-visible')
      }
    );
  });
}

function initFormFieldAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.utils.toArray('.ct-field').forEach((field, i) => {
    gsap.from(field, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.04 * i,
      scrollTrigger: {
        trigger: '.ct-form-panel',
        start: 'top 80%',
        once: true
      }
    });
  });
}
