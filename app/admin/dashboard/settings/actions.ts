"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateSetting(key: string, value: string) {
  try {
    await prisma.setting.update({
      where: { key },
      data: { value },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Setting update error:", error);
    return { error: "Failed to update setting." };
  }
}

export async function updateHomepageSection(
  key: string,
  data: {
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
    buttonText?: string;
    buttonLink?: string;
    extraData?: string;
    isVisible?: boolean;
  }
) {
  try {
    await prisma.homepageSection.update({
      where: { key },
      data: {
        title: data.title !== undefined ? data.title : null,
        subtitle: data.subtitle !== undefined ? data.subtitle : null,
        content: data.content !== undefined ? data.content : null,
        image: data.image !== undefined ? data.image : null,
        buttonText: data.buttonText !== undefined ? data.buttonText : null,
        buttonLink: data.buttonLink !== undefined ? data.buttonLink : null,
        extraData: data.extraData !== undefined ? data.extraData : null,
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Homepage section update error:", error);
    return { error: "Failed to update homepage section." };
  }
}

export async function updateAdminProfile(data: {
  name: string;
  email: string;
  password?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return { error: "Unauthorized access." };
    }

    const currentEmail = session.user?.email;
    if (!currentEmail) {
      return { error: "Could not identify current admin email." };
    }

    // Check if new email is already in use by someone else
    if (data.email !== currentEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        return { error: "The new email is already in use by another account." };
      }
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { email: currentEmail },
      data: updateData,
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update admin credentials." };
  }
}

