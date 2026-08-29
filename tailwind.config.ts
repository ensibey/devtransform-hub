import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oled: '#000000',
        canvas: '#050507',
        surface: {
          50: '#1e1e24',
          100: '#18181b',
          200: '#121215',
          300: '#0d0d10',
          DEFAULT: '#09090b',
        },
        border: {
          subtle: '#18181b',
          DEFAULT: '#27272a',
          hover: '#3f3f46',
        },
        brand: {
          emerald: '#10b981',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: [
          'Geist',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Geist Mono',
          'Fira Code',
          'Cascadia Code',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
