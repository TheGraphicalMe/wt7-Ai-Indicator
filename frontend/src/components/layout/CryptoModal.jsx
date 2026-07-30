import { useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

const NETWORKS = [
  {
    id: 'erc20',
    name: 'ERC20',
    label: 'Ethereum (ERC20)',
    address: '0xe02Ac2E77aFE91cB22DDaBAE6eFbB32f8dFf751d',
    qr: '/qr/erc20_qr.jpeg', 
  },
  {
    id: 'trc20',
    name: 'TRC20',
    label: 'Tron (TRC20)',
    address: 'TNacy3ALNKEuusFJesvdkVNq4Lv4NWcSpp',
    qr: '/qr/trc20_qr.jpeg',
  },
  {
    id: 'bep20',
    name: 'BEP20',
    label: 'BSC (BEP20)',
    address: '0xe02Ac2E77aFE91cB22DDaBAE6eFbB32f8dFf751d',
    qr: '/qr/bep20_qr.jpeg',
  },
]

export default function CryptoModal({ isOpen, onClose, amount = '$99', planName = '6 Months Plan' }) {
  const [activeNetwork, setActiveNetwork] = useState(NETWORKS[0])
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNetwork.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Reset state when modal closes
  const handleClose = () => {
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex items-start justify-center animate-fade-in"
      style={{ background: 'rgba(5,7,10,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
    >
      <div className="relative w-full max-w-[850px] my-4 animate-scale-in">
        
        {/* Premium Rotating Border */}
        <div className="absolute -inset-[2px] rounded-[30px] overflow-hidden pointer-events-none z-0">
          <div className="absolute -inset-[100%] animate-[spin_16s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, 
                   transparent 0%, transparent 20%, rgba(59,130,246,0.15) 40%, rgba(59,130,246,0.9) 49.5%, #ffffff 50%, 
                   transparent 50%, transparent 70%, rgba(59,130,246,0.15) 90%, rgba(59,130,246,0.9) 99.5%, #ffffff 100%)`
            }}
          />
        </div>

        {/* Border Glow */}
        <div className="absolute -inset-[2.5px] rounded-[30px] overflow-hidden pointer-events-none blur-[12px] opacity-60 z-0">
          <div className="absolute -inset-[100%] animate-[spin_16s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, 
                   transparent 0%, transparent 20%, rgba(59,130,246,0.4) 40%, #3B82F6 50%, 
                   transparent 50%, transparent 70%, rgba(59,130,246,0.4) 90%, #3B82F6 100%)`
            }}
          />
        </div>

        {/* Card Body */}
        <div
          className="relative z-10 w-full rounded-[28px] p-6 sm:p-8 overflow-visible"
          style={{
            background: 'linear-gradient(165deg, rgba(16, 20, 26, 1) 0%, rgba(9, 11, 15, 1) 100%)',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Glow Effects */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[120px] -right-[120px] w-[350px] h-[350px] pointer-events-none mix-blend-screen opacity-[0.12] blur-[80px]" style={{ background: '#3B82F6' }} />
            <div className="absolute -bottom-[120px] -left-[120px] w-[300px] h-[300px] pointer-events-none mix-blend-screen opacity-[0.15] blur-[80px]" style={{ background: '#60A5FA' }} />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute z-50 top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full
                     border border-white/5 bg-white/[0.02] text-white/50
                     cursor-pointer flex items-center justify-center text-[1.1rem]
                     transition-all duration-300 backdrop-blur-md
                     hover:bg-white/[0.08] hover:text-white hover:border-white/10 hover:rotate-90 hover:scale-105"
          >
            ✕
          </button>

          <div className="relative z-10 w-full flex flex-col gap-6">

            {/* ─── Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pr-12">
              <div className="flex items-center gap-3 shrink-0">
                <div className="inline-flex items-center gap-1.5 py-[6px] px-[14px] rounded-full bg-[#3B82F6]/[0.08] border border-[#3B82F6]/20">
                  <span className="font-cond font-bold text-[0.75rem] tracking-[0.12em] text-[#60A5FA] uppercase">{planName}</span>
                </div>
                <h3 className="font-cond text-2xl sm:text-3xl font-black uppercase text-white leading-none whitespace-nowrap">
                  Pay <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#93C5FD]">{amount}</span>
                </h3>
              </div>
              <p className="font-body text-muted text-sm leading-snug">
                Choose your network, scan the QR or copy the wallet address, and send the exact amount.
              </p>
            </div>

            {/* ─── Network Tabs ─── */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-cond font-bold text-white/50 uppercase tracking-widest text-[11px] shrink-0 mr-1">Network</span>
              {NETWORKS.map((net) => (
                <button
                  key={net.id}
                  onClick={() => { setActiveNetwork(net); setCopied(false); }}
                  className={clsx(
                    'py-2.5 px-5 rounded-xl border transition-all duration-300 font-cond font-bold text-sm cursor-pointer',
                    activeNetwork.id === net.id
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#60A5FA] shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {net.name}
                </button>
              ))}
            </div>

            {/* ─── Dedicated Yellow Warning Box ─── */}
            <div className="relative overflow-hidden rounded-xl w-fit bg-[#EAB308]/10 border border-[#EAB308]/20 py-2.5 px-6 flex items-center gap-2.5 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EAB308]/50 to-transparent" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
              <span className="text-[#EAB308] font-cond font-bold text-[13px] sm:text-[14px] uppercase tracking-[0.15em]">
                Send USDT Only
              </span>
            </div>

            {/* ─── Main Content: QR + Details side by side ─── */}
            <div className="flex flex-col sm:flex-row gap-5">

              {/* Left: QR Code */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg">
                  {activeNetwork.qr ? (
                    <img src={activeNetwork.qr} alt={`${activeNetwork.name} QR Code`} className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                        <rect x="18" y="14" width="3" height="3" />
                        <rect x="14" y="18" width="3" height="3" />
                        <rect x="18" y="18" width="3" height="3" />
                      </svg>
                      <span className="text-[#aaa] text-[11px] font-bold mt-2 uppercase tracking-wider">{activeNetwork.name} QR</span>
                    </div>
                  )}
                </div>
                <span className="text-white/40 text-[11px] font-cond uppercase tracking-wider">Scan to pay</span>
              </div>

              {/* Right: Address + Info + CTA stacked */}
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Wallet Address Card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent" />
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-white/50 text-xs font-body">Network: <span className="text-white font-bold">{activeNetwork.label}</span></span>
                  </div>
                  
                  <label className="text-white/40 text-[11px] font-cond uppercase tracking-wider block mb-1.5">Wallet Address</label>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={activeNetwork.address}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white/90 font-mono text-xs outline-none min-w-0"
                    />
                    <button
                      onClick={handleCopy}
                      className="h-[38px] px-4 rounded-lg bg-[#3B82F6]/20 hover:bg-[#3B82F6]/40 transition-colors text-[#60A5FA] font-cond font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer border border-[#3B82F6]/30"
                    >
                      {copied ? '✓ COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div className="flex items-start gap-1.5 mt-3">
                    <svg className="shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
                    <span className="text-[#F59E0B] text-[11px] font-body leading-tight">Sending crypto on the wrong network may result in <strong>Permanent Loss of Funds</strong>. Please double-check before proceeding.</span>
                  </div>
                </div>
                
                {/* After Payment */}
                <div className="flex flex-col gap-3 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl p-3.5 mt-auto">
                  <p className="text-white/70 text-[13px] font-body leading-relaxed">
                    After payment, click the button below to send your <strong className="text-white">Transaction screenshot along with Hash/Transaction ID</strong>. Also mention your <strong className="text-white">Name and Email ID</strong>.
                  </p>
                </div>

                {/* CTA */}
                <a
                  href={`https://wa.me/918887515391?text=${encodeURIComponent(`Hello! I've made the crypto payment for the Smart AI ${planName}.\n\nName: \nEmail: \nHash ID: \n\nAttached is my transaction screenshot.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2
                         font-cond font-bold text-[0.95rem] tracking-[0.12em] uppercase
                         bg-[#25D366] text-white border-none shadow-[0_0_25px_rgba(37,211,102,0.25)]
                         transition-all duration-300 hover:shadow-[0_0_45px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  SEND SCREENSHOT ON WHATSAPP
                </a>
                
                <div className="flex items-center justify-center gap-2 mt-2 opacity-50">
                  <span className="w-1 h-1 rounded-full bg-[#0DFF7F]" />
                  <span className="font-cond text-[10px] uppercase tracking-widest text-white">activation can take 2-48 hrs</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}