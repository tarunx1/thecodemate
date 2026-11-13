'use client';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COPY } from '@/lib/copy';
export function CardRail({ children }: { children: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  function move(direction: number) { const node = rail.current; if (node) node.scrollBy({ left: direction * (node.firstElementChild?.getBoundingClientRect().width || 400), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
  return <div className="card-rail"><div ref={rail} className="content-grid card-track">{children}</div><div className="rail-controls"><button type="button" onClick={() => move(-1)} aria-label={COPY.common.previous}><ArrowLeft size={20}/></button><button type="button" onClick={() => move(1)} aria-label={COPY.common.next}><ArrowRight size={20}/></button></div></div>;
}
