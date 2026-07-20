"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";
import { createWork, deleteWork, updateWork } from "@/app/admin/dashboard/works/actions";

interface Work {
  id: number;
  title: string;
  slug: string;
  type: string;
  description: string | null;
  externalLink: string | null;
  date: Date | null;
  tags: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface WorksManagerProps {
  works: Work[];
  categories: Category[];
}

export default function WorksManager({ works, categories }: WorksManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "research",
    description: "",
    externalLink: "",
    tags: "",
  });

  const [error, setError] = useState("");

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      type: "research",
      description: "",
      externalLink: "",
      tags: "",
    });
    setError("");
    setShowForm(true);
  };

  const handleStartEdit = (work: Work) => {
    setEditingId(work.id);
    setFormData({
      title: work.title,
      slug: work.slug,
      type: work.type,
      description: work.description || "",
      externalLink: work.externalLink || "",
      tags: work.tags || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !editingId && !prev.slug) {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      setError("Title and Slug are required.");
      return;
    }

    setError("");
    startTransition(async () => {
      let res;
      const data = {
        title: formData.title,
        slug: formData.slug,
        type: formData.type,
        description: formData.description,
        externalLink: formData.externalLink,
        tags: formData.tags,
      };

      if (editingId) {
        res = await updateWork(editingId, data);
      } else {
        res = await createWork(data);
      }

      if (res.error) {
        setError(res.error);
      } else {
        setShowForm(false);
        setEditingId(null);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this work project?")) return;

    startTransition(async () => {
      await deleteWork(id);
    });
  };

  const workCategories = categories.filter((c) => c.type === "work");

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Registered Research Works</h3>
        <button
          onClick={handleStartCreate}
          className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Project</span>
        </button>
      </div>

      {/* Works List */}
      <div className="bg-white border border-border-editorial rounded-sm shadow-sm flex flex-col divide-y divide-border-editorial">
        {works.length > 0 ? (
          works.map((work) => (
            <div
              key={work.id}
              className="p-6 flex justify-between items-start gap-6 hover:bg-soft-ivory/10 transition-all"
            >
              <div className="space-y-2 min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gold bg-soft-ivory px-2 py-0.5 border border-border-editorial rounded-sm">
                  {work.type}
                </span>
                <h4 className="font-heading text-lg font-semibold text-forest truncate">{work.title}</h4>
                <p className="text-xs text-text-secondary">{work.description}</p>
                {work.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {work.tags.split(",").map((tag, idx) => (
                      <span key={idx} className="text-[9px] text-text-tertiary bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleStartEdit(work)}
                  className="text-gold hover:text-gold-dark p-2 hover:bg-gold/5 border border-transparent hover:border-gold/10 transition-all rounded-sm font-semibold"
                  aria-label="Edit Work"
                >
                  <Edit2 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => handleDelete(work.id)}
                  disabled={isPending}
                  className="text-red-700 hover:text-red-950 p-2 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all rounded-sm"
                  aria-label="Delete Work"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-text-tertiary text-xs">
            No research works listed yet.
          </div>
        )}
      </div>

      {/* Form overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border border-border-editorial w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 rounded-sm shadow-editorial space-y-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 p-2 text-text-secondary hover:text-forest"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2">
              {editingId ? `Modify Project: ${formData.title}` : "Register Research Work"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="The Geopolitics of Himalayan Enclaves"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="geopolitics-himalayan-enclaves"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Type / Category</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-input text-xs"
                  >
                    <option value="research">Academic Research</option>
                    <option value="political">Political Monograph</option>
                    <option value="literary">Literary Study</option>
                    <option value="social">Social Initiative / Archive</option>
                    {workCategories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">External Project Link</label>
                  <input
                    type="url"
                    name="externalLink"
                    value={formData.externalLink}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="https://example.org/project"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="form-input text-xs"
                  placeholder="Geopolitics, Border Studies, Oral History"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="form-input text-xs resize-none"
                  placeholder="Enter abstract / details of the research..."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-4 border border-red-200">
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border-editorial">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary text-xs py-2 px-4"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                  disabled={isPending}
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? "Saving..." : "Save Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
