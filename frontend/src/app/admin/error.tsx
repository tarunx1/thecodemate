'use client';
import { COPY } from '@/lib/copy';

import { Button, PageHeader } from '@/components/ui';

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return <main className="admin-content" role="alert">
    <PageHeader title={COPY.admin.error.title} description={COPY.admin.error.description}/>
    <Button type="button" onClick={reset}>{COPY.common.tryAgain}</Button>
  </main>;
}
