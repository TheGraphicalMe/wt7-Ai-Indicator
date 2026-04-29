// ─── SMART AI ACCESS — PREMIUM NAVBAR ────────────────────────────────────────
import { useState, useEffect } from 'react'
import clsx from 'clsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className={clsx(
        'fixed inset-x-0 top-0 z-[100]',
        'flex items-center justify-between',
        'h-[68px] px-[clamp(20px,5vw,48px)]',
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled
          ? 'bg-bg/85 border-b border-white/[0.06] backdrop-blur-[24px] backdrop-saturate-[1.2]'
          : 'bg-transparent border-b border-transparent backdrop-blur-none'
      )}
    >
      {/* Logo */}
      <div className="flex flex-col leading-none gap-px">
        <span
          className="font-cond text-[0.82rem] tracking-[0.32em] font-semibold uppercase -mt-0.5 text-green"
          style={{
            textShadow: '0 0 10px rgba(13,255,127,0.9), 0 0 25px rgba(13,255,127,0.35)',
          }}
        >
          Smart AI
        </span>
      </div>

      {/* Center badge — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-2 py-[7px] px-[18px] rounded-full bg-green/[0.05] border border-green-border backdrop-blur-[12px]">
        <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_8px_#0DFF7F] animate-nav-dot-pulse" />
        <span className="font-body text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-green">
          Smart AI
        </span>
      </div>

      {/* Right Action — Contact Us */}
      <div className="flex justify-end w-[100px] sm:w-[130px]">
        <div className="relative flex flex-col items-center">
          <a
            href="https://wa.me/918448049554"
            className="glow-on-hover inline-flex items-center justify-center font-body font-bold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] !w-auto !px-[14px] !py-[6px] !text-[0.65rem] max-sm:!min-w-0 max-sm:tracking-tight max-sm:!gap-1"
          >
            Contact Us
          </a>
          <span className="absolute -bottom-[15px] text-[0.5rem] text-[#00000] font-cond font-bold tracking-[0.16em] uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(13,255,127,0.5)]">
            24 x 7 Support
          </span>
        </div>
      </div>
    </nav>
  )
}
