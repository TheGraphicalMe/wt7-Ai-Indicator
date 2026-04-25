// ─── SMART AI ACCESS — 3D CAROUSEL FEATURES ─────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { FEATURES } from '@/lib/constants'
import { useDimensions } from '@/hooks/useDimensions'
import { BlurReveal, BlurWordReveal } from '@/components/ui/TextReveal'

const CARD_COUNT = FEATURES.length
const ANGLE_STEP = 360 / CARD_COUNT

// ─── Aurora spinning border ───────────────────────────────────────────────────
// Add to tailwind.config.js → theme.extend.animation:
//   'spin-slow': 'spin 4s linear infinite'
function AuroraBorder({ active }) {
  return (
    <div
      className={clsx(
        'absolute -inset-[1.5px] rounded-[23px] pointer-events-none z-0 overflow-hidden',
        'transition-opacity duration-700',
        active ? 'opacity-100' : 'opacity-0',
      )}
      style={{
        padding: '1.5px',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    >
      <div
        className="absolute animate-spin-slow"
        style={{
          inset: '-100%',
          background: `conic-gradient(
            from 0deg,
            transparent       0deg,
            rgba(13,255,127,0.9)  30deg,
            rgba(100,220,255,0.7) 80deg,
            rgba(180,100,255,0.5) 130deg,
            transparent       180deg,
            rgba(13,255,127,0.4)  250deg,
            transparent       300deg
          )`,
        }}
      />
    </div>
  )
}

export default function Features() {
  const [angle, setAngle] = useState(0)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startAngle: 0, moved: false })
  const dims = useDimensions()

  useEffect(() => {
    let idx = Math.round(-angle / ANGLE_STEP) % CARD_COUNT
    if (idx < 0) idx += CARD_COUNT
    setActive(idx)
  }, [angle])

  useEffect(() => {
    if (paused || isDragging) return
    const id = setInterval(() => setAngle(prev => prev - ANGLE_STEP), 4000)
    return () => clearInterval(id)
  }, [paused, isDragging])

  const onDown = useCallback((e) => {
    if (e.type === 'mousedown') e.preventDefault()
    setIsDragging(true)
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    dragRef.current = { startX: clientX, startAngle: angle, moved: false }
  }, [angle])

  const onMove = useCallback((e) => {
    if (!isDragging) return
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const diff = clientX - dragRef.current.startX
    if (Math.abs(diff) > 5) dragRef.current.moved = true
    const sensitivity = window.innerWidth <= 480 ? 0.5 : 0.3
    setAngle(dragRef.current.startAngle + diff * sensitivity)
  }, [isDragging])

  const onUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const snapped = Math.round(angle / ANGLE_STEP) * ANGLE_STEP
    setAngle(snapped)
  }, [isDragging, angle])

  useEffect(() => {
    if (!isDragging) return
    const move = (e) => onMove(e)
    const up = () => onUp()
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [isDragging, onMove, onUp])

  const goTo = (i) => {
    const targetAngle = -i * ANGLE_STEP
    const current = angle % 360
    let diff = targetAngle - current
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    setAngle(angle + diff)
  }

  const currentFeature = FEATURES[active]

  return (
    <section id="features" className="relative overflow-x-clip py-10 sm:py-[60px] px-4 pb-16 sm:pb-[100px]">
      <div className="max-w-[1100px] mx-auto">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="text-center mb-10 sm:mb-[72px]">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(13,255,127,0.18))' }} />
            <span className="font-body text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-green">
              9 Capabilities
            </span>
            <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg, rgba(13,255,127,0.18), transparent)' }} />
          </div>
          <h2 className="font-body font-bold text-[clamp(1.8rem,5vw,3.2rem)] leading-[1.1] -tracking-[0.02em] text-white mb-3.5">
            <span className="block"><BlurReveal delay={0.1}>Everything you need to</BlurReveal></span>
            <span className="block">
              <BlurReveal delay={0.3}><span className="text-green">trade smarter</span></BlurReveal>
            </span>
          </h2>
          <p className="font-body text-[clamp(0.85rem,2vw,1rem)] leading-[1.7] text-muted max-w-[460px] mx-auto">
            <BlurWordReveal text="Swipe to explore all nine capabilities." baseDelay={0.5} stagger={0.035} />
          </p>
        </div>

        {/* ── 3D Carousel ─────────────────────────────────────────────── */}
        <div
          className="relative flex items-center justify-center select-none touch-pan-y mx-auto"
          style={{
            maxWidth: '100%',
            perspective: dims.perspective,
            perspectiveOrigin: '50% 50%',
            height: dims.containerH,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { setPaused(false); if (isDragging) onUp() }}
          onMouseDown={onDown}
          onTouchStart={onDown}
        >
          <div
            className="relative"
            style={{
              width: dims.cardW,
              height: dims.cardH,
              transformStyle: 'preserve-3d',
              transform: `rotateY(${angle}deg)`,
              transition: isDragging ? 'none' : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {FEATURES.map(({ icon, title, desc }, i) => {
              const isActive = i === active
              const sm = dims.cardW <= 250

              return (
                <div
                  key={i}
                  onClick={() => { if (!dragRef.current.moved) goTo(i) }}
                  className="absolute top-0 left-0"
                  style={{
                    width: dims.cardW,
                    height: dims.cardH,
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${i * ANGLE_STEP}deg) translateZ(${dims.radius}px)`,
                  }}
                >
                  {/* ── OUTER WRAP ────────────────────────────────────── */}
                  <div
                    className="relative w-full h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      transform: isActive ? 'scale(1)' : 'scale(0.82)',
                      opacity: isActive ? 1 : 0.3,
                    }}
                  >
                    {/* Aurora border — active only */}
                    <AuroraBorder active={isActive} />

                    {/* ── CARD SURFACE ───────────────────────────────── */}
                    <div
                      className={clsx(
                        "relative z-10 w-full h-full rounded-[21px] flex flex-col overflow-hidden transition-all duration-700",
                        isActive && "backdrop-blur-xl"
                      )}
                      style={{
                        padding: sm ? '22px 20px' : '26px 24px 28px',
                        background: isActive
                          ? 'linear-gradient(145deg, rgba(30,35,45,0.7) 0%, rgba(10,15,25,0.85) 100%)'
                          : 'rgba(255,255,255,0.018)',
                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: isActive
                          ? '0 40px 80px -20px rgba(0,0,0,0.8), inset 0 1.5px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(255,255,255,0.02), inset 0 0 20px rgba(255,255,255,0.02)'
                          : 'none',
                      }}
                    >
                      {/* Top radial spotlight */}
                      <div
                        className="absolute top-0 left-0 right-0 pointer-events-none transition-opacity duration-700"
                        style={{
                          height: 160,
                          borderRadius: '21px 21px 0 0',
                          background: 'radial-gradient(ellipse 80% 100% at 50% -10%, rgba(13,255,127,0.11) 0%, rgba(13,255,127,0.03) 45%, transparent 70%)',
                          opacity: isActive ? 1 : 0,
                        }}
                      />

                      {/* Top shimmer edge */}
                      <div
                        className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none transition-opacity duration-700"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.2) 60%, transparent)',
                          opacity: isActive ? 1 : 0,
                        }}
                      />

                      {/* ── NUMBER ─────────────────────────────────── */}
                      <span
                        className={clsx(
                          'font-body font-semibold tracking-[0.08em] mb-[18px] transition-colors duration-500',
                          sm ? 'text-[10px]' : 'text-[11px]',
                        )}
                        style={{ color: isActive ? 'rgba(13,255,127,0.55)' : 'rgba(255,255,255,0.2)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* ── ICON ───────────────────────────────────── */}
                      <div
                        className="relative flex-shrink-0 mb-[22px]"
                        style={{ width: sm ? 50 : 58, height: sm ? 50 : 58 }}
                      >
                        {/* Bloom glow */}
                        <div
                          className="absolute pointer-events-none transition-opacity duration-700"
                          style={{
                            inset: -12,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(13,255,127,0.16) 0%, transparent 65%)',
                            filter: 'blur(5px)',
                            opacity: isActive ? 1 : 0,
                          }}
                        />
                        {/* Icon box */}
                        <div
                          className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-600"
                          style={{
                            fontSize: sm ? '1.2rem' : '1.5rem',
                            borderRadius: sm ? 12 : 14,
                            background: isActive
                              ? 'linear-gradient(145deg, rgba(13,255,127,0.13) 0%, rgba(5,30,15,0.9) 100%)'
                              : 'rgba(255,255,255,0.04)',
                            border: isActive
                              ? '1px solid rgba(13,255,127,0.2)'
                              : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: isActive
                              ? '0 8px 28px rgba(13,255,127,0.07), inset 0 1px 0 rgba(255,255,255,0.07)'
                              : 'none',
                          }}
                        >
                          {icon}
                        </div>
                      </div>

                      {/* ── TITLE ──────────────────────────────────── */}
                      <h3
                        className={clsx(
                          'font-body font-bold leading-[1.25] mb-2.5 -tracking-[0.015em] transition-colors duration-500',
                          sm ? 'text-[0.95rem]' : 'text-[1.1rem]',
                        )}
                        style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.28)' }}
                      >
                        {title}
                      </h3>

                      {/* ── DESCRIPTION ────────────────────────────── */}
                      <p
                        className={clsx(
                          'font-body leading-[1.72] m-0 transition-colors duration-500',
                          sm ? 'text-[0.78rem]' : 'text-[0.815rem]',
                        )}
                        style={{ color: isActive ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.13)' }}
                      >
                        {desc}
                      </p>

                      {/* Bottom glow line */}
                      <div
                        className="absolute bottom-0 left-[15%] right-[15%] h-px pointer-events-none transition-opacity duration-700"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #0DFF7F 40%, #64c8ff 60%, transparent)',
                          opacity: isActive ? 0.65 : 0,
                        }}
                      />
                      {/* Bottom bloom */}
                      <div
                        className="absolute bottom-0 left-[20%] right-[20%] h-5 pointer-events-none transition-opacity duration-700"
                        style={{
                          background: 'radial-gradient(ellipse at 50% 100%, rgba(13,255,127,0.14) 0%, transparent 70%)',
                          filter: 'blur(4px)',
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Dots ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-1.5 mt-8 sm:mt-12 flex-wrap">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-[5px] rounded-full border-none cursor-pointer p-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: i === active ? 24 : 5,
                background: i === active ? '#0DFF7F' : 'rgba(255,255,255,0.12)',
                boxShadow: i === active ? '0 0 8px rgba(13,255,127,0.5)' : 'none',
              }}
              aria-label={`Feature ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Active feature detail ────────────────────────────────────── */}
        <div className="text-center max-w-[500px] mx-auto mt-6 sm:mt-10 px-3">
          <div
            className="inline-flex items-center gap-2 py-[5px] px-3.5 rounded-full mb-3"
            style={{ background: 'rgba(13,255,127,0.04)', border: '1px solid rgba(13,255,127,0.1)' }}
          >
            <span className="text-base">{currentFeature.icon}</span>
            <span
              className="font-body text-[0.72rem] font-semibold tracking-[0.05em]"
              style={{ color: 'rgba(13,255,127,0.7)' }}
            >
              {currentFeature.title}
            </span>
          </div>
          <p
            className="font-body text-[clamp(0.85rem,2vw,0.93rem)] leading-[1.75] m-0"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            {currentFeature.desc}
          </p>
        </div>

      </div>
    </section>
  )
}