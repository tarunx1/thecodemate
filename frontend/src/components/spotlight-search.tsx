'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { Button, SearchInput, Select } from './ui';
import { COPY, formatCopy } from '@/lib/copy';

const subscribe = () => () => {};

type Props = { kind: 'topics' | 'projects'; categories: string[]; query?: string; category?: string };

/** One native GET form: the server remains authoritative for search and categories. */
export function SpotlightSearch({ kind, categories, query = '', category = '' }: Props) {
  const [open, setOpen] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const expanded = !hydrated || open;
  const input = useRef<HTMLInputElement>(null);
  const suppressOpen = useRef(false);
  const copy = COPY.public.directory;
  return <form action={`/${kind}`} method="get" role="search" className="spotlight-search" data-open={expanded}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setOpen(false); suppressOpen.current = true; input.current?.focus(); } }}>
    <div className="spotlight-bar">
      <SearchInput ref={input} name="q" defaultValue={query} aria-label={formatCopy(copy.search, { kind })}
        placeholder={formatCopy(copy.searchPlaceholder, { kind })} onFocus={() => { if (suppressOpen.current) suppressOpen.current = false; else setOpen(true); }} onClick={() => setOpen(true)}/>
    </div>
    <div className="spotlight-expansion" inert={!expanded} aria-hidden={!expanded}>
      <div className="spotlight-inner">
        <div className="spotlight-control spotlight-category-control"><Select name="category" aria-label={copy.filterCategory} defaultValue={category}>
          <option value="">{COPY.common.allCategories}</option>
          {categories.map(value => <option key={value} value={value}>{value}</option>)}
        </Select></div>
        <div className="spotlight-control spotlight-apply-control"><Button type="submit">{copy.applyFilters}</Button></div>
      </div>
    </div>
  </form>;
}
