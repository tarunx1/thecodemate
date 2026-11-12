/* eslint-disable @next/next/no-img-element -- Private CMS media requires direct, noncached delivery under the nonce CSP. */
import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';
import type { Item, ItemSummary, Revision, SiteSettings } from '@/lib/types';
import { Badge, ButtonLink, EmptyState } from './ui';
import { SiteHeader } from './site-header';
import { CardHover } from './motion';
import { Visualization } from './visualizations';
import { apiGet } from '@/lib/api';

export function SiteFooter({ settings }: { settings?: SiteSettings }) { return <footer className="site-footer"><div className="container footer-line"><div><Link className="wordmark" href="/">thecodemate<span>.</span></Link><p>{settings?.footer_note || 'Technology, made visual.'}</p></div><nav aria-label="Footer navigation"><Link href="/topics">Topics</Link><Link href="/projects">Projects</Link><a href={settings?.instagram_url || 'https://www.instagram.com/thecodemate/'} target="_blank" rel="noopener noreferrer">Instagram</a></nav></div><div className="container copyright">© {new Date().getFullYear()} thecodemate</div></footer>; }
/** Dark editorial shell. `overHero` floats the header over the first-screen hero. */
export async function PublicLayout({ children, settings, overHero = false }: { children: React.ReactNode; settings?: SiteSettings; overHero?: boolean }) { const site = settings || await apiGet<SiteSettings>('public/settings') || undefined; return <div className="public-theme"><a className="skip-link" href="#main">Skip to content</a><SiteHeader variant={overHero ? 'overlay' : 'light'}/>{children}<SiteFooter settings={site}/></div>; }
const fallbackPhoto: Record<string, string> = {
  'how-ai-generates-text': 'topic-ai', 'bubble-sort-visualized': 'topic-sort',
  'how-dns-works': 'topic-dns', 'how-http-works': 'topic-http',
  'city-explorer': 'project-city', workflo: 'project-workflow',
  'visa-house-platform': 'project-platform', 'prismed-lms': 'project-learning',
};
export function ContentCard({ item }: { item: ItemSummary }) {
  const c = item.content;
  if (!c) return null;
  const image = c.cover?.url || `/card-photos/${fallbackPhoto[item.slug] || (item.kind === 'topic' ? 'topic-ai' : 'project-learning')}.jpg`;
  return <CardHover><Link className="content-card" href={`/${item.kind}s/${item.slug}`}>
    <div className="content-art"><img src={image} alt="" width={c.cover?.width || 960} height={c.cover?.height || 1200} loading="lazy" decoding="async"/></div>
    {c.sample && <Badge tone="accent" className="sample-label">Sample</Badge>}
    <div className="card-copy"><div className="content-meta"><span>{c.category}</span><span>{item.kind}</span></div>
      <h3>{c.title}</h3><p>{c.summary}</p><span className="card-arrow" aria-hidden="true"><ArrowRight size={22}/></span>
    </div>
  </Link></CardHover>;
}
export function FeaturedSection({ title, href, items, index, intro }: { title: string; href: string; items: ItemSummary[]; index?: string; intro?: string }) { return <section className="feature-section container"><div className="section-heading"><div>{index && <span className="section-index">{index}</span>}<h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div><Link href={href}>View all <ArrowRight size={16}/></Link></div>{items.length ? <div className="content-grid">{items.map(item => <ContentCard key={item.id} item={item}/>)}</div> : <EmptyState title="Coming soon" description="New work will appear here after it is published."/>}</section>; }
export function InstagramCallout({ url, index }: { url: string; index?: string }) { return <section className="explore-cta container" aria-labelledby="explore-title"><div className="explore-copy">{index && <span className="section-index">{index}</span>}<h2 id="explore-title"><span>Keep exploring.</span> <em>One concept at a time.</em></h2><p>Browse every explainer, look inside the projects, or follow short visual notes from @thecodemate.</p></div><div className="explore-actions"><ButtonLink href="/topics">All topics <ArrowRight size={16} aria-hidden="true"/></ButtonLink><ButtonLink href="/projects" variant="secondary">All projects</ButtonLink><a className="button button-quiet" href={url} target="_blank" rel="noopener noreferrer"><Instagram size={17} aria-hidden="true"/> @thecodemate</a></div></section>; }
export function Article({ item, revision, preview = false, related = [] }: { item: Item; revision: Revision; preview?: boolean; related?: ItemSummary[] }) {
  const steps = revision.steps.split('\n').filter(Boolean).map(line => { const [heading, ...rest] = line.split('|'); return { heading: heading.trim(), text: rest.join('|').trim() }; });
  return <><main id="main" className="article container">{preview && <div className="preview-banner" role="status">Private preview · {item.published ? 'Live content may differ' : 'Not published'}</div>}<Link className="back-link" href={preview ? `/admin/${item.kind}s` : `/${item.kind}s`}>← {preview ? 'Back to admin' : `All ${item.kind}s`}</Link><div className="article-head"><span className="eyebrow">{revision.category} / {item.kind}</span><h1>{revision.title}</h1><p>{revision.summary}</p></div>{revision.cover && <img className="article-cover" src={revision.cover.url} alt={revision.cover.alt || ''} width={revision.cover.width} height={revision.cover.height}/>}<div className="article-layout"><aside className="article-aside">{revision.tags && <div><strong>Topics</strong><p>{revision.tags}</p></div>}{revision.demo_url && <a href={revision.demo_url} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}{revision.repo_url && <a href={revision.repo_url} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}{revision.video_url && <a href={revision.video_url} target="_blank" rel="noopener noreferrer">Watch video ↗</a>}</aside><div className="article-body">{revision.body_html && <div className="prose" dangerouslySetInnerHTML={{__html: revision.body_html}}/>}<Visualization kind="steps" steps={steps}/></div></div></main>{related.length > 0 && <FeaturedSection title="Related reading" href={`/${item.kind}s`} items={related}/>}</>;
}
