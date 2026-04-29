const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('back-top').classList.toggle('show', window.scrollY > 400);
}, { passive: true });

// ─── ACTIVE NAV LINK ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1500;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

// Trigger counters when hero is visible (on load)
window.addEventListener('load', () => {
  document.querySelectorAll('.counter').forEach(el => animateCounter(el));
});

// ─── HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── BACK TO TOP ───
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── FLOAT CARDS PARALLAX ───
const heroFloat = document.querySelector('.hero-float');
if (heroFloat) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    heroFloat.style.transform = `translateY(calc(-50% + ${y}px)) translateX(${x}px)`;
  }, { passive: true });
}

// ─── VEHICLE SLIDER ───
(function() {
  const slides = document.querySelectorAll('.veh-slide');
  const tabs = document.querySelectorAll('.veh-tab');
  const dots = document.querySelectorAll('.veh-dot');
  const progressBar = document.getElementById('veh-progress');
  const TOTAL = slides.length;
  let current = 0;
  let autoTimer = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    tabs[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (idx + TOTAL) % TOTAL;

    slides[current].classList.add('active');
    tabs[current].classList.add('active');
    dots[current].classList.add('active');

    // Reset & restart progress bar
    progressBar.classList.remove('animating');
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressBar.classList.add('animating');
        progressBar.style.transition = 'width 4.5s linear';
        progressBar.style.width = '100%';
      });
    });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4800);
  }

  function resetAuto() {
    startAuto();
  }

  // Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      goTo(+tab.dataset.idx);
      resetAuto();
    });
  });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(+dot.dataset.idx);
      resetAuto();
    });
  });

  // Arrows
  document.getElementById('veh-next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  document.getElementById('veh-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetAuto(); }
  });

  // Touch/swipe
  const showcase = document.getElementById('veh-showcase');
  let touchStartX = 0;
  showcase.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  showcase.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });

  // Pause on hover
  showcase.addEventListener('mouseenter', () => clearInterval(autoTimer));
  showcase.addEventListener('mouseleave', () => startAuto());

  // Init
  goTo(0);
  startAuto();
})();