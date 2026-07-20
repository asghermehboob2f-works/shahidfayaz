"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { updateAboutPageData } from "@/app/admin/dashboard/about-settings/actions";
import ImageUpload from "@/components/ImageUpload";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface Credential {
  title: string;
  subtitle: string;
}

interface AboutData {
  bioLead: string;
  bioBody1: string;
  bioBody2: string;
  photoUrl: string;
  quoteText: string;
  quoteAuthor: string;
  education: Credential[];
  fellowships: Credential[];
  socialWork: Credential[];
  timeline: TimelineEvent[];
}

interface Props {
  initialData: AboutData;
}

export default function AboutSettingsForm({ initialData }: Props) {
  const [data, setData] = useState<AboutData>(initialData);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    arrayName: keyof AboutData,
    index: number,
    field: string,
    value: string
  ) => {
    setData((prev) => {
      const array = [...(prev[arrayName] as any[])];
      array[index] = { ...array[index], [field]: value };
      return { ...prev, [arrayName]: array };
    });
  };

  const addArrayItem = (arrayName: keyof AboutData, emptyItem: any) => {
    setData((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[]), emptyItem],
    }));
  };

  const removeArrayItem = (arrayName: keyof AboutData, index: number) => {
    setData((prev) => {
      const array = [...(prev[arrayName] as any[])];
      array.splice(index, 1);
      return { ...prev, [arrayName]: array };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    startTransition(async () => {
      const res = await updateAboutPageData(data);
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage("About page settings updated successfully.");
      }
    });
  };

  const renderCredentialSection = (title: string, arrayName: "education" | "fellowships" | "socialWork") => (
    <div className="space-y-4 border border-border-editorial p-6 rounded-sm bg-white">
      <div className="flex justify-between items-center border-b border-border-editorial pb-2">
        <h3 className="font-heading text-lg font-bold text-forest">{title}</h3>
        <button
          type="button"
          onClick={() => addArrayItem(arrayName, { title: "", subtitle: "" })}
          className="text-xs flex items-center gap-1 text-gold hover:text-forest transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Item
        </button>
      </div>
      {data[arrayName].map((item, idx) => (
        <div key={idx} className="flex gap-4 items-start">
          <div className="flex-grow space-y-2">
            <input
              type="text"
              placeholder="Title (e.g. PhD in Political Science)"
              value={item.title}
              onChange={(e) => handleArrayChange(arrayName, idx, "title", e.target.value)}
              className="form-input text-xs"
            />
            <input
              type="text"
              placeholder="Subtitle (e.g. London School of Economics)"
              value={item.subtitle}
              onChange={(e) => handleArrayChange(arrayName, idx, "subtitle", e.target.value)}
              className="form-input text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => removeArrayItem(arrayName, idx)}
            className="text-red-500 hover:bg-red-50 p-2 rounded-sm shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Biography Section */}
      <div className="space-y-4 border border-border-editorial p-6 rounded-sm bg-white">
        <h3 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2">Biography & Photo</h3>
        <div className="space-y-1">
          <ImageUpload 
            label="Photo"
            value={data.photoUrl} 
            onChange={(url) => setData(prev => ({ ...prev, photoUrl: url }))} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Lead Text (Bold intro)</label>
          <textarea
            name="bioLead"
            value={data.bioLead}
            onChange={handleChange}
            className="form-input text-xs"
            rows={3}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Body Paragraph 1</label>
          <textarea
            name="bioBody1"
            value={data.bioBody1}
            onChange={handleChange}
            className="form-input text-xs"
            rows={4}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Body Paragraph 2</label>
          <textarea
            name="bioBody2"
            value={data.bioBody2}
            onChange={handleChange}
            className="form-input text-xs"
            rows={4}
          />
        </div>
      </div>

      {/* Quote Section */}
      <div className="space-y-4 border border-border-editorial p-6 rounded-sm bg-white">
        <h3 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2">Signature Quote</h3>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Quote Text</label>
          <textarea
            name="quoteText"
            value={data.quoteText}
            onChange={handleChange}
            className="form-input text-xs italic"
            rows={3}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Quote Author</label>
          <input
            type="text"
            name="quoteAuthor"
            value={data.quoteAuthor}
            onChange={handleChange}
            className="form-input text-xs"
          />
        </div>
      </div>

      {/* Credentials Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderCredentialSection("Education", "education")}
        {renderCredentialSection("Fellowships & Prizes", "fellowships")}
        {renderCredentialSection("Social Work", "socialWork")}
      </div>

      {/* Timeline Section */}
      <div className="space-y-4 border border-border-editorial p-6 rounded-sm bg-white">
        <div className="flex justify-between items-center border-b border-border-editorial pb-2">
          <h3 className="font-heading text-lg font-bold text-forest">Chronology / Timeline</h3>
          <button
            type="button"
            onClick={() => addArrayItem("timeline", { year: "", title: "", description: "" })}
            className="text-xs flex items-center gap-1 text-gold hover:text-forest transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Milestone
          </button>
        </div>
        <div className="space-y-6">
          {data.timeline.map((event, idx) => (
            <div key={idx} className="flex gap-4 items-start border-l-2 border-border-editorial pl-4">
              <div className="flex-grow space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      placeholder="Year"
                      value={event.year}
                      onChange={(e) => handleArrayChange("timeline", idx, "year", e.target.value)}
                      className="form-input text-xs font-bold text-gold"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={event.title}
                      onChange={(e) => handleArrayChange("timeline", idx, "title", e.target.value)}
                      className="form-input text-xs font-semibold"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Description"
                  value={event.description}
                  onChange={(e) => handleArrayChange("timeline", idx, "description", e.target.value)}
                  className="form-input text-xs"
                  rows={2}
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem("timeline", idx)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-sm shrink-0 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div className={`p-4 text-xs font-semibold rounded-sm ${message.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save About Page Configuration"}</span>
        </button>
      </div>
    </form>
  );
}
