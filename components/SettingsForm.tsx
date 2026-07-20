"use client";

import React, { useState, useTransition } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import { updateSetting } from "@/app/admin/dashboard/settings/actions";

interface Setting {
  id: number;
  key: string;
  value: string | null;
  type: string;
  group: string;
  label: string | null;
}

interface SettingsFormProps {
  initialSettings: Setting[];
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    startTransition(async () => {
      try {
        // Save each modified setting using our server action
        for (const item of settings) {
          const original = initialSettings.find((s) => s.key === item.key);
          if (original?.value !== item.value) {
            const res = await updateSetting(item.key, item.value || "");
            if (res.error) {
              setError(`Failed to save: ${item.label || item.key}`);
              return;
            }
          }
        }
        setSuccess(true);
      } catch {
        setError("An unexpected error occurred while saving settings.");
      }
    });
  };

  // Group settings
  const groups = Array.from(new Set(settings.map((s) => s.group)));
  const groupLabels: Record<string, string> = {
    general: "General Settings",
    seo: "Search Engine Optimization (SEO)",
    contact: "Contact Information",
    social: "Social Media Links",
    appearance: "Site Appearance",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.entries(groupLabels).map(([groupKey, label]) => {
        const groupItems = settings.filter((s) => s.group === groupKey);
        if (groupItems.length === 0) return null;

        return (
          <div
            key={groupKey}
            className="bg-white border border-border-editorial p-6 md:p-8 rounded-sm shadow-sm space-y-6"
          >
            <h3 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
              {label}
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {groupItems.map((item) => (
                <div key={item.key} className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
                    {item.label || item.key}
                  </label>

                  {item.type === "textarea" ? (
                    <textarea
                      value={item.value || ""}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      rows={4}
                      className="form-input resize-none"
                      disabled={isPending}
                    />
                  ) : item.type === "color" ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={item.value || "#23483B"}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-10 h-10 border border-border-editorial rounded-sm cursor-pointer"
                        disabled={isPending}
                      />
                      <input
                        type="text"
                        value={item.value || ""}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="form-input max-w-[120px]"
                        disabled={isPending}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={item.value || ""}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="form-input"
                      disabled={isPending}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 text-xs text-forest bg-green-50 p-4 border border-green-200 max-w-lg">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>Settings saved successfully. Changes are now live on the site.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-4 border border-red-200 max-w-lg">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
        >
          <Save className="w-4.5 h-4.5" />
          <span>{isPending ? "Saving Settings..." : "Save Settings"}</span>
        </button>
      </div>
    </form>
  );
}
