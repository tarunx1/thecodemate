import { AdminShell } from '@/components/admin-shell';
import { COPY } from '@/lib/copy';
export const metadata = { title: COPY.common.adminTitle, robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <AdminShell>{children}</AdminShell>; }
