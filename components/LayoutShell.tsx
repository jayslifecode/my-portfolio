'use client'

import { TransitionProvider } from '@/context/TransitionContext'
import NavBar from '@/components/NavBar'
import Cursor from '@/components/Cursor'
import StatusBar from '@/components/StatusBar'
import Preloader from '@/components/Preloader'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <Preloader />
      <Cursor />
      <NavBar />
      <StatusBar />
      {children}
    </TransitionProvider>
  )
}
