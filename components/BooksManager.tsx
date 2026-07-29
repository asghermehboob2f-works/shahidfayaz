"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";
import { createBook, deleteBook, updateBook } from "@/app/admin/dashboard/books/actions";
import ImageUpload from "@/components/ImageUpload";

interface Book {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  coverImage: string | null;
  coverImage2: string | null;
  isbn: string | null;
  price: number | null;
  pages: number | null;
  format: string | null;
  publisher: string | null;
  publicationDate?: string | Date | null;
  purchaseLinks?: { id: number; storeName: string; url: string; priceLabel: string | null }[];
}

interface BooksManagerProps {
  books: Book[];
}

export default function BooksManager({ books }: BooksManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    coverImage: "",
    coverImage2: "",
    isbn: "",
    price: "",
    pages: "",
    format: "Hardcover",
    publisher: "",
    publicationDate: "",
    purchaseLinks: [] as { storeName: string; url: string; priceLabel: string }[],
  });

  const [error, setError] = useState("");

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      coverImage: "",
      coverImage2: "",
      isbn: "",
      price: "",
      pages: "",
      format: "Hardcover",
      publisher: "",
      publicationDate: "",
      purchaseLinks: [],
    });
    setError("");
    setShowForm(true);
  };

  const handleStartEdit = (book: Book) => {
    setEditingId(book.id);
    let formattedDate = "";
    if (book.publicationDate) {
      const d = new Date(book.publicationDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().split("T")[0];
      }
    }

    setFormData({
      title: book.title,
      slug: book.slug,
      subtitle: book.subtitle || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      coverImage2: book.coverImage2 || "",
      isbn: book.isbn || "",
      price: book.price ? String(book.price) : "",
      pages: book.pages ? String(book.pages) : "",
      format: book.format || "Hardcover",
      publisher: book.publisher || "",
      publicationDate: formattedDate,
      purchaseLinks: book.purchaseLinks?.map((link) => ({
        storeName: link.storeName,
        url: link.url,
        priceLabel: link.priceLabel || "",
      })) || [],
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

  const handleAddPurchaseLink = () => {
    setFormData((prev) => ({
      ...prev,
      purchaseLinks: [...prev.purchaseLinks, { storeName: "", url: "", priceLabel: "" }],
    }));
  };

  const handleUpdatePurchaseLink = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.purchaseLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, purchaseLinks: updated };
    });
  };

  const handleRemovePurchaseLink = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.purchaseLinks];
      updated.splice(index, 1);
      return { ...prev, purchaseLinks: updated };
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
        subtitle: formData.subtitle,
        excerpt: formData.description, // using description as excerpt equivalent for DB if needed, but Book schema has description
        description: formData.description,
        coverImage: formData.coverImage,
        coverImage2: formData.coverImage2,
        isbn: formData.isbn,
        price: formData.price ? parseFloat(formData.price) : undefined,
        pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
        format: formData.format,
        publisher: formData.publisher,
        publicationDate: formData.publicationDate || null,
        purchaseLinks: formData.purchaseLinks,
      };

      if (editingId) {
        res = await updateBook(editingId, data);
      } else {
        res = await createBook(data);
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
    if (!confirm("Are you sure you want to permanently delete this book?")) return;

    startTransition(async () => {
      await deleteBook(id);
    });
  };

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Registered Books</h3>
        <button
          onClick={handleStartCreate}
          className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Book</span>
        </button>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm flex gap-6 items-start justify-between"
          >
            <div className="w-20 aspect-[2/3] shrink-0 bg-soft-ivory border border-border-editorial overflow-hidden shadow-sm">
              <img
                src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow space-y-2 min-w-0">
              <span className="text-[9px] uppercase tracking-wider font-bold text-gold bg-soft-ivory px-2 py-0.5 border border-border-editorial rounded-sm">
                {book.format}
              </span>
              <h4 className="font-heading text-lg font-semibold text-forest truncate">{book.title}</h4>
              <p className="text-xs text-text-secondary line-clamp-2">{book.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-text-tertiary font-body">
                <span>Pages: {book.pages || "—"}</span>
                <span>Price: ${book.price || "—"}</span>
                {book.publicationDate && (
                  <span>
                    Published: {new Date(book.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(book)}
                className="text-gold hover:text-gold-dark p-2 hover:bg-gold/5 border border-transparent hover:border-gold/10 transition-all rounded-sm"
                aria-label="Edit Book"
              >
                <Edit2 className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                disabled={isPending}
                className="text-red-700 hover:text-red-950 p-2 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all rounded-sm"
                aria-label="Delete Book"
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
          <div className="bg-white border border-border-editorial w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 rounded-sm shadow-editorial space-y-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 p-2 text-text-secondary hover:text-forest"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2">
              {editingId ? `Modify Edition: ${formData.title}` : "Register New Book Edition"}
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
                    placeholder="Echoes of the Valley"
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
                    placeholder="echoes-of-the-valley"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="form-input text-xs"
                  placeholder="A Memoir of Silence and Belonging"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="form-input text-xs resize-none"
                  placeholder="Enter book back-cover description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="978-0-123456-78-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="24.99"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="312"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="form-input text-xs"
                  >
                    <option value="Hardcover">Hardcover</option>
                    <option value="Paperback">Paperback</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    className="form-input text-xs"
                    placeholder="HarperCollins"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Publication Date</label>
                  <input
                    type="date"
                    name="publicationDate"
                    value={formData.publicationDate}
                    onChange={handleChange}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="space-y-4 border border-border-editorial p-6 rounded-sm bg-soft-ivory/30">
                <div className="flex justify-between items-center border-b border-border-editorial pb-2">
                  <h4 className="font-heading text-sm font-bold text-forest">Purchase Links</h4>
                  <button
                    type="button"
                    onClick={handleAddPurchaseLink}
                    className="text-xs text-gold hover:text-forest transition-colors font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Store</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.purchaseLinks.map((link, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-start border-l-2 border-gold pl-3">
                      <div className="space-y-1 w-full md:w-1/4">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Store Name</label>
                        <input
                          type="text"
                          value={link.storeName}
                          onChange={(e) => handleUpdatePurchaseLink(idx, "storeName", e.target.value)}
                          className="form-input text-xs"
                          placeholder="Amazon, Bookshop..."
                          required
                        />
                      </div>
                      <div className="space-y-1 w-full md:w-1/2">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Store URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleUpdatePurchaseLink(idx, "url", e.target.value)}
                          className="form-input text-xs"
                          placeholder="https://..."
                          required
                        />
                      </div>
                      <div className="space-y-1 w-full md:w-1/4">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Price Label</label>
                        <input
                          type="text"
                          value={link.priceLabel}
                          onChange={(e) => handleUpdatePurchaseLink(idx, "priceLabel", e.target.value)}
                          className="form-input text-xs"
                          placeholder="$24.99"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePurchaseLink(idx)}
                        className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-sm shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.purchaseLinks.length === 0 && (
                    <p className="text-[10px] text-text-tertiary">No purchase links added yet. Click 'Add Store' to add one.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <ImageUpload 
                    label="Cover Image (Primary)"
                    value={formData.coverImage} 
                    onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))} 
                  />
                </div>
                <div className="space-y-1">
                  <ImageUpload 
                    label="Cover Image 2 (Secondary)"
                    value={formData.coverImage2} 
                    onChange={(url) => setFormData(prev => ({ ...prev, coverImage2: url }))} 
                  />
                </div>
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
                  <span>{isPending ? "Saving..." : "Save Book"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
