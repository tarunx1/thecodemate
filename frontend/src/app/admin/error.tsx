'use client';
import { Button, PageHeader } from '@/components/ui';

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return <main className="admin-content" role="alert">
    <PageHeader title="Workspace unavailable" description="The content service could not load this page."/>
    <Button type="button" onClick={reset}>Try again</Button>
  </main>;
}
