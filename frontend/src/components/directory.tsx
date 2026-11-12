import { ContentCard, PublicLayout } from './public';
import { EmptyState, SearchInput, Select, Button, Pagination } from './ui';
import type { ListResult } from '@/lib/types';

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
      <span className="mono-label">THECODEMATE / {kind.toUpperCase()}</span>
      <h1>{kind === 'topics' ? 'Ideas worth understanding.' : 'Work worth exploring.'}</h1>
      <p>{kind === 'topics' ? 'Visual explainers for the systems and concepts behind technology.' : 'Selected projects, built with care and explained in detail.'}</p>
    </div>
    <form className="filters" action={`/${kind}`}>
      <SearchInput name="q" aria-label={`Search ${kind}`} placeholder={`Search ${kind}…`} defaultValue={data.q || ''}/>
      <Select name="category" aria-label="Filter by category" defaultValue={data.category || ''}>
        <option value="">All categories</option>
        {data.categories.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Button type="submit">Apply filters</Button>
    </form>
    <p className="result-count">{data.total} {data.total === 1 ? kind.slice(0, -1) : kind}</p>
    {data.items.length ? <div className="content-grid directory-grid">{data.items.map(item => <ContentCard key={item.id} item={item}/>)}</div>
      : <EmptyState title="No matches yet" description="Try another search or category."/>}
    <Pagination page={data.page} total={data.total} pageSize={data.page_size} href={pageHref}/>
  </main></PublicLayout>;
}
