"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

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
  description: string | null;
  album: string | null;
  media: MediaItem[];
}

interface GalleryGridProps {
  galleries: Gallery[];
}

export default function GalleryGrid({ galleries }: GalleryGridProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeGalleryId, setActiveGalleryId] = useState<number | null>(null);

  // Extract unique albums
  const albums = Array.from(
    new Set(galleries.map((g) => g.album).filter((a): a is string => !!a))
  );

  // Filtered media items
  const filteredMedia = galleries.flatMap((g) => {
    if (activeTab !== "all" && g.album !== activeTab) return [];
    return g.media.map((m) => ({ ...m, galleryTitle: g.title, galleryId: g.id }));
  });

  const openLightbox = (galleryId: number, mediaId: number) => {
    const idx = filteredMedia.findIndex((m) => m.galleryId === galleryId && m.id === mediaId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % filteredMedia.length);
    }
  };

  const prevSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + filteredMedia.length) % filteredMedia.length);
    }
  };

  const activeMedia = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div className="space-y-10">
      {/* Album Filters */}
      {albums.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center pb-4 border-b border-border-editorial">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border rounded-sm transition-all duration-300 ${activeTab === "all"
                ? "bg-forest text-white border-forest"
                : "border-border-editorial hover:border-forest text-text-secondary hover:text-forest"
              }`}
          >
            All Events
          </button>
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setActiveTab(album)}
              className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border rounded-sm transition-all duration-300 ${activeTab === album
                  ? "bg-forest text-white border-forest"
                  : "border-border-editorial hover:border-forest text-text-secondary hover:text-forest"
                }`}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* Editorial Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item.galleryId, item.id)}
            className="group relative aspect-square overflow-hidden shadow-editorial bg-soft-ivory border border-border-editorial cursor-pointer"
          >
            <img
              src={item.filePath}
              alt={item.altText || item.caption || "Gallery item"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-forest/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-forest shadow-md">
                <Eye className="w-5 h-5" />
              </span>
            </div>
            {/* Event Name Badge */}
            <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 text-[9px] uppercase tracking-wider font-bold text-forest">
              {item.galleryTitle}
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-20 text-text-tertiary font-heading text-lg">
          No media files found in this category.
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activeMedia && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-between p-6">
          {/* Header */}
          <div className="flex justify-between items-center text-white">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                {activeMedia.galleryTitle}
              </span>
              <p className="text-xs text-zinc-400">
                {lightboxIndex + 1} / {filteredMedia.length}
              </p>
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 hover:text-gold transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image & Navigation */}
          <div className="flex-grow flex items-center justify-between gap-4 max-h-[75vh]">
            <button
              onClick={prevSlide}
              className="p-3 text-white/60 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="relative max-h-full max-w-[80vw] flex items-center justify-center">
              <img
                src={activeMedia.filePath}
                alt={activeMedia.altText || "Lightbox Image"}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>

            <button
              onClick={nextSlide}
              className="p-3 text-white/60 hover:text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Footer Caption */}
          <div className="text-center max-w-2xl mx-auto pb-4">
            <p className="text-sm text-zinc-200 leading-relaxed font-body">
              {activeMedia.caption || "Shahid Fayaz Literary Archives"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
