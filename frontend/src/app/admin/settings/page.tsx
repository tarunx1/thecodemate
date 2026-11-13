import { COPY } from '@/lib/copy';
import { requireAdmin } from '@/lib/admin'; import { apiGet } from '@/lib/api'; import { SettingsForm } from '@/components/settings-form'; import { ErrorState } from '@/components/ui'; import type { SiteSettings } from '@/lib/types';
export default async function Settings() { await requireAdmin(); const settings=await apiGet<SiteSettings>('admin/settings',true); return settings ? <SettingsForm settings={settings}/> : <ErrorState message={COPY.admin.settings.unavailable}/>; }
