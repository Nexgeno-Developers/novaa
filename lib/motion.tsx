/**
 * Lazy-loaded Framer Motion wrapper to reduce initial bundle size
 * Only loads Framer Motion when components actually need it
 */

import dynamic from 'next/dynamic';

// Lazy load Framer Motion components
export const motion = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
) as any;

export const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false }
) as any;

// Re-export commonly used motion components with lazy loading
export const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

export const MotionSection = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.section),
  { ssr: false }
);

export const MotionH1 = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.h1),
  { ssr: false }
);

export const MotionH2 = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.h2),
  { ssr: false }
);

// For hooks that need immediate access
export { useScroll, useTransform, useInView, useAnimation } from 'framer-motion';

// For types
export type { Variants } from 'framer-motion';

