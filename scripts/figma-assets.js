// node scripts/figma-assets.js — завантажує вихідні зображення з Figma (Dev Mode / MCP) у images-src/
// УВАГА: посилання тимчасові (діють 7 днів від створення). Якщо вони протухли — повторно отримайте їх
// через Figma (get_design_context → assetPathPrefix) або експортуйте зображення вручну (див. docs/figma-spec.md).
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = 'images-src'
const BASE_1260 = 'https://www.figma.com/api/mcp/asset/6cb2e8ae-c2a1-4283-89be-65d8c01fdccd'
const BASE_320 = 'https://www.figma.com/api/mcp/asset/9748bd67-2547-4a9d-b5b5-f12ee636c88f'

// ім'я файлу → URL (у дужках — вузол/призначення у макеті)
const ASSETS = {
  'hero.png': `${BASE_1260}/129dd.png`, // hero, усі ширини
  'banner.png': `${BASE_1260}/c0f7c.png`, // нижній банер (квадрат)
  'logo.png': `${BASE_1260}/32a3f.png`, // логотип (растр)
  'product-a5.png': `${BASE_1260}/d92c0.png`,
  'product-hx.png': `${BASE_1260}/fc17a.png`,
  'product-theatre.png': `${BASE_1260}/6b07d.png`,
  'portable-1.png': `${BASE_1260}/f6ec4.png`,
  'portable-1-sm.png': `${BASE_320}/611a6.png`, // 320
  'portable-2.png': `${BASE_1260}/643c4.png`,
  'earphones-1.png': `${BASE_1260}/f1b66.png`,
  'earphones-2.png': `${BASE_1260}/3d739.png`,
  'smart-home-1.png': `${BASE_1260}/9c5e1.png`,
  'smart-home-2.png': `${BASE_1260}/bb8d2.png`,
  'smart-home-2-sm.png': `${BASE_320}/abd21.png`, // 320
}

await mkdir(OUT_DIR, { recursive: true })

let failed = 0
for (const [file, url] of Object.entries(ASSETS)) {
  const response = await fetch(url)
  if (!response.ok) {
    console.error(`✗ ${file}: ${response.status} ${response.statusText}`)
    failed += 1
    continue
  }
  await writeFile(path.join(OUT_DIR, file), Buffer.from(await response.arrayBuffer()))
  console.log(`✓ ${file}`)
}

if (failed) {
  console.error(`\n${failed} файл(ів) не завантажено — посилання, ймовірно, протухли.`)
  process.exitCode = 1
}
