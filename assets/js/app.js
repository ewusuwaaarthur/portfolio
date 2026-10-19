/* Portfolio interactions — nav, reveal, counters, rotating word, form */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar: glass on scroll, back-to-top ---------- */
  var nav = $('#nav'), toTop = $('#to-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('scrolled', y > 24);
    toTop.classList.toggle('show', y > 700);
    updateTimeline();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menu-toggle');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('#nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active link while scrolling ---------- */
  var links = $$('#nav-links a');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(runCounter); }

  /* ---------- Rotating headline word ---------- */
  var rot = $('#rotator');
  if (rot && !reduce) {
    var words = ['web apps', 'school systems', 'clean interfaces', 'useful tools'], i = 0;
    setInterval(function () {
      rot.classList.add('out');
      setTimeout(function () { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 350);
    }, 2600);
  }

  /* ---------- Timeline progress line + dots ---------- */
  var tl = $('#timeline'), prog = $('#tl-progress'), tlItems = $$('.tl-item');
  function updateTimeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.6 - r.top) / r.height;
    p = Math.max(0, Math.min(1, p));
    prog.style.height = (p * (r.height - 16)) + 'px';
    tlItems.forEach(function (it) {
      var ir = it.getBoundingClientRect();
      it.classList.toggle('lit', ir.top < vh * 0.62);
    });
  }
  window.addEventListener('resize', updateTimeline);

  /* ---------- "Ask me about this" prefills the form ---------- */
  var message = $('#message');
  $$('[data-project]').forEach(function (a) {
    a.addEventListener('click', function () {
      message.value = "Hi Emmanuella, I'd love to know more about " + a.getAttribute('data-project') + ".";
    });
  });

  /* ---------- Contact form → opens email app, filled in ---------- */
  var form = $('#contact-form'), status = $('#form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
      status.style.color = 'var(--accent-text)';
      status.textContent = 'Please fill in your name, a valid email and a short message.';
      return;
    }
    var subject = encodeURIComponent('Portfolio enquiry: ' + form.topic.value);
    var body = encodeURIComponent(msg + '\n\n— ' + name + '\n' + email);
    status.style.color = 'var(--green)';
    status.textContent = 'Thank you, ' + name.split(' ')[0] + '! Opening your email app…';
    window.location.href = 'mailto:ewusuwaaarthur@gmail.com?subject=' + subject + '&body=' + body;
  });

  /* ---------- Footer year + init ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  onScroll();
})();
