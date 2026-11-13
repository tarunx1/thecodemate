import { COPY } from '@/lib/copy';
import { PublicLayout } from '@/components/public';
import { ButtonLink } from '@/components/ui';
export default function NotFound() { return <PublicLayout><main id="main" className="container not-found"><span>404</span><h1>{COPY.public.notFound.title}</h1><p>{COPY.public.notFound.description}</p><ButtonLink href="/">{COPY.public.notFound.back}</ButtonLink></main></PublicLayout>; }
