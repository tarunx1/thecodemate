import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { ItemSummary, SiteSettings } from '@/lib/types';
import { FeaturedSection, InstagramCallout, PublicLayout } from '@/components/public';
import { ButtonLink, ErrorState } from '@/components/ui';
import { LiquidAmbientHero } from '@/components/motion/LiquidAmbientHero';

type HomeData = { settings: SiteSettings; topics: ItemSummary[]; projects: ItemSummary[]; topic_count: number; project_count: number };

// Developer-owned editorial copy (not CMS fields). Hero copy below comes from SiteSetting.
const learning = [
  { n: '01', title: 'See the mechanism', text: 'Each explainer breaks a system into visual steps you can follow in order.' },
  { n: '02', title: 'Connect it to practice', text: 'Concepts are tied to how they show up in real software and real projects.' },
  { n: '03', title: 'Keep the picture', text: 'A clear diagram is easier to remember than a paragraph of jargon.' },
];

export default async function Home() {
  const data = await apiGet<HomeData>('public/home');
  if (!data) return <PublicLayout><main id="main" className="container directory"><ErrorState message="The content service is unavailable. Please try again later."/></main></PublicLayout>;
  const s = data.settings;
  return <PublicLayout settings={s} overHero>
    <main id="main">
      <LiquidAmbientHero className="home-hero">
        <div className="hero-card">
          <span className="mono-label hero-label">{s.eyebrow}</span>
          <h1 className="hero-title"><span>{s.hero_line1}</span> <span>{s.hero_line2} <em>{s.hero_highlight}</em></span></h1>
          <p className="hero-description">{s.hero_description}</p>
          <div className="hero-actions">
            <ButtonLink href="/topics">Explore topics <ArrowRight size={16} aria-hidden="true"/></ButtonLink>
            <ButtonLink href="/projects" variant="ghost">View our projects</ButtonLink>
          </div>
        </div>
      </LiquidAmbientHero>

      <div className="editorial">
        <FeaturedSection index="01 / Featured topics" title="Ideas, explained visually." intro="Published explainers from the thecodemate library." href="/topics" items={data.topics}/>

        <section className="learning-section container" aria-labelledby="learning-title">
          <div className="learning-intro">
            <span className="section-index">02 / Interactive learning</span>
            <h2 id="learning-title"><span>See the idea.</span> <em>Understand the system.</em></h2>
            <p>Technology is easier to learn when you can watch it work. Every topic pairs a plain-language explanation with a step-by-step visual.</p>
          </div>
          <ol className="learning-points">{learning.map(l => <li key={l.n}><span className="learning-number">{l.n}</span><div><h3>{l.title}</h3><p>{l.text}</p></div></li>)}</ol>
        </section>

        <FeaturedSection index="03 / Featured projects" title="Work, opened up." intro="Selected projects with the reasoning behind them." href="/projects" items={data.projects}/>

        <section className="about-section container" id="about" aria-labelledby="about-title">
          <div>
            <span className="section-index">04 / About thecodemate</span>
            <h2 id="about-title"><span>Technology,</span> <em>made visual.</em></h2>
          </div>
          <div className="about-copy">
            <p>thecodemate is a space for visual technology education and selected project work. Explore a concept, follow a process, or see what we build.</p>
            <dl className="about-stats">
              <div><dt>Published topics</dt><dd>{data.topic_count}</dd></div>
              <div><dt>Published projects</dt><dd>{data.project_count}</dd></div>
            </dl>
            <Link className="text-link" href="/topics">Start exploring <ArrowRight size={16} aria-hidden="true"/></Link>
          </div>
        </section>

        <InstagramCallout index="05 / Explore more" url={s.instagram_url}/>
      </div>
    </main>
  </PublicLayout>;
}
