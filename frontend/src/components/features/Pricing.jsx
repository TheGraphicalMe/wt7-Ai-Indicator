import { useState } from 'react'
import { BlurReveal, BlurWordReveal } from '@/components/ui/TextReveal'
import { usePrebook } from '@/contexts/PrebookContext'
import CryptoModal from '../layout/CryptoModal'
import clsx from 'clsx'

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0DFF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0DFF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0DFF7F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0DFF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const DiamondIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0DFF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9Z" />
    <path d="M11 3 8 9l4 13 4-13-3-6" />
    <path d="M2 9h20" />
  </svg>
)

const StarburstBadge = ({ className }) => {
  const points = [];
  const rays = 16;
  const outerRadius = 50;
  const innerRadius = 42;
  const center = 50;

  for (let i = 0; i < rays * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / rays;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(229,62,62,0.6)]">
        {/* Main starburst shape */}
        <polygon points={points.join(' ')} fill="#E53E3E" />
        {/* Inner thin border */}
        <polygon points={points.join(' ')} fill="none" stroke="#FC8181" strokeWidth="1.5" transform="translate(50,50) scale(0.88) translate(-50,-50)" />
        
        {/* Rotated text inside SVG for perfect scaling */}
        <g transform="translate(50, 50) rotate(-12)">
          <text x="0" y="-2" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">SPECIAL</text>
          <text x="0" y="16" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">OFFER</text>
        </g>
      </svg>
    </div>
  );
};

const pricingPlans = [
  {
    name: '1 Month',
    originalPrice: '$88',
    price: '$44',
    period: '',
    features: [
      { text: 'Real-Time Market Bias', icon: <ChartIcon /> },
      { text: 'Automated Zone Mapping', icon: <BrainIcon /> },
      { text: 'Exclusive Community Access', icon: <UsersIcon /> },
      { text: 'Step-by-Step Video Guides', icon: <CheckIcon /> },
    ],
    buttonText: 'Buy Now',
    link: 'https://wzhdwc.courses.store/834722?true&coupon=SMART50',
  },
  {
    name: '3 Months',
    originalPrice: '$188',
    price: '$94',
    period: '',
    features: [
      { text: 'Real-Time Market Bias', icon: <ChartIcon /> },
      { text: 'Automated Zone Mapping', icon: <BrainIcon /> },
      { text: 'Exclusive Community Access', icon: <UsersIcon /> },
      { text: 'Step-by-Step Video Guides', icon: <CheckIcon /> },
    ],
    buttonText: 'Buy Now',
    link: 'https://wzhdwc.courses.store/834722?true&coupon=SMART50',
  },
  {
    name: '6 Months',
    originalPrice: '$288',
    price: '$144',
    period: '',
    features: [
      { text: 'Real-Time Market Bias', icon: <ChartIcon /> },
      { text: 'Automated Zone Mapping', icon: <BrainIcon /> },
      { text: 'Exclusive Community Access', icon: <UsersIcon /> },
      { text: 'Step-by-Step Video Guides', icon: <CheckIcon /> },
    ],
    buttonText: 'Buy Now',
    link: 'https://wzhdwc.courses.store/834722?true&coupon=SMART50',
  },
  {
    name: '6 Months (Crypto Special)',
    price: '$99',
    period: '',
    features: [
      { text: 'Real-Time Market Bias', icon: <ChartIcon /> },
      { text: 'Automated Zone Mapping', icon: <BrainIcon /> },
      { text: 'Exclusive Community Access', icon: <UsersIcon /> },
      { text: 'Step-by-Step Video Guides', icon: <CheckIcon /> },
      { text: 'Fast & Secure Crypto Payment', icon: <DiamondIcon /> },
    ],
    buttonText: 'Get Plan',
    isCrypto: true,
  },
  {
    name: 'Get Lifetime Access',
    price: 'Custom',
    period: '',
    features: [
      { text: 'Real-Time Market Bias', icon: <DiamondIcon /> },
      { text: 'Automated Zone Mapping', icon: <BrainIcon /> },
      { text: 'Exclusive Community Access', icon: <UsersIcon /> },
      { text: 'Step-by-Step Video Guides', icon: <CheckIcon /> },
      { text: '1Yr + 2 Months extra if paid via Crypto', icon: <CheckIcon /> },
    ],
    buttonText: 'Request Access',
    link: 'https://docs.google.com/forms/',
  },
]

export default function Pricing() {
  const { open } = usePrebook()
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false)

  return (
    <section id="pricing" className="relative py-10 sm:py-[60px] px-4 pb-16 sm:pb-[100px] z-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12 sm:mb-[60px]">
          <h2 className="font-body font-bold text-[clamp(1.8rem,5vw,3.2rem)] leading-[1.1] -tracking-[0.02em] text-white mb-3.5">
            <BlurReveal delay={0.1}>Smart AI Plans</BlurReveal>
          </h2>
          <p className="font-body text-[clamp(0.85rem,2vw,1.1rem)] leading-[1.7] text-muted max-w-[500px] mx-auto mb-6">
            <BlurWordReveal text="Unlock your edge with flexible smart tiers." baseDelay={0.3} stagger={0.035} />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-[320px] sm:max-w-[400px] md:max-w-5xl mx-auto mb-8 sm:mb-12">
          {pricingPlans.slice(0, 3).map((plan, idx) => (
            <div key={plan.name} className="relative transition-all duration-500 hover:-translate-y-3">
              {/* Fold triangle — BEHIND the card, peeking out below ribbon at left edge */}
              <div
                className="absolute"
                style={{ top: '40px', left: '-14px', width: 0, height: 0, borderLeft: '14px solid transparent', borderTop: '10px solid #7F1D1D', zIndex: 0 }}
              />

              {/* Ribbon — ON TOP of card */}
              <div
                className="absolute flex items-center pointer-events-none"
                style={{ top: '16px', left: '-14px', height: '24px', zIndex: 30 }}
              >
                <div className="relative bg-gradient-to-b from-[#EF4444] to-[#DC2626] h-full flex items-center pl-5 pr-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)] pointer-events-auto">
                  <span className="text-white font-cond font-bold text-[0.6rem] uppercase tracking-[0.1em] whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    LIMITED OFFER · 50% OFF ONLY FOR THIS MONTH
                  </span>
                  <div
                    className="absolute -right-[11px] top-0 w-0 h-0"
                    style={{
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: '11px solid #DC2626',
                    }}
                  />
                </div>
              </div>

              {/* The Card itself */}
              <div
                className={
                  "group relative flex flex-col rounded-[24px] p-8 pt-14 transition-all duration-500 " +
                  "bg-gradient-to-br from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.01)] " +
                  "border border-[rgba(255,255,255,0.15)] " +
                  "hover:border-[#0DFF7F] hover:shadow-[0_0_30px_rgba(13,255,127,0.25)] hover:bg-[rgba(13,255,127,0.03)]"
                }
                style={{
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  position: 'relative',
                  zIndex: 10,
                }}
              >


              {/* Elite-style Premium Gloss Background */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden"
              >
                {/* Diagonal glass reflection */}
                <div
                  className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] rotate-[-45deg] bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-transparent"
                  style={{ transformOrigin: 'top left' }}
                />

                {/* Inner green wave (the 'elite' glow) */}
                <div
                  className="absolute top-1/3 -left-1/4 w-[150%] h-[150px] rounded-[50%] blur-[40px] opacity-30 -rotate-12 bg-[rgba(13,255,127,0.4)] transition-colors duration-500 group-hover:bg-[#0DFF7F] group-hover:opacity-50"
                />
                <div
                  className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full blur-[50px] opacity-40 bg-[rgba(13,255,127,0.3)] transition-colors duration-500 group-hover:bg-[#0DFF7F] group-hover:opacity-60"
                />
              </div>

              {/* Central Background Glow */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[24px]"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(13,255,127,0.05) 0%, transparent 60%)',
                }}
              />

              <div className="relative z-10 flex flex-col h-full text-center">
                <h3 className="font-body font-bold text-2xl text-white mb-2">{plan.name}</h3>

                {plan.originalPrice && (
                  <div className="text-muted line-through text-lg mt-2 -mb-2">{plan.originalPrice}</div>
                )}

                <div className="flex items-end justify-center gap-1 mb-8 mt-4">
                  {plan.price === 'Custom' ? (
                    <span className="font-display text-4xl font-bold tracking-wide text-white">Contact Us</span>
                  ) : (
                    <>
                      <span className="font-display text-5xl font-bold tracking-tight text-white">{plan.price}</span>
                      {plan.period && <span className="text-muted text-lg mb-1">{plan.period}</span>}
                    </>
                  )}
                </div>

                <ul className="flex flex-col gap-4 text-left w-fit mx-auto mb-10 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3">
                      <div className="shrink-0">{feature.icon}</div>
                      <span className="font-body text-sm text-[rgba(255,255,255,0.85)]">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {plan.buttonText === 'Request Access' ? (
                  <button
                    onClick={open}
                    className="w-full flex items-center justify-center font-body font-bold text-[#051e0f] bg-green py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(13,255,127,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer border-none"
                  >
                    {plan.buttonText}
                  </button>
                ) : (
                  <a
                    href={plan.link}
                    target='_blank'
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center font-body font-bold text-[#051e0f] bg-green py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(13,255,127,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    {plan.buttonText}
                  </a>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Bars for Custom & Crypto Plans */}
        <div className="flex flex-col gap-6 w-full max-w-[320px] sm:max-w-[400px] md:max-w-5xl mx-auto">
          {pricingPlans.slice(3).map((plan) => (
            <div key={plan.name} className={`relative w-full transition-all duration-500 hover:-translate-y-2${plan.isCrypto ? ' pt-6 md:pt-0' : ''}`}>
              {/* Fold triangle — BEHIND the card */}
              {!plan.isCrypto && (
                <div
                  className="absolute"
                  style={{ top: '40px', left: '-14px', width: 0, height: 0, borderLeft: '14px solid transparent', borderTop: '10px solid #7F1D1D', zIndex: 0 }}
                />
              )}

              {/* Ribbon — ON TOP of card */}
              {!plan.isCrypto && (
                <div
                  className="absolute flex items-center pointer-events-none"
                  style={{ top: '16px', left: '-14px', height: '24px', zIndex: 30 }}
                >
                  <div className="relative bg-gradient-to-b from-[#EF4444] to-[#DC2626] h-full flex items-center pl-5 pr-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)] pointer-events-auto">
                    <span className="text-white font-cond font-bold text-[0.6rem] uppercase tracking-[0.1em] whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      LIMITED OFFER · 50% OFF ONLY FOR THIS MONTH
                    </span>
                    <div
                      className="absolute -right-[11px] top-0 w-0 h-0"
                      style={{
                        borderTop: '12px solid transparent',
                        borderBottom: '12px solid transparent',
                        borderLeft: '11px solid #DC2626',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Starburst Badge — on outer wrapper, overlapping card's top-left corner */}
              {plan.isCrypto && (
                <div style={{ position: 'absolute', top: '-18px', left: '-18px', zIndex: 60 }} className="pointer-events-none">
                  <StarburstBadge className="w-[90px] h-[90px] sm:w-[75px] sm:h-[75px]" />
                </div>
              )}

              {/* The Card */}
              <div
                className={
                  "group relative flex flex-col md:flex-row items-center justify-between rounded-[24px] pt-12 pb-8 px-8 md:pt-10 md:pb-10 md:px-10 transition-all duration-500 " +
                  "bg-gradient-to-r from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.02)] " +
                  "border border-[rgba(255,255,255,0.2)] " +
                  (plan.isCrypto
                    ? "hover:border-[#3B82F6] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:bg-[rgba(59,130,246,0.05)]"
                    : "hover:border-[#0DFF7F] hover:shadow-[0_0_40px_rgba(13,255,127,0.3)] hover:bg-[rgba(13,255,127,0.05)]")
                }
                style={{
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  position: 'relative',
                  zIndex: 10,
                  overflow: plan.isCrypto ? 'visible' : undefined,
                }}
              >

                {/* Premium Background Effects */}
                <div className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden">
                  {plan.isCrypto ? (
                    <>
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-[50%] blur-[80px] opacity-40 bg-[rgba(59,130,246,0.6)] group-hover:opacity-60 transition-opacity duration-500" />
                      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[60px] opacity-40 bg-[rgba(59,130,246,0.5)] group-hover:opacity-60 transition-opacity duration-500" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 bg-[#60A5FA]" />
                    </>
                  ) : (
                    <>
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-[50%] blur-[80px] opacity-20 transition-colors duration-500 bg-[rgba(13,255,127,0.5)] group-hover:bg-[#0DFF7F] group-hover:opacity-40" />
                      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full blur-[60px] opacity-30 transition-colors duration-500 bg-[rgba(13,255,127,0.4)] group-hover:bg-[#0DFF7F] group-hover:opacity-50" />
                    </>
                  )}
                </div>

                {plan.isCrypto ? (
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                    
                    <h3 className="font-body font-bold text-2xl md:text-3xl text-white whitespace-nowrap">
                      6 Months Plan <span className="font-normal text-[rgba(255,255,255,0.7)] text-xl md:text-2xl">for just</span>
                    </h3>

                    <div className="font-display text-6xl md:text-7xl md:-ml-12 font-bold tracking-tight text-[#3B82F6] drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                      {plan.price}
                    </div>

                    <div className="font-cond font-bold tracking-widest uppercase text-[13px] md:text-[15px] text-[#93C5FD] bg-[#3B82F6]/10 py-1.5 px-5 rounded-full border border-[#3B82F6]/30">
                      If paid via crypto
                    </div>

                    <button
                      onClick={() => setIsCryptoModalOpen(true)}
                      className="w-full md:w-[240px] h-14 flex items-center justify-center font-body font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-[1.04] active:scale-95 cursor-pointer text-lg whitespace-nowrap px-6 tracking-[0.05em] uppercase border-none"
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                ) : (
                  /* ── Standard Plan: 3-column layout ── */
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-body font-bold text-3xl md:text-4xl text-white mb-2">{plan.name}</h3>
                      {plan.price && plan.price !== 'Custom' && (
                        <div className="font-display text-4xl font-bold tracking-tight text-green">{plan.price}</div>
                      )}
                    </div>

                    <div className="flex-1 w-full max-w-sm border-y md:border-y-0 md:border-l border-[rgba(255,255,255,0.1)] py-6 md:py-0 md:px-8">
                      <ul className="flex flex-col gap-3 text-left w-fit mx-auto md:mx-0">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-3">
                            <div className="shrink-0">{feature.icon}</div>
                            <span className="font-body text-[15px] text-[rgba(255,255,255,0.9)]">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto pt-4 md:pt-0">
                      {plan.buttonText === 'Request Access' ? (
                        <button
                          onClick={open}
                          className="w-full md:w-[220px] h-14 flex items-center justify-center font-body font-bold text-[#051e0f] bg-green rounded-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(13,255,127,0.6)] hover:scale-[1.04] active:scale-95 cursor-pointer text-lg whitespace-nowrap px-6 tracking-[0.05em] uppercase border-none"
                        >
                          {plan.buttonText}
                        </button>
                      ) : (
                        <a
                          href={plan.link || "https://wa.me/7985155368"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-[220px] h-14 flex items-center justify-center font-body font-bold text-[#051e0f] bg-green rounded-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(13,255,127,0.6)] hover:scale-[1.04] active:scale-95 cursor-pointer text-lg whitespace-nowrap px-6 tracking-[0.05em] uppercase"
                        >
                          {plan.buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <CryptoModal 
          isOpen={isCryptoModalOpen} 
          onClose={() => setIsCryptoModalOpen(false)} 
        />
      </div>
    </section>
  )
}
