import { requireAdmin } from '@/lib/admin'; import { apiGet } from '@/lib/api'; import { ContentEditor } from '@/components/editor'; import type { Media } from '@/lib/types';
export default async function NewProject() { await requireAdmin(); const media = await apiGet<{items:Media[]}>('admin/media',true); return <ContentEditor kind="project" media={media?.items || []}/>; }
