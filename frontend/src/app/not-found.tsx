import { PublicLayout } from '@/components/public';
import { ButtonLink } from '@/components/ui';
export default function NotFound() { return <PublicLayout><main id="main" className="container not-found"><span>404</span><h1>That page isn’t here.</h1><p>Try another topic or return to the start.</p><ButtonLink href="/">Back home</ButtonLink></main></PublicLayout>; }
