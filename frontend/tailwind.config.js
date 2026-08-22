/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#E5E5E5',
          surface: '#EEEEEE',
          raised: '#F5F5F5',
          text: '#111111',
          muted: '#777777',
          border: 'rgba(255,255,255,0.8)'
        },
        brand: {
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
          950: '#09090b',
        },
        darkBg: '#0f172a',
        darkCard: '#1e293b',
        darkBorder: '#334155',
        // Button required colors
        main: 'var(--main)',
        overlay: 'var(--overlay)',
        bg: 'var(--bg)',
        bw: 'var(--bw)',
        blank: 'var(--blank)',
        text: 'var(--text)',
        mtext: 'var(--mtext)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        ringOffset: 'var(--ring-offset)',
        secondaryBlack: '#212121',
      },
      boxShadow: {
        'paper': '6px 6px 14px rgba(163, 174, 194, 0.22), -4px -4px 10px rgba(255,255,255,0.75)',
        'paper-inset': 'inset 2px 2px 5px rgba(163,174,194,0.18), inset -2px -2px 5px rgba(255,255,255,0.7)',
        'paper-sm': '3px 3px 8px rgba(163, 174, 194, 0.22), -2px -2px 6px rgba(255,255,255,0.75)',
        // Button required shadow
        'shadow': 'var(--shadow)',
      },
      borderRadius: {
        base: '5px'
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
