'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/jays3d.glb')

interface AvatarModelProps {
  mouseX: number
  mouseY: number
  dragX: number
  dragY: number
}

function AvatarModel({ mouseX, mouseY, dragX, dragY }: AvatarModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/jays3d.glb')
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const floatRef = useRef(0)

  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(clonedScene)
      mixerRef.current = mixer
      const action = mixer.clipAction(animations[0])
      action.play()
    }
  }, [clonedScene, animations])

  useFrame((_, delta) => {
    if (!group.current) return
    if (mixerRef.current) mixerRef.current.update(delta)

    floatRef.current += delta
    group.current.position.y = Math.sin(floatRef.current * 0.8) * 0.06

    // Horizontal: passive mouse follow + drag accumulation
    const targetRotY = mouseX * 0.3 + dragX
    // Vertical: passive mouse follow + drag accumulation (clamp so model doesn't flip)
    const targetRotX = THREE.MathUtils.clamp(
      -mouseY * 0.12 + dragY,
      -0.55,
      0.55
    )

    group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.05
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.05
  })

  return (
    <group ref={group}>
      <primitive object={clonedScene} scale={2.5} position={[0, 0.1, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  )
}

interface Avatar3DSceneProps {
  mouseX: number
  mouseY: number
  dragX: number
  dragY: number
}

export default function Avatar3DScene({ mouseX, mouseY, dragX, dragY }: Avatar3DSceneProps) {
  return (
    <>
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[0, 4, 4]} color="#ffffff" intensity={1.2} />
      <pointLight position={[0, -1.5, 1.5]} color="#C84B0C" intensity={4} distance={7} />
      <pointLight position={[-2, 2, -1.5]} color="#ff6030" intensity={1.2} distance={6} />
      <AvatarModel mouseX={mouseX} mouseY={mouseY} dragX={dragX} dragY={dragY} />
    </>
  )
}
