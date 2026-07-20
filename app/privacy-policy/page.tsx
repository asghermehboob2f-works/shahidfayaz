import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function PrivacyPolicyPage() {
  let page: any = null;

  try {
    page = await prisma.page.findUnique({
      where: { slug: "privacy-policy" },
    });
  } catch (error) {
    console.error("Privacy policy load error:", error);
  }

  if (!page) {
    // Fallback static copy if db is empty
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 space-y-8">
        <h1 className="text-3xl font-heading text-forest">Privacy Policy</h1>
        <div className="prose-editorial text-text-secondary">
          <p>We respect your privacy. This website does not track or collect personal data, except for information explicitly provided by you in the contact and newsletter forms.</p>
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
