/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080B10',
        surface: '#0D1117',
        'surface-alt': '#111820',
        'surface-hover': '#161B22',
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          md: 'rgba(255,255,255,0.12)',
        },
        green: {
          DEFAULT: '#0DFF7F',
          dim: 'rgba(13,255,127,0.08)',
          glow: 'rgba(13,255,127,0.1)',
          border: 'rgba(13,255,127,0.18)',
        },
        accent: {
          DEFAULT: '#0DFF7F',
          lt: '#6DFFA8',
          dim: 'rgba(13,255,127,0.1)',
          border: 'rgba(13,255,127,0.35)',
        },
        muted: {
          DEFAULT: 'rgba(255,255,255,0.45)',
          lt: 'rgba(255,255,255,0.7)',
        },
        red: '#ff5b79',
        purple: {
          DEFAULT: '#9B6DFF',
          lt: '#c9adff',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        cond: ['Barlow Condensed', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'fade-slide-up':      'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'fade-slide-down':    'fadeSlideDown 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'fade-zoom':          'fadeZoom 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'gradient-shift':     'gradientShift 3s ease infinite',
        'subtle-float':       'subtleFloat 6s ease-in-out infinite',
        'glow-pulse':         'glowPulse 2s ease-in-out infinite alternate',
        'slide-in-right':     'slideInRight 1s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-left':      'slideInLeft 1s cubic-bezier(0.16,1,0.3,1) both',
        'float-orb':          'floatOrb 8s ease-in-out infinite',
        'float-orb-reverse':  'floatOrb 6s ease-in-out infinite reverse',
        'pulse-dot':          'pulseDot 2s ease-in-out infinite',
        'button-breathe':     'buttonBreathe 1s ease-in-out infinite alternate',
        'nav-dot-pulse':      'navDotPulse 2.5s ease-in-out infinite alternate',
        'spin-border':        'spinBorder 6s linear infinite',
        'fade-in':            'fadeIn 0.25s ease',
        'scale-in':           'scaleIn 0.25s ease',
        // ─── legacy (kept for backwards compat) ───────────────────────────
        'blur-reveal':        'blurRevealCenter 1.2s 0.1s cubic-bezier(0.16,1,0.3,1) both',
        // ─── cinematic blur reveal suite ──────────────────────────────────
        // Per-element delay is set via [animation-delay:Xs] arbitrary value
        'blur-reveal-hero':   'blurReveal 1.2s cubic-bezier(0.22,1,0.36,1) both',
        'blur-reveal-soft':   'blurRevealSoft 1.1s cubic-bezier(0.22,1,0.36,1) both',
        'blur-reveal-badge':  'badgeBlurIn 1s cubic-bezier(0.22,1,0.36,1) both',
        'blur-reveal-cta':    'ctaBlurIn 1s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeZoom: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          from: { opacity: '0.4', transform: 'scale(0.8)' },
          to:   { opacity: '0.8', transform: 'scale(1.1)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        floatOrb: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-30px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1',   boxShadow: '0 0 10px #0DFF7F, 0 0 20px rgba(13,255,127,0.4)' },
          '50%':      { opacity: '0.7', boxShadow: '0 0 5px #0DFF7F, 0 0 10px rgba(13,255,127,0.2)' },
        },
        buttonBreathe: {
          from: { boxShadow: '0 0 20px rgba(13,255,127,0.2), 0 4px 20px rgba(0,0,0,0.3)', transform: 'scale(1)' },
          to:   { boxShadow: '0 0 45px rgba(13,255,127,0.4), 0 6px 30px rgba(13,255,127,0.15)', transform: 'scale(1.015)' },
        },
        navDotPulse: {
          from: { boxShadow: '0 0 4px #0DFF7F' },
          to:   { boxShadow: '0 0 12px #0DFF7F, 0 0 24px rgba(13,255,127,0.3)' },
        },
        spinBorder: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        // ─── legacy blur reveal ────────────────────────────────────────────
        blurRevealCenter: {
          '0%':   { opacity: '0', filter: 'blur(12px)', transform: 'translateY(20px)' },
          '100%': { opacity: '1', filter: 'blur(0)',    transform: 'translateY(0)' },
        },
        // ─── headline: heavy 16px blur + scale + letter-spacing expansion ──
        blurReveal: {
          '0%':   { filter: 'blur(16px)',  opacity: '0',    transform: 'scale(0.94)',  letterSpacing: '-0.06em' },
          '60%':  { filter: 'blur(1.5px)', opacity: '0.92', transform: 'scale(0.998)', letterSpacing: '0.004em' },
          '100%': { filter: 'blur(0px)',   opacity: '1',    transform: 'scale(1)',     letterSpacing: '0.01em'  },
        },
        // ─── subtext words: soft 8px blur, gentle scale ───────────────────
        blurRevealSoft: {
          '0%':   { filter: 'blur(8px)',   opacity: '0',   transform: 'scale(0.96)', letterSpacing: '-0.04em' },
          '60%':  { filter: 'blur(0.8px)', opacity: '0.9', transform: 'scale(1)',    letterSpacing: '0.002em' },
          '100%': { filter: 'blur(0px)',   opacity: '1',   transform: 'scale(1)',    letterSpacing: '0em'     },
        },
        // ─── badge: scale + blur in ────────────────────────────────────────
        badgeBlurIn: {
          '0%':   { filter: 'blur(6px)',  opacity: '0', transform: 'scale(0.96)' },
          '100%': { filter: 'blur(0px)', opacity: '1', transform: 'scale(1)'    },
        },
        // ─── cta buttons: blur + slight rise ──────────────────────────────
        ctaBlurIn: {
          '0%':   { filter: 'blur(10px)', opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          '100%': { filter: 'blur(0px)',  opacity: '1', transform: 'translateY(0) scale(1)'       },
        },
      },
    },
  },
  plugins: [],
}