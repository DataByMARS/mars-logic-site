// Set current year in the footer
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Highlight the active nav link while scrolling
(function () {
  const links = Array.from(document.querySelectorAll('.nav-list a'));
  if (!('IntersectionObserver' in window) || links.length === 0) return;

  // Map section id -> link element
  const linkById = new Map(
    links
      .map(a => (a.getAttribute('href') || '').trim())
      .filter(href => href.startsWith('#'))
      .map(href => [href.slice(1), document.querySelector(`.nav-list a[href="${href}"]`)])
  );

  const sections = Array.from(document.querySelectorAll('section[id]'))
    .filter(sec => linkById.has(sec.id));

  const setActive = (id) => {
    links.forEach(a => a.classList.remove('active'));
    const link = linkById.get(id);
    if (link) link.classList.add('active');
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    root: null,
    // Trigger when the section is roughly in the middle of the screen
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0.01
  });

  sections.forEach(sec => observer.observe(sec));

  // Fallback: clicking a link sets it active immediately
  links.forEach(a => {
    a.addEventListener('click', () => {
      links.forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
  });
})();
