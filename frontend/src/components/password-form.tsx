'use client';
import { useState } from 'react';
import { COPY } from '@/lib/copy';
import { adminPost } from '@/lib/client-api';
import { Button, Card, Field, Input } from './ui';

/** Owner password change. The server verifies the current password, policy and CSRF. */
export function PasswordForm() {
  const copy = COPY.admin.account;
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError(''); setNotice('');
    if (data.get('new_password') !== data.get('confirm_password')) { setError(copy.mismatch); return; }
    setBusy(true);
    try {
      await adminPost<{ ok: boolean }>('/api/admin/password', data);
      form.reset();
      setNotice(copy.saved);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.error);
    } finally {
      setBusy(false);
    }
  }
  return <form className="settings-form password-form" onSubmit={submit} aria-labelledby="password-title">
    <Card><h2 id="password-title">{copy.title}</h2><p>{copy.description}</p>
      <Field label={copy.current}><Input name="current_password" type="password" autoComplete="current-password" required maxLength={128}/></Field>
      <div className="form-grid">
        <Field label={copy.new} hint={copy.hint}><Input name="new_password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></Field>
        <Field label={copy.confirm}><Input name="confirm_password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></Field>
      </div>
    </Card>
    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p className="form-notice" role="status">{notice}</p>}
    <Button type="submit" disabled={busy}>{busy ? copy.saving : copy.save}</Button>
  </form>;
}
