"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-12">
      {/* Album Filters */}
      {albums.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center pb-6 border-b border-border-editorial">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-xs uppercase tracking-[0.2em] font-semibold px-5 py-2.5 rounded-xs transition-all duration-300 ${
              activeTab === "all"
                ? "bg-forest text-white border border-forest shadow-md"
                : "border border-border-editorial hover:border-forest text-text-secondary hover:text-forest bg-warm-white/50"
            }`}
          >
            All Events
          </button>
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setActiveTab(album)}
              className={`text-xs uppercase tracking-[0.2em] font-semibold px-5 py-2.5 rounded-xs transition-all duration-300 ${
                activeTab === album
                  ? "bg-forest text-white border border-forest shadow-md"
                  : "border border-border-editorial hover:border-forest text-text-secondary hover:text-forest bg-warm-white/50"
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* Editorial Image Grid with Motion */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => openLightbox(item.galleryId, item.id)}
              className="group relative aspect-square overflow-hidden shadow-editorial bg-soft-ivory border border-border-editorial cursor-pointer rounded-xs"
            >
              <img
                src={item.filePath}
                alt={item.altText || item.caption || "Gallery item"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              {/* Hover overlay with glowing lens icon */}
              <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                <span className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center text-forest shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Eye className="w-6 h-6" />
                </span>
              </div>
              {/* Photo Title Badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-forest border border-border-editorial/40 shadow-xs max-w-[85%] truncate">
                {item.altText || item.caption || item.galleryTitle}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-20 text-text-tertiary font-heading text-lg">
          No media files found in this category.
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex flex-col justify-between p-6 md:p-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                  {activeMedia.galleryTitle}
                </span>
                <h3 className="text-base text-white font-heading font-medium">
                  {activeMedia.altText || activeMedia.caption || activeMedia.galleryTitle}
                </h3>
                <p className="text-xs text-zinc-400">
                  {lightboxIndex + 1} / {filteredMedia.length}
                </p>
              </div>
              <button
                onClick={closeLightbox}
                className="p-2 hover:text-gold transition-colors text-white/80"
                aria-label="Close Lightbox"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Image & Navigation */}
            <div className="flex-grow flex items-center justify-between gap-4 max-h-[75vh]">
              <button
                onClick={prevSlide}
                className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                aria-label="Previous"
              >
                <ChevronLeft className="w-9 h-9" />
              </button>

              <div className="relative max-h-full max-w-[80vw] flex items-center justify-center overflow-hidden">
                <motion.img
                  key={activeMedia.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={activeMedia.filePath}
                  alt={activeMedia.altText || activeMedia.caption || "Lightbox Image"}
                  className="max-h-[70vh] max-w-full object-contain shadow-2xl rounded-xs"
                />
              </div>

              <button
                onClick={nextSlide}
                className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            </div>

            {/* Footer Caption */}
            <div className="text-center max-w-2xl mx-auto pb-4">
              <p className="text-sm text-zinc-200 leading-relaxed font-body font-light">
                {activeMedia.caption || activeMedia.altText || "Shahid Fayaz Literary Archives"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
