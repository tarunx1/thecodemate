import type { MetadataRoute } from 'next';
import { apiGet, siteOrigin } from '@/lib/api';
import type { ListResult } from '@/lib/types';

// Publication changes must appear without a frontend rebuild.
export const dynamic = 'force-dynamic';

async function publishedPaths(kind: 'topics' | 'projects'): Promise<string[]> {
  const paths: string[] = [];
  for (let page = 1; ; page += 1) {
    const data = await apiGet<ListResult>(`public/${kind}?page=${page}&page_size=48`);
    if (!data) throw new Error(`Cannot build sitemap: ${kind} are unavailable`);
    paths.push(...data.items.filter(item => !item.content?.sample).map(item => `/${kind}/${item.slug}`));
    if (!data.has_next) return paths;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [topics, projects] = await Promise.all([publishedPaths('topics'), publishedPaths('projects')]);
  return ['/', '/topics', '/projects', ...topics, ...projects].map(path => ({ url: `${siteOrigin}${path}` }));
}
