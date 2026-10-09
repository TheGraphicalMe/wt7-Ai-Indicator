import { useEffect, useState } from 'react'

// Offer runs through the end of 18 Oct 2026 in the visitor's local time.
const SALE_END = new Date(2026, 9, 19, 0, 0, 0).getTime()

export const SALE_END_LABEL = '18 Oct'

const getTimeLeft = () => {
  const remaining = Math.max(0, SALE_END - Date.now())

  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
    expired: remaining === 0,
  }
}

export default function useSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft())
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return timeLeft
}

export const padTime = (value) => String(value).padStart(2, '0')
