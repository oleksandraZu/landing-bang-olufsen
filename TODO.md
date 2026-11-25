# Що залишилось зробити вручну

1. Скопіювати `src/styles`, `src/pug`, `src/index.pug`, `.stylelintrc.json`, `.prettierrc`, `README.md`, `docs/` у проєкт з lab-09 (Vite, Pug, PostCSS, husky, lint-staged, `npm run images`, `vite.config.js` з `base`, GitHub Actions). Підлаштувати шляхи.
2. Експортувати зображення за таблицею в `docs/figma-spec.md` → `src/images/` → `npm run images` (AVIF + WebP + JPG, ширини 480 / 960 / 1920).
3. Додати `public/favicon.svg`.
4. `npm run lint`, `npm run build`, перевірити в 320 / 744 / 1260 та між ними; підігнати значення, якщо відхилення > 5px.
5. PerfectPixel (3 скриншоти), W3C Validator, PageSpeed (Mobile/Desktop), публікація на GitHub Pages, коміти за Conventional Commits.
6. Вирішити розбіжності макета (див. «Розбіжності» у `docs/figma-spec.md`), зокрема логотип — растровий.
