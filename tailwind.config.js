/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg:           '#070710',
          surface:      '#10101a',
          'surface-2':  '#16161f',
          border:       'rgba(255,255,255,0.08)',
          'border-hi':  'rgba(255,255,255,0.14)',
          accent:       '#c97d3a',        // warm amber-orange (from the images)
          'accent-2':   '#4a6fd4',        // cool blue accent
          'accent-soft':'#e09a5a',
          glow:         'rgba(201,125,58,0.15)',
          text:         '#ece9e3',
          muted:        'rgba(236,233,227,0.45)',
          'muted-2':    'rgba(236,233,227,0.25)'
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      boxShadow: {
        'glow-accent': '0 0 30px rgba(201,125,58,0.12), 0 0 60px rgba(201,125,58,0.06)',
        'card': '0 1px 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)'
      }
    }
  },
  plugins: []
}
