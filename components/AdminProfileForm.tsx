"use client";

import React, { useState, useTransition } from "react";
import { Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { updateAdminProfile } from "@/app/admin/dashboard/settings/actions";

interface AdminProfileFormProps {
  initialName: string;
  initialEmail: string;
}

export default function AdminProfileForm({
  initialName,
  initialEmail,
}: AdminProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    startTransition(async () => {
      try {
        const res = await updateAdminProfile({
          name,
          email,
          password: password || undefined,
        });

        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          setPassword("");
          setConfirmPassword("");
        }
      } catch (err) {
        setError("An unexpected error occurred while updating profile.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-border-editorial p-6 md:p-8 rounded-sm shadow-sm">
      <h3 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
        Admin Account Settings
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            disabled={isPending}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            disabled={isPending}
            required
          />
        </div>

        {/* New Password */}
        <div className="space-y-1 relative">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
            New Password (Leave blank to keep current)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pr-10"
              placeholder="••••••••"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-forest"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        {password && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              disabled={isPending}
              required={!!password}
            />
          </div>
        )}
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 text-xs text-forest bg-green-50 p-4 border border-green-200">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>Profile updated successfully. Note: If you updated your email or password, please sign out and sign back in for the changes to take effect in your session.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-4 border border-red-200">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full md:w-auto"
        >
          <Save className="w-4.5 h-4.5" />
          <span>{isPending ? "Updating Account..." : "Update Account"}</span>
        </button>
      </div>
    </form>
  );
}
