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

const backgroundMusic = document.querySelector('#background-music');
const soundToggle = document.querySelector('.sound-toggle');

if (backgroundMusic && soundToggle) {
  backgroundMusic.volume = 0.18;
  const startMusic = () => backgroundMusic.play().catch(() => {});
  startMusic();

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.sound-toggle')) startMusic();
  }, { once: true });

  soundToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      startMusic();
      soundToggle.textContent = 'SON ON';
      soundToggle.setAttribute('aria-pressed', 'false');
      soundToggle.setAttribute('aria-label', 'Couper la musique');
    } else {
      backgroundMusic.pause();
      soundToggle.textContent = 'SON OFF';
      soundToggle.setAttribute('aria-pressed', 'true');
      soundToggle.setAttribute('aria-label', 'Activer la musique');
    }
  });
}

// Certains navigateurs retardent l’autoplay : on relance la vidéo lorsqu’elle
// entre dans la fenêtre, sans son et sans interrompre la navigation.
document.querySelectorAll('.rosas-video, .vision-video').forEach((video) => {
  video.muted = true;
  video.setAttribute('muted', '');
  const playVideo = () => video.play().catch(() => {});
  playVideo();
  video.addEventListener('loadeddata', playVideo, { once: true });
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) playVideo();
  }, { threshold: 0.05 }).observe(video);
});

const rosasVideo = document.querySelector('#formes .rosas-video');
const formesSection = document.querySelector('#formes');
if (rosasVideo && formesSection) {
  rosasVideo.volume = 0.55;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (backgroundMusic) backgroundMusic.pause();
      rosasVideo.muted = false;
      rosasVideo.removeAttribute('muted');
      rosasVideo.play().catch(() => {});
    } else {
      rosasVideo.muted = true;
      if (backgroundMusic && soundToggle?.getAttribute('aria-pressed') !== 'true') {
        backgroundMusic.play().catch(() => {});
      }
    }
  }, { threshold: 0.45 }).observe(formesSection);
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
