import { COPY, formatCopy } from '@/lib/copy';
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
    <PageHeader title={kind === 'topic' ? COPY.common.topics : COPY.common.projects} description={formatCopy(COPY.admin.list.description, { kind })}
      action={<ButtonLink href={`/admin/${plural}/new`}>{kind === 'topic' ? COPY.admin.dashboard.newTopic : COPY.admin.dashboard.newProject}</ButtonLink>}/>
    <form className="admin-filters" action={`/admin/${plural}`}>
      <SearchInput name="q" aria-label={formatCopy(COPY.admin.list.search, { kind: plural })} placeholder={formatCopy(COPY.admin.list.searchPlaceholder, { kind: plural })} defaultValue={q}/>
      <Select name="status" aria-label={COPY.admin.list.filterStatus} defaultValue={status}>
        <option value="">{COPY.admin.list.allStatuses}</option><option value="published">{COPY.common.published}</option>
        <option value="draft">{COPY.common.draft}</option><option value="offline">{COPY.common.offline}</option>
      </Select>
      <Select name="category" aria-label={COPY.admin.list.filterCategory} defaultValue={category}>
        <option value="">{COPY.common.allCategories}</option>{data.categories.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Button type="submit">{COPY.admin.list.filter}</Button>
    </form>
    <ContentTable items={data.items}/>
    <Pagination page={data.page} total={data.total} pageSize={data.page_size} href={pageHref}/>
  </>;
}
