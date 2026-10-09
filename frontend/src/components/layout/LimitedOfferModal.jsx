import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import useSaleCountdown, { padTime, SALE_END_LABEL } from '@/hooks/useSaleCountdown'

const TimeUnit = ({ value, label }) => (
  <div className="min-w-[48px] sm:min-w-[70px] rounded-xl border border-[#00FF88]/25 bg-black/30 px-1 sm:px-2 py-2.5 sm:py-3 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
    <strong className="block font-cond text-2xl sm:text-3xl leading-none tracking-wide text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">{padTime(value)}</strong>
    <span className="mt-1 block font-cond text-[0.58rem] font-bold tracking-[0.16em] text-[#00FF88]/50 uppercase">{label}</span>
  </div>
)

const OfferStat = ({ value, label }) => (
  <div className="flex-1 rounded-xl border border-[#00FF88]/20 bg-[#00FF88]/[0.06] px-3 py-3 backdrop-blur-sm">
    <strong className="block font-cond text-2xl sm:text-[1.7rem] font-black leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E5FF] uppercase">{value}</strong>
    <span className="mt-1.5 block font-cond text-[0.62rem] font-bold tracking-[0.16em] text-white/55 uppercase">{label}</span>
  </div>
)

export default function LimitedOfferModal() {
  const [isOpen, setIsOpen] = useState(true)
  const { days, hours, minutes, seconds, expired } = useSaleCountdown()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const claimOffer = () => {
    setIsOpen(false)
    const target = document.getElementById('pricing')
    if (target) {
      document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important')
      target.scrollIntoView({ block: 'start' })
      setTimeout(() => {
        document.documentElement.style.removeProperty('scroll-behavior')
      }, 50)
    }
  }

  if (!isOpen || expired) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex overflow-y-auto p-4 animate-fade-in"
      style={{ background: 'rgba(0, 4, 8, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}
      role="presentation"
    >
      <div className="relative m-auto w-full max-w-[460px] animate-scale-in">
        <section
          className="relative w-full overflow-hidden rounded-[28px] border border-[#00FF88]/25 p-6 sm:p-9 text-center"
          style={{
            background: 'linear-gradient(145deg, #001A0E 0%, #003320 35%, #00261A 65%, #001510 100%)',
            boxShadow: '0 0 0 1px rgba(0,255,136,0.08), 0 30px 100px rgba(0,0,0,0.9), 0 0 80px rgba(0,255,136,0.12), inset 0 0 80px rgba(0,180,90,0.15)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="limited-offer-title"
        >
        {/* Ambient glow effects */}
        <div className="absolute inset-0 pointer-events-none opacity-70" style={{ background: 'radial-gradient(circle at 50% -20%, rgba(0,255,136,0.2), transparent 55%), radial-gradient(circle at 80% 110%, rgba(0,229,255,0.1), transparent 45%), radial-gradient(circle at 15% 90%, rgba(0,255,136,0.08), transparent 40%)' }} />
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 5%, #00FF88 30%, #00E5FF 50%, #00FF88 70%, transparent 95%)' }} />
        {/* Bottom shimmer line */}
        <div className="absolute bottom-0 left-0 h-px w-full opacity-40" style={{ background: 'linear-gradient(90deg, transparent 10%, #00FF88 40%, #00E5FF 60%, transparent 90%)' }} />

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close limited time offer"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/30 text-lg text-white/50 transition hover:bg-black/50 hover:text-white/80 hover:border-[#00FF88]/30"
        >
          ×
        </button>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/[0.08] px-4 py-1.5 font-cond text-xs font-bold tracking-[0.17em] text-[#00FF88] uppercase shadow-[0_0_20px_rgba(0,255,136,0.1)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-pulse shadow-[0_0_6px_#00FF88]" />
            Only till {SALE_END_LABEL}
          </span>

          <h2 id="limited-offer-title" className="mt-7 font-cond text-[clamp(2rem,8.5vw,3.1rem)] font-black leading-none tracking-tight text-white uppercase">
            Limited{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-[#00E5FF] to-[#00FF88]" style={{ textShadow: 'none' }}>
              time offer
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-[330px] font-body text-sm leading-relaxed text-white/55">
            Unlock Smart AI at the offer price before {SALE_END_LABEL}.
          </p>

          <div className="mt-5 flex items-stretch gap-2 sm:gap-3">
            <OfferStat value="Up to 80% off" label="Offer discount" />
            <OfferStat value="Just $0.5" label="Cost per day" />
          </div>

          <div className="mt-6">
            <p className="mb-2 font-cond text-[0.68rem] font-bold tracking-[0.18em] text-[#00FF88]/60 uppercase">Offer ends in</p>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <TimeUnit value={days} label="Days" />
              <span className="-mt-4 text-xl font-bold text-[#00FF88]/50">:</span>
              <TimeUnit value={hours} label="Hrs" />
              <span className="-mt-4 text-xl font-bold text-[#00FF88]/50">:</span>
              <TimeUnit value={minutes} label="Mins" />
              <span className="-mt-4 text-xl font-bold text-[#00FF88]/50">:</span>
              <TimeUnit value={seconds} label="Secs" />
            </div>
          </div>

          <button
            type="button"
            onClick={claimOffer}
            className="mt-7 w-full cursor-pointer rounded-xl px-6 py-4 font-cond text-[1.1rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #00CC6F 0%, #00AA5C 50%, #009950 100%)',
              border: '1px solid rgba(0,255,136,0.4)',
              boxShadow: '0 0 30px rgba(0,255,136,0.25), 0 8px 32px rgba(0,204,111,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(0,255,136,0.4), 0 8px 40px rgba(0,204,111,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.7)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,136,0.25), 0 8px 32px rgba(0,204,111,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)'
            }}
          >
            Claim now
          </button>
        </div>
        </section>
      </div>
    </div>,
    document.body
  )
}
