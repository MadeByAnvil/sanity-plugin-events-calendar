import {defineConfig} from '@sanity/pkg-utils'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default defineConfig({
  extract: {
    bundledPackages: [''],
  },
  rollup: {
    plugins: [
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        // Don't inject styles during build
        inject: false,
        // Extract to root dist directory
        extract: 'styles.css',
        modules: false,
        sourceMap: process.env.NODE_ENV !== 'production',
        minimize: process.env.NODE_ENV === 'production',
        autoModules: false,
        // Process @import statements to include all CSS in one file
        extensions: ['.css'],
      }),
    ],
  },
})