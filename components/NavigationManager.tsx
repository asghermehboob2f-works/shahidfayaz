"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, Check, X, Save } from "lucide-react";
import { createNavigationItem, updateNavigationItem, deleteNavigationItem } from "@/app/admin/dashboard/navigation/actions";

interface NavItem {
  id: number;
  label: string;
  url: string;
  location: string;
  sortOrder: number;
}

interface NavigationManagerProps {
  items: NavItem[];
}

export default function NavigationManager({ items }: NavigationManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    label: "",
    url: "",
    position: "header",
    sortOrder: 0,
  });

  const [newForm, setNewForm] = useState({
    label: "",
    url: "",
    position: "header",
    sortOrder: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");

  const handleStartEdit = (item: NavItem) => {
    setEditingId(item.id);
    setEditForm({
      label: item.label,
      url: item.url,
      position: item.location,
      sortOrder: item.sortOrder,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: number) => {
    setError("");
    startTransition(async () => {
      const res = await updateNavigationItem(id, editForm);
      if (res.error) {
        setError(res.error);
      } else {
        setEditingId(null);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this navigation link?")) return;
    setError("");
    startTransition(async () => {
      const res = await deleteNavigationItem(id);
      if (res.error) {
        setError(res.error);
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.label || !newForm.url) {
      setError("Label and URL are required.");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await createNavigationItem(newForm);
      if (res.error) {
        setError(res.error);
      } else {
        setShowAddForm(false);
        setNewForm({
          label: "",
          url: "",
          position: "header",
          sortOrder: 0,
        });
      }
    });
  };

  const headerItems = items.filter((item) => item.location === "header" || item.location === "both").sort((a, b) => a.sortOrder - b.sortOrder);
  const footerItems = items.filter((item) => item.location === "footer" || item.location === "both").sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Menus &amp; Navigation</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Link</span>
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-700 bg-red-50 p-4 border border-red-200">
          {error}
        </div>
      )}

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Navigation Menu */}
        <div className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-4">
          <h4 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
            Header Navigation Menu
          </h4>
          <div className="space-y-3">
            {headerItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 border border-border-editorial bg-soft-ivory/10 hover:bg-soft-ivory/20 rounded-sm"
              >
                {editingId === item.id ? (
                  <div className="flex-grow grid grid-cols-2 gap-2 pr-4">
                    <input
                      type="text"
                      value={editForm.label}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      className="form-input text-xs py-1 px-2"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      className="form-input text-xs py-1 px-2"
                      placeholder="URL"
                    />
                    <select
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      className="form-input text-xs py-1 px-2"
                    >
                      <option value="header">Header Only</option>
                      <option value="footer">Footer Only</option>
                      <option value="both">Both</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.sortOrder}
                      onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value, 10) || 0 })}
                      className="form-input text-xs py-1 px-2"
                      placeholder="Order"
                    />
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-forest truncate">{item.label}</p>
                    <p className="text-[10px] text-text-tertiary font-mono truncate">{item.url}</p>
                  </div>
                )}

                <div className="flex gap-1 shrink-0">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
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
                        onClick={() => handleStartEdit(item)}
                        className="text-gold hover:bg-gold/10 p-1.5 rounded-sm border border-transparent hover:border-gold/20"
                        title="Edit Link"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        className="text-red-700 hover:bg-red-50 p-1.5 rounded-sm"
                        title="Delete Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {headerItems.length === 0 && (
              <p className="text-center py-6 text-xs text-text-tertiary">No links mapped to header menu.</p>
            )}
          </div>
        </div>

        {/* Footer Navigation Menu */}
        <div className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-4">
          <h4 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
            Footer Navigation Menu
          </h4>
          <div className="space-y-3">
            {footerItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 border border-border-editorial bg-soft-ivory/10 hover:bg-soft-ivory/20 rounded-sm"
              >
                {editingId === item.id ? (
                  <div className="flex-grow grid grid-cols-2 gap-2 pr-4">
                    <input
                      type="text"
                      value={editForm.label}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      className="form-input text-xs py-1 px-2"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      className="form-input text-xs py-1 px-2"
                      placeholder="URL"
                    />
                    <select
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      className="form-input text-xs py-1 px-2"
                    >
                      <option value="header">Header Only</option>
                      <option value="footer">Footer Only</option>
                      <option value="both">Both</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.sortOrder}
                      onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value, 10) || 0 })}
                      className="form-input text-xs py-1 px-2"
                      placeholder="Order"
                    />
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-forest truncate">{item.label}</p>
                    <p className="text-[10px] text-text-tertiary font-mono truncate">{item.url}</p>
                  </div>
                )}

                <div className="flex gap-1 shrink-0">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
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
                        onClick={() => handleStartEdit(item)}
                        className="text-gold hover:bg-gold/10 p-1.5 rounded-sm border border-transparent hover:border-gold/20"
                        title="Edit Link"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        className="text-red-700 hover:bg-red-50 p-1.5 rounded-sm"
                        title="Delete Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {footerItems.length === 0 && (
              <p className="text-center py-6 text-xs text-text-tertiary">No links mapped to footer menu.</p>
            )}
          </div>
        </div>
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
              Add Navigation Link
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Link Label *</label>
                <input
                  type="text"
                  value={newForm.label}
                  onChange={(e) => setNewForm({ ...newForm, label: e.target.value })}
                  className="form-input text-xs"
                  placeholder="Press Releases"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Target URL *</label>
                <input
                  type="text"
                  value={newForm.url}
                  onChange={(e) => setNewForm({ ...newForm, url: e.target.value })}
                  className="form-input text-xs"
                  placeholder="/press"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Position</label>
                  <select
                    value={newForm.position}
                    onChange={(e) => setNewForm({ ...newForm, position: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="header">Header Only</option>
                    <option value="footer">Footer Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Sort Order</label>
                  <input
                    type="number"
                    value={newForm.sortOrder}
                    onChange={(e) => setNewForm({ ...newForm, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="form-input text-xs"
                    placeholder="0"
                  />
                </div>
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
                  <span>{isPending ? "Adding..." : "Add Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
