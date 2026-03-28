/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sh-primary': {
          DEFAULT: '#6366f1', // indigo-500
          hover: '#4f46e5',   // indigo-600
          light: '#e0e7ff',   // indigo-100
          dark: '#3730a3',
        },
        'sh-secondary': {
          DEFAULT: '#10b981', // emerald-500
          hover: '#059669',   // emerald-600
          light: '#d1fae5',   // emerald-100
        },
        'sh-accent': {
          DEFAULT: '#f59e0b', // amber-500
          hover: '#d97706',   // amber-600
          light: '#fef3c7',   // amber-100
        },
        'sh-success': {
          DEFAULT: '#22c55e', // green-500
          hover: '#16a34a',
          light: '#dcfce7',
        },
        'sh-danger': {
          DEFAULT: '#ef4444', // red-500
          hover: '#dc2626',
          light: '#fee2e2',
        },
        'sh-neutral': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'modern': '0 10px 25px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'modern-lg': '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
        'modern-xl': '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 25px rgba(99, 102, 241, 0.2)',
        'glow-lg': '0 10px 40px rgba(99, 102, 241, 0.3)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
