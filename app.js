import { init3DScene } from './scene3d.js';

document.addEventListener('DOMContentLoaded', () => {
  const IS_MOBILE_PERF = window.innerWidth <= 768;

  // Initialize the 3D WebGL Monolith Scene in the background
  init3DScene();

  // Check for intro skip criteria (prefers-reduced-motion accessibility)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introOverlay = document.getElementById('cinematic-intro');

  if (reducedMotion) {
    if (introOverlay) {
      introOverlay.remove();
    }
  } else {
    playCinematicIntro(introOverlay);
  }

  // ==========================================
  // CENTERPIECE LOGO WOOFER EFFECT (mouse + touch)
  // ==========================================
  const cpWrapper = document.querySelector('.centerpiece-logo-wrapper');
  const cpLogo = document.querySelector('.centerpiece-logo');

  if (cpWrapper && cpLogo && !reducedMotion) {
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
    const ease = 0.064; // smooth liquid easing
    const opacities = [0.6, 0.4, 0.25, 0.12, 0.05];

    let hoverTimeout = null;
    let isBroken = false;
    let isReassembling = false;

    function updateLerpRotation() {
      if (isBroken || isReassembling) {
        animFrameId = requestAnimationFrame(updateLerpRotation);
        return;
      }

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

    // Pointer position — works for mouse hover and touch drag
    const updatePointerPosition = (e) => {
      const rect = cpWrapper.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const midPoint = rect.width / 2;

      const progress = (relativeX / rect.width) * 2 - 1;
      targetProgress = Math.max(-1, Math.min(1, progress));
      isHovered = true;
      cpLogo.classList.add('is-interacting');

      if (!hoverTimeout && !isBroken && !isReassembling) {
        hoverTimeout = setTimeout(() => {
          shatterCenterpieceLogo();
        }, 3000);
      }

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateLerpRotation);
      }

      if (relativeX > midPoint) {
        cpLogo.classList.remove('trail-right');
        cpLogo.classList.add('trail-left');
      } else {
        cpLogo.classList.remove('trail-left');
        cpLogo.classList.add('trail-right');
      }
    };

    const endLogoInteraction = () => {
      isHovered = false;
      cpLogo.classList.remove('trail-left', 'trail-right', 'is-interacting');

      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      if (isBroken) {
        reassembleCenterpieceLogo();
      }
    };

    cpWrapper.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      cpWrapper.setPointerCapture(e.pointerId);
      updatePointerPosition(e);
    });

    cpWrapper.addEventListener('pointermove', (e) => {
      const isMouseHover = e.pointerType === 'mouse' && e.buttons === 0;
      const isActiveTouch = cpWrapper.hasPointerCapture(e.pointerId);
      if (isMouseHover || isActiveTouch) {
        updatePointerPosition(e);
      }
    });

    cpWrapper.addEventListener('pointerup', (e) => {
      if (cpWrapper.hasPointerCapture(e.pointerId)) {
        cpWrapper.releasePointerCapture(e.pointerId);
        endLogoInteraction();
      }
    });

    cpWrapper.addEventListener('pointercancel', (e) => {
      if (cpWrapper.hasPointerCapture(e.pointerId)) {
        cpWrapper.releasePointerCapture(e.pointerId);
        endLogoInteraction();
      }
    });

    cpWrapper.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') {
        endLogoInteraction();
      }
    });

    // Shatters both the logo and the wordmark text into matching color shards
    function shatterCenterpieceLogo() {
      isBroken = true;
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // Hide original centerpiece logo wrapper (.logo-main), all trail outline layers, and wordmark text
      const logoMain = cpLogo.querySelector('.logo-main');
      const trails = cpLogo.querySelectorAll('.logo-trail');
      const wordmark = cpLogo.querySelector('.centerpiece-wordmark');

      gsap.to(logoMain, { opacity: 0, duration: 0.1, overwrite: 'auto' });
      trails.forEach(trail => {
        gsap.to(trail, { opacity: 0, duration: 0.1, overwrite: 'auto' });
      });
      gsap.to(wordmark, { opacity: 0, duration: 0.1, overwrite: 'auto' });

      // Create overlay container for the animated shatter elements
      let shatterContainer = cpLogo.querySelector('.shatter-overlay-container');
      if (shatterContainer) shatterContainer.remove();
      shatterContainer = document.createElement('div');
      shatterContainer.className = 'shatter-overlay-container';
      shatterContainer.style.position = 'absolute';
      shatterContainer.style.inset = '0';
      shatterContainer.style.pointerEvents = 'none';
      shatterContainer.style.overflow = 'visible';
      cpLogo.appendChild(shatterContainer);

      // 1. Create SVG for the 4 exploding logo segments
      const overlaySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      overlaySvg.setAttribute('viewBox', '200 150 630 560');
      overlaySvg.style.position = 'absolute';
      overlaySvg.style.inset = '0';
      overlaySvg.style.pointerEvents = 'none';
      overlaySvg.style.overflow = 'visible';
      shatterContainer.appendChild(overlaySvg);

      // Copy defs (gradients) from centerpiece SVG
      const cpDefs = cpLogo.querySelector('defs');
      if (cpDefs) {
        const clonedDefs = cpDefs.cloneNode(true);
        overlaySvg.appendChild(clonedDefs);
      }

      const paths = [
        { d: "M 494 165 L 210 698 L 348 698 L 370 657 L 283 657 L 283 653 L 497 257 L 567 373 L 617 373 Z", angle: -Math.PI * 0.7 },
        { d: "M 453 400 L 428 447 L 549 447 L 550 449 L 387 698 L 551 699 L 560 685 L 820 688 L 796 646 L 529 644 L 519 658 L 468 658 L 635 400 Z", angle: -Math.PI * 0.3 },
        { d: "M 581 546 L 581 548 L 600 548 L 601 549 L 608 549 L 609 548 L 612 548 L 613 549 L 738 549 L 737 546 L 735 544 L 734 541 L 732 539 L 731 536 L 729 534 L 729 533 L 728 532 L 728 531 L 726 529 L 726 528 L 725 527 L 724 524 L 722 522 L 721 519 L 719 517 L 718 514 L 716 512 L 716 511 L 714 508 L 606 508 L 605 509 L 605 510 L 603 512 L 603 513 L 601 515 L 601 516 L 599 518 L 598 521 L 595 524 L 594 527 L 590 532 L 589 535 L 587 537 L 587 538 L 585 540 L 585 541 Z", angle: Math.PI * 0.3 },
        { d: "M 540 614 L 540 616 L 543 616 L 544 617 L 550 617 L 551 616 L 563 616 L 564 617 L 567 617 L 568 616 L 569 617 L 778 617 L 777 613 L 775 611 L 773 606 L 771 604 L 770 601 L 768 599 L 767 596 L 765 594 L 764 591 L 762 589 L 761 586 L 759 584 L 755 576 L 603 576 L 602 575 L 565 575 L 563 579 L 560 582 L 558 587 L 555 590 L 554 593 L 550 598 L 546 606 Z", angle: Math.PI * 0.7 }
      ];

      paths.forEach((pData) => {
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', pData.d);
        pathEl.setAttribute('fill', 'url(#silver-grad-cp)');
        overlaySvg.appendChild(pathEl);

        const force = 1.8 + Math.random() * 1.5;
        const destX = Math.cos(pData.angle) * 350 * force;
        const destY = Math.sin(pData.angle) * 280 * force + 280; // gravity drop downwards
        const rot = (Math.random() - 0.5) * 540;

        gsap.to(pathEl, {
          x: destX,
          y: destY,
          rotation: rot,
          scale: 0.2,
          opacity: 0,
          duration: 1.4 + Math.random() * 0.3,
          ease: 'power2.out'
        });
      });

      // 2. Create individual exploding letters for the wordmark
      const textContainer = document.createElement('div');
      textContainer.style.position = 'absolute';
      textContainer.style.bottom = '-55px';
      textContainer.style.left = '50%';
      textContainer.style.transform = 'translateX(-50%) translateZ(15px)';
      textContainer.style.fontFamily = 'var(--font-display)';
      textContainer.style.fontWeight = '700';
      textContainer.style.fontSize = '40px';
      textContainer.style.letterSpacing = '5px';
      textContainer.style.color = 'var(--text-white)';
      textContainer.style.whiteSpace = 'nowrap';
      textContainer.style.pointerEvents = 'none';
      shatterContainer.appendChild(textContainer);

      const letters = ['A', 'U', 'R', 'O', 'Z', 'E'];
      const letterSpans = [];
      letters.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        textContainer.appendChild(span);
        letterSpans.push(span);
      });

      const regSpan = document.createElement('span');
      regSpan.textContent = '®';
      regSpan.style.display = 'inline-block';
      regSpan.style.fontSize = '18px';
      regSpan.style.verticalAlign = 'super';
      regSpan.style.marginLeft = '2px';
      regSpan.style.willChange = 'transform, opacity';
      textContainer.appendChild(regSpan);
      letterSpans.push(regSpan);

      letterSpans.forEach((span, idx) => {
        const letterAngle = (idx < 3) ? Math.PI + (idx - 1.5) * 0.4 : (idx - 3.5) * 0.4;
        const force = 1.6 + Math.random() * 1.5;
        const destX = Math.cos(letterAngle) * 260 * force;
        const destY = Math.sin(letterAngle) * 150 * force + 240; // gravity drop downwards
        const rot = (Math.random() - 0.5) * 540;

        gsap.to(span, {
          x: destX,
          y: destY,
          rotation: rot,
          opacity: 0,
          scale: 0.15,
          duration: 1.3 + Math.random() * 0.3,
          ease: 'power2.out'
        });
      });

      // 3. Generate 30 tiny glass shards to add glass physics texture
      const numGlassShards = 30;
      for (let i = 0; i < numGlassShards; i++) {
        const shard = document.createElement('div');
        const size = 6 + Math.random() * 14;
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 150;
        const left = 210 + Math.cos(a) * r - (size / 2);
        const top = 210 + Math.sin(a) * r - (size / 2);

        shard.style.position = 'absolute';
        shard.style.width = `${size}px`;
        shard.style.height = `${size}px`;
        shard.style.left = `${left}px`;
        shard.style.top = `${top}px`;
        shard.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.3) 100%)';
        shard.style.border = '1px solid rgba(255,255,255,0.5)';

        const p1x = Math.floor(Math.random() * 40);
        const p1y = Math.floor(Math.random() * 40);
        const p2x = Math.floor(60 + Math.random() * 40);
        const p2y = Math.floor(Math.random() * 40);
        const p3x = Math.floor(50 + Math.random() * 50);
        const p3y = Math.floor(60 + Math.random() * 40);
        shard.style.clipPath = `polygon(${p1x}% ${p1y}%, ${p2x}% ${p2y}%, ${p3x}% ${p3y}%)`;
        shatterContainer.appendChild(shard);

        const dx = left - 210;
        const dy = top - 210;
        const shardAngle = Math.atan2(dy, dx);
        const force = 2.0 + Math.random() * 2.5;

        gsap.to(shard, {
          x: Math.cos(shardAngle) * 360 * force,
          y: Math.sin(shardAngle) * 360 * force + 300,
          rotation: (Math.random() - 0.5) * 1080,
          opacity: 0,
          scale: 0.1,
          duration: 1.2 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => { shard.remove(); }
        });
      }
    }

    // Reassembles centerpiece back to default
    function reassembleCenterpieceLogo() {
      isBroken = false;
      isReassembling = true;

      // Clean up the animated shatter elements
      const shatterContainer = cpLogo.querySelector('.shatter-overlay-container');
      if (shatterContainer) {
        gsap.to(shatterContainer, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => { shatterContainer.remove(); }
        });
      }

      // Fade centerpiece logo segments and wordmark text back in
      const logoMain = cpLogo.querySelector('.logo-main');
      const wordmark = cpLogo.querySelector('.centerpiece-wordmark');

      gsap.to(logoMain, {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: () => {
          isReassembling = false;
        }
      });

      gsap.to(wordmark, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1.2,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  }

  // Core UI Elements
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
  const starsCount = IS_MOBILE_PERF ? 14 : 40;
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

  let bgRafId = null;
  let bgAnimActive = true;

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && bgAnimActive && !bgRafId) drawBackground();
  });

  // Draw loop for background canvas
  const drawBackground = () => {
    if (!bgAnimActive || document.hidden) {
      bgRafId = null;
      return;
    }

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
      if (logoImg.complete) {
        ctx.drawImage(logoImg, -star.size / 2, -star.size / 2, star.size, star.size);
      }
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

    bgRafId = requestAnimationFrame(drawBackground);
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
  if (sparksCanvas) {
  const sparksCtx = sparksCanvas.getContext('2d');
  let logoSparks = [];
  const maxLogoSparks = 50;
  let sparksRafId = null;

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
    if (logoSparks.length === 0) {
      sparksRafId = null;
      return;
    }

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
    sparksRafId = requestAnimationFrame(updateLogoSparks);
  };

  const queueSparkUpdate = () => {
    if (!sparksRafId) sparksRafId = requestAnimationFrame(updateLogoSparks);
  };

  const logoContainer = document.querySelector('.logo');
  if (logoContainer) {
  logoContainer.addEventListener('mousemove', (e) => {
    const rect = sparksCanvas.getBoundingClientRect();
    const mX = ((e.clientX - rect.left) / rect.width) * 100;
    const mY = ((e.clientY - rect.top) / rect.height) * 100;

    for (let i = 0; i < 2; i++) {
      addLogoSpark(mX, mY);
    }
    queueSparkUpdate();
  });

  logoContainer.addEventListener('mouseenter', () => {
    for (let i = 0; i < 12; i++) {
      addLogoSpark(50, 50);
    }
    queueSparkUpdate();
  });
  }
  }

  // ==========================================
  // 8. SCROLL EFFECTS: CENTERPIECE FADE
  // ==========================================
  const centerpieceLogo = document.querySelector('.centerpiece-logo-wrapper');
  const heroContent = document.querySelector('.hero-content');
  const aboutSection = document.querySelector('.about-section');

  let scrollFxPending = false;
  const handleScrollEffects = () => {
    const scrollY = window.scrollY;
    const viewHeight = window.innerHeight;

    if (IS_MOBILE_PERF) {
      const shouldRunBg = scrollY < viewHeight * 2;
      if (bgAnimActive !== shouldRunBg) {
        bgAnimActive = shouldRunBg;
        if (shouldRunBg && !bgRafId) drawBackground();
      }
    }

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

  const smoothScrub = (value) => +(value * (IS_MOBILE_PERF ? 1.38 : 1.2)).toFixed(2);

  if (!reducedMotion) {
    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(IS_MOBILE_PERF ? 1200 : 600, IS_MOBILE_PERF ? 80 : 40);
  }

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

  let resetKeyFactsForAboutReentry = null;

  const initAboutAnimations = () => {
    if (!aboutSection) return;

    const keyFactsSection = document.querySelector('.key-facts-section');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollWords = gsap.utils.toArray('.about-section .scroll-word');
    const sloganLines = gsap.utils.toArray('.about-section .slogan-line');
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
      keyFactsSection?.classList.remove('is-awaiting-about');
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
      if (aboutVideoBg && !isMobile) {
        aboutVideoBg.classList.add('is-hidden-after-blend');
        gsap.set(aboutVideoBg, { opacity: 0, visibility: 'hidden' });
      }
      if (aboutBgVideo && !isMobile) aboutBgVideo.pause();
    };

    const scrollLength = isMobile ? '+=280%' : '+=400%';
    const scrubAmount = smoothScrub(isMobile ? 0.82 : 1.25);
    const revealAt = isMobile
      ? { divider: 1.0, slogans: 1.22, mission: 1.38, cta: 1.54, hold: 1.88, end: 3.0 }
      : { video: 0, slogans: 1.72, mission: 2.0, cta: 2.22, hold: 2.6, end: 4.2 };
    const exitAt = isMobile
      ? { bottom: 2.05, divider: 2.32, words: 2.48, eyebrow: 2.62, end: 3.0 }
      : { bottom: 2.98, body: 3.38, brk: 3.72, lead: 3.76, rail: 4.02, eyebrow: 4.06, glow: 4.02, end: 4.2 };

    const aboutVideoScrim = document.querySelector('.about-video-scrim');
    const aboutKfBridge = document.querySelector('.about-kf-bridge');
    const blendStart = exitAt.eyebrow + (isMobile ? 0.12 : 0.18);
    const blendDuration = isMobile ? 0.72 : 1.05;

    if (aboutKfBridge) {
      gsap.set(aboutKfBridge, { opacity: 0 });
    }

    const lockKeyFacts = () => {
      keyFactsSection?.classList.add('is-awaiting-about');
      document.querySelector('.kf-innovation-stage')?.classList.add('is-awaiting-about');
    };

    const unlockKeyFacts = () => {
      if (!keyFactsSection) return;
      keyFactsSection.classList.remove('is-awaiting-about');
      document.querySelector('.kf-innovation-stage')?.classList.remove('is-awaiting-about');
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    if (keyFactsSection) {
      lockKeyFacts();
    }

    const playAboutVideo = () => {
      if (!aboutBgVideo || isMobile) return;
      aboutBgVideo.muted = true;
      aboutBgVideo.defaultMuted = true;
      const playPromise = aboutBgVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => { });
      }
    };

    const pinAboutVideoBg = () => {
      if (isMobile || !aboutVideoBg || !aboutSection) return;
      aboutVideoBg.classList.add('is-viewport-fixed');
      aboutVideoBg.classList.remove('is-hidden-after-blend');
      gsap.set(aboutVideoBg, { opacity: 1, visibility: 'visible', display: 'block', clearProps: 'transform,x,y,scale' });
      if (aboutBgVideo) gsap.set(aboutBgVideo, { clearProps: 'transform,x,y,scale' });
      playAboutVideo();
    };

    const unpinAboutVideoBg = (hide = false) => {
      if (isMobile || !aboutVideoBg || !aboutSection) return;
      aboutVideoBg.classList.remove('is-viewport-fixed');
      if (hide) {
        aboutVideoBg.classList.add('is-hidden-after-blend');
        gsap.set(aboutVideoBg, { opacity: 0, visibility: 'hidden' });
        if (aboutBgVideo) aboutBgVideo.pause();
      } else {
        aboutVideoBg.classList.remove('is-hidden-after-blend');
        gsap.set(aboutVideoBg, { opacity: 1, visibility: 'visible', display: 'block' });
        playAboutVideo();
      }
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
          aboutSection.classList.remove('is-about-passed');
          lockKeyFacts();
          if (!isMobile) {
            aboutSection.classList.add('is-about-active');
            pinAboutVideoBg();
          }
          playAboutVideo();
        },
        onEnterBack: () => {
          aboutSection.classList.remove('is-about-passed');
          lockKeyFacts();
          resetKeyFactsForAboutReentry?.();
          if (!isMobile) {
            aboutSection.classList.add('is-about-active');
            pinAboutVideoBg();
          }
          playAboutVideo();
        },
        onLeave: () => {
          aboutSection.classList.add('is-about-passed');
          unlockKeyFacts();
          if (!isMobile) {
            aboutSection.classList.remove('is-about-active');
            unpinAboutVideoBg(true);
          }
          if (isMobile) lockAboutExitState();
        },
        onLeaveBack: () => {
          aboutSection.classList.remove('is-about-passed');
          lockKeyFacts();
          resetKeyFactsForAboutReentry?.();
          if (!isMobile) {
            aboutSection.classList.remove('is-about-active');
            unpinAboutVideoBg(false);
          }
          if (isMobile) lockAboutEnterState();
        },
        onUpdate: (self) => {
          if (prefersReducedMotion) return;

          const t = self.progress * aboutTl.duration();
          const isBlending = t >= blendStart - 0.02;
          const isBlendComplete = t >= blendStart + blendDuration * 0.98;

          aboutSection.classList.toggle('is-about-blending', isBlending && !isBlendComplete);

          if (isBlendComplete && keyFactsSection?.classList.contains('is-awaiting-about')) {
            unlockKeyFacts();
          }

          if (isBlendComplete && !isMobile && aboutVideoBg) {
            aboutVideoBg.classList.add('is-hidden-after-blend');
            if (aboutBgVideo) aboutBgVideo.pause();
          } else if (!isBlendComplete && !isMobile && aboutVideoBg) {
            aboutVideoBg.classList.remove('is-hidden-after-blend');
            gsap.set(aboutVideoBg, { visibility: 'visible' });
          }
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
    aboutTl.to({}, { duration: isMobile ? 0.22 : 0.35 }, revealAt.hold);

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

    // Phase 7 — fade About out via bridge (Key Facts enters once on natural scroll)
    if (aboutKfBridge && !prefersReducedMotion) {
      if (!isMobile && aboutVideoBg) {
        aboutTl.to(aboutVideoBg, {
          opacity: 0,
          duration: blendDuration,
          ease: 'power1.inOut'
        }, blendStart);
      }

      if (aboutVideoScrim && !isMobile) {
        aboutTl.to(aboutVideoScrim, {
          opacity: 1,
          duration: blendDuration * 0.85,
          ease: 'power1.inOut'
        }, blendStart);
      }

      if (isMobile && aboutBackdrop) {
        aboutTl.to(aboutBackdrop, {
          opacity: 0,
          duration: blendDuration * 0.75,
          ease: 'power2.inOut'
        }, blendStart);
      }

      if (aboutKfBridge) {
        aboutTl.to(aboutKfBridge, {
          opacity: isMobile ? 0.65 : 1,
          duration: blendDuration,
          ease: 'power1.inOut'
        }, blendStart);
      }

      aboutTl.to({}, { duration: isMobile ? 0.18 : 0.35 }, blendStart + blendDuration);
    } else {
      aboutTl.to({}, { duration: 0.3 }, revealAt.end);
    }

    if (keyFactsSection && aboutTl.scrollTrigger) {
      const aboutSt = aboutTl.scrollTrigger;
      if (!aboutSt.isActive && aboutSt.progress >= 0.995) {
        unlockKeyFacts();
      }
    }
  };

  initAboutAnimations();
  initSloganMagicHover();

  // ==========================================
  // 10. KEY FACTS — JOURNEY / TEAM / IMPACT
  // ==========================================

  const initKeyFactsSection = () => {
    const factsSection = document.querySelector('.key-facts-section');
    const innovationStage = document.querySelector('.kf-innovation-stage');
    const kfInnovation = document.querySelector('.kf-innovation-banner');
    const cards = gsap.utils.toArray('.kf-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileKf = window.innerWidth <= 768;

    if (!factsSection || !cards.length) return;

    const kfBg = factsSection.querySelector('.kf-bg');
    const kfHeader = factsSection.querySelector('.kf-section-header');
    const kfBgVideo = factsSection.querySelector('.kf-bg-video');

    if (innovationStage && factsSection.classList.contains('is-awaiting-about')) {
      innovationStage.classList.add('is-awaiting-about');
    }

    if (kfBg) gsap.set(kfBg, { opacity: 0 });
    if (kfHeader) gsap.set(kfHeader, { opacity: 0, y: 36 });
    if (kfInnovation) gsap.set(kfInnovation, { opacity: 0, y: 48 });

    resetKeyFactsForAboutReentry = () => {
      innovationStage?.classList.add('is-awaiting-about');
      if (kfBg) gsap.set(kfBg, { opacity: 0 });
      if (kfHeader) gsap.set(kfHeader, { opacity: 0, y: 36 });
      if (kfInnovation) gsap.set(kfInnovation, { opacity: 0, y: 48 });
      cards.forEach((card) => {
        card.classList.add('is-reveal-pending');
        gsap.set(card, {
          opacity: 0,
          y: 72,
          scale: 0.9,
          rotateY: 0,
          filter: 'blur(12px)',
          clearProps: 'transform'
        });
      });
    };

    if (kfBgVideo) {
      kfBgVideo.muted = true;
      if (!prefersReducedMotion) {
        const playKfVideo = () => {
          const promise = kfBgVideo.play();
          if (promise && typeof promise.catch === 'function') promise.catch(() => {});
        };
        ScrollTrigger.create({
          trigger: factsSection,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: playKfVideo,
          onEnterBack: playKfVideo,
          onLeave: () => kfBgVideo.pause(),
          onLeaveBack: () => kfBgVideo.pause()
        });
        if (factsSection.getBoundingClientRect().top < window.innerHeight) playKfVideo();
      }
    }

    if (prefersReducedMotion) {
      if (kfInnovation) gsap.set(kfInnovation, { opacity: 1, y: 0 });
    }

    cards.forEach((card) => card.classList.add('is-reveal-pending'));
    gsap.set(cards, { transformPerspective: 900 });

    if (!prefersReducedMotion) {
      if (kfInnovation) {
        const innovationTrigger = innovationStage || factsSection;
        gsap.timeline({
          scrollTrigger: {
            trigger: innovationTrigger,
            start: 'top 95%',
            end: 'top 40%',
            scrub: smoothScrub(0.65),
            invalidateOnRefresh: true
          }
        }).fromTo(kfInnovation, {
          opacity: 0,
          y: 40
        }, {
          opacity: 1,
          y: 0,
          ease: 'none'
        });
      }

      const kfEntranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: factsSection,
          start: 'top 88%',
          end: 'top 48%',
          scrub: smoothScrub(0.9),
          invalidateOnRefresh: true
        }
      })
        .to(kfBg, { opacity: 1, duration: 0.7, ease: 'power1.inOut' }, 0)
        .to(kfHeader, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.08);

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.kf-cards-grid--three',
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true
        }
      });

      cards.forEach((card, index) => {
        const isLogoCard = card.classList.contains('kf-card--logo');
        const mobileLogoLead = isMobileKf && isLogoCard;
        const staggerAt = mobileLogoLead ? 0 : (isMobileKf ? index * 0.12 : index * 0.16);

        revealTl.fromTo(card, {
          opacity: 0,
          y: mobileLogoLead ? 40 : (isMobileKf ? 52 : 72),
          scale: mobileLogoLead ? 0.96 : (isMobileKf ? 0.94 : 0.9),
          rotateY: !isMobileKf && index === 0 ? -10 : !isMobileKf && index === 2 ? 10 : 0,
          filter: mobileLogoLead ? 'blur(6px)' : (isMobileKf ? 'blur(8px)' : 'blur(12px)')
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          filter: 'blur(0px)',
          duration: mobileLogoLead ? 0.85 : (isMobileKf ? 0.75 : 1),
          ease: mobileLogoLead ? 'power3.out' : 'power4.out',
          onStart: () => card.classList.remove('is-reveal-pending')
        }, staggerAt);
      });

      // Left card — center cycle + counter
      const projectsCard = document.querySelector('.kf-card--projects');
      const cycleText = projectsCard?.querySelector('[data-cycle-text]');
      const projectsCountEl = projectsCard?.querySelector('[data-count]');
      const cycleItems = ['Products', 'Websites', 'POS System', 'Mobile & Web'];
      let cycleTl = null;

      if (projectsCard && cycleText) {
        const buildCycleTimeline = () => {
          const tl = gsap.timeline({ paused: true, repeat: -1 });
          cycleItems.forEach((label, index) => {
            if (index === 0) {
              tl.set(cycleText, { textContent: label, opacity: 1, y: 0 });
            } else {
              tl.to(cycleText, {
                opacity: 0,
                y: -14,
                duration: 0.4,
                ease: 'power2.in'
              });
              tl.call(() => {
                cycleText.textContent = label;
              });
              tl.fromTo(cycleText,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
              );
            }
            tl.to({}, { duration: 2 });
          });
          return tl;
        };

        cycleTl = buildCycleTimeline();

        ScrollTrigger.create({
          trigger: projectsCard,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => cycleTl.play(),
          onEnterBack: () => cycleTl.play(),
          onLeave: () => cycleTl.pause(),
          onLeaveBack: () => cycleTl.pause()
        });

        if (projectsCard.getBoundingClientRect().top < window.innerHeight * 0.85) {
          cycleTl.play();
        }
      }

      if (projectsCard && projectsCountEl) {
          const target = parseInt(projectsCountEl.dataset.count, 10);
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: projectsCard,
              start: 'top 80%',
              once: true
            },
            onUpdate: () => {
              projectsCountEl.textContent = Math.round(counter.val);
            },
            onComplete: () => projectsCard.classList.add('is-counted')
          });
      }

      // Right card — center partner cycle (like card 01)
      const partnersCard = document.querySelector('.kf-card--partners');
      const partnerCountryEl = partnersCard?.querySelector('[data-partner-cycle-country]');
      const partnerNameEl = partnersCard?.querySelector('[data-partner-cycle-name]');
      const partnerCycleItems = [
        { country: 'United Kingdom', name: 'Regal International College' },
        { country: 'Canada', name: 'Strategic Partner' },
        { country: 'Sri Lanka', name: 'Coastal Creatives' }
      ];
      let partnerCycleTl = null;

      if (partnersCard && partnerCountryEl && partnerNameEl) {
        const cycleEls = [partnerCountryEl, partnerNameEl];

        const buildPartnerCycleTimeline = () => {
          const tl = gsap.timeline({ paused: true, repeat: -1 });

          partnerCycleItems.forEach((partner, index) => {
            if (index === 0) {
              tl.set(partnerCountryEl, { textContent: partner.country });
              tl.set(partnerNameEl, { textContent: partner.name });
              tl.set(cycleEls, { opacity: 1, y: 0 });
            } else {
              tl.to(cycleEls, {
                opacity: 0,
                y: -12,
                duration: 0.4,
                ease: 'power2.in'
              });
              tl.call(() => {
                partnerCountryEl.textContent = partner.country;
                partnerNameEl.textContent = partner.name;
              });
              tl.fromTo(cycleEls,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
              );
            }
            tl.to({}, { duration: 2 });
          });

          return tl;
        };

        partnerCycleTl = buildPartnerCycleTimeline();

        ScrollTrigger.create({
          trigger: partnersCard,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => partnerCycleTl.play(),
          onEnterBack: () => partnerCycleTl.play(),
          onLeave: () => partnerCycleTl.pause(),
          onLeaveBack: () => partnerCycleTl.pause()
        });

        if (partnersCard.getBoundingClientRect().top < window.innerHeight * 0.85) {
          partnerCycleTl.play();
        }
      }
    } else {
      cards.forEach((card) => {
        card.classList.remove('is-reveal-pending');
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      });
      document.querySelectorAll('[data-count]').forEach((el) => {
        el.textContent = el.dataset.count;
      });
      const cycleText = document.querySelector('.kf-card--projects [data-cycle-text]');
      if (cycleText) cycleText.textContent = 'Products';
      document.querySelector('.kf-card--projects')?.classList.add('is-counted');
      const partnerCountryEl = document.querySelector('.kf-card--partners [data-partner-cycle-country]');
      const partnerNameEl = document.querySelector('.kf-card--partners [data-partner-cycle-name]');
      if (partnerCountryEl) partnerCountryEl.textContent = 'United Kingdom';
      if (partnerNameEl) partnerNameEl.textContent = 'Regal International College';
    }

    // Background particles (lightweight)
    const particleCanvas = document.getElementById('kf-particles');
    if (particleCanvas && !prefersReducedMotion) {
      const ctx = particleCanvas.getContext('2d');
      let particles = [];
      let rafId = null;
      let width = 0;
      let height = 0;

      const resize = () => {
        const rect = factsSection.getBoundingClientRect();
        width = particleCanvas.width = Math.floor(rect.width);
        height = particleCanvas.height = Math.floor(rect.height);
        const count = window.innerWidth <= 600 ? 10 : (IS_MOBILE_PERF ? 16 : 32);
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.2 + 0.4,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          a: Math.random() * 0.35 + 0.15
        }));
      };

      const draw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 95, 0, ${p.a})`;
          ctx.fill();
        });
        rafId = requestAnimationFrame(draw);
      };

      const startParticles = () => {
        resize();
        if (!rafId) rafId = requestAnimationFrame(draw);
      };

      const stopParticles = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      ScrollTrigger.create({
        trigger: factsSection,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: startParticles,
        onEnterBack: startParticles,
        onLeave: stopParticles,
        onLeaveBack: stopParticles
      });

      window.addEventListener('resize', resize);
      if (factsSection.getBoundingClientRect().top < window.innerHeight) startParticles();
    }

    // Center card — desktop orbit spotlight + mobile scroll reveal
    const spotlightStage = document.querySelector('[data-spotlight]');
    const logoCard = document.querySelector('.kf-card--logo');

    if (spotlightStage && !prefersReducedMotion) {
      if (isMobileKf) {
        spotlightStage.classList.add('is-mobile');
        const mobileLogo = spotlightStage.querySelector('.kf-spotlight-logo');

        const revealMobileSpotlight = () => {
          spotlightStage.classList.add('is-mobile-revealed');
          if (mobileLogo) {
            gsap.to(mobileLogo, {
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => gsap.set(mobileLogo, { clearProps: 'opacity,transform' })
            });
          }
        };

        ScrollTrigger.create({
          trigger: logoCard || spotlightStage,
          start: 'top 84%',
          once: true,
          onEnter: revealMobileSpotlight
        });

        if ((logoCard || spotlightStage).getBoundingClientRect().top < window.innerHeight * 0.84) {
          revealMobileSpotlight();
        }
      } else {
        let angle = 0;
        let orbitActive = false;
        let isHovered = false;
        let rafSpot = null;
        const orbitRx = 27;
        const orbitRy = 21;

        const tick = () => {
          if (orbitActive && !isHovered) {
            angle += 0.016;
            const wobble = Math.sin(angle * 2.4) * 4;
            const cx = 50 + Math.cos(angle) * (orbitRx + wobble);
            const cy = 50 + Math.sin(angle) * (orbitRy + wobble * 0.6);
            spotlightStage.style.setProperty('--mx', `${cx}%`);
            spotlightStage.style.setProperty('--my', `${cy}%`);
            spotlightStage.classList.add('is-auto');
          }
          rafSpot = requestAnimationFrame(tick);
        };

        const startOrbit = () => {
          if (!rafSpot) rafSpot = requestAnimationFrame(tick);
          orbitActive = true;
        };

        const stopOrbit = () => {
          orbitActive = false;
          if (rafSpot) {
            cancelAnimationFrame(rafSpot);
            rafSpot = null;
          }
        };

        spotlightStage.addEventListener('mouseenter', () => {
          isHovered = true;
          spotlightStage.classList.add('is-hovered');
          spotlightStage.classList.remove('is-auto');
        }, { passive: true });

        spotlightStage.addEventListener('mouseleave', () => {
          isHovered = false;
          spotlightStage.classList.remove('is-hovered');
        }, { passive: true });

        ScrollTrigger.create({
          trigger: spotlightStage,
          start: 'top 88%',
          end: 'bottom 12%',
          onEnter: startOrbit,
          onEnterBack: startOrbit,
          onLeave: stopOrbit,
          onLeaveBack: stopOrbit
        });

        if (spotlightStage.getBoundingClientRect().top < window.innerHeight * 0.88) {
          startOrbit();
        }
      }
    } else if (spotlightStage) {
      spotlightStage.classList.add('is-hovered');
      if (isMobileKf) spotlightStage.classList.add('is-mobile', 'is-mobile-revealed');
    }

    // Magnetic tilt on cards (desktop only)
    const tiltCards = prefersReducedMotion || isMobileKf ? [] : gsap.utils.toArray('[data-tilt]');
    tiltCards.forEach((card) => {
      const rotateXTo = gsap.quickTo(card, 'rotateX', { duration: 0.45, ease: 'power2.out' });
      const rotateYTo = gsap.quickTo(card, 'rotateY', { duration: 0.45, ease: 'power2.out' });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateYTo(px * 8);
        rotateXTo(-py * 8);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        rotateXTo(0);
        rotateYTo(0);
      }, { passive: true });
    });
  };

  initKeyFactsSection();

  // ==========================================
  // 12. SELECTED WORK THEME FLIP & HORIZONTAL SCROLL
  // ==========================================
  const workSection = document.querySelector('.selected-work-section');
  const horizontalTrack = document.querySelector('.work-horizontal-track');
  const workIntro = document.querySelector('[data-work-intro]');

  if (workSection && horizontalTrack) {
    ScrollTrigger.create({
      trigger: '.selected-work-section',
      start: 'top 50%',
      end: 'bottom 50%',
      toggleClass: { targets: 'body', className: 'light-theme-active' },
      invalidateOnRefresh: true
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
      const getScrollDistance = () => Math.max(0, horizontalTrack.scrollWidth - window.innerWidth);

      const horizontalScrollTween = gsap.to(horizontalTrack, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.selected-work-section',
          pin: true,
          scrub: smoothScrub(1),
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      if (workIntro) {
        gsap.to(workIntro, {
          x: () => -window.innerWidth * 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: '.selected-work-section',
            start: 'top top',
            end: () => `+=${getScrollDistance() * 0.4}`,
            scrub: smoothScrub(1),
            invalidateOnRefresh: true
          }
        });
      }

      gsap.utils.toArray('.project-slide .project-card').forEach((card) => {
        gsap.fromTo(card,
          { x: -180, y: 140, opacity: 0, scale: 0.88 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScrollTween,
              start: 'left 100%',
              end: 'left 48%',
              scrub: smoothScrub(1)
            }
          }
        );
      });

      const outroContent = document.querySelector('.outro-slide-content');
      if (outroContent) {
        gsap.fromTo(outroContent,
          { x: -80, y: 40, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: outroContent,
              containerAnimation: horizontalScrollTween,
              start: 'left 95%',
              end: 'left 60%',
              scrub: smoothScrub(1)
            }
          }
        );
      }

      return () => {
        gsap.set(horizontalTrack, { x: 0, clearProps: 'transform' });
        if (workIntro) gsap.set(workIntro, { clearProps: 'transform' });
      };
    });

    mm.add('(max-width: 900px)', () => {
      gsap.set(horizontalTrack, { x: 0, clearProps: 'transform' });
      if (workIntro) gsap.set(workIntro, { clearProps: 'transform' });
      gsap.utils.toArray('.project-slide .project-card, .outro-slide-content').forEach((el) => {
        gsap.set(el, { clearProps: 'all' });
      });
    });
  }

  // ==========================================
  // 12b. SERVICES LIGHTNING STORM (realistic)
  // ==========================================
  function initServicesLightning(section) {
    const canvas = section.querySelector('.services-lightning-canvas');
    const flash = section.querySelector('.services-lightning-flash');
    const haze = section.querySelector('.services-lightning-haze');
    if (!canvas || !flash || !haze) return null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileLightning = window.innerWidth <= 768;
    if (prefersReducedMotion) return null;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let strikeTimer = null;
    let fadeTimer = null;
    let hazeTimer = null;
    let activeBolts = [];
    let rafId = null;
    let isRunning = false;
    let lastFrame = 0;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, isMobileLightning ? 1 : 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const randomBetween = (min, max) => min + Math.random() * (max - min);

    const fractalBolt = (x1, y1, x2, y2, displacement) => {
      if (displacement < 2) {
        return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      }

      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement * 0.18;
      const left = fractalBolt(x1, y1, midX, midY, displacement * 0.62);
      const right = fractalBolt(midX, midY, x2, y2, displacement * 0.62);
      return left.slice(0, -1).concat(right);
    };

    const buildBolt = (startX, cloudY, groundY, spread) => {
      const endX = startX + randomBetween(-spread * 0.65, spread * 0.65);
      return fractalBolt(startX, cloudY, endX, groundY, spread);
    };

    const buildBranches = (mainBolt, intensity) => {
      const branches = [];
      if (intensity < 0.55 || Math.random() > 0.55) return branches;

      const branchCount = Math.random() > 0.7 ? 2 : 1;
      for (let i = 0; i < branchCount; i += 1) {
        const index = Math.floor(randomBetween(3, mainBolt.length - 4));
        const origin = mainBolt[index];
        const next = mainBolt[index + 1] || origin;
        const angle = Math.atan2(next.y - origin.y, next.x - origin.x);
        const branchLen = randomBetween(height * 0.04, height * 0.12);
        const branchAngle = angle + randomBetween(-0.9, 0.9);
        const endX = origin.x + Math.cos(branchAngle) * branchLen;
        const endY = origin.y + Math.sin(branchAngle) * branchLen;
        branches.push(fractalBolt(origin.x, origin.y, endX, endY, branchLen * 0.18));
      }

      return branches;
    };

    const tracePath = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    };

    const drawBoltPath = (points, opacity, distant = false) => {
      if (points.length < 2 || opacity <= 0.008) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'lighter';

      tracePath(points);
      ctx.strokeStyle = `rgba(130, 160, 198, ${opacity * (distant ? 0.1 : 0.16)})`;
      ctx.lineWidth = distant ? 1.2 : 1.8;
      ctx.shadowBlur = distant ? 8 : 14;
      ctx.shadowColor = `rgba(170, 195, 225, ${opacity * 0.22})`;
      ctx.stroke();

      tracePath(points);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(228, 236, 246, ${opacity * (distant ? 0.28 : 0.42)})`;
      ctx.lineWidth = distant ? 0.35 : 0.5;
      ctx.stroke();

      tracePath(points);
      ctx.strokeStyle = `rgba(250, 252, 255, ${opacity * (distant ? 0.45 : 0.72)})`;
      ctx.lineWidth = 0.25;
      ctx.stroke();

      ctx.restore();
    };

    const flickerIntensity = (progress) => {
      if (progress < 0.08) return progress / 0.08;
      return Math.exp(-(progress - 0.08) * 5.2);
    };

    const render = (timestamp) => {
      const delta = lastFrame ? (timestamp - lastFrame) / 16.67 : 1;
      lastFrame = timestamp;
      ctx.clearRect(0, 0, width, height);

      activeBolts = activeBolts.filter((bolt) => {
        const flicker = bolt.flickers[bolt.flickerIndex];
        if (!flicker) return false;

        flicker.age += delta;

        if (flicker.age >= flicker.duration) {
          bolt.flickerIndex += 1;
          if (bolt.flickerIndex >= bolt.flickers.length) return false;
          return true;
        }

        const progress = flicker.age / flicker.duration;
        const pulse = flicker.peak * flickerIntensity(progress);
        const opacity = Math.max(0, pulse * bolt.intensity * (bolt.distant ? 0.42 : 0.78));

        drawBoltPath(bolt.main, opacity, bolt.distant);
        bolt.branches.forEach((branch) => {
          drawBoltPath(branch, opacity * 0.5, true);
        });

        return true;
      });

      if (isRunning) {
        rafId = requestAnimationFrame(render);
      }
    };

    const illuminateSky = (x, y, strength, fadeMs) => {
      const xPct = `${(x / width) * 100}%`;
      const yPct = `${(y / height) * 100}%`;
      const core = 0.03 + strength * 0.07;
      const peakOpacity = 0.08 + strength * 0.16;

      flash.style.setProperty('--flash-x', xPct);
      flash.style.setProperty('--flash-y', yPct);
      flash.style.setProperty('--flash-core', String(core));
      flash.style.setProperty('--flash-opacity', String(peakOpacity));
      flash.style.setProperty('--flash-fade', `${fadeMs}ms`);

      haze.style.setProperty('--haze-x', xPct);
      haze.style.setProperty('--haze-y', yPct);
      haze.style.setProperty('--haze-core', String(core * 1.15));
      haze.style.setProperty('--haze-fade', `${fadeMs + 400}ms`);

      flash.classList.remove('is-fading');
      flash.classList.add('is-flashing');
      haze.classList.add('is-lit');

      clearTimeout(fadeTimer);
      clearTimeout(hazeTimer);

      fadeTimer = setTimeout(() => {
        flash.classList.remove('is-flashing');
        flash.classList.add('is-fading');
      }, 14 + Math.random() * 22);

      hazeTimer = setTimeout(() => {
        haze.classList.remove('is-lit');
      }, fadeMs * 0.9);
    };

    const createFlickers = (intensity) => {
      const count = intensity > 0.75 && Math.random() > 0.55 ? 3 : intensity > 0.45 ? 2 : 1;
      const flickers = [];

      for (let i = 0; i < count; i += 1) {
        flickers.push({
          peak: randomBetween(0.55, 1) * intensity,
          duration: randomBetween(0.8, 1.8),
          age: i === 0 ? 0 : randomBetween(0.4, 1.1)
        });
      }

      return flickers;
    };

    const strike = () => {
      if (!section.classList.contains('is-storm-active')) return;

      const roll = Math.random();
      const startX = randomBetween(width * 0.1, width * 0.9);
      const cloudY = randomBetween(-height * 0.14, height * 0.02);
      const skyX = startX + randomBetween(-width * 0.04, width * 0.04);
      const skyY = cloudY + height * 0.1;

      // Mostly cloud illumination — like real distant storms
      if (roll < 0.55) {
        illuminateSky(skyX, skyY, randomBetween(0.18, 0.42), randomBetween(1200, 2200));
        return;
      }

      const distant = roll < 0.82;
      const intensity = distant ? randomBetween(0.22, 0.48) : randomBetween(0.5, 0.82);
      const endY = randomBetween(height * 0.28, distant ? height * 0.62 : height * 0.82);
      const spread = distant ? randomBetween(22, 40) : randomBetween(34, 62);
      const main = buildBolt(startX, cloudY, endY, spread);
      const branches = buildBranches(main, intensity);

      activeBolts.push({
        main,
        branches,
        intensity,
        distant,
        flickers: createFlickers(intensity),
        flickerIndex: 0
      });

      illuminateSky(
        skyX,
        skyY,
        distant ? intensity * 0.42 : intensity * 0.68,
        distant ? randomBetween(1000, 1700) : randomBetween(700, 1200)
      );
    };

    const scheduleStrike = () => {
      clearTimeout(strikeTimer);
      if (!section.classList.contains('is-storm-active')) return;

      const pause = isMobileLightning
        ? randomBetween(11000, 20000)
        : Math.random() > 0.84
          ? randomBetween(8000, 14000)
          : randomBetween(4200, 9000);

      strikeTimer = setTimeout(() => {
        strike();
        if (Math.random() > 0.88) {
          setTimeout(strike, randomBetween(90, 220));
        }
        scheduleStrike();
      }, pause);
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      lastFrame = 0;
      resize();
      rafId = requestAnimationFrame(render);
      scheduleStrike();
      setTimeout(strike, randomBetween(3000, 5500));
    };

    const stop = () => {
      isRunning = false;
      clearTimeout(strikeTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hazeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      lastFrame = 0;
      activeBolts = [];
      ctx.clearRect(0, 0, width, height);
      flash.classList.remove('is-flashing', 'is-fading');
      haze.classList.remove('is-lit');
    };

    resize();
    window.addEventListener('resize', resize);

    const observer = new MutationObserver(() => {
      if (section.classList.contains('is-storm-active')) {
        start();
      } else {
        stop();
      }
    });

    observer.observe(section, { attributes: true, attributeFilter: ['class'] });

    if (section.classList.contains('is-storm-active')) {
      start();
    }

    return { start, stop, resize };
  }

  // ==========================================
  // 13. OUR SERVICES PINNED TRANSITION & 3D ROTATION
  // ==========================================
  const servicesSection = document.querySelector('.services-section');
  const storiesSection = document.querySelector('.stories-section');
  const shutterWipe = document.querySelector('.shutter-wipe');

  if (servicesSection) {
    const isMobileSvc = window.innerWidth <= 768;

    initServicesLightning(servicesSection);

    const updateShutterReveal = (progress) => {
      const total = servicesTl.duration();
      const t = progress * total;

      const shutterCloseStart = 2.0;
      const shutterOpenEnd = 4.58;
      const shuttersActive = t >= shutterCloseStart && t < shutterOpenEnd;

      if (shutterWipe) {
        shutterWipe.classList.toggle('is-active', shuttersActive);
      }

      if (t < shutterOpenEnd) {
        servicesSection.classList.remove('is-shutter-hidden');
        if (t >= shutterCloseStart) {
          gsap.set(servicesSection, { autoAlpha: 1 });
        }
      } else {
        servicesSection.classList.add('is-shutter-hidden');
        if (shutterWipe) shutterWipe.classList.remove('is-active');
      }
    };

    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-section',
        pin: true,
        start: 'top top',
        end: isMobileSvc ? '+=170%' : '+=250%',
        scrub: smoothScrub(isMobileSvc ? 1.1 : 2),
        anticipatePin: isMobileSvc ? 0 : 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress * servicesTl.duration();
          const shutterRevealPhase = t >= 3.18;

          if (shutterRevealPhase) {
            document.body.classList.remove('light-theme-active');
          } else if (self.progress > 0.4) {
            document.body.classList.remove('light-theme-active');
          } else {
            document.body.classList.add('light-theme-active');
          }

          if (self.progress > 0.18 && self.progress < 0.72) {
            servicesSection.classList.add('is-storm-active');
          } else {
            servicesSection.classList.remove('is-storm-active');
          }

          updateShutterReveal(self.progress);
        },
        onLeave: () => {
          if (shutterWipe) shutterWipe.classList.remove('is-active');
          servicesSection.classList.remove('is-shutter-hidden');
          gsap.set(servicesSection, { clearProps: 'opacity,visibility' });
        },
        onEnterBack: () => {
          servicesSection.classList.remove('is-shutter-hidden');
          gsap.set(servicesSection, { autoAlpha: 1 });
        }
      }
    });

    // Darken background overlay
    servicesTl.to('.services-dark-overlay', {
      opacity: 1,
      duration: 1
    }, 0);

    // Fade in lightning storm behind the slab
    servicesTl.to('.services-lightning', {
      opacity: 1,
      duration: 1.1
    }, 0.25);

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
      x: (i) => (isMobileSvc ? (i % 2 === 0 ? 22 : -22) : (i % 2 === 0 ? 60 : -60)),
      y: (i) => (isMobileSvc ? (i % 2 === 0 ? -18 : 18) : (i % 2 === 0 ? -50 : 50)),
      duration: 1.5
    }, 0.5);

    // Fade tagline and CTA in
    servicesTl.to('.services-tagline', {
      opacity: 1,
      duration: 0.8
    }, 1.6);
    servicesTl.to('.cta-services-footer', {
      opacity: 1,
      duration: 0.8
    }, 1.6);

    // Soften logo scene before shutters sweep in
    servicesTl.to('.services-centerpiece', {
      opacity: 0.35,
      scale: 0.96,
      ease: 'power2.inOut',
      duration: 0.6
    }, 1.85);

    // ==========================================
    // 14. VENETIAN SHUTTER TRANSITION WIPE
    // ==========================================
    // Slide transition bars in (covering viewport) — logo/box still visible until fully covered
    servicesTl.to('.shutter-bar', {
      scaleX: 1,
      stagger: 0.06,
      ease: 'power3.inOut',
      duration: 1
    }, 2.0);

    // Mount client stories behind shutters, then slide bars out left/right
    servicesTl.to('.shutter-bar', {
      scaleX: 0,
      stagger: 0.06,
      ease: 'power3.inOut',
      duration: 1
    }, 3.4);
  }

  // ==========================================
  // 15. CLIENT STORIES — lightweight scroll reveal
  // ==========================================
  const storiesHeader = storiesSection?.querySelector('.stories-header-row');
  const testimonialCards = gsap.utils.toArray('.testimonial-card');
  const isMobileStories = window.innerWidth <= 768;
  const prefersReducedMotionStories = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (storiesSection && testimonialCards.length) {
    if (prefersReducedMotionStories) {
      if (storiesHeader) gsap.set(storiesHeader, { opacity: 1, y: 0 });
      gsap.set(testimonialCards, { opacity: 1, y: 0 });
    } else {
      if (storiesHeader) gsap.set(storiesHeader, { opacity: 0, y: isMobileStories ? 20 : 32 });
      gsap.set(testimonialCards, { opacity: 0, y: isMobileStories ? 24 : 40 });

      ScrollTrigger.create({
        trigger: storiesSection,
        start: isMobileStories ? 'top 90%' : 'top 82%',
        once: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          gsap.timeline({ defaults: { ease: 'power2.out' } })
            .to(storiesHeader, { opacity: 1, y: 0, duration: 0.65 })
            .to(testimonialCards, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1
            }, '-=0.35');
        }
      });
    }
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

    let cachedPixels = null;

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
      cachedPixels = oCtx.getImageData(0, 0, width, height).data;
    };

    renderTextToOffscreen();

    let resizeFooterTimer;
    window.addEventListener('resize', () => {
      if (!canvas) return;
      clearTimeout(resizeFooterTimer);
      resizeFooterTimer = setTimeout(() => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        renderTextToOffscreen();
      }, 150);
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
      return;

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
    let footerRafId = null;
    let footerActive = false;

    const drawScanlines = () => {
      if (!footerActive || document.hidden || !cachedPixels) {
        footerRafId = null;
        return;
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const pixels = cachedPixels;

      // Render configuration
      const lineGap = isMobile ? 10 : 6;
      const segmentLen = isMobile ? 6 : 4;

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

      footerRafId = requestAnimationFrame(drawScanlines);
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const footerObserver = new IntersectionObserver(([entry]) => {
        footerActive = entry.isIntersecting;
        if (footerActive && !document.hidden && !footerRafId) drawScanlines();
        if (!footerActive && footerRafId) {
          cancelAnimationFrame(footerRafId);
          footerRafId = null;
        }
      }, { rootMargin: '100px' });
      footerObserver.observe(canvas);
    } else {
      footerActive = true;
      drawScanlines();
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && footerActive && !footerRafId) drawScanlines();
    });
  };

  initFooterCanvas();

  // ==========================================
  // CINEMATIC INTRO TIMELINE ANIMATION
  // ==========================================
  function playCinematicIntro(introOverlay) {
    if (!introOverlay) return;

    // Get all landing page components to animate/fade in later
    const bgCanvas = document.getElementById('bg-canvas');
    const webglContainer = document.getElementById('webgl-container');
    const topBar = document.querySelector('.top-bar');
    const heroContent = document.querySelector('.hero-content');
    const centerpieceWrapper = document.querySelector('.centerpiece-logo-wrapper');
    const credibilityBlock = document.querySelector('.credibility-block');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Hide landing page components initially
    gsap.set([bgCanvas, webglContainer, topBar, heroContent, centerpieceWrapper, credibilityBlock, scrollIndicator], { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        introOverlay.remove();
      }
    });

    // Prepare logo segments dynamically
    const segments = introOverlay.querySelectorAll('.logo-segment');
    segments.forEach(seg => {
      const length = seg.getTotalLength();
      gsap.set(seg, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
        fill: 'rgba(26, 26, 26, 0)'
      });
    });

    // 0.00–0.45s: Corner marks fade in at exact center
    tl.to(introOverlay.querySelectorAll('.corner-mark'), {
      opacity: 0.8,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.0);

    // 0.45–1.20s: Corner marks expand outward to their 160px bounds
    tl.to(introOverlay.querySelector('.corner-tl'), { top: 0, left: 0, duration: 0.75, ease: 'cubic-bezier(0.76, 0, 0.24, 1)' }, 0.45);
    tl.to(introOverlay.querySelector('.corner-tr'), { top: 0, right: 0, duration: 0.75, ease: 'cubic-bezier(0.76, 0, 0.24, 1)' }, 0.45);
    tl.to(introOverlay.querySelector('.corner-bl'), { bottom: 0, left: 0, duration: 0.75, ease: 'cubic-bezier(0.76, 0, 0.24, 1)' }, 0.45);
    tl.to(introOverlay.querySelector('.corner-br'), { bottom: 0, right: 0, duration: 0.75, ease: 'cubic-bezier(0.76, 0, 0.24, 1)' }, 0.45);

    // Draw the 1px square frame borders
    const lines = introOverlay.querySelectorAll('.frame-line');
    lines.forEach(line => {
      gsap.set(line, { strokeDasharray: 160, strokeDashoffset: 160 });
    });
    // Top grows left-to-right, right grows top-to-bottom
    tl.to(introOverlay.querySelector('.frame-line-top'), { strokeDashoffset: 0, duration: 0.75, ease: 'power2.out' }, 0.45);
    tl.to(introOverlay.querySelector('.frame-line-right'), { strokeDashoffset: 0, duration: 0.75, ease: 'power2.out' }, 0.65);
    // Bottom and left appear subtly
    tl.to([introOverlay.querySelector('.frame-line-bottom'), introOverlay.querySelector('.frame-line-left')], {
      strokeDashoffset: 0,
      duration: 0.95,
      ease: 'power1.out',
      opacity: 0.4
    }, 0.75);

    // 0.90–2.90s: AUROZE logo segments assemble sequentially
    segments.forEach((seg, idx) => {
      const startTime = 0.90 + (idx * 0.45);
      const slideDist = (idx % 2 === 0) ? -20 : 20;

      tl.fromTo(seg, {
        strokeDashoffset: seg.getTotalLength(),
        opacity: 0,
        x: slideDist,
        y: slideDist * 0.5
      }, {
        strokeDashoffset: 0,
        opacity: 0.5,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, startTime);

      // Transition outline to solid dark charcoal fill
      tl.to(seg, {
        fill: '#1a1a1a',
        opacity: 1,
        strokeWidth: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      }, startTime + 0.65);
    });

    // 1.50–2.40s: INSPIRE / INNOVATE / IMPACT and progress number appear
    tl.to(introOverlay.querySelector('.intro-slogan'), {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.5);
    tl.from(introOverlay.querySelectorAll('.slogan-word'), {
      y: 10,
      opacity: 0,
      stagger: 0.2,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.5);

    tl.to(introOverlay.querySelector('.intro-progress'), {
      opacity: 1,
      duration: 0.4,
      ease: 'power1.out'
    }, 1.5);

    // Progress indicator steps
    const progressEl = introOverlay.querySelector('.intro-progress');
    tl.to(progressEl, { onStart: () => { progressEl.textContent = '0.12'; }, duration: 0.1 }, 1.5);
    tl.to(progressEl, { onStart: () => { progressEl.textContent = '0.34'; }, duration: 0.1 }, 1.8);
    tl.to(progressEl, { onStart: () => { progressEl.textContent = '0.68'; }, duration: 0.1 }, 2.1);
    tl.to(progressEl, { onStart: () => { progressEl.textContent = '1.00'; }, duration: 0.1 }, 2.4);

    // 2.90–3.70s: Holding composition briefly (wait inside timeline)

    // 3.70–4.80s: Break logo apart - segments fly outward and scale up to block the screen
    const seg1 = introOverlay.querySelector('.segment-1');
    const seg2 = introOverlay.querySelector('.segment-2');
    const seg3 = introOverlay.querySelector('.segment-3');
    const seg4 = introOverlay.querySelector('.segment-4');

    // Top-left shard
    tl.to(seg1, {
      x: -1800,
      y: -1800,
      scale: 65,
      rotation: -75,
      transformOrigin: '30% 30%',
      duration: 1.25,
      ease: 'power3.inOut'
    }, 3.7);

    // Top-right shard
    tl.to(seg2, {
      x: 1800,
      y: -1000,
      scale: 65,
      rotation: 75,
      transformOrigin: '70% 30%',
      duration: 1.25,
      ease: 'power3.inOut'
    }, 3.7);

    // Bottom-left shard
    tl.to(seg3, {
      x: -1400,
      y: 1400,
      scale: 65,
      rotation: -45,
      transformOrigin: '40% 70%',
      duration: 1.25,
      ease: 'power3.inOut'
    }, 3.7);

    // Bottom-right shard
    tl.to(seg4, {
      x: 1400,
      y: 1800,
      scale: 65,
      rotation: 45,
      transformOrigin: '70% 80%',
      duration: 1.25,
      ease: 'power3.inOut'
    }, 3.7);

    // Fade out framed borders, corner marks, and slogan elements early
    tl.to([
      introOverlay.querySelector('.intro-slogan'),
      introOverlay.querySelector('.intro-progress'),
      introOverlay.querySelectorAll('.frame-line'),
      introOverlay.querySelectorAll('.corner-mark')
    ], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 3.7);

    // Background color of the overlay transitions to black as pieces expand
    tl.to(introOverlay, {
      backgroundColor: '#040508',
      duration: 1.0,
      ease: 'power3.inOut'
    }, 3.7);

    // 4.35–5.20s: Fade out the entire black intro overlay, disabling pointer events instantly to make it non-interruptibly interactive and seamless
    tl.set(introOverlay, { pointerEvents: 'none' }, 4.35);
    tl.to(introOverlay, {
      opacity: 0,
      duration: 0.85,
      ease: 'power2.inOut'
    }, 4.35);

    // 4.35–5.15s: Landing page fades & staggers in underneath
    // Background first
    tl.to([bgCanvas, webglContainer], { opacity: 1, duration: 0.8, ease: 'power2.out' }, 4.35);
    // Navigation next
    tl.to(topBar, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 4.55);
    // Headline next
    tl.to(heroContent, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 4.65);
    // Centerpiece logo next
    tl.to(centerpieceWrapper, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 4.75);
    // Supporting elements last
    tl.to([credibilityBlock, scrollIndicator], {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }, 4.85);
  }

  const onScroll = () => {
    if (scrollFxPending) return;
    scrollFxPending = true;
    requestAnimationFrame(() => {
      scrollFxPending = false;
      handleScrollEffects();
    });
  };

  // Run scroll handler on scroll, and initially once to lock baseline values
  window.addEventListener('scroll', onScroll, { passive: true });
  handleScrollEffects();
});

