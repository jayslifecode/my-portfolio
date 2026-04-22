'use client'

import { useIsMobile } from '@/hooks/useBreakpoint'

export default function StatusBar() {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        gap: '0.75rem',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#22c55e',
          animation: 'status-blink 2s ease-in-out infinite',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-oxanium), sans-serif',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: '#ffffff',
        }}
      >
        JAY.EXE
      </span>
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.2)',
        }}
      >
        —
      </span>
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          color: 'var(--ember)',
        }}
      >
        AVAILABLE FOR HIRE
      </span>

      <div style={{ flex: 1 }} />

      {!isMobile && (
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.48rem',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          designed &amp; built by{' '}
          <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>
            Munkhjavkhlan E. / Jay
          </span>
          {' '}· © 2026
        </span>
      )}
    </div>
  )
}
