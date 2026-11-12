import { apiGet } from '@/lib/api';
import { requireAdmin } from '@/lib/admin';
import type { DashboardData } from '@/lib/types';
import { ContentTable, MetricCard } from '@/components/admin-content';
import { ButtonLink, ErrorState, PageHeader } from '@/components/ui';
export default async function Dashboard() { await requireAdmin(); const data = await apiGet<DashboardData>('admin/dashboard', true); if (!data) return <ErrorState message="Dashboard data is unavailable."/>; return <><PageHeader title="Dashboard" description="Manage your content and projects." action={<><ButtonLink href="/admin/topics/new">+ New Topic</ButtonLink><ButtonLink href="/admin/projects/new" variant="secondary">+ New Project</ButtonLink></>}/><div className="metric-grid"><MetricCard label="Published Topics" count={data.metrics.published_topics}/><MetricCard label="Draft Topics" count={data.metrics.draft_topics}/><MetricCard label="Published Projects" count={data.metrics.published_projects}/><MetricCard label="Draft Projects" count={data.metrics.draft_projects}/></div><ContentTable title="Recent Topics" items={data.topics}/><ContentTable title="Recent Projects" items={data.projects}/></>; }
