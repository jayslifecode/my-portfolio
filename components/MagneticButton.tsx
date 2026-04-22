'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Magnetic from './Magnetic'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  style?: React.CSSProperties
  filled?: boolean
  isInternal?: boolean
}

function ButtonInner({
  children,
  onClick,
  filled,
}: {
  children: React.ReactNode
  onClick?: () => void
  filled?: boolean
}) {
  const circleRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const circle = circleRef.current
    const label = labelRef.current
    if (!circle || !label) return

    gsap.set(circle, { yPercent: 100 })

    tlRef.current = gsap.timeline({ paused: true })
      .to(circle, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' }, 0)
      .to(label, { color: '#0A0A0A', duration: 0.2 }, 0)

    return () => { tlRef.current?.kill() }
  }, [])

  const onEnter = () => tlRef.current?.play()
  const onLeave = () => tlRef.current?.reverse()

  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #C84B0C',
        background: filled ? '#C84B0C' : 'transparent',
        padding: '0.85rem 2.2rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        ref={circleRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#C84B0C',
          zIndex: 0,
        }}
      />
      <span
        ref={labelRef}
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'var(--font-oxanium), sans-serif',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: filled ? '#0A0A0A' : '#C84B0C',
          pointerEvents: 'none',
        }}
      >
        {children}
      </span>
    </button>
  )
}

export default function MagneticButton({ children, onClick, href, filled, isInternal }: MagneticButtonProps) {
  const inner = <ButtonInner onClick={onClick} filled={filled}>{children}</ButtonInner>

  if (href) {
    const isInternalLink = isInternal || href.startsWith('/')
    return (
      <Magnetic>
        <a
          href={href}
          target={isInternalLink ? undefined : '_blank'}
          rel={isInternalLink ? undefined : 'noopener noreferrer'}
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          {inner}
        </a>
      </Magnetic>
    )
  }

  return <Magnetic>{inner}</Magnetic>
}
