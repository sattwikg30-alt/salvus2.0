'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Shield, ArrowRight, ChevronDown } from 'lucide-react'
import * as THREE from 'three'

// --- DATA CONSTELLATION (Background Filling) ---
function DataConstellation() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 400 // Number of background nodes
  
  const [particles, connections] = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20 // X spread
      p[i * 3 + 1] = (Math.random() - 0.5) * 20 // Y spread
      p[i * 3 + 2] = (Math.random() - 1.5) * 10 // Z depth (further back)
    }
    
    // Create random line indices for connectivity
    const indices = []
    for (let i = 0; i < count; i += 4) {
      indices.push(i, (i + 1) % count)
      indices.push(i + 1, (i + 2) % count)
    }
    
    return [p, new Float32Array(indices.length * 3)]
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime() * 0.10
    // Subtle drifting movement
    pointsRef.current.rotation.y = time * 0.4
    pointsRef.current.rotation.x = time * 0.4
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05} 
          color="#2dd4bf" 
          transparent 
          opacity={0.5} 
          sizeAttenuation 
        />
      </points>
      {/* Background grid/web effect */}
      <mesh rotation={[1, 1, 1]}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color="#2dd4bf" wireframe transparent opacity={0.03} />
      </mesh>
    </group>
  )
}

// --- GLOBE COMPONENT WITH RIPPLE DISTORTION ---
function AnimatedGlobe({ cursor }: { cursor: { x: number, y: number } }) {
  const meshRef = useRef<THREE.Points>(null)
  const lineRef = useRef<THREE.LineSegments>(null)
  
  const { positions, originalPositions, linePositions } = useMemo(() => {
    const p = new Float32Array(3000 * 3)
    const op = new Float32Array(3000 * 3) 
    
    for (let i = 0; i < 3000; i++) {
      const stride = i * 3
      const phi = Math.acos(-1 + (2 * i) / 3000)
      const theta = Math.sqrt(3000 * Math.PI) * phi
      const x = Math.cos(theta) * Math.sin(phi) * 2.5
      const y = Math.sin(theta) * Math.sin(phi) * 2.5
      const z = Math.cos(phi) * 2.5
      
      p[stride] = op[stride] = x
      p[stride + 1] = op[stride + 1] = y
      p[stride + 2] = op[stride + 2] = z
    }

    const lp = []
    for (let i = 0; i < 3000; i += 7) { 
      for (let j = i + 7; j < i + 35; j += 7) {
        const i_stride = i * 3
        const j_stride = (j % 3000) * 3
        lp.push(p[i_stride], p[i_stride+1], p[i_stride+2])
        lp.push(p[j_stride], p[j_stride+1], p[j_stride+2])
      }
    }

    return { 
      positions: p, 
      originalPositions: op,
      linePositions: new Float32Array(lp) 
    }
  }, [])

  useFrame(() => {
    if (!meshRef.current || !lineRef.current) return

    const rotationY = 0.0008
    meshRef.current.rotation.y += rotationY
    lineRef.current.rotation.y += rotationY

    const posAttribute = meshRef.current.geometry.getAttribute('position')
    const mouseX = (cursor.x / window.innerWidth) * 2 - 1
    const mouseY = -(cursor.y / window.innerHeight) * 2 + 1
    const mouseVec = new THREE.Vector3(mouseX * 3.5, mouseY * 3.5, 0)

    for (let i = 0; i < 3000; i++) {
      const stride = i * 3
      const x = originalPositions[stride]
      const y = originalPositions[stride + 1]
      const z = originalPositions[stride + 2]

      const pointVec = new THREE.Vector3(x, y, z)
      pointVec.applyEuler(meshRef.current.rotation)

      const dist = mouseVec.distanceTo(pointVec)
      
      if (dist < 1.2) { 
        const force = (1.2 - dist) / 1.2
        posAttribute.setXYZ(
          i, 
          x + (pointVec.x - mouseVec.x) * force * 0.15, 
          y + (pointVec.y - mouseVec.y) * force * 0.15, 
          z
        )
      } else {
        posAttribute.setXYZ(i, x, y, z)
      }
    }
    posAttribute.needsUpdate = true
  })

  return (
    <group>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.015} 
          color="#2dd4bf" 
          transparent 
          opacity={0.6} 
          sizeAttenuation={true} 
        />
      </points>

      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2dd4bf" transparent opacity={0.15} />
      </lineSegments>

      <Sphere args={[2.4, 32, 32]}>
        <meshBasicMaterial color="#2dd4bf" wireframe transparent opacity={0.03} />
      </Sphere>
    </group>
  )
}

// --- MAIN HERO ---
export default function Hero() {
  const [hovering, setHovering] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
      const handleScrollTo = (
      e: React.MouseEvent<HTMLAnchorElement>,
      targetId: string
    ) => {
      e.preventDefault()
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
 
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center"
    >
      <motion.div style={{ scale: globeScale, opacity }} className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          {/* Subtle Background Constellation */}
          <DataConstellation />
          {/* Foreground Animated Globe */}
          <AnimatedGlobe cursor={cursor} />
        </Canvas>
      </motion.div>

      <motion.div
        animate={{ opacity: hovering ? 0.28 : 0 }}
        style={{ left: cursor.x, top: cursor.y }}
        className="absolute pointer-events-none z-20 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] bg-cyan-500/10 transition-opacity duration-300"
      />

      <div className="relative z-30 container mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 backdrop-blur-md text-cyan-400 text-xs font-bold uppercase tracking-widest"
        >
          <Shield className="w-4 h-4" /> Blockchain Secured Relief
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">$ALVUS</h1>
        
        <p className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          Disaster relief that is <span className="text-white font-semibold">traceable</span>, <span className="text-white font-semibold">instant</span>, and <span className="text-white font-semibold">corruption-proof</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
              href="/signup"
              className="group flex items-center gap-2 px-8 py-3 rounded-full border border-white/15 bg-white/5 text-white/90 font-medium backdrop-blur-md transition-colors hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-white hover:shadow-[0_0_24px_rgba(45,212,191,0.55)]"          >
              Fund a Relief Campaign
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/how-it-works"
            onClick={(e) => handleScrollTo(e, 'how-it-works')}
            className="group flex items-center gap-2 px-8 py-3 rounded-full border border-white/15 bg-white/5 text-white/90 font-medium backdrop-blur-md transition-colors hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-white hover:shadow-[0_0_24px_rgba(45,212,191,0.55)]"            >
            See how it works
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  )
}