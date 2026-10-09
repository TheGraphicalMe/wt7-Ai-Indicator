import useSaleCountdown, { padTime, SALE_END_LABEL } from '@/hooks/useSaleCountdown'

export default function TopBanner() {
  const { days, hours, minutes, seconds, expired } = useSaleCountdown()

  if (expired) return null

  return (
    <div
      className="w-full py-2.5 px-2 sm:px-4 flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-6 whitespace-nowrap overflow-hidden z-50 relative pointer-events-auto"
      style={{
        background: 'linear-gradient(90deg, #001A0E 0%, #003D22 25%, #00522E 50%, #003D22 75%, #001A0E 100%)',
        borderBottom: '1px solid rgba(0,255,136,0.15)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,136,0.08), inset 0 0 60px rgba(0,120,60,0.2)',
      }}
    >
      {/* Shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 10%, #00FF88 35%, #00E5FF 50%, #00FF88 65%, transparent 90%)', opacity: 0.5 }} />

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Pulsing live dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88] shadow-[0_0_6px_#00FF88]"></span>
        </span>

        <span className="font-cond font-bold tracking-[0.08em] sm:tracking-[0.2em] uppercase text-[clamp(0.56rem,2.9vw,0.7rem)] sm:text-[0.8rem] text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-[#00E5FF] to-[#00FF88]">
          Limited Time Offer
        </span>

        <span className="hidden sm:inline-block text-white/20 font-light">|</span>

        <span className="font-cond font-black tracking-[0.05em] sm:tracking-[0.1em] uppercase text-[clamp(0.6rem,3.1vw,0.75rem)] sm:text-[0.85rem] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Up to <span className="text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">80% Off</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 font-cond font-bold tracking-[0.05em] sm:tracking-[0.15em] text-[clamp(0.6rem,3.1vw,0.75rem)] sm:text-[0.85rem]">
        <span className="hidden sm:inline text-white/35 uppercase text-[0.65rem] mr-0.5 tracking-[0.2em]"><span className="hidden md:inline">Till {SALE_END_LABEL} · </span>Ends in</span>
        <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 rounded-md bg-black/35 border border-[#00FF88]/15 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4),0_0_12px_rgba(0,255,136,0.06)]">
          <span className="text-[#00FF88] min-w-[1.4em] sm:min-w-[20px] text-center drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">{padTime(days)}d</span>
          <span className="text-[#00E5FF]/30 mb-0.5">:</span>
          <span className="text-[#00FF88] min-w-[1.4em] sm:min-w-[20px] text-center drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">{padTime(hours)}</span>
          <span className="text-[#00E5FF]/30 mb-0.5">:</span>
          <span className="text-[#00FF88] min-w-[1.4em] sm:min-w-[20px] text-center drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">{padTime(minutes)}</span>
          <span className="text-[#00E5FF]/30 mb-0.5">:</span>
          <span className="text-[#00FF88] min-w-[1.4em] sm:min-w-[20px] text-center drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">{padTime(seconds)}</span>
        </div>
      </div>
    </div>
  )
}
