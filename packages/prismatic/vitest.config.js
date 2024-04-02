import { defineConfig } from 'vitest/config';

const PKG_UNIT = 'packages';
const PKG_NAME = 'prismatic';

export default defineConfig({
  root: __dirname,
  cacheDir: `../../node_modules/.vite/${PKG_UNIT}/${PKG_NAME}`,
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      reportsDirectory: `../../coverage/${PKG_UNIT}/${PKG_NAME}`,
      provider: 'v8'
    }
  }
});
