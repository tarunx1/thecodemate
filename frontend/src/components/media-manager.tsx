/* eslint-disable @next/next/no-img-element -- Private CMS media requires direct, noncached delivery under the nonce CSP. */
'use client';
import { COPY } from '@/lib/copy';

import { useState } from 'react';
import type { Media } from '@/lib/types';
import { adminPost } from '@/lib/client-api';
import { Button, Card, EmptyState, Field, Input, PageHeader } from './ui';

export function MediaManager({ initial }: { initial: Media[] }) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true); setError('');
    try {
      const uploaded = await adminPost<Media>('/api/admin/media', new FormData(form));
      setItems(current => [uploaded, ...current]);
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : COPY.admin.media.uploadError);
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageHeader title={COPY.common.media} description={COPY.admin.media.description}/>
    <form className="media-upload" onSubmit={upload}>
      <Card>
        <div className="form-grid">
          <Field label={COPY.admin.media.image}><Input name="file" type="file" accept="image/jpeg,image/png,image/webp" required/></Field>
          <Field label={COPY.admin.media.alternativeText}><Input name="alt" maxLength={200} placeholder={COPY.admin.media.describeImage}/></Field>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? COPY.admin.media.uploading : COPY.admin.media.upload}</Button>
        <p className="field-help">{COPY.admin.media.uploadHint}</p>
      </Card>
    </form>
    {items.length ? <div className="media-grid">{items.map(m => <Card key={m.id}>
      <img src={m.url} alt={m.alt || ''} width={m.width} height={m.height}/>
      <strong>{m.alt || COPY.admin.media.untitled}</strong><small>{m.width} × {m.height}</small>
    </Card>)}</div> : <EmptyState title={COPY.admin.media.empty} description={COPY.admin.media.emptyHelp}/>}
  </>;
}
