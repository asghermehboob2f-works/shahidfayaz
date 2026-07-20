"use client";

import React, { useState, useTransition } from "react";
import { Mail, MailOpen, Trash2, Calendar, User, Eye, EyeOff } from "lucide-react";
import { markAsRead, deleteMessage } from "@/app/admin/dashboard/messages/actions";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface MessagesListProps {
  messages: Message[];
}

export default function MessagesList({ messages }: MessagesListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await markAsRead(id, !currentStatus);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: !currentStatus } : null));
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;

    startTransition(async () => {
      await deleteMessage(id);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Messages List Column */}
      <div className="lg:col-span-6 bg-white border border-border-editorial rounded-sm shadow-sm flex flex-col divide-y divide-border-editorial">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 flex flex-col space-y-3 hover:bg-soft-ivory/20 transition-all cursor-pointer ${
                selectedMessage?.id === msg.id ? "bg-soft-ivory/40 border-l-2 border-forest" : ""
              }`}
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm shrink-0 ${msg.isRead ? "bg-zinc-100 text-zinc-500" : "bg-amber-100 text-amber-800"}`}>
                    {msg.isRead ? "Read" : "Unread"}
                  </span>
                  <span className="text-xs font-bold text-forest truncate">{msg.name}</span>
                </div>
                <span className="text-[10px] text-text-tertiary shrink-0 font-body">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-text-primary truncate">{msg.subject || "(No Subject)"}</h4>
                <p className="text-xs text-text-secondary line-clamp-2">{msg.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-text-tertiary text-xs">
            No correspondence received yet.
          </div>
        )}
      </div>

      {/* Reader Panel Column */}
      <div className="lg:col-span-6 sticky top-8">
        {selectedMessage ? (
          <div className="bg-white border border-border-editorial p-6 md:p-8 rounded-sm shadow-sm space-y-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-border-editorial">
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold text-forest leading-tight">
                  {selectedMessage.subject || "(No Subject)"}
                </h3>
                <div className="text-[11px] text-text-secondary flex flex-wrap gap-x-4 gap-y-1 font-body">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gold" />
                    <span>{selectedMessage.name} &lt;{selectedMessage.email}&gt;</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span>{new Date(selectedMessage.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap font-body bg-soft-ivory/10 p-4 border border-border-editorial rounded-sm">
              {selectedMessage.message}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border-editorial justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.isRead)}
                  disabled={isPending}
                  className="btn-secondary py-2 px-4 flex items-center gap-1.5 text-xs font-semibold"
                >
                  {selectedMessage.isRead ? (
                    <>
                      <EyeOff className="w-4 h-4 text-gold" />
                      <span>Mark Unread</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-gold" />
                      <span>Mark Read</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message to Shahid Fayaz"}`}
                  className="btn-primary py-2 px-4 flex items-center gap-1.5 text-xs font-semibold"
                >
                  <span>Reply via Email</span>
                </a>
              </div>

              <button
                onClick={() => handleDelete(selectedMessage.id)}
                disabled={isPending}
                className="btn-secondary border-red-200 hover:border-red-600 text-red-700 hover:bg-red-50 py-2 px-4 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-border-editorial p-12 text-center text-text-tertiary text-xs rounded-sm shadow-sm">
            Select a message from the list to view details and take actions.
          </div>
        )}
      </div>
    </div>
  );
}
