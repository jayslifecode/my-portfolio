'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/jays3d.glb')

interface AvatarModelProps {
  mouseX: number
}

function AvatarModel({ mouseX }: AvatarModelProps) {
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

    const targetRotY = mouseX * 0.3
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.05
  })

  return (
    <group ref={group}>
      <primitive object={clonedScene} scale={1.8} position={[0, -0.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  )
}

interface Avatar3DSceneProps {
  mouseX: number
}

export default function Avatar3DScene({ mouseX }: Avatar3DSceneProps) {
  return (
    <>
      {/* Ambient so the model is always visible */}
      <ambientLight intensity={0.7} color="#ffffff" />

      {/* Key light — front/top */}
      <directionalLight
        position={[0, 4, 4]}
        color="#ffffff"
        intensity={1.2}
      />

      {/* Ember fill from below — signature color */}
      <pointLight
        position={[0, -1.5, 1.5]}
        color="#C84B0C"
        intensity={4}
        distance={7}
      />

      {/* Rim / back light */}
      <pointLight
        position={[-2, 2, -1.5]}
        color="#ff6030"
        intensity={1.2}
        distance={6}
      />

      <AvatarModel mouseX={mouseX} />
    </>
  )
}
