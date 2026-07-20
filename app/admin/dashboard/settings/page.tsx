import React from "react";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";
import SectionsForm from "@/components/SectionsForm";
import AdminProfileForm from "@/components/AdminProfileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  let settings: any[] = [];
  let homepageSections: any[] = [];
  let adminUser: any = null;

  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      adminUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, email: true },
      });
    }

    settings = await prisma.setting.findMany({
      orderBy: { id: "asc" },
    });

    const defaultSections = [
      { key: "hero", title: "Writing the Spaces Between Silences", subtitle: "Shahid Fayaz", content: "An acclaimed author, philosopher, and social thinker examining geopolitical memory, language, and the power of the unsaid.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", buttonText: "Explore Books", buttonLink: "/books", sortOrder: 1 },
      { key: "about_preview", title: "A Life Dedicated to Ideas", subtitle: "Biography Brief", content: "Shahid Fayaz is a post-colonial scholar and writer whose novels and philosophical treatises examine borders, language loss, and political resistance. Born in the sub-Himalayan valleys, he has spent decades recording oral archives and lecturing globally.", buttonText: "Read Full Story", buttonLink: "/about", sortOrder: 2 },
      { key: "quote", title: "The Anatomy of Silences", subtitle: "Philosophical Anchor", content: "“He who controls the grammar of power dictates what can be spoken. Therefore, silence is not merely a retreat; it is the final, unassailable fortress of human sovereignty.”", sortOrder: 3 },
      { key: "featured_books", title: "Featured Publications", subtitle: "Selected Bibliography", content: null, image: null, buttonText: null, buttonLink: null, sortOrder: 4 },
      { key: "works", title: "Research & Works", subtitle: "Contributions", content: "Academic contributions, community-led initiatives, and social essays documenting border realities.", image: null, buttonText: null, buttonLink: null, sortOrder: 5 },
      { key: "latest_article", title: "Latest Essay", subtitle: "Editorial Diary", content: null, image: null, buttonText: null, buttonLink: null, sortOrder: 6 },
      { key: "contact_banner", title: "Collaboration & Inquiries", subtitle: "Get in Touch", content: "For academic correspondence, lecture bookings, or publishing inquiries, get in touch directly.", image: null, buttonText: null, buttonLink: null, sortOrder: 7 },
    ];

    const dbSections = await prisma.homepageSection.findMany();
    
    for (const defSec of defaultSections) {
      const exists = dbSections.some((s) => s.key === defSec.key);
      if (!exists) {
        await prisma.homepageSection.create({
          data: {
            key: defSec.key,
            title: defSec.title,
            subtitle: defSec.subtitle,
            content: defSec.content,
            image: defSec.image,
            buttonText: defSec.buttonText,
            buttonLink: defSec.buttonLink,
            sortOrder: defSec.sortOrder,
            isVisible: true,
          }
        });
      }
    }

    homepageSections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Settings load error:", error);
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Global Website Settings</h1>
        <p className="text-xs text-text-secondary">Modify SEO tags, social media accounts, contact information, and global biography details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Side: General Settings Form & Admin Profile Settings Form */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-forest border-b border-border-editorial pb-2">
              Metadata &amp; Contact Configurations
            </h2>
            <SettingsForm initialSettings={settings} />
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-forest border-b border-border-editorial pb-2">
              Admin Account Credentials
            </h2>
            {adminUser && (
              <AdminProfileForm
                initialName={adminUser.name}
                initialEmail={adminUser.email}
              />
            )}
          </div>
        </div>

        {/* Right Side: Homepage Layout Sections Form */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-forest border-b border-border-editorial pb-2">
            Landing Page Customization
          </h2>
          <SectionsForm initialSections={homepageSections} />
        </div>
      </div>
    </div>
  );
}

