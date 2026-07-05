"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Radio, MapPin } from "lucide-react";
import StatusTicker from "@/components/StatusTicker";
import { useApp } from "@/context/AppContext";

const cards = [
  {
    title: "Book a Passenger Seat",
    desc: "Travel between SA, Botswana & Zimbabwe",
    icon: ArrowRight,
    action: "book",
    color: "from-gold/20 to-gold/5",
  },
  {
    title: "Send a Parcel",
    desc: "Secure & tracked cross-border delivery",
    icon: ShieldCheck,
    action: "parcel",
    color: "from-gold/20 to-gold/5",
  },
  {
    title: "Live Vehicle Map",
    desc: "See where your ride is",
    icon: Radio,
    action: "map",
    color: "from-gold/10 to-gold/5",
  },
];

export default function HomeScreen() {
  const { setActiveTab } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-dark pb-[72px]">
      {/* Hero */}
      <div className="pt-12 pb-6 px-6 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gold tracking-wide"
        >
          Mr Lexar&apos;s
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm text-white/70 mt-1 tracking-wider uppercase"
        >
          Cross Border Transportation
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-16 h-0.5 bg-gold/50 mt-3 origin-center"
        />
      </div>

      {/* Golden Cards */}
      <div className="px-4 space-y-3.5">
        {cards.map((card, i) => (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i + 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(card.action as any)}
            className="w-full text-left"
          >
            <div className="relative overflow-hidden rounded-2xl bg-dark-card border border-dark-border p-5 flex items-center gap-4 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <card.icon size={24} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{card.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gold flex-shrink-0" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Status Ticker */}
      <div className="mt-5">
        <StatusTicker />
      </div>

      {/* Route Mini Map */}
      <div className="px-4 mt-5 mb-6">
        <div className="rounded-2xl bg-dark-card border border-dark-border p-4">
          <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
            Active Route Corridor
          </h4>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Johannesburg</span>
            <div className="flex-1 mx-2 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" />
            <span>Gaborone</span>
            <div className="flex-1 mx-2 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" />
            <span>Francistown</span>
            <div className="flex-1 mx-2 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" />
            <span>Harare</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gold-light/60">
            <MapPin size={12} />
            <span>3 Active Vehicles</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/35 px-4 pb-2">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>256-bit AES encrypted &bull; Protected per POPIA</span>
      </div>
    </div>
  );
}
