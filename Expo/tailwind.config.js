/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: '#0d1526',
        card: '#111d35',
        border: '#1e2d4a',
        primaryText: '#f1f5f9',
        mutedText: '#64748b',
        urgentRed: '#ef4444',
        availableGreen: '#22c55e',
        amber: '#f59e0b',
        actionBlue: '#3b82f6',
      },
      borderRadius: {
        card: '14px',
        pill: '20px',
      },
    },
  },
  plugins: [],
};