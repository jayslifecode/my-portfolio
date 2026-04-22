'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { usePageTransition } from '@/context/TransitionContext'
import { useIsMobile } from '@/hooks/useBreakpoint'

export default function NavBar() {
  const { navigate } = usePageTransition()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    if (href.startsWith('#')) {
      const id = href.slice(1)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else if (href.startsWith('/#')) {
      if (pathname === '/') {
        const id = href.slice(2)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(href)
      }
    } else {
      navigate(href)
    }
  }

  const NAV_LINKS = [
    { label: '[ WORK ]',    href: pathname === '/' ? '#work'    : '/#work' },
    { label: '[ CONTACT ]', href: pathname === '/' ? '#contact' : '/#contact' },
    { label: '[ INQUIRY ]', href: '/inquiry' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.55rem',
              color: 'var(--ember)',
              animation: 'cursor-blink 1.1s step-end infinite',
            }}
          >
            ▶
          </span>
          <span
            style={{
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            JAY.EXE
          </span>
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.2)',
            }}
          >
            v1.0
          </span>
        </div>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--ember)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'
                }}
              >
                {label}
              </a>
            ))}
          </div>
        )}

        {/* Desktop version stamp / Mobile hamburger */}
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span style={{
              display: 'block',
              width: '20px',
              height: '1.5px',
              background: menuOpen ? 'var(--ember)' : 'rgba(255,255,255,0.6)',
              transition: 'transform 0.2s, background 0.2s',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block',
              width: '20px',
              height: '1.5px',
              background: menuOpen ? 'var(--ember)' : 'rgba(255,255,255,0.6)',
              transition: 'opacity 0.2s, background 0.2s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block',
              width: '20px',
              height: '1.5px',
              background: menuOpen ? 'var(--ember)' : 'rgba(255,255,255,0.6)',
              transition: 'transform 0.2s, background 0.2s',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
            }} />
          </button>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.12)',
            }}
          >
            2026 · MN
          </span>
        )}
      </nav>

      {/* Mobile slide-down menu */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: '44px',
            left: 0,
            right: 0,
            zIndex: 8999,
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(16px)',
            borderBottom: menuOpen ? '1px solid var(--border)' : 'none',
            overflow: 'hidden',
            maxHeight: menuOpen ? '240px' : '0',
            transition: 'max-height 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div style={{ padding: '1rem 2rem 1.5rem' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'block',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
