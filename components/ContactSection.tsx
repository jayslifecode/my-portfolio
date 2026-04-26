'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { useIsMobile } from '@/hooks/useBreakpoint'

const EMAIL = 'jayslifecode@gmail.com'
const CALENDAR_LINK = 'https://calendar.app.google/x5PAhDkLhPem5fBU9'

export default function ContactSection() {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Booking a Meeting')
    window.location.href = `mailto:${EMAIL}?subject=${subject}`
  }

  return (
    <section
      id="contact"
      className="relative z-10 flex flex-col justify-center items-center text-center"
      style={{ padding: isMobile ? '3rem 1.5rem 5rem' : 'clamp(4rem, 10vw, 8rem) 1.5rem 6rem' }}
    >
      <div ref={ref} style={{ maxWidth: '720px', width: '100%' }}>

        {/* Section number */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.25 : 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, rgba(200,75,12,0.3), transparent)' }} />
          <span style={{ fontFamily: 'var(--font-oxanium), sans-serif', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', color: 'var(--ember)' }}>
            02
          </span>
          <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)' }}>
            / CONTACT
          </span>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, rgba(200,75,12,0.3), transparent)' }} />
        </motion.div>

        {/* Big heading */}
        <motion.h2
          initial={{ opacity: 0, y: isMobile ? 16 : 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.3 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-oxanium), sans-serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: '#ffffff',
            textAlign: 'center',
            width: '100%',
          }}
        >
          LET&apos;S
          <br />
          BUILD
          <br />
          <span style={{ color: '#C84B0C' }}>SOMETHING</span>
          <span style={{ color: '#C84B0C' }}>.</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.25 : 0.7, delay: isMobile ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.3)',
            marginTop: '2rem',
            marginBottom: '3rem',
            lineHeight: 1.7,
          }}
        >
          {'// open to freelance · full-time · collaborations'}
          <br />
          {'// based in seoul — I reply within 24 hours. No ghosting, ever.'}
        </motion.p>

        {/* Email + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: isMobile ? 0.25 : 0.7, delay: isMobile ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticButton onClick={handleEmailClick}>
              Email Me →
            </MagneticButton>
            <MagneticButton onClick={() => window.open(CALENDAR_LINK, '_blank')}>
              Schedule a Meeting →
            </MagneticButton>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.15)',
            }}
          >
            {EMAIL}
          </p>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: isMobile ? 0.25 : 0.7, delay: isMobile ? 0 : 0.45 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem' }}
        >
          <a
            href="https://github.com/jayslifecode"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.25)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#C84B0C'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </motion.div>
      </div>

    </section>
  )
}
