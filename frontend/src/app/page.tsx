import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { apiGet, siteOrigin } from '@/lib/api';
import type { ItemSummary, SiteSettings } from '@/lib/types';
import { FeaturedSection, InstagramCallout, PublicLayout, ServicesSection, TitleTicker } from '@/components/public';
import { CountUp } from '@/components/motion/effects';
import { ButtonLink, ErrorState } from '@/components/ui';
import { LearningAccordion } from '@/components/learning-accordion';
import { LiquidAmbientHero } from '@/components/motion/LiquidAmbientHero';
import { COPY } from '@/lib/copy';

type HomeData = { settings: SiteSettings; topics: ItemSummary[]; projects: ItemSummary[]; topic_count: number; project_count: number };

// Developer-owned editorial copy lives in the shared catalogue; the hero remains CMS-owned.
const copy = COPY.public.home;

export default async function Home() {
  const data = await apiGet<HomeData>('public/home');
  if (!data) return <PublicLayout><main id="main" className="container directory"><ErrorState message={COPY.public.error.home}/></main></PublicLayout>;
  const s = data.settings;
  return <PublicLayout settings={s} overHero>
    <main id="main">
      <LiquidAmbientHero className="home-hero">
        <div className="hero-card">
          <span className="mono-label hero-label">{s.eyebrow}</span>
          <h1 className="hero-title"><span>{s.hero_line1}</span> <span>{s.hero_line2} <em>{s.hero_highlight}</em></span></h1>
          <p className="hero-description">{s.hero_description}</p>
          <div className="hero-actions">
            <ButtonLink href="/topics">{COPY.public.exploreTopics} <ArrowRight size={16} aria-hidden="true"/></ButtonLink>
            <ButtonLink href="/projects" variant="ghost">{COPY.public.viewProjects}</ButtonLink>
          </div>
        </div>
      </LiquidAmbientHero>

      <div className="editorial">
        <TitleTicker items={[...data.topics, ...data.projects].map(item => item.content?.title).filter((title): title is string => Boolean(title))}/>
        <FeaturedSection index={copy.featuredTopicsIndex} title={copy.featuredTopicsTitle} intro={copy.featuredTopicsIntro} href="/topics" items={data.topics}/>

        <section className="learning-section container" aria-labelledby="learning-title">
          <div className="learning-intro">
            <span className="section-index">{copy.learningIndex}</span>
            <h2 id="learning-title"><span>{copy.learningFirst}</span> <em>{copy.learningSecond}</em></h2>
            <p>{copy.learningIntro}</p>
          </div>
          <LearningAccordion items={copy.learning}/>
        </section>

        <FeaturedSection index={copy.featuredProjectsIndex} title={copy.featuredProjectsTitle} intro={copy.featuredProjectsIntro} href="/projects" items={data.projects}/>

        <ServicesSection instagramUrl={s.instagram_url} siteUrl={siteOrigin}/>

        <section className="about-section container" id="about" aria-labelledby="about-title">
          <div>
            <span className="section-index">{copy.aboutIndex}</span>
            <h2 id="about-title"><span>{copy.aboutFirst}</span> <em>{copy.aboutSecond}</em></h2>
          </div>
          <div className="about-copy">
            <p>{copy.aboutBody}</p>
            <dl className="about-stats">
              <div><dt>{copy.publishedTopics}</dt><dd><CountUp value={data.topic_count}/></dd></div>
              <div><dt>{copy.publishedProjects}</dt><dd><CountUp value={data.project_count}/></dd></div>
            </dl>
            <Link className="text-link" href="/topics">{copy.startExploring} <ArrowRight size={16} aria-hidden="true"/></Link>
          </div>
        </section>

        <InstagramCallout index={copy.exploreIndex} url={s.instagram_url}/>
      </div>
    </main>
  </PublicLayout>;
}
