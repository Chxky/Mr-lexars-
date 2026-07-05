"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, Check, X, QrCode, Star, ShieldCheck, Users, MessageCircle, ExternalLink } from "lucide-react";
import { useApp } from "@/context/AppContext";

const cities = [
  "Johannesburg",
  "Gaborone",
  "Francistown",
  "Kazungula",
  "Bulawayo",
  "Harare",
];

const trips = [
  { vehicle: "Mr Lexar Shuttle 03", depart: "06:00 AM", seats: 4, price: 80 },
  { vehicle: "Mr Lexar Shuttle 07", depart: "10:30 AM", seats: 6, price: 75 },
  { vehicle: "Mr Lexar Shuttle 12", depart: "02:00 PM", seats: 3, price: 90 },
  { vehicle: "Mr Lexar Express 02", depart: "08:00 PM", seats: 8, price: 65 },
];

const driver = {
  name: "Tawanda M.",
  rating: 4.9,
  trips: 127,
  languages: "English • Shona • Setswana",
  experience: "6 years cross-border experience • 1,200+ trips completed",
  badges: ["License Verified", "Cross-Border Permit Active", "Insurance Valid"],
  reviews: [
    "Very professional, helped us at the border. – Chipo M.",
    "Safe driver, arrived on time. – John K.",
    "Best cross-border service I've used. – Thabo S.",
  ],
};

const familyMsg = "Tendai M. is traveling with Mr Lexar from Johannesburg to Harare. Track the trip live here: [link]";

export default function BookSeatScreen() {
  const { booking, setBooking, ticket, setTicket, showSuccessModal, setShowSuccessModal, setHasActiveTrip, addTrip, familyTracking, setFamilyTracking } = useApp();
  const [showBorder, setShowBorder] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDriver, setShowDriver] = useState(false);
  const [showFamilyInput, setShowFamilyInput] = useState(false);

  const getRouteIndex = (city: string) => cities.indexOf(city);

  const selectPickup = (city: string) => {
    if (booking.dropoff === city) return;
    setBooking({ pickup: city });
    if (booking.dropoff && getRouteIndex(city) >= getRouteIndex(booking.dropoff)) {
      setBooking({ dropoff: null });
    }
  };

  const selectDropoff = (city: string) => {
    if (booking.pickup === city) return;
    if (booking.pickup && getRouteIndex(city) <= getRouteIndex(booking.pickup)) return;
    setBooking({ dropoff: city });
  };

  const selectedTrip = trips[Math.abs(
    (booking.pickup?.length ?? 0) + (booking.dropoff?.length ?? 0)
  ) % trips.length];

  const handleBook = () => {
    if (!booking.pickup || !booking.dropoff || !booking.fullName) return;
    const id = "ML-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setTicket({ id, vehicle: selectedTrip.vehicle });
    setHasActiveTrip(true);
    addTrip();
    setShowSuccessModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark pb-[72px]">
      <div className="pt-4 pb-2 px-4">
        <h2 className="text-xl font-bold text-gold">Book a Seat</h2>
        <p className="text-xs text-white/50 mt-0.5">Select your route and travel details</p>
      </div>

      <div className="px-4">
        {/* Route Selector */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {cities.map((city) => {
              const isPickup = booking.pickup === city;
              const isDropoff = booking.dropoff === city;
              const idx = getRouteIndex(city);
              const pickupIdx = booking.pickup ? getRouteIndex(booking.pickup) : -1;
              const enabled = !booking.pickup || idx > pickupIdx || isPickup;

              return (
                <motion.button
                  key={city}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!isPickup && !isDropoff) {
                      if (!booking.pickup) selectPickup(city);
                      else if (enabled) selectDropoff(city);
                    }
                  }}
                  className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    isPickup
                      ? "bg-gold text-black border-gold shadow-lg shadow-gold/20"
                      : isDropoff
                      ? "border-gold text-gold bg-transparent"
                      : enabled
                      ? "border-dark-border text-white/60 hover:border-white/20"
                      : "border-dark-border text-white/20 cursor-not-allowed opacity-40"
                  }`}
                >
                  {city}
                  {isPickup && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-black text-[8px] font-bold">P</span>
                    </span>
                  )}
                  {isDropoff && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-black text-[8px] font-bold">D</span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Arrow between selected cities */}
        {booking.pickup && booking.dropoff && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 my-3 text-sm"
          >
            <span className="text-gold font-medium">{booking.pickup}</span>
            <ArrowRight size={16} className="text-gold" />
            <span className="text-gold font-medium">{booking.dropoff}</span>
          </motion.div>
        )}

        {/* Date Selector */}
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full mt-2 p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between"
        >
          <span className="text-sm text-white/70">Select Date</span>
          <span className="text-sm text-gold">
            {booking.date ? new Date(booking.date).toLocaleDateString("en-ZA", {
              weekday: "short", day: "numeric", month: "short", year: "numeric",
            }) : "Tap to select"}
          </span>
        </button>

        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <input
                type="date"
                value={booking.date}
                onChange={(e) => { setBooking({ date: e.target.value }); setShowCalendar(false); }}
                className="w-full mt-2 p-3 rounded-xl bg-dark-card border border-dark-border text-white text-sm focus:outline-none focus:border-gold"
                min={new Date().toISOString().split("T")[0]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trip Summary */}
        {booking.pickup && booking.dropoff && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-gold/10 to-dark-card border border-gold/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gold">{selectedTrip.vehicle}</h3>
              <span className="text-lg font-bold text-gold">${selectedTrip.price}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-white/40 text-xs">Departs</span>
                <p className="text-white font-medium">{selectedTrip.depart}</p>
              </div>
              <div>
                <span className="text-white/40 text-xs">Available Seats</span>
                <p className="text-white font-medium">{selectedTrip.seats} seats</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* FEATURE 1: DRIVER PROFILE */}
        {booking.pickup && booking.dropoff && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl border border-gold/20 bg-dark-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center border-2 border-gold/50 flex-shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 3.6-8 8-8s8 4 8 8"/></svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{driver.name}</h4>
                  <span className="flex items-center gap-1 text-xs text-gold">
                    <Star size={12} className="fill-gold" /> {driver.rating} ({driver.trips} trips)
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">{driver.languages}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {driver.badges.map((b) => (
                <span key={b} className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                  <Check size={10} /> {b}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/40 mb-2">{driver.experience}</p>
            <button
              onClick={() => setShowDriver(true)}
              className="text-xs text-gold font-medium flex items-center gap-1"
            >
              View Full Profile <ExternalLink size={12} />
            </button>
          </motion.div>
        )}

        {/* Driver Full Profile Modal */}
        <AnimatePresence>
          {showDriver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
              onClick={() => setShowDriver(false)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-dark-card border border-gold/30 rounded-3xl p-6 relative"
              >
                <button onClick={() => setShowDriver(false)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={20} /></button>
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center border-2 border-gold/50 mb-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 3.6-8 8-8s8 4 8 8"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">{driver.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gold mt-1">
                    <Star size={14} className="fill-gold" /> {driver.rating} &bull; {driver.trips} trips
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 bg-gold/10 px-4 py-2 rounded-full border border-gold/20">
                    <ShieldCheck size={16} className="text-gold" />
                    <span className="text-xs font-semibold text-gold">100% Safety Record</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Reviews</h4>
                  {driver.reviews.map((r) => (
                    <div key={r} className="p-3 rounded-xl bg-dark border border-dark-border">
                      <p className="text-xs text-white/70 leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowDriver(false)} className="w-full mt-4 py-3 rounded-2xl bg-gold text-black font-bold text-sm">
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Passenger Form */}
        <div className="mt-4 space-y-3">
          <input
            placeholder="Full Name"
            value={booking.fullName}
            onChange={(e) => setBooking({ fullName: e.target.value })}
            className="w-full p-3.5 rounded-xl bg-dark-card border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <input
            placeholder="Passport Number"
            value={booking.passportNumber}
            onChange={(e) => setBooking({ passportNumber: e.target.value })}
            className="w-full p-3.5 rounded-xl bg-dark-card border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <input
            placeholder="Phone Number"
            type="tel"
            value={booking.phoneNumber}
            onChange={(e) => setBooking({ phoneNumber: e.target.value })}
            className="w-full p-3.5 rounded-xl bg-dark-card border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Border Assist */}
        <div className="mt-4">
          <button
            onClick={() => setShowBorder(!showBorder)}
            className="w-full p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between"
          >
            <span className="text-sm text-gold font-medium">Border Assist</span>
            {showBorder ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} className="text-gold" />}
          </button>
          <AnimatePresence>
            {showBorder && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 space-y-2 mt-1">
                  {[
                    "Botswana Visa: Check Requirements",
                    "Zimbabwe Visa: KAZA Univisa Available",
                    "Documents: Passport > 6 months validity",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-white/60">
                      <Check size={14} className="text-gold flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBook}
          disabled={!booking.pickup || !booking.dropoff || !booking.fullName}
          className="w-full mt-5 mb-6 py-3.5 rounded-2xl bg-gold text-black font-bold text-base shadow-lg shadow-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Confirm Booking
        </motion.button>
      </div>

      {/* Success Modal + Family Tracking (Feature 2) */}
      <AnimatePresence>
        {showSuccessModal && ticket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 pt-12 overflow-y-auto"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-dark-card border border-gold/30 rounded-3xl p-6 relative mb-8"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                  <Check size={32} className="text-gold" />
                </div>
                <h3 className="text-lg font-bold text-gold mb-1">Booking Confirmed!</h3>
                <p className="text-xs text-white/50 mb-5">Your digital ticket is ready</p>

                {/* Digital Ticket */}
                <div className="w-full bg-dark border border-dark-border rounded-2xl p-4 mb-4">
                  <div className="flex justify-center mb-3">
                    <div className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/10">
                      <QrCode size={48} className="text-gold" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/40">Ticket</span>
                      <span className="text-white font-medium">{ticket.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Passenger</span>
                      <span className="text-white font-medium">{booking.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Route</span>
                      <span className="text-white font-medium">{booking.pickup} → {booking.dropoff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Vehicle</span>
                      <span className="text-white font-medium">MR LEXAR ZW-01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Date</span>
                      <span className="text-white font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Family Tracking Section */}
                <div className="w-full p-4 rounded-2xl bg-dark border border-dark-border mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={16} className="text-gold" />
                    <h4 className="text-sm font-semibold text-white">Share trip with family?</h4>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer mb-3">
                    <span className="text-xs text-white/60">Yes, send them live tracking</span>
                    <div className="relative" onClick={() => setFamilyTracking({ enabled: !familyTracking.enabled })}>
                      <div className={`w-10 h-5 rounded-full transition-colors ${familyTracking.enabled ? 'bg-gold' : 'bg-dark-border'}`} />
                      <motion.div
                        animate={{ x: familyTracking.enabled ? 20 : 2 }}
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow"
                      />
                    </div>
                  </label>
                  <AnimatePresence>
                    {familyTracking.enabled && !familyTracking.sent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <input
                          placeholder="Family member's WhatsApp number"
                          value={familyTracking.phone}
                          onChange={(e) => setFamilyTracking({ phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-dark-card border border-dark-border text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold mb-2"
                        />
                        <p className="text-[10px] text-white/40 mb-2">
                          They'll get a link to track your vehicle, see border crossings, and get arrival alerts. No app needed.
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (familyTracking.phone.length >= 8) {
                              setFamilyTracking({ sent: true });
                            }
                          }}
                          className="w-full py-2.5 rounded-xl bg-gold text-black font-semibold text-sm flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={16} /> Send Link
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {familyTracking.sent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 rounded-xl bg-green-400/10 border border-green-400/30"
                    >
                      <p className="text-xs text-green-400 font-medium mb-1">📱 Tracking link sent to {familyTracking.phone}</p>
                      <div className="p-2 rounded-lg bg-dark-card mt-2">
                        <p className="text-[10px] text-white/60 leading-relaxed">
                          <span className="text-gold">WhatsApp Preview:</span><br />
                          {familyMsg}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
