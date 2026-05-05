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
