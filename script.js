const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const navigationLinks = navigation?.querySelectorAll('a') ?? [];
const currentYear = document.querySelector('#current-year');
const revealElements = document.querySelectorAll('.reveal');

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
}

function closeMenu() {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

function toggleMenu() {
  if (!menuToggle || !navigation) return;

  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
}

menuToggle?.addEventListener('click', toggleMenu);
navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}
