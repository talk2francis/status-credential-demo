import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      },
      colors: {
        night: '#030712',
        mint: '#4ADE80',
        amber: '#F59E0B',
        slate: '#94A3B8'
      }
    }
  },
  plugins: []
}
