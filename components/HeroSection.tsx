'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticButton from './MagneticButton'
import { usePageTransition } from '@/context/TransitionContext'
import { useIsMobile, useIsTablet } from '@/hooks/useBreakpoint'

const Avatar3DScene = dynamic(() => import('./Avatar3D'), { ssr: false })

interface SkillNode {
  x: number  // % of container width
  y: number  // % of container height
  skills: [string, string]
}

// 8 nodes cleanly positioned around the avatar
const SKILL_NODES: SkillNode[] = [
  { x: 50, y:  5, skills: ['NEXT.JS',    'REACT']      }, // TOP
  { x: 83, y: 17, skills: ['TYPESCRIPT', 'JAVASCRIPT'] }, // RIGHT-TOP
  { x: 90, y: 50, skills: ['TAILWIND',   'SHADCN']     }, // RIGHT-MID
  { x: 83, y: 82, skills: ['NODE.JS',    'GO']         }, // RIGHT-BOT
  { x: 50, y: 93, skills: ['POSTGRESQL', 'REDIS']      }, // BOTTOM
  { x: 17, y: 82, skills: ['AWS',        'DOCKER']     }, // LEFT-BOT
  { x: 10, y: 50, skills: ['CI/CD',      'N8N']        }, // LEFT-MID
  { x: 17, y: 17, skills: ['THREE.JS',   'SHADER']     }, // LEFT-TOP
]

// Slot-machine cycling chip
function SkillSlot({ skills, delay }: { skills: [string, string]; delay: number }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>
    const t = setTimeout(() => {
      iv = setInterval(() => setIdx(i => 1 - i), 3400)
    }, delay)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [delay])

  return (
    <div style={{
      fontFamily: 'var(--font-space-mono), monospace',
      fontSize: '0.7rem',
      letterSpacing: '0.18em',
      color: 'var(--ember)',
      background: 'rgba(200, 75, 12, 0.09)',
      border: '1px solid rgba(200, 75, 12, 0.28)',
      padding: '5px 14px',
      overflow: 'hidden',
      height: '1.8em',
      minWidth: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      whiteSpace: 'nowrap',
    }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={idx}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute' }}
        >
          {skills[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// Circuit-board orthogonal routing:
// - Exit avatar at the exact angle toward the node (different exit point per node = no overlap near center)
// - For L/R nodes: go vertical first (to node's y level), then horizontal into chip
// - For T/B nodes: go vertical to near chip (straight line if x aligns, else V→H)
function buildPath(
  nx: number, ny: number,
  cx: number, cy: number,
  R: number,
): string {
  const dx = nx - cx
  const dy = ny - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 1) return ''

  const angle = Math.atan2(dy, dx)
  const exitX = cx + Math.cos(angle) * R
  const exitY = cy + Math.sin(angle) * R

  // Stop this far from chip center so arrow tip sits at chip edge
  const H_PAD = 64  // ≈ half chip width
  const V_PAD = 17  // ≈ half chip height

  const f = (n: number) => n.toFixed(1)
  const moreVertical = Math.abs(dy) > Math.abs(dx)

  if (moreVertical) {
    // TOP or BOTTOM node — exit already in vertical direction
    const approachSign = dy < 0 ? 1 : -1   // +1 approach from below, -1 from above
    const endY = ny + approachSign * V_PAD

    if (Math.abs(exitX - nx) < 12) {
      // Chip is directly above/below — straight vertical line
      return `M ${f(exitX)},${f(exitY)} L ${f(exitX)},${f(endY)}`
    }
    // Slight x offset: go vertical to endY, then short horizontal to chip x
    return `M ${f(exitX)},${f(exitY)} L ${f(exitX)},${f(endY)} L ${f(nx)},${f(endY)}`
  } else {
    // LEFT or RIGHT node — exit at an angle, V-first then H into chip
    const approachSign = dx > 0 ? -1 : 1   // approach chip from outside edge
    const endX = nx + approachSign * H_PAD

    if (Math.abs(exitY - ny) < 12) {
      // Node is at same y as avatar center — straight horizontal line
      return `M ${f(exitX)},${f(exitY)} L ${f(endX)},${f(exitY)}`
    }
    // Go vertical to node's y, then horizontal into chip
    return `M ${f(exitX)},${f(exitY)} L ${f(exitX)},${f(ny)} L ${f(endX)},${f(ny)}`
  }
}

function SkillTree({ containerW, containerH }: { containerW: number; containerH: number }) {
  const cx = containerW / 2
  const cy = containerH / 2
  const R = Math.min(containerW, containerH) * 0.20

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <svg
        viewBox={`0 0 ${containerW} ${containerH}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
            <path d="M 0 0 L 5 2 L 0 4 Z" fill="rgba(200,75,12,0.65)" />
          </marker>
        </defs>

        {SKILL_NODES.map((node, i) => {
          const nx = (node.x / 100) * containerW
          const ny = (node.y / 100) * containerH
          const d = buildPath(nx, ny, cx, cy, R)
          if (!d) return null
          return (
            <path
              key={i}
              d={d}
              stroke="rgba(200,75,12,0.42)"
              strokeWidth="1.3"
              fill="none"
              strokeDasharray="6 4"
              markerEnd="url(#arrowhead)"
            />
          )
        })}
      </svg>

      {SKILL_NODES.map((node, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SkillSlot skills={node.skills} delay={i * 320} />
        </div>
      ))}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

interface HeroSectionProps {
  onScrollDown: () => void
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const dragXRef = useRef(0)
  const dragYRef = useRef(0)
  const returnAnimRef = useRef<number | null>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [avatarSize, setAvatarSize] = useState({ w: 520, h: 680 })
  const { navigate } = usePageTransition()
  const isDragging = useRef(false)
  const lastDragPos = useRef({ x: 0, y: 0 })

  const handleInquiryClick = () => navigate('/inquiry')

  useEffect(() => {
    const el = avatarRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setAvatarSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouseX((e.clientX / window.innerWidth) * 2 - 1)
    setMouseY(-((e.clientY / window.innerHeight) * 2 - 1))
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    lastDragPos.current = { x: e.clientX, y: e.clientY }
    if (returnAnimRef.current !== null) {
      cancelAnimationFrame(returnAnimRef.current)
      returnAnimRef.current = null
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastDragPos.current.x
    const dy = e.clientY - lastDragPos.current.y
    dragXRef.current += dx * 0.008
    dragYRef.current += dy * 0.008
    setDragX(dragXRef.current)
    setDragY(dragYRef.current)
    lastDragPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = () => {
    isDragging.current = false

    const decay = () => {
      dragXRef.current *= 0.88
      dragYRef.current *= 0.88

      if (Math.abs(dragXRef.current) < 0.001) dragXRef.current = 0
      if (Math.abs(dragYRef.current) < 0.001) dragYRef.current = 0

      setDragX(dragXRef.current)
      setDragY(dragYRef.current)

      if (dragXRef.current !== 0 || dragYRef.current !== 0) {
        returnAnimRef.current = requestAnimationFrame(decay)
      } else {
        returnAnimRef.current = null
      }
    }

    returnAnimRef.current = requestAnimationFrame(decay)
  }

  return (
    <section
      id="hero"
      className="relative"
      onMouseMove={handleMouseMove}
      style={{
        minHeight: (isMobile || isTablet) ? 'auto' : '100vh',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        paddingTop: isMobile ? '72px' : '60px',
        paddingBottom: isMobile ? '3rem' : '56px',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        alignSelf: isMobile ? 'flex-start' : undefined,
        width: '100%',
        maxWidth: '1320px',
        margin: '0 auto',
        padding: isMobile ? '0 1.5rem' : '0 3rem',
        gap: isMobile ? '5rem' : '3rem',
      }}>
        {/* LEFT: Text */}
        <div style={{ flex: '0 0 auto', width: isMobile ? '100%' : 'clamp(260px, 42%, 500px)', display: 'flex', flexDirection: 'column', gap: isMobile ? '1.1rem' : '1.4rem' }}>

          <motion.p
            custom={0} initial="hidden" animate="show" variants={fadeUp}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
            }}
          >
            {'// developer · seoul, south korea'}
          </motion.p>

          <motion.h1
            custom={1} initial="hidden" animate="show" variants={fadeUp}
            style={{
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: isMobile ? 'clamp(4rem, 18vw, 7rem)' : 'clamp(5.5rem, 11vw, 11rem)',
              fontWeight: 800,
              lineHeight: 0.88,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            JAY
          </motion.h1>

          <motion.p
            custom={2} initial="hidden" animate="show" variants={fadeUp}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.85,
              maxWidth: '320px',
            }}
          >
            I build things that scale.<br />
            Fullstack, AI, mobile — whatever it takes.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{ marginTop: '0.6rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <MagneticButton href="#contact">Hire Me →</MagneticButton>
            <MagneticButton onClick={handleInquiryClick}>Project Inquiry →</MagneticButton>
          </motion.div>
        </div>

        {/* RIGHT: 3D Avatar + skill tree */}
        <div
          ref={avatarRef}
          style={{
            flex: isMobile ? '0 0 auto' : 1,
            position: 'relative',
            height: isMobile ? 'clamp(300px, 80vw, 420px)' : 'clamp(460px, 68vh, 700px)',
            width: isMobile ? '100%' : undefined,
            minWidth: 0,
          }}
        >
          {avatarSize.w > 0 && (
            <SkillTree containerW={avatarSize.w} containerH={avatarSize.h} />
          )}

          {/* 3D Canvas — above skill lines */}
          <Canvas
            camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 10 }}
          >
            <Suspense fallback={null}>
              <Avatar3DScene mouseX={mouseX} mouseY={mouseY} dragX={dragX} dragY={dragY} />
            </Suspense>
          </Canvas>

          {/* Drag overlay — captures pointer events for avatar rotation */}
          <div
            data-cursor="drag"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 12,
              cursor: 'none',
            }}
          />

          {/* JAY.EXE — HUD nameplate over avatar torso */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: '62%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 22px',
              background: 'rgba(10,10,10,0.78)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200,75,12,0.45)',
              boxShadow: '0 0 28px rgba(200,75,12,0.16), inset 0 0 14px rgba(200,75,12,0.05)',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTop: '2px solid rgba(200,75,12,0.85)', borderLeft: '2px solid rgba(200,75,12,0.85)' }} />
            <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid rgba(200,75,12,0.85)', borderRight: '2px solid rgba(200,75,12,0.85)' }} />
            <div style={{ position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderBottom: '2px solid rgba(200,75,12,0.85)', borderLeft: '2px solid rgba(200,75,12,0.85)' }} />
            <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid rgba(200,75,12,0.85)', borderRight: '2px solid rgba(200,75,12,0.85)' }} />

            {/* Status dot */}
            <span style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              flexShrink: 0,
              animation: 'status-blink 2s ease-in-out infinite',
            }} />

            {/* Name */}
            <span style={{
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: '#ffffff',
            }}>
              JAY.EXE
            </span>

            {/* Version */}
            <span style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              color: 'rgba(200,75,12,0.75)',
            }}>
              v1.0
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — desktop only */}
      {!isMobile && <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={onScrollDown}
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          cursor: 'pointer',
        }}
      >
        <svg
          width="24"
          height="38"
          viewBox="0 0 24 38"
          fill="none"
          style={{
            display: 'block',
            filter: 'drop-shadow(0 0 8px rgba(200, 75, 12, 0.3))',
          }}
        >
          <motion.rect
            x="1"
            y="1"
            width="22"
            height="36"
            rx="10"
            stroke="rgba(200, 75, 12, 0.6)"
            strokeWidth="1.5"
            fill="rgba(10, 10, 10, 0.6)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          />
          <motion.circle
            cx="12"
            cy="10"
            r="3"
            fill="rgba(200, 75, 12, 0.8)"
            animate={{
              y: [0, 8, 0],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 1.5,
              ease: [0.45, 0, 0.55, 1],
              repeat: Infinity,
              delay: 2.2,
            }}
          />
        </svg>
      </motion.div>}
    </section>
  )
}
