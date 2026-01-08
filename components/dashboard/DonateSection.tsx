'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, X, CheckCircle, MapPin, Users, TrendingUp } from 'lucide-react'

export default function DonateSection() {
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [showModal, setShowModal] = useState(false)
  const [donationDetails, setDonationDetails] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Hydration fix & Portal target check
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = (id: string) => {
    setSelectedCampaign(current => current === id ? '' : id)
  }

  // Pre-select campaign if coming from Active Campaigns section
  useEffect(() => {
    const campaignId = sessionStorage.getItem('selectedCampaignId')
    if (campaignId) {
      setSelectedCampaign(campaignId)
      sessionStorage.removeItem('selectedCampaignId')
      sessionStorage.removeItem('selectedCampaignName')
    }
  }, [])

  // Load active campaigns for selection
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/campaigns')
        if (!res.ok) throw new Error('Failed to load campaigns')
        const data = await res.json()
        if (!mounted) return
        const mapped = (data || []).filter((c: any) => c.status === 'Active').map((c: any) => ({
          id: c._id,
          name: c.name,
          location: c.stateRegion || c.location || '',
          progress: c.totalFundsAllocated ? Math.round(((c.fundsRaised || 0) / c.totalFundsAllocated) * 100) : 0,
          beneficiaries: 0
        }))
        setCampaigns(mapped)
      } catch (e: any) {
        setError(e?.message || 'Unable to fetch campaigns')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCampaign || !amount) return

    const campaign = campaigns.find((c) => c.id === selectedCampaign)
    const refId = `SALVUS-${Date.now().toString().slice(-8)}`
    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
    })

    setDonationDetails({
      amount,
      campaign: campaign?.name || selectedCampaign,
      timestamp,
      referenceId: refId,
      paymentMethod,
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCampaign('')
    setAmount('')
    setPaymentMethod('UPI')
    setDonationDetails(null)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card rounded-3xl p-8 relative overflow-hidden"
      >

        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Make a Donation
            </h2>
            <p className="text-gray-400">Secure, instant, and directly tracked on the blockchain.</p>
          </div>

          <form onSubmit={handleDonate} className="space-y-8 max-w-4xl mx-auto">
            {/* Campaign Selector - Modern Card Grid */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Select Campaign
              </label>
              {loading ? (
                <div className="text-center text-gray-400">Loading campaigns...</div>
              ) : error ? (
                <div className="text-center text-red-400">{error}</div>
              ) : campaigns.length === 0 ? (
                <div className="text-center text-gray-400">No active campaigns available right now.</div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {campaigns.map((campaign, index) => (
                  <motion.button
                    key={campaign.id}
                    type="button"
                    onClick={() => handleClick(campaign.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 text-left group ${selectedCampaign === campaign.id
                      ? 'border-accent bg-accent/10'
                      : 'border-white/10 bg-white/5 hover:border-accent/50 hover:bg-white/10'
                      }`}
                  >
                    {selectedCampaign === campaign.id && (
                      <motion.div
                        layoutId="selectedCampaign"
                        className="absolute inset-0 border-2 border-accent rounded-2xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold text-base ${selectedCampaign === campaign.id ? 'text-accent' : 'text-white'
                          }`}>
                          {campaign.name}
                        </h3>
                        {selectedCampaign === campaign.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-dark-darker" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{campaign.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{campaign.beneficiaries ? campaign.beneficiaries.toLocaleString() : '—'} beneficiaries</span>
                        </div>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Donation Amount
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400 group-focus-within:text-accent transition-colors">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/10 focus:ring-1 focus:ring-accent/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3 h-[60px]"> {/* Fixed height for alignment */}
                  <motion.button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    whileTap={{ scale: 0.98 }}
                    className={`relative h-full rounded-xl border transition-all duration-300 flex items-center justify-center font-bold text-sm ${paymentMethod === 'UPI'
                      ? 'bg-white text-dark-darker border-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    UPI / QR
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    whileTap={{ scale: 0.98 }}
                    className={`relative h-full rounded-xl border transition-all duration-300 flex items-center justify-center font-bold text-sm ${paymentMethod === 'Card'
                      ? 'bg-white text-dark-darker border-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    Card
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Donate Now Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={!selectedCampaign || !amount}
              className="w-full py-4 bg-accent hover:bg-accent-dark text-dark-darker font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span>Confirm Donation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Enhanced Confirmation Modal - Portalled to Body */}
      {mounted && createPortal(
        <AnimatePresence>
          {showModal && donationDetails && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="glass rounded-2xl p-8 border border-dark-lighter/50 max-w-md w-full relative overflow-hidden"
              >
                {/* Background effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-10"></div>

                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6 relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full flex items-center justify-center border-2 border-accent/50">
                      <CheckCircle className="w-12 h-12 text-accent" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Donation Successful!
                  </h3>
                  <p className="text-gray-400">Your contribution is making a difference</p>
                </div>

                <div className="space-y-3 bg-gradient-to-br from-dark-lighter/40 to-dark-lighter/20 rounded-xl p-5 mb-6 border border-dark-lighter/30 relative z-10">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white font-bold text-lg">₹{donationDetails.amount}</span>
                  </div>
                  <div className="h-px bg-dark-lighter/50"></div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-400">Campaign</span>
                    <span className="text-white font-semibold text-right max-w-[60%]">{donationDetails.campaign}</span>
                  </div>
                  <div className="h-px bg-dark-lighter/50"></div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Payment Method</span>
                    <span className="text-white font-semibold">{donationDetails.paymentMethod}</span>
                  </div>
                  <div className="h-px bg-dark-lighter/50"></div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-400">Timestamp</span>
                    <span className="text-white font-semibold text-sm text-right max-w-[60%]">{donationDetails.timestamp}</span>
                  </div>
                  <div className="h-px bg-dark-lighter/50"></div>
                  <div className="flex justify-between items-center py-2 pt-3 bg-accent/5 rounded-lg px-3 -mx-1">
                    <span className="text-gray-300 font-semibold">Reference ID</span>
                    <span className="text-accent font-mono font-bold text-sm">{donationDetails.referenceId}</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent/20 relative z-10"
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
