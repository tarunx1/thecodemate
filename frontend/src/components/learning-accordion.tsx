'use client';
import { useState } from 'react';

type Item = { number: string; title: string; text: string };

/** Frosted-glass accordion: one panel open at a time, any panel can be collapsed. Height animates via grid rows. */
export function LearningAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="learning-accordion">{items.map((item, index) => {
    const expanded = open === index;
    return <div key={item.number} className="learning-item" data-open={expanded ? 'true' : 'false'}>
      <h3><button type="button" id={`learning-trigger-${index}`} aria-expanded={expanded} aria-controls={`learning-panel-${index}`} onClick={() => setOpen(expanded ? null : index)}>
        <span className="learning-number">{item.number}</span>
        <span>{item.title}</span>
        <span className="learning-toggle"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14"/><path className="learning-bar" d="M12 5v14"/></svg></span>
      </button></h3>
      <div id={`learning-panel-${index}`} role="region" aria-labelledby={`learning-trigger-${index}`} className="learning-panel" inert={!expanded}>
        <div className="learning-panel-inner"><p>{item.text}</p></div>
      </div>
    </div>;
  })}</div>;
}
