const IS_MOBILE_PERF = window.innerWidth <= 768;

function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function observeVisibility(el, onVisible, onHidden, rootMargin = '80px') {
  if (!el || typeof IntersectionObserver === 'undefined') {
    onVisible();
    return () => {};
  }
  let visible = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !visible) {
      visible = true;
      onVisible();
    } else if (!entry.isIntersecting && visible) {
      visible = false;
      onHidden();
    }
  }, { rootMargin });
  observer.observe(el);
  return () => observer.disconnect();
}

export function initSharedUI() {
  const menuToggleBtn = document.querySelector('.menu-toggle');
  const menuCloseBtn = document.querySelector('.menu-close');
  const menuOverlay = document.querySelector('#menu-overlay');
  const cookieBanner = document.querySelector('#cookie-banner');
  const cookieAcceptBtn = document.querySelector('#cookie-accept');
  const cookieDeclineBtn = document.querySelector('#cookie-decline');

  if (menuToggleBtn && menuOverlay) {
    const toggleMenu = (open) => {
      if (open) {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    menuToggleBtn.addEventListener('click', () => toggleMenu(true));
    menuCloseBtn?.addEventListener('click', () => toggleMenu(false));

    menuOverlay.querySelectorAll('.nav-item').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  if (cookieBanner && cookieAcceptBtn && cookieDeclineBtn) {
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
  }

  initBackgroundCanvas();
  initLogoSparks();
  initFooterCanvas();
}

function initBackgroundCanvas() {
  const bgCanvas = document.getElementById('bg-canvas');
  if (!bgCanvas) return;

  const ctx = bgCanvas.getContext('2d');
  const logoImg = new Image();
  logoImg.src = 'auroze_logo.png';

  let width = bgCanvas.width = window.innerWidth;
  let height = bgCanvas.height = window.innerHeight;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const resizeBg = debounce(() => {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
  });
  window.addEventListener('resize', resizeBg);

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) - 0.5;
    targetMouseY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  const starCount = IS_MOBILE_PERF ? 14 : 40;
  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 6,
    speed: Math.random() * 0.015 + 0.003,
    phase: Math.random() * Math.PI * 2,
    rotOffset: Math.random() * Math.PI * 2
  }));

  const lines = [
    { startX: -0.2, startY: -0.2, endX: 0.8, endY: 1.2, parallax: 40 },
    { startX: 0.2, startY: -0.2, endX: 1.2, endY: 0.8, parallax: 60 },
    { startX: -0.5, startY: 0.3, endX: 0.5, endY: 1.3, parallax: 25 },
    { startX: 0.4, startY: -0.5, endX: 1.4, endY: 0.5, parallax: 80 }
  ];

  let bgRafId = null;
  let bgActive = true;

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && bgActive && !bgRafId) drawBackground();
  });

  observeVisibility(
    bgCanvas,
    () => {
      bgActive = true;
      if (!document.hidden && !bgRafId) drawBackground();
    },
    () => {
      bgActive = false;
      if (bgRafId) {
        cancelAnimationFrame(bgRafId);
        bgRafId = null;
      }
    },
    '120px'
  );

  const drawBackground = () => {
    if (!bgActive || document.hidden) {
      bgRafId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    stars.forEach((star) => {
      star.phase += star.speed;
      const opacity = ((Math.sin(star.phase) + 1) / 2) * 0.35 + 0.05;
      const x = (star.x / 100) * width + mouseX * 25;
      const y = (star.y / 100) * height + mouseY * 25;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(star.phase * 0.15 + star.rotOffset);
      ctx.globalAlpha = opacity;
      if (logoImg.complete) {
        ctx.drawImage(logoImg, -star.size / 2, -star.size / 2, star.size, star.size);
      }
      ctx.restore();
    });

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    lines.forEach((line) => {
      const px = mouseX * line.parallax;
      const py = mouseY * line.parallax;
      ctx.beginPath();
      ctx.moveTo(line.startX * width + px, line.startY * height + py);
      ctx.lineTo(line.endX * width + px, line.endY * height + py);
      ctx.stroke();
    });

    bgRafId = requestAnimationFrame(drawBackground);
  };

  drawBackground();
}

function initLogoSparks() {
  const sparksCanvas = document.getElementById('logo-sparks-canvas');
  const logoContainer = document.querySelector('.top-bar .logo');
  if (!sparksCanvas || !logoContainer) return;

  const sparksCtx = sparksCanvas.getContext('2d');
  let logoSparks = [];
  const maxLogoSparks = 50;

  sparksCanvas.width = 100;
  sparksCanvas.height = 100;

  const addLogoSpark = (x, y) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (logoSparks.length >= maxLogoSparks) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.8;
    logoSparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.05 + 0.03,
      size: Math.random() * 2 + 0.8,
      color: Math.random() > 0.4 ? 'rgba(255, 95, 0, ' : 'rgba(255, 255, 255, '
    });
  };

  let sparksRafId = null;

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
      spark.vy += 0.03;
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

  logoContainer.addEventListener('mousemove', (e) => {
    const rect = sparksCanvas.getBoundingClientRect();
    const mX = ((e.clientX - rect.left) / rect.width) * 100;
    const mY = ((e.clientY - rect.top) / rect.height) * 100;
    addLogoSpark(mX, mY);
    addLogoSpark(mX, mY);
    queueSparkUpdate();
  });

  logoContainer.addEventListener('mouseenter', () => {
    for (let i = 0; i < 12; i++) addLogoSpark(50, 50);
    queueSparkUpdate();
  });
}
function initFooterCanvas() {
  const canvas = document.getElementById('footer-lines-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth <= 900;
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const offscreen = document.createElement('canvas');
  const oCtx = offscreen.getContext('2d');

  let cachedPixels = null;

  const renderTextToOffscreen = () => {
    offscreen.width = width;
    offscreen.height = height;
    oCtx.fillStyle = '#000000';
    oCtx.fillRect(0, 0, width, height);
    const fontSize = Math.min(width * 0.17, height * 0.95);
    oCtx.font = `900 ${fontSize}px Outfit, sans-serif`;
    oCtx.fillStyle = '#ffffff';
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    oCtx.fillText('AUROZE', width / 2, height / 2);
    cachedPixels = oCtx.getImageData(0, 0, width, height).data;
  };

  renderTextToOffscreen();

  const resizeFooter = debounce(() => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    renderTextToOffscreen();
  });
  window.addEventListener('resize', resizeFooter);

  let mouseX = -1000;
  let mouseY = -1000;
  let tick = 0;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

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
        const isWhitePixel = pixels[pixelIdx] > 128;

        if (isWhitePixel) {
          if (!isDrawingSegment) {
            isDrawingSegment = true;
            segmentStart = x;
          }
        } else if (isDrawingSegment) {
          isDrawingSegment = false;
          ctx.beginPath();
          const steps = Math.ceil((x - segmentStart) / 4);
          for (let s = 0; s <= steps; s++) {
            const ptX = segmentStart + (s / steps) * (x - segmentStart);
            let ptY = y;
            const dist = Math.hypot(ptX - mouseX, ptY - mouseY);
            if (dist < 110) {
              const force = (110 - dist) / 110;
              ptY += Math.sin(ptX * 0.12 - tick * 14) * 15 * force;
            }
            if (s === 0) ctx.moveTo(ptX, ptY);
            else ctx.lineTo(ptX, ptY);
          }
          ctx.stroke();
        }
      }

      if (isDrawingSegment) {
        ctx.beginPath();
        ctx.moveTo(segmentStart, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    footerRafId = requestAnimationFrame(drawScanlines);
  };

  observeVisibility(
    canvas,
    () => {
      footerActive = true;
      if (!document.hidden && !footerRafId) drawScanlines();
    },
    () => {
      footerActive = false;
      if (footerRafId) {
        cancelAnimationFrame(footerRafId);
        footerRafId = null;
      }
    },
    '100px'
  );

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && footerActive && !footerRafId) drawScanlines();
  });
}
