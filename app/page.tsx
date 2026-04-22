'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import WorkSection from '@/components/WorkSection'
import ContactSection from '@/components/ContactSection'
import SmoothScroll from '@/components/SmoothScroll'

const EtherealBackground = dynamic(() => import('@/components/EtherealBackground'), { ssr: false })

export default function Home() {
  const workRef = useRef<HTMLDivElement>(null)

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main style={{ background: '#0A0A0A', position: 'relative' }}>
      <SmoothScroll />

      <EtherealBackground />

      {/* Content layers */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <HeroSection onScrollDown={scrollToWork} />

        <div id="work" ref={workRef}>
          <WorkSection />
        </div>

        <div id="contact">
          <ContactSection />
        </div>
      </div>
    </main>
  )
}
