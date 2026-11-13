/* eslint-disable @next/next/no-img-element -- Private CMS media requires direct, noncached delivery under the nonce CSP. */
import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';
import type { Item, ItemSummary, Revision, SiteSettings } from '@/lib/types';
import { Badge, ButtonLink, EmptyState } from './ui';
import { SiteHeader } from './site-header';
import { CardHover } from './motion';
import { CardRail } from './card-rail';
import { ScrollReveal } from './scroll-reveal';
import { Visualization } from './visualizations';
import { apiGet } from '@/lib/api';
import { COPY, formatCopy } from '@/lib/copy';

export function SiteFooter({ settings }: { settings?: SiteSettings }) { return <footer className="site-footer"><div className="container footer-line"><div><Link className="wordmark" href="/">{COPY.brand.name}<span>.</span></Link><p>{settings?.footer_note || COPY.brand.tagline}</p></div><nav aria-label={COPY.public.footerNavigation}><Link href="/topics">{COPY.common.topics}</Link><Link href="/projects">{COPY.common.projects}</Link><a href={settings?.instagram_url || COPY.defaults.instagram_url} target="_blank" rel="noopener noreferrer">{COPY.public.instagram}</a></nav></div><div className="container copyright">{formatCopy(COPY.common.copyright, { year: new Date().getFullYear() })}</div></footer>; }
/** Dark editorial shell. `overHero` floats the header over the first-screen hero. */
export async function PublicLayout({ children, settings, overHero = false }: { children: React.ReactNode; settings?: SiteSettings; overHero?: boolean }) { const site = settings || await apiGet<SiteSettings>('public/settings') || undefined; return <div className="public-theme"><ScrollReveal/><a className="skip-link" href="#main">{COPY.public.skip}</a><SiteHeader variant={overHero ? 'overlay' : 'light'}/>{children}<SiteFooter settings={site}/></div>; }
export function ContentCard({ item }: { item: ItemSummary }) {
  const c = item.content;
  if (!c) return null;
  const image = c.cover?.url || `/card-photos/${item.kind === 'topic' ? 'topic-ai' : 'project-learning'}.jpg`;
  return <CardHover><Link className="content-card" href={`/${item.kind}s/${item.slug}`}>
    <div className="card-copy"><div className="content-meta"><span>{c.category}</span>{c.sample && <Badge tone="accent">{COPY.common.sample}</Badge>}</div>
      <h3>{c.title}</h3><p>{c.summary}</p>
    </div>
    <div className="content-art"><img src={image} alt="" width={c.cover?.width || 960} height={c.cover?.height || 1200} loading="lazy" decoding="async"/></div>
    <span className="card-arrow" aria-hidden="true"><ArrowRight size={22}/></span>
  </Link></CardHover>;
}
export function FeaturedSection({ title, href, items, index, intro }: { title: string; href: string; items: ItemSummary[]; index?: string; intro?: string }) { return <section className="feature-section container"><div className="section-heading"><div>{index && <span className="section-index">{index}</span>}<h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div><Link href={href}>{COPY.public.viewAll} <ArrowRight size={16}/></Link></div>{items.length ? <CardRail>{items.map(item => <ContentCard key={item.id} item={item}/>)}</CardRail> : <EmptyState title={COPY.public.comingSoon} description={COPY.public.comingSoonHelp}/>}</section>; }
export function InstagramCallout({ url, index }: { url: string; index?: string }) { return <section className="explore-cta container" aria-labelledby="explore-title"><div className="explore-copy">{index && <span className="section-index">{index}</span>}<h2 id="explore-title"><span>{COPY.public.home.exploreFirst}</span> <em>{COPY.public.home.exploreSecond}</em></h2><p>{COPY.public.home.exploreBody}</p></div><div className="explore-actions"><ButtonLink href="/topics">{COPY.public.home.allTopics} <ArrowRight size={16} aria-hidden="true"/></ButtonLink><ButtonLink href="/projects" variant="secondary">{COPY.public.home.allProjects}</ButtonLink><a className="button button-quiet" href={url} target="_blank" rel="noopener noreferrer"><Instagram size={17} aria-hidden="true"/> {COPY.brand.handle}</a></div></section>; }
export function Article({ item, revision, preview = false, related = [] }: { item: Item; revision: Revision; preview?: boolean; related?: ItemSummary[] }) {
  const steps = revision.steps.split('\n').filter(Boolean).map(line => { const [heading, ...rest] = line.split('|'); return { heading: heading.trim(), text: rest.join('|').trim() }; });
  return <><main id="main" className="article container">{preview && <div className="preview-banner" role="status">{COPY.public.article.preview} · {item.published ? COPY.public.article.liveMayDiffer : COPY.public.article.notPublished}</div>}<Link className="back-link" href={preview ? `/admin/${item.kind}s` : `/${item.kind}s`}>← {preview ? COPY.public.article.backAdmin : formatCopy(COPY.public.article.allKind, { kind: item.kind })}</Link><div className="article-head"><span className="eyebrow">{revision.category} / {item.kind}</span><h1>{revision.title}</h1><p>{revision.summary}</p></div>{revision.cover && <img className="article-cover" src={revision.cover.url} alt={revision.cover.alt || ''} width={revision.cover.width} height={revision.cover.height}/>}<div className="article-layout"><aside className="article-aside">{revision.tags && <div><strong>{COPY.public.article.topicsLabel}</strong><p>{revision.tags}</p></div>}{revision.demo_url && <a href={revision.demo_url} target="_blank" rel="noopener noreferrer">{COPY.public.article.liveDemo}</a>}{revision.repo_url && <a href={revision.repo_url} target="_blank" rel="noopener noreferrer">{COPY.public.article.github}</a>}{revision.video_url && <a href={revision.video_url} target="_blank" rel="noopener noreferrer">{COPY.public.article.watchVideo}</a>}</aside><div className="article-body">{revision.body_html && <div className="prose" dangerouslySetInnerHTML={{__html: revision.body_html}}/>}<Visualization kind="steps" steps={steps}/></div></div></main>{related.length > 0 && <FeaturedSection title={COPY.public.article.related} href={`/${item.kind}s`} items={related}/>}</>;
}
