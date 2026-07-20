import React from "react";
import { prisma } from "@/lib/prisma";
import NavigationManager from "@/components/NavigationManager";

export const revalidate = 0;

export default async function AdminNavigationPage() {
  let items: any[] = [];
  try {
    items = await prisma.navigationItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Navigation load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Menus &amp; Navigation</h1>
        <p className="text-xs text-text-secondary">
          Configure site-wide links in the header and footer, adjust labels, URLs, target areas, and customize sorting order.
        </p>
      </div>

      <NavigationManager items={items} />
    </div>
  );
}
