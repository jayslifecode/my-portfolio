'use client'

import { MeshGradient } from '@paper-design/shaders-react'

export default function EtherealBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <MeshGradient
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        colors={[
          '#080808',   // void black
          '#0f0704',   // near-black warm
          '#3d1103',   // deep ember brown
          '#1a0802',   // dark rust
          '#060606',   // pure void
        ]}
        speed={0.4}
      />

      {/* Film grain */}
      <div
        style={{
          position:      'fixed',
          inset:         '-50%',
          width:         '200%',
          height:        '200%',
          pointerEvents: 'none',
          opacity:       0.09,
          mixBlendMode:  'overlay',
          animation:     'grain-shift 0.6s steps(1) infinite',
          zIndex:        2,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="bg-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#bg-grain)" />
        </svg>
      </div>

    </div>
  )
}
