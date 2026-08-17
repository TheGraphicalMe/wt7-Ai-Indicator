import { useState, useMemo } from 'react'
import { BlurReveal } from '@/components/ui/TextReveal'
import { usePrebook } from '@/contexts/PrebookContext'
import CryptoModal from '../layout/CryptoModal'
import clsx from 'clsx'

/* ─────────────────────────────────────────────
   Shared Sub-components
   ───────────────────────────────────────────── */

const CardSpotlight = ({ theme }) => {
  const isCrypto = theme === 'crypto'
  const color = isCrypto ? 'rgba(139, 92, 246, 0.7)' : 'rgba(13, 255, 127, 0.7)'

  const baseDelay = useMemo(() => Math.random() * -8, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-10 rounded-[24px] overflow-hidden">
      <div
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color} 0%, transparent 40%)`,
          animation: 'spotlightPan 10s ease-in-out infinite alternate',
          animationDelay: `${baseDelay}s`
        }}
      />
    </div>
  )
}

const BrainIcon = ({ color = '#0DFF7F' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)

const ChartIcon = ({ color = '#0DFF7F' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const CheckIcon = ({ color = '#0DFF7F' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const UsersIcon = ({ color = '#0DFF7F' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const DiamondIcon = ({ color = '#0DFF7F' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9Z" />
    <path d="M11 3 8 9l4 13 4-13-3-6" />
    <path d="M2 9h20" />
  </svg>
)

/* ─────────────────────────────────────────────
   Plan Data
   ───────────────────────────────────────────── */

const cryptoPlans = [
  {
    name: '1 Month',
    price: '$99',
    features: [
      { text: 'Real-Time Market Bias', Icon: ChartIcon },
      { text: 'Automated Zone Mapping', Icon: BrainIcon },
      { text: 'Exclusive Community Access', Icon: UsersIcon },
      { text: 'Step-by-Step Video Guides', Icon: CheckIcon },
      { text: 'Fast & Secure Crypto Payment', Icon: DiamondIcon },
    ],
    buttonText: 'Subscribe Now',
  },
  {
    name: '1 Year',
    price: '$999',
    features: [
      { text: 'Real-Time Market Bias', Icon: ChartIcon },
      { text: 'Automated Zone Mapping', Icon: BrainIcon },
      { text: 'Exclusive Community Access', Icon: UsersIcon },
      { text: 'Step-by-Step Video Guides', Icon: CheckIcon },
      { text: 'Fast & Secure Crypto Payment', Icon: DiamondIcon },
    ],
    buttonText: 'Subscribe Now',
  },
]

/* ─────────────────────────────────────────────
   Card Face — renders a single card's inner content
   ───────────────────────────────────────────── */

const CardFace = ({ plan, theme, accentColor, onCryptoClick }) => {
  const isCrypto = theme === 'crypto'

  return (
    <div
      className={clsx(
        'group relative flex flex-col rounded-[24px] p-8 transition-colors duration-500 bg-[rgba(8,11,16,0.95)] border-none h-full',
        isCrypto ? 'pt-10' : 'pt-14'
      )}
      style={{
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Cinematic Spotlight */}
      <CardSpotlight theme={theme} />

      {/* Aurora background blobs */}
      <div className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden">
        <div className={`${theme}-aurora-1`} style={{ top: '-50px', right: '-80px' }} />
        <div className={`${theme}-aurora-2`} style={{ bottom: '-60px', left: '-40px' }} />
        <div className={`${theme}-aurora-3`} style={{ top: '20%', left: '40%' }} />
      </div>

      <div className="relative z-10 flex flex-col h-full text-center">
        <h3 className="font-body font-bold text-2xl text-white mb-2">{plan.name}</h3>

        {/* Crypto: "Pay via USDT" pill */}
        {isCrypto && (
          <div className="inline-flex items-center gap-1.5 mx-auto py-1 px-3 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-1">
            <span className="font-cond font-bold text-[0.6rem] tracking-[0.12em] text-[#A78BFA] uppercase">Pay via USDT</span>
          </div>
        )}

        {/* Original price strikethrough */}
        {plan.originalPrice && (
          <div className="text-muted line-through text-lg mt-2 -mb-2">{plan.originalPrice}</div>
        )}

        <div className="flex items-end justify-center gap-1 mb-8 mt-4">
          <span className={clsx(
            'font-display text-5xl font-bold tracking-tight',
            isCrypto
              ? 'bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent crypto-price-glow'
              : 'text-green standard-price-glow'
          )}>
            {plan.price}
          </span>
        </div>

        <ul className="flex flex-col gap-4 text-left w-fit mx-auto mb-10 flex-1">
          {plan.features.map((feature, fIdx) => (
            <li key={fIdx} className="flex items-center gap-3">
              <div className="shrink-0"><feature.Icon color={accentColor} /></div>
              <span className="font-body text-sm text-[rgba(255,255,255,0.85)]">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isCrypto ? (
          <button
            onClick={() => onCryptoClick(plan)}
            className="w-full flex items-center justify-center font-body font-bold text-white bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer border-none"
          >
            {plan.buttonText}
          </button>
        ) : (
          <a
            href={plan.link}
            className="w-full flex items-center justify-center font-body font-bold text-[#051e0f] bg-green py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(13,255,127,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            {plan.buttonText}
          </a>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Pricing Component
   ───────────────────────────────────────────── */

export default function Pricing() {
  const { open } = usePrebook()
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false)
  const [cryptoModalData, setCryptoModalData] = useState({ amount: '$99', planName: '1 Month' })

  const handleCryptoClick = (plan) => {
    setCryptoModalData({ amount: plan.price, planName: plan.name })
    setIsCryptoModalOpen(true)
  }

  return (
    <section id="pricing" className="relative py-10 sm:py-[60px] px-4 pb-16 sm:pb-[100px] z-10">
      {/* Inline keyframes */}
      <style>{`
        @keyframes pricingCardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12 sm:mb-[60px]">
          <h2 className="font-body font-bold text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.1] -tracking-[0.02em] text-white mb-3.5">
            <BlurReveal delay={0.1}>Smart AI Plans</BlurReveal>
          </h2>

          {/* Value tagline */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 mt-6 px-6 py-3 rounded-[30px] border backdrop-blur-sm border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.06]">
            <p className="font-cond text-[0.75rem] sm:text-[1.05rem] font-semibold tracking-[0.12em] uppercase text-[#A78BFA]/90 text-center m-0">
              Save more when you <span className="text-[#A78BFA] font-extrabold">pay with crypto</span>
            </p>
            <span className="hidden sm:block w-[1px] h-4 bg-[#8B5CF6]/30"></span>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              {/* <span className="font-cond text-[0.75rem] sm:text-[1.05rem] font-extrabold tracking-[0.15em] uppercase text-[#A78BFA] drop-shadow-[0_0_12px_rgba(167,139,250,0.4)]">
                COSTS JUST $0.5 PER DAY
              </span> */}
            </div>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-[320px] sm:max-w-[400px] md:max-w-4xl mx-auto mb-8 sm:mb-12">
          {cryptoPlans.map((plan, idx) => (
            <div
              key={idx}
              className="relative w-full transition-all duration-500 hover:-translate-y-3"
              style={{ animation: `pricingCardIn 0.45s ease-out ${idx * 0.09}s both` }}
            >
              <div className="crypto-card-wrapper h-full">
                <CardFace
                  plan={plan}
                  theme="crypto"
                  accentColor="#8B5CF6"
                  onCryptoClick={handleCryptoClick}
                />
              </div>
            </div>
          ))}
        </div>





        {/* ── Crypto Payment Modal ── */}
        <CryptoModal
          isOpen={isCryptoModalOpen}
          onClose={() => setIsCryptoModalOpen(false)}
          amount={cryptoModalData.amount}
          planName={cryptoModalData.planName}
        />
      </div>
    </section>
  )
}
