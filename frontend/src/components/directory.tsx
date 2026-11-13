import { SpotlightSearch } from './spotlight-search';
import { ContentCard, PublicLayout } from './public';
import { EmptyState, Pagination } from './ui';
import type { ListResult } from '@/lib/types';
import { COPY, formatCopy } from '@/lib/copy';

export function Directory({ kind, data }: { kind: 'topics' | 'projects'; data: ListResult }) {
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (data.q) params.set('q', data.q);
    if (data.category) params.set('category', data.category);
    if (page > 1) params.set('page', String(page));
    return `/${kind}${params.size ? `?${params}` : ''}`;
  };
  return <PublicLayout><main id="main" className="container directory">
    <div className="directory-head">
      <span className="mono-label">{formatCopy(COPY.public.directory.directoryLabel, { kind: kind.toUpperCase() })}</span>
      <h1>{kind === 'topics' ? COPY.public.directory.topicsTitle : COPY.public.directory.projectsTitle}</h1>
      <p>{kind === 'topics' ? COPY.public.directory.topicsDescription : COPY.public.directory.projectsDescription}</p>
    </div>
    <SpotlightSearch key={`${kind}:${data.q || ""}:${data.category || ""}`} kind={kind} categories={data.categories} query={data.q} category={data.category}/>
    <p className="result-count">{formatCopy(COPY.public.directory.resultCount, { count: data.total, kind: data.total === 1 ? kind.slice(0, -1) : kind })}</p>
    {data.items.length ? <div className="content-grid directory-grid">{data.items.map(item => <ContentCard key={item.id} item={item}/>)}</div>
      : <EmptyState title={COPY.public.directory.noMatches} description={COPY.public.directory.noMatchesHelp}/>}
    <Pagination page={data.page} total={data.total} pageSize={data.page_size} href={pageHref}/>
  </main></PublicLayout>;
}
