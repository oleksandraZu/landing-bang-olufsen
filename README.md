# landing-bang-olufsen

Лабораторна робота №10 · **Варіант 1: Bang & Olufsen** · методологія **BEM + SMACSS**.
Адаптивний лендінг за макетом Figma. Збірка: Vite + Pug + SCSS, **без JavaScript**.

- Макет: [Figma, сторінка `v2 B&O`](https://www.figma.com/design/xIVUXiPZ3hdpEFiIC0qbTL/BOSE-New-Version?node-id=6817-432)
- Демо: TODO (GitHub Pages — `https://<користувач>.github.io/landing-bang-olufsen/`)

## Команди

```bash
npm install
npm run dev          # dev-сервер
npm run build        # збірка в dist/
npm run preview      # перегляд збірки
npm run lint         # Stylelint + Prettier --check
npm run format       # Prettier --write
npm run images       # AVIF + WebP + JPEG у кількох ширинах (images-src → src/assets/images)
npm run figma:assets # (за потреби) завантажити вихідні зображення з Figma в images-src
```

## Декомпозиція на БЕМ-блоки

| Блок            | Елементи                                                                | Модифікатори / мікси                                                     |
| --------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `header`        | `toggle`, `inner`, `logo`, `actions`, `phone`, `phone-number`, `burger` | розміщення: `l-header`                                                   |
| `nav`           | `bar`, `logo`, `close`, `body`, `list`, `link`, `contacts`, `call`      | стан — `:checked ~`                                                      |
| `logo`          | `img`                                                                   | —                                                                        |
| `icon`          | `line`                                                                  | `icon--phone`, `icon--burger`, `icon--close`; `icon__line--top/--bottom` |
| `hero`          | `media`, `content`, `title`                                             | `hero__media` = мікс із `media`                                          |
| `media`         | `picture`, `img`                                                        | кадрування через custom properties                                       |
| `product-card`  | `media`, `title`, `text`, `price`                                       | міксується з `recommended__item`                                         |
| `recommended`   | `title`, `item`                                                         | —                                                                        |
| `category`      | `media`, `title`                                                        | міксується з `categories__item`                                          |
| `categories`    | `title`, `item`, `button`                                               | —                                                                        |
| `banner`        | `media`                                                                 | —                                                                        |
| `timeless`      | `title`, `text`                                                         | —                                                                        |
| `contacts`      | `title`, `form`, `submit`, `info`, `list`, `label`, `value`             | —                                                                        |
| `button`        | —                                                                       | міксується з `categories__button`, `contacts__submit`                    |
| `field`         | `control`                                                               | `field__control--textarea`                                               |
| `section-title` | —                                                                       | міксується з `*__title`                                                  |

Однакові за виглядом елементи — один блок: `button` (View all / Send), `field` (input / textarea), `media` (hero, банер, картки, категорії).

## Архітектура стилів (SMACSS)

```
src/styles/
├── abstracts/   змінні, map-и, міксини (mq, visually-hidden, transition) — CSS не генерують
├── base/        reset, типографіка, @font-face — лише селектори елементів, жодного класу
├── layout/      l-grid, l-header, l-section, l-full — великі області сторінки
├── modules/     BEM-блоки, один блок = один partial
├── state/       is-visually-hidden, is-hidden
├── theme/       custom properties (:root) з токенів
└── main.scss
```

**Порядок каскаду** (`main.scss`): `theme → base → layout → modules → state`. Від загального до конкретного: токени, потім стилі елементів, каркас, компоненти, і наприкінці стани, щоб вони перемагали за однакової специфічності.

**Іменування:** BEM `block__element--modifier`; префікси SMACSS: `l-` (layout), `is-` / `has-` (стани). Без `id` у селекторах, без тегових селекторів у блоках, без `!important`, вкладеність ≤ 3. Правила перевіряє Stylelint (`selector-class-pattern`, `selector-max-id`, `selector-max-type`, `declaration-no-important`; у `base/` заборонені класи).

**Мікси:** блок не задає власних зовнішніх відступів і позиціонування — це робить батьківський блок: `class="product-card recommended__item"`, `class="button categories__button"`, `class="media hero__media"`.

**Токени:** SCSS-map (`abstracts/_tokens.scss`) → CSS custom properties (`theme/`). Брейкпоінти — лише через `mq()` (mobile first): `md` = 744px, `lg` = 1260px.

## Модульна сітка

| Ширина | Колонки | Колонка | Gutter | Margin                 |
| ------ | ------- | ------- | ------ | ---------------------- |
| 320    | 2       | 130px   | 20px   | 20px                   |
| 744    | 6       | 80px    | 24px   | 72px                   |
| 1260   | 12      | 63px    | 24px   | 120px (контент 1020px) |

Значення звірені з фреймами `Grid` / `Info` макета B&O. Для 744 в `Info` написано gutter 64px, але на `Grid` колонки стоять з кроком 104px (80 + 24), тому в коді 24px.

Сітка — блок `.l-grid` (CSS Grid, `grid-template-columns: repeat(var(--grid-columns), 1fr)`, `column-gap`, `padding-inline`, `max-width: 1260px`, `margin-inline: auto`). Кількість колонок, gutter і поля змінюються custom properties в `mq()`. Елементи розміщуються по колонках: `grid-column: span 4`, `1 / span 3`, `8 / span 5` тощо. Hero, банер і фон секції «Timeless» виходять за межі сітки на всю ширину viewport. Режим налагодження: `.l-grid--debug` (підсвічує колонки).

Розкладка за макетом B&O: Recommended — по 4 з 12 (1260) / на всю ширину (744, 320); категорії — 6 + 6 / 3 + 3 / 1 + 1; «Timeless» — заголовок 1–6 і текст 8–12 (1260), 1–3 і 4–6 (744).

## Меню без JavaScript

`<input type="checkbox">` + `<label>`: стан `:checked ~ .nav` показує оверлей (`visibility`, тому пункти не потрапляють у Tab-порядок, поки меню закрите). Чекбокс має `aria-label`, фокус видно (`:focus-visible` на бургері й на «закрити»). Бургер у відкритому меню замінюється іконкою «закрити» в тій самій позиції.
Обмеження підходу: немає закриття по `Esc` та по кліку на пункт-якір (меню закривається повторним кліком по «закрити»), немає блокування прокрутки сторінки.

## Pixel perfect, W3C, PageSpeed

Докладна специфікація макета — `docs/figma-spec.md`.

TODO: скриншоти PerfectPixel (320, 744, 1260), W3C Validator (0 помилок), PageSpeed Insights (Mobile і Desktop).

[Скріншоти перевірок](./screenshot)
