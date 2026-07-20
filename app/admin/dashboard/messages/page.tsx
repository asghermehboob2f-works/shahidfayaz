import React from "react";
import { prisma } from "@/lib/prisma";
import MessagesList from "@/components/MessagesList";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  let messages: any[] = [];
  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Messages list load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Correspondence Inquiries</h1>
        <p className="text-xs text-text-secondary">View and manage inquiries from readers, publishers, and lecture organizers.</p>
      </div>

      <MessagesList messages={messages} />
    </div>
  );
}
