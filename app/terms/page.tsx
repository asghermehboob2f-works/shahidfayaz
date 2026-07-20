import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function TermsPage() {
  let page: any = null;

  try {
    page = await prisma.page.findUnique({
      where: { slug: "terms" },
    });
  } catch (error) {
    console.error("Terms load error:", error);
  }

  if (!page) {
    // Fallback static copy if db is empty
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 space-y-8">
        <h1 className="text-3xl font-heading text-forest">Terms of Service</h1>
        <div className="prose-editorial text-text-secondary">
          <p>All content on this website, including book excerpts and essays, is the intellectual property of Shahid Fayaz unless otherwise stated. You may quote sections with appropriate attribution.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 space-y-8">
      <h1 className="text-4xl font-heading text-forest">{page.title}</h1>
      <div
        className="prose-editorial text-editorial-body"
        dangerouslySetInnerHTML={{ __html: page.body || "" }}
      />
    </div>
  );
}
