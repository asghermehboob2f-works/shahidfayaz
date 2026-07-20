import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
    });
    if (page) {
      return {
        title: page.metaTitle || `${page.title} | Shahid Fayaz`,
        description: page.metaDescription || `Read ${page.title} by Shahid Fayaz`,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

export default async function DynamicCustomPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Exclude root levels or static routes that might fall through erroneously
  const reservedSlugs = ["admin", "api", "books", "articles", "gallery", "works", "contact", "about", "search"];
  if (reservedSlugs.includes(slug)) {
    return notFound();
  }

  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Dynamic page loading error:", error);
  }

  if (!page) {
    return notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-8 py-20 space-y-8 min-h-[60vh]">
      <header className="border-b border-border-editorial pb-6 space-y-2">
        <h1 className="text-4xl font-heading font-bold text-forest leading-tight">
          {page.title}
        </h1>
        <p className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">
          Last Updated: {new Date(page.updatedAt).toLocaleDateString()}
        </p>
      </header>

      <div
        className="prose-editorial text-editorial-body space-y-6"
        dangerouslySetInnerHTML={{ __html: page.body || "" }}
      />
    </article>
  );
}
