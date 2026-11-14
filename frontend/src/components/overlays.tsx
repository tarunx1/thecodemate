'use client';
import { COPY } from '@/lib/copy';

/**
 * Shared Headless UI overlays. One implementation for every modal surface:
 * - Drawer: public mobile navigation and the admin mobile sidebar.
 * - ConfirmDialog: publish/unpublish confirmation (PublishDialog in the editor).
 * Headless UI supplies focus trapping, Escape/outside close, inert background,
 * scroll locking and focus restoration; styling stays in globals.css.
 *
 * Dialogs mount only while open: a closed Headless Dialog still server-renders a hidden
 * probe <span> with an inline style attribute, which the nonce CSP (style-src) blocks.
 */
import { Dialog, DialogPanel, DialogTitle, Description, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { Button } from './ui';

/**
 * Slide-in drawer with a blurred, theme-tinted backdrop. Transition keeps the dialog mounted
 * until the close animation ends, then unmounts it, so a closed drawer renders nothing.
 * Animation state comes from Headless UI's data-closed attribute (no inline styles, CSP-safe);
 * timing and tints live in globals.css (.drawer-*).
 */
export function Drawer({ open, onClose, title, side = 'left', tone = 'light', children }: {
  open: boolean; onClose: () => void; title: string; side?: 'left' | 'right'; tone?: 'light' | 'dark'; children: ReactNode;
}) {
  return <Transition show={open}>
    <Dialog onClose={onClose} className={`overlay drawer drawer-${side} overlay-${tone}`}>
      <TransitionChild as={Fragment}>
        <div className="overlay-backdrop drawer-backdrop" aria-hidden="true"/>
      </TransitionChild>
      <TransitionChild as={Fragment}>
        <DialogPanel className="drawer-panel">
          <div className="drawer-head">
            <DialogTitle className="drawer-title">{title}</DialogTitle>
            <button type="button" className="icon-button" aria-label={COPY.shared.closeNavigation} onClick={onClose}><X size={20}/></button>
          </div>
          {children}
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </Transition>;
}

export function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel = COPY.shared.cancel, tone = 'primary', busy = false, onConfirm, onClose }: {
  open: boolean; title: string; description: string; confirmLabel: string; cancelLabel?: string;
  tone?: 'primary' | 'secondary'; busy?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  if (!open) return null;
  return <Dialog open onClose={busy ? () => undefined : onClose} className="overlay overlay-light modal">
    <div className="overlay-backdrop" aria-hidden="true"/>
    <div className="modal-frame">
      <DialogPanel className="modal-panel">
        <DialogTitle className="modal-title">{title}</DialogTitle>
        <Description className="modal-description">{description}</Description>
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>{cancelLabel}</Button>
          <Button type="button" variant={tone} onClick={onConfirm} disabled={busy} data-autofocus>{busy ? COPY.shared.working : confirmLabel}</Button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>;
}
