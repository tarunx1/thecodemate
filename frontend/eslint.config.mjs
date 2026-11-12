import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // SilkWaves.tsx is owner-supplied and kept verbatim. It mirrors props into a ref during render
  // so its animation loop reads the latest values without re-subscribing; allowed for this file only.
  { files: ['src/components/motion/SilkWaves.tsx'], rules: { 'react-hooks/refs': 'off' } },
]);
