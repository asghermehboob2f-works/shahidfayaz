"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Network error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-[10px] uppercase tracking-wider font-semibold text-text-secondary">{label}</label>}
      
      <div className="flex flex-col gap-2">
        {value ? (
          <div className="relative group rounded-sm overflow-hidden border border-border-editorial w-fit">
            <img src={value} alt="Preview" className="h-32 w-auto object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {value}
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-editorial rounded-sm p-6 flex flex-col items-center justify-center text-text-tertiary hover:bg-soft-ivory/50 hover:text-forest hover:border-forest/50 transition-colors cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-forest" />
            ) : (
              <>
                <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-xs font-semibold">Click to upload image</span>
                <span className="text-[10px] mt-1 opacity-70">JPG, PNG, WebP up to 5MB</span>
              </>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        
        {/* Fallback to manual URL entry just in case */}
        {!value && (
           <div className="flex gap-2 items-center">
             <span className="text-[10px] text-text-tertiary font-medium">Or enter URL:</span>
             <input
               type="text"
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder="https://..."
               className="form-input text-xs flex-grow py-1.5"
             />
           </div>
        )}

        {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
}
