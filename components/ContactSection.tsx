'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import MagneticButton from './MagneticButton'

const EMAIL = 'munkhjavkhlan.e@digitalmind.mn'

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section
      id="contact"
      className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center"
      style={{ padding: '8rem 2rem 6rem' }}
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
            fontSize: 'clamp(3.5rem, 12vw, 9rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            color: '#ffffff',
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
          // available for freelance · projects · collaborations
          <br />
          // i reply fast. no ghosting. promise.
        </motion.p>

        {/* Email + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}
        >
          <MagneticButton onClick={handleCopy}>
            {copied ? '✓ copied' : EMAIL}
          </MagneticButton>

          <p
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.15)',
            }}
          >
            click to copy
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

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.12)',
          }}
        >
          © JAY 2026 · MUNKHJAVKHLAN ENKHBAATAR
        </p>
      </div>
    </section>
  )
}
