// ─── SMART AI — PREMIUM FLOATING CHATBOT ─────────────────────────────────────
import { useState, useRef, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SUGGESTIONS = [
  'What is Smart AI?',
  'Show me all features',
  'What are the pricing plans?',
  'How to contact support?',
]

const WELCOME_MSG = {
  role: 'assistant',
  content: "Welcome. I'm your Smart AI assistant — ask me about features, plans, getting started, or support.",
}

const fontStyle = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700&display=swap');`

const formatMessage = (text) => {
  if (!text) return text;
  // Match standard URLs
  const regex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\/[^\s]+$/)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#0DFF7F', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{part}</a>;
    }
    return part;
  });
};

export default function Chatbot() {
  const [isOpen, setIsOpen]           = useState(false)
  const [messages, setMessages]       = useState([WELCOME_MSG])
  const [input, setInput]             = useState('')
  const [isStreaming, setIsStreaming]  = useState(false)
  const [hasUnread, setHasUnread]     = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const abortRef       = useRef(null)

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = fontStyle
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 320)
    }
  }, [isOpen])

  const sendMessage = async (override) => {
    const text = (override ?? input).trim()
    if (!text || isStreaming) return

    setInput('')
    const userMsg      = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    setIsStreaming(true)

    const history = nextMessages.slice(1).map(({ role, content }) => ({ role, content }))

    try {
      abortRef.current = new AbortController()
      const res = await fetch(`${API_URL}/chat`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ message: text, history }),
        signal  : abortRef.current.signal,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Error ${res.status}`)
      }
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            role    : 'assistant',
            content : copy[copy.length - 1].content + chunk,
          }
          return copy
        })
      }
      if (!isOpen) setHasUnread(true)
    } catch (err) {
      if (err.name === 'AbortError') return
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role    : 'assistant',
          content : 'Something went wrong. Please try again.',
        }
        return copy
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showSuggestions = messages.length === 1 && !isStreaming

  return (
    <>
      <style>{`
        @keyframes sai-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.8)} }
        @keyframes sai-dot     { 0%,80%,100%{transform:translateY(0);opacity:.3} 40%{transform:translateY(-4px);opacity:1} }
        @keyframes sai-in      { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sai-ring    { 0%,100%{box-shadow:0 0 0 0 rgba(13,255,127,.45)} 60%{box-shadow:0 0 0 8px rgba(13,255,127,0)} }
        @keyframes sai-shimmer { 0%,100%{opacity:.3} 50%{opacity:.65} }

        .sai-msg  { animation: sai-in 0.24s ease both; }

        .sai-scroll::-webkit-scrollbar       { width: 2px; }
        .sai-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .sai-chip {
          transition: all 0.18s ease;
          cursor: pointer;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .sai-chip:hover {
          background:   rgba(13,255,127,0.08) !important;
          border-color: rgba(13,255,127,0.35) !important;
          color:        rgba(13,255,127,0.9)  !important;
        }

        .sai-input-wrap { transition: border-color 0.2s ease; }
        .sai-input-wrap:focus-within { border-color: rgba(13,255,127,0.3) !important; }

        .sai-close { transition: background 0.15s, border-color 0.15s; }
        .sai-close:hover {
          background:   rgba(255,255,255,0.07) !important;
          border-color: rgba(255,255,255,0.2)  !important;
        }

        .sai-send { transition: all 0.18s ease; }
        .sai-send:not(:disabled):hover {
          background:   rgba(13,255,127,0.18) !important;
          border-color: rgba(13,255,127,0.55) !important;
        }

        .sai-fab { transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease; }
        .sai-fab:hover { transform: scale(1.08) !important; }

        /* Mobile: FAB corner + safe area so it does not cover footer text (main adds scroll padding) */
        @media (max-width: 767px) {
          .sai-fab {
            bottom: max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem)) !important;
            right: max(0.75rem, env(safe-area-inset-right, 0px)) !important;
          }
        }

        /* Mobile: start panel lower — less height from top, clears fixed navbar + notch */
        @media (max-width: 767px) {
          .sai-panel {
            top: max(5.25rem, calc(env(safe-area-inset-top, 0px) + 4.5rem)) !important;
            bottom: max(0.75rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem)) !important;
            right: max(0.5rem, env(safe-area-inset-right, 0px)) !important;
            width: min(365px, calc(100vw - 12px)) !important;
          }
        }
      `}</style>

      {/* ── Tooltip ─────────────────────────────────────────────────────────── */}
      {!isOpen && showTooltip && (
        <div 
          className="sai-tooltip hidden sm:flex flex-col"
          style={{
            position: 'fixed',
            bottom: '6.2rem',
            right: '2.25rem',
            zIndex: 9998,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.05)',
            padding: '10px 14px',
            borderRadius: '14px 14px 2px 14px',
            alignItems: 'flex-start',
            gap: '2px',
            animation: 'sai-in 0.4s cubic-bezier(0.16,1,0.3,1) 1s both',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#111318',
              whiteSpace: 'nowrap'
            }}>
              How can I assist you?
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              style={{
                marginLeft: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="13" y1="1" x2="1"  y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.65rem',
            color: '#666',
          }}>
            Smart AI Assistant
          </span>
          {/* Arrow pointing down to the FAB */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            right: '18px',
            width: 12,
            height: 12,
            background: '#ffffff',
            borderRight: '1px solid rgba(0,0,0,0.1)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            transform: 'rotate(45deg)'
          }} />
        </div>
      )}

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="sai-fab"
        style={{
          position      : 'fixed',
          bottom        : '2.25rem',
          right         : '2.25rem',
          zIndex        : 9999,
          width         : 56,
          height        : 56,
          borderRadius  : '50%',
          display       : 'flex',
          alignItems    : 'center',
          justifyContent: 'center',
          cursor        : 'pointer',
          opacity       : isOpen ? 0 : 1,
          transform     : isOpen ? 'scale(0.72)' : 'scale(1)',
          pointerEvents : isOpen ? 'none' : 'auto',
          // Dark button, single green ring — very restrained
          background    : '#111318',
          border        : '1.5px solid rgba(13,255,127,0.5)',
          boxShadow     : '0 6px 24px rgba(0,0,0,0.7), 0 0 18px rgba(13,255,127,0.1)',
          animation     : hasUnread && !isOpen ? 'sai-ring 2s ease infinite' : 'none',
        }}
      >
        {hasUnread && !isOpen && (
          <span style={{
            position    : 'absolute', top: -2, right: -2,
            width: 10, height: 10,
            borderRadius: '50%',
            background  : '#0DFF7F',
            border      : '2px solid #111318',
            animation   : 'sai-pulse 1.8s ease infinite',
          }} />
        )}

        {/* Speech-Bubble Chatbot Logo */}
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <line x1="16" y1="6" x2="16" y2="3" stroke="#0DFF7F" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="2" r="1.5" fill="#0DFF7F" />

          {/* Speech Bubble Body */}
          <rect x="4" y="6" width="24" height="17" rx="5" fill="#0DFF7F" />
          {/* Bubble Tail */}
          <path d="M7 23 L5 28 L12 23" fill="#0DFF7F" />

          {/* Eyes */}
          <ellipse cx="11.5" cy="14" rx="2.6" ry="2.8" fill="#111318" />
          <ellipse cx="20.5" cy="14" rx="2.6" ry="2.8" fill="#111318" />
          {/* Eye Highlights */}
          <ellipse cx="12.2" cy="13" rx="0.9" ry="1" fill="rgba(255,255,255,0.7)" />
          <ellipse cx="21.2" cy="13" rx="0.9" ry="1" fill="rgba(255,255,255,0.7)" />

          {/* Smile */}
          <path d="M10.5 18.5 Q16 22 21.5 18.5" stroke="#111318" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      </button>

      {/* ── Panel ───────────────────────────────────────────────────────────── */}
      <div
        aria-hidden={!isOpen}
        className="sai-panel"
        style={{
          position      : 'fixed',
          top           : '1rem',
          bottom        : '1rem',
          right         : '1.5rem',
          zIndex        : 8999,
          width         : 'min(365px, calc(100vw - 20px))',
          display       : 'flex',
          flexDirection : 'column',
          borderRadius  : 18,
          overflow      : 'hidden',
          // Pure dark base — not tinted green, just dark
          background    : '#0F1117',
          border        : '1px solid rgba(255,255,255,0.08)',
          boxShadow     : '0 32px 80px rgba(0,0,0,0.9)',
          transition    : 'opacity 0.2s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          opacity       : isOpen ? 1 : 0,
          transform     : isOpen ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.96)',
          pointerEvents : isOpen ? 'auto' : 'none',
        }}
      >

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{
          padding     : '15px 16px 14px',
          display     : 'flex',
          alignItems  : 'center',
          gap         : 10,
          flexShrink  : 0,
          // Slightly lighter than body so it reads as a distinct zone
          background  : '#161820',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Brand */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Simple, static online dot */}
            <span style={{ 
              width: 8, height: 8, 
              borderRadius: '50%', 
              background: '#0DFF7F', 
              boxShadow: '0 0 6px rgba(13,255,127,0.4)',
              flexShrink: 0
            }} />

            <p style={{ margin: 0, lineHeight: 1.2 }}>
              <span style={{
                fontFamily   : "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight   : 700,
                fontSize     : '1rem',
                color        : '#FFFFFF',
                letterSpacing: '0.005em',
              }}>
                Smart AI Assistant
              </span>
            </p>
          </div>

          {/* Minimise */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Minimise"
            className="sai-close"
            style={{
              width: 28, height: 28,
              borderRadius  : 8,
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              cursor        : 'pointer',
              background    : 'transparent',
              border        : '1px solid rgba(255,255,255,0.1)',
              flexShrink    : 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="1" x2="13" y2="13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="13" y1="1" x2="1"  y2="13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Messages ────────────────────────────────────────────────────── */}
        <div
          className="sai-scroll"
          style={{
            flex         : 1,
            overflowY    : 'auto',
            padding      : '18px 14px',
            display      : 'flex',
            flexDirection: 'column',
            gap          : 10,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className="sai-msg"
              style={{
                display       : 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animationDelay: `${Math.min(i, 4) * 0.04}s`,
              }}
            >
              {msg.role === 'user' ? (
                // User bubble — premium emerald gradient + depth
                <div style={{
                  maxWidth    : '76%',
                  padding     : '10px 16px',
                  borderRadius: '18px 18px 6px 18px',
                  background  : 'linear-gradient(142deg, #0DFF7F 0%, #00C693 52%, #00B894 100%)',
                  border      : '1px solid rgba(255,255,255,0.28)',
                  color       : '#03130C',
                  fontFamily  : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight  : 600,
                  fontSize    : '0.82rem',
                  lineHeight  : 1.6,
                  boxShadow   : '0 1px 0 rgba(255,255,255,0.35) inset, 0 4px 20px rgba(13,255,127,0.28), 0 12px 32px rgba(0,184,148,0.15)',
                  whiteSpace  : 'pre-wrap',
                }}>
                  {formatMessage(msg.content)}
                </div>
              ) : (
                // Assistant bubble — white text on dark, neutral surface
                <div style={{
                  maxWidth    : '84%',
                  padding     : '9px 14px',
                  borderRadius: '4px 16px 16px 16px',
                  background  : '#1A1D27',
                  border      : '1px solid rgba(255,255,255,0.07)',
                  color       : 'rgba(255,255,255,0.82)',
                  fontFamily  : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight  : 400,
                  fontSize    : '0.82rem',
                  lineHeight  : 1.68,
                }}>
                  {msg.content === '' ? (
                    <span style={{ display: 'flex', gap: 5, alignItems: 'center', height: 16 }}>
                      {[0, 160, 310].map((d, k) => (
                        <span key={k} style={{
                          width         : 5, height: 5,
                          borderRadius  : '50%',
                          background    : '#0DFF7F',
                          display       : 'inline-block',
                          animation     : 'sai-dot 1.1s ease infinite',
                          animationDelay: `${d}ms`,
                          opacity       : 0.75,
                        }} />
                      ))}
                    </span>
                  ) : (
                    <span style={{ whiteSpace: 'pre-wrap' }}>{formatMessage(msg.content)}</span>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Suggestion chips */}
          {showSuggestions && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 6, paddingLeft: 2 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="sai-chip"
                  style={{
                    padding      : '5px 12px',
                    fontFamily   : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight   : 500,
                    fontSize     : '0.66rem',
                    // White-ish text, neutral border — green only on hover
                    color        : 'rgba(255,255,255,0.45)',
                    background   : 'rgba(255,255,255,0.04)',
                    border       : '1px solid rgba(255,255,255,0.1)',
                    borderRadius : 20,
                    letterSpacing: '0.01em',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Divider with subtle green shimmer ───────────────────────────── */}
        <div style={{ position: 'relative', height: 1, flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{
            position  : 'absolute',
            top: 0, left: '20%', right: '20%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(13,255,127,0.35), transparent)',
            animation : 'sai-shimmer 4s ease infinite',
          }} />
        </div>

        {/* ── Input ───────────────────────────────────────────────────────── */}
        <div style={{
          padding   : '10px 12px 12px',
          flexShrink: 0,
          background: '#0F1117',
        }}>
          <div
            className="sai-input-wrap"
            style={{
              display     : 'flex',
              alignItems  : 'center',
              gap         : 8,
              padding     : '8px 12px',
              borderRadius: 12,
              // Neutral input — no green tint
              background  : 'rgba(255,255,255,0.05)',
              border      : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              disabled={isStreaming}
              maxLength={500}
              style={{
                flex      : 1,
                background: 'transparent',
                border    : 'none',
                outline   : 'none',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 400,
                fontSize  : '0.82rem',
                color     : 'rgba(255,255,255,0.88)',
                caretColor: '#0DFF7F',
                minWidth  : 0,
                opacity   : isStreaming ? 0.4 : 1,
              }}
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              className="sai-send"
              aria-label="Send"
              style={{
                width         : 30, height: 30,
                borderRadius  : 8,
                display       : 'flex',
                alignItems    : 'center',
                justifyContent: 'center',
                flexShrink    : 0,
                cursor        : input.trim() && !isStreaming ? 'pointer' : 'not-allowed',
                background    : input.trim() && !isStreaming ? 'rgba(13,255,127,0.12)' : 'transparent',
                border        : input.trim() && !isStreaming ? '1px solid rgba(13,255,127,0.35)' : '1px solid transparent',
                opacity       : input.trim() && !isStreaming ? 1 : 0.2,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <line x1="22" y1="2" x2="11" y2="13" stroke="#0DFF7F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#0DFF7F" opacity="0.9"/>
              </svg>
            </button>
          </div>

          <p style={{
            fontFamily   : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight   : 500,
            fontSize     : '0.52rem',
            color        : 'rgba(255,255,255,0.15)',
            textAlign    : 'center',
            marginTop    : 8,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Smart AI · AI Assistant
          </p>
        </div>
      </div>
    </>
  )
}