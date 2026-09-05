const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const links = [...document.querySelectorAll('.rail a, #main-nav a')];
const sections = [...document.querySelectorAll('.page')];
const reveals = [...document.querySelectorAll('.reveal')];

// Certains navigateurs retardent l’autoplay : on relance la vidéo lorsqu’elle
// entre dans la fenêtre, sans son et sans interrompre la navigation.
const formasVideo = document.querySelector('#formes .rosas-video');
if (formasVideo) {
  formasVideo.muted = true;
  formasVideo.setAttribute('muted', '');
  const playFormasVideo = () => formasVideo.play().catch(() => {});
  playFormasVideo();
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) playFormasVideo();
  }, { threshold: 0.05 }).observe(formasVideo);
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    history.replaceState(null, '', `#${entry.target.id}`);
  });
}, { threshold: 0.52 });

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((item) => revealObserver.observe(item));

document.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) return;
  const current = sections.findIndex((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * .45 && rect.bottom >= window.innerHeight * .45;
  });
  const direction = event.key === 'ArrowDown' || event.key === 'PageDown' ? 1 : -1;
  const target = sections[Math.min(sections.length - 1, Math.max(0, current + direction))];
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
