import type { MetadataRoute } from 'next';
import { indexable, siteOrigin } from '@/lib/api';
export const dynamic = 'force-dynamic';
export default function robots(): MetadataRoute.Robots { return indexable ? { rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }], sitemap: `${siteOrigin}/sitemap.xml` } : { rules: [{ userAgent: '*', disallow: '/' }] }; }
