'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface MagneticProps {
  children: React.ReactElement
  style?: React.CSSProperties
}

export default function Magnetic({ children, style }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' })

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      xTo((e.clientX - (left + width / 2)) * 0.35)
      yTo((e.clientY - (top + height / 2)) * 0.35)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <div ref={ref} style={{ display: 'inline-block', ...style }}>{children}</div>
}
