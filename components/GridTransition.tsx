'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const BLOCK = 38
const AMPLITUDE = 3
const FREQ = 0.55
const TARGET_FRAMES = 20
const HOLD_MS = 80
const COLOR = '#C84B0C'
const BG = '#0A0A0A'

interface GridTransitionProps {
  isTransitioning: boolean
  href: string
  onComplete: () => void
}

export default function GridTransition({ isTransitioning, href, onComplete }: GridTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const phaseRef = useRef<'idle' | 'entering' | 'holding' | 'exiting'>('idle')
  const frontRef = useRef(0)
  const heldRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const [active, setActive] = useState(false)
  const router = useRouter()

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    if (isTransitioning && phaseRef.current === 'idle') {
      phaseRef.current = 'entering'
      frontRef.current = -(AMPLITUDE + 1)
      heldRef.current = false

      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const ctx = canvas.getContext('2d')
        if (ctx) { ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height) }
      }

      // Navigate immediately so the new page renders during the wave animation.
      // Called here directly — not via a ref — so it can never race or be stale.
      if (href) router.push(href)

      setActive(true)
    }
  }, [isTransitioning, href, router])

  useEffect(() => {
    if (!active) return
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

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const draw = () => {
      const f = frontRef.current
      const p = phaseRef.current

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
          phaseRef.current = 'holding'
          if (!heldRef.current) {
            heldRef.current = true
            setTimeout(() => {
              phaseRef.current = 'exiting'
              frontRef.current = -(AMPLITUDE + 1)
            }, HOLD_MS)
          }
        }
      } else if (p === 'exiting') {
        frontRef.current += speed
        if (frontRef.current >= maxFront) {
          phaseRef.current = 'idle'
          ctx.clearRect(0, 0, W, H)
          setActive(false)
          onCompleteRef.current()
          return
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        display: active ? 'block' : 'none',
      }}
    />
  )
}
