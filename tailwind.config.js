/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './frontend/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        weather: {
          clear: '#3197f7', cloudy: '#66758c', rain: '#38496c', snow: '#7b9cc4', night: '#18274a'
        }
      },
      boxShadow: { glass: '0 20px 60px rgba(6, 20, 45, .22)' },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        cairo: ['var(--font-cairo)', 'ui-sans-serif', 'system-ui'],
        tajawal: ['var(--font-tajawal)', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
