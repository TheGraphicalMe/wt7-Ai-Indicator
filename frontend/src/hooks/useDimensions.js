// ─── RESPONSIVE DIMENSIONS HOOK ──────────────────────────────────────────────
import { useState, useEffect } from 'react'

function calc() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200

  // Mobile Small (e.g. 320px - 375px)
  if (w <= 375) return {
    cardW: 210,
    cardH: 330,
    radius: 210,
    perspective: 750,
    containerH: 410
  }

  // Mobile Large (e.g. 390px - 480px)
  if (w <= 480) return {
    cardW: 210,
    cardH: 350,
    radius: 240,
    perspective: 850,
    containerH: 440
  }

  // Tablet
  if (w <= 768) return {
    cardW: 260,
    cardH: 360,
    radius: 300,
    perspective: 1000,
    containerH: 460
  }

  // Small Desktop
  if (w <= 1024) return {
    cardW: 260,
    cardH: 330,
    radius: 350,
    perspective: 1100,
    containerH: 460
  }

  // Large Desktop (decreased proportion vs original 280x360+440r)
  return {
    cardW: 270,
    cardH: 330,
    radius: 380,
    perspective: 1200,
    containerH: 480
  }
}

export function useDimensions() {
  const [dims, setDims] = useState(() => calc())

  useEffect(() => {
    const fn = () => setDims(calc())
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return dims
}
