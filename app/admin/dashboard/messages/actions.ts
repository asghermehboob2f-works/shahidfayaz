"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsRead(id: number, isRead: boolean) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath("/admin/dashboard/messages");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Mark read error:", error);
    return { error: "Failed to update status." };
  }
}

export async function deleteMessage(id: number) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard/messages");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete message error:", error);
    return { error: "Failed to delete message." };
  }
}
