'use client';
import { COPY } from '@/lib/copy';

import { useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import { adminPost } from '@/lib/client-api';
import { Button, Card, Field, Input, PageHeader, Textarea } from './ui';

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(''); setNotice('');
    try {
      await adminPost<SiteSettings>('/api/admin/settings', new FormData(event.currentTarget));
      setNotice(COPY.admin.settings.saved);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : COPY.admin.settings.saveError);
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageHeader title={COPY.common.settings} description={COPY.admin.settings.description}/>
    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p className="form-notice" role="status">{notice}</p>}
    <form className="settings-form" onSubmit={submit}>
      <Card><h2>{COPY.admin.settings.homepage}</h2>
        <Field label={COPY.admin.settings.eyebrow}><Input name="eyebrow" maxLength={220} defaultValue={settings.eyebrow}/></Field>
        <div className="form-grid">
          <Field label={COPY.admin.settings.heroFirstLine}><Input name="hero_line1" maxLength={60} required defaultValue={settings.hero_line1}/></Field>
          <Field label={COPY.admin.settings.heroSecondLine}><Input name="hero_line2" maxLength={60} required defaultValue={settings.hero_line2}/></Field>
        </div>
        <Field label={COPY.admin.settings.highlight}><Input name="hero_highlight" maxLength={60} required defaultValue={settings.hero_highlight}/></Field>
        <Field label={COPY.admin.settings.introduction}><Textarea name="hero_description" maxLength={500} rows={4} defaultValue={settings.hero_description}/></Field>
      </Card>
      <Card><h2>{COPY.admin.settings.linksFooter}</h2>
        <Field label={COPY.admin.settings.instagramUrl}><Input name="instagram_url" type="url" defaultValue={settings.instagram_url}/></Field>
        <Field label={COPY.admin.settings.footerStatement}><Input name="footer_note" maxLength={220} defaultValue={settings.footer_note}/></Field>
      </Card>
      <Button type="submit" disabled={busy}>{busy ? COPY.admin.settings.saving : COPY.admin.settings.save}</Button>
    </form>
  </>;
}
