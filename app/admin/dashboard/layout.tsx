import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  BookOpen,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Settings as SettingsIcon,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  User,
  Compass,
  Tag,
} from "lucide-react";
import AdminSignOutButton from "@/components/AdminSignOutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/admin");
  }

  const sidebarLinks = [
    { label: "Overview", url: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Books", url: "/admin/dashboard/books", icon: BookOpen },
    { label: "Essays & Articles", url: "/admin/dashboard/articles", icon: FileText },
    { label: "Research & Works", url: "/admin/dashboard/works", icon: Briefcase },
    { label: "Media Gallery", url: "/admin/dashboard/gallery", icon: ImageIcon },
    { label: "Correspondence", url: "/admin/dashboard/messages", icon: MessageSquare },
    { label: "Menus & Navigation", url: "/admin/dashboard/navigation", icon: Compass },
    { label: "Custom Pages", url: "/admin/dashboard/pages", icon: FileText },
    { label: "Categories", url: "/admin/dashboard/categories", icon: Tag },
    { label: "Settings", url: "/admin/dashboard/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-soft-ivory flex flex-col md:flex-row">
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-forest text-white shrink-0 flex flex-col justify-between p-6 border-r border-forest-dark">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-heading text-xl font-medium tracking-wide text-white">
              Shahid Fayaz
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-gold font-bold">
              CMS Dashboard
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-forest-dark transition-all"
                >
                  <Icon className="w-4.5 h-4.5 text-gold shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-6 border-t border-forest-dark flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-forest-dark border border-gold flex items-center justify-center text-gold">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-white">{session.user?.name}</p>
              <p className="text-[9px] text-zinc-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main Administrative Display Panel */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
