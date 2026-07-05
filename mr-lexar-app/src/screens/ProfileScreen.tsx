"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Users, Phone, Mail, ChevronRight, Check, Camera, Copy, Share2, Award, MapPin, Wifi, WifiOff } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ProfileScreen() {
  const { loyalty, referral, addReferralCredit, parcelHistory, offlineMode, setOfflineMode } = useApp();
  const [showReferrals, setShowReferrals] = useState(false);
  const [showParcels, setShowParcels] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(referral.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const progress = Math.min(loyalty.trips / 5 * 100, 100);

  return (
    <div className="flex flex-col min-h-screen bg-dark pb-[72px]">
      {/* Header */}
      <div className="pt-6 pb-2 px-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center border-2 border-gold/50 flex-shrink-0">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 3.6-8 8-8s8 4 8 8"/></svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Tendai M.</h2>
            {loyalty.goldTier && (
              <span className="text-xs bg-gold text-black px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Award size={12} /> GOLD
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-0.5">+27 71 077 9990</p>
        </div>
      </div>

      {/* FEATURE 5: LOYALTY PROGRAM */}
      <div className="mx-4 mt-4 p-4 rounded-2xl border border-gold/20 bg-dark-card">
        <div className="flex items-center gap-2 mb-3">
          <Award size={18} className="text-gold" />
          <h3 className="text-sm font-bold text-gold">Mr Lexar Rewards</h3>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">You've completed {loyalty.trips} trips.</span>
          {loyalty.goldTier ? (
            <span className="text-xs text-green-400 font-semibold">✅ Gold Tier Active</span>
          ) : (
            <span className="text-xs text-white/40">{5 - loyalty.trips} more to Gold</span>
          )}
        </div>
        <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full rounded-full ${loyalty.goldTier ? 'bg-gold' : 'bg-gradient-to-r from-gold/60 to-gold'}`}
          />
        </div>
        {loyalty.goldTier ? (
          <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-center">
            <p className="text-xs text-gold font-bold">🥇 GOLD TIER UNLOCKED</p>
            <p className="text-[10px] text-white/60 mt-1">10% discount automatically applied to your next booking.</p>
          </div>
        ) : (
          <p className="text-[10px] text-white/40">1 more trip to unlock Gold Tier – 10% off all future bookings!</p>
        )}
      </div>

      {/* FEATURE 5: REFERRAL PROGRAM */}
      <div className="mx-4 mt-3 p-4 rounded-2xl border border-dark-border bg-dark-card">
        <button
          onClick={() => setShowReferrals(!showReferrals)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-gold" />
            <h3 className="text-sm font-bold text-white">Refer Friends, Earn Credit</h3>
          </div>
          <ChevronRight size={16} className={`text-white/30 transition-transform ${showReferrals ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {showReferrals && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[10px] text-white/40 mt-3 mb-3">
                You and your friend both get $5 credit when they complete their first trip.
              </p>
              <div className="p-3 rounded-xl bg-dark border border-gold/30 flex items-center justify-between mb-3">
                <span className="text-sm font-mono font-bold text-gold tracking-wider">{referral.code}</span>
                <div className="flex gap-2">
                  <button onClick={copyCode} className="text-[10px] bg-gold/20 text-gold px-2 py-1 rounded-lg flex items-center gap-1">
                    {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                  </button>
                  <button className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Share2 size={10} /> Share
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-dark border border-dark-border mb-3">
                <p className="text-[10px] text-white/40 mb-1">WhatsApp Preview:</p>
                <p className="text-[10px] text-white/60 leading-relaxed">
                  Hey! I use Mr Lexar for safe cross-border trips between SA, Botswana & Zimbabwe. Use my code {referral.code} and get $5 off your first trip. 🚐🇿🇦🇧🇼🇿🇼
                </p>
              </div>
              <h4 className="text-xs text-white/50 font-medium mb-2">Your Referrals</h4>
              {referral.referrals.map((r) => (
                <div key={r.name} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                  <span className="text-xs text-white/70">{r.name}</span>
                  <span className={`text-[10px] ${r.status === 'completed' ? 'text-green-400' : 'text-yellow-500'}`}>
                    {r.status === 'completed' ? '✅ $5 credit earned' : '⏳ Pending first trip'}
                  </span>
                </div>
              ))}
              <div className="mt-3 p-3 rounded-xl bg-gold/10 border border-gold/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Referral Balance</span>
                  <span className="text-sm font-bold text-gold">${referral.balance.toFixed(2)} available</span>
                </div>
                <p className="text-[10px] text-white/40 mt-1">Redeem on next booking</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FEATURE 4: MY PARCELS (mini-timeline) */}
      <div className="mx-4 mt-3 p-4 rounded-2xl border border-dark-border bg-dark-card">
        <button
          onClick={() => setShowParcels(!showParcels)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gold" />
            <h3 className="text-sm font-bold text-white">My Parcels</h3>
            {parcelHistory.length > 0 && (
              <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">{parcelHistory.length}</span>
            )}
          </div>
          <ChevronRight size={16} className={`text-white/30 transition-transform ${showParcels ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {showParcels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {parcelHistory.length === 0 ? (
                <p className="text-xs text-white/40 mt-3">No parcels yet. Send one from the Parcel tab.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {parcelHistory.map((p) => {
                    const last3 = p.timeline.slice(-3);
                    return (
                      <div key={p.id} className="p-3 rounded-xl bg-dark border border-dark-border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gold font-bold">{p.id}</span>
                          <span className="text-[10px] text-white/40">{p.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-white/60 mb-2">{p.details.name} → {p.details.receiverCountry}</p>
                        {last3.map((s) => (
                          <div key={s.time + s.label} className="flex items-center gap-2 text-[10px] py-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              s.status === 'done' ? 'bg-green-500' : s.status === 'active' ? 'bg-yellow-500' : 'bg-dark-border'
                            }`} />
                            <span className="text-white/50">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FEATURE 6: OFFLINE MODE SETTINGS */}
      <div className="mx-4 mt-3 p-4 rounded-2xl border border-dark-border bg-dark-card">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Wifi size={16} className="text-gold" /> Settings
        </h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            {offlineMode ? <WifiOff size={16} className="text-yellow-500" /> : <Wifi size={16} className="text-green-500" />}
            <span className="text-xs text-white/70">Simulate Offline Mode</span>
          </div>
          <label className="relative cursor-pointer" onClick={() => setOfflineMode(!offlineMode)}>
            <div className={`w-10 h-5 rounded-full transition-colors ${offlineMode ? 'bg-gold' : 'bg-dark-border'}`} />
            <motion.div
              animate={{ x: offlineMode ? 20 : 2 }}
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow"
            />
          </label>
        </div>
        {offlineMode && (
          <div className="mt-2 p-2 rounded-lg bg-dark border border-dark-border">
            <p className="text-[10px] text-yellow-500">Offline mode active. Essential features available.</p>
          </div>
        )}
      </div>

      {/* Contact / Support */}
      <div className="mx-4 mt-3 mb-6 p-4 rounded-2xl border border-dark-border bg-dark-card">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Support</h3>
        <div className="space-y-2">
          <a href="tel:+27710779990" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold transition-colors">
            <Phone size={14} className="text-gold" /> +27 71 077 9990 (SA / Botswana)
          </a>
          <a href="tel:+263779751069" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold transition-colors">
            <Phone size={14} className="text-gold" /> +263 77 975 1069 (Zimbabwe)
          </a>
          <a href="mailto:alexiousuwenyu@gmail.com" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold transition-colors">
            <Mail size={14} className="text-gold" /> alexiousuwenyu@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
