import 'server-only';
import { redirect } from 'next/navigation';
import { apiGet } from './api';
export async function requireAdmin() { const me = await apiGet<{ email: string; csrf: string }>('admin/me', true); if (!me) redirect('/admin/login'); return me; }
