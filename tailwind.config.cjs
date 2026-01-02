/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          medium: '#3b82f6',
          strong: '#1d4ed8',
        },
        neutral: {
          primary: {
            medium: '#ffffff',
          },
          tertiary: {
            medium: '#f1f5f9',
          },
        },
        default: {
          medium: '#e2e8f0',
        },
      },
      borderRadius: {
        base: '0.75rem',
      },
    },
  },
  plugins: [],
};
