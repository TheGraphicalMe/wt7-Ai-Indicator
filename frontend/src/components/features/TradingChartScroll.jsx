import { useRef, useState, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// ---------------------------------------------------------------------------
// GSAP Plugin Registration
// ---------------------------------------------------------------------------
gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Pixel breakpoint below which the mobile layout is applied */
const MOBILE_BREAKPOINT = 768

/** Scroll distance (px) that drives the entire pinned animation */
const SCROLL_DISTANCE = 3500

/** Background grid style — kept as a constant to avoid inline object recreation */
const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(#0DFF7F 1px, transparent 1px), linear-gradient(90deg, #0DFF7F 1px, transparent 1px)',
  backgroundSize: '40px 40px',
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Deterministic pseudo-random number in [0, 1) derived from a numeric seed.
 * Using Math.sin keeps the output stable across re-renders without storing
 * a random state, which is important for SSR consistency and scroll-driven
 * animations that must be reproducible.
 */
function getPseudoRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ---------------------------------------------------------------------------
// Chart Data Generation
// ---------------------------------------------------------------------------

/**
 * Generates an array of OHLC candlestick objects interpolated between a set
 * of control points. `scaleY` allows the same data to be rendered at
 * different vertical scales (e.g. mobile vs. desktop).
 *
 * @param {number} scaleY - Vertical scale multiplier (1 = desktop, 2.8 = mobile)
 * @returns {Array<{x, open, close, high, low, isUp}>}
 */
function generateCandles(scaleY) {
  // Control points that define the overall price path shape
  const controlPoints = [
    { x: 50, y: 400 * scaleY },
    { x: 150, y: 200 * scaleY },
    { x: 220, y: 280 * scaleY },
    { x: 280, y: 190 * scaleY },
    { x: 380, y: 380 * scaleY },
    { x: 500, y: 220 * scaleY },
    { x: 620, y: 420 * scaleY },
    { x: 720, y: 270 * scaleY },
    { x: 820, y: 460 * scaleY },
    { x: 950, y: 150 * scaleY },
  ]

  // Tighter spacing produces a more realistic-looking chart
  const CANDLE_SPACING = 12
  const BASE_VOLATILITY = scaleY > 1 ? 40 : 45
  const WICK_MULTIPLIER = 20 * scaleY

  const candles = []

  for (let i = 0; i < controlPoints.length - 1; i++) {
    const p1 = controlPoints[i]
    const p2 = controlPoints[i + 1]
    const numCandles = Math.floor(Math.abs(p2.x - p1.x) / CANDLE_SPACING)

    let currentY = p1.y

    for (let j = 0; j < numCandles; j++) {
      const x = p1.x + j * CANDLE_SPACING
      const stepsLeft = numCandles - j
      const yDistanceToTarget = p2.y - currentY
      const baselineStep = yDistanceToTarget / stepsLeft

      // Dampen volatility near the target point so segments connect smoothly
      const dampening = Math.min(1, stepsLeft / 3)
      const volatility = BASE_VOLATILITY * scaleY * dampening
      const rand = getPseudoRandom(x) * 2 - 1 // [-1, 1]

      // Force the last candle in each segment to land exactly on the control point
      let close = j === numCandles - 1
        ? p2.y
        : currentY + baselineStep + rand * volatility

      let open = currentY
      // In SVG coordinates y increases downward, so close < open means price rose
      let isUp = close < open

      const bodyTop = Math.min(open, close)
      const bodyBottom = Math.max(open, close)

      let high = bodyTop - Math.abs(getPseudoRandom(x + 1)) * WICK_MULTIPLIER
      let low = bodyBottom + Math.abs(getPseudoRandom(x + 2)) * WICK_MULTIPLIER

      // Textbook wick sweep at the BSL peak (x ≈ 280)
      if (p2.x === 280 && j === numCandles - 1) {
        high = 160 * scaleY
      }

      // Hard-coded Bearish FVG candle overrides to ensure textbook gap without rendering duplicates
      if (x === 500) {
        open = 224 * scaleY
        close = 244 * scaleY
        high = 218 * scaleY
        low = 252 * scaleY
        isUp = false
      } else if (x === 512) {
        open = 244 * scaleY
        close = 300 * scaleY
        high = 236 * scaleY
        low = 310 * scaleY
        isUp = false
      } else if (x === 524) {
        open = 300 * scaleY
        close = 318 * scaleY
        high = 290 * scaleY
        low = 327 * scaleY
        isUp = false
      }

      candles.push({ x, open, close, high, low, isUp })
      currentY = close
    }
  }

  return candles
}



// ---------------------------------------------------------------------------
// Annotation Builder
// ---------------------------------------------------------------------------

/**
 * Returns all annotation positions and labels for the chart, calculated from
 * `isMobile` and `scaleY` so they never drift out of sync with the SVG.
 *
 * @param {boolean} isMobile
 * @param {number}  scaleY
 */
function buildAnnotations(isMobile, scaleY) {
  return {
    bsl: {
      text: 'Liquidity Pool',
      x: isMobile ? 20 : 108,
      y: 182 * scaleY - (isMobile ? 45 : 19),
    },
    sweep: {
      text: 'SWEEP',
      x: 280,
      y: 150 * scaleY - (isMobile ? 25 : 10),
    },
    bearishOb: {
      text: 'BEARISH OB',
      x: isMobile ? 410 : 390,
      y: 170 * scaleY + (isMobile ? 30 : 17),
    },
    mitigated: {
      text: 'MITIGATED',
      x: isMobile ? 530 : 515,
      y: 220 * scaleY - (isMobile ? 65 : 25),
    },
    trendline: {
      text: 'DYNAMIC TRENDLINE',
      x: 700,
      y: 270 * scaleY - (isMobile ? 60 : 30),
    },
    fvg: {
      /*
       * Bearish FVG gap coordinates (derived from getFVGCandles above):
       *   Top edge    (SVG-y) = Candle A's low wick  = 252 * scaleY
       *   Bottom edge (SVG-y) = Candle C's high wick = 290 * scaleY
       *   Gap height  = 38 * scaleY
       *
       * Extension lines reach to x=750, framing the retest candle at x=720 (y=270).
       * y=270 sits inside [252, 290] → bearish FVG acted as resistance.
       */
      text: 'FVG',
      x: 624,                                        // horizontally centered on the FVG box
      y: 271 * scaleY,                               // vertically centered inside the FVG box
      rectX:       498,
      rectY:       252 * scaleY,                     // top edge (Candle A wick bottom)
      rectWidth:   42,
      rectHeight:  38 * scaleY,                      // 290 - 252 = 38 SVG px (desktop)
      extendToX:   750,                              // dashed extension lines reach here
    },
  }
}

// ---------------------------------------------------------------------------
// SVG Font-size Map
// ---------------------------------------------------------------------------

/**
 * Returns a map of SVG text font sizes appropriate for the current breakpoint.
 * Keeping them together prevents inconsistencies when adding future labels.
 *
 * @param {boolean} isMobile
 */
function buildFontSizes(isMobile) {
  return {
    bsl:       isMobile ? 28 : 14,
    sweep:     isMobile ? 24 : 12,
    ob:        isMobile ? 28 : 12,
    mitigated: isMobile ? 24 : 11,
    trendline: isMobile ? 28 : 12,
    fvg:       isMobile ? 26 : 12,
    choch:     isMobile ? 24 : 11,  // reserved for future CHoCH labels
  }
}

// ---------------------------------------------------------------------------
// Dashboard Table Data
// ---------------------------------------------------------------------------

/** Static rows for the Smart AI indicator dashboard panel */
const DASHBOARD_ROWS = [
  { label: 'Daily Trend', value: 'Bullish', color: 'text-[#0DFF7F]' },
  { label: '12H Trend', value: 'Bullish', color: 'text-[#0DFF7F]' },
  { label: '4H Trend', value: 'Bullish', color: 'text-[#0DFF7F]' },
  { label: '1H Trend', value: 'Bullish', color: 'text-[#0DFF7F]' },
  { label: '30min Trend', value: 'Bearish', color: 'text-[#FF3366]' },
  { label: '15min Trend', value: 'Bearish', color: 'text-[#FF3366]' },
  { label: '5min Trend', value: 'Bearish', color: 'text-[#FF3366]' },
  { label: '1min Trend', value: 'Bullish', color: 'text-[#0DFF7F]' },
  { label: 'Moon Phase', value: '🌕 Full Moon', color: 'text-yellow-400' },
  { label: 'Signal Status', value: 'Waiting', color: 'text-gray-300' },
  { label: 'Active PL [1M]', value: 'None', color: 'text-gray-300' },
]

// ---------------------------------------------------------------------------
// Shared SVG text props — avoids repeating the same stroke outline trick
// ---------------------------------------------------------------------------

/**
 * Returns common SVG `<text>` props for the annotation stroke-outline effect.
 * Spread these onto every annotation `<text>` element.
 *
 * @param {boolean} isMobile
 */
function svgTextOutlineProps(isMobile) {
  return {
    stroke: '#080b10',
    strokeWidth: isMobile ? 6 : 4,
    paintOrder: 'stroke',
    strokeLinejoin: 'round',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TradingChartScroll() {
  // ------------------------------------------------------------------
  // Refs
  // ------------------------------------------------------------------

  const containerRef = useRef(null)
  const clipRectRef = useRef(null)
  const chartGroupRef = useRef(null)
  const tableRef = useRef(null)

  // Annotation group refs — controlled individually by the GSAP timeline
  const liqRef       = useRef(null)
  const sweepRef     = useRef(null)
  const obRef        = useRef(null)
  const mitigatedRef = useRef(null)
  const fvgRef       = useRef(null)
  const tlRef        = useRef(null)

  // Overlaid text panel refs
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const text3Ref = useRef(null)
  const text4Ref = useRef(null)  // Bear FVG panel
  const text5Ref = useRef(null)  // Dynamic Trendline panel

  // ------------------------------------------------------------------
  // Responsive state
  // ------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ------------------------------------------------------------------
  // Derived chart data — recomputed only when `isMobile` changes
  // ------------------------------------------------------------------

  const scaleY      = isMobile ? 2.8 : 1
  const candles     = useMemo(() => generateCandles(scaleY), [scaleY])
  const annotations = useMemo(() => buildAnnotations(isMobile, scaleY), [isMobile, scaleY])
  const fontSize    = useMemo(() => buildFontSizes(isMobile), [isMobile])
  const textOutline = useMemo(() => svgTextOutlineProps(isMobile), [isMobile])

  const SVG_HEIGHT = 500 * scaleY
  const CANDLE_BODY_WIDTH = isMobile ? 8 : 6
  const CANDLE_WICK_WIDTH = isMobile ? 2 : 1.5

  // ------------------------------------------------------------------
  // GSAP scroll-driven animation
  // Re-runs whenever `isMobile` changes so metrics stay accurate after
  // a resize crosses the breakpoint.
  // ------------------------------------------------------------------

  useGSAP(() => {
    // ── Initial states ──────────────────────────────────────────────
    gsap.set(clipRectRef.current,   { attr: { width: 50 } })
    gsap.set([liqRef.current, sweepRef.current, obRef.current, mitigatedRef.current, fvgRef.current, tlRef.current], { opacity: 0 })
    gsap.set([text2Ref.current, text3Ref.current, text4Ref.current, text5Ref.current], { opacity: 0, y: 50 })
    gsap.set(tableRef.current,      { opacity: 0, x: 50 })
    gsap.set(chartGroupRef.current, { scale: 1, x: 0, y: 0 })

    // ── Master timeline (pinned, scroll-scrubbed) ────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start:   'top top',
        end:     `+=${SCROLL_DISTANCE}`,
        pin:     true,
        scrub:   1,
      },
      defaults: { ease: 'none' },
    })

    // Phase 1 [0% → 25%] — Draw chart to the liquidity sweep (x ≈ 280)
    tl.to(clipRectRef.current, { attr: { width: 320 }, duration: 1 }, 0)
      .to(tableRef.current,    { opacity: 1, x: 0,   duration: 1 }, 0)
      .to(text1Ref.current,    { opacity: 0, y: -50, duration: 0.5 }, 0.5)
      .to(text2Ref.current,    { opacity: 1, y: 0,   duration: 0.5 }, 0.5)
      .to(liqRef.current,      { opacity: 1,          duration: 0.5 }, 0.5)
      .to(sweepRef.current,    { opacity: 1,          duration: 0.3 }, 0.8)

    // Phase 2 [25% → 50%] — Draw through OB mitigation + FVG formation (x ≈ 560)
    //   Order Block (obRef) is marked immediately as it is created by the sweep/drop at x ≈ 280-320.
    //   MITIGATED label is revealed when the price actually mitigates the OB at x ≈ 500 (scroll ≈ 1.75).
    //   Fair Value Gap (fvgRef) is marked as soon as the impulse drop candles complete at x ≈ 524.
    tl.to(clipRectRef.current, { attr: { width: 560 }, duration: 1 }, 1)
      .to(text2Ref.current,    { opacity: 0, y: -50, duration: 0.5 }, 1.0)
      .to(text3Ref.current,    { opacity: 1, y: 0,   duration: 0.5 }, 1.0)
      .to(obRef.current,       { opacity: 1,          duration: 0.5 }, 1.0)
      .to(mitigatedRef.current, { opacity: 1,          duration: 0.2 }, 1.75)
      .to(fvgRef.current,      { opacity: 1,          duration: 0.3 }, 1.85)

    // Phase 3 [50% → 75%] — Reveal FVG retest (clip to x ≈ 755, showing x=720 candle)
    //   The FVG text description panels are swapped as price enters the retest phase.
    tl.to(clipRectRef.current, { attr: { width: 755 }, duration: 1 }, 2)
      .to(text3Ref.current,    { opacity: 0, y: -50,  duration: 0.5 }, 2.0)
      .to(text4Ref.current,    { opacity: 1, y: 0,    duration: 0.5 }, 2.0)

    // Phase 4 [75% → 100%] — Complete the chart: FVG rejection + trendline overlay
    tl.to(clipRectRef.current, { attr: { width: 1000 }, duration: 1 }, 3)
      .to(text4Ref.current,    { opacity: 0, y: -50,   duration: 0.5 }, 3.0)
      .to(text5Ref.current,    { opacity: 1, y: 0,     duration: 0.5 }, 3.0)
      .to(tlRef.current,       { opacity: 1,            duration: 0.5 }, 3.0)

  }, { scope: containerRef, dependencies: [isMobile] })

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-transparent z-20 overflow-hidden"
    >
      {/* ── Background Grid ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={GRID_STYLE}
      />

      {/* ── Smart AI Dashboard Panel ─────────────────────────────────── */}
      <div
        ref={tableRef}
        className="absolute top-3 right-3 md:top-2 md:right-2 w-[155px] md:w-[180px] bg-[#0A0A0A]/90 backdrop-blur-md border border-[#F97316] rounded-sm shadow-xl overflow-hidden z-30"
      >
        {/* Panel header */}
        <div className="grid grid-cols-2 divide-x divide-[#F97316] border-b border-[#F97316] text-center font-cond font-bold text-[#F97316] bg-[#F97316]/10 text-[10px]">
          <div className="py-1 tracking-wider">Smart AI 🔥</div>
          <div className="py-1 tracking-wider">Active</div>
        </div>

        {/* Panel rows */}
        {DASHBOARD_ROWS.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-2 divide-x divide-[#F97316] border-b border-[#F97316]/50 last:border-b-0 text-[8.5px] md:text-[9px] font-monospace text-center bg-[#050505]/80"
          >
            <div className="py-1 text-[#3B82F6] font-semibold">{row.label}</div>
            <div className={`py-1 font-bold ${row.color}`}>{row.value}</div>
          </div>
        ))}
      </div>

      {/* ── Text Overlay Panels (stacked at the same position, swapped by GSAP) ── */}
      <div className="absolute top-[5%] md:top-[3%] left-[2.5%] md:left-[1.5%] z-20 w-[calc(100%-180px)] md:w-[600px] pointer-events-none">

        {/* Panel 1 — Intro */}
        <div ref={text1Ref} className="absolute top-0 left-0 w-full">
          <h3 className="font-cond font-bold text-4xl md:text-5xl text-white tracking-widest uppercase mb-1 sm:mb-2 leading-tight md:leading-normal">
            Smart<br className="md:hidden" /> Analysis
          </h3>
          <p className="font-body text-white/70 text-sm max-w-[280px] md:max-w-[400px]">
            Scroll to see how our AI breaks down market structure in real-time.
          </p>
        </div>

        {/* Panel 2 — Liquidity Sweep */}
        <div ref={text2Ref} className="absolute top-0 left-0 w-full">
          <h3 className="font-cond font-bold text-4xl md:text-5xl text-[#0DFF7F] tracking-widest uppercase mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(13,255,127,0.5)] leading-tight md:leading-normal">
            Liquidity<br className="md:hidden" /> Sweep
          </h3>
          <p className="font-body text-white/70 text-sm max-w-[280px] md:max-w-[400px]">
            Automatically detects when stops are hunted before a major reversal.
          </p>
        </div>

        {/* Panel 3 — Order Blocks */}
        <div ref={text3Ref} className="absolute top-0 left-0 w-full">
          <h3 className="font-cond font-bold text-4xl md:text-5xl text-[#9B6DFF] tracking-widest uppercase mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(155,109,255,0.5)] leading-tight md:leading-normal">
            Order<br className="md:hidden" /> Blocks
          </h3>
          <p className="font-body text-white/70 text-sm max-w-[280px] md:max-w-[400px]">
            Highlights high-probability institutional supply and demand zones.
          </p>
        </div>

        {/* Panel 4 — Bearish Fair Value Gap (shown in Phase 3: FVG retest visible) */}
        <div ref={text4Ref} className="absolute top-0 left-0 w-full">
          <h3 className="font-cond font-bold text-4xl md:text-5xl text-[#FF3366] tracking-widest uppercase mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(255,51,102,0.5)] leading-tight md:leading-normal">
            Fair Value<br className="md:hidden" /> Gap
          </h3>
          <p className="font-body text-white/70 text-sm max-w-[280px] md:max-w-[400px]">
            Bearish imbalance zones where price snaps back and gets rejected — confirming the trend.
          </p>
        </div>

        {/* Panel 5 — Dynamic Trendline (shown in Phase 4: full chart visible) */}
        <div ref={text5Ref} className="absolute top-0 left-0 w-full">
          <h3 className="font-cond font-bold text-4xl md:text-5xl text-[#0DFF7F] tracking-widest uppercase mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(13,255,127,0.5)] leading-tight md:leading-normal">
            Dynamic<br className="md:hidden" /> Trendline
          </h3>
          <p className="font-body text-white/70 text-sm max-w-[280px] md:max-w-[400px]">
            Real-time algorithmic trend detection mapping out shifts in market structure.
          </p>
        </div>

      </div>

      {/* ── SVG Chart Container ───────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full flex items-end md:items-center justify-center md:justify-start pointer-events-none">
        <div className="relative w-full max-w-[1200px] h-[92%] md:h-auto md:aspect-[2/1] md:-translate-x-12">

          <svg
            viewBox={`0 0 1000 ${SVG_HEIGHT}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full md:h-auto drop-shadow-[0_0_15px_rgba(13,255,127,0.2)]"
          >
            <defs>
              {/* Gradient used for the price line (currently unused but kept for future use) */}
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0DFF7F" />
                <stop offset="0.5" stopColor="#9B6DFF" />
                <stop offset="1" stopColor="#0DFF7F" />
              </linearGradient>

              {/* Clip path that grows as the timeline scrubs */}
              <clipPath id="chartClip">
                <rect ref={clipRectRef} x="0" y="0" width="0" height={SVG_HEIGHT} />
              </clipPath>
            </defs>

            <g ref={chartGroupRef}>

              {/* ── Zone 1: Liquidity Sweep ─────────────────────────── */}
              <g ref={liqRef}>
                {/* Dashed BSL line at the first swing high */}
                <line
                  x1="120" y1={182 * scaleY}
                  x2="320" y2={182 * scaleY}
                  stroke="#FF3366" strokeWidth="2" strokeDasharray="4 4"
                />

                {/* "Liquidity Pool" label */}
                <text
                  x={annotations.bsl.x}
                  y={annotations.bsl.y}
                  fill="#FF3366"
                  fontSize={fontSize.bsl}
                  {...textOutline}
                >
                  {annotations.bsl.text}
                </text>
              </g>

              {/* Sweep label & arrow — shown when the price actually sweeps at x=280 */}
              <g ref={sweepRef}>
                {/* Up-arrow marking the sweep wick */}
                <path
                  d={`M 270 ${170 * scaleY} L 280 ${150 * scaleY} L 290 ${170 * scaleY}`}
                  stroke="#FF3366" strokeWidth="2" fill="none"
                />

                {/* "SWEEP" label */}
                <text
                  x={annotations.sweep.x}
                  y={annotations.sweep.y}
                  textAnchor="middle"
                  fill="#FF3366"
                  fontSize={fontSize.sweep}
                  {...textOutline}
                >
                  {annotations.sweep.text}
                </text>
              </g>

              {/* ── Zone 2: Order Block ─────────────────────────────── */}
              <g ref={obRef}>
                {/* OB rectangle */}
                <rect
                  x="250" y={170 * scaleY}
                  width="280" height={50 * scaleY}
                  fill="#9B6DFF" fillOpacity="0.15"
                  stroke="#9B6DFF" strokeWidth="1"
                />

                {/* "BEARISH OB" label */}
                <text
                  x={annotations.bearishOb.x}
                  y={annotations.bearishOb.y}
                  textAnchor="middle"
                  fill="#9B6DFF"
                  fontSize={fontSize.ob}
                  {...textOutline}
                >
                  {annotations.bearishOb.text}
                </text>
              </g>

              {/* MITIGATED Label — shown only when mitigation actually occurs */}
              <g ref={mitigatedRef}>
                <text
                  x={annotations.mitigated.x}
                  y={annotations.mitigated.y}
                  textAnchor="middle"
                  fill="#9B6DFF"
                  fontSize={fontSize.mitigated}
                  {...textOutline}
                >
                  {annotations.mitigated.text}
                </text>
              </g>

              {/* ── Zone 3: Dynamic Trendline ───────────────────────── */}
              <g ref={tlRef}>
                {/* Trendline ribbon — rendered as two overlapping paths for a glow effect */}
                <path
                  d={`M 260 ${180 * scaleY} C 350 ${185 * scaleY}, 420 ${215 * scaleY}, 500 ${220 * scaleY} C 600 ${225 * scaleY}, 650 ${265 * scaleY}, 720 ${270 * scaleY} C 790 ${275 * scaleY}, 820 ${265 * scaleY}, 850 ${267 * scaleY}`}
                  stroke="#0DFF7F" strokeWidth="2" fill="none"
                />
                <path
                  d={`M 260 ${180 * scaleY} C 350 ${185 * scaleY}, 420 ${215 * scaleY}, 500 ${220 * scaleY} C 600 ${225 * scaleY}, 650 ${265 * scaleY}, 720 ${270 * scaleY} C 790 ${275 * scaleY}, 820 ${265 * scaleY}, 850 ${267 * scaleY}`}
                  stroke="#0DFF7F" strokeWidth="8" strokeOpacity="0.2" fill="none"
                />

                {/* "DYNAMIC TRENDLINE" label */}
                <text
                  x={annotations.trendline.x}
                  y={annotations.trendline.y}
                  textAnchor="middle"
                  fill="#0DFF7F"
                  fontSize={fontSize.trendline}
                  {...textOutline}
                >
                  {annotations.trendline.text}
                </text>
              </g>

              {/* ── Zone 4: Bearish Fair Value Gap (FVG) ────────────── */}
              <g ref={fvgRef}>
                {/*
                  Bearish FVG formed at x=500–524 (the large impulse candle at the
                  start of the OB → price-drop move).

                  Gap boundaries (desktop, scaleY=1):
                    Top edge    (SVG-y) = Candle A's low wick  = 252  (higher-price boundary)
                    Bottom edge (SVG-y) = Candle C's high wick = 290  (lower-price boundary)

                  The natural chart recovery at x=720 returns to y=270,
                  which sits inside [252, 290] → FVG acted as resistance.
                  Price then falls to x=820 (y=460) confirming the rejection.

                  Extension lines reach to x=755 so the retest candle is clearly
                  framed inside the gap zone.
                */}

                {/* FVG complete block — filled in red like the order block */}
                <rect
                  x={annotations.fvg.rectX}
                  y={annotations.fvg.rectY}
                  width={annotations.fvg.extendToX - annotations.fvg.rectX}
                  height={annotations.fvg.rectHeight}
                  fill="#FF3366"
                  fillOpacity="0.15"
                  stroke="#FF3366"
                  strokeWidth="1"
                />

                {/* 50% equilibrium midline — institutions frequently target this level */}
                <line
                  x1={annotations.fvg.rectX}
                  y1={annotations.fvg.rectY + annotations.fvg.rectHeight / 2}
                  x2={annotations.fvg.extendToX}
                  y2={annotations.fvg.rectY + annotations.fvg.rectHeight / 2}
                  stroke="#FF3366"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                  strokeOpacity="0.4"
                />

                {/* "FVG" label — positioned in the center of the rect */}
                <text
                  x={annotations.fvg.x}
                  y={annotations.fvg.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#FF3366"
                  fontSize={fontSize.fvg}
                  {...textOutline}
                >
                  {annotations.fvg.text}
                </text>
              </g>

              {/* ── Candlesticks (progressively revealed by clipPath) ── */}
              <g clipPath="url(#chartClip)">
                {/* Auto-generated candles */}
                {candles.map((c, i) => (
                  <g key={`candle-${i}`}>
                    {/* Wick */}
                    <line
                      x1={c.x} y1={c.high}
                      x2={c.x} y2={c.low}
                      stroke={c.isUp ? '#0DFF7F' : '#FF3366'}
                      strokeWidth={CANDLE_WICK_WIDTH}
                    />
                    {/* Body */}
                    <rect
                      x={c.x - CANDLE_BODY_WIDTH / 2}
                      y={Math.min(c.open, c.close)}
                      width={CANDLE_BODY_WIDTH}
                      height={Math.max(2, Math.abs(c.open - c.close))}
                      fill={c.isUp ? '#0DFF7F' : '#FF3366'}
                      stroke={c.isUp ? '#0DFF7F' : '#FF3366'}
                      strokeWidth="1"
                    />
                  </g>
                ))}
              </g>

            </g>
          </svg>

        </div>
      </div>
    </section>
  )
}
