// ─── SMART AI ACCESS — PREMIUM FOOTER ────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 pb-9 border-t border-white/[0.05] text-center bg-gradient-to-b from-transparent to-bg">
      {/* Animated divider line */}
      <div
        className="absolute -top-px left-1/2 -translate-x-1/2 w-3/5 max-w-[400px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(13,255,127,0.3), transparent)' }}
      />

      <div className="container">
        {/* Logo */}
        <div className="inline-flex flex-col leading-none gap-0.5 mb-5">
          <span
            className="font-cond text-[0.82rem] tracking-[0.32em] font-semibold uppercase text-green"
            style={{
              textShadow: '0 0 10px rgba(13,255,127,0.9), 0 0 25px rgba(13,255,127,0.35)',
            }}
          >
            Smart AI
          </span>
        </div>

        {/* Links */}
        <div className="flex justify-center items-center gap-7 mb-5 flex-wrap">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-body text-[0.78rem] font-medium text-muted no-underline
                         transition-colors duration-200 hover:text-green"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center mb-6">
          <a
            href="https://www.instagram.com/smartai_trading?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(220,39,67,0.6)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#insta-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="sr-only">Instagram</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="font-body text-[0.72rem] text-[#0DFF7F] m-0 opacity-80">
          © {new Date().getFullYear()} Smart AI · All rights reserved
        </p>
      </div>
    </footer>
  )
}
