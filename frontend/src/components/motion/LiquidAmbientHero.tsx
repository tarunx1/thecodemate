'use client';
/**
 * LiquidAmbientHero — dark first-screen hero: the owner-supplied SilkWaves WebGL background
 * (brand-orange palette) behind centred hero text.
 *
 * - SilkWaves is decorative (aria-hidden, no pointer events) and pauses itself offscreen and
 *   under prefers-reduced-motion; `speed` is also set to 0 in those states.
 * - It renders on the client only: SilkWaves sets inline `style` props, which the nonce CSP
 *   blocks in server HTML but allows when React applies them in the browser. Without WebGL
 *   (or before hydration / without JavaScript) a static CSS glow is shown instead.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { SilkWaves, ORANGE } from './SilkWaves';

export type LiquidAmbientHeroProps = {
  className?: string;
  children?: ReactNode;
};

const PORTRAIT_QUERY = '(max-aspect-ratio: 85/100)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    onChange => { const mq = window.matchMedia(query); mq.addEventListener('change', onChange); return () => mq.removeEventListener('change', onChange); },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try { webglSupport = !!document.createElement('canvas').getContext('webgl'); } catch { webglSupport = false; }
  }
  return webglSupport;
}
const noopSubscribe = () => () => undefined;

export function LiquidAmbientHero({ className = '', children }: LiquidAmbientHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const reduced = useMediaQuery(REDUCED_QUERY);
  const portrait = useMediaQuery(PORTRAIT_QUERY);
  // false on the server and during hydration, so SilkWaves is client-rendered only.
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const state = reduced ? 'static' : visible ? 'running' : 'paused';
  return <section ref={rootRef} className={`liquid-hero ${className}`} data-liquid-state={state} data-liquid-layout={portrait ? 'portrait' : 'landscape'}>
    {webgl
      ? <SilkWaves colors={ORANGE} speed={state === 'running' ? 0.4 : 0} className="silk-waves"/>
      : <div className="liquid-stage liquid-stage-fallback" aria-hidden="true"/>}
    <div className="liquid-hero__content">{children}</div>
  </section>;
}
