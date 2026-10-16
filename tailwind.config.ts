import type { Config } from 'tailwindcss';

/**
 * Design tokens. Palette: deep navy + royal blue + white, accented with soft sky and subtle gold.
 * Change these values to re-brand the entire site.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        navy: {
          50: '#eef3fb', 100: '#d9e3f5', 200: '#b3c6ea', 300: '#829fd8', 400: '#5577c2',
          500: '#3659a8', 600: '#27458c', 700: '#1f3772', 800: '#172a59', 900: '#0f1d40', 950: '#091330',
        },
        royal: {
          50: '#eff5ff', 100: '#dbe8fe', 200: '#bfd5fe', 300: '#93b8fd', 400: '#6093fa',
          500: '#3b6ff6', 600: '#2552eb', 700: '#1d3fd8', 800: '#1e35af', 900: '#1e328a', 950: '#172154',
        },
        gold: {
          50: '#fbf8eb', 100: '#f6eecb', 200: '#eedc9a', 300: '#e4c461', 400: '#dbad38',
          500: '#c9962a', 600: '#ad7522', 700: '#8b551f', 800: '#734520', 900: '#623a20',
        },
        ink: { DEFAULT: '#0f172a', soft: '#334155', muted: '#475569' },
        surface: { DEFAULT: '#ffffff', alt: '#f6f8fc', sunken: '#eef2f9' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        card: '0 1px 2px rgba(15,29,64,0.04), 0 4px 16px -4px rgba(15,29,64,0.08)',
        lift: '0 2px 4px rgba(15,29,64,0.04), 0 18px 40px -12px rgba(15,29,64,0.22)',
        glow: '0 0 0 1px rgba(201,150,42,0.25), 0 10px 30px -10px rgba(201,150,42,0.45)',
      },
      backgroundImage: {
        'hero-fade': 'linear-gradient(180deg, rgba(9,19,48,0.55) 0%, rgba(9,19,48,0.75) 60%, rgba(9,19,48,0.92) 100%)',
        'navy-radial': 'radial-gradient(120% 120% at 0% 0%, #1e328a 0%, #0f1d40 45%, #091330 100%)',
        'grid-faint': 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
