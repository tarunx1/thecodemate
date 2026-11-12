'use client';
import { Button } from '@/components/ui';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main id="main" className="container directory" role="alert">
    <h1>Content is temporarily unavailable.</h1>
    <p>The service could not load this page. Please try again.</p>
    <Button type="button" onClick={reset}>Try again</Button>
  </main>;
}
