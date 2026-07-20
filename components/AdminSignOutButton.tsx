"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin" })}
      className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider text-red-300 hover:text-white hover:bg-red-950/40 transition-all border border-transparent hover:border-red-900/50 w-full text-left"
    >
      <LogOut className="w-4.5 h-4.5 text-red-400 shrink-0" />
      <span>Sign Out</span>
    </button>
  );
}
