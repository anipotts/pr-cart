/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // GitHub-inspired colors
        'gh-green': '#238636',
        'gh-red': '#da3633',
        'gh-blue': '#58a6ff',
        'gh-border': '#30363d',
        'gh-bg': '#0d1117',
        'gh-bg-secondary': '#161b22',
        'gh-text': '#c9d1d9',
        'gh-text-muted': '#8b949e',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
