"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email credentials or unauthorized account.");
      } else {
        router.refresh();
        router.push("/admin/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-ivory flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 bg-white border border-border-editorial p-8 md:p-12 shadow-editorial rounded-sm">
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
            Administrative Access
          </span>
          <h1 className="text-2.5xl font-heading text-forest font-semibold">
            Shahid Fayaz CMS
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed font-body">
            Authentication required to modify bibliography and articles.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="admin@shahidfayaz.com"
                  disabled={loading}
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-4 border border-red-200">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              <span>{loading ? "Authenticating..." : "Sign In to CMS"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary hover:text-forest transition-colors"
          >
            ← Exit to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}
