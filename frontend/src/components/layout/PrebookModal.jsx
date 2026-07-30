// ─── AI INDICATOR — PREBOOK MODAL FORM ───────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { countries, getEmojiFlag } from 'countries-list'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { GOOGLE_FORM_CONFIG } from '@/lib/constants'
import { usePrebook } from '@/contexts/PrebookContext'

// ─── BUILD COUNTRIES ARRAY FROM PACKAGE (252 countries, A–Z) ─────────────────
const COUNTRIES = Object.entries(countries)
  .map(([code, c]) => ({
    code,
    name: c.name,
    dial: '+' + c.phone[0],
    flag: getEmojiFlag(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

// ─── EXPERIENCE SELECT ────────────────────────────────────────────────────────
const EXPERIENCES = [
  'Beginner - 0 Experience',
  'Advance - 2+  year Experience',
  'Expert -  4+ year Experience',
]

function ExperienceSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={clsx(
          'form-input flex items-center justify-between cursor-pointer select-none',
          error && 'form-input-error',
          focused && !error && 'border-accent-border',
          !value && 'text-muted'
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={0}
      >
        <span>{value || 'Select your experience...'}</span>
        <span
          className="text-[0.6rem] text-muted transition-transform duration-200"
          style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="dropdown-list">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp}
              onMouseDown={() => { onChange(exp); setOpen(false) }}
              className={clsx(
                'dropdown-item font-body text-[0.92rem]',
                value === exp && 'dropdown-item-active',
              )}
            >
              {exp}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── PLAN SELECT ──────────────────────────────────────────────────────────────
const PLAN_OPTIONS = [
  '7 YEAR ACCESS',
  'LIFETIME ACCESS',
]

function PlanSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={clsx(
          'form-input flex items-center justify-between cursor-pointer select-none',
          error && 'form-input-error',
          !value && 'text-muted'
        )}
        tabIndex={0}
      >
        <span>{value || 'Select your plan...'}</span>
        <span
          className="text-[0.6rem] text-muted transition-transform duration-200"
          style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="dropdown-list">
          {PLAN_OPTIONS.map((plan) => (
            <div
              key={plan}
              onMouseDown={() => { onChange(plan); setOpen(false) }}
              className={clsx(
                'dropdown-item font-body text-[0.92rem]',
                value === plan && 'dropdown-item-active',
              )}
            >
              {plan}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer bg-transparent border-none p-0 transition-transform duration-200 hover:scale-125"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={(hovered || value) >= star ? '#FFD700' : 'rgba(255,255,255,0.1)'}
            stroke={(hovered || value) >= star ? '#FFD700' : 'rgba(255,255,255,0.2)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="text-white/50 text-xs font-body ml-2">{value}/5</span>
      )}
    </div>
  )
}

// ─── PHONE INPUT — DIAL CODE PREFIX + NUMBER ──────────────────────────────────
function PhoneInput({ dialCode, onDialChange, number, onNumberChange, error }) {
  const [dialOpen, setDialOpen] = useState(false)
  const [dialQuery, setDialQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setDialOpen(false)
        setDialQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (dialOpen && searchRef.current) searchRef.current.focus()
  }, [dialOpen])

  const filteredDials = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(dialQuery.toLowerCase()) ||
    c.dial.includes(dialQuery)
  )

  const currentFlag = COUNTRIES.find(c => c.dial === dialCode)?.flag || '🌐'

  return (
    <div ref={wrapRef} className="flex relative w-full">
      <button
        type="button"
        onClick={() => setDialOpen(p => !p)}
        className="flex items-center justify-center gap-1.5
                   py-3.5 px-3 pl-3 rounded-l-[10px]
                   bg-green-dim text-white cursor-pointer
                   font-cond text-[0.88rem] font-bold tracking-[0.04em]
                   whitespace-nowrap min-w-[90px] shrink-0
                   transition-colors duration-200
                   hover:bg-green/[0.15]"
        style={{
          border: `1px solid ${error ? '#ff5b79' : focused ? 'rgba(13,255,127,0.35)' : 'rgba(255,255,255,0.07)'}`,
          borderRight: 'none',
        }}
      >
        <span className="text-[1.05rem] leading-none">{currentFlag}</span>
        <span>{dialCode}</span>
        <span className="text-[0.5rem] text-muted">▼</span>
      </button>

      <input
        type="tel"
        value={number}
        onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s]/g, ''))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Whatsapp Number"
        className={clsx(
          'form-input flex-1 min-w-0 !rounded-l-none !rounded-r-[10px]',
          error && 'form-input-error',
          focused && !error && 'border-accent-border',
        )}
      />

      {dialOpen && (
        <div className="dropdown-list !left-0 !right-auto w-[260px]">
          <div className="p-2 border-b border-border">
            <input
              ref={searchRef}
              type="text"
              value={dialQuery}
              onChange={(e) => setDialQuery(e.target.value)}
              placeholder="Search country or code…"
              className="form-input !py-2 !px-3 !rounded-[7px] !text-[0.83rem]"
            />
          </div>
          <div className="max-h-[190px] overflow-y-auto">
            {filteredDials.length === 0 ? (
              <div className="py-3 px-3.5 font-body text-[0.83rem] text-muted">
                No results
              </div>
            ) : (
              filteredDials.map((c) => (
                <div
                  key={c.code}
                  onMouseDown={() => { onDialChange(c.dial); setDialOpen(false); setDialQuery('') }}
                  className={clsx(
                    'dropdown-item',
                    dialCode === c.dial && 'dropdown-item-active',
                  )}
                >
                  <span className="text-[1.05rem] leading-none shrink-0">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="font-cond text-[0.78rem] font-bold text-accent shrink-0">
                    {c.dial}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DEFAULT STATE ────────────────────────────────────────────────────────────
const DEFAULT_FORM = { name: '', email: '', experience: '', dialCode: '+91', phoneNumber: '', summary: '', priority: 0 }

// ─── VALIDATORS ───────────────────────────────────────────────────────────────
const formValidators = {
  name: (v) => {
    if (!v.trim()) return 'Name is required'
    if (v.trim().length < 2) return 'Name is too short'
    if (!/^[a-zA-Z\s'.]+$/.test(v.trim())) return 'Name should only contain letters'
    return ''
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Enter a valid email address'
    return ''
  },
  phoneNumber: (v) => {
    const digits = v.replace(/\s/g, '')
    if (!digits) return 'Phone number is required'
    if (!/^\d{6,14}$/.test(digits)) return 'Enter 6–14 digits'
    return ''
  },
  experience: (v) => {
    if (!v) return 'Please select your trading experience'
    return ''
  },
  summary: (v) => {
    if (!v) return 'Please select a plan'
    return ''
  },
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export default function PrebookModal() {
  const { isOpen, close } = usePrebook()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  if (!isOpen) return null

  const update = (field) => (val) => {
    setForm(prev => ({ ...prev, [field]: val }))
    if (errors[field] && formValidators[field] && !formValidators[field](val)) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const next = {}
    for (const key of Object.keys(formValidators)) {
      const err = formValidators[key](form[key] ?? '')
      if (err) next[key] = err
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')

    try {
      const fd = new FormData()
      fd.append(GOOGLE_FORM_CONFIG.fields.name, form.name.trim())
      fd.append(GOOGLE_FORM_CONFIG.fields.email, form.email.trim())
      fd.append(GOOGLE_FORM_CONFIG.fields.experience, form.experience)
      fd.append(GOOGLE_FORM_CONFIG.fields.phone, `${form.dialCode} ${form.phoneNumber.trim()}`)
      fd.append(GOOGLE_FORM_CONFIG.fields.summary, form.summary)
      fd.append(GOOGLE_FORM_CONFIG.fields.priority, form.priority > 0 ? String(form.priority) : '3')

      await fetch(GOOGLE_FORM_CONFIG.actionUrl, { method: 'POST', mode: 'no-cors', body: fd })

      setStatus('success')
      setForm(DEFAULT_FORM)
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const resetAndClose = () => {
    close()
    setStatus('idle')
    setErrors({})
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) resetAndClose()
  }

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex items-start justify-center animate-fade-in"
      style={{ background: 'rgba(5,7,10,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
    >
      <div className="relative w-full max-w-[520px] my-4 animate-scale-in">

        {/* Premium Rotating Border Background - Longer Tails */}
        <div className="absolute -inset-[2px] rounded-[33px] overflow-hidden pointer-events-none z-0">
          <div className="absolute -inset-[100%] animate-[spin_16s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, 
                   transparent 0%, transparent 20%, rgba(13,255,127,0.15) 40%, rgba(13,255,127,0.9) 49.5%, #ffffff 50%, 
                   transparent 50%, transparent 70%, rgba(13,255,127,0.15) 90%, rgba(13,255,127,0.9) 99.5%, #ffffff 100%)`
            }}
          />
        </div>

        {/* Border Glow Bloom - Matches the Longer Tails */}
        <div className="absolute -inset-[2.5px] rounded-[33px] overflow-hidden pointer-events-none blur-[12px] opacity-60 z-0">
          <div className="absolute -inset-[100%] animate-[spin_16s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, 
                   transparent 0%, transparent 20%, rgba(13,255,127,0.4) 40%, #0DFF7F 50%, 
                   transparent 50%, transparent 70%, rgba(13,255,127,0.4) 90%, #0DFF7F 100%)`
            }}
          />
        </div>

        {/* Card Body */}
        <div
          className="relative z-10 w-full rounded-[32px] p-[clamp(28px,5vw,48px)] overflow-visible group"
          style={{
            background: 'linear-gradient(165deg, rgba(16, 20, 26, 1) 0%, rgba(9, 11, 15, 1) 100%)',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Glow Effects */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-0">
            <div
              className="absolute -top-[150px] -right-[150px] w-[350px] h-[350px] pointer-events-none mix-blend-screen opacity-[0.08] blur-[80px]"
              style={{ background: '#0DFF7F' }}
            />
            <div
              className="absolute -bottom-[150px] -left-[150px] w-[300px] h-[300px] pointer-events-none mix-blend-screen opacity-[0.15] blur-[80px]"
              style={{ background: '#9B6DFF' }}
            />
          </div>

          <button
            onClick={resetAndClose}
            className="absolute z-50 top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full
                     border border-white/5 bg-white/[0.02] text-white/50
                     cursor-pointer flex items-center justify-center text-[1.1rem]
                     transition-all duration-300 backdrop-blur-md
                     hover:bg-white/[0.08] hover:text-white hover:border-white/10 hover:rotate-90 hover:scale-105"
          >
            ✕
          </button>

          <div className="relative z-10 w-full flex flex-col">

            {status === 'success' ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-green/10 border border-green/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(13,255,127,0.2)]">
                  <span className="text-4xl text-green">✓</span>
                </div>
                <h3 className="font-cond text-[2.2rem] font-black uppercase text-white mb-3">
                  You're In!
                </h3>
                <p className="font-body text-muted text-[1rem] leading-relaxed mb-8 max-w-[340px]">
                  We've received your request for the {form.summary || 'Lifetime'} plan. Our team will contact you shortly.
                </p>
                <button
                  onClick={resetAndClose}
                  className="py-4 px-12 rounded-[10px] cursor-pointer
                         font-cond font-bold text-[0.92rem] tracking-[0.14em] uppercase
                         bg-green text-bg border-none
                         shadow-[0_0_40px_rgba(13,255,127,0.15)]
                         transition-all duration-300 hover:shadow-[0_0_60px_rgba(13,255,127,0.3)] hover:-translate-y-0.5"
                >
                  DONE
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8 relative">
                  <div className="inline-flex glass-badge mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
                    <span className="font-cond font-bold text-[0.75rem] tracking-[0.15em] text-green uppercase">
                      Lifetime Access
                    </span>
                  </div>
                  <h3 className="font-cond text-[clamp(1.8rem,4vw,2.2rem)] font-black uppercase text-white leading-[1.1] mb-3">
                    Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-green to-accent-lt drop-shadow-[0_0_15px_rgba(13,255,127,0.3)]">Smart AI</span>
                  </h3>
                  <p className="font-body text-muted text-[0.92rem] leading-relaxed max-w-[320px] mx-auto">
                    Please fill your details correctly and our team will get back to you with the payment details.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text" value={form.name}
                      onChange={(e) => update('name')(e.target.value)}
                      placeholder="Enter your full name"
                      className={clsx('form-input', errors.name && 'form-input-error')}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email" value={form.email}
                      onChange={(e) => update('email')(e.target.value)}
                      placeholder="your@email.com"
                      className={clsx('form-input', errors.email && 'form-input-error')}
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="form-label">Whatsapp Number</label>
                    <PhoneInput
                      dialCode={form.dialCode}
                      onDialChange={update('dialCode')}
                      number={form.phoneNumber}
                      onNumberChange={update('phoneNumber')}
                      error={errors.phoneNumber}
                    />
                    {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="form-label">Plan</label>
                      <PlanSelect
                        value={form.summary}
                        onChange={update('summary')}
                        error={errors.summary}
                      />
                      {errors.summary && <p className="form-error">{errors.summary}</p>}
                    </div>
                    <div>
                      <label className="form-label">Trading Experience</label>
                      <ExperienceSelect
                        value={form.experience}
                        onChange={update('experience')}
                        error={errors.experience}
                      />
                      {errors.experience && <p className="form-error">{errors.experience}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">How important is this to you? (Priority)</label>
                    <StarRating
                      value={form.priority}
                      onChange={update('priority')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={clsx(
                      'w-full py-4 mt-2 rounded-[10px]',
                      'font-cond font-bold text-[0.95rem] tracking-[0.14em] uppercase',
                      'text-bg border-none shadow-[0_0_40px_rgba(13,255,127,0.15)]',
                      'transition-all duration-300',
                      status === 'sending'
                        ? 'bg-green/35 cursor-wait'
                        : 'bg-green cursor-pointer hover:shadow-[0_0_60px_rgba(13,255,127,0.35)] hover:-translate-y-0.5',
                    )}
                  >
                    {status === 'sending' ? 'SUBMITTING…' : 'SUBMIT REQUEST'}
                  </button>

                  {status === 'error' && (
                    <p className="font-body text-red text-[0.88rem] text-center mt-1">
                      Something went wrong. Please check your connection and try again.
                    </p>
                  )}

                  <p className="font-body text-white/[0.25] text-[0.75rem] text-center leading-normal mt-2">
                    Your data is secure. We'll only contact you regarding your access request.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
