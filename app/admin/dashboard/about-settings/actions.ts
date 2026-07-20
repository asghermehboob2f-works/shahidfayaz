"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAboutPageData(data: any) {
  try {
    const jsonStr = JSON.stringify(data);
    await prisma.setting.upsert({
      where: { key: "about_page_data" },
      update: { value: jsonStr, type: "json", group: "about" },
      create: { key: "about_page_data", value: jsonStr, type: "json", group: "about" },
    });
    revalidatePath("/about");
    return { success: true };
  } catch (error) {
    console.error("Failed to update about page data:", error);
    return { error: "Failed to update about page data." };
  }
}
