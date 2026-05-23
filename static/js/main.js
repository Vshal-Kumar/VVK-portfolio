'use strict';

/* ════════════════════════════════════════
   VVK Portfolio — main.js  (fixed & optimised)
   ════════════════════════════════════════ */

// ── Preloader ─────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const el = document.getElementById('preloader');
    if (el) {
      el.classList.add('hidden');
      setTimeout(() => el.remove(), 750);
    }
  }, 2300);
});


// ── Cursor (RAF-based, no lag) ────────────────
const cur = document.getElementById('cursor');
const fol = document.getElementById('follower') || document.getElementById('cursor-follower');
let mx = -100, my = -100, fx = -100, fy = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

if (cur) {
  (function tick() {
    // dot snaps instantly
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
    // follower lerps
    if (fol) {
      fx += (mx - fx) * 0.13;
      fy += (my - fy) * 0.13;
      fol.style.left = fx + 'px';
      fol.style.top  = fy + 'px';
    }
    requestAnimationFrame(tick);
  })();

  // grow on interactive elements
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .chip, .cert-card, .project-card, .nav-item, .contact-icon-btn')) {
      document.body.classList.add('cursor-grow');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .chip, .cert-card, .project-card, .nav-item, .contact-icon-btn')) {
      document.body.classList.remove('cursor-grow');
    }
  });
}

// ── Scroll-reveal ─────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.10, rootMargin: '0px 0px -55px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Active nav on scroll ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item[data-section]');

function updateNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 220) current = s.id;
  });
  navItems.forEach(n => {
    n.classList.toggle('active', n.dataset.section === current);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Smooth scroll on nav click
navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const t = document.getElementById(item.dataset.section);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Skill bars ────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(f => {
        setTimeout(() => { f.style.width = f.dataset.width + '%'; }, 150);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });

const barsEl = document.querySelector('.skills-bars');
if (barsEl) skillObs.observe(barsEl);

// ── Scroll-to-top button ──────────────────────
const topBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (topBtn) topBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Hero parallax ─────────────────────────────
const heroWrap = document.querySelector('.hero-photo-wrap');
const heroBg   = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroWrap) heroWrap.style.transform = `translate(-50%, calc(-50% + ${y * 0.11}px))`;
  if (heroBg)   heroBg.style.transform   = `translateY(${y * 0.06}px)`;
}, { passive: true });

// ── Footer / anchor links ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const t  = document.getElementById(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Contact form ──────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  const $ = id => document.getElementById(id);

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function setErr(inputId, errId, msg) {
    const inp = $(inputId), err = $(errId);
    if (err) err.textContent = msg;
    if (inp) inp.style.borderColor = msg ? 'rgba(224,112,112,.5)' : '';
    return !msg;
  }

  // Live validation
  $('name')?.addEventListener('input',    function(){ setErr('name',    'nameError',    this.value.trim().length >= 2 ? '' : 'At least 2 characters.'); });
  $('email')?.addEventListener('input',   function(){ setErr('email',   'emailError',   isEmail(this.value.trim())   ? '' : 'Enter a valid email.'); });
  $('subject')?.addEventListener('input', function(){ setErr('subject', 'subjectError', this.value.trim().length >= 3 ? '' : 'At least 3 characters.'); });
  $('message')?.addEventListener('input', function(){ setErr('message', 'messageError', this.value.trim().length >= 15 ? '' : 'At least 15 characters.'); });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = $('name').value.trim();
    const email   = $('email').value.trim();
    const subject = $('subject').value.trim();
    const message = $('message').value.trim();
    const honey   = form.querySelector('[name="website"]').value;
    const alert   = $('formAlert');
    const btn     = $('submitBtn');
    const btnText = $('submitText');

    if (honey) return; // bot

    let ok = true;
    ok = setErr('name',    'nameError',    name.length >= 2    ? '' : 'At least 2 characters.')    && ok;
    ok = setErr('email',   'emailError',   isEmail(email)      ? '' : 'Enter a valid email.')       && ok;
    ok = setErr('subject', 'subjectError', subject.length >= 3 ? '' : 'At least 3 characters.')     && ok;
    ok = setErr('message', 'messageError', message.length >= 15 ? '' : 'At least 15 characters.')   && ok;
    if (!ok) return;

    btn.disabled = true;
    btnText.textContent = 'Sending…';
    alert.className = '';
    alert.style.display = 'none';

    try {
      const res  = await fetch('/send_email', { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (data.success) {
        alert.textContent = '✓ Message sent! I\'ll get back to you soon.';
        alert.className = 'success';
        form.reset();
      } else {
        alert.textContent = data.message || '✗ Something went wrong. Please try again.';
        alert.className = 'error';
      }
    } catch {
      alert.textContent = '✗ Network error. Please email me directly.';
      alert.className = 'error';
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Send Message';
    }
  });
}