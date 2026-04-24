'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { useIsTouch, useIsMobile } from '@/hooks/useBreakpoint'

interface Project {
  name: string
  desc: string
  tags: string[]
  url?: string
  year: string
  color: string
}

const projects: Project[] = [
  {
    name: 'ODM Ecosystem',
    desc: 'Full e-commerce ecosystem for One Day Mongolia — storefront, admin dashboard, supplier management, and logistics. Built with Next.js + Shopify + Stripe, ships across Mongolia, Kazakhstan, and Europe (Hungary).',
    tags: ['Next.js', 'Shopify', 'Stripe', 'GraphQL', 'TypeScript'],
    url: 'https://onedaymongolia.com',
    year: '2024 – 2025',
    color: '#1a0a00',
  },
  {
    name: 'ARTA Platform',
    desc: 'End-to-end management system covering schools, kindergartens, and corporate offices. Features school admin, teacher & student portals, attendance tracking, custom food-ordering with chef roles and menu creation, kiosk mode for self-service check-in and ordering, and a white-label build for individual companies needing workforce attendance and canteen systems.',
    tags: ['Next.js', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Sequelize'],
    year: '2025 – 2026',
    color: '#1a0a0a',
  },
  {
    name: 'AI Automation Suite',
    desc: 'n8n-powered agent platform that automates end-to-end company workflows — document processing, approval chains, reporting, and cross-tool integrations. Agents handle repetitive ops so teams can focus on actual work.',
    tags: ['n8n', 'OpenAI', 'Python', 'Node.js', 'REST APIs'],
    year: '2025 – 2026',
    color: '#000a0a',
  },
  {
    name: 'Mongolec CMS',
    desc: 'Multi-tenant content management system powering 3 websites from a single unified admin. PostgreSQL row-level security for complete tenant isolation, AWS S3 media storage, Redis caching.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'AWS S3'],
    year: '2025 – 2026',
    color: '#0a0a12',
  },
  {
    name: 'Rally for Rangers',
    desc: 'Rally organization platform — event listings, participant applications, ranger stories, and donations. Includes a full admin dashboard for complete event and content management.',
    tags: ['Next.js', 'React', 'GraphQL', 'Radix UI'],
    year: '2026',
    color: '#0a0f0a',
  },
  {
    name: 'Luxury Blind',
    desc: 'Premium window treatment e-commerce platform with custom product configuration, material and size selectors, and a clean modern UI.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    year: '2026',
    color: '#120a0a',
  },
]

function ProjectPreview({ project, index }: { project: Project; index: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: project.color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-oxanium), sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          color: 'rgba(200,75,12,0.6)',
          textTransform: 'uppercase',
        }}
      >
        0{index + 1} / 0{projects.length}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-oxanium), sans-serif',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {project.name}
      </div>
      <div
        style={{
          width: '32px',
          height: '1px',
          background: '#C84B0C',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
        }}
      >
        {project.tags.join(' · ')}
      </div>
    </div>
  )
}

interface ProjectRowProps {
  project: Project
  index: number
  onMouseEnter: (index: number, x: number, y: number) => void
  onMouseLeave: (index: number, x: number, y: number) => void
  onMouseMove: (x: number, y: number) => void
}

function ProjectRow({ project, index, onMouseEnter, onMouseLeave, onMouseMove }: ProjectRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={(e) => {
        onMouseEnter(index, e.clientX, e.clientY)
        ;(e.currentTarget as HTMLElement).style.background = 'var(--surface)'
        ;(e.currentTarget as HTMLElement).style.borderTopColor = 'rgba(200,75,12,0.35)'
      }}
      onMouseLeave={(e) => {
        onMouseLeave(index, e.clientX, e.clientY)
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLElement).style.borderTopColor = 'rgba(200,75,12,0.12)'
      }}
      onMouseMove={(e) => onMouseMove(e.clientX, e.clientY)}
      onClick={() => project.url && window.open(project.url, '_blank')}
      style={{
        borderTop: '1px solid rgba(200,75,12,0.12)',
        padding: '2rem 1.2rem',
        cursor: project.url ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        background: 'transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.6rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'rgba(200,75,12,0.5)',
            }}
          >
            {project.year}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            {project.name}
          </h3>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.6,
          }}
        >
          {project.desc}
        </p>
      </div>
      {project.url && (
        <span
          style={{
            fontFamily: 'var(--font-oxanium), sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'rgba(200,75,12,0.5)',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          →
        </span>
      )}
    </motion.div>
  )
}

const scaleAnimation = {
  initial: { scale: 0, x: '-50%', y: '-50%' },
  open: { scale: 1, x: '-50%', y: '-50%', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
  closed: { scale: 0, x: '-50%', y: '-50%', transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] } },
}

export default function WorkSection() {
  const isTouch = useIsTouch()
  const isMobile = useIsMobile()
  const [modal, setModal] = useState({ active: false, index: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  const modalRef = useRef<HTMLDivElement>(null)
  const xMove = useRef<gsap.QuickToFunc | null>(null)
  const yMove = useRef<gsap.QuickToFunc | null>(null)

  useEffect(() => {
    if (!modalRef.current) return
    xMove.current = gsap.quickTo(modalRef.current, 'left', { duration: 0.8, ease: 'power3' })
    yMove.current = gsap.quickTo(modalRef.current, 'top', { duration: 0.8, ease: 'power3' })
  }, [])

  const moveModal = (x: number, y: number) => {
    xMove.current?.(x)
    yMove.current?.(y)
  }

  const handleEnter = (index: number, x: number, y: number) => {
    if (isTouch) return
    moveModal(x, y)
    setModal({ active: true, index })
  }

  const handleLeave = (index: number, x: number, y: number) => {
    if (isTouch) return
    moveModal(x, y)
    setModal({ active: false, index })
  }

  return (
    <section
      id="work"
      className="relative z-10"
      style={{ padding: isMobile ? '5rem 0 2.5rem' : '8rem 0 6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>

        {/* Section header */}
        <div ref={headerRef} style={{ marginBottom: isMobile ? '2.5rem' : '4rem', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.2rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-oxanium), sans-serif',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'var(--ember)',
              }}
            >
              01
            </span>
            <span
              style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.55rem',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              /
            </span>
            <span
              style={{
                fontFamily: 'var(--font-oxanium), sans-serif',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              WORK
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(to right, rgba(200,75,12,0.3), transparent)',
              }}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-oxanium), sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            Things I&apos;ve shipped.
          </motion.h2>
          {!isTouch && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.2)',
                marginTop: '0.5rem',
              }}
            >
              {'/* hover each row for a preview */'}
            </motion.p>
          )}
        </div>

        {/* Project list */}
        <div style={{ borderBottom: '1px solid rgba(200,75,12,0.15)' }}>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.name}
              project={project}
              index={i}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              onMouseMove={moveModal}
            />
          ))}
        </div>
      </div>

      {/* Floating modal preview — desktop/mouse only */}
      {!isTouch && <motion.div
        ref={modalRef}
        variants={scaleAnimation}
        animate={modal.active ? 'open' : 'closed'}
        initial="initial"
        data-cursor="none"
        style={{
          position: 'fixed',
          width: '300px',
          height: '200px',
          pointerEvents: 'none',
          zIndex: 50,
          overflow: 'hidden',
          border: '1px solid rgba(200,75,12,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            transition: 'none',
          }}
        >
          {projects.map((project, i) => (
            <div
              key={project.name}
              style={{
                minWidth: '100%',
                height: '100%',
                transform: `translateX(${(i - modal.index) * 100}%)`,
                transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
              }}
            >
              <ProjectPreview project={project} index={i} />
            </div>
          ))}
        </div>
      </motion.div>}
    </section>
  )
}
