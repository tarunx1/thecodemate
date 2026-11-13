'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from './ui';
import { Drawer } from './overlays';
import { HoveredLink, Menu, MenuItem } from './ui/navbar-menu';
import { COPY } from '@/lib/copy';

const links = [
  { href: '/topics', label: COPY.common.topics },
  { href: '/projects', label: COPY.common.projects },
  { href: '/#services', label: COPY.public.services },
  { href: '/#about', label: COPY.public.about },
];

/** Site-specific version of the installed Aceternity navbar demo. */
export default function NavbarDemo({ variant = 'light' }: { variant?: 'overlay' | 'light' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = (href: string) => !href.includes('#') && (pathname === href || pathname.startsWith(href + '/'));
  return <header className={`site-header site-header-${variant}`}>
    <div className="site-nav container">
      <Link className="wordmark" href="/">{COPY.brand.name}<span>.</span></Link>
      <div className="site-links"><Menu>
        <MenuItem label={COPY.common.topics} href="/topics" current={current('/topics')}><HoveredLink href="/topics">{COPY.public.exploreAllTopics} <ArrowRight size={15} aria-hidden="true"/></HoveredLink></MenuItem>
        <MenuItem label={COPY.common.projects} href="/projects" current={current('/projects')}><HoveredLink href="/projects">{COPY.public.viewAllProjects} <ArrowRight size={15} aria-hidden="true"/></HoveredLink></MenuItem>
        <MenuItem label={COPY.public.services} href="/#services"/>
        <MenuItem label={COPY.public.about} href="/#about"/>
      </Menu></div>
      <ButtonLink href="/topics" className="site-cta">{COPY.public.exploreTopics} <ArrowRight size={16} aria-hidden="true"/></ButtonLink>
      <button type="button" className="public-menu icon-button" aria-label={COPY.public.openNavigation} aria-expanded={open} onClick={() => setOpen(true)}><MenuIcon size={22}/></button>
    </div>
    <Drawer open={open} onClose={() => setOpen(false)} title={COPY.public.menu} side="right" tone="dark">
      <nav className="drawer-nav" aria-label={COPY.public.menu}>
        {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={current(link.href) ? 'page' : undefined}>{link.label}</Link>)}
      </nav>
      <ButtonLink href="/topics" className="drawer-cta">{COPY.public.exploreTopics} <ArrowRight size={16} aria-hidden="true"/></ButtonLink>
    </Drawer>
  </header>;
}
