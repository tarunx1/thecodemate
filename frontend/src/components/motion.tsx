'use client';
import { motion, useReducedMotion } from 'framer-motion';
export function CardHover({ children }: { children: React.ReactNode }) { const reduced = useReducedMotion(); return <motion.div className="card-motion" initial={false} whileHover={reduced ? undefined : { y: -4 }} transition={{ duration: 0.22, ease: 'easeOut' }}>{children}</motion.div>; }
