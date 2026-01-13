/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./website/**/*.{vue,js,ts,jsx,tsx,md}",
    "./website/.vitepress/**/*.{vue,js,ts,jsx,tsx}",
    "./website/*.md"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        surface: '#ffffff',
        'on-surface': '#000000',
        'on-surface-variant': '#374151',
      },
    },
  },
  plugins: [],
}