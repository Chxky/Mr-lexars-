"use client";

export default function StatusTicker() {
  return (
    <div className="w-full overflow-hidden bg-dark-card border-y border-dark-border py-2.5">
      <div className="relative flex overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll gap-12">
          <span className="text-xs text-gold-light/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            Vehicle 1: Approaching Francistown
          </span>
          <span className="text-xs text-gold-light/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block animate-pulse" />
            Vehicle 2: Clearing Kazungula Border
          </span>
          <span className="text-xs text-gold-light/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block animate-pulse" />
            Beitbridge: Moderate Traffic
          </span>
          <span className="text-xs text-gold-light/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            Vehicle 3: Departing Johannesburg
          </span>
        </div>
      </div>
    </div>
  );
}
