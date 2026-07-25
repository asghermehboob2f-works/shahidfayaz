"use client";

import React, { useState, useTransition } from "react";
import { Save, CheckCircle, AlertCircle, Eye, EyeOff, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { updateHomepageSection } from "@/app/admin/dashboard/settings/actions";
import ImageUpload from "@/components/ImageUpload";

interface HeroStat {
  value: string;
  label: string;
}

interface HomepageSection {
  id: number;
  key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  extraData?: string | null;
  isVisible: boolean;
}

interface SectionsFormProps {
  initialSections: HomepageSection[];
}

const defaultStats: HeroStat[] = [
  { value: "03", label: "Published Books" },
  { value: "LSE", label: "Doctoral Fellow" },
  { value: "12+", label: "Global Honors" },
];

const defaultMarquee: string[] = [
  "POST-COLONIAL PHILOSOPHY",
  "GEOPOLITICAL MEMORY",
  "SUB-HIMALAYAN ARCHIVES",
  "LITERARY SOVEREIGNTY",
  "THE ANATOMY OF SILENCES",
];

export default function SectionsForm({ initialSections }: SectionsFormProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [openSection, setOpenSection] = useState<string | null>("hero");
  const [isPending, startTransition] = useTransition();
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const heroSec = initialSections.find((s) => s.key === "hero");
  const initialHeroStats = (() => {
    if (!heroSec?.extraData) return defaultStats;
    try {
      const parsed = JSON.parse(heroSec.extraData);
      if (Array.isArray(parsed?.stats)) return parsed.stats;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return defaultStats;
  })();

  const initialHeroMarquee = (() => {
    if (!heroSec?.extraData) return defaultMarquee;
    try {
      const parsed = JSON.parse(heroSec.extraData);
      if (Array.isArray(parsed?.marquee)) return parsed.marquee;
    } catch (e) {}
    return defaultMarquee;
  })();

  const [heroStats, setHeroStats] = useState<HeroStat[]>(initialHeroStats);
  const [heroMarquee, setHeroMarquee] = useState<string[]>(initialHeroMarquee);

  const handleStatChange = (index: number, field: "value" | "label", val: string) => {
    setHeroStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddStat = () => {
    if (heroStats.length < 5) {
      setHeroStats((prev) => [...prev, { value: "01", label: "New Honor" }]);
    }
  };

  const handleRemoveStat = (index: number) => {
    setHeroStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMarqueeChange = (index: number, val: string) => {
    setHeroMarquee((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddMarqueeItem = () => {
    setHeroMarquee((prev) => [...prev, "NEW PHILOSOPHICAL TOPIC"]);
  };

  const handleRemoveMarqueeItem = (index: number) => {
    setHeroMarquee((prev) => prev.filter((_, i) => i !== index));
  };

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
        extraData: key === "hero" ? JSON.stringify({ stats: heroStats, marquee: heroMarquee }) : undefined,
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

                    {/* Hero Accolades / Stats Controls */}
                    {section.key === "hero" && (
                      <div className="md:col-span-2 space-y-3 pt-4 border-t border-border-editorial">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-[11px] uppercase tracking-wider font-bold text-forest block">
                              Hero Accolades Bar (Stats)
                            </label>
                            <p className="text-[10px] text-text-tertiary">
                              Customize the accolade stats displayed on the Hero section of the homepage.
                            </p>
                          </div>
                          {heroStats.length < 5 && (
                            <button
                              type="button"
                              onClick={handleAddStat}
                              className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-gold" />
                              <span>Add Stat</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          {heroStats.map((stat, idx) => (
                            <div key={idx} className="bg-white border border-border-editorial p-3 rounded-xs space-y-2 relative">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] uppercase font-bold text-text-tertiary">Stat #{idx + 1}</span>
                                {heroStats.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveStat(idx)}
                                    className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                    title="Remove Stat"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-semibold text-text-secondary uppercase">Value / Code (e.g. 03, LSE, 12+)</label>
                                <input
                                  type="text"
                                  value={stat.value}
                                  onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                                  className="form-input text-xs py-1 px-2 font-bold font-heading"
                                  disabled={isPending}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-semibold text-text-secondary uppercase">Label / Title</label>
                                <input
                                  type="text"
                                  value={stat.label}
                                  onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                                  className="form-input text-xs py-1 px-2"
                                  disabled={isPending}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Hero Running Marquee Ticker Controls */}
                        <div className="space-y-3 pt-4 border-t border-border-editorial">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-[11px] uppercase tracking-wider font-bold text-forest block">
                                Hero Running Marquee Ticker Items
                              </label>
                              <p className="text-[10px] text-text-tertiary">
                                Customize the continuous sliding text phrases displayed across the bottom of the Hero banner.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddMarqueeItem}
                              className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-gold" />
                              <span>Add Tag Phrase</span>
                            </button>
                          </div>

                          <div className="space-y-2 pt-1">
                            {heroMarquee.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-text-tertiary w-6 shrink-0">#{idx + 1}</span>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleMarqueeChange(idx, e.target.value)}
                                  className="form-input text-xs py-1 px-2.5 uppercase font-medium tracking-wider flex-1"
                                  disabled={isPending}
                                  placeholder="E.G. SUB-HIMALAYAN ARCHIVES"
                                />
                                {heroMarquee.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMarqueeItem(idx)}
                                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                                    title="Remove Tag"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
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
