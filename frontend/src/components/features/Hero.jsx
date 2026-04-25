// ─── SMART AI ACCESS — PREMIUM HERO ──────────────────────────────────────────
import { useRef, useEffect } from 'react'
import { usePrebook } from '@/contexts/PrebookContext'

// ─── TUBES CURSOR BACKGROUND ─────────────────────────────────────────────────
//
// Dynamically loads threejs-components TubesCursor and mounts it onto a canvas
// that fills the hero section. Script is injected once and cached on window so
// navigating back to the hero doesn't re-fetch it.
//
// Mouse tracking: TubesCursor listens on window/document internally, so the
// canvas can stay pointer-events-none — clicks and hovers on hero content
// still work normally.
//
// Colors: tuned to complement the #0DFF7F brand green. Tube colors pull from
// the existing palette; light colors cycle through warm/cool complements.
// Swap any hex value to taste — or call app.tubes.setColors([...]) on demand.
//
const TUBES_CDN =
  'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'

const TUBE_COLORS = ['#0DFF7F', '#00D4AA', '#9B6DFF']
const LIGHT_COLORS = ['#0DFF7F', '#6DFFA8', '#9B6DFF', '#c9adff']

function TubesBg() {
  const canvasRef = useRef(null)
  const appRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let destroyed = false

    const init = () => {
      if (destroyed) return
      // TubesCursor is now available as a global from the loaded script
      appRef.current = window.TubesCursor(canvas, {
        tubes: {
          colors: TUBE_COLORS,
          lights: {
            intensity: 180,
            colors: LIGHT_COLORS,
          },
        },
      })
    }

    // If the script was already loaded by a previous mount, initialise directly
    if (window.TubesCursor) {
      init()
      return () => { destroyed = true }
    }

    // Otherwise inject the script tag once
    const existing = document.getElementById('tubes-cursor-script')
    if (existing) {
      // Script tag exists but TubesCursor not yet on window — wait for it
      existing.addEventListener('load', init)
      return () => {
        destroyed = true
        existing.removeEventListener('load', init)
      }
    }

    const script = document.createElement('script')
    script.id = 'tubes-cursor-script'
    script.src = TUBES_CDN
    script.async = true
    script.onload = init
    document.head.appendChild(script)

    return () => {
      destroyed = true
      // Note: Three.js scenes don't expose a universal destroy() — the canvas
      // element being removed from the DOM is sufficient cleanup for most cases.
      // If threejs-components adds a dispose() method in future, call it here.
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      // pointer-events-none: mouse events pass through to the document so
      // TubesCursor's internal window listeners still fire, while hero
      // buttons/links remain clickable.
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

import { BlurReveal, BlurWordReveal } from '@/components/ui/TextReveal'

// ─── HERO COMPONENT ──────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center relative overflow-hidden">

      {/* ── Tubes background (replaces HeroParticles) ─────────────────────── */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <TubesBg />
      </div>

      <div className="container relative z-[1] max-w-[860px] -mt-[6vh] md:-mt-[10vh]">

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <div className="glass-badge mb-14 animate-blur-reveal-badge [animation-delay:0.05s]">
          <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_10px_#0DFF7F,0_0_20px_rgba(13,255,127,0.4)] animate-pulse-dot" />
          <span className="font-body text-[0.7rem] sm:text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-green">
            Smart AI Access · Now Available
          </span>
        </div>

        {/* ── Headline ───────────────────────────────────────────────────── */}
        <h1 className="font-body font-extrabold text-[clamp(2.8rem,9vw,4.5rem)] leading-[1.1] text-white mb-6">
          <span className="block">
            <BlurReveal delay={0.15}>
              Your Edge in
            </BlurReveal>
          </span>
          <span className="block">
            <BlurReveal delay={0.38}>
              <span className="bg-gradient-to-br from-green via-[#00D4AA] to-green bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift whitespace-nowrap">
                Every Market
              </span>
            </BlurReveal>
          </span>
        </h1>

        {/* ── Subtext ────────────────────────────────────────────────────── */}
        <p className="font-body text-[clamp(1.05rem,2vw,1.15rem)] leading-[1.65] text-muted max-w-[540px] mx-auto mb-10">
          <BlurWordReveal
            text="A complete system built into your TradingView charts — nine capabilities that give you clarity, precision, and confidence on every trade."
            baseDelay={0.55}
            stagger={0.035}
          />
        </p>

        {/* ── CTA Buttons ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-3 justify-center animate-blur-reveal-cta [animation-delay:1.4s]">
          <a href="#pricing" className="btn-primary">
            View Pricing
            <span className="text-[1.1rem]">→</span>
          </a>
          <a href="#features" className="btn-secondary">
            Explore Features
          </a>
        </div>

        {/* ── Stats Table ────────────────────────────────────────────────── */}
        <div className="mt-12 md:mt-14 w-full max-w-[760px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 animate-fade-slide-up [animation-delay:1.6s]">
          {[
            { label: 'Signal Accuracy', value: 'High' },
            { label: 'Traders Waiting', value: '28k+' },
            { label: 'Market Coverage', value: '24/7' },
            { label: 'Execution Speed', value: '<50ms' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.05] hover:border-green/20">
              <span className="font-body text-[1.5rem] sm:text-[1.7rem] font-bold text-white mb-1 tracking-tight">{stat.value}</span>
              <span className="font-cond tracking-[0.15em] text-[0.65rem] sm:text-[0.7rem] uppercase text-green/90">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}