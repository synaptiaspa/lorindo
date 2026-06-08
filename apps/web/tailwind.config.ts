import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: '#4A42B0', light: '#EEEDFE', dark: '#3C3489' },
        surface: { DEFAULT: '#FFFFFF', secondary: '#F0EEE9' },
        border: { DEFAULT: 'rgba(0,0,0,0.08)' },
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], mono: ['DM Mono', 'monospace'] },
      borderRadius: { DEFAULT: '10px', sm: '6px' },
    },
  },
  plugins: [],
}
export default config
