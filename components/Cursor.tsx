'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '@/hooks/useBreakpoint'

type CursorState = 'default' | 'hover' | 'click' | 'drag' | 'none'

const EMBER = '#C84B0C'
const HOVER_COLOR = '#ffffff'
const HOVER_DIM = 'rgba(255,255,255,0.4)'

export default function Cursor() {
  const isTouch = useIsTouch()
  const dotRef = useRef<HTMLDivElement>(null)
  const reticleRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const mouse = useRef({ x: -200, y: -200 })
  const reticlePos = useRef({ x: -200, y: -200 })
  const raf = useRef<number>(0)

  const [state, setState] = useState<CursorState>('default')
  const stateRef = useRef<CursorState>('default')

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const setStateSafe = (s: CursorState) => {
      stateRef.current = s
      setState(s)
    }

    const onMouseDown = () => setStateSafe('click')

    const onMouseUp = () => {
      const el = document.elementFromPoint(mouse.current.x, mouse.current.y) as Element | null
      if (el?.closest('[data-cursor="none"]')) return setStateSafe('none')
      if (el?.closest('[data-cursor="drag"]')) return setStateSafe('drag')
      if (el?.closest('a, button, [data-cursor="pointer"]')) return setStateSafe('hover')
      setStateSafe('default')
    }

    const onMouseOver = (e: MouseEvent) => {
      if (stateRef.current === 'click') return
      const t = e.target as Element
      if (t.closest('[data-cursor="none"]')) return setStateSafe('none')
      if (t.closest('[data-cursor="drag"]')) return setStateSafe('drag')
      if (t.closest('a, button, [data-cursor="pointer"]')) return setStateSafe('hover')
    }

    const onMouseOut = (e: MouseEvent) => {
      if (stateRef.current === 'click') return
      const t = e.target as Element
      if (
        t.closest('[data-cursor="none"]') ||
        t.closest('[data-cursor="drag"]') ||
        t.closest('a, button, [data-cursor="pointer"]')
      ) {
        setStateSafe('default')
      }
    }

    const animate = () => {
      const ease = stateRef.current === 'drag' ? 0.08 : 0.1
      reticlePos.current.x += (mouse.current.x - reticlePos.current.x) * ease
      reticlePos.current.y += (mouse.current.y - reticlePos.current.y) * ease
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate(${reticlePos.current.x}px, ${reticlePos.current.y}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  if (isTouch) return null

  const isHover = state === 'hover'
  const isClick = state === 'click'
  const isDrag = state === 'drag'
  const isNone = state === 'none'

  const size = isClick ? 28 : isHover ? 52 : isDrag ? 56 : 36
  const half = size / 2
  const cLen = isHover ? 12 : isDrag ? 10 : 8
  const cThick = 1.5
  const bracketRotate = isHover ? 45 : 0

  return (
    <>
      {/* Dot — instant snap */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHover || isDrag ? 0 : '4px',
          height: isHover || isDrag ? 0 : '4px',
          background: EMBER,
          pointerEvents: 'none',
          zIndex: 10002,
          marginTop: '-2px',
          marginLeft: '-2px',
          opacity: isClick || isNone ? 0 : 1,
          boxShadow: `0 0 6px 2px rgba(200,75,12,0.6)`,
          transition: 'width 120ms ease, height 120ms ease, opacity 80ms ease',
          willChange: 'transform',
        }}
      />

      {/* Glow — instant snap */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHover || isDrag ? '80px' : '32px',
          height: isHover || isDrag ? '80px' : '32px',
          marginTop: isHover || isDrag ? '-40px' : '-16px',
          marginLeft: isHover || isDrag ? '-40px' : '-16px',
          background: isHover
            ? 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)'
            : isDrag
            ? 'radial-gradient(circle, rgba(200,75,12,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(200,75,12,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isNone ? 0 : 1,
          transition: 'width 220ms ease, height 220ms ease, margin 220ms ease, opacity 150ms ease',
          willChange: 'transform',
        }}
      />

      {/* Reticle — lagged */}
      <div
        ref={reticleRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          marginTop: `-${half}px`,
          marginLeft: `-${half}px`,
          pointerEvents: 'none',
          zIndex: 10001,
          opacity: isNone ? 0 : 1,
          willChange: 'transform',
          transition: 'margin 200ms ease, opacity 150ms ease',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          style={{ display: 'block', overflow: 'visible', transition: 'width 200ms ease, height 200ms ease' }}
        >
          {/* ── HOVER: spinning dashed orbit ring (outer) ── */}
          {isHover && (
            <circle
              cx={half}
              cy={half}
              r={half - 2}
              stroke={HOVER_COLOR}
              strokeWidth={1}
              strokeDasharray="4 10"
              fill="none"
              opacity={0.5}
              style={{
                transformOrigin: `${half}px ${half}px`,
                transformBox: 'fill-box',
                animation: 'cursor-spin 3s linear infinite',
              }}
            />
          )}

          {/* ── HOVER: counter-spinning inner ring ── */}
          {isHover && (
            <circle
              cx={half}
              cy={half}
              r={half - 8}
              stroke={HOVER_DIM}
              strokeWidth={0.75}
              strokeDasharray="2 14"
              fill="none"
              opacity={0.4}
              style={{
                transformOrigin: `${half}px ${half}px`,
                transformBox: 'fill-box',
                animation: 'cursor-spin-rev 2s linear infinite',
              }}
            />
          )}

          {/* ── DRAG: orbit ring ── */}
          {isDrag && (
            <circle
              cx={half}
              cy={half}
              r={half - 2}
              stroke={EMBER}
              strokeWidth={0.75}
              strokeDasharray="6 6"
              fill="none"
              opacity={0.3}
              style={{
                transformOrigin: `${half}px ${half}px`,
                transformBox: 'fill-box',
                animation: 'cursor-spin 4s linear infinite',
              }}
            />
          )}

          {/* ── DRAG: 4 directional arrows ── */}
          {isDrag && (() => {
            const arrowInset = 7
            const arrowW = 4
            const arrowH = 5
            const mid = half
            return (
              <>
                {/* Up */}
                <polygon
                  points={`${mid},${arrowInset} ${mid - arrowW},${arrowInset + arrowH} ${mid + arrowW},${arrowInset + arrowH}`}
                  fill={EMBER}
                  opacity={0.7}
                />
                {/* Down */}
                <polygon
                  points={`${mid},${size - arrowInset} ${mid - arrowW},${size - arrowInset - arrowH} ${mid + arrowW},${size - arrowInset - arrowH}`}
                  fill={EMBER}
                  opacity={0.7}
                />
                {/* Left */}
                <polygon
                  points={`${arrowInset},${mid} ${arrowInset + arrowH},${mid - arrowW} ${arrowInset + arrowH},${mid + arrowW}`}
                  fill={EMBER}
                  opacity={0.7}
                />
                {/* Right */}
                <polygon
                  points={`${size - arrowInset},${mid} ${size - arrowInset - arrowH},${mid - arrowW} ${size - arrowInset - arrowH},${mid + arrowW}`}
                  fill={EMBER}
                  opacity={0.7}
                />
              </>
            )
          })()}

          {/* ── Corner brackets (all states) — rotate 45° on hover, white on hover ── */}
          <g
            style={{
              transformOrigin: `${half}px ${half}px`,
              transformBox: 'fill-box',
              transform: `rotate(${bracketRotate}deg)`,
              transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Top-left */}
            <path
              d={`M ${cLen} ${cThick / 2} L ${cThick / 2} ${cThick / 2} L ${cThick / 2} ${cLen}`}
              stroke={isHover ? HOVER_COLOR : EMBER}
              strokeWidth={cThick}
              strokeLinecap="square"
              opacity={isClick ? 0.5 : 1}
            />
            {/* Top-right */}
            <path
              d={`M ${size - cLen} ${cThick / 2} L ${size - cThick / 2} ${cThick / 2} L ${size - cThick / 2} ${cLen}`}
              stroke={isHover ? HOVER_COLOR : EMBER}
              strokeWidth={cThick}
              strokeLinecap="square"
              opacity={isClick ? 0.5 : 1}
            />
            {/* Bottom-left */}
            <path
              d={`M ${cThick / 2} ${size - cLen} L ${cThick / 2} ${size - cThick / 2} L ${cLen} ${size - cThick / 2}`}
              stroke={isHover ? HOVER_COLOR : EMBER}
              strokeWidth={cThick}
              strokeLinecap="square"
              opacity={isClick ? 0.5 : 1}
            />
            {/* Bottom-right */}
            <path
              d={`M ${size - cThick / 2} ${size - cLen} L ${size - cThick / 2} ${size - cThick / 2} L ${size - cLen} ${size - cThick / 2}`}
              stroke={isHover ? HOVER_COLOR : EMBER}
              strokeWidth={cThick}
              strokeLinecap="square"
              opacity={isClick ? 0.5 : 1}
            />
          </g>

          {/* Click flash fill */}
          {isClick && (
            <rect
              x={cThick}
              y={cThick}
              width={size - cThick * 2}
              height={size - cThick * 2}
              fill="rgba(200,75,12,0.1)"
            />
          )}
        </svg>
      </div>
    </>
  )
}
