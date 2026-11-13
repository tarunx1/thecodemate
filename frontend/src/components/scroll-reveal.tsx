'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const animations = new Set<Animation>();
    const elements = document.querySelectorAll<HTMLElement>('.public-theme .section-heading, .public-theme .learning-intro,.public-theme .about-section > div, .public-theme .explore-cta, .public-theme .services-head, .public-theme .service-intro, .public-theme .service-panels, .public-theme .services-process, .public-theme .services-cta, .public-theme .site-footer, .public-theme .directory-head, .public-theme .filters, .public-theme .article-head, .public-theme .article-cover, .public-theme .article-body > :not(.steps), .public-theme .steps > h2, .public-theme .step');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const node = entry.target as HTMLElement;
      // Headings and prose rise gently. Cards and the learning accordion are never animated: they stay where they render.
      const animation = node.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.16,.84,.3,1)', fill: 'backwards' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
      observer.unobserve(node);
    }), { threshold: 0.08 });
    elements.forEach(node => observer.observe(node));
    const stop = () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); };
    preference.addEventListener('change', stop);
    return () => { stop(); preference.removeEventListener('change', stop); };
  }, [path]);
  return null;
}
