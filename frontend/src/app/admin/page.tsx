import { COPY } from '@/lib/copy';
import { apiGet } from '@/lib/api';
import { requireAdmin } from '@/lib/admin';
import type { DashboardData } from '@/lib/types';
import { ContentTable, MetricCard } from '@/components/admin-content';
import { ButtonLink, ErrorState, PageHeader } from '@/components/ui';
export default async function Dashboard() { await requireAdmin(); const data = await apiGet<DashboardData>('admin/dashboard', true); if (!data) return <ErrorState message={COPY.admin.dashboard.unavailable}/>; return <><PageHeader title={COPY.common.dashboard} description={COPY.admin.dashboard.description} action={<><ButtonLink href="/admin/topics/new">{COPY.admin.dashboard.newTopic}</ButtonLink><ButtonLink href="/admin/projects/new" variant="secondary">{COPY.admin.dashboard.newProject}</ButtonLink></>}/><div className="metric-grid"><MetricCard label={COPY.admin.dashboard.publishedTopics} count={data.metrics.published_topics}/><MetricCard label={COPY.admin.dashboard.draftTopics} count={data.metrics.draft_topics}/><MetricCard label={COPY.admin.dashboard.publishedProjects} count={data.metrics.published_projects}/><MetricCard label={COPY.admin.dashboard.draftProjects} count={data.metrics.draft_projects}/></div><ContentTable title={COPY.admin.dashboard.recentTopics} items={data.topics}/><ContentTable title={COPY.admin.dashboard.recentProjects} items={data.projects}/></>; }
