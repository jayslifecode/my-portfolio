'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import GridTransition from '@/components/GridTransition'

interface TransitionContextValue {
  navigate: (href: string) => void
}

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => { } })

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [href, setHref] = useState('')

  const navigate = useCallback((target: string) => {
    setHref(target)
    setIsTransitioning(true)
  }, [])

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <GridTransition
        isTransitioning={isTransitioning}
        href={href}
        onComplete={() => setIsTransitioning(false)}
      />
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  return useContext(TransitionContext)
}
