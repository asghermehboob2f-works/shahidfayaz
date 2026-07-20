import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  FileText,
  Briefcase,
  MessageSquare,
  ArrowRight,
  Mail,
  Plus,
  Settings as SettingsIcon,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  let stats = { books: 0, articles: 0, works: 0, messages: 0 };
  let recentMessages: any[] = [];

  try {
    stats = {
      books: await prisma.book.count(),
      articles: await prisma.article.count(),
      works: await prisma.work.count(),
      messages: await prisma.contactMessage.count({ where: { isRead: false } }),
    };

    recentMessages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch (error) {
    console.error("Dashboard overview query error:", error);
  }

  const statCards = [
    { label: "Published Books", count: stats.books, link: "/admin/dashboard/books", icon: BookOpen, color: "text-blue-700 bg-blue-50" },
    { label: "Essays & Articles", count: stats.articles, link: "/admin/dashboard/articles", icon: FileText, color: "text-green-700 bg-green-50" },
    { label: "Research Contributions", count: stats.works, link: "/admin/dashboard/works", icon: Briefcase, color: "text-purple-700 bg-purple-50" },
    { label: "Unread Messages", count: stats.messages, link: "/admin/dashboard/messages", icon: MessageSquare, color: stats.messages > 0 ? "text-amber-700 bg-amber-50 animate-pulse" : "text-zinc-500 bg-zinc-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">CMS Overview</h1>
        <p className="text-xs text-text-secondary">Welcome back. Here is an overview of the content and reader inquiries.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-border-editorial p-6 flex items-center justify-between rounded-sm shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">{card.label}</span>
                <p className="text-3xl font-heading font-bold text-forest">{card.count}</p>
                <Link
                  href={card.link}
                  className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-gold-dark inline-flex items-center gap-1 transition-colors"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries */}
        <div className="lg:col-span-8 bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border-editorial pb-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-forest">Recent Correspondence</h3>
            <Link
              href="/admin/dashboard/messages"
              className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-gold-dark inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-border-editorial">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="py-4 flex justify-between items-start gap-4 hover:bg-soft-ivory/20 px-2 transition-all">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${msg.isRead ? "bg-zinc-100 text-zinc-500" : "bg-amber-100 text-amber-800"}`}>
                        {msg.isRead ? "Read" : "Unread"}
                      </span>
                      <span className="text-xs font-bold text-forest truncate">{msg.name}</span>
                    </div>
                    <p className="text-xs text-text-primary font-semibold truncate">{msg.subject || "(No Subject)"}</p>
                    <p className="text-xs text-text-secondary line-clamp-1">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-text-tertiary font-body shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-tertiary text-xs">No correspondence received yet.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 bg-white border border-border-editorial p-6 rounded-sm shadow-sm space-y-6">
          <h3 className="text-xs uppercase tracking-wider font-bold text-forest border-b border-border-editorial pb-3">Quick Actions</h3>

          <div className="flex flex-col space-y-3">
            <Link
              href="/admin/dashboard/articles?action=new"
              className="flex items-center gap-3 px-4 py-3 border border-border-editorial hover:border-forest rounded-sm text-xs font-semibold text-forest hover:bg-soft-ivory/30 transition-all uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Compose Essay</span>
            </Link>
            <Link
              href="/admin/dashboard/books?action=new"
              className="flex items-center gap-3 px-4 py-3 border border-border-editorial hover:border-forest rounded-sm text-xs font-semibold text-forest hover:bg-soft-ivory/30 transition-all uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Register New Book</span>
            </Link>
            <Link
              href="/admin/dashboard/about-settings"
              className="flex items-center gap-3 px-4 py-3 border border-border-editorial hover:border-forest rounded-sm text-xs font-semibold text-forest hover:bg-soft-ivory/30 transition-all uppercase tracking-wider"
            >
              <SettingsIcon className="w-4 h-4 text-gold" />
              <span>Edit About Page</span>
            </Link>
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 border border-border-editorial hover:border-forest rounded-sm text-xs font-semibold text-forest hover:bg-soft-ivory/30 transition-all uppercase tracking-wider"
            >
              <SettingsIcon className="w-4 h-4 text-gold" />
              <span>Edit Site Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
