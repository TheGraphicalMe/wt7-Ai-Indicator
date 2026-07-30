// ─── SMART AI ACCESS — PREMIUM HERO ──────────────────────────────────────────
import { useRef, useEffect } from 'react'
import { usePrebook } from '@/contexts/PrebookContext'


import { BlurReveal, BlurWordReveal } from '@/components/ui/TextReveal'

// ─── HERO COMPONENT ──────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="min-h-[90dvh] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center relative overflow-visible pointer-events-none">

      <div className="container relative z-[1] max-w-[860px] -mt-[4vh] md:-mt-[16vh] pointer-events-none">

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <div className="glass-badge mt-10 md:mt-16 mb-4 md:mb-6 animate-blur-reveal-badge [animation-delay:0.05s]">
          <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_10px_#0DFF7F,0_0_20px_rgba(13,255,127,0.4)] animate-pulse-dot" />
          <span className="font-body text-[0.55rem] sm:text-[0.65rem] font-semibold tracking-[0.08em] sm:tracking-[0.14em] uppercase text-green inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
            Engineered by IITians ❤️
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
            text="A complete system built into your TradingView charts — thirteen capabilities that give you clarity, precision, and confidence on every trade."
            baseDelay={0.55}
            stagger={0.035}
          />
        </p>

        {/* ── CTA Buttons ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-3 justify-center animate-blur-reveal-cta [animation-delay:1.4s] pointer-events-auto">
          <a 
            href="#pricing" 
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('pricing');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY;
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, y);
                document.documentElement.style.scrollBehavior = '';
                window.history.pushState(null, '', '#pricing');
              }
            }}
          >
            View Plans
            <span className="text-[1.1rem]">→</span>
          </a>
          <a 
            href="#features" 
            className="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('features');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY;
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, y);
                document.documentElement.style.scrollBehavior = '';
                window.history.pushState(null, '', '#features');
              }
            }}
          >
            Explore Features
          </a>
        </div>

        {/* ── Premium Stats Section ──────────────────────────────────────── */}
        <div className="mt-14 w-full max-w-[1000px] mx-auto flex flex-wrap justify-center gap-3 sm:gap-4 animate-fade-slide-up [animation-delay:1.6s] pointer-events-auto">
          {[
            { label: 'PROP FIRM READY', value: '100%' },
            { label: 'EMOTIONAL TRADING', value: 'Zero' },
            { label: 'MARKET CORRELATIONS', value: '9-Point' },
            { label: 'ASSETS SUPPORTED', value: '10,000+' },
          ].map((stat, i) => (
            <div key={i} className="group relative flex flex-col items-center justify-center py-5 px-3 rounded-2xl bg-white/[0.015] border border-white/[0.05] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.03] hover:border-white/[0.1] hover:shadow-[0_8px_32px_-8px_rgba(13,255,127,0.15)] flex-[1_1_calc(50%-0.75rem)] sm:flex-[1_1_calc(33.333%-1rem)] lg:flex-[1_1_0%] min-w-[140px] max-w-[280px] overflow-hidden">
              {/* Top highlight line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-green/50 transition-colors duration-500" />
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-green/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <span className="relative z-10 font-body text-[1rem] sm:text-[1.05rem] font-bold text-white mb-1.5 tracking-tight drop-shadow-sm group-hover:scale-105 transition-transform duration-500">{stat.value}</span>
              <span className="relative z-10 font-cond tracking-[0.12em] sm:tracking-[0.15em] text-[1rem] sm:text-[1.05rem] font-semibold uppercase text-green/80 group-hover:text-green transition-colors duration-500 text-center leading-tight px-1">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}