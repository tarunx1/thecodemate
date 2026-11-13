'use client';
import { useEffect, useRef, useState } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts up to `value` the first time it scrolls into view. The server renders the final number. */
export function CountUp({ value }: { value: number }) {
  const node = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const element = node.current;
    if (!element || value <= 0 || reducedMotion()) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const started = performance.now();
      const duration = Math.min(1400, 500 + value * 60);
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      setShown(0);
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={node} className="count-up">{shown}</span>;
}

/** Thin accent bar showing how far the reader is through the page. Decorative. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${range > 0 ? Math.min(1, window.scrollY / range) : 0})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);
  return <div className="reading-progress" aria-hidden="true"><div ref={bar}/></div>;
}

/** Feeds the pointer position to `.content-card` so CSS can draw a soft glow under the cursor. */
export function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.('.content-card') as HTMLElement | null;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', `${event.clientX - box.left}px`);
      card.style.setProperty('--glow-y', `${event.clientY - box.top}px`);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => document.removeEventListener('pointermove', move);
  }, []);
  return null;
}

/** Sticky in-page index that marks the sub-section currently crossing the middle of the viewport. */
export function SectionIndex({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const targets = items.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);
  return <nav className="services-index" aria-label={label}>
    <ol>{items.map((item, index) => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}><span className="service-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item.label}</a></li>)}</ol>
  </nav>;
}
