'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Utensils, Pill, Car, Home } from 'lucide-react'

export default function ImpactBreakdown() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const categories: any[] = []

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass rounded-2xl p-8 border border-dark-lighter/50 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Impact Breakdown
          </h2>
          <p className="text-gray-400 text-sm">Your donations in action</p>
        </div>

        {/* Chart or Empty State */}
        {categories.length === 0 ? (
          <div className="text-center text-gray-400 mb-6">No donation impact yet. Your future donations will show up here.</div>
        ) : (
          <div className="space-y-5 mb-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ 
                          backgroundColor: `${category.color}20`,
                          border: `2px solid ${category.color}40`
                        }}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: category.color }}
                        />
                      </div>
                      <span className="text-gray-300 font-semibold text-lg">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-xl">{category.value}%</span>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: category.color,
                          boxShadow: `0 0 10px ${category.color}80`
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative w-full h-4 bg-dark-lighter/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${category.value}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, ${category.color} 0%, ${category.lightColor} 100%)`,
                        boxShadow: `0 0 20px ${category.color}60`
                      }}
                    >
                      <motion.div
                        animate={isInView ? { x: ['0%', '100%'] } : { x: '0%' }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: 'linear',
                          delay: index * 0.1 + 1
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {categories.length > 0 && (
          <div className="pt-6 border-t border-dark-lighter/30">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
              <p className="italic">
                Based on verified campaign usage reported by Salvus
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
