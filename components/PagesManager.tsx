"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";
import { createPage, updatePage, deletePage } from "@/app/admin/dashboard/pages/actions";

interface CustomPage {
  id: number;
  title: string;
  slug: string;
  body: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

interface PagesManagerProps {
  pages: CustomPage[];
}

export default function PagesManager({ pages }: PagesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    body: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [error, setError] = useState("");

  const handleStartCreate = () => {
    setEditingPage(null);
    setFormData({
      title: "",
      slug: "",
      body: "",
      metaTitle: "",
      metaDescription: "",
    });
    setError("");
    setShowForm(true);
  };

  const handleStartEdit = (page: CustomPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      body: page.body || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
    });
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !editingPage && !prev.slug) {
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
    if (!formData.title || !formData.slug || !formData.body) {
      setError("Title, Slug, and Body Content are required.");
      return;
    }

    setError("");
    startTransition(async () => {
      let res;
      if (editingPage) {
        res = await updatePage(editingPage.id, formData);
      } else {
        res = await createPage(formData);
      }

      if (res.error) {
        setError(res.error);
      } else {
        setShowForm(false);
        setEditingPage(null);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this page? This cannot be undone.")) return;

    startTransition(async () => {
      const res = await deletePage(id);
      if (res.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Dynamic Layout Pages</h3>
        <button
          onClick={handleStartCreate}
          className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Page</span>
        </button>
      </div>

      {/* Pages list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm flex justify-between items-start gap-4"
          >
            <div className="space-y-1.5 min-w-0">
              <h4 className="font-heading text-lg font-semibold text-forest truncate">{page.title}</h4>
              <p className="text-[10px] text-text-tertiary font-mono truncate">/{page.slug}</p>
              {page.metaTitle && (
                <p className="text-[10px] text-text-secondary truncate">SEO: {page.metaTitle}</p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(page)}
                className="text-gold hover:bg-gold/10 p-2 border border-transparent hover:border-gold/20 rounded-sm"
                title="Edit Page"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(page.id)}
                disabled={isPending}
                className="text-red-700 hover:bg-red-50 p-2 rounded-sm"
                title="Delete Page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="md:col-span-2 text-center py-12 text-xs text-text-tertiary bg-white border border-border-editorial">
            No custom pages registered yet.
          </div>
        )}
      </div>

      {/* Slideout Form Modal overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border border-border-editorial w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 rounded-sm shadow-editorial space-y-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 p-2 text-text-secondary hover:text-forest"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2">
              {editingPage ? `Edit Page: ${editingPage.title}` : "Create Custom Page"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Page Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="Privacy Policy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Slug / URL Path *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="privacy-policy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">SEO Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="Privacy Policy | Shahid Fayaz"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">SEO Meta Description</label>
                  <input
                    type="text"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="Privacy terms and conditions..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Page Content (HTML tags supported)</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows={10}
                  className="form-input text-xs font-mono"
                  placeholder="<h2>1. Policy Overview</h2><p>This policy details...</p>"
                  required
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
                  <span>{isPending ? "Saving..." : "Save Page"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
