"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MapPin, FileText, ChevronDown, ChevronRight, Camera } from "lucide-react";
import { useApp, TimelineStep } from "@/context/AppContext";

const defaultTimeline: TimelineStep[] = [
  { label: "Collected from sender", detail: "📍 Johannesburg, 45 Main Street. Photo attached.", status: "done", time: "08:15 AM", hasPhoto: true },
  { label: "Departed Mr Lexar JHB depot", detail: "Loaded onto Mr Lexar 3. Driver: Tawanda M.", status: "done", time: "11:30 AM" },
  { label: "At Groblersbrug border (SA side)", detail: "Awaiting customs clearance. Estimated wait: 45 min.", status: "active", time: "03:45 PM" },
  { label: "Clear Botswana customs (Expected)", detail: "Botswana customs clearance procedure.", status: "pending", time: "05:30 PM" },
  { label: "In transit to Francistown (Expected)", detail: "Estimated driving time: 2.5 hours.", status: "pending", time: "06:30 PM" },
  { label: "Arrive Francistown depot (Expected)", detail: "Scheduled arrival at Francistown sorting facility.", status: "pending", time: "10:00 PM" },
  { label: "Out for delivery (Expected)", detail: "Local courier will deliver to recipient.", status: "pending", time: "Tomorrow 08:00 AM" },
  { label: "Delivered to recipient (Expected)", detail: "✅ Recipient: Farai M. • Signature captured • Delivery photo attached.", status: "pending", time: "Tomorrow 10:00 AM", hasPhoto: true },
];

export default function SendParcelScreen() {
  const { parcel, setParcel, setTrackingId, setActiveTab, setHasActiveParcel, addParcelRecord, offlineMode } = useApp();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackId, setTrackId] = useState("");
  const [timeline, setTimeline] = useState<TimelineStep[]>(defaultTimeline);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const calculatePrice = () => {
    const val = parseFloat(parcel.value) || 0;
    setCalculatedPrice(10 + val * 0.05);
  };

  const handleSend = () => {
    const id = "ML-TRK-" + Math.floor(1000 + Math.random() * 9000);
    setTrackId(id);
    setTrackingId(id);
    setHasActiveParcel(true);
    addParcelRecord({ id, details: { ...parcel }, timestamp: new Date().toLocaleString(), timeline });
    setShowSuccess(true);
  };

  const customsText = `CUSTOMS DECLARATION
-------------------
Parcel: ${parcel.name || "N/A"}
Weight: ${parcel.weight || "N/A"} kg
Declared Value: $${parseFloat(parcel.value) || 0}
Sender: ${parcel.senderName || "N/A"} (${parcel.senderPhone || "N/A"})
Receiver: ${parcel.receiverName || "N/A"} (${parcel.receiverPhone || "N/A"})
Destination: ${parcel.receiverCountry}

This parcel contains personal/business goods
transported under Mr Lexar's Cross Border service.
All items declared as per SADC customs regulations.`;

  return (
    <div className="flex flex-col min-h-screen bg-dark pb-[72px]">
      <div className="pt-4 pb-2 px-4">
        <h2 className="text-xl font-bold text-gold">Send a Parcel</h2>
        <p className="text-xs text-white/50 mt-0.5">Cross-border parcel delivery</p>
      </div>

      <div className="px-4 space-y-3">
        {/* Parcel Details */}
        <div className="p-4 rounded-2xl border border-gold/20 bg-dark-card space-y-3">
          <h3 className="text-sm font-semibold text-gold">Parcel Details</h3>
          <input
            placeholder="Parcel Name / Description"
            value={parcel.name}
            onChange={(e) => setParcel({ name: e.target.value })}
            className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Weight (kg)"
              type="number"
              value={parcel.weight}
              onChange={(e) => setParcel({ weight: e.target.value })}
              className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <input
              placeholder="Value ($)"
              type="number"
              value={parcel.value}
              onChange={(e) => setParcel({ value: e.target.value })}
              className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Sender */}
        <div className="p-4 rounded-2xl border border-dark-border bg-dark-card space-y-3">
          <h3 className="text-sm font-semibold text-white/70">Sender</h3>
          <input
            placeholder="Full Name"
            value={parcel.senderName}
            onChange={(e) => setParcel({ senderName: e.target.value })}
            className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <input
            placeholder="Phone Number"
            type="tel"
            value={parcel.senderPhone}
            onChange={(e) => setParcel({ senderPhone: e.target.value })}
            className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Receiver */}
        <div className="p-4 rounded-2xl border border-dark-border bg-dark-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">Receiver</h3>
            <div className="flex gap-1.5">
              {(["Zimbabwe", "Botswana"] as const).map((country) => (
                <button
                  key={country}
                  onClick={() => setParcel({ receiverCountry: country })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    parcel.receiverCountry === country
                      ? "bg-gold text-black"
                      : "bg-dark-border text-white/50"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
          <input
            placeholder="Full Name"
            value={parcel.receiverName}
            onChange={(e) => setParcel({ receiverName: e.target.value })}
            className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <input
            placeholder="Phone Number"
            type="tel"
            value={parcel.receiverPhone}
            onChange={(e) => setParcel({ receiverPhone: e.target.value })}
            className="w-full p-3 rounded-xl bg-dark border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Customs Declaration */}
        <div className="p-4 rounded-2xl border border-gold/20 bg-dark-card">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-gold" />
            <h3 className="text-sm font-semibold text-gold">Customs Declaration</h3>
          </div>
          <pre className="text-xs text-white/50 font-sans whitespace-pre-wrap leading-relaxed">
            {customsText}
          </pre>
        </div>

        {/* Calculate Price */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculatePrice}
          className="w-full py-3 rounded-2xl border border-gold text-gold font-semibold text-sm"
        >
          Calculate Price
        </motion.button>

        {calculatedPrice !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-gold/10 to-dark-card border border-gold/30 flex items-center justify-between"
          >
            <span className="text-sm text-white/70">Estimated Total</span>
            <span className="text-xl font-bold text-gold">${calculatedPrice.toFixed(2)}</span>
          </motion.div>
        )}

        {/* Send Button / Offline Ticket */}
        {offlineMode ? (
          <div className="p-4 rounded-2xl border border-gold/30 bg-dark-card text-center mb-6">
            <p className="text-sm text-gold font-semibold mb-2">📱 View Your Offline Ticket</p>
            <p className="text-xs text-white/50 mb-3">Show this to your driver. Valid offline.</p>
            <div className="bg-dark rounded-xl p-3 border border-dark-border">
              <div className="flex justify-center mb-2">
                <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center border border-dashed border-white/10">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <p>Parcel: {parcel.name || "N/A"}</p>
                <p>Tracking: {trackId || "Pending"}</p>
              </div>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!parcel.name || !parcel.senderName || !parcel.receiverName}
            className="w-full mb-6 py-3.5 rounded-2xl bg-gold text-black font-bold text-base shadow-lg shadow-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Send Parcel
          </motion.button>
        )}
      </div>

      {/* Success Modal + Chain of Custody Timeline (Feature 4) */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 pt-10 overflow-y-auto"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-dark-card border border-gold/30 rounded-3xl p-6 relative mb-8"
            >
              <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={20} /></button>
              <div className="flex flex-col items-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                  <Check size={32} className="text-gold" />
                </div>
                <h3 className="text-lg font-bold text-gold mb-1">Parcel Registered!</h3>
                <p className="text-xs text-white/50 mb-1">Tracking ID: <span className="text-gold font-bold">{trackId}</span></p>
              </div>

              {/* Chain of Custody Timeline */}
              <div className="w-full mb-4">
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Chain of Custody</h4>
                <div className="relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-dark-border" />
                  {timeline.map((step, i) => {
                    const dotColor = step.status === "done" ? "bg-green-500" : step.status === "active" ? "bg-yellow-500" : "bg-dark-border";
                    const textColor = step.status === "done" ? "text-white/80" : step.status === "active" ? "text-white" : "text-white/30";
                    return (
                      <div key={i} className="relative pl-8 pb-4 last:pb-0">
                        <div className={`absolute left-[6px] top-1.5 w-3 h-3 rounded-full ${dotColor} border-2 border-dark-card`} />
                        <div
                          className="cursor-pointer"
                          onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-medium ${textColor}`}>{step.time} – {step.label}</span>
                            {step.detail && (
                              <span className="text-white/30 mt-0.5 flex-shrink-0">
                                {expandedStep === i ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              </span>
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedStep === i && step.detail && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{step.detail}</p>
                                {step.hasPhoto && (
                                  <button className="flex items-center gap-1 text-[10px] text-gold mt-1">
                                    <Camera size={10} /> View Photo
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button onClick={() => setShowSuccess(false)} className="flex-1 py-3 rounded-2xl border border-gold text-gold font-bold text-sm">Close</button>
                <button onClick={() => { setShowSuccess(false); setActiveTab("map"); }} className="flex-1 py-3 rounded-2xl bg-gold text-black font-bold text-sm flex items-center justify-center gap-1.5">
                  <MapPin size={16} /> Track on Map
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
