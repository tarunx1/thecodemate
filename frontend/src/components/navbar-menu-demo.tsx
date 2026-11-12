'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from './ui';
import { Drawer } from './overlays';
import { HoveredLink, Menu, MenuItem } from './ui/navbar-menu';

const links = [
  { href: '/topics', label: 'Topics' },
  { href: '/projects', label: 'Projects' },
  { href: '/#about', label: 'About' },
];

/** Site-specific version of the installed Aceternity navbar demo. */
export default function NavbarDemo({ variant = 'light' }: { variant?: 'overlay' | 'light' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = (href: string) => !href.includes('#') && (pathname === href || pathname.startsWith(href + '/'));
  return <header className={`site-header site-header-${variant}`}>
    <div className="site-nav container">
      <Link className="wordmark" href="/">thecodemate<span>.</span></Link>
      <div className="site-links"><Menu>
        <MenuItem label="Topics" href="/topics" current={current('/topics')}><HoveredLink href="/topics">Explore all topics <ArrowRight size={15} aria-hidden="true"/></HoveredLink></MenuItem>
        <MenuItem label="Projects" href="/projects" current={current('/projects')}><HoveredLink href="/projects">View all projects <ArrowRight size={15} aria-hidden="true"/></HoveredLink></MenuItem>
        <MenuItem label="About" href="/#about"/>
      </Menu></div>
      <ButtonLink href="/topics" className="site-cta">Explore topics <ArrowRight size={16} aria-hidden="true"/></ButtonLink>
      <button type="button" className="public-menu icon-button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><MenuIcon size={22}/></button>
    </div>
    <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="right" tone="dark">
      <nav className="drawer-nav" aria-label="Mobile navigation">
        {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={current(link.href) ? 'page' : undefined}>{link.label}</Link>)}
      </nav>
      <ButtonLink href="/topics" className="drawer-cta">Explore topics <ArrowRight size={16} aria-hidden="true"/></ButtonLink>
    </Drawer>
  </header>;
}
