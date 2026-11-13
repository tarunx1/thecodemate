import Link from 'next/link';
import { Search } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { COPY, formatCopy } from '@/lib/copy';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'ghost';
export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`button button-${variant} ${className}`} {...props} />;
}
export function ButtonLink({ href, children, variant = 'primary', className = '' }: { href: string; children: ReactNode; variant?: ButtonVariant; className?: string }) {
  return <Link href={href} className={`button button-${variant} ${className}`}>{children}</Link>;
}
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input className="input" {...props} />; }
/** Search field with a decorative icon; still a native input inside a GET form. */
export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) { return <span className="search-input"><Search size={16} aria-hidden="true"/><input className="input" type="search" {...props} /></span>; }
export function Badge({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: 'neutral' | 'accent'; className?: string }) { return <span className={`badge badge-${tone} ${className}`}>{children}</span>; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className="input textarea" {...props} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select className="input" {...props} />; }
export function Card({ children, className = '' }: HTMLAttributes<HTMLDivElement>) { return <div className={`card ${className}`}>{children}</div>; }
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-actions">{action}</div>}</header>;
}
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><h3>{title}</h3><p>{description}</p></div>; }
export function ErrorState({ message }: { message: string }) { return <div className="error-state" role="alert">{message}</div>; }
export function Pagination({ page, total, pageSize, href }: { page: number; total: number; pageSize: number; href: (page: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages < 2) return null;
  return <nav className="pagination" aria-label={COPY.common.pagination}>
    {page > 1 ? <Link href={href(page - 1)}>{COPY.common.previous}</Link> : <span aria-disabled="true">{COPY.common.previous}</span>}
    <span>{formatCopy(COPY.common.pageOf, { page, pages })}</span>
    {page < pages ? <Link href={href(page + 1)}>{COPY.common.next}</Link> : <span aria-disabled="true">{COPY.common.next}</span>}
  </nav>;
}
export function Status({ item }: { item: { published: boolean; draft?: unknown } }) {
  return <span className={`status ${item.published ? 'status-live' : ''}`}>{item.published && item.draft ? COPY.common.publishedDraft : item.published ? COPY.common.published : item.draft ? COPY.common.draft : COPY.common.offline}</span>;
}
