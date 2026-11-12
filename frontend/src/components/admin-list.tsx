import { ContentTable } from './admin-content';
import { Button, ButtonLink, PageHeader, Pagination, SearchInput, Select } from './ui';
import type { Kind, ListResult } from '@/lib/types';

export function AdminList({ kind, data, q, status, category }: { kind: Kind; data: ListResult; q: string; status: string; category: string }) {
  const plural = `${kind}s`;
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    if (category) params.set('category', category);
    if (page > 1) params.set('page', String(page));
    return `/admin/${plural}${params.size ? `?${params}` : ''}`;
  };
  return <>
    <PageHeader title={kind === 'topic' ? 'Topics' : 'Projects'} description={`Create, review, and publish ${plural}.`}
      action={<ButtonLink href={`/admin/${plural}/new`}>+ New {kind === 'topic' ? 'Topic' : 'Project'}</ButtonLink>}/>
    <form className="admin-filters" action={`/admin/${plural}`}>
      <SearchInput name="q" aria-label={`Search ${plural}`} placeholder={`Search ${plural}…`} defaultValue={q}/>
      <Select name="status" aria-label="Filter by status" defaultValue={status}>
        <option value="">All statuses</option><option value="published">Published</option>
        <option value="draft">Draft</option><option value="offline">Offline</option>
      </Select>
      <Select name="category" aria-label="Filter by category" defaultValue={category}>
        <option value="">All categories</option>{data.categories.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Button type="submit">Filter</Button>
    </form>
    <ContentTable items={data.items}/>
    <Pagination page={data.page} total={data.total} pageSize={data.page_size} href={pageHref}/>
  </>;
}
