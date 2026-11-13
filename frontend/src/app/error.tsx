'use client';
import { COPY } from '@/lib/copy';

import { Button } from '@/components/ui';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main id="main" className="container directory" role="alert">
    <h1>{COPY.public.error.title}</h1>
    <p>{COPY.public.error.description}</p>
    <Button type="button" onClick={reset}>{COPY.common.tryAgain}</Button>
  </main>;
}
