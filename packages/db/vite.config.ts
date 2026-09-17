import { defineConfig } from 'vite-plus'

export default defineConfig({
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
