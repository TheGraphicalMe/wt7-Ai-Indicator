// ─── INTERSECTION OBSERVER HOOK ──────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react'

export function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (options.triggerOnce) observer.unobserve(el)
      } else if (!options.triggerOnce) {
        setInView(false)
      }
    }, options)

    observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [options.threshold, options.triggerOnce, options.rootMargin])

  return [ref, inView]
}
