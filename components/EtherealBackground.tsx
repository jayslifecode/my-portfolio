'use client'

import { useRef, useId, useEffect, CSSProperties } from 'react'
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion'

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  if (fromLow === fromHigh) return toLow
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow)
}

function useInstanceId(): string {
  const id = useId()
  return `shadowoverlay-${id.replace(/:/g, '')}`
}

interface AnimationConfig {
  scale: number
  speed: number
}

interface NoiseConfig {
  opacity: number
  scale: number
}

interface ShadowOverlayProps {
  sizing?: 'fill' | 'stretch'
  color?: string
  animation?: AnimationConfig
  noise?: NoiseConfig
  style?: CSSProperties
  className?: string
}

function ShadowOverlay({
  sizing = 'fill',
  color = 'rgba(128, 128, 128, 1)',
  animation,
  noise,
  style,
  className,
}: ShadowOverlayProps) {
  const id = useInstanceId()
  const animationEnabled = animation && animation.scale > 0
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null)
  const hueRotateMotionValue = useMotionValue(180)
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null)

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      hueRotateAnimation.current?.stop()
      hueRotateMotionValue.set(0)
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        ease: 'linear',
        delay: 0,
        onUpdate: (value: number) => {
          feColorMatrixRef.current?.setAttribute('values', String(value))
        },
      })
      return () => { hueRotateAnimation.current?.stop() }
    }
  }, [animationEnabled, animationDuration, hueRotateMotionValue])

  return (
    <div
      className={className}
      style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%', ...style }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : 'none',
        }}
      >
        {animationEnabled && (
          <svg style={{ position: 'absolute' }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
                <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} result="output" />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: 'repeat',
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  )
}

interface Props {
  scrollProgress: number
}

export default function EtherealBackground({ scrollProgress }: Props) {
  // Subtle ember: present but not dominating
  const raw = scrollProgress < 0.5
    ? 1 - scrollProgress * 1.6
    : (scrollProgress - 0.5) * 1.6
  const intensity = Math.max(0.05, Math.min(0.55, raw))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#0A0A0A',
        opacity: intensity,
        transition: 'opacity 0.4s ease',
      }}
    >
      <ShadowOverlay
        color="rgba(200, 75, 12, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      />
    </div>
  )
}
