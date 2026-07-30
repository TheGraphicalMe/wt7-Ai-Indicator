// ─── TEXT REVEAL COMPONENTS ────────────────────────────────────────────────
import clsx from 'clsx'
import { useInView } from '@/hooks/useInView'

// ─── BLUR REVEAL — headline lines ────────────────────────────────────────────
export function BlurReveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <span
      ref={ref}
      className={clsx(
        'inline-block origin-center',
        inView ? 'animate-blur-reveal-hero' : 'opacity-0',
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  )
}

// ─── BLUR WORD REVEAL — subtext ──────────────────────────────────────────────
export function BlurWordReveal({ text, baseDelay = 0.55, stagger = 0.035, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const words = text.split(' ')

  return (
    <span ref={ref} className={clsx('inline-block', className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className={clsx(
            'inline-block origin-center',
            inView ? 'animate-blur-reveal-soft' : 'opacity-0'
          )}
          style={{ animationDelay: `${baseDelay + i * stagger}s` }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  )
}
