"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AppTab = "home" | "book" | "parcel" | "map" | "profile";

interface BookingDetails {
  pickup: string | null;
  dropoff: string | null;
  date: string;
  fullName: string;
  passportNumber: string;
  phoneNumber: string;
}

interface ParcelDetails {
  name: string;
  weight: string;
  value: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverCountry: "Botswana" | "Zimbabwe";
}

interface ParcelRecord {
  id: string;
  details: ParcelDetails;
  timestamp: string;
  timeline: TimelineStep[];
}

export interface TimelineStep {
  label: string;
  detail: string;
  status: "done" | "active" | "pending";
  time: string;
  hasPhoto?: boolean;
}

interface FamilyTracking {
  enabled: boolean;
  phone: string;
  sent: boolean;
}

interface CheckDoc {
  id: string;
  label: string;
  done: boolean;
}

interface LoyaltyState {
  trips: number;
  goldTier: boolean;
}

interface ReferralState {
  code: string;
  balance: number;
  referrals: { name: string; status: "pending" | "completed"; credit?: number }[];
}

interface AppState {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  booking: BookingDetails;
  setBooking: (details: Partial<BookingDetails>) => void;
  parcel: ParcelDetails;
  setParcel: (details: Partial<ParcelDetails>) => void;
  parcelHistory: ParcelRecord[];
  addParcelRecord: (record: ParcelRecord) => void;
  ticket: { id: string; vehicle: string } | null;
  setTicket: (t: { id: string; vehicle: string } | null) => void;
  trackingId: string | null;
  setTrackingId: (id: string | null) => void;
  showSuccessModal: boolean;
  setShowSuccessModal: (s: boolean) => void;
  hasActiveTrip: boolean;
  setHasActiveTrip: (v: boolean) => void;
  hasActiveParcel: boolean;
  setHasActiveParcel: (v: boolean) => void;
  sosActive: boolean;
  setSosActive: (v: boolean) => void;
  familyTracking: FamilyTracking;
  setFamilyTracking: (v: Partial<FamilyTracking>) => void;
  familyView: boolean;
  setFamilyView: (v: boolean) => void;
  checklist: CheckDoc[];
  toggleChecklist: (idx: number) => void;
  loyalty: LoyaltyState;
  addTrip: () => void;
  referral: ReferralState;
  addReferralCredit: (name: string) => void;
  offlineMode: boolean;
  setOfflineMode: (v: boolean) => void;
  silentAlarmSent: boolean;
  setSilentAlarmSent: (v: boolean) => void;
}

const defaultBooking: BookingDetails = {
  pickup: null,
  dropoff: null,
  date: new Date().toISOString().split("T")[0],
  fullName: "",
  passportNumber: "",
  phoneNumber: "",
};

const defaultParcel: ParcelDetails = {
  name: "",
  weight: "",
  value: "",
  senderName: "",
  senderPhone: "",
  receiverName: "",
  receiverPhone: "",
  receiverCountry: "Zimbabwe",
};

const defaultChecklist: CheckDoc[] = [
  { id: "passport", label: "Passport / Travel Document", done: false },
  { id: "visa", label: "Visa (if required)", done: false },
  { id: "vehicle-reg", label: "Vehicle Registration", done: false },
  { id: "insurance", label: "Cross-Border Insurance (COI)", done: false },
  { id: "zim-toll", label: "Zim Toll / Carbon Tax Receipt", done: false },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [booking, setBookingState] = useState<BookingDetails>(defaultBooking);
  const [parcel, setParcelState] = useState<ParcelDetails>(defaultParcel);
  const [parcelHistory, setParcelHistory] = useState<ParcelRecord[]>([]);
  const [ticket, setTicket] = useState<{ id: string; vehicle: string } | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasActiveTrip, setHasActiveTrip] = useState(false);
  const [hasActiveParcel, setHasActiveParcel] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [familyTracking, setFamilyState] = useState<FamilyTracking>({ enabled: false, phone: "", sent: false });
  const [familyView, setFamilyView] = useState(false);
  const [checklist, setChecklist] = useState<CheckDoc[]>(defaultChecklist);
  const [loyalty, setLoyalty] = useState<LoyaltyState>({ trips: 4, goldTier: false });
  const [referral, setReferral] = useState<ReferralState>({
    code: "LEXAR-REF-8291",
    balance: 5.0,
    referrals: [
      { name: "Tendai C.", status: "pending" },
      { name: "Farai M.", status: "completed", credit: 5 },
    ],
  });
  const [offlineMode, setOfflineMode] = useState(false);
  const [silentAlarmSent, setSilentAlarmSent] = useState(false);

  const setBooking = (details: Partial<BookingDetails>) => {
    setBookingState((prev) => ({ ...prev, ...details }));
  };

  const setParcel = (details: Partial<ParcelDetails>) => {
    setParcelState((prev) => ({ ...prev, ...details }));
  };

  const setFamilyTracking = (v: Partial<FamilyTracking>) => {
    setFamilyState((prev) => ({ ...prev, ...v }));
  };

  const addParcelRecord = (record: ParcelRecord) => {
    setParcelHistory((prev) => [record, ...prev]);
  };

  const toggleChecklist = (idx: number) => {
    setChecklist((prev) => prev.map((d, i) => i === idx ? { ...d, done: !d.done } : d));
  };

  const addTrip = () => {
    setLoyalty((prev) => {
      const trips = prev.trips + 1;
      return { trips, goldTier: trips >= 5 };
    });
  };

  const addReferralCredit = (name: string) => {
    setReferral((prev) => ({
      ...prev,
      balance: prev.balance + 5,
      referrals: prev.referrals.map((r) =>
        r.name === name ? { ...r, status: "completed" as const, credit: 5 } : r
      ),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        booking,
        setBooking,
        parcel,
        setParcel,
        parcelHistory,
        addParcelRecord,
        ticket,
        setTicket,
        trackingId,
        setTrackingId,
        showSuccessModal,
        setShowSuccessModal,
        hasActiveTrip,
        setHasActiveTrip,
        hasActiveParcel,
        setHasActiveParcel,
        sosActive,
        setSosActive,
        familyTracking,
        setFamilyTracking,
        familyView,
        setFamilyView,
        checklist,
        toggleChecklist,
        loyalty,
        addTrip,
        referral,
        addReferralCredit,
        offlineMode,
        setOfflineMode,
        silentAlarmSent,
        setSilentAlarmSent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
