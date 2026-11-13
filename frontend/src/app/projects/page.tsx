import { COPY } from '@/lib/copy';
import type { Metadata } from 'next';
import { apiGet } from '@/lib/api';
import type { ListResult } from '@/lib/types';
import { Directory } from '@/components/directory';
import { ErrorState } from '@/components/ui';
export const metadata: Metadata = { title: COPY.common.projects, description: COPY.public.directory.projectsMetaDescription, alternates: { canonical: '/projects' } };
export default async function Projects({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) { const p = await searchParams; const params = new URLSearchParams({ q: p.q || '', category: p.category || '', page: p.page || '1' }); const data = await apiGet<ListResult>(`public/projects?${params}`); return data ? <Directory kind="projects" data={data}/> : <ErrorState message={COPY.public.directory.projectsUnavailable}/>; }
