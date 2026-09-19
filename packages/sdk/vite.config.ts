import { defineConfig } from 'vite-plus'

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  pack: {
    deps: { resolveDepSubpath: true },
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
