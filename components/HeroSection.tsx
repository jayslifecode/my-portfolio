'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticButton from './MagneticButton'

const Avatar3DScene = dynamic(() => import('./Avatar3D'), { ssr: false })

const SKILLS = [
  { label: 'FULLSTACK', delay: '0s', duration: '4.2s', anim: 'float-up-1', x: '42%' },
  { label: 'AI / LLM', delay: '0.9s', duration: '5s', anim: 'float-up-2', x: '58%' },
  { label: 'AUTOMATION', delay: '1.8s', duration: '4.6s', anim: 'float-up-3', x: '35%' },
  { label: 'MOBILE', delay: '0.4s', duration: '5.4s', anim: 'float-up-4', x: '63%' },
  { label: 'ECOMMERCE', delay: '2.4s', duration: '4s', anim: 'float-up-5', x: '50%' },
  { label: 'NEXT.JS', delay: '1.2s', duration: '4.8s', anim: 'float-up-6', x: '30%' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

interface HeroSectionProps {
  onScrollDown: () => void
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const [mouseX, setMouseX] = useState(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    setMouseX(x)
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        fontFamily: 'var(--font-oxanium), sans-serif',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '44px',
        paddingBottom: '36px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          gap: '2rem',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* LEFT: Avatar + floating skill tags */}
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            width: 'clamp(280px, 38vw, 460px)',
            height: 'clamp(420px, 60vh, 620px)',
          }}
        >
          {/* Skill bubbles float from head (top 30% of container) */}
          {SKILLS.map((skill) => (
            <div
              key={skill.label}
              style={{
                position: 'absolute',
                top: '18%',
                left: skill.x,
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                color: 'var(--ember)',
                background: 'rgba(200, 75, 12, 0.08)',
                border: '1px solid rgba(200, 75, 12, 0.25)',
                padding: '3px 8px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                animation: `${skill.anim} ${skill.duration} ${skill.delay} ease-in-out infinite`,
                opacity: 0,
              }}
            >
              {skill.label}
            </div>
          ))}

          {/* 3D canvas */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 30 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <Avatar3DScene mouseX={mouseX} />
              </Suspense>
            </Canvas>
          </div>

          {/* JAY.EXE badge at bottom of avatar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'var(--ember)',
              border: '1px solid rgba(200,75,12,0.4)',
              background: 'rgba(200,75,12,0.07)',
              padding: '4px 14px',
              whiteSpace: 'nowrap',
            }}
          >
            JAY.EXE v1.0
          </motion.div>
        </div>

        {/* RIGHT: Text content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Label */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
            }}
          >
            // developer · ulaanbaatar, mn
          </motion.p>

          {/* Name */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: 'clamp(4.5rem, 10vw, 9rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            JAY
          </motion.h1>

          {/* Wit */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.62rem',
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.22)',
              lineHeight: 1.7,
              maxWidth: '380px',
            }}
          >
            yes, that&apos;s a 3d version of me.<br />
            yes, it&apos;s better looking.
          </motion.p>

          {/* Divider */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{
              width: '40px',
              height: '1px',
              background: 'var(--ember)',
            }}
          />

          {/* Role tags */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            {['→ FULLSTACK', '→ AI/AUTOMATION', '→ MOBILE', '→ ECOMMERCE'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.35)',
                  border: '1px solid var(--border)',
                  padding: '3px 10px',
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{ marginTop: '0.5rem' }}
          >
            <MagneticButton href="#contact">Hire Me →</MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '52px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
        }}
        onClick={onScrollDown}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.15)',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(200,75,12,0.5), transparent)',
            animation: 'ember-pulse 2s ease-in-out infinite',
          }}
        />
      </motion.div>
    </section>
  )
}
