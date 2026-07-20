import React from "react";
import { prisma } from "@/lib/prisma";
import { ArrowUpRight, FolderOpen, Calendar, Tag } from "lucide-react";

export const revalidate = 0;

export default async function WorksPage() {
  let works: any[] = [];
  try {
    works = await prisma.work.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Works page query error:", error);
  }

  // Group works by type
  const groupedWorks = works.reduce((acc: any, work: any) => {
    const type = work.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(work);
    return acc;
  }, {});

  const typeLabels: Record<string, string> = {
    research: "Academic Research & Publications",
    political: "Political Monographs",
    literary: "Literary Studies",
    social: "Social Initiatives & Archives",
    international: "International Affairs",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
      <div className="space-y-4 max-w-2xl">
        <span className="section-label">Contributions</span>
        <h1 className="text-editorial-title font-heading text-forest">
          Academic Research &amp; Projects
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Explore research monographs, peer-reviewed studies, mapping archives, and international policy papers authored by Shahid Fayaz.
        </p>
      </div>

      {Object.keys(groupedWorks).length > 0 ? (
        <div className="space-y-16">
          {Object.entries(groupedWorks).map(([type, items]: [string, any]) => (
            <div key={type} className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider">
                {typeLabels[type] || type}
              </h2>

              <div className="flex flex-col divide-y divide-border-editorial">
                {items.map((work: any) => (
                  <div
                    key={work.id}
                    className="work-item py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
                        {work.date && (
                          <span className="flex items-center gap-1 font-body">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(work.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-xl font-medium text-forest">
                        {work.title}
                      </h3>
                      <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                        {work.description}
                      </p>
                      {work.tags && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {work.tags.split(",").map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold tracking-widest text-gold uppercase bg-soft-ivory border border-border-editorial px-2 py-0.5 rounded-sm flex items-center gap-1"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              <span>{tag.trim()}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {work.externalLink && (
                      <a
                        href={work.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold tracking-wider text-forest hover:text-gold uppercase inline-flex items-center gap-1 mt-2 md:mt-0 shrink-0 border border-border-editorial px-4 py-2 hover:border-forest transition-colors bg-white"
                      >
                        <span>View Contribution</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-text-tertiary font-heading text-lg">
          No projects listed at the moment.
        </div>
      )}
    </div>
  );
}
