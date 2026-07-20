"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteNavigationItem(id: number) {
  try {
    await prisma.navigationItem.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/navigation");
    return { success: true };
  } catch (error) {
    console.error("Delete navigation item error:", error);
    return { error: "Failed to delete navigation item." };
  }
}

export async function createNavigationItem(data: {
  label: string;
  url: string;
  position: string;
  sortOrder: number;
}) {
  try {
    const newItem = await prisma.navigationItem.create({
      data: {
        label: data.label,
        url: data.url,
        location: data.position || "header",
        sortOrder: data.sortOrder || 0,
        isVisible: true,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/navigation");
    return { success: true, item: newItem };
  } catch (error) {
    console.error("Create navigation item error:", error);
    return { error: "Failed to create navigation item." };
  }
}

export async function updateNavigationItem(
  id: number,
  data: {
    label: string;
    url: string;
    position: string;
    sortOrder: number;
  }
) {
  try {
    const updatedItem = await prisma.navigationItem.update({
      where: { id },
      data: {
        label: data.label,
        url: data.url,
        location: data.position,
        sortOrder: data.sortOrder,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/navigation");
    return { success: true, item: updatedItem };
  } catch (error) {
    console.error("Update navigation item error:", error);
    return { error: "Failed to update navigation item." };
  }
}
