/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f5ef',
          100: '#e9ecdf',
          200: '#d0d7bf',
          300: '#adb99a',
          400: '#879770',
          500: '#65794f',
          600: '#485e39',
          700: '#2E4129',
          800: '#263622',
          900: '#1c2919',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
