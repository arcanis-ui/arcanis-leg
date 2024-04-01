/// <reference types="vitest" />

import license from 'rollup-plugin-license';
import dts from 'vite-plugin-dts';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { defineConfig } from 'vite';

const PKG_UNIT = 'packages';
const PKG_NAME = 'chromagon';
const PKG_EXTERNAL_DEPS = ['colorjs.io'];

export default defineConfig({
  root: __dirname,
  cacheDir: `../../node_modules/.vite/${PKG_UNIT}/${PKG_NAME}`,
  plugins: [
    {
      ...license({
        sourcemap: true,
        banner: {
          commentStyle: 'ignored',
          content: {
            file: '../../LICENSE_BANNER',
            encoding: 'utf-8'
          }
        }
      }),
      enforce: 'pre'
    },
    dts({
      entryRoot: 'src',
      rollupTypes: true,
      compilerOptions: {
        removeComments: true
      }
    }),
    codecovVitePlugin({
      enableBundleAnalysis: process.env['CODECOV_TOKEN'] !== undefined,
      uploadToken: process.env['CODECOV_TOKEN'],
      bundleName: `@draconic/${PKG_NAME}`
    })
  ],
  build: {
    outDir: './dist',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    emptyOutDir: true,
    rollupOptions: {
      external: PKG_EXTERNAL_DEPS
    }
  },
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
