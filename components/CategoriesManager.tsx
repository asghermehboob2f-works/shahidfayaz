"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, X, Save, Check } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/dashboard/categories/actions";

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface CategoriesManagerProps {
  categories: Category[];
}

export default function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    type: "article",
  });

  const [newForm, setNewForm] = useState({
    name: "",
    slug: "",
    type: "article",
  });

  const [error, setError] = useState("");

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      slug: category.slug,
      type: category.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: number) => {
    setError("");
    startTransition(async () => {
      const res = await updateCategory(id, editForm);
      if (res.error) {
        setError(res.error);
      } else {
        setEditingId(null);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this category? Any associated items may lose their category link.")) return;
    setError("");
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.error) {
        setError(res.error);
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.slug) {
      setError("Name and Slug are required.");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await createCategory(newForm);
      if (res.error) {
        setError(res.error);
      } else {
        setShowAddForm(false);
        setNewForm({
          name: "",
          slug: "",
          type: "article",
        });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, formType: "new" | "edit") => {
    const { name, value } = e.target;
    if (formType === "new") {
      setNewForm((prev) => {
        const next = { ...prev, [name]: value };
        if (name === "name" && !prev.slug) {
          next.slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        }
        return next;
      });
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const types = [
    { key: "article", label: "Essays & Articles" },
    { key: "book", label: "Books & Publications" },
    { key: "gallery", label: "Gallery Event Types" },
    { key: "work", label: "Research Work Types" },
  ];

  return (
    <div className="space-y-8">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Category Taxonomies</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-700 bg-red-50 p-4 border border-red-200">
          {error}
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {types.map((t) => {
          const typeCategories = categories.filter((cat) => cat.type === t.key);
          return (
            <div key={t.key} className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-4">
              <h4 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
                {t.label}
              </h4>
              <div className="space-y-3">
                {typeCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex justify-between items-center p-3 border border-border-editorial bg-soft-ivory/10 hover:bg-soft-ivory/20 rounded-sm"
                  >
                    {editingId === cat.id ? (
                      <div className="flex-grow grid grid-cols-2 gap-2 pr-4">
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={(e) => handleChange(e, "edit")}
                          className="form-input text-xs py-1 px-2"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          name="slug"
                          value={editForm.slug}
                          onChange={(e) => handleChange(e, "edit")}
                          className="form-input text-xs py-1 px-2"
                          placeholder="Slug"
                        />
                        <select
                          name="type"
                          value={editForm.type}
                          onChange={(e) => handleChange(e, "edit")}
                          className="form-input text-xs py-1 px-2 col-span-2"
                        >
                          {types.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-forest truncate">{cat.name}</p>
                        <p className="text-[10px] text-text-tertiary font-mono truncate">{cat.slug}</p>
                      </div>
                    )}

                    <div className="flex gap-1 shrink-0">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            disabled={isPending}
                            className="text-forest hover:bg-forest/10 p-1.5 rounded-sm border border-transparent hover:border-forest/20"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-text-secondary hover:bg-zinc-100 p-1.5 rounded-sm"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="text-gold hover:bg-gold/10 p-1.5 rounded-sm border border-transparent hover:border-gold/20"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={isPending}
                            className="text-red-700 hover:bg-red-50 p-1.5 rounded-sm"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {typeCategories.length === 0 && (
                  <p className="text-center py-6 text-xs text-text-tertiary">No classifications configured yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Dialog Form overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border border-border-editorial w-full max-w-md p-8 rounded-sm shadow-editorial space-y-6 relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 p-2 text-text-secondary hover:text-forest"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2">
              Create Taxonomy Category
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newForm.name}
                  onChange={(e) => handleChange(e, "new")}
                  className="form-input text-xs"
                  placeholder="Political Theory"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Category Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={newForm.slug}
                  onChange={(e) => handleChange(e, "new")}
                  className="form-input text-xs"
                  placeholder="political-theory"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Category Type</label>
                <select
                  name="type"
                  value={newForm.type}
                  onChange={(e) => handleChange(e, "new")}
                  className="form-input text-xs"
                >
                  {types.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-editorial">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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
                  <span>{isPending ? "Adding..." : "Add Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
