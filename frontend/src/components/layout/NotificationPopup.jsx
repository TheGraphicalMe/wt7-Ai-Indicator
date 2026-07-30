import { useState } from 'react'

export default function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-lg bg-zinc-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">

        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full transition-all duration-300 z-10"
          aria-label="Close popup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>

        <div className="relative flex flex-col items-center text-center mt-2 z-10">
          <div className="relative flex items-center justify-center w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-blue-500/20 to-blue-600/5 border border-blue-500/30">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-4 tracking-tight">
            We are temporarily down
          </h2>

          <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Our platform is taking a short break. In the meantime, you can join our upcoming trading learning batch where <span className="text-zinc-200 font-medium">1-month Smart AI access is completely free.</span>
          </p>

          <a
            href="https://wzhdwc.courses.store/844422?coupon=STUDENT007"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full flex items-center justify-center gap-2 py-4 px-6 bg-white text-black font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden shadow-xl shadow-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Join Learning Batch Now</span>
            <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
