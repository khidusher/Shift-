import { event, pillars, speakers, schedule, experienceThemes } from './event-data.js';
import { getCountdown } from './countdown.js';
import { initSpotlight } from './spotlight.js';
import { setPressedChoice } from './selection.js';
import { escapeHtml } from './escape-html.js';

function renderPillars() {
  const container = document.querySelector('[data-pillars]');
  if (!container) return;
  container.innerHTML = pillars.map((pillar) => `
    <article class="pillar-card pillar-${escapeHtml(pillar.tone)} reveal" data-spotlight data-choice tabindex="0" role="button" aria-pressed="false">
      <div class="pillar-top"><span>${escapeHtml(pillar.number)}</span><span class="pillar-mark" aria-hidden="true">${escapeHtml(pillar.mark)}</span></div>
      <div class="pillar-bottom"><h3>${escapeHtml(pillar.title)}</h3><p>${escapeHtml(pillar.description)}</p><span class="pillar-arrow" aria-hidden="true">↗</span></div>
    </article>`).join('');
}

function renderExperiences() {
  const container = document.querySelector('[data-experiences]');
  if (!container) return;
  container.innerHTML = experienceThemes.map((theme, index) => `
    <div class="experience-row reveal"><span class="experience-number">0${index + 1}</span><span>${escapeHtml(theme)}</span><span class="experience-cross" aria-hidden="true">↗</span></div>`).join('');
}

function renderSpeakers() {
  const container = document.querySelector('[data-speakers]');
  if (!container) return;
  if (speakers.length === 0) {
    container.innerHTML = `
      <article class="speaker-placeholder speaker-primary reveal" data-spotlight><span class="placeholder-orbit" aria-hidden="true">S</span><span class="placeholder-tag">Speaker / Mentor</span><div><h3>Details coming soon.</h3><p>Confirmed speakers and mentors will be announced here.</p></div><span class="placeholder-index">01 / —</span></article>
      <article class="speaker-placeholder speaker-secondary reveal"><span class="placeholder-tag">More to come</span><span class="speaker-plus" aria-hidden="true">+</span><div><h3>Space for new voices.</h3><p>Names and details will be added when confirmed.</p></div></article>`;
    return;
  }
  container.innerHTML = speakers.map((speaker) => `<article class="speaker-placeholder reveal"><span class="placeholder-tag">${escapeHtml(speaker.role ?? 'Speaker / Mentor')}</span><div><h3>${escapeHtml(speaker.name)}</h3><p>${escapeHtml(speaker.bio ?? '')}</p></div></article>`).join('');
}

function renderSchedule() {
  const container = document.querySelector('[data-schedule]');
  if (!container) return;
  if (schedule.length > 0) {
    container.innerHTML = `
      <div class="schedule-date"><span>SHIFT 1.0</span><span>Saturday · 28 Nov 2026</span></div>
      <div class="confirmed-schedule">${schedule.map((item) => `
        <article class="confirmed-session"><span>${escapeHtml(item.time)}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description ?? '')}</p></div></article>`).join('')}
      </div>`;
    return;
  }
  container.dataset.state = 'placeholder';
}

function initCountdown() {
  const countdown = document.querySelector('[data-countdown]');
  if (!countdown) return;
  const target = new Date(countdown.dataset.target);
  const fields = {
    days: countdown.querySelector('[data-days]'),
    hours: countdown.querySelector('[data-hours]'),
    minutes: countdown.querySelector('[data-minutes]'),
    seconds: countdown.querySelector('[data-seconds]'),
  };
  const note = document.querySelector('[data-countdown-note]');
  let timer = null;
  const update = () => {
    const remaining = getCountdown(target);
    for (const [unit, node] of Object.entries(fields)) {
      if (node) node.textContent = String(remaining[unit]).padStart(unit === 'days' ? 3 : 2, '0');
    }
    if (remaining.isPast) {
      countdown.setAttribute('aria-label', `${event.name} has started.`);
      if (note) note.textContent = 'Today is the day. We look forward to seeing you at UENR.';
      if (timer !== null) window.clearInterval(timer);
    }
  };
  update();
  if (!getCountdown(target).isPast) timer = window.setInterval(update, 1000);
}

function initNavigation() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#primary-menu');
  const pageContent = [document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);
  const menuLinks = [...(menu?.querySelectorAll('a[href]') ?? [])];
  const firstLink = menuLinks[0];
  const lastLink = menuLinks.at(-1);
  const setMenuOpen = (open) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menu?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    pageContent.forEach((content) => { content.inert = open; });
  };
  const closeMenu = () => {
    setMenuOpen(false);
    toggle?.focus({ preventScroll: true });
  };

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
    if (!isOpen) firstLink?.focus({ preventScroll: true });
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  menu?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && event.target === firstLink) {
      event.preventDefault();
      toggle?.focus({ preventScroll: true });
    } else if (!event.shiftKey && event.target === lastLink) {
      event.preventDefault();
      toggle?.focus({ preventScroll: true });
    }
  });
  toggle?.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true' || event.key !== 'Tab') return;
    if (event.shiftKey) {
      event.preventDefault();
      lastLink?.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
    if (event.matches && toggle?.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

function initSelectableCards() {
  document.querySelectorAll('[data-select-group]').forEach((group) => {
    const choices = [...group.querySelectorAll('[data-choice]')];
    group.addEventListener('click', (event) => {
      const selected = event.target.closest('[data-choice]');
      if (selected && group.contains(selected)) setPressedChoice(choices, selected);
    });
    group.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const selected = event.target.closest('[data-choice]');
      if (!selected || !group.contains(selected)) return;
      event.preventDefault();
      setPressedChoice(choices, selected);
    });
  });
}

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    group.classList.add('has-reveal-stagger');
  });

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  targets.forEach((target) => observer.observe(target));
}

renderPillars();
renderExperiences();
renderSpeakers();
renderSchedule();
initNavigation();
initSelectableCards();
initCountdown();
initReveal();
initSpotlight();
