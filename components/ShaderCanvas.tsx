'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Suppress the THREE.Clock → THREE.Timer deprecation warning from r3f internals
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
    _warn(...args)
  }
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uNoiseIntensity;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Hash function
  vec3 hash3(vec2 p) {
    vec3 q = vec3(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3)),
      dot(p, vec2(419.2, 371.9))
    );
    return fract(sin(q) * 43758.5453);
  }

  // Value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash3(i).x;
    float b = hash3(i + vec2(1.0, 0.0)).x;
    float c = hash3(i + vec2(0.0, 1.0)).x;
    float d = hash3(i + vec2(1.0, 1.0)).x;

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // FBM — fractal Brownian motion
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.1;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;

    // Mouse parallax — subtle shift
    vec2 mouseInfluence = uMouse * 0.04;
    uv += mouseInfluence;

    // Scroll-based transitions
    // 0.0 = hero (full ember), 0.5 = work (dark), 1.0 = contact (ember again)
    float scrollWave = abs(sin(uScroll * 3.14159));
    float emberIntensity = mix(1.0, 0.25, smoothstep(0.0, 0.5, uScroll) - smoothstep(0.5, 1.0, uScroll) * 0.75);

    // Base noise layers
    float t = uTime * 0.12;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    // Slow drifting smoke
    vec2 q = vec2(
      fbm(p + vec2(0.0, t * 0.3)),
      fbm(p + vec2(5.2, t * 0.4))
    );

    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.12)
    );

    float f = fbm(p + 4.0 * r);

    // Shadow tendrils — dark channels cutting through
    float tendril = fbm(p * 3.0 + vec2(t * 0.2, -t * 0.1));
    float shadowMask = smoothstep(0.3, 0.7, tendril);

    // Color mixing
    vec3 voidColor = vec3(0.04, 0.03, 0.02);         // near black with warmth
    vec3 ashColor  = vec3(0.08, 0.04, 0.02);         // deep ash
    vec3 emberLow  = vec3(0.35, 0.12, 0.02);         // dark ember
    vec3 emberMid  = vec3(0.55, 0.20, 0.04);         // mid ember
    vec3 emberHot  = vec3(0.78, 0.30, 0.05);         // #C84B0C range

    // Build the ember color
    vec3 col = mix(voidColor, ashColor, clamp(f * 2.0, 0.0, 1.0));
    col = mix(col, emberLow,  clamp(f * f * 4.0, 0.0, 1.0));
    col = mix(col, emberMid,  clamp(pow(f, 4.0) * 8.0, 0.0, 1.0));

    // Hot core — only at strong f values
    float hotCore = smoothstep(0.65, 0.85, f);
    col = mix(col, emberHot, hotCore * 0.5);

    // Apply shadow tendrils — cut into the ember
    col = mix(col, voidColor, shadowMask * 0.6);

    // Apply noise intensity
    col *= uNoiseIntensity;

    // Apply scroll-based ember intensity
    col *= emberIntensity;

    // Vignette — darken edges
    float vignette = 1.0 - smoothstep(0.4, 1.4, length((vUv - 0.5) * 1.8));
    col *= vignette;

    // Subtle grain for texture
    float grain = (hash3(vUv * uTime * 0.01 + 0.5).x - 0.5) * 0.03;
    col += grain;

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`

interface ShaderPlaneProps {
  scrollProgress: number
  mousePos: { x: number; y: number }
}

function ShaderPlane({ scrollProgress, mousePos }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const { size } = useThree()

  useEffect(() => {
    if (!materialRef.current) return

    const uniforms = materialRef.current.uniforms
    const updateUniforms = () => {
      uniforms.uResolution.value.set(size.width, size.height)
    }

    updateUniforms()
  }, [size])

  useFrame(() => {
    if (!materialRef.current) return

    const uniforms = materialRef.current.uniforms
    uniforms.uTime.value = performance.now() / 1000
    uniforms.uMouse.value.set(mousePos.x, mousePos.y)
    uniforms.uScroll.value = scrollProgress
    uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uScroll: { value: 0 },
          uNoiseIntensity: { value: 1.0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
        }}
      />
    </mesh>
  )
}

interface ShaderCanvasProps {
  scrollProgress: number
}

export default function ShaderCanvas({ scrollProgress }: ShaderCanvasProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane scrollProgress={scrollProgress} mousePos={mousePos} />
      </Canvas>
    </div>
  )
}
