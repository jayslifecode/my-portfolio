'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const BLOCK = 38
const AMPLITUDE = 3
const FREQ = 0.55
const TARGET_FRAMES = 20  // transition always takes ~20 frames regardless of screen width
const HOLD_MS = 80   // hold at full-cover while new page renders
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
  const hrefRef = useRef(href)
  const onCompleteRef = useRef(onComplete)
  const routerRef = useRef<ReturnType<typeof useRouter> | null>(null)
  const [active, setActive] = useState(false)
  const router = useRouter()

  useEffect(() => { hrefRef.current = href }, [href])
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])
  useEffect(() => { routerRef.current = router }, [router])

  useEffect(() => {
    if (isTransitioning && phaseRef.current === 'idle') {
      phaseRef.current = 'entering'
      frontRef.current = -(AMPLITUDE + 1)
      heldRef.current = false
      // Pre-fill canvas black immediately — canvas is always in DOM so ref is valid.
      // This eliminates the blank frame between state update and first rAF paint.
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const ctx = canvas.getContext('2d')
        if (ctx) { ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height) }
      }
      setActive(true)
    }
  }, [isTransitioning])

  // Navigate immediately when transition starts so the new page renders
  // during the full entering wave (~550ms). By exit time it's ready to reveal.
  useEffect(() => {
    if (active && hrefRef.current) {
      routerRef.current?.push(hrefRef.current)
    }
  }, [active])

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

    // Fill immediately so there is no transparent frame between canvas mount and first rAF.
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const draw = () => {
      const f = frontRef.current
      const p = phaseRef.current

      // --- draw ---
      if (p === 'entering' || p === 'holding') {
        // Void background so old page / hover effects never bleed through.
        ctx.fillStyle = BG
        ctx.fillRect(0, 0, W, H)
        for (let r = 0; r < rows; r++) {
          const off = Math.sin(r * FREQ) * AMPLITUDE
          for (let c = 0; c < cols; c++) {
            if (c < f - off) {
              ctx.fillStyle = COLOR
              ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2)
            }
          }
        }
      } else if (p === 'exiting') {
        // BG fill covers everything so old-page content can't bleed through block gaps.
        // Then per-row clearRect reveals the new page only in the already-swept area.
        ctx.fillStyle = BG
        ctx.fillRect(0, 0, W, H)
        for (let r = 0; r < rows; r++) {
          const off = Math.sin(r * FREQ) * AMPLITUDE
          const clearW = Math.min(Math.max((f - off) * BLOCK, 0), W)
          if (clearW > 0) ctx.clearRect(0, r * BLOCK, clearW, BLOCK)
          for (let c = 0; c < cols; c++) {
            if (c > f - off) {
              ctx.fillStyle = COLOR
              ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2)
            }
          }
        }
      }

      // --- advance state ---
      if (p === 'entering') {
        frontRef.current += speed
        if (frontRef.current >= maxFront) {
          frontRef.current = maxFront
          phaseRef.current = 'holding'
          if (!heldRef.current) {
            heldRef.current = true
            // After hold, flip to exit — rAF loop is still running so it
            // picks up the phase change automatically next frame.
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
