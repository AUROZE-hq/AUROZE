import { init3DScene } from './scene3d.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the 3D WebGL Monolith Scene
  init3DScene();

  // ==========================================
  // CENTERPIECE LOGO WOOFER EFFECT
  // ==========================================
  const cpWrapper = document.querySelector('.centerpiece-logo-wrapper');
  const cpLogo = document.querySelector('.centerpiece-logo');

  if (cpWrapper && cpLogo && window.innerWidth > 900) {
    const mainSvg = cpLogo.querySelector('.centerpiece-logo-svg');
    if (mainSvg) {
      // Create main logo wrapper to hold the vibrating face logo
      const mainWrapper = document.createElement('div');
      mainWrapper.className = 'logo-main';
      mainSvg.parentNode.insertBefore(mainWrapper, mainSvg);
      mainWrapper.appendChild(mainSvg);

      // Create 5 trailing outline layers underneath the main logo
      for (let i = 5; i >= 1; i--) {
        const trailDiv = document.createElement('div');
        trailDiv.className = `logo-trail logo-trail-${i}`;
        const clonedSvg = mainSvg.cloneNode(true);
        // Remove animation class inside clone to prevent duplicate sweeps
        const clonedShine = clonedSvg.querySelector('.shine-bar');
        if (clonedShine) clonedShine.remove();
        trailDiv.appendChild(clonedSvg);
        cpLogo.insertBefore(trailDiv, mainWrapper);
      }
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let isHovered = false;
    let animFrameId = null;
    const ease = 0.08; // smooth liquid easing
    const opacities = [0.6, 0.4, 0.25, 0.12, 0.05];

    function updateLerpRotation() {
      if (isHovered) {
        currentProgress += (targetProgress - currentProgress) * ease;
      } else {
        currentProgress += (0 - currentProgress) * ease;
        if (Math.abs(currentProgress) < 0.005) {
          currentProgress = 0;
          cpLogo.style.transform = '';
          cpLogo.style.transition = '';
          // Reset trail layers
          for (let i = 1; i <= 5; i++) {
            const trail = cpLogo.querySelector(`.logo-trail-${i}`);
            if (trail) {
              trail.style.transform = '';
              trail.style.opacity = '';
            }
          }
          animFrameId = null;
          return;
        }
      }

      const rotationY = currentProgress * 30; // max 30deg Y-rotation
      // Trail progress starts after a 25% threshold of the rotation turn
      const trailProgress = Math.max(0, (Math.abs(currentProgress) - 0.25) / 0.75);

      // Jitter shake is proportional to trail progress (stronger at the outer edges, zero at center)
      const jitterX = isHovered ? (Math.random() - 0.5) * 4 * trailProgress : 0;
      const jitterY = isHovered ? (Math.random() - 0.5) * 4 * trailProgress : 0;
      // Main logo scales down proportionally (gets smaller) as it turns and vibrates
      const logoScale = 1 - 0.12 * Math.abs(currentProgress);

      cpLogo.style.transform = `rotateY(${rotationY.toFixed(2)}deg) translate(${jitterX.toFixed(2)}px, ${jitterY.toFixed(2)}px) scale(${logoScale.toFixed(3)})`;
      cpLogo.style.transition = 'none'; // bypass transition conflicts

      // Update trail layers proportionally
      for (let i = 1; i <= 5; i++) {
        const trail = cpLogo.querySelector(`.logo-trail-${i}`);
        if (trail) {
          const trailX = -Math.sign(currentProgress) * trailProgress * 16 * i;
          const trailY = -trailProgress * 16 * i;
          const scale = 1 - (0.02 * i);
          const opacity = opacities[i - 1] * trailProgress;

          trail.style.transform = `translate(${trailX.toFixed(2)}px, ${trailY.toFixed(2)}px) scale(${scale})`;
          trail.style.opacity = opacity.toFixed(3);
          trail.style.transition = 'none';
        }
      }

      animFrameId = requestAnimationFrame(updateLerpRotation);
    }

    // Determine hover direction based on mouse position relative to wrapper center
    cpWrapper.addEventListener('mousemove', (e) => {
      const rect = cpWrapper.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const midPoint = rect.width / 2;

      // Set target progress between -1 (left edge) and 1 (right edge)
      const progress = (relativeX / rect.width) * 2 - 1;
      targetProgress = Math.max(-1, Math.min(1, progress));
      isHovered = true;

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateLerpRotation);
      }

      if (relativeX > midPoint) {
        // Hovering right half of wrapper -> animate trail to the left
        cpLogo.classList.remove('trail-right');
        cpLogo.classList.add('trail-left');
      } else {
        // Hovering left half of wrapper -> animate trail to the right
        cpLogo.classList.remove('trail-left');
        cpLogo.classList.add('trail-right');
      }
    });

    cpWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      cpLogo.classList.remove('trail-left', 'trail-right');
    });
  }

  // Core UI Elements
  const soundToggleBtn = document.querySelector('.sound-toggle');
  const soundOnIcon = document.querySelector('.sound-on');
  const soundOffIcon = document.querySelector('.sound-off');
  const menuToggleBtn = document.querySelector('.menu-toggle');
  const menuCloseBtn = document.querySelector('.menu-close');
  const menuOverlay = document.querySelector('#menu-overlay');
  const cookieBanner = document.querySelector('#cookie-banner');
  const cookieAcceptBtn = document.querySelector('#cookie-accept');
  const cookieDeclineBtn = document.querySelector('#cookie-decline');
  const morphingWord = document.querySelector('#morphing-word');

  // ==========================================
  // 1. FULLSCREEN NAVIGATION MENU OVERLAY
  // ==========================================
  const toggleMenu = (open) => {
    if (open) {
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      menuOverlay.classList.remove('active');
    }
  };

  menuToggleBtn.addEventListener('click', () => toggleMenu(true));
  menuCloseBtn.addEventListener('click', () => toggleMenu(false));

  // Close menu on hitting ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // ==========================================
  // 2. COOKIE BANNER DISMISSAL
  // ==========================================
  const checkCookieConsent = () => {
    const consent = localStorage.getItem('auroze-cookie-consent');
    if (consent === 'accepted' || consent === 'declined') {
      cookieBanner.classList.add('dismissed');
    }
  };

  cookieAcceptBtn.addEventListener('click', () => {
    localStorage.setItem('auroze-cookie-consent', 'accepted');
    cookieBanner.classList.add('dismissed');
  });

  cookieDeclineBtn.addEventListener('click', () => {
    localStorage.setItem('auroze-cookie-consent', 'declined');
    cookieBanner.classList.add('dismissed');
  });

  checkCookieConsent();

  // ==========================================
  // 3. HEADLINE CYCLE WORD TRANSITION (MOTION BLUR)
  // ==========================================
  const words = ['Success', 'impact', 'innovation', 'scale', 'momentum', 'growth'];
  let currentWordIdx = 0;

  const cycleWord = () => {
    // 1. Trigger blur out
    morphingWord.classList.add('blur-out');
    
    // 2. Wait for blur out transition to finish (400ms)
    setTimeout(() => {
      // Shift word index
      currentWordIdx = (currentWordIdx + 1) % words.length;
      
      // Update text
      morphingWord.textContent = words[currentWordIdx];
      
      // Instantly position it below (blur-in state)
      morphingWord.className = 'word-morph blur-in';
      
      // Force repaint to make sure instant transition is registered
      morphingWord.offsetWidth;
      
      // 3. Remove blur-in to animate upward & clear blur
      morphingWord.className = 'word-morph';
    }, 400);
  };

  // Cycle word every 3 seconds
  setInterval(cycleWord, 3200);

  // ==========================================
  // 4. AMBIENT BACKGROUND CANVAS
  // ==========================================
  const bgCanvas = document.getElementById('bg-canvas');
  const ctx = bgCanvas.getContext('2d');

  // Pre-load the logo image for background floating animation
  const logoImg = new Image();
  logoImg.src = 'auroze_logo.png';

  let width = bgCanvas.width = window.innerWidth;
  let height = bgCanvas.height = window.innerHeight;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('resize', () => {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
  });

  // Track normalized mouse coordinates for parallax
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) - 0.5;
    targetMouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Generate static star-like floating logo elements
  const starsCount = 40;
  const stars = [];
  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 8 + 6, // scaled size in px (6px to 14px)
      speed: Math.random() * 0.015 + 0.003,
      phase: Math.random() * Math.PI * 2,
      rotOffset: Math.random() * Math.PI * 2
    });
  }

  // Draw loop for background canvas
  const drawBackground = () => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply smooth interpolation to mouse tracking (easing)
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Draw Scattered Twinkling Logo Shapes
    stars.forEach(star => {
      star.phase += star.speed;
      const opacity = (Math.sin(star.phase) + 1) / 2 * 0.35 + 0.05; // faint ambient glow (5-40% opacity)
      
      // Calculate absolute positions with subtle parallax shifts
      const x = ((star.x / 100) * width) + (mouseX * 25);
      const y = ((star.y / 100) * height) + (mouseY * 25);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(star.phase * 0.15 + star.rotOffset);
      ctx.globalAlpha = opacity;
      ctx.drawImage(logoImg, -star.size / 2, -star.size / 2, star.size, star.size);
      ctx.restore();
    });

    // Draw Faint Diagonal Wireframe Lines / Light Rays (5-8% Opacity)
    ctx.strokeStyle = `rgba(255, 255, 255, 0.035)`;
    ctx.lineWidth = 1;

    // We draw 4 fixed diagonal lines crossing screen with parallax offsets
    const lines = [
      { startX: -width * 0.2, startY: -height * 0.2, endX: width * 0.8, endY: height * 1.2, parallax: 40 },
      { startX: width * 0.2, startY: -height * 0.2, endX: width * 1.2, endY: height * 0.8, parallax: 60 },
      { startX: -width * 0.5, startY: height * 0.3, endX: width * 0.5, endY: height * 1.3, parallax: 25 },
      { startX: width * 0.4, startY: -height * 0.5, endX: width * 1.4, endY: height * 0.5, parallax: 80 }
    ];

    lines.forEach(line => {
      ctx.beginPath();
      const px = mouseX * line.parallax;
      const py = mouseY * line.parallax;
      ctx.moveTo(line.startX + px, line.startY + py);
      ctx.lineTo(line.endX + px, line.endY + py);
      ctx.stroke();
    });

    requestAnimationFrame(drawBackground);
  };

  drawBackground();

  // ==========================================
  // 5. WEB AUDIO DIALOG / DRONE SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let mainGainNode = null;
  let oscillator1 = null;
  let oscillator2 = null;
  let lfo = null;
  let filter = null;
  let soundEnabled = false;

  const initAudio = () => {
    // Create Audio Context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create Nodes
    mainGainNode = audioCtx.createGain();
    mainGainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    // Oscillator 1 (Low sub fundamental)
    oscillator1 = audioCtx.createOscillator();
    oscillator1.type = 'triangle';
    oscillator1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note (55 Hz)

    // Oscillator 2 (Slightly detuned octave higher hum)
    oscillator2 = audioCtx.createOscillator();
    oscillator2.type = 'sawtooth';
    oscillator2.frequency.setValueAtTime(110.5, audioCtx.currentTime); // A2 note detuned

    // Lowpass filter to make it warm, dark and rumbling
    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, audioCtx.currentTime);
    filter.Q.setValueAtTime(4, audioCtx.currentTime);

    // LFO to slowly modulate filter cutoff to create dynamic ambient swelling
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // very slow oscillation (8s period)

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(35, audioCtx.currentTime); // modulate filter by +/- 35Hz

    // Connect LFO to filter frequency
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Mix oscillators and run through filter and output
    const subGain = audioCtx.createGain();
    subGain.gain.setValueAtTime(0.7, audioCtx.currentTime);

    const midGain = audioCtx.createGain();
    midGain.gain.setValueAtTime(0.2, audioCtx.currentTime); // lower volume saw to avoid harshness

    oscillator1.connect(subGain);
    oscillator2.connect(midGain);

    subGain.connect(filter);
    midGain.connect(filter);
    
    filter.connect(mainGainNode);
    mainGainNode.connect(audioCtx.destination);

    // Start oscillators
    oscillator1.start();
    oscillator2.start();
    lfo.start();
  };

  const toggleSound = () => {
    if (!audioCtx) {
      initAudio();
    }

    // Resume context if suspended (browser security block)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!soundEnabled) {
      // Fade in drone
      mainGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      mainGainNode.gain.setValueAtTime(mainGainNode.gain.value, audioCtx.currentTime);
      mainGainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.5); // soft rumble level
      
      soundOnIcon.classList.remove('hidden');
      soundOffIcon.classList.add('hidden');
      soundToggleBtn.style.borderColor = 'var(--accent-orange)';
      soundEnabled = true;
    } else {
      // Fade out drone
      mainGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      mainGainNode.gain.setValueAtTime(mainGainNode.gain.value, audioCtx.currentTime);
      mainGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
      
      soundOnIcon.classList.add('hidden');
      soundOffIcon.classList.remove('hidden');
      soundToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      soundEnabled = false;
    }
  };

  soundToggleBtn.addEventListener('click', toggleSound);

  // ==========================================
  // 6. PROXIMITY AUDIO MODULATION ("DARE TO TOUCH")
  // ==========================================
  window.addEventListener('auroze-proximity', (e) => {
    if (!audioCtx || audioCtx.state === 'suspended' || !soundEnabled) return;
    
    const hovering = e.detail.hovering;
    const now = audioCtx.currentTime;

    if (hovering) {
      // Swell filter frequency & pitch up the oscillators slightly
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.setValueAtTime(filter.frequency.value, now);
      filter.frequency.linearRampToValueAtTime(320, now + 0.3); // open filter slightly

      oscillator1.frequency.cancelScheduledValues(now);
      oscillator1.frequency.setValueAtTime(oscillator1.frequency.value, now);
      oscillator1.frequency.linearRampToValueAtTime(57.5, now + 0.4); // A#1 pitch bend

      oscillator2.frequency.cancelScheduledValues(now);
      oscillator2.frequency.setValueAtTime(oscillator2.frequency.value, now);
      oscillator2.frequency.linearRampToValueAtTime(115.5, now + 0.4);
    } else {
      // Return to baseline low drone
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.setValueAtTime(filter.frequency.value, now);
      filter.frequency.linearRampToValueAtTime(110, now + 0.6);

      oscillator1.frequency.cancelScheduledValues(now);
      oscillator1.frequency.setValueAtTime(oscillator1.frequency.value, now);
      oscillator1.frequency.linearRampToValueAtTime(55, now + 0.6);

      oscillator2.frequency.cancelScheduledValues(now);
      oscillator2.frequency.setValueAtTime(oscillator2.frequency.value, now);
      oscillator2.frequency.linearRampToValueAtTime(110.5, now + 0.6);
    }
  });

  // ==========================================
  // 7. INTERACTIVE LOGO HOVER SPARK EFFECT
  // ==========================================
  const sparksCanvas = document.getElementById('logo-sparks-canvas');
  const sparksCtx = sparksCanvas.getContext('2d');
  let logoSparks = [];
  const maxLogoSparks = 50;

  sparksCanvas.width = 100;
  sparksCanvas.height = 100;

  const addLogoSpark = (x, y) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (logoSparks.length < maxLogoSparks) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.0 + 0.8;
      logoSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.03,
        size: Math.random() * 2.0 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(255, 95, 0, ' : 'rgba(255, 255, 255, '
      });
    }
  };

  const updateLogoSparks = () => {
    sparksCtx.clearRect(0, 0, 100, 100);
    
    for (let i = logoSparks.length - 1; i >= 0; i--) {
      const spark = logoSparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.03; // gravity
      spark.life -= spark.decay;

      if (spark.life <= 0) {
        logoSparks.splice(i, 1);
      } else {
        sparksCtx.fillStyle = spark.color + spark.life + ')';
        sparksCtx.beginPath();
        sparksCtx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
        sparksCtx.fill();
      }
    }
    requestAnimationFrame(updateLogoSparks);
  };

  updateLogoSparks();

  const logoContainer = document.querySelector('.logo');
  logoContainer.addEventListener('mousemove', (e) => {
    const rect = sparksCanvas.getBoundingClientRect();
    const mX = ((e.clientX - rect.left) / rect.width) * 100;
    const mY = ((e.clientY - rect.top) / rect.height) * 100;
    
    for (let i = 0; i < 2; i++) {
      addLogoSpark(mX, mY);
    }
  });

  logoContainer.addEventListener('mouseenter', () => {
    for (let i = 0; i < 12; i++) {
      addLogoSpark(50, 50);
    }
  });

  // ==========================================
  // 8. SCROLL EFFECTS: CENTERPIECE FADE
  // ==========================================
  const centerpieceLogo = document.querySelector('.centerpiece-logo-wrapper');
  const heroContent = document.querySelector('.hero-content');
  const aboutSection = document.querySelector('.about-section');

  const handleScrollEffects = () => {
    const scrollY = window.scrollY;
    const viewHeight = window.innerHeight;

    if (centerpieceLogo || heroContent) {
      const fadeProgress = Math.max(0, Math.min(1, scrollY / (viewHeight * 0.5)));
      const opacity = 1 - fadeProgress;

      if (centerpieceLogo) {
        centerpieceLogo.style.opacity = opacity;
        if (opacity <= 0.01) {
          centerpieceLogo.style.pointerEvents = 'none';
          centerpieceLogo.style.visibility = 'hidden';
        } else {
          centerpieceLogo.style.pointerEvents = 'auto';
          centerpieceLogo.style.visibility = 'visible';
        }
      }

      if (heroContent) {
        heroContent.style.opacity = opacity;
      }
    }
  };

  // 9. ABOUT SECTION — PREMIUM GSAP SCROLL ANIMATIONS
  gsap.registerPlugin(ScrollTrigger);

  const initSloganMagicHover = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sloganLines = gsap.utils.toArray('.slogan-line');
    if (!sloganLines.length) return;

    const scramblePool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const canAnimate = !prefersReducedMotion && window.innerWidth > 768;

    sloganLines.forEach((line) => {
      const textEl = line.querySelector('.slogan-text');
      if (!textEl) return;

      const originalText = textEl.textContent.trim();
      textEl.textContent = '';
      const charSpans = [];

      originalText.split('').forEach((char) => {
        const span = document.createElement('span');
        span.className = 'slogan-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        textEl.appendChild(span);
        charSpans.push(span);
      });

      if (!canAnimate) return;

      let scrambleTween = null;

      const setScrambleChars = (originals) => {
        charSpans.forEach((span, index) => {
          if (!originals[index].trim()) return;
          span.textContent = scramblePool[Math.floor(Math.random() * scramblePool.length)];
        });
      };

      line.addEventListener('mouseenter', () => {
        if (line.classList.contains('is-scrambling')) return;
        if (scrambleTween) scrambleTween.kill();

        const originals = charSpans.map((span) => span.textContent);
        line.classList.add('is-scrambling');

        scrambleTween = gsap.timeline({
          onComplete: () => {
            line.classList.remove('is-scrambling');
            charSpans.forEach((span, index) => {
              span.textContent = originals[index];
            });
            gsap.set(charSpans, { clearProps: 'transform,opacity' });
          }
        });

        scrambleTween
          .to(charSpans, {
            duration: 0.2,
            x: () => gsap.utils.random(-12, 12),
            y: () => gsap.utils.random(-10, 8),
            rotation: () => gsap.utils.random(-12, 12),
            opacity: 0.48,
            stagger: { each: 0.01, from: 'random' },
            ease: 'sine.inOut',
            onStart: () => setScrambleChars(originals)
          })
          .to(charSpans, {
            duration: 0.16,
            opacity: 0.62,
            stagger: { each: 0.008, from: 'random' },
            ease: 'sine.inOut',
            onStart: () => setScrambleChars(originals)
          }, '-=0.1')
          .add('reassemble')
          .call(() => {
            charSpans.forEach((span, index) => {
              span.textContent = originals[index];
            });
          }, null, 'reassemble')
          .to(charSpans, {
            duration: 0.6,
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            stagger: { each: 0.014, from: 'random' },
            ease: 'power3.out'
          }, 'reassemble');
      });
    });
  };

  const initAboutAnimations = () => {
    if (!aboutSection) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollWords = gsap.utils.toArray('.scroll-word');
    const sloganLines = gsap.utils.toArray('.slogan-line');
    const aboutEyebrow = document.querySelector('.about-eyebrow');
    const aboutGlow = document.querySelector('.about-glow-blob');
    const aboutDecor = document.querySelector('.about-decorations');
    const aboutDivider = document.querySelector('.about-divider');
    const dividerPlus = document.querySelector('.divider-plus');
    const missionParagraph = document.querySelector('.mission-paragraph');
    const ctaAbout = document.querySelector('.cta-about-more');

    const aboutBackdrop = document.querySelector('.about-backdrop');
    const aboutVideoBg = document.querySelector('.about-video-bg');
    const aboutBgVideo = document.querySelector('.about-bg-video');
    const aboutRail = document.querySelector('.about-statement-rail');
    const aboutBreak = document.querySelector('.about-statement-break');
    const aboutInfoPanel = document.querySelector('.about-info-panel');
    const aboutPanelReveals = gsap.utils.toArray('.about-panel-reveal');
    const leadLines = gsap.utils.toArray('.statement-line.is-lead');
    const bodyLines = gsap.utils.toArray('.statement-line.is-body');
    const isMobile = window.innerWidth <= 768;
    const mobileDividerWidth = 'calc(100% - 24px)';

    if (prefersReducedMotion) {
      gsap.set([aboutEyebrow, aboutGlow, aboutDecor, ...scrollWords, ...sloganLines, missionParagraph, ctaAbout, ...aboutPanelReveals], {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1
      });
      if (aboutInfoPanel) gsap.set(aboutInfoPanel, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' });
      if (aboutRail) gsap.set(aboutRail, { scaleY: 1, opacity: 1 });
      if (aboutBreak) gsap.set(aboutBreak, { scaleX: 1, opacity: 1 });
      if (aboutDivider) gsap.set(aboutDivider, { width: isMobile ? mobileDividerWidth : 'calc(100% - 80px)' });
      if (dividerPlus) gsap.set(dividerPlus, { scale: 1 });
      if (aboutBackdrop && isMobile) gsap.set(aboutBackdrop, { display: 'none' });
      if (aboutDecor && isMobile) gsap.set(aboutDecor, { display: 'none' });
      if (aboutVideoBg) gsap.set(aboutVideoBg, { opacity: isMobile ? 0 : 1, display: isMobile ? 'none' : 'block' });
      return;
    }

    if (aboutVideoBg) {
      if (isMobile) {
        gsap.set(aboutVideoBg, { display: 'none', opacity: 0 });
        if (aboutBgVideo) aboutBgVideo.pause();
      } else {
        gsap.set(aboutVideoBg, { display: 'block', opacity: 1 });
      }
    }
    if (aboutBackdrop && isMobile) gsap.set(aboutBackdrop, { display: 'none' });
    if (aboutDecor && isMobile) gsap.set(aboutDecor, { display: 'none' });
    if (aboutInfoPanel) {
      gsap.set(aboutInfoPanel, isMobile
        ? { opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }
        : { opacity: 0, y: 24, scale: 0.97, force3D: true });
    }
    if (aboutRail && !isMobile) gsap.set(aboutRail, { scaleY: 0, opacity: 0, transformOrigin: 'top center' });
    if (aboutBreak && !isMobile) gsap.set(aboutBreak, { scaleX: 0, opacity: 0, transformOrigin: 'left center' });

    // Everything hidden on enter
    gsap.set(aboutEyebrow, { opacity: 0, y: isMobile ? -8 : -12 });
    if (!isMobile) gsap.set(aboutGlow, { opacity: 0, scale: 1 });
    if (!isMobile) gsap.set(aboutDecor, { opacity: 0 });
    gsap.set(scrollWords, isMobile
      ? { opacity: 0, y: 12, filter: 'blur(4px)', scale: 0.99 }
      : { opacity: 0, y: 24, scale: 0.97, force3D: true });
    gsap.set(sloganLines, isMobile
      ? { opacity: 0, y: 10 }
      : { opacity: 0, y: 24, force3D: true });
    gsap.set(missionParagraph, isMobile
      ? { opacity: 0, y: 10 }
      : { opacity: 0, y: 24, force3D: true });
    gsap.set(ctaAbout, isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 24 });
    gsap.set(aboutPanelReveals, { opacity: 0, y: 20 });
    if (aboutDivider) gsap.set(aboutDivider, { width: 0 });
    if (dividerPlus) gsap.set(dividerPlus, { scale: 0, y: isMobile ? 0 : -1 });

    const lockAboutEnterState = () => {
      if (aboutVideoBg) {
        if (isMobile) {
          gsap.set(aboutVideoBg, { display: 'none', opacity: 0 });
          if (aboutBgVideo) aboutBgVideo.pause();
        } else {
          gsap.set(aboutVideoBg, { display: 'block', opacity: 1 });
        }
      }
      if (aboutBackdrop && isMobile) gsap.set(aboutBackdrop, { display: 'none' });
      if (aboutDecor && isMobile) gsap.set(aboutDecor, { display: 'none' });
      gsap.set(aboutEyebrow, { opacity: 0, y: isMobile ? -8 : -12 });
      if (aboutRail && !isMobile) gsap.set(aboutRail, { scaleY: 0, opacity: 0 });
      if (aboutBreak && !isMobile) gsap.set(aboutBreak, { scaleX: 0, opacity: 0 });
      gsap.set(scrollWords, isMobile
        ? { opacity: 0, y: 12, filter: 'blur(4px)', scale: 0.99 }
        : { opacity: 0, y: 24, scale: 0.97, force3D: true });
      if (aboutInfoPanel) {
        gsap.set(aboutInfoPanel, isMobile
          ? { opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }
          : { opacity: 0, y: 24, scale: 0.97, force3D: true });
      }
      gsap.set(aboutPanelReveals, { opacity: 0, y: 20 });
      if (aboutDivider) gsap.set(aboutDivider, { width: 0 });
      if (dividerPlus) gsap.set(dividerPlus, { scale: 0, y: isMobile ? 0 : -1 });
      gsap.set(sloganLines, isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 24, force3D: true });
      gsap.set(missionParagraph, isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 24, force3D: true });
      gsap.set(ctaAbout, isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 24 });
      if (!isMobile) gsap.set(aboutGlow, { opacity: 0 });
    };

    const lockAboutExitState = () => {
      gsap.set(aboutEyebrow, { opacity: 0, y: isMobile ? -8 : -12 });
      if (aboutRail && !isMobile) gsap.set(aboutRail, { scaleY: 0, opacity: 0 });
      if (aboutBreak && !isMobile) gsap.set(aboutBreak, { scaleX: 0, opacity: 0 });
      gsap.set(scrollWords, isMobile
        ? { opacity: 0, y: -10, filter: 'blur(4px)', scale: 0.99 }
        : { opacity: 0, y: -18, scale: 0.97, force3D: true });
      if (aboutInfoPanel) {
        gsap.set(aboutInfoPanel, isMobile
          ? { opacity: 0, y: -24, scale: 0.97, filter: 'blur(8px)' }
          : { opacity: 0, y: -20, scale: 0.98, force3D: true });
      }
      gsap.set(aboutPanelReveals, { opacity: 0, y: -16 });
      if (aboutDivider) gsap.set(aboutDivider, { width: 0 });
      if (dividerPlus) gsap.set(dividerPlus, { scale: 0, opacity: 0 });
      gsap.set(sloganLines, isMobile ? { opacity: 0, y: 8 } : { opacity: 0, y: 20, force3D: true });
      gsap.set(missionParagraph, isMobile ? { opacity: 0, y: 8 } : { opacity: 0, y: 20, force3D: true });
      gsap.set(ctaAbout, isMobile ? { opacity: 0, y: 8 } : { opacity: 0, y: 24 });
      if (!isMobile) gsap.set(aboutGlow, { opacity: 0 });
      if (aboutBackdrop && isMobile) gsap.set(aboutBackdrop, { display: 'none' });
      if (aboutDecor && isMobile) gsap.set(aboutDecor, { display: 'none' });
      if (aboutVideoBg && !isMobile) gsap.set(aboutVideoBg, { opacity: 1 });
    };

    const scrollLength = isMobile ? '+=300%' : '+=340%';
    const scrubAmount = isMobile ? 0.52 : 1.35;
    const revealAt = isMobile
      ? { divider: 1.12, slogans: 1.34, mission: 1.52, cta: 1.68, hold: 2.1, end: 3.5 }
      : { video: 0, slogans: 1.72, mission: 2.0, cta: 2.22, hold: 2.6, end: 4.2 };
    const exitAt = isMobile
      ? { bottom: 2.28, divider: 2.62, words: 2.78, eyebrow: 2.95, end: 3.5 }
      : { bottom: 2.98, body: 3.38, brk: 3.72, lead: 3.76, rail: 4.02, eyebrow: 4.06, glow: 4.02, end: 4.2 };

    if (!isMobile) {
      gsap.ticker.lagSmoothing(500, 33);
    }

    const playAboutVideo = () => {
      if (!aboutBgVideo || isMobile) return;
      aboutBgVideo.muted = true;
      aboutBgVideo.defaultMuted = true;
      const playPromise = aboutBgVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    const pinAboutVideoBg = () => {
      if (isMobile || !aboutVideoBg || !aboutSection) return;
      if (aboutVideoBg.parentElement !== document.body) {
        document.body.appendChild(aboutVideoBg);
      }
      aboutVideoBg.classList.add('is-viewport-fixed');
      gsap.set(aboutVideoBg, { opacity: 1, display: 'block', clearProps: 'transform,x,y,scale' });
      if (aboutBgVideo) gsap.set(aboutBgVideo, { clearProps: 'transform,x,y,scale' });
      playAboutVideo();
    };

    const unpinAboutVideoBg = () => {
      if (isMobile || !aboutVideoBg || !aboutSection) return;
      aboutVideoBg.classList.remove('is-viewport-fixed');
      if (aboutVideoBg.parentElement !== aboutSection) {
        aboutSection.insertBefore(aboutVideoBg, aboutSection.firstChild);
      }
      gsap.set(aboutVideoBg, { opacity: 1, display: 'block' });
    };

    if (!isMobile) {
      playAboutVideo();
    }

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top top',
        end: scrollLength,
        pin: true,
        pinType: 'fixed',
        scrub: scrubAmount,
        anticipatePin: 0,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (!isMobile) {
            aboutSection.classList.add('is-about-active');
            pinAboutVideoBg();
          }
          playAboutVideo();
        },
        onEnterBack: () => {
          if (!isMobile) {
            aboutSection.classList.add('is-about-active');
            pinAboutVideoBg();
          }
          playAboutVideo();
        },
        onLeave: () => {
          if (!isMobile) {
            aboutSection.classList.remove('is-about-active');
            unpinAboutVideoBg();
          }
          if (isMobile) lockAboutExitState();
        },
        onLeaveBack: () => {
          if (!isMobile) {
            aboutSection.classList.remove('is-about-active');
            unpinAboutVideoBg();
          }
          if (isMobile) lockAboutEnterState();
        }
      }
    });

    if (!isMobile && aboutTl.scrollTrigger?.isActive) {
      aboutSection.classList.add('is-about-active');
      pinAboutVideoBg();
    }

    // Phase 0 — settle
    aboutTl.to({}, { duration: isMobile ? 0.16 : 0.34 }, 0);

    // Phase 1 — eyebrow + headline
    aboutTl
      .to(aboutEyebrow, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, isMobile ? 0.24 : 0.36);

    if (aboutRail && !isMobile) {
      aboutTl.to(aboutRail, { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.42);
    }

    if (isMobile) {
      aboutTl.to(scrollWords, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.5,
        stagger: 0.018,
        ease: 'power3.out'
      }, 0.28);
    } else {
      leadLines.forEach((line, index) => {
        const words = line.querySelectorAll('.scroll-word');
        aboutTl.to(words, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.06,
          ease: 'power3.out',
          force3D: true
        }, 0.48 + index * 0.16);
      });
    }

    if (aboutBreak && !isMobile) {
      aboutTl.to(aboutBreak, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.82);
    }

    if (!isMobile) {
      bodyLines.forEach((line, index) => {
        const words = line.querySelectorAll('.scroll-word');
        aboutTl.to(words, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          force3D: true
        }, 0.9 + index * 0.13);
      });
    }

    // Mobile — divider after headline
    if (isMobile && aboutDivider) {
      aboutTl.to(aboutDivider, {
        width: mobileDividerWidth,
        duration: 0.65,
        ease: 'power2.inOut'
      }, revealAt.divider);
    }

    if (isMobile && dividerPlus) {
      aboutTl.to(dividerPlus, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.6)'
      }, revealAt.divider + 0.18);
    }

    // Phase 2 — right info panel (desktop only)
    if (!isMobile && aboutInfoPanel) {
      aboutTl.to(aboutInfoPanel, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      }, 0.98);
    }

    if (!isMobile && aboutPanelReveals.length) {
      aboutTl.to(aboutPanelReveals, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power3.out'
      }, 1.1);
    }

    // Phase 3 — divider (desktop only)
    if (!isMobile && aboutDivider) {
      aboutTl.to(aboutDivider, {
        width: 'calc(100% - 80px)',
        duration: 0.75,
        ease: 'power2.inOut'
      }, 1.58);
    }

    if (!isMobile && dividerPlus) {
      aboutTl.to(dividerPlus, {
        scale: 1,
        y: -1,
        duration: 0.5,
        ease: 'back.out(1.6)'
      }, 1.88);
    }

    // Phase 4 — bottom content
    if (isMobile) {
      aboutTl
        .to(sloganLines, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out'
        }, revealAt.slogans)
        .to(missionParagraph, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out'
        }, revealAt.mission)
        .to(ctaAbout, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out'
        }, revealAt.cta);
    } else {
      aboutTl
        .to(sloganLines, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true
        }, revealAt.slogans)
        .to(missionParagraph, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          force3D: true
        }, revealAt.mission)
        .to(ctaAbout, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out'
        }, revealAt.cta);
    }

    // Glow blob skipped on desktop — large blur filter causes scroll jank

    // Phase 5 — hold full layout
    aboutTl.to({}, { duration: 0.35 }, revealAt.hold);

    // Phase 6 — exit: mirror reveal order
    if (isMobile) {
      aboutTl
        .to(sloganLines, {
          opacity: 0,
          y: 8,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.in'
        }, exitAt.bottom)
        .to(missionParagraph, {
          opacity: 0,
          y: 8,
          duration: 0.38,
          ease: 'power2.in'
        }, exitAt.bottom + 0.07)
        .to(ctaAbout, {
          opacity: 0,
          y: 8,
          duration: 0.35,
          ease: 'power2.in'
        }, exitAt.bottom + 0.12);
    } else {
      aboutTl
        .to(sloganLines, {
          opacity: 0,
          y: 28,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power2.in',
          force3D: true
        }, exitAt.bottom)
        .to(missionParagraph, {
          opacity: 0,
          y: 28,
          duration: 0.5,
          ease: 'power2.in',
          force3D: true
        }, exitAt.bottom + 0.1)
        .to(ctaAbout, {
          opacity: 0,
          y: 24,
          duration: 0.45,
          ease: 'power2.in'
        }, exitAt.bottom + 0.16);
    }

    if (isMobile && dividerPlus) {
      aboutTl.to(dividerPlus, {
        scale: 0,
        opacity: 0,
        duration: 0.38,
        ease: 'power2.in'
      }, exitAt.divider);
    }

    if (isMobile && aboutDivider) {
      aboutTl.to(aboutDivider, {
        width: 0,
        duration: 0.55,
        ease: 'power2.in'
      }, exitAt.divider + 0.06);
    }

    if (!isMobile && dividerPlus) {
      aboutTl.to(dividerPlus, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, exitAt.bottom + 0.2);
    }

    if (!isMobile && aboutDivider) {
      aboutTl.to(aboutDivider, {
        width: 0,
        duration: 0.6,
        ease: 'power2.in'
      }, exitAt.bottom + 0.22);
    }

    if (!isMobile && aboutPanelReveals.length) {
      aboutTl.to(aboutPanelReveals, {
        opacity: 0,
        y: -18,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.in'
      }, exitAt.bottom + 0.3);
    }

    if (!isMobile && aboutInfoPanel) {
      aboutTl.to(aboutInfoPanel, {
        opacity: 0,
        y: -24,
        scale: 0.97,
        duration: 0.65,
        ease: 'power2.in',
        force3D: true
      }, exitAt.bottom + 0.34);
    }

    if (isMobile) {
      aboutTl.to(scrollWords, {
        opacity: 0,
        y: -10,
        filter: 'blur(4px)',
        scale: 0.99,
        duration: 0.38,
        stagger: 0.012,
        ease: 'power2.in'
      }, exitAt.words);
    } else {
      [...bodyLines].reverse().forEach((line, index) => {
        const words = line.querySelectorAll('.scroll-word');
        aboutTl.to(words, {
          opacity: 0,
          y: -22,
          scale: 0.96,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.in',
          force3D: true
        }, exitAt.body + index * 0.1);
      });
    }

    if (aboutBreak && !isMobile) {
      aboutTl.to(aboutBreak, { scaleX: 0, opacity: 0, duration: 0.35, ease: 'power2.in' }, exitAt.brk);
    }

    if (!isMobile) {
      [...leadLines].reverse().forEach((line, index) => {
        const words = line.querySelectorAll('.scroll-word');
        aboutTl.to(words, {
          opacity: 0,
          y: -22,
          scale: 0.96,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.in',
          force3D: true
        }, exitAt.lead + index * 0.12);
      });
    }

    if (aboutRail && !isMobile) {
      aboutTl.to(aboutRail, { scaleY: 0, opacity: 0, duration: 0.45, ease: 'power2.in' }, exitAt.rail);
    }

    aboutTl
      .to(aboutEyebrow, {
        opacity: 0,
        y: isMobile ? -8 : -12,
        duration: 0.38,
        ease: 'power2.in'
      }, exitAt.eyebrow);

    // Video mouse parallax disabled — scaling during pin caused repaint jank

    aboutTl.to({}, { duration: 0.3 }, revealAt.end);
  };

  initAboutAnimations();
  initSloganMagicHover();

  // ==========================================
  // 10. KEY FACTS PINNED DECK SCROLL ANIMATION
  // ==========================================

  const factsSection = document.querySelector('.key-facts-section');
  const cards = gsap.utils.toArray('.key-fact-card');

  if (factsSection && cards.length > 0) {
    const isMobile = window.innerWidth <= 900;
    const offsetX = isMobile ? 6 : 10;
    const offsetY = isMobile ? 10 : 15;

    // Set initial card deck layout (staggered offset and layered z-indexes)
    gsap.set(cards, {
      x: (i) => i * offsetX,
      y: (i) => i * offsetY,
      scale: (i) => 1 - i * 0.04,
      transformOrigin: 'center bottom',
      zIndex: (i) => cards.length - i
    });

    // Create GSAP ScrollTrigger timeline to pin and animate cards
    const tl = gsap.timeline({
      smoothChildTiming: true,
      scrollTrigger: {
        trigger: '.key-facts-section',
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1.2,
        fastScrollEnd: true,
        anticipatePin: 0,
        invalidateOnRefresh: true
      }
    });

    // Animate cards swipe out and background cards scaling up
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        // Swipe current card out to the top-left with rotation and fade
        tl.to(card, {
          y: '-135%',
          x: `-=${isMobile ? 15 : 25}`,
          rotation: -12,
          opacity: 0,
          scale: 0.9,
          ease: 'power2.inOut',
          duration: 1
        }, index);

        // Bring subsequent cards forward in the stack hierarchy
        for (let i = index + 1; i < cards.length; i++) {
          const relIdx = i - index - 1;
          tl.to(cards[i], {
            x: relIdx * offsetX,
            y: relIdx * offsetY,
            scale: 1 - relIdx * 0.04,
            ease: 'power2.inOut',
            duration: 1
          }, index);
        }
      }
    });

    // Animate progress line scaling from 20% to 100%
    tl.to('.pag-progress-fill', {
      scaleX: 1.0,
      ease: 'none',
      duration: cards.length - 1
    }, 0);

    // Animate pagination slider ticker to slide up numbers
    tl.to('.pag-num-slider', {
      yPercent: -80, // Slide up by 80% to show the last index "05"
      ease: 'none',
      duration: cards.length - 1
    }, 0);
  }

  // ==========================================
  // 11. CARD MICRO-INTERACTIONS (FLIPS & CYCLES)
  // ==========================================
  // Card 3: 3D Flip every 3.5 seconds
  const card3Inner = document.querySelector('.card-3-inner');
  if (card3Inner) {
    setInterval(() => {
      card3Inner.classList.toggle('flipped');
    }, 3500);
  }

  // Card 4: Cross-fade team members
  const teamImages = document.querySelectorAll('.team-slide-img');
  let currentTeamIdx = 0;
  if (teamImages.length > 0) {
    setInterval(() => {
      teamImages[currentTeamIdx].classList.remove('active');
      currentTeamIdx = (currentTeamIdx + 1) % teamImages.length;
      teamImages[currentTeamIdx].classList.add('active');
    }, 2800);
  }

  // ==========================================
  // 12. SELECTED WORK THEME FLIP & HORIZONTAL SCROLL
  // ==========================================
  const workSection = document.querySelector('.selected-work-section');
  const horizontalTrack = document.querySelector('.work-horizontal-track');

  if (workSection && horizontalTrack) {
    // 12a. Toggle Light Theme active state on body
    ScrollTrigger.create({
      trigger: '.selected-work-section',
      start: 'top 50%',
      end: 'bottom 50%',
      toggleClass: { targets: 'body', className: 'light-theme-active' },
      invalidateOnRefresh: true
    });

    // 12b. GSAP MatchMedia to handle Desktop horizontal scroll pin
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      // Horizontal slide animation translating the track left
      const horizontalScrollTween = gsap.to(horizontalTrack, {
        x: () => -(horizontalTrack.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '.selected-work-section',
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true
        }
      });

      // Card scaling transitions on entry (linked to containerAnimation)
      const projectCards = gsap.utils.toArray('.project-slide .project-card');
      projectCards.forEach((card) => {
        gsap.fromTo(card,
          { scale: 0.94, opacity: 0.75 },
          {
            scale: 1.0,
            opacity: 1.0,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScrollTween,
              start: 'left 95%',
              end: 'left 50%',
              scrub: true
            }
          }
        );
      });

      // Cleanup function when resizing below 901px
      return () => {
        gsap.set(horizontalTrack, { x: 0 });
      };
    });
  }

  // ==========================================
  // 13. OUR SERVICES PINNED TRANSITION & 3D ROTATION
  // ==========================================
  const servicesSection = document.querySelector('.services-section');
  if (servicesSection) {
    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-section',
        pin: true,
        start: 'top top',
        end: '+=250%', // scroll duration
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Dynamic theme toggle on scroll
          if (self.progress > 0.4) {
            document.body.classList.remove('light-theme-active');
          } else {
            // Restore light theme when scrolling back up to Selected Work
            document.body.classList.add('light-theme-active');
          }
        }
      }
    });

    // Darken background overlay
    servicesTl.to('.services-dark-overlay', {
      opacity: 1,
      duration: 1
    }, 0);

    // Fade and scale poster state
    servicesTl.to('.services-poster', {
      opacity: 0,
      scale: 0.9,
      duration: 1
    }, 0);

    // Fade and scale centerpiece in
    servicesTl.fromTo('.services-centerpiece', {
      opacity: 0,
      scale: 0.75
    }, {
      opacity: 1,
      scale: 1,
      duration: 1.2
    }, 0.5);

    // Parallax drift letter fragments
    servicesTl.to('.floating-glyph', {
      x: (i) => (i % 2 === 0 ? 60 : -60),
      y: (i) => (i % 2 === 0 ? -50 : 50),
      duration: 1.5
    }, 0.5);

    // Emerging letter rises from bottom
    servicesTl.fromTo('.emerging-letter', {
      bottom: '-150px',
      color: 'rgba(255, 255, 255, 0.0)'
    }, {
      bottom: '-30px',
      color: 'rgba(255, 255, 255, 0.015)',
      duration: 1.5
    }, 0.8);

    // Fade tagline and CTA in
    servicesTl.to('.services-tagline', {
      opacity: 1,
      duration: 0.8
    }, 1.6);
    servicesTl.to('.cta-services-footer', {
      opacity: 1,
      duration: 0.8
    }, 1.6);

    // ==========================================
    // 14. VENETIAN SHUTTER TRANSITION WIPE
    // ==========================================
    // Slide transition bars in (covering viewport)
    servicesTl.to('.shutter-bar', {
      scaleX: 1,
      stagger: 0.08,
      ease: 'power1.inOut',
      duration: 0.8
    }, 2.0);

    // Toggle body theme to light while covered
    servicesTl.call(() => {
      document.body.classList.add('light-theme-active');
    }, null, 2.8);

    // Slide bars out to reveal next section
    servicesTl.to('.shutter-bar', {
      scaleX: 0,
      stagger: 0.08,
      ease: 'power1.inOut',
      duration: 0.8
    }, 2.8);
  }

  // ==========================================
  // 15. CLIENT STORIES TESTIMONIALS & MASONRY PARALLAX
  // ==========================================
  // Fade and slide testimonials in
  const testimonialCards = gsap.utils.toArray('.testimonial-card');
  testimonialCards.forEach((card) => {
    gsap.fromTo(card,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 65%',
          scrub: true
        }
      }
    );
  });

  // Masonry Dribbble cards scroll parallax translations
  const explorationsCollage = document.querySelector('.explorations-collage');
  if (explorationsCollage) {
    gsap.fromTo('.card-sketches', 
      { y: 50 }, 
      {
        y: -50,
        scrollTrigger: {
          trigger: '.explorations-collage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    gsap.fromTo('.card-mockup', 
      { y: 100 }, 
      {
        y: -20,
        scrollTrigger: {
          trigger: '.explorations-collage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    gsap.fromTo('.card-swank', 
      { y: 30 }, 
      {
        y: -70,
        scrollTrigger: {
          trigger: '.explorations-collage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // ==========================================
  // 16. INTERACTIVE FOOTER MUSIC LINES
  // ==========================================
  const initFooterCanvas = () => {
    const canvas = document.getElementById('footer-lines-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth <= 900;
    
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Offscreen canvas to render text shapes and sample pixels
    const offscreen = document.createElement('canvas');
    const oCtx = offscreen.getContext('2d');

    const renderTextToOffscreen = () => {
      offscreen.width = width;
      offscreen.height = height;

      oCtx.fillStyle = '#000000';
      oCtx.fillRect(0, 0, width, height);

      // Scale font based on canvas width
      const fontSize = Math.min(width * 0.17, height * 0.95);
      oCtx.font = `900 ${fontSize}px Outfit, sans-serif`;
      oCtx.fillStyle = '#ffffff';
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillText('AUROZE', width / 2, height / 2);
    };

    renderTextToOffscreen();

    window.addEventListener('resize', () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      renderTextToOffscreen();
    });

    let mouseX = -1000;
    let mouseY = -1000;
    let isHovered = false;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovered = true;

      // Play synthesized audio notes on hover
      triggerFooterSynth(mouseX, mouseY);
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
      isHovered = false;
    });

    // Custom Web Audio API Synthesizer
    let synthCtx = null;
    let synthGain = null;
    
    const pentatonicScale = [
      110.00, // A2
      123.47, // B2
      138.59, // C#3
      164.81, // E3
      196.00, // F#3
      220.00, // A3
      246.94, // B3
      277.18, // C#4
      329.63, // E4
      392.00, // F#4
      440.00  // A4
    ];

    const initSynth = () => {
      synthCtx = new (window.AudioContext || window.webkitAudioContext)();
      synthGain = synthCtx.createGain();
      synthGain.gain.setValueAtTime(0, synthCtx.currentTime);

      const filter = synthCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, synthCtx.currentTime);

      synthGain.connect(filter);
      filter.connect(synthCtx.destination);
    };

    let lastNoteTime = 0;
    const triggerFooterSynth = (mX, mY) => {
      // Check if global sound is enabled (by checking sound button border color)
      const soundBtn = document.querySelector('.sound-toggle');
      const isSoundEnabled = soundBtn && soundBtn.style.borderColor.includes('255, 95, 0');
      if (!isSoundEnabled) return;

      if (!synthCtx) {
        initSynth();
      }

      if (synthCtx.state === 'suspended') {
        synthCtx.resume();
      }

      const now = synthCtx.currentTime;
      // Limit synth notes trigger frequency (throttling)
      if (now - lastNoteTime < 0.15) return;
      lastNoteTime = now;

      // Map horizontal cursor position to pentatonic scale note
      const colIdx = Math.floor((mX / width) * pentatonicScale.length);
      const freq = pentatonicScale[Math.max(0, Math.min(colIdx, pentatonicScale.length - 1))];

      // Create FM (Frequency Modulation) Synthesis
      const carrier = synthCtx.createOscillator();
      const modulator = synthCtx.createOscillator();
      const modGain = synthCtx.createGain();
      const voiceGain = synthCtx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, now);

      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(freq * 1.5, now); // FM harmonic ratio
      modGain.gain.setValueAtTime(freq * 0.7, now); // modulation index

      voiceGain.gain.setValueAtTime(0, now);
      voiceGain.gain.linearRampToValueAtTime(0.12, now + 0.03); // slide in
      voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9); // decay out

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(voiceGain);
      voiceGain.connect(synthGain);

      // Smooth master gain
      synthGain.gain.linearRampToValueAtTime(0.25, now + 0.05);

      carrier.start(now);
      modulator.start(now);

      carrier.stop(now + 1.2);
      modulator.stop(now + 1.2);
    };

    // Render Canvas animation loop
    let tick = 0;
    const drawScanlines = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Get offscreen pixels data
      const imgData = oCtx.getImageData(0, 0, width, height);
      const pixels = imgData.data;

      // Render configuration
      const lineGap = isMobile ? 8 : 6;
      const segmentLen = 4;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;

      tick += 0.035;

      for (let y = lineGap; y < height; y += lineGap) {
        let isDrawingSegment = false;
        let segmentStart = 0;

        for (let x = 0; x < width; x += segmentLen) {
          const pixelIdx = (Math.floor(y) * width + Math.floor(x)) * 4;
          const isWhitePixel = pixels[pixelIdx] > 128; // text pixel

          if (isWhitePixel) {
            if (!isDrawingSegment) {
              isDrawingSegment = true;
              segmentStart = x;
            }
          } else {
            if (isDrawingSegment) {
              isDrawingSegment = false;
              ctx.beginPath();

              const steps = Math.ceil((x - segmentStart) / 4);
              for (let s = 0; s <= steps; s++) {
                const ptX = segmentStart + (s / steps) * (x - segmentStart);
                let ptY = y;

                // Mouse proximity ripple displacement
                const dist = Math.hypot(ptX - mouseX, ptY - mouseY);
                if (dist < 110) {
                  const force = (110 - dist) / 110;
                  ptY += Math.sin(ptX * 0.12 - tick * 14) * 15 * force;
                }

                if (s === 0) {
                   ctx.moveTo(ptX, ptY);
                } else {
                   ctx.lineTo(ptX, ptY);
                }
              }
              ctx.stroke();
            }
          }
        }

        // Draw last segment if it reaches the edge
        if (isDrawingSegment) {
          ctx.beginPath();
          ctx.moveTo(segmentStart, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      requestAnimationFrame(drawScanlines);
    };

    drawScanlines();
  };

  initFooterCanvas();

  // Run scroll handler on scroll, and initially once to lock baseline values
  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();
});

