// npm run images — з images-src/ генерує AVIF, WebP та JPEG у кількох ширинах у src/assets/images/
// Логотип (є прозорість) — WebP + PNG. Ширини мають збігатися з mixins/media.pug.
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'images-src'
const OUT_DIR = 'src/assets/images'
const SURFACE = '#f9f9f9' // фон карток: JPEG без прозорості, тож прозорі PNG підкладаємо під нього

// hero і банер — "wide", решта фото — "card"; логотип — 2 ширини
const WIDTHS = {
  wide: [480, 960, 1920],
  card: [400, 800, 1200],
  logo: [360, 720],
}

const FORMATS = {
  avif: (img) => img.avif({ quality: 55 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.flatten({ background: SURFACE }).jpeg({ quality: 80, mozjpeg: true }),
}

const LOGO_FORMATS = {
  webp: (img) => img.webp({ quality: 85 }),
  png: (img) => img.png({ compressionLevel: 9 }),
}

const groupOf = (name) => {
  if (name.startsWith('logo')) return 'logo'
  if (name.startsWith('hero') || name.startsWith('banner')) return 'wide'
  return 'card'
}

await mkdir(OUT_DIR, { recursive: true })

const files = (await readdir(SRC_DIR)).filter((file) => /\.(webp|png|jpe?g)$/i.test(file))

for (const file of files) {
  const name = path.parse(file).name
  const group = groupOf(name)
  const formats = group === 'logo' ? LOGO_FORMATS : FORMATS

  for (const width of WIDTHS[group]) {
    for (const [ext, encode] of Object.entries(formats)) {
      const target = path.join(OUT_DIR, `${name}-${width}.${ext}`)
      await encode(
        sharp(path.join(SRC_DIR, file)).resize({ width, withoutEnlargement: true }),
      ).toFile(target)
    }
  }
  console.log(`✓ ${file} → ${WIDTHS[group].join('/')}px × ${Object.keys(formats).join('/')}`)
}
