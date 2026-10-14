import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: './src/index.ts',
    outDir: './dist',
    format: ['cjs'],
    dts: true,
    unbundle: true,
    target: 'node12',
    sourcemap: false,
    deps: {
      neverBundle: true,
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
    },
    outExtensions(context) {
      if (context.format === 'cjs') {
        return {
          js: '.cjs',
        }
      }
    },
  },
})
