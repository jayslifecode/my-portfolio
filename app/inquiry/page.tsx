'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import InquiryQuestionnaire from '@/components/InquiryQuestionnaire'
import MagneticButton from '@/components/MagneticButton'
import { usePageTransition } from '@/context/TransitionContext'
import { useIsMobile } from '@/hooks/useBreakpoint'

const EtherealBackground = dynamic(() => import('@/components/EtherealBackground'), { ssr: false })

const SECTIONS = [
  { index: '01', label: 'PROJECT\nOVERVIEW' },
  { index: '02', label: 'FEATURES\nNEEDED' },
  { index: '03', label: 'DESIGN +\nCONTENT' },
  { index: '04', label: 'TIMELINE +\nBUDGET' },
  { index: '05', label: 'CONTACT\nDETAILS' },
]

export default function InquiryPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [ctaHover, setCtaHover] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)

  const checkDraft = () => {
    try {
      const saved = localStorage.getItem('inquiry_draft')
      if (saved) {
        const { answers } = JSON.parse(saved)
        return answers && Object.keys(answers).length > 0
      }
      return false
    } catch {
      return false
    }
  }

  const isMobile = useIsMobile()
  const { navigate } = usePageTransition()

  const handleStart = () => setShowQuestionnaire(true)
  const handleComplete = () => {
    setHasDraft(false)
    setShowQuestionnaire(false)
    setShowComplete(true)
  }

  const handleBack = useCallback(() => {
    if (showQuestionnaire) {
      setShowQuestionnaire(false)
    } else {
      navigate('/')
    }
  }, [showQuestionnaire, navigate])

  // Check for draft after mount
  useEffect(() => {
    requestAnimationFrame(() => {
      const draftExists = checkDraft()
      setHasDraft(draftExists)
    })
  }, [])

  // ESC key support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showQuestionnaire, handleBack])

  const handleHomeClick = () => navigate('/')

  return (
    <main
      style={{
        background: '#0A0A0A',
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px',
      }}
    >
      <EtherealBackground />



      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <AnimatePresence mode="wait">

          {/* ── INTRO ─────────────────────────────────────────── */}
          {!showQuestionnaire && !showComplete && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: isMobile ? '80px 1.5rem 3rem' : '88px 3.5rem 3rem',
                maxWidth: '1120px',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              {/* Transmission stamp — top right */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  top: isMobile ? '20px' : '96px',
                  right: isMobile ? '1.5rem' : '3.5rem',
                  textAlign: 'right',
                  pointerEvents: 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.28em',
                  color: 'rgba(255,255,255,0.12)',
                  marginBottom: '3px',
                }}>
                  TRANSMISSION
                </div>
                <div style={{
                  fontFamily: 'var(--font-oxanium), sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: 'rgba(200,75,12,0.4)',
                }}>
                  INI—004
                </div>
              </motion.div>

              {/* ── HEADING ── */}
              <div style={{ marginBottom: '2.2rem', overflow: 'hidden' }}>

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.5 }}
                  style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.78rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(200,75,12,0.75)',
                    marginBottom: '1.4rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {hasDraft ? '// draft detected · resume' : '// project brief · initiate'}
                </motion.p>

                {['WHAT', 'ARE YOU'].map((word, i) => (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      fontFamily: 'var(--font-oxanium), sans-serif',
                      fontSize: 'clamp(2.4rem, 6.5vw, 5.8rem)',
                      fontWeight: 900,
                      lineHeight: 0.87,
                      letterSpacing: '-0.04em',
                      color: '#ffffff',
                      display: 'block',
                    }}
                  >
                    {word}
                  </motion.div>
                ))}

                {/* BUILDING? — outline, indented, bleeds right */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.26, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: 'var(--font-oxanium), sans-serif',
                    fontSize: 'clamp(2.4rem, 6.5vw, 5.8rem)',
                    fontWeight: 900,
                    lineHeight: 0.87,
                    letterSpacing: '-0.04em',
                    color: 'transparent',
                    WebkitTextStroke: '2px var(--ember)',
                    display: 'block',
                    marginLeft: 'clamp(1.5rem, 5vw, 6rem)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  BUILDING?
                </motion.div>
              </div>

              {/* ── EMBER RULE ── */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.38, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformOrigin: 'left',
                  height: '1px',
                  background: 'linear-gradient(to right, var(--ember) 55%, transparent)',
                  marginBottom: '1.6rem',
                }}
              />

              {/* ── STATUS BAR ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.44, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                }}
              >
                {['5 MODULES', '~3 MIN', 'REPLY ≤ 24H'].map((stat, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.78rem',
                      letterSpacing: '0.16em',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {stat}
                  </span>
                ))}
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    color: 'var(--ember)',
                    opacity: 0.8,
                    animation: 'cursor-blink 1.5s step-end infinite',
                  }}
                >
                  ● AWAITING INPUT
                </span>
              </motion.div>

              {/* ── SECTION COLUMNS ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                  display: 'flex',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  borderTop: '1px solid rgba(255,255,255,0.055)',
                  borderBottom: '1px solid rgba(255,255,255,0.055)',
                }}
              >
                {SECTIONS.map((s, i) => (
                  <motion.div
                    key={s.index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 + i * 0.055, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      flex: isMobile ? '0 0 50%' : 1,
                      padding: '18px 16px',
                      borderRight: isMobile
                        ? (i % 2 === 0 && i < SECTIONS.length - 1 ? '1px solid rgba(255,255,255,0.055)' : 'none')
                        : (i < SECTIONS.length - 1 ? '1px solid rgba(255,255,255,0.055)' : 'none'),
                      borderBottom: isMobile && i < SECTIONS.length - 1
                        ? '1px solid rgba(255,255,255,0.055)'
                        : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      color: 'var(--ember)',
                      opacity: 0.65,
                    }}>
                      {s.index}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      color: 'rgba(255,255,255,0.4)',
                      lineHeight: 1.65,
                      whiteSpace: 'pre-line',
                    }}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── TERMINAL CTA ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.5 }}
              >
                <button
                  onClick={handleStart}
                  onMouseEnter={() => setCtaHover(true)}
                  onMouseLeave={() => setCtaHover(false)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '22px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(200,75,12,0.25)',
                    borderLeft: ctaHover ? '2px solid var(--ember)' : '2px solid rgba(200,75,12,0.35)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    gap: '14px',
                    transition: 'border-color 0.2s',
                    marginTop: '1.6rem',
                  }}
                >

                  <span style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.72rem',
                    color: ctaHover ? 'var(--ember)' : 'rgba(200,75,12,0.5)',
                    letterSpacing: '0.1em',
                    position: 'relative',
                    transition: 'color 0.2s',
                  }}>
                    $
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.78rem',
                    color: ctaHover ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.08em',
                    position: 'relative',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}>
                    {hasDraft ? './resume_draft.sh' : './initiate_brief.sh'}
                    <span style={{ animation: 'cursor-blink 1.1s step-end infinite', color: 'var(--ember)' }}>▌</span>
                  </span>

                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: ctaHover ? 'rgba(200,75,12,0.25)' : 'rgba(255,255,255,0.04)',
                    transition: 'background 0.35s',
                    position: 'relative',
                  }} />

                  <motion.span
                    animate={{ x: ctaHover ? 4 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      fontFamily: 'var(--font-oxanium), sans-serif',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.9rem)',
                      fontWeight: 800,
                      color: ctaHover ? 'var(--ember)' : 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.02em',
                      position: 'relative',
                      transition: 'color 0.2s',
                      lineHeight: 1,
                    }}
                  >
                    →
                  </motion.span>
                </button>
              </motion.div>

            </motion.div>
          )}

          {/* ── QUESTIONNAIRE ─────────────────────────────────── */}
          {showQuestionnaire && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <InquiryQuestionnaire onComplete={handleComplete} />
            </motion.div>
          )}

          {/* ── COMPLETE ──────────────────────────────────────── */}
          {showComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: isMobile ? '80px 1.5rem 3rem' : '88px 3.5rem 3rem',
                maxWidth: '1120px',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              {/* Status stamp */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  top: isMobile ? '20px' : '96px',
                  right: isMobile ? '1.5rem' : '3.5rem',
                  textAlign: 'right',
                  pointerEvents: 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.28em',
                  color: 'rgba(255,255,255,0.12)',
                  marginBottom: '3px',
                }}>
                  TRANSMISSION
                </div>
                <div style={{
                  fontFamily: 'var(--font-oxanium), sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: 'rgba(200,75,12,0.4)',
                }}>
                  SENT · OK
                </div>
              </motion.div>

              {/* Overline */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.78rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(200,75,12,0.75)',
                  marginBottom: '1.4rem',
                  textTransform: 'uppercase',
                }}
              // eslint-disable-next-line react/jsx-no-comment-textnodes
              >
                // brief received · awaiting response
              </motion.p>

              {/* Big headline */}
              <div style={{ marginBottom: '2.2rem', overflow: 'hidden' }}>
                {['BRIEF', 'RECEIVED'].map((word, i) => (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      fontFamily: 'var(--font-oxanium), sans-serif',
                      fontSize: 'clamp(2.4rem, 6.5vw, 5.8rem)',
                      fontWeight: 900,
                      lineHeight: 0.87,
                      letterSpacing: '-0.04em',
                      color: i === 0 ? '#ffffff' : 'transparent',
                      WebkitTextStroke: i === 1 ? '2px var(--ember)' : undefined,
                      display: 'block',
                      marginLeft: i === 1 ? 'clamp(1.5rem, 5vw, 6rem)' : undefined,
                    }}
                  >
                    {word}
                  </motion.div>
                ))}
              </div>

              {/* Ember rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformOrigin: 'left',
                  height: '1px',
                  background: 'linear-gradient(to right, var(--ember) 55%, transparent)',
                  marginBottom: '1.6rem',
                }}
              />

              {/* Status row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                }}
              >
                {['BRIEF LOGGED', 'REPLY ≤ 24H', 'JAY NOTIFIED'].map((stat, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.78rem',
                      letterSpacing: '0.16em',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {stat}
                  </span>
                ))}
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    color: 'var(--ember)',
                    opacity: 0.8,
                  }}
                >
                  ● TRANSMITTED
                </span>
              </motion.div>

              {/* Message block */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.055)',
                  borderBottom: '1px solid rgba(255,255,255,0.055)',
                  padding: '1.5rem 0',
                  marginBottom: '2rem',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.82rem',
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.9,
                  margin: 0,
                }}>
                  Your brief is in. I&apos;ll read through everything and come back to you with a personalised response within 24 hours.
                  No auto-replies, no templates — just a real answer.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <MagneticButton onClick={handleHomeClick} filled>
                  ← Return to base
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}
