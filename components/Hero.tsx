'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Shield, ArrowRight, ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'


export default function Hero() {
  const [hovering, setHovering] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = containerRef.current as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0b1220] to-black flex items-center justify-center"
    >
      {/* GLOBAL NIGHT LIGHT CLUSTERS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(56,189,248,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_30%,rgba(34,197,94,0.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(250,204,21,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(56,189,248,0.10),transparent_45%)]" />
      </div>

      {/* RADIAL FOCUS GLOW */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.18),transparent_65%)]" />

      {/* VIGNETTE (VERY IMPORTANT) */}
      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_220px_rgba(0,0,0,0.9)]" />

      {/* CENTER GLOWING AURA (behind content) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-accent/25 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] md:w-[420px] h-[220px] md:h-[420px] bg-blue-500/20 rounded-full blur-[90px] mix-blend-screen" />
      </div>

      {/* HOVER-RESPONSIVE MOVING AURA */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovering ? 0.35 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ left: cursor.x, top: cursor.y }}
          className="absolute w-[260px] h-[260px] md:w-[360px] md:h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] mix-blend-screen bg-[radial-gradient(circle,rgba(34,211,238,0.35)_0%,rgba(34,211,238,0)_65%)]"
        />
      </div>

      {/* CONTENT WRAPPER (DO NOT SKIP) */}
      <div className="relative z-30">
        {/* Content Layer */}
        <div className="container mx-auto px-6 relative text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-panel border border-accent/20 text-accent text-sm font-medium mx-auto backdrop-blur-md"
        >
          <Shield className="w-4 h-4 fill-accent/20" />
          <span className="tracking-wider uppercase text-xs">Blockchain Secured Relief</span>
        </motion.div>

        {/* Massive Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-8"
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white relative z-10">
            $ALVUS
          </h1>
          {/* Glowing Aura behind text */}
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-accent/20 absolute inset-0 blur-2xl z-0 select-none">
            SALVUS
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="whitespace-nowrap text-sm sm:text-base md:text-2xl text-white/90 mx-auto leading-tight mb-12 font-light"
        >
          Disaster relief that is <strong className="text-white font-bold">traceable</strong>, <strong className="text-white font-bold">instant</strong>, and <strong className="text-white font-bold">corruption-proof</strong>.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link href="/signup" className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel backdrop-blur-md bg-black/40 border border-white/15 ring-1 ring-black/20 text-accent text-sm font-medium overflow-hidden transition-all hover:bg-accent/12 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(80,200,255,0.25)] hover:scale-[1.02]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/20 to-transparent" />
            <span className="relative z-10">Fund a Relief Campaign</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#how-it-works"
            onClick={(e) => handleScrollTo(e, 'how-it-works')}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel backdrop-blur-md bg-black/40 border border-white/15 ring-1 ring-black/20 text-accent text-sm font-medium cursor-pointer overflow-hidden transition-all hover:bg-accent/12 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(80,200,255,0.25)] hover:scale-[1.02]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/20 to-transparent" />
            <span className="relative z-10">See how it works</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
        </div>
      </div>

      {/* Scroll Indicator fixed to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2 z-30"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce opacity-50" />
      </motion.div>

    </section>
  )
}
