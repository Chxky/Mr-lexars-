"use client";

import { motion } from "framer-motion";
import { Home, BusFront, Package, MapPin, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "book", label: "Book Seat", icon: BusFront },
  { key: "parcel", label: "Send Parcel", icon: Package },
  { key: "map", label: "Live Map", icon: MapPin },
  { key: "profile", label: "Profile", icon: User },
] as const;

export default function BottomTabBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[72px] bg-dark-card border-t border-dark-border flex items-center justify-around px-2 z-50">
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className="relative flex flex-col items-center justify-center gap-0.5 w-16 h-full py-1"
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -top-px w-8 h-0.5 bg-gold rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={22}
              className={isActive ? "text-gold" : "text-zinc-500"}
            />
            <span
              className={`text-[10px] leading-tight ${
                isActive ? "text-gold font-semibold" : "text-zinc-500"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
