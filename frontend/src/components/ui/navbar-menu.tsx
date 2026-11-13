'use client';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { COPY } from '@/lib/copy';

/** Aceternity navbar-menu, adapted to semantic links, reduced motion and brand tokens. */
export function Menu({ children }: { children: ReactNode }) {
  return <nav className="aceternity-menu" aria-label={COPY.common.mainNavigation}>{children}</nav>;
}

export function MenuItem({ label, href, current, children }: { label: string; href: string; current?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return <div className="aceternity-item" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); (event.currentTarget.querySelector('a') as HTMLAnchorElement | null)?.focus(); } }}>
    <Link href={href} className="aceternity-trigger" aria-current={current ? 'page' : undefined} aria-expanded={children ? open : undefined}>{label}</Link>
    <AnimatePresence>{children && open && <motion.div className="aceternity-panel" initial={reduced ? false : { opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: 6, scale: .98 }} transition={{ duration: reduced ? 0 : .18 }}>
      {children}
    </motion.div>}</AnimatePresence>
  </div>;
}

export function HoveredLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="aceternity-panel-link" href={href}>{children}</Link>;
}
