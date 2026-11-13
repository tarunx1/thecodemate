import { COPY } from '@/lib/copy';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Inter, JetBrains_Mono, Sora } from 'next/font/google';
import '@/styles/globals.css';
import { indexable, siteOrigin } from '@/lib/api';

// Self-hosted at build time by next/font: satisfies the `font-src 'self'` CSP, no runtime Google request.
const sora = Sora({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-sora', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = { metadataBase: new URL(siteOrigin), title: { default: `${COPY.brand.name} — ${COPY.brand.tagline}`, template: `%s — ${COPY.brand.name}` }, description: COPY.brand.description, robots: indexable ? { index: true, follow: true } : { index: false, follow: false }, openGraph: { type: 'website', siteName: 'thecodemate', title: `${COPY.brand.name} — ${COPY.brand.tagline}` } };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { await connection(); return <html lang="en" data-scroll-behavior="smooth" className={`${sora.variable} ${inter.variable} ${mono.variable}`}><body>{children}</body></html>; }
