// ─── SMART AI ACCESS — PREMIUM CTA ───────────────────────────────────────────
import { usePrebook } from '@/contexts/PrebookContext'
import { BlurReveal, BlurWordReveal } from '@/components/ui/TextReveal'

export default function Cta() {
  const { open } = usePrebook()

  return (
    <section id="prebook" className="px-4 sm:px-6 pb-16 sm:pb-24 md:pb-[120px]">
      <div className="container max-w-[860px]">
        <div className="relative rounded-3xl border border-green/10 bg-surface/60 backdrop-blur-[20px] px-6 sm:px-10 md:px-16 py-10 sm:py-16 md:py-20 text-center overflow-hidden">

          {/* Animated border glow */}
          <div
            className="absolute -inset-px rounded-3xl pointer-events-none animate-spin-border"
            style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(13,255,127,0.15) 75%, transparent 90%)' }}
          />

          {/* Inner bg to mask the spinning border */}
          <div className="absolute inset-px rounded-[23px] bg-bg/95 pointer-events-none" />

          {/* Glow orbs */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none blur-[30px]"
            style={{ background: 'radial-gradient(ellipse, rgba(13,255,127,0.06) 0%, transparent 65%)' }}
          />

          <div className="relative z-[2]">
            {/* Icon */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green/[0.06] border border-green/[0.12] flex items-center justify-center text-[1.4rem] sm:text-[1.6rem] mx-auto mb-5 sm:mb-7">
              ⚡
            </div>

            <h2 className="font-body font-bold text-[clamp(1.75rem,5vw,3rem)] leading-[1.1] -tracking-[0.02em] text-white mb-4">
              <span className="block">
                <BlurReveal delay={0.1}>Ready to trade with</BlurReveal>
              </span>
              <span className="block">
                <BlurReveal delay={0.3}>
                  <span className="bg-gradient-to-br from-green to-[#00D4AA] bg-clip-text text-transparent">
                    AI-powered clarity?
                  </span>
                </BlurReveal>
              </span>
            </h2>

            <p className="font-body text-[0.88rem] sm:text-[0.95rem] md:text-[1.05rem] text-muted max-w-[440px] mx-auto mb-6 sm:mb-10 leading-[1.6] sm:leading-[1.7]">
              <BlurWordReveal
                text="Join traders who are already gaining an edge. Prebook your early access — no charge until launch."
                baseDelay={0.5}
                stagger={0.035}
              />
            </p>

            <button onClick={open} className="btn-cta">
              Prebook Now
            </button>

            <div className="flex justify-center gap-6 mt-7 flex-wrap">
              {['No charge until launch', 'Founding member perks'].map((text, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-green text-[0.8rem]">✓</span>
                  <span className="font-body text-[0.78rem] text-muted">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
