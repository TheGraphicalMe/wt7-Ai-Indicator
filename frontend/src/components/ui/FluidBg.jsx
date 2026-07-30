import { useRef, useEffect, useState } from 'react'

export function FluidBg() {
  const canvasRef = useRef(null)
  const [opacity, setOpacity] = useState(0.85)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false }) // Optimize for solid background
    let animationFrameId
    
    const isMobileDevice = window.innerWidth < 768
    if (isMobileDevice) {
      setOpacity(0.75)
    }

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 }
    let lastMouse = { x: -1000, y: -1000 }
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const newX = e.clientX - rect.left
      const newY = e.clientY - rect.top
      mouse.vx = newX - lastMouse.x
      mouse.vy = newY - lastMouse.y
      mouse.x = newX
      mouse.y = newY
      lastMouse.x = newX
      lastMouse.y = newY
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }
    
    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const newX = e.touches[0].clientX - rect.left
      const newY = e.touches[0].clientY - rect.top
      mouse.vx = newX - lastMouse.x
      mouse.vy = newY - lastMouse.y
      mouse.x = newX
      mouse.y = newY
      lastMouse.x = newX
      lastMouse.y = newY
    }
    
    const handleTouchEnd = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true })
    canvas.addEventListener('touchend', handleTouchEnd)

    const colorPalette = ['#0DFF7F', '#9B6DFF', '#64DCFF', '#5B3FCC']

    // Complex organic flow field to mimic fluid vortexes
    const createVortexField = (x, y, time) => {
      const scale = 0.0015
      let angle = 0
      angle += Math.sin(x * scale + time * 0.2) * 2.5
      angle += Math.cos(y * scale + time * 0.15) * 2.5
      angle += Math.sin((x - y) * scale + time * 0.1) * 1.5
      return angle
    }

    class CandlestickParticle {
      constructor() {
        this.reset(true)
      }

      reset(randomize = false) {
        this.x = randomize ? Math.random() * canvas.width : (Math.random() > 0.5 ? -20 : canvas.width + 20)
        this.y = randomize ? Math.random() * canvas.height : Math.random() * canvas.height
        
        // Spawn randomly across the screen if dead to maintain dense fluid volume
        if (!randomize && Math.random() > 0.5) {
           this.x = Math.random() * canvas.width;
           this.y = Math.random() > 0.5 ? -20 : canvas.height + 20;
        }

        this.vx = 0
        this.vy = 0
        this.speed = Math.random() * 1.5 + 0.5
        
        // Deep parallax layers
        this.z = Math.random() * 0.8 + 0.2
        
        // Candlestick dimensions scaled by depth
        this.bodyWidth = (Math.random() * 4 + 2) * this.z
        this.bodyHeight = (Math.random() * 25 + 10) * this.z
        this.wickHeight = this.bodyHeight + (Math.random() * 15 + 5) * this.z
        
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
        
        this.life = 0
        this.maxLife = Math.random() * 300 + 100
        
        this.alpha = 0
        this.targetAlpha = Math.random() * 0.6 + 0.2
        
        // Slightly random sway phase for organic bobbing
        this.swayPhase = Math.random() * Math.PI * 2
      }

      update(time) {
        const angle = createVortexField(this.x, this.y, time)
        
        const forceX = Math.cos(angle) * this.speed
        const forceY = Math.sin(angle) * this.speed

        // Interactive fluid mouse physics
        let mouseForceX = 0
        let mouseForceY = 0
        if (mouse.x !== -1000) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const radius = 250 // Large interaction zone
          
          if (dist < radius) {
            const force = Math.pow((radius - dist) / radius, 2)
            // Push outwards from mouse and drag along velocity
            const pushAngle = Math.atan2(dy, dx) + Math.PI
            mouseForceX = Math.cos(pushAngle) * force * 3 + (mouse.vx * force * 0.1)
            mouseForceY = Math.sin(pushAngle) * force * 3 + (mouse.vy * force * 0.1)
          }
        }

        // Apply smooth velocity transitions
        this.vx += (forceX + mouseForceX - this.vx) * 0.08
        this.vy += (forceY + mouseForceY - this.vy) * 0.08

        this.x += this.vx
        this.y += this.vy

        // Smooth fade in/out
        this.life++
        if (this.life < 40) {
          this.alpha = (this.life / 40) * this.targetAlpha
        } else if (this.life > this.maxLife - 40) {
          this.alpha = Math.max(0, ((this.maxLife - this.life) / 40) * this.targetAlpha)
        } else {
          this.alpha = this.targetAlpha
        }

        // Out of bounds resets
        if (this.life >= this.maxLife || this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
          this.reset()
        }
      }

      draw(ctx, time) {
        if (this.alpha <= 0) return

        // Organic vertical floating sway (candlesticks retain rigid verticality but bob softly)
        const currentY = this.y + Math.sin(time * 2 + this.swayPhase) * 5 * this.z

        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.color
        ctx.lineWidth = Math.max(0.5, this.bodyWidth / 3)

        // Wick
        ctx.beginPath()
        ctx.moveTo(this.x, currentY - this.wickHeight / 2)
        ctx.lineTo(this.x, currentY + this.wickHeight / 2)
        ctx.stroke()

        // Body
        ctx.fillRect(this.x - this.bodyWidth / 2, currentY - this.bodyHeight / 2, this.bodyWidth, this.bodyHeight)
      }
    }

    // High density particle count for premium fluid feel
    const count = isMobileDevice ? 400 : 1000
    const particles = Array.from({ length: count }, () => new CandlestickParticle())

    let time = 0

    const animate = () => {
      // Clear with dark premium background
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#080B10'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add a subtle dark radial vignette for an expensive, focused depth look
      const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width)
      gradient.addColorStop(0, 'rgba(8, 11, 16, 0)')
      gradient.addColorStop(1, 'rgba(8, 11, 16, 0.95)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Use screen blending to create intensely glowing intersections (bloom effect)
      ctx.globalCompositeOperation = 'screen'

      time += 0.01

      particles.forEach(p => {
        p.update(time)
        p.draw(ctx, time)
      })

      // Decay mouse movement vector
      mouse.vx *= 0.9
      mouse.vy *= 0.9

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0, opacity: opacity, backgroundColor: '#080B10' }}
    />
  )
}


