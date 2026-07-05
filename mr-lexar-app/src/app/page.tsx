"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, CheckCircle, Phone, X } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import BottomTabBar from "@/components/BottomTabBar";
import HomeScreen from "@/screens/HomeScreen";
import BookSeatScreen from "@/screens/BookSeatScreen";
import SendParcelScreen from "@/screens/SendParcelScreen";
import LiveMapScreen from "@/screens/LiveMapScreen";
import ProfileScreen from "@/screens/ProfileScreen";

const slideVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const screens: Record<string, React.FC> = {
  home: HomeScreen,
  book: BookSeatScreen,
  parcel: SendParcelScreen,
  map: LiveMapScreen,
  profile: ProfileScreen,
};

function SOSButton() {
  const { hasActiveTrip, hasActiveParcel, sosActive, setSosActive } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const visible = (hasActiveTrip || hasActiveParcel) && !alertSent;

  const steps = [
    "GPS coordinates locked",
    "Mr Lexar HQ notified",
    "Emergency contact notified",
    "Driver alerted discreetly",
  ];

  const policeNumbers = [
    { country: "🇿🇼 Zimbabwe", number: "999" },
    { country: "🇧🇼 Botswana", number: "999" },
    { country: "🇿🇦 South Africa", number: "10111" },
  ];

  return (
    <>
      <AnimatePresence>
        {visible && !showConfirm && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setShowConfirm(true)}
            className="fixed bottom-20 left-4 z-[60] flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 animate-[sosPulse_2s_ease-in-out_infinite]">
              <ShieldAlert size={26} className="text-white" />
            </div>
            <span className="text-[10px] font-semibold text-red-500">SOS</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && !alertSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 px-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm bg-dark-card border-2 border-red-500/50 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">Send Emergency Alert?</h3>
              <p className="text-sm text-white/60 mb-6">
                Your live GPS location will be shared with Mr Lexar HQ and your emergency contact.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-dark-border text-white/70 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setAlertSent(true)}
                  className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/30"
                >
                  Send Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alertSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 px-6"
            onClick={() => { setAlertSent(false); setSosActive(true); setShowConfirm(false); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-dark-card border border-green-500/40 rounded-3xl p-6"
            >
              <div className="flex flex-col items-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-green-500">Alert Sent</h3>
                <p className="text-xs text-white/50 mt-1">Help is on the way. Stay calm.</p>
              </div>
              <div className="space-y-2 mb-5">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-green-500" />
                    </span>
                    <span className="text-white/80">{s}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-dark border border-dark-border mb-4">
                <p className="text-xs text-white/50 mb-2">If in immediate danger, call local police:</p>
                {policeNumbers.map((p) => (
                  <div key={p.country} className="flex items-center justify-between text-sm py-0.5">
                    <span className="text-white/70">{p.country}</span>
                    <span className="text-gold font-bold">{p.number}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setAlertSent(false); setSosActive(true); setShowConfirm(false); }}
                className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm"
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sosActive && visible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 left-4 z-[60] flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 rounded-full bg-red-700 flex items-center justify-center border-2 border-red-400">
              <CheckCircle size={26} className="text-white" />
            </div>
            <span className="text-[10px] font-semibold text-red-400">Active</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function OfflineBanner() {
  const { offlineMode, setOfflineMode } = useApp();

  return (
    <AnimatePresence>
      {offlineMode && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
        >
          <div className="bg-[#1A1A1A] border-l-4 border-gold px-4 py-2.5 flex items-center gap-2">
            <span className="text-sm">📡</span>
            <p className="text-xs text-white/80 flex-1">
              You are offline. Essential features available. Updates will sync when reconnected.
            </p>
            <button onClick={() => setOfflineMode(false)} className="text-white/30 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const { activeTab } = useApp();
  const ScreenComponent = screens[activeTab];

  return (
    <PhoneFrame>
      <OfflineBanner />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="min-h-screen"
        >
          <ScreenComponent />
        </motion.div>
      </AnimatePresence>
      <SOSButton />
      <BottomTabBar />
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
