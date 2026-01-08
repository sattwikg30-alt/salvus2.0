'use client'

import { motion } from 'framer-motion'
import { DollarSign, Heart, TrendingUp, Calendar, Sparkles } from 'lucide-react'

export default function DonorOverview() {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Donated',
      value: '₹0',
      color: 'text-accent',
      bgGradient: 'from-accent/20 to-accent/5',
      borderColor: 'border-accent/30',
      glow: 'shadow-accent/20',
    },
    {
      icon: Heart,
      label: 'Campaigns Supported',
      value: '0',
      color: 'text-accent-light',
      bgGradient: 'from-accent-light/20 to-accent-light/5',
      borderColor: 'border-accent-light/30',
      glow: 'shadow-accent-light/20',
    },
    {
      icon: TrendingUp,
      label: 'Funds Utilized',
      value: '₹0',
      color: 'text-accent',
      bgGradient: 'from-accent/20 to-accent/5',
      borderColor: 'border-accent/30',
      glow: 'shadow-accent/20',
    },
    {
      icon: Calendar,
      label: 'Last Donation Date',
      value: '—',
      color: 'text-accent-light',
      bgGradient: 'from-accent-light/20 to-accent-light/5',
      borderColor: 'border-accent-light/30',
      glow: 'shadow-accent-light/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative glass-card rounded-2xl p-6 group overflow-hidden"
          >
            {/* Hover Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
