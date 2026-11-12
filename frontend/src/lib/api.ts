import 'server-only';
import { cookies } from 'next/headers';

const backend = process.env.TC_BACKEND_URL || 'http://127.0.0.1:8000';

export class ApiUnavailableError extends Error {
  constructor(path: string, status?: number) {
    super(`Content service unavailable for ${path}${status ? ` (${status})` : ''}`);
  }
}

export async function apiGet<T>(path: string, authenticated = false): Promise<T | null> {
  const cookie = authenticated ? (await cookies()).toString() : '';
  try {
    const response = await fetch(`${backend}/api/${path}`, {
      headers: authenticated ? { cookie } : {}, cache: 'no-store', redirect: 'manual',
    });
    if (response.status === 401 || response.status === 404) return null;
    if (!response.ok) throw new ApiUnavailableError(path, response.status);
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiUnavailableError) throw error;
    throw new ApiUnavailableError(path);
  }
}
export const siteOrigin = process.env.TC_SITE_URL || 'http://127.0.0.1:3000';
export const indexable = process.env.NODE_ENV === 'production' && process.env.TC_SEO_INDEXING === 'true';
