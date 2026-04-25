// ─── ANIMATED PARALLAX BACKGROUND ────────────────────────────────────────────
import { useRef, useEffect } from 'react'

const LAYERS = [
  { count: 35, baseSize: 0.4, sizeRange: 0.6, parallax: 0.25 },
  { count: 35, baseSize: 0.7, sizeRange: 0.8, parallax: 0.55 },
  { count: 35, baseSize: 1.0, sizeRange: 1.0, parallax: 0.85 },
]

function createDots(w, h) {
  const dots = []
  LAYERS.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * layer.sizeRange + layer.baseSize,
        parallaxFactor: layer.parallax,
        phase: Math.random() * Math.PI * 2,
        drift: 0.15 + Math.random() * 0.15,
      })
    }
  })
  return dots
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    let dots = createDots(w, h)
    let targetX = 0, targetY = 0
    let smoothX = 0, smoothY = 0
    let animId

    function onResize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
      dots = createDots(w, h)
    }

    function onMouseMove(e) {
      targetX = (e.clientX - w / 2) / (w / 2)
      targetY = (e.clientY - h / 2) / (h / 2)
    }

    function onTouchMove(e) {
      const t = e.touches[0]
      if (!t) return
      targetX = (t.clientX - w / 2) / (w / 2)
      targetY = (t.clientY - h / 2) / (h / 2)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let time = 0

    function draw() {
      time += 0.01
      smoothX += (targetX - smoothX) * 0.04
      smoothY += (targetY - smoothY) * 0.04

      ctx.clearRect(0, 0, w, h)

      dots.forEach(dot => {
        dot.x += dot.drift * dot.parallaxFactor
        dot.y += (dot.drift * 0.5) * dot.parallaxFactor

        const pulse = 0.2 + 0.15 * Math.sin(time * 1.5 + dot.phase)

        const px = 55 * smoothX * dot.parallaxFactor
        const py = 55 * smoothY * dot.parallaxFactor
        let nx = dot.x + px
        let ny = dot.y + py

        nx = ((nx % w) + w) % w
        ny = ((ny % h) + h) % h

        ctx.fillStyle = `rgba(255,255,255,${pulse})`
        ctx.beginPath()
        ctx.arc(nx, ny, dot.size, 0, Math.PI * 2)
        ctx.fill()

        const glowRadius = dot.size * 2.5
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, glowRadius)
        grad.addColorStop(0, `rgba(255,255,255,${pulse * 0.8})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(nx, ny, glowRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 120% 55% at 50% 100%, rgba(0,255,80,0.10) 0%, rgba(0,255,80,0.04) 35%, transparent 70%)',
            'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(0,200,60,0.07) 0%, transparent 60%)',
          ].join(', '),
        }}
      />
    </div>
  )
}
