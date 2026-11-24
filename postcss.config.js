import autoprefixer from 'autoprefixer'

// Vite автоматично підхоплює цей файл і застосовує до всіх CSS/SCSS (dev і build).
// Цільові браузери для Autoprefixer — у .browserslistrc.
export default {
  plugins: [autoprefixer()],
}
