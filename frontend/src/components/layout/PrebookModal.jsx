// ─── AI INDICATOR — PREBOOK MODAL FORM ───────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { countries, getEmojiFlag } from 'countries-list'
import clsx from 'clsx'
import { GOOGLE_FORM_CONFIG } from '@/lib/constants'
import { validators } from '@/lib/validators'
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

// ─── SEARCHABLE COUNTRY SELECT ────────────────────────────────────────────────
function CountrySelect({ value, onChange, onDialChange, error }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        const match = COUNTRIES.find(c => c.name.toLowerCase() === query.toLowerCase())
        if (!match) setQuery(value || '')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [query, value])

  const showAll = !query || query === value
  const filtered = showAll
    ? COUNTRIES
    : COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (c) => {
    setQuery(c.name)
    onChange(c.name)
    onDialChange(c.dial)
    setOpen(false)
  }

  const selectedCountry = COUNTRIES.find(c => c.name.toLowerCase() === query.toLowerCase())

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        {selectedCountry && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[1.1rem] pointer-events-none leading-none">
            {selectedCountry.flag}
          </span>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange('') }}
          onFocus={(e) => { setFocused(true); setOpen(true); setTimeout(() => e.target.select(), 0) }}
          onBlur={() => setFocused(false)}
          placeholder="Search country…"
          autoComplete="off"
          className={clsx(
            'form-input pr-10',
            selectedCountry ? 'pl-[42px]' : 'pl-4',
            error && 'form-input-error',
            focused && !error && 'border-accent-border',
          )}
        />
        <span
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.55rem] text-muted pointer-events-none transition-transform duration-200"
          style={{ transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)` }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="dropdown-list max-h-[210px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-3 px-3.5 font-body text-[0.85rem] text-muted">
              No country found
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.code}
                onMouseDown={() => handleSelect(c)}
                className={clsx(
                  'dropdown-item flex items-center gap-3',
                  value === c.name && 'dropdown-item-active',
                )}
              >
                <span className="text-[1.05rem] leading-none shrink-0">{c.flag}</span>
                <span className="flex-1">{c.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── EXPERIENCE SELECT ────────────────────────────────────────────────────────
const EXPERIENCES = [
  'Beginner (0-1 yr)',
  'Intermediate (2-3 yrs)',
  'Advanced (3+ yrs)',
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
const DEFAULT_FORM = { name: '', email: '', experience: '', dialCode: '+91', phoneNumber: '', city: '', country: 'India' }

// ─── MODAL ────────────────────────────────────────────────────────────────────
export default function PrebookModal() {
  const { isOpen, close } = usePrebook()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  if (!isOpen) return null

  const update = (field) => (val) => {
    setForm(prev => ({ ...prev, [field]: val }))
    if (errors[field] && validators[field] && !validators[field](val)) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const next = {}
    for (const key of Object.keys(validators)) {
      const err = key === 'country'
        ? validators[key](form[key] ?? '', COUNTRIES)
        : validators[key](form[key] ?? '')
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
      fd.append(GOOGLE_FORM_CONFIG.fields.city, form.city.trim())
      fd.append(GOOGLE_FORM_CONFIG.fields.country, form.country.trim())

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

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] bg-bg/60 backdrop-blur-[10px] overflow-y-auto p-4 sm:p-6 flex animate-fade-in"
    >
      <div className="relative w-full max-w-[520px] m-auto animate-scale-in">

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
                  We've received your request for the 1 Year / Lifetime plan. Our team will contact you shortly.
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
                      1 Year & Lifetime Access
                    </span>
                  </div>
                  <h3 className="font-cond text-[clamp(1.8rem,4vw,2.2rem)] font-black uppercase text-white leading-[1.1] mb-3">
                    Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-green to-accent-lt drop-shadow-[0_0_15px_rgba(13,255,127,0.3)]">Smart AI</span>
                  </h3>
                  <p className="font-body text-muted text-[0.92rem] leading-relaxed max-w-[320px] mx-auto">
                    Please fill out this form and our team will get back to you with the custom payment details.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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
                    <label className="form-label">Trading Experience</label>
                    <ExperienceSelect
                      value={form.experience}
                      onChange={update('experience')}
                      error={errors.experience}
                    />
                    {errors.experience && <p className="form-error">{errors.experience}</p>}
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
                      <label className="form-label">City</label>
                      <input
                        type="text" value={form.city}
                        onChange={(e) => update('city')(e.target.value)}
                        placeholder="Your city"
                        className={clsx('form-input', errors.city && 'form-input-error')}
                      />
                      {errors.city && <p className="form-error">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="form-label">Country</label>
                      <CountrySelect
                        value={form.country}
                        onChange={update('country')}
                        onDialChange={update('dialCode')}
                        error={errors.country}
                      />
                      {errors.country && <p className="form-error">{errors.country}</p>}
                    </div>
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
    </div>
  )
}
