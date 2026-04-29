// ─── SMART AI — SUPPORTED MARKETS COMPONENT ─────────────────────────────────

export default function SupportedMarkets() {
  return (
    <section className="relative w-full py-16 pt-0 px-4 z-10 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-[1000px] mx-auto animate-fade-slide-up hover:scale-[1.01] transition-transform duration-500">
        <p className="font-cond tracking-[0.15em] text-[1.5rem] uppercase text-[#0DFF7F]/80 mb-5 font-semibold drop-shadow-[0_0_10px_rgba(13,255,127,0.3)]">
          Works in every market
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {[
            { name: 'Forex', items: 'XAU/USD, XAG/USD, EUR/USD, etc.' },
            { name: 'Crypto', items: 'Bitcoin, Ethereum, Solana, etc.' },
            { name: 'Commodities', items: 'Crude Oil, Natural Gas, etc.' },
            { name: 'Stock Market', items: 'NIFTY50, NIFTY BANK, SENSEX, etc.' }
          ].map((market) => (
            <div 
              key={market.name} 
              className="flex shrink-0 items-center justify-center gap-2.5 py-2 px-4 rounded-full bg-white/[0.03] border border-white/[0.05] hover:border-[#0DFF7F]/40 transition-all duration-300 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(13,255,127,0.2)] whitespace-nowrap cursor-default hover:-translate-y-0.5"
            >
              <span className="font-body text-[14px] sm:text-[17px] font-bold text-[#0DFF7F]">{market.name}</span>
              <span className="font-body text-[14px] sm:text-[17px] text-white/70">{market.items}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
