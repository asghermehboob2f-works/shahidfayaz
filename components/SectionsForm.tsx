"use client";

import React, { useState, useTransition } from "react";
import { Save, CheckCircle, AlertCircle, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { updateHomepageSection } from "@/app/admin/dashboard/settings/actions";
import ImageUpload from "@/components/ImageUpload";

interface HomepageSection {
  id: number;
  key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  isVisible: boolean;
}

interface SectionsFormProps {
  initialSections: HomepageSection[];
}

export default function SectionsForm({ initialSections }: SectionsFormProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [openSection, setOpenSection] = useState<string | null>("hero");
  const [isPending, startTransition] = useTransition();
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleChange = (key: string, field: keyof HomepageSection, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s))
    );
    setSuccessKey(null);
    setError("");
  };

  const handleSaveSection = async (key: string) => {
    const section = sections.find((s) => s.key === key);
    if (!section) return;

    setSuccessKey(null);
    setError("");

    startTransition(async () => {
      const res = await updateHomepageSection(key, {
        title: section.title || undefined,
        subtitle: section.subtitle || undefined,
        content: section.content || undefined,
        image: section.image || undefined,
        buttonText: section.buttonText || undefined,
        buttonLink: section.buttonLink || undefined,
        isVisible: section.isVisible,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccessKey(key);
      }
    });
  };

  const sectionKeysLabels: Record<string, string> = {
    hero: "Hero Section Banner",
    about_preview: "About Preview Block",
    featured_books: "Featured Books Section",
    quote: "Editorial Philosophy Quote",
    works: "Research Works Section",
    latest_article: "Latest Essays Preview",
    contact_banner: "Collaboration & Contact Banner",
    newsletter: "Footer Newsletter Banner",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border-editorial p-6 md:p-8 rounded-sm shadow-sm space-y-4">
        <h3 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
          Homepage Layout &amp; Content Sections
        </h3>
        <p className="text-xs text-text-secondary">
          Configure the titles, copy, buttons, and visibility status for each section of the main landing page.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = openSection === section.key;
          return (
            <div key={section.key} className="bg-white border border-border-editorial rounded-sm shadow-sm overflow-hidden">
              {/* Header Toggle */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-soft-ivory/20 transition-all"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={`w-3.5 h-3.5 rounded-full ${section.isVisible ? "bg-forest" : "bg-zinc-300"}`} />
                  <div>
                    <h4 className="font-heading text-base font-bold text-forest">
                      {sectionKeysLabels[section.key] || section.key}
                    </h4>
                    <p className="text-[10px] text-text-tertiary uppercase font-body tracking-wider">
                      Section Key: {section.key}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1.5">
                    {section.isVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-forest" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-red-600" />
                        <span>Hidden</span>
                      </>
                    )}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-forest" /> : <ChevronDown className="w-4 h-4 text-forest" />}
                </div>
              </button>

              {/* Form Content Area */}
              {isOpen && (
                <div className="p-6 border-t border-border-editorial bg-soft-ivory/10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section Visibility */}
                    <div className="md:col-span-2 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`visible-${section.key}`}
                        checked={section.isVisible}
                        onChange={(e) => handleChange(section.key, "isVisible", e.target.checked)}
                        className="w-4.5 h-4.5 accent-forest cursor-pointer"
                        disabled={isPending}
                      />
                      <label htmlFor={`visible-${section.key}`} className="text-xs font-bold text-forest cursor-pointer select-none">
                        Render this section on the Homepage
                      </label>
                    </div>

                    {/* Section Title */}
                    {section.title !== null && (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Section Title</label>
                        <input
                          type="text"
                          value={section.title || ""}
                          onChange={(e) => handleChange(section.key, "title", e.target.value)}
                          className="form-input text-xs"
                          disabled={isPending}
                        />
                      </div>
                    )}

                    {/* Section Subtitle */}
                    {section.subtitle !== null && (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Section Subtitle</label>
                        <input
                          type="text"
                          value={section.subtitle || ""}
                          onChange={(e) => handleChange(section.key, "subtitle", e.target.value)}
                          className="form-input text-xs"
                          disabled={isPending}
                        />
                      </div>
                    )}

                    {/* Button Text */}
                    {section.buttonText !== null && (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Button Label</label>
                        <input
                          type="text"
                          value={section.buttonText || ""}
                          onChange={(e) => handleChange(section.key, "buttonText", e.target.value)}
                          className="form-input text-xs"
                          disabled={isPending}
                        />
                      </div>
                    )}

                    {/* Button Link */}
                    {section.buttonLink !== null && (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Button Link</label>
                        <input
                          type="text"
                          value={section.buttonLink || ""}
                          onChange={(e) => handleChange(section.key, "buttonLink", e.target.value)}
                          className="form-input text-xs"
                          disabled={isPending}
                        />
                      </div>
                    )}

                    {/* Image URL */}
                    {section.image !== null && (
                      <div className="md:col-span-2 space-y-1">
                        <ImageUpload 
                          label="Background / Media Image"
                          value={section.image || ""} 
                          onChange={(url) => handleChange(section.key, "image", url)} 
                        />
                      </div>
                    )}

                    {/* Content Text Block */}
                    {section.content !== null && (
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Content Text / Body Copy</label>
                        <textarea
                          value={section.content || ""}
                          onChange={(e) => handleChange(section.key, "content", e.target.value)}
                          rows={5}
                          className="form-input text-xs resize-none"
                          disabled={isPending}
                        />
                      </div>
                    )}
                  </div>

                  {/* Save Status / Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-editorial">
                    <div>
                      {successKey === section.key && (
                        <span className="text-xs text-forest font-semibold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Saved successfully.</span>
                        </span>
                      )}
                      {error && successKey !== section.key && (
                        <span className="text-xs text-red-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{error}</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSection(section.key)}
                      disabled={isPending}
                      className="btn-primary py-2 px-4 text-xs font-semibold"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isPending ? "Saving..." : "Save Section"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
