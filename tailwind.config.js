/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#000000',
          900: '#060608',
          850: '#0a0a0d',
          800: '#101114',
          750: '#15161a',
          700: '#1c1d22',
          600: '#26272e',
          500: '#34363f',
        },
        regolith: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        earth: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#38bdf8',
          600: '#2563eb',
          glow: 'rgba(96, 165, 250, 0.15)',
        },
        telemetry: {
          green: '#22c55e',
          amber: '#eab308',
          red: '#ef4444',
          cyan: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Noto Sans Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Noto Sans"', 'sans-serif'],
        brand: ['"Noto Sans"', 'sans-serif'],
      },
      boxShadow: {
        'instrument': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'subtle-glow': '0 0 15px -3px rgba(255, 255, 255, 0.08)',
        'earth-glow': '0 0 25px -4px rgba(56, 189, 248, 0.25)',
      },
      animation: {
        'radar-sweep': 'radarSweep 5s linear infinite',
        'earth-pulse': 'earthPulse 4s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        earthPulse: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        }
      },
    },
  },
  plugins: [],
}
