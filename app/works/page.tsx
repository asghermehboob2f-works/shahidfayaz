import React from "react";
import { prisma } from "@/lib/prisma";
import { ArrowUpRight, Calendar, Tag, Sparkles } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

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
    <div className="w-full px-6 md:px-10 lg:px-12 py-16 md:py-24 space-y-16">
      <ScrollReveal variant="editorialReveal" className="space-y-4 max-w-3xl border-b border-border-editorial pb-8">
        <h1 className="text-editorial-hero font-heading text-forest font-medium">
          Academic Research &amp; Projects
        </h1>
        <p className="text-editorial-lead text-text-secondary font-light">
          Explore research monographs, peer-reviewed studies, mapping archives, and international policy papers authored by Shahid Fayaz.
        </p>
      </ScrollReveal>

      {Object.keys(groupedWorks).length > 0 ? (
        <div className="space-y-20">
          {Object.entries(groupedWorks).map(([type, items]: [string, any]) => (
            <ScrollReveal key={type} variant="fadeUp" className="space-y-8">
              <h2 className="font-heading text-2xl font-bold text-forest border-b border-border-editorial pb-4 uppercase tracking-[0.2em]">
                {typeLabels[type] || type}
              </h2>

              <StaggerContainer className="flex flex-col gap-6" staggerDelay={0.1}>
                {items.map((work: any) => (
                  <StaggerItem key={work.id}>
                    <div className="bg-warm-white border border-border-editorial p-6 md:p-8 rounded-xs shadow-sm hover:shadow-editorial-hover transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-[10px] text-text-tertiary font-body">
                          {work.date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gold" />
                              <span>{new Date(work.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-xl md:text-2xl font-medium text-forest group-hover:text-gold transition-colors duration-300">
                          {work.title}
                        </h3>
                        <p className="text-xs text-text-secondary max-w-3xl leading-relaxed font-body font-light">
                          {work.description}
                        </p>
                        {work.tags && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {work.tags.split(",").map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase bg-gold/10 border border-gold/30 px-3 py-1 rounded-xs flex items-center gap-1.5"
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
                          className="btn-secondary group text-xs shrink-0 py-2.5 px-5"
                        >
                          <span>View Contribution</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </ScrollReveal>
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

