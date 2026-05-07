/* GSCG Spring 2026 — Main JS */

// ── NAV: scroll state + hamburger ──────────────────────
(function () {
  const nav  = document.getElementById('site-nav');
  const ham  = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-drawer');

  if (!nav) return;

  // Scroll state
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Hamburger toggle
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (href !== '' && href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
})();

// ── SCROLL REVEAL ──────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

// ── IMAGE LIGHTBOX ─────────────────────────────────────
(function () {
  // Build overlay once
  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:9999',
    'background:rgba(0,0,0,.82)',
    'align-items:center',
    'justify-content:center',
    'cursor:zoom-out',
    'padding:2rem',
    'backdrop-filter:blur(4px)',
    '-webkit-backdrop-filter:blur(4px)',
  ].join(';');

  const img = document.createElement('img');
  img.style.cssText = [
    'max-width:92vw',
    'max-height:90vh',
    'object-fit:contain',
    'border-radius:8px',
    'box-shadow:0 24px 80px rgba(0,0,0,.6)',
    'transition:transform .2s ease',
    'pointer-events:none',
  ].join(';');

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // Close on click or Escape
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  function open(src, alt) {
    img.src  = src;
    img.alt  = alt || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    img.src = '';
  }

  // Wire up all content images (skip tiny logos/icons)
  function wireImages() {
    document.querySelectorAll('img').forEach(el => {
      // Skip if already wired, or if it's a small decorative image
      if (el.dataset.lbWired) return;
      el.dataset.lbWired = '1';

      const skip = el.closest('#site-nav') || el.closest('#site-footer') ||
                   el.closest('.advisor-avatar') || el.naturalWidth < 80;
      if (skip) return;

      el.style.cursor = 'zoom-in';
      el.addEventListener('click', e => {
        e.stopPropagation();
        open(el.src, el.alt);
      });
    });
  }

  // Wire on load and after any dynamic content
  document.addEventListener('DOMContentLoaded', wireImages);
  window.addEventListener('load', wireImages);
})();

// ── ANIMATED COUNTERS ──────────────────────────────────
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
        el.textContent = Math.round(ease * end);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = end;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();
