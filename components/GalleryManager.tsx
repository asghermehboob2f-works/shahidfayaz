"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, X, Save, Image as ImageIcon, Album } from "lucide-react";
import { createGalleryMedia, deleteGalleryMedia, createGallery, deleteGallery } from "@/app/admin/dashboard/gallery/actions";
import ImageUpload from "@/components/ImageUpload";

interface MediaItem {
  id: number;
  filePath: string;
  type: string;
  caption: string | null;
  altText: string | null;
}

interface Gallery {
  id: number;
  title: string;
  album: string | null;
  description: string | null;
  media: MediaItem[];
}

interface GalleryManagerProps {
  galleries: Gallery[];
}

export default function GalleryManager({ galleries }: GalleryManagerProps) {
  const [activeAlbumId, setActiveAlbumId] = useState<number | null>(galleries[0]?.id || null);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [mediaForm, setMediaForm] = useState({
    filePath: "",
    caption: "",
    altText: "",
  });

  const [albumForm, setAlbumForm] = useState({
    title: "",
    album: "events",
    description: "",
  });

  const [error, setError] = useState("");

  const activeGallery = galleries.find((g) => g.id === activeAlbumId) || galleries[0];

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMediaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAlbumForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.filePath) {
      setError("Image URL is required.");
      return;
    }
    if (!activeAlbumId) {
      setError("Please select or create an album first.");
      return;
    }

    setError("");
    startTransition(async () => {
      const res = await createGalleryMedia({
        filePath: mediaForm.filePath,
        caption: mediaForm.caption,
        altText: mediaForm.altText,
        galleryId: activeAlbumId,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setShowMediaForm(false);
        setMediaForm({ filePath: "", caption: "", altText: "" });
      }
    });
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title) {
      setError("Album Title is required.");
      return;
    }

    setError("");
    startTransition(async () => {
      const res = await createGallery(albumForm);

      if (res.error) {
        setError(res.error);
      } else {
        setShowAlbumForm(false);
        setAlbumForm({ title: "", album: "events", description: "" });
        if (res.gallery) {
          setActiveAlbumId(res.gallery.id);
        }
      }
    });
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Remove this image from the gallery?")) return;

    startTransition(async () => {
      await deleteGalleryMedia(id);
    });
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!confirm("Are you sure you want to delete this album and all its images? This cannot be undone.")) return;

    startTransition(async () => {
      await deleteGallery(id);
      if (activeAlbumId === id) {
        setActiveAlbumId(galleries.find((g) => g.id !== id)?.id || null);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar: Albums list */}
      <div className="lg:col-span-1 bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-border-editorial pb-2">
          <h4 className="font-heading text-sm font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
            <Album className="w-4 h-4 text-gold" />
            <span>Albums</span>
          </h4>
          <button
            onClick={() => setShowAlbumForm(true)}
            className="text-xs text-gold hover:text-gold-dark font-bold flex items-center"
            title="Create Album"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
          {galleries.map((gallery) => (
            <button
              key={gallery.id}
              onClick={() => {
                setActiveAlbumId(gallery.id);
                setError("");
              }}
              className={`w-full text-left px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between shrink-0 ${
                activeAlbumId === gallery.id
                  ? "bg-forest text-white"
                  : "bg-soft-ivory/30 text-forest hover:bg-soft-ivory/60"
              }`}
            >
              <span className="truncate pr-2">{gallery.title}</span>
              <span className="text-[10px] opacity-75">({gallery.media.length})</span>
            </button>
          ))}

          {galleries.length === 0 && (
            <p className="text-center py-6 text-xs text-text-tertiary">No albums found.</p>
          )}
        </div>
      </div>

      {/* Main Area: Gallery Media inside Selected Album */}
      <div className="lg:col-span-3 space-y-6">
        {activeGallery ? (
          <div className="bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-border-editorial pb-4">
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold text-forest">{activeGallery.title}</h3>
                <p className="text-xs text-text-secondary">{activeGallery.description || "No description configured."}</p>
                <p className="text-[10px] text-text-tertiary uppercase font-body tracking-wider">
                  Category: {activeGallery.album || "events"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMediaForm(true)}
                  className="btn-primary py-2 px-4 flex items-center gap-1 text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
                <button
                  onClick={() => handleDeleteAlbum(activeGallery.id)}
                  disabled={isPending}
                  className="text-red-700 hover:bg-red-50 p-2 border border-border-editorial rounded-sm text-xs flex items-center gap-1"
                  title="Delete Album"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Album</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-700 bg-red-50 p-4 border border-red-200">
                {error}
              </div>
            )}

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {activeGallery.media.map((media) => (
                <div
                  key={media.id}
                  className="group relative aspect-square border border-border-editorial overflow-hidden bg-soft-ivory shadow-sm"
                >
                  <img
                    src={media.filePath}
                    alt={media.altText || "Gallery item"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 text-white">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteMedia(media.id)}
                        disabled={isPending}
                        className="bg-red-700 hover:bg-red-800 p-1.5 rounded-sm transition-colors text-white"
                        aria-label="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] line-clamp-2 leading-relaxed text-zinc-300 font-body">
                      {media.caption || "(No Caption)"}
                    </p>
                  </div>
                </div>
              ))}

              {activeGallery.media.length === 0 && (
                <div className="col-span-full py-16 text-center text-xs text-text-tertiary">
                  No images linked to this album yet. Click "Add Photo" to link your first image.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-border-editorial p-12 rounded-sm shadow-sm text-center text-xs text-text-tertiary">
            Select or create an album from the left sidebar to start.
          </div>
        )}
      </div>

      {/* Album Form Overlay */}
      {showAlbumForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border border-border-editorial w-full max-w-md p-8 rounded-sm shadow-editorial space-y-6 relative">
            <button
              onClick={() => setShowAlbumForm(false)}
              className="absolute right-4 top-4 p-2 text-text-secondary hover:text-forest"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2">
              Create Gallery Album
            </h3>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Album Title *</label>
                <input
                  type="text"
                  name="title"
                  value={albumForm.title}
                  onChange={handleAlbumChange}
                  className="form-input text-xs"
                  placeholder="Kashmir Seminars 2025"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Category Group</label>
                <select
                  name="album"
                  value={albumForm.album}
                  onChange={handleAlbumChange}
                  className="form-input text-xs"
                >
                  <option value="events">Events &amp; Speeches</option>
                  <option value="travel">Travel &amp; Fieldwork</option>
                  <option value="writing">Literary &amp; Writing</option>
                  <option value="archive">Historical Archive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Album Description</label>
                <textarea
                  name="description"
                  value={albumForm.description}
                  onChange={handleAlbumChange}
                  rows={3}
                  className="form-input text-xs resize-none"
                  placeholder="Enter details about this event album collection..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-editorial">
                <button
                  type="button"
                  onClick={() => setShowAlbumForm(false)}
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
                  <span>{isPending ? "Creating..." : "Save Album"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Form Overlay */}
      {showMediaForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border border-border-editorial w-full max-w-md p-8 rounded-sm shadow-editorial space-y-6 relative">
            <button
              onClick={() => setShowMediaForm(false)}
              className="absolute right-4 top-4 p-2 text-text-secondary hover:text-forest"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2">
              Add Photo to Album
            </h3>

            <form onSubmit={handleCreateMedia} className="space-y-4">
              <div className="space-y-1">
                <ImageUpload 
                  label="Image *"
                  value={mediaForm.filePath} 
                  onChange={(url) => setMediaForm(prev => ({ ...prev, filePath: url }))} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Alt Text</label>
                <input
                  type="text"
                  name="altText"
                  value={mediaForm.altText}
                  onChange={handleMediaChange}
                  className="form-input text-xs"
                  placeholder="Shahid Fayaz lecturing"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Caption</label>
                <textarea
                  name="caption"
                  value={mediaForm.caption}
                  onChange={handleMediaChange}
                  rows={3}
                  className="form-input text-xs resize-none"
                  placeholder="Enter details of the moment..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-editorial">
                <button
                  type="button"
                  onClick={() => setShowMediaForm(false)}
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
                  <span>{isPending ? "Adding..." : "Add to Gallery"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
