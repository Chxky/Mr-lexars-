"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, AlertTriangle, WifiOff } from "lucide-react";
import { useApp } from "@/context/AppContext";

const routeCoords: { name: string; lat: number; lng: number }[] = [
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Gaborone", lat: -24.6282, lng: 25.9231 },
  { name: "Francistown", lat: -21.1742, lng: 27.5125 },
  { name: "Kazungula", lat: -17.7877, lng: 25.2669 },
  { name: "Bulawayo", lat: -20.1483, lng: 28.5818 },
  { name: "Harare", lat: -17.8252, lng: 31.0335 },
];

const vehicleData = [
  { label: "Mr Lexar 1 (3 passengers)", type: "passenger" as const, lat: -22.6, lng: 27.1, speed: "80 km/h", eta: "45 mins to Francistown", status: "On Route" },
  { label: "Mr Lexar 2 (5 parcels)", type: "parcel" as const, lat: -17.79, lng: 25.27, speed: "35 km/h", eta: "Clearing border", status: "At Kazungula Border" },
  { label: "Mr Lexar 3 (2 passengers)", type: "passenger" as const, lat: -25.3, lng: 27.2, speed: "95 km/h", eta: "1h 20min to Gaborone", status: "On Route" },
];

const busSvg =
  '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="#D4AF37"/><rect x="6" y="8" width="12" height="6" rx="1" fill="#0B0B0C"/><rect x="8" y="9" width="3" height="4" rx="0.5" fill="#D4AF37" opacity="0.5"/><rect x="13" y="9" width="3" height="4" rx="0.5" fill="#D4AF37" opacity="0.5"/><rect x="10" y="4" width="4" height="3" rx="1" fill="#D4AF37"/><circle cx="8" cy="18" r="2.5" fill="#D4AF37"/><circle cx="16" cy="18" r="2.5" fill="#D4AF37"/></svg>';
const parcelSvg =
  '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="12" rx="2" fill="#D4AF37"/><rect x="5" y="7" width="14" height="4" rx="1" fill="#B8962F"/><line x1="12" y1="7" x2="12" y2="19" stroke="#0B0B0C" stroke-width="1.5"/><line x1="5" y1="13" x2="19" y2="13" stroke="#0B0B0C" stroke-width="0.8" opacity="0.4"/></svg>';

export default function LiveMapScreen() {
  const mapRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const { familyView, setFamilyView, checklist, toggleChecklist, offlineMode, silentAlarmSent, setSilentAlarmSent } = useApp();
  const [showSilentConfirm, setShowSilentConfirm] = useState(false);

  useEffect(() => {
    if (initialized.current || !mapRef.current) return;
    initialized.current = true;

    (async () => {
      const L = (await import("leaflet")).default;

      const map = L.map(mapRef.current!, {
        center: [-22.0, 26.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const routeLatLngs = routeCoords.map((c) => [c.lat, c.lng] as [number, number]);
      L.polyline(routeLatLngs, {
        color: "#D4AF37",
        weight: 3,
        opacity: 0.6,
        dashArray: "8,6",
      }).addTo(map);

      const goldIcon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:#D4AF37;border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(212,175,55,0.5);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      routeCoords.forEach((c) => {
        L.marker([c.lat, c.lng], { icon: goldIcon })
          .addTo(map)
          .bindPopup(
            `<div style="text-align:center;font-weight:600;font-size:13px;color:#D4AF37">${c.name}</div>`
          );
      });

      vehicleData.forEach((v) => {
        const svg = v.type === "passenger" ? busSvg : parcelSvg;
        const vi = L.divIcon({
          className: "",
          html: `<div style="position:relative;width:36px;height:36px;">
            <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #D4AF37;animation:pulseGlow 2s ease-in-out infinite;box-shadow:0 0 12px rgba(212,175,55,0.4);"></div>
            <div style="position:absolute;inset:4px;border-radius:50%;background:rgba(212,175,55,0.15);display:flex;align-items:center;justify-content:center;">${svg}</div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([v.lat, v.lng], { icon: vi })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:160px">
              <div style="font-weight:600;font-size:14px;color:#D4AF37;margin-bottom:4px">${v.label}</div>
              <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#4ade80;margin-bottom:8px">
                <span style="width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block"></span>
                ${v.status}
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;font-size:11px">
                <div style="background:#0B0B0C;border-radius:8px;padding:6px;text-align:center"><span style="color:rgba(255,255,255,0.4);display:block">Speed</span><span style="color:#D4AF37;font-weight:600">${v.speed}</span></div>
                <div style="background:#0B0B0C;border-radius:8px;padding:6px;text-align:center"><span style="color:rgba(255,255,255,0.4);display:block">ETA</span><span style="color:#D4AF37;font-weight:600;font-size:10px">${v.eta}</span></div>
                <div style="background:#0B0B0C;border-radius:8px;padding:6px;text-align:center"><span style="color:rgba(255,255,255,0.4);display:block">Status</span><span style="color:#4ade80;font-weight:600;font-size:10px">${v.status.split(" ")[0]}</span></div>
              </div>
            </div>`);
      });
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-dark pb-[72px]">
      <div className="pt-4 pb-2 px-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gold">Live Map</h2>
          <p className="text-xs text-white/50 mt-0.5">Tracking corridor: SA → Botswana → Zim</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Family View Toggle (Feature 2) */}
          <button
            onClick={() => setFamilyView(!familyView)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
              familyView ? "bg-gold text-black" : "bg-dark-border text-white/60"
            }`}
          >
            <Users size={14} />
            Family
          </button>
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {offlineMode ? "Cached" : "Live"}
          </div>
        </div>
      </div>

      <div className="flex-1 mx-3 mb-3 relative overflow-hidden rounded-2xl border border-dark-border">
        <div ref={mapRef} className="w-full h-full min-h-[420px]" />

        {/* Offline Indicator on Map (Feature 6) */}
        <AnimatePresence>
          {offlineMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 left-3 z-20 bg-dark-card/90 backdrop-blur-sm border border-dark-border rounded-xl px-3 py-2"
            >
              <p className="text-[10px] text-white/50">Map data cached for your route.</p>
              <p className="text-[10px] text-white/50">Live updates paused.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Family View Card (Feature 2) */}
        <AnimatePresence>
          {familyView && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 z-20 bg-dark-card border-t border-gold/30 rounded-t-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                  <Users size={16} /> Family View
                </h4>
                <button onClick={() => setFamilyView(false)} className="text-white/30"><X size={16} /></button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Passenger</span>
                  <span className="text-white font-medium">Tendai M.</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Vehicle</span>
                  <span className="text-white font-medium">Mr Lexar 3</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full">🟢 Departed Johannesburg</span>
                  <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">🟡 At Beitbridge Border</span>
                  <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">⚪ En route to Harare</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60 mt-1">
                  <span>ETA: <span className="text-gold font-medium">6:30 PM</span></span>
                  <span className="text-white/30">View only – no driver contact</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Silent Alarm (Feature 3 - Driver SOS) */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setShowSilentConfirm(true)}
          className="text-xs text-red-500/50 hover:text-red-500 transition-colors"
        >
          🚨 Trigger Silent Alarm
        </button>
      </div>

      {/* Silent Alarm Confirmation */}
      <AnimatePresence>
        {showSilentConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 px-6"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="w-full max-w-sm bg-dark-card border border-red-500/30 rounded-3xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-red-500" />
                <h3 className="text-base font-bold text-red-500">Trigger Silent Alarm?</h3>
              </div>
              <p className="text-xs text-white/60 mb-4">
                A priority alert will be sent to Mr Lexar HQ with your vehicle GPS, driver name, and timestamp.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowSilentConfirm(false)} className="flex-1 py-2.5 rounded-2xl bg-dark-border text-white/70 text-sm font-medium">
                  Cancel
                </button>
                <button onClick={() => { setSilentAlarmSent(true); setShowSilentConfirm(false); }} className="flex-1 py-2.5 rounded-2xl bg-red-600 text-white text-sm font-bold">
                  Send Silent Alarm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {silentAlarmSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-3 pb-2"
          >
            <div className="p-3 rounded-xl bg-green-400/10 border border-green-400/30">
              <p className="text-xs text-green-400 font-medium">Silent alarm sent. HQ tracking your position.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
