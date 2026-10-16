import { defineConfig } from 'vite-plus'

export default defineConfig({
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
