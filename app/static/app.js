(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('main-navigation');
  if (toggle && nav) {
    const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      if (open) nav.querySelector('a')?.focus();
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); toggle.focus(); } });
    document.addEventListener('click', event => { if (!nav.contains(event.target) && !toggle.contains(event.target)) close(); });
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px 45px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }
  document.querySelectorAll('[data-confirm]').forEach(form => {
    form.addEventListener('submit', event => { if (!window.confirm(form.getAttribute('data-confirm'))) event.preventDefault(); });
  });
})();
