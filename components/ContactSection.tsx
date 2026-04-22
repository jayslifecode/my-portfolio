'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { useIsMobile } from '@/hooks/useBreakpoint'

const EMAIL = 'jayslifecode@gmail.com'

export default function ContactSection() {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Booking a Meeting')
    window.location.href = `mailto:${EMAIL}?subject=${subject}`
  }

  const handleBookMeeting = () => {
    const title = encodeURIComponent('Meeting with Jay')
    const details = encodeURIComponent('Booking a meeting via portfolio')
    const add = encodeURIComponent(EMAIL)
    window.open(
      `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&details=${details}&add=${add}`,
      '_blank'
    )
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
          transition={{ duration: 0.5 }}
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
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
          {'// based in seoul — fast replies, no ghosting.'}
        </motion.p>

        {/* Email + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <MagneticButton onClick={handleEmailClick}>
              Email Me →
            </MagneticButton>
            <MagneticButton onClick={handleBookMeeting}>
              Book a Meeting →
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
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem' }}
        >
          {[
            { label: 'GitHub', url: 'https://github.com/munkhjavkhlan' },
            { label: 'LinkedIn', url: 'https://linkedin.com/in/munkhjavkhlan' },
          ].map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
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
              {label}
            </a>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
