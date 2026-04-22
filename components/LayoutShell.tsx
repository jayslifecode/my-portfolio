'use client'

import { TransitionProvider } from '@/context/TransitionContext'
import NavBar from '@/components/NavBar'
import Cursor from '@/components/Cursor'
import StatusBar from '@/components/StatusBar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <Cursor />
      <NavBar />
      <StatusBar />
      {children}
    </TransitionProvider>
  )
}
