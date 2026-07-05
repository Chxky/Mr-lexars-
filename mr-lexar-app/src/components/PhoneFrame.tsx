"use client";

import { ReactNode } from "react";

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[430px] min-h-screen mx-auto bg-dark relative shadow-2xl shadow-gold/5">
      {children}
    </div>
  );
}
