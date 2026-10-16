import { defineConfig } from 'vite-plus'

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-3-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  pack: {
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
    },
    entry: './src/index.ts',
    outDir: './dist',
    format: ['es', 'cjs'],
    dts: true,
    unbundle: true,
    target: 'node12',
    sourcemap: false,
    outExtensions(context) {
      if (context.format === 'es') {
        return {
          js: '.mjs',
        }
      }

      return {
        js: '.cjs',
      }
    },
  },
})
