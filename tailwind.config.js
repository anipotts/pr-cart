/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#141414',
          card: '#1a1a1a',
          'card-hover': '#222222',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1a1',
          muted: '#6b7280',
        },
        accent: {
          primary: '#3b82f6',
          success: '#22c55e',
          danger: '#ef4444',
          warning: '#f59e0b',
        },
        border: '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
