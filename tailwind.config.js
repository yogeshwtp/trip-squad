module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-yellow': '#FFD600',
        'neo-pink': '#FF6B9D',
        'neo-blue': '#4A90E2',
        'neo-green': '#4CD964',
        'neo-orange': '#FF9500',
        'neo-purple': '#9B59B6',
        'neo-red': '#FF3B30',
      },
    },
  },
  plugins: [],
};
