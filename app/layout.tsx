import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import AmbientBackground from "@/components/AmbientBackground";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.setting.findMany();
    const siteTitle = settings.find((s) => s.key === "site_title")?.value || "Shahid Fayaz | Author & Philosopher";
    const metaDesc = settings.find((s) => s.key === "meta_description")?.value || "Official literary portal of Shahid Fayaz.";
    const metaKeywords = settings.find((s) => s.key === "meta_keywords")?.value || "";

    return {
      title: {
        default: siteTitle,
        template: `%s | ${siteTitle.split(" | ")[0]}`,
      },
      description: metaDesc,
      keywords: metaKeywords ? metaKeywords.split(",").map((k) => k.trim()) : undefined,
      openGraph: {
        title: siteTitle,
        description: metaDesc,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: metaDesc,
      },
    };
  } catch {
    return {
      title: "Shahid Fayaz | Author & Philosopher",
      description: "Official literary portal of Shahid Fayaz.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navItems: any[] = [];
  let siteName = "Shahid Fayaz";
  let bioShort = "";
  let socials = {};

  try {
    navItems = await prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });

    const settings = await prisma.setting.findMany();
    siteName = settings.find((s) => s.key === "site_name")?.value || "Shahid Fayaz";
    bioShort = settings.find((s) => s.key === "bio_short")?.value || "";
    socials = {
      twitter: settings.find((s) => s.key === "social_twitter")?.value,
      instagram: settings.find((s) => s.key === "social_instagram")?.value,
      linkedin: settings.find((s) => s.key === "social_linkedin")?.value,
    };
  } catch (error) {
    console.error("Layout load error:", error);
    navItems = [
      { id: 1, label: "Home", url: "/" },
      { id: 2, label: "Books", url: "/books" },
      { id: 3, label: "About", url: "/about" },
      { id: 4, label: "Works", url: "/works" },
      { id: 5, label: "Gallery", url: "/gallery" },
      { id: 6, label: "Articles", url: "/articles" },
      { id: 7, label: "Contact", url: "/contact" },
    ];
  }

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-warm-white text-text-primary overflow-x-hidden relative selection:bg-gold selection:text-white"
        suppressHydrationWarning
      >
        <CustomCursor />
        <AmbientBackground />
        <SmoothScroll>
          <Navbar navItems={navItems} siteName={siteName} />
          <main className="flex-grow pt-24 md:pt-28">{children}</main>
          <Footer navItems={navItems} siteName={siteName} bioShort={bioShort} socials={socials} />
        </SmoothScroll>
      </body>
    </html>
  );
}
