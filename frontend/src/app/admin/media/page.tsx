import { requireAdmin } from '@/lib/admin'; import { apiGet } from '@/lib/api'; import { MediaManager } from '@/components/media-manager'; import type { Media } from '@/lib/types';
export default async function MediaPage() { await requireAdmin(); const data=await apiGet<{items:Media[]}>('admin/media',true); return <MediaManager initial={data?.items || []}/>; }
