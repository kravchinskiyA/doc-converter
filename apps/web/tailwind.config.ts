import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'off-black': '#0f1012',
        'pure-black': '#020201',
        'off-white': '#f2f2f4',
        'pure-white': '#fdfdfd',
        'steel-gray': '#5e5e5e',
        'ash-gray': '#8f8f8f',
        'signal-blue': '#0071e3',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'PP Neue Montreal',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontWeight: {
        book: '350',
        regular: '400',
      },
      letterSpacing: {
        tight: '-0.02em',
      },
      borderRadius: {
        nav: '10px',
        btn: '26px',
        card: '54px',
        section: '63px',
        pill: '9999px',
      },
      borderWidth: {
        hairline: '0.5px',
        'hairline-strong': '1px',
        'hairline-accent': '1.8px',
      },
      boxShadow: {
        none: 'none',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
