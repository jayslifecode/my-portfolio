'use client'

import { useEffect, useRef, useState } from 'react'

const WORDS = ['Hello', 'Olá', 'Привет', '你好', 'Сайн уу', 'Hola', '안녕하세요']

const BLOCK = 38
const AMPLITUDE = 3
const FREQ = 0.55
const TARGET_FRAMES = 20
const HOLD_MS = 80
const COLOR = '#C84B0C'
const BG = '#0A0A0A'

export default function Preloader() {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<'words' | 'wave' | 'gone'>('words')
  const [coverOpaque, setCoverOpaque] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const wavePhaseRef = useRef<'entering' | 'holding' | 'exiting'>('entering')
  const frontRef = useRef(0)
  const heldRef = useRef(false)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Word cycling — snap swap, no per-character animation
  useEffect(() => {
    if (phase !== 'words') return
    const isLast = wordIndex === WORDS.length - 1
    const hold = wordIndex === 0 ? 900 : isLast ? 700 : 150

    const t = setTimeout(() => {
      if (isLast) {
        setPhase('wave')
      } else {
        setWordIndex(i => i + 1)
      }
    }, hold)

    return () => clearTimeout(t)
  }, [wordIndex, phase])

  // Wave animation
  useEffect(() => {
    if (phase !== 'wave') return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const W = canvas.width
    const H = canvas.height
    const cols = Math.ceil(W / BLOCK) + 2
    const rows = Math.ceil(H / BLOCK) + 1
    const maxFront = cols + AMPLITUDE + 2
    const speed = maxFront / TARGET_FRAMES

    wavePhaseRef.current = 'entering'
    frontRef.current = -(AMPLITUDE + 1)
    heldRef.current = false

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const draw = () => {
      const f = frontRef.current
      const p = wavePhaseRef.current

      if (p === 'entering' || p === 'holding') {
        ctx.fillStyle = BG
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = COLOR
        for (let r = 0; r < rows; r++) {
          const off = Math.sin(r * FREQ) * AMPLITUDE
          for (let c = 0; c < cols; c++) {
            if (c < f - off) {
              ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2)
            }
          }
        }
      } else if (p === 'exiting') {
        ctx.fillStyle = BG
        ctx.fillRect(0, 0, W, H)
        for (let r = 0; r < rows; r++) {
          const off = Math.sin(r * FREQ) * AMPLITUDE
          const clearW = Math.min(Math.max((f - off) * BLOCK, 0), W)
          if (clearW > 0) ctx.clearRect(0, r * BLOCK, clearW, BLOCK)
        }
        ctx.fillStyle = COLOR
        for (let r = 0; r < rows; r++) {
          const off = Math.sin(r * FREQ) * AMPLITUDE
          for (let c = 0; c < cols; c++) {
            if (c > f - off) {
              ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2)
            }
          }
        }
      }

      if (p === 'entering') {
        frontRef.current += speed
        if (frontRef.current >= maxFront) {
          frontRef.current = maxFront
          wavePhaseRef.current = 'holding'
          if (!heldRef.current) {
            heldRef.current = true
            setTimeout(() => {
              wavePhaseRef.current = 'exiting'
              frontRef.current = -(AMPLITUDE + 1)
              setCoverOpaque(false)
            }, HOLD_MS)
          }
        }
      } else if (p === 'exiting') {
        frontRef.current += speed
        if (frontRef.current >= maxFront) {
          ctx.clearRect(0, 0, W, H)
          setPhase('gone')
          return
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: coverOpaque ? BG : 'transparent' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, display: 'block', background: 'transparent' }}
      />

      {/* Keep words in DOM during wave so canvas sweeps over them naturally */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            color: '#fff',
            fontFamily: 'var(--font-oxanium), sans-serif',
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            margin: 0,
            userSelect: 'none',
            opacity: visible && phase === 'words' ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <span style={{
            display: 'block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: COLOR,
            flexShrink: 0,
          }} />
          {WORDS[wordIndex]}
        </p>
      </div>
    </div>
  )
}
