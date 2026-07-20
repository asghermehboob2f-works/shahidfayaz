"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, Clock, Calendar, X, Save } from "lucide-react";
import { createArticle, deleteArticle, updateArticle } from "@/app/admin/dashboard/articles/actions";
import ImageUpload from "@/components/ImageUpload";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  readingTime: number | null;
  publishedAt: Date | null;
  categoryId?: number | null;
}

interface Category {
  id: number;
  name: string;
  type: string;
}

interface ArticlesManagerProps {
  articles: Article[];
  categories: Category[];
}

export default function ArticlesManager({ articles, categories }: ArticlesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    coverImage: "",
    readingTime: "5",
    categoryId: "",
  });

  const [error, setError] = useState("");

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      coverImage: "",
      readingTime: "5",
      categoryId: "",
    });
    setError("");
    setShowForm(true);
  };

  const handleStartEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      body: article.body || "",
      coverImage: article.coverImage || "",
      readingTime: String(article.readingTime || 5),
      categoryId: article.categoryId ? String(article.categoryId) : "",
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
        excerpt: formData.excerpt,
        body: formData.body,
        coverImage: formData.coverImage,
        readingTime: parseInt(formData.readingTime, 10) || 5,
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined,
      };

      if (editingId) {
        res = await updateArticle(editingId, data);
      } else {
        res = await createArticle(data);
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
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    startTransition(async () => {
      await deleteArticle(id);
    });
  };

  const articleCategories = categories.filter((c) => c.type === "article");

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Compose &amp; Manage Essays</h3>
        <button
          onClick={handleStartCreate}
          className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Essay</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm flex gap-6 items-start justify-between"
          >
            <div className="w-24 aspect-[16/10] shrink-0 bg-soft-ivory border border-border-editorial overflow-hidden shadow-sm">
              <img
                src={article.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow space-y-2 min-w-0">
              <h4 className="font-heading text-lg font-semibold text-forest truncate">{article.title}</h4>
              <p className="text-xs text-text-secondary line-clamp-2">{article.excerpt}</p>
              <div className="flex gap-4 text-[10px] text-text-tertiary font-body">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readingTime || "5"} min read</span>
                </span>
                {article.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(article)}
                className="text-gold hover:text-gold-dark p-2 hover:bg-gold/5 border border-transparent hover:border-gold/10 transition-all rounded-sm"
                aria-label="Edit Article"
              >
                <Edit2 className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                disabled={isPending}
                className="text-red-700 hover:text-red-950 p-2 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all rounded-sm"
                aria-label="Delete Article"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form overlay */}
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
              {editingId ? `Modify Essay: ${formData.title}` : "Compose Editorial Essay"}
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
                    placeholder="The Philosophy of Quiet Activism"
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
                    placeholder="philosophy-of-quiet-activism"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="form-input text-xs"
                  >
                    <option value="">No Category</option>
                    {articleCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <ImageUpload 
                    label="Cover Image"
                    value={formData.coverImage} 
                    onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Reading Time (min)</label>
                  <input
                    type="number"
                    name="readingTime"
                    value={formData.readingTime}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Excerpt / Summary</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  className="form-input text-xs resize-none"
                  placeholder="Enter a brief teaser/summary of the essay..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Body Content (supports HTML tags)</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows={8}
                  className="form-input text-xs font-mono"
                  placeholder="<p>Write your article text here...</p>"
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
                  <span>{isPending ? "Saving..." : "Save Essay"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
