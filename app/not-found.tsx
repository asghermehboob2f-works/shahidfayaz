import React from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <span className="text-[120px] font-heading leading-none font-bold text-forest/10 select-none block">
            404
          </span>
          <h1 className="text-3xl font-heading text-forest font-semibold leading-tight">
            Lost in Translation
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed font-body">
            The page you are looking for has either been archived, moved, or never existed in this catalog.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-xs mx-auto pt-4">
          <Link href="/" className="btn-primary w-full justify-center">
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/search" className="btn-secondary w-full justify-center">
            <Search className="w-4 h-4" />
            <span>Search Archives</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
