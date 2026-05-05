/* ================================================================
   MARS — Modern Analytics & Research Solutions
   script.js v2.0
   ================================================================ */

(function () {

  /* ------------------------------------------------------------------
     1. Footer year
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ------------------------------------------------------------------
     2. Mobile nav toggle
  ------------------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel  = document.querySelector('#primary-nav');

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      const open = navPanel.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navPanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navPanel.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ------------------------------------------------------------------
     3. Back-to-top: show after 400px of scroll
  ------------------------------------------------------------------ */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', function () {
      btt.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });
  }


  /* ------------------------------------------------------------------
     4. Scrollspy — highlights correct nav link as sections scroll into view
  ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-list a[href^="#"]');

  if (sections.length && navLinks.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px'
    });

    sections.forEach(function (s) { spy.observe(s); });
  }


  /* ------------------------------------------------------------------
     5. Scroll-reveal — adds .visible to .reveal elements on entry
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }


  /* ------------------------------------------------------------------
     6. Contact form — async Formspree submission
  ------------------------------------------------------------------ */
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const res = await fetch(form.action, {
          method:  'POST',
          body:    new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          formStatus.textContent = "Message received — we'll be in touch soon.";
          formStatus.className   = 'form-status form-status--success';
          form.reset();
        } else {
          const data = await res.json();
          throw new Error(data.error || 'Server error');
        }
      } catch (err) {
        formStatus.textContent = 'Something went wrong. Please email us directly at dstone@mars-logic.com';
        formStatus.className   = 'form-status form-status--error';
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
        formStatus.removeAttribute('hidden');
      }
    });
  }


  /* ------------------------------------------------------------------
     7. Boot-lock: remove html.boot-lock then force scroll to top
  ------------------------------------------------------------------ */
  function forceTopIfNoHash() {
    if (!location.hash) {
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { window.scrollTo(0, 0); });
      setTimeout(function () { window.scrollTo(0, 0); }, 60);
      setTimeout(function () { window.scrollTo(0, 0); }, 180);
    }
  }

  window.addEventListener('load', function () {
    document.documentElement.classList.remove('boot-lock');
    forceTopIfNoHash();
  }, { once: true });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) forceTopIfNoHash();
  });

  window.addEventListener('orientationchange', function () {
    setTimeout(forceTopIfNoHash, 60);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setTimeout(forceTopIfNoHash, 80);
    });
  }

})();
