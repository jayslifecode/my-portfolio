'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import WorkSection from '@/components/WorkSection'
import ContactSection from '@/components/ContactSection'
import Cursor from '@/components/Cursor'
import NavBar from '@/components/NavBar'
import StatusBar from '@/components/StatusBar'
import SmoothScroll from '@/components/SmoothScroll'

const EtherealBackground = dynamic(() => import('@/components/EtherealBackground'), { ssr: false })

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const workRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main style={{ background: '#0A0A0A', position: 'relative' }}>
      <SmoothScroll />
      <Cursor />
      <NavBar />
      <StatusBar />

      <EtherealBackground scrollProgress={scrollProgress} />

      {/* Content layers */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <HeroSection onScrollDown={scrollToWork} />

        <div ref={workRef}>
          <WorkSection />
        </div>

        <ContactSection />
      </div>
    </main>
  )
}
