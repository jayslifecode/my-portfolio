'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    { label: '[ HOME ]',    href: '/' },
    { label: '[ WORK ]',    href: pathname === '/' ? '#work'    : '/#work' },
    { label: '[ CONTACT ]', href: pathname === '/' ? '#contact' : '/#contact' },
    { label: '[ INQUIRY ]', href: '/inquiry' },
  ]

  const MOBILE_NAV_LINKS = NAV_LINKS

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
          <motion.button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            whileTap={{ scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
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
            <motion.span
              animate={menuOpen
                ? { rotate: 45, y: 6.5, background: '#C84B0C' }
                : { rotate: 0, y: 0, background: 'rgba(255,255,255,0.6)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 16 }}
              style={{ display: 'block', width: '20px', height: '1.5px' }}
            />
            <motion.span
              animate={menuOpen
                ? { scaleX: 0, opacity: 0 }
                : { scaleX: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 16, delay: menuOpen ? 0 : 0.05 }}
              style={{ display: 'block', width: '20px', height: '1.5px', background: 'rgba(255,255,255,0.6)', transformOrigin: 'center' }}
            />
            <motion.span
              animate={menuOpen
                ? { rotate: -45, y: -6.5, background: '#C84B0C' }
                : { rotate: 0, y: 0, background: 'rgba(255,255,255,0.6)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 16 }}
              style={{ display: 'block', width: '20px', height: '1.5px' }}
            />
          </motion.button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {['EN', 'KR', 'MN'].map((lang) => (
              <span
                key={lang}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.5rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile slide-down menu */}
      {isMobile && (
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              style={{
                position: 'fixed',
                top: '44px',
                left: 0,
                right: 0,
                zIndex: 8999,
                background: 'rgba(10,10,10,0.97)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ padding: '1rem 2rem 1.5rem' }}>
                {MOBILE_NAV_LINKS.map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 340, damping: 28 }}
                    style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.8rem',
                      letterSpacing: '0.2em',
                      color: 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      padding: '0.9rem 0',
                      borderBottom: i < MOBILE_NAV_LINKS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      display: 'block',
                    }}
                  >
                    {label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}
