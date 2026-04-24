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
  disabled?: boolean
  fullWidth?: boolean
}

function ButtonInner({
  children,
  onClick,
  filled,
  style,
  disabled,
  fullWidth,
}: {
  children: React.ReactNode
  onClick?: () => void
  filled?: boolean
  style?: React.CSSProperties
  disabled?: boolean
  fullWidth?: boolean
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

  const onEnter = () => { if (!disabled) tlRef.current?.play() }
  const onLeave = () => { if (!disabled) tlRef.current?.reverse() }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      disabled={disabled}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.12)' : '#C84B0C'}`,
        background: filled ? '#C84B0C' : 'transparent',
        padding: '0.85rem 2.2rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.35 : 1,
        width: fullWidth ? '100%' : undefined,
        ...style,
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
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: disabled ? 'rgba(255,255,255,0.3)' : filled ? '#0A0A0A' : '#C84B0C',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </button>
  )
}

export default function MagneticButton({ children, onClick, href, filled, isInternal, style, disabled, fullWidth }: MagneticButtonProps) {
  const inner = <ButtonInner onClick={onClick} filled={filled} style={style} disabled={disabled} fullWidth={fullWidth}>{children}</ButtonInner>
  const magneticStyle = fullWidth ? { display: 'block' as const } : undefined

  if (href) {
    const isInternalLink = isInternal || href.startsWith('/')
    return (
      <Magnetic style={magneticStyle}>
        <a
          href={href}
          target={isInternalLink ? undefined : '_blank'}
          rel={isInternalLink ? undefined : 'noopener noreferrer'}
          style={{ textDecoration: 'none', display: fullWidth ? 'block' : 'inline-block' }}
        >
          {inner}
        </a>
      </Magnetic>
    )
  }

  if (disabled) return inner
  return <Magnetic style={magneticStyle}>{inner}</Magnetic>
}
