document.documentElement.classList.add('js');

// Динамический год в подвале
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Боковое меню ----------
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const drawerClose = document.getElementById('drawerClose');

function openMenu() {
  if (!drawer) return;
  drawer.classList.add('open');
  overlay && overlay.classList.add('show');
  document.body.classList.add('lock');
  burger && burger.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  const first = drawer.querySelector('a');
  if (first) first.focus();
}
function closeMenu() {
  if (!drawer) return;
  drawer.classList.remove('open');
  overlay && overlay.classList.remove('show');
  document.body.classList.remove('lock');
  burger && burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  burger && burger.focus();
}
burger && burger.addEventListener('click', openMenu);
drawerClose && drawerClose.addEventListener('click', closeMenu);
overlay && overlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeMenu();
});
drawer && drawer.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => closeMenu());
});

// ---------- Слайдер услуг ----------
const sliderContainer = document.getElementById('sliderContainer');
const track = document.getElementById('sliderTrack');
const prevBtns = Array.from(document.querySelectorAll('[data-slider-prev]'));
const nextBtns = Array.from(document.querySelectorAll('[data-slider-next]'));

if (sliderContainer && track && prevBtns.length && nextBtns.length) {
  const firstCard = track.querySelector('.service');

  const updateButtons = () => {
    const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
    const atStart = sliderContainer.scrollLeft <= 10;
    const atEnd = sliderContainer.scrollLeft >= maxScroll - 10;
    prevBtns.forEach(b => b.disabled = atStart);
    nextBtns.forEach(b => b.disabled = atEnd);
  };

  // Телефон — на одну карточку, ПК/планшет — на весь видимый блок
  const step = () =>
    window.innerWidth <= 600
      ? firstCard.offsetWidth + 16
      : sliderContainer.clientWidth;

  prevBtns.forEach(b => b.addEventListener('click', () =>
    sliderContainer.scrollBy({ left: -step(), behavior: 'smooth' })));
  nextBtns.forEach(b => b.addEventListener('click', () =>
    sliderContainer.scrollBy({ left: step(), behavior: 'smooth' })));

  sliderContainer.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  window.addEventListener('load', updateButtons);
  setTimeout(updateButtons, 150);
}

// ---------- FAQ ----------
const faqItems = document.querySelectorAll('.faq__grid details');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => { if (other !== item) other.open = false; });
    }
  });
});

// ---------- Прогресс-бар ----------
const progressBar = document.getElementById('progressBar');

function onScroll() {
  const st = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) {
    const pct = h > 0 ? Math.max(0, Math.min(100, (st / h) * 100)) : 0;
    progressBar.style.width = pct + '%';
  }
}
if (progressBar) {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- Появление блоков ----------
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// ---------- Подсветка меню ----------
const sections = document.querySelectorAll('section[id]');
const drawerLinks = document.querySelectorAll('.drawer__nav a[href^="#"]');
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        drawerLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));
}

// ---------- Правовой попап ----------
const legalModal = document.getElementById('legalModal');
const legalTabs = legalModal ? [...legalModal.querySelectorAll('.modal__tab')] : [];
const legalPanes = legalModal ? [...legalModal.querySelectorAll('.modal__pane')] : [];
let lastFocus = null;

function switchTab(name) {
  legalTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  
  legalPanes.forEach(p => {
    if (p.dataset.pane === name) {
      p.hidden = false;
      p.style.animation = 'none';
      p.offsetHeight; /* trigger reflow */
      p.style.animation = null;
    } else {
      p.hidden = true;
    }
  });

  if (legalModal) {
    const body = legalModal.querySelector('.modal__body');
    if (body) body.scrollTop = 0;
  }
}

function openLegal(name) {
  if (!legalModal) return;
  lastFocus = document.activeElement;
  switchTab(name);
  legalModal.classList.add('open');
  legalModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  setTimeout(() => {
    const closeBtn = legalModal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closeLegal() {
  if (!legalModal) return;
  legalModal.classList.remove('open');
  legalModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll('[data-legal]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openLegal(el.dataset.legal);
  });
});

legalModal && legalModal.addEventListener('click', e => {
  if (e.target.closest('[data-modal-close]')) closeLegal();
  const tab = e.target.closest('.modal__tab');
  if (tab) switchTab(tab.dataset.tab);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && legalModal && legalModal.classList.contains('open')) closeLegal();
});

// ---------- Cookie-плашка ----------
const cookieBar = document.getElementById('cookieBar');
const COOKIE_KEY = 'aimaster-cookie-choice';
try {
  if (cookieBar && !localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => {
      cookieBar.classList.add('show');
      cookieBar.setAttribute('aria-hidden', 'false');
    }, 1200);
  }
} catch (err) { /* localStorage недоступен */ }

function hideCookieBar() {
  if (!cookieBar) return;
  cookieBar.classList.remove('show');
  cookieBar.setAttribute('aria-hidden', 'true');
}

const btnAccept = document.getElementById('cookieAccept');
const btnNecessary = document.getElementById('cookieNecessary');

if (btnAccept) {
  btnAccept.addEventListener('click', () => {
    try { localStorage.setItem(COOKIE_KEY, 'all'); } catch (err) {}
    hideCookieBar();
  });
}
if (btnNecessary) {
  btnNecessary.addEventListener('click', () => {
    try { localStorage.setItem(COOKIE_KEY, 'necessary'); } catch (err) {}
    hideCookieBar();
  });
}
// Закрывать боковое меню при возврате на десктопную ширину
window.addEventListener('resize', () => {
  if (window.innerWidth > 1023 && drawer && drawer.classList.contains('open')) closeMenu();
});
