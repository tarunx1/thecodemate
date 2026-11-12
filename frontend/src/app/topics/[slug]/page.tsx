import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Article, PublicLayout } from '@/components/public';
import { apiGet } from '@/lib/api';
import type { Item, ItemSummary } from '@/lib/types';
type Result = { item: Item; related: ItemSummary[] };
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const data = await apiGet<Result>(`public/topics/${encodeURIComponent(slug)}`); const c = data?.item.content; return c ? { title: c.title, description: c.summary, alternates: { canonical: `/topics/${slug}` }, openGraph: { title: c.title, description: c.summary, images: c.cover ? [c.cover.url] : [] } } : { title: 'Topic not found', robots: { index: false } }; }
export default async function Topic({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const data = await apiGet<Result>(`public/topics/${encodeURIComponent(slug)}`); if (!data?.item.content) notFound(); return <PublicLayout><Article item={data.item} revision={data.item.content} related={data.related}/></PublicLayout>; }
