import { COPY } from '@/lib/copy';
import type { Metadata } from 'next';
import { apiGet } from '@/lib/api';
import type { ListResult } from '@/lib/types';
import { Directory } from '@/components/directory';
import { ErrorState } from '@/components/ui';
export const metadata: Metadata = { title: COPY.common.topics, description: COPY.public.directory.topicsMetaDescription, alternates: { canonical: '/topics' } };
export default async function Topics({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) { const p = await searchParams; const params = new URLSearchParams({ q: p.q || '', category: p.category || '', page: p.page || '1' }); const data = await apiGet<ListResult>(`public/topics?${params}`); return data ? <Directory kind="topics" data={data}/> : <ErrorState message={COPY.public.directory.topicsUnavailable}/>; }
