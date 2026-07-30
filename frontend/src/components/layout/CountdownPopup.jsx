import { useState, useEffect } from 'react'

export default function CountdownPopup() {
  const [isOpen, setIsOpen] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 17, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Target time: 2026-06-06T21:46:34+05:30
    const targetDate = new Date('2026-06-06T21:46:34+05:30')

    const updateTimer = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isOpen) return null

  return (
    <div className="relative w-full z-[101] bg-[#020c1a] border-b border-[#00aaff]/20 py-2.5 px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 overflow-hidden">
      {/* Subtle animated background glow for the contrasting banner */}
      <div className="absolute inset-0 z-0 opacity-[0.10] pointer-events-none" 
           style={{ background: 'radial-gradient(circle at 50% 50%, #00aaff 0%, transparent 80%)' }} 
      />

      <div className="relative z-10 flex items-center gap-3.5">
        <span 
          className="font-sans font-semibold text-white text-[0.85rem] sm:text-[0.95rem] tracking-wider uppercase flex items-center gap-2"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aaff] to-[#4dd2ff] drop-shadow-[0_0_6px_rgba(0,170,255,0.4)]">
            50% OFFER ENDS IN
          </span>
        </span>
        
        <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
        
        <div className="flex items-center gap-2 font-cond font-bold text-white text-[0.95rem] sm:text-[1.1rem] tracking-wide">
          <span>{timeLeft.days}d</span>
          <span className="text-[#00aaff]/60 pb-0.5">:</span>
          <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
          <span className="text-[#00aaff]/60 pb-0.5">:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
          <span className="text-[#00aaff]/60 pb-0.5">:</span>
          <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(false)} 
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors z-10 text-[0.7rem]"
      >
        ✕
      </button>
    </div>
  )
}
