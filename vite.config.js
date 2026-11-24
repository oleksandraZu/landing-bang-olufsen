import path from 'node:path'
import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'

// Vituum + Vite 8 залишає в dist файл index.pug.html — перейменовуємо на index.html
const renamePugHtml = () => ({
  name: 'rename-pug-html',
  enforce: 'post',
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.fileName.endsWith('.pug.html')) {
        chunk.fileName = chunk.fileName.replace('.pug.html', '.html')
      }
    }
  },
})

export default {
  base: '/landing-bang-olufsen/',
  build: {
    // зображення завжди окремими файлами (для srcset і lazy), а не base64 у HTML
    assetsInlineLimit: 0,
  },
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
    renamePugHtml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
}
