'use client';
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
      setNotice('Settings saved. These changes are public immediately.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageHeader title="Settings" description="Edit the public site copy and links. Changes appear immediately."/>
    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p className="form-notice" role="status">{notice}</p>}
    <form className="settings-form" onSubmit={submit}>
      <Card><h2>Homepage</h2>
        <Field label="Eyebrow"><Input name="eyebrow" maxLength={220} defaultValue={settings.eyebrow}/></Field>
        <div className="form-grid">
          <Field label="Hero first line"><Input name="hero_line1" maxLength={60} required defaultValue={settings.hero_line1}/></Field>
          <Field label="Hero second line"><Input name="hero_line2" maxLength={60} required defaultValue={settings.hero_line2}/></Field>
        </div>
        <Field label="Highlighted phrase"><Input name="hero_highlight" maxLength={60} required defaultValue={settings.hero_highlight}/></Field>
        <Field label="Introduction"><Textarea name="hero_description" maxLength={500} rows={4} defaultValue={settings.hero_description}/></Field>
        <Input type="hidden" name="headline" defaultValue={settings.headline}/>
      </Card>
      <Card><h2>Links and footer</h2>
        <Field label="Instagram URL"><Input name="instagram_url" type="url" defaultValue={settings.instagram_url}/></Field>
        <Field label="Footer statement"><Input name="footer_note" maxLength={220} defaultValue={settings.footer_note}/></Field>
      </Card>
      <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</Button>
    </form>
  </>;
}
