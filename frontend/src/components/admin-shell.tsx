'use client';
import { COPY } from '@/lib/copy';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, BookOpen, FolderKanban, Image as ImageIcon, Settings, ExternalLink, LogOut, Menu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Drawer } from './overlays';

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin', label: COPY.common.dashboard, icon: LayoutDashboard },
  { href: '/admin/topics', label: COPY.common.topics, icon: BookOpen },
  { href: '/admin/projects', label: COPY.common.projects, icon: FolderKanban },
  { href: '/admin/media', label: COPY.common.media, icon: ImageIcon },
  { href: '/admin/settings', label: COPY.common.settings, icon: Settings },
];
function csrf() { return document.cookie.split('; ').find(x => x.startsWith('tc_admin_csrf='))?.split('=')[1] || ''; }
const isActive = (pathname: string, href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'));

/** One navigation list, rendered in the desktop sidebar and inside the mobile Drawer. */
function AdminNav({ pathname, onNavigate, onLogout }: { pathname: string; onNavigate?: () => void; onLogout: () => void }) {
  return <>
    <nav className="sidebar-nav" aria-label={COPY.admin.navigation}>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`sidebar-item ${isActive(pathname, href) ? 'active' : ''}`} aria-current={isActive(pathname, href) ? 'page' : undefined} onClick={onNavigate}><Icon size={18} aria-hidden="true"/><span>{label}</span></Link>)}</nav>
    <div className="sidebar-footer"><Link href="/" className="sidebar-item" onClick={onNavigate}><ExternalLink size={18} aria-hidden="true"/><span>{COPY.admin.viewWebsite}</span></Link><button type="button" className="sidebar-item" onClick={onLogout}><LogOut size={18} aria-hidden="true"/><span>{COPY.admin.logout}</span></button></div>
  </>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  if (pathname === '/admin/login') return <div className="admin-theme login-theme">{children}</div>;
  if (pathname.startsWith('/admin/preview/')) return <>{children}</>;
  async function logout() { const response = await fetch('/api/admin/logout', { method: 'POST', headers: { 'x-csrf-token': csrf() } }); if (response.ok) { setOpen(false); router.push('/admin/login'); router.refresh(); } }
  return <div className="admin-theme admin-shell">
    <aside className="admin-sidebar" aria-label={COPY.admin.navigationLabel}><div className="sidebar-header"><Link href="/admin" className="wordmark">{COPY.brand.name}<span>.</span></Link></div><AdminNav pathname={pathname} onLogout={logout}/></aside>
    <Drawer open={open} onClose={() => setOpen(false)} title={COPY.admin.drawerTitle} side="left" tone="light"><AdminNav pathname={pathname} onNavigate={() => setOpen(false)} onLogout={logout}/></Drawer>
    <div className="admin-main">
      <div className="admin-topbar"><button type="button" className="mobile-menu icon-button" aria-label={COPY.public.openNavigation} aria-expanded={open} onClick={() => setOpen(true)}><Menu size={22}/></button><span>{links.find(x => isActive(pathname, x.href))?.label || COPY.common.dashboard}</span><span className="account-label">{COPY.admin.workspace}</span></div>
      <div className="admin-content">{children}</div>
    </div>
  </div>;
}
