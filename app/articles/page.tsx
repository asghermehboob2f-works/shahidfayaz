import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export const revalidate = 0;

interface ArticlesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentCategorySlug = resolvedSearchParams.category || "";
  const currentSearch = resolvedSearchParams.search || "";
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 6;

  let categories: any[] = [];
  let articles: any[] = [];
  let totalArticles = 0;

  try {
    // 1. Fetch article categories
    categories = await prisma.category.findMany({
      where: { type: "article" },
    });

    // 2. Build Prisma where conditions
    const where: any = {
      isPublished: true,
    };

    if (currentCategorySlug) {
      where.category = {
        slug: currentCategorySlug,
      };
    }

    if (currentSearch) {
      where.OR = [
        { title: { contains: currentSearch } },
        { excerpt: { contains: currentSearch } },
        { body: { contains: currentSearch } },
      ];
    }

    // 3. Count total matching articles for pagination
    totalArticles = await prisma.article.count({ where });

    // 4. Fetch page items
    articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      include: {
        category: true,
        user: true,
      },
    });
  } catch (error) {
    console.error("Articles query error:", error);
  }

  const totalPages = Math.ceil(totalArticles / itemsPerPage);

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-16 md:py-24 space-y-12">
      {/* Page Title */}
      <ScrollReveal variant="fadeUp" className="space-y-4 max-w-2xl">
        <h1 className="text-editorial-title font-heading text-forest">
          Essays &amp; Commentary
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Reflections on geography, the linguistic architecture of borderlands, and contemporary post-colonial challenges.
        </p>
      </ScrollReveal>

      {/* Filter and Search Bar */}
      <ScrollReveal variant="fadeUp" delay={0.1} className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center pb-6 border-b border-border-editorial">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/articles"
            className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border rounded-xs transition-all duration-300 ${
              !currentCategorySlug
                ? "bg-forest text-white border-forest shadow-sm"
                : "border-border-editorial hover:border-forest text-text-secondary hover:text-forest bg-warm-white/50"
            }`}
          >
            All Essays
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/articles?category=${cat.slug}&search=${currentSearch}`}
              className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border rounded-xs transition-all duration-300 ${
                currentCategorySlug === cat.slug
                  ? "bg-forest text-white border-forest shadow-sm"
                  : "border-border-editorial hover:border-forest text-text-secondary hover:text-forest bg-warm-white/50"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search Form */}
        <form method="GET" action="/articles" className="relative max-w-xs w-full">
          {currentCategorySlug && (
            <input type="hidden" name="category" value={currentCategorySlug} />
          )}
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search essays..."
            className="w-full bg-soft-ivory/60 border border-border-editorial text-xs px-4 py-2.5 pr-10 focus:outline-none focus:border-forest transition-colors font-semibold uppercase tracking-wider rounded-xs"
          />
          <button
            type="submit"
            className="absolute right-3 top-2.5 text-text-secondary hover:text-forest transition-colors"
            aria-label="Search Submit"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </ScrollReveal>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {articles.map((article) => (
            <StaggerItem key={article.id}>
              <article className="group border border-border-editorial bg-warm-white transition-all duration-500 flex flex-col justify-between rounded-xs overflow-hidden shadow-editorial hover:shadow-editorial-hover hover:border-gold/60 h-full">
                <div className="space-y-6">
                  {/* Article Cover */}
                  <div className="aspect-[16/10] overflow-hidden bg-soft-ivory relative border-b border-border-editorial/60">
                    <img
                      src={article.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {article.category && (
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-wider font-bold text-forest border border-border-editorial/40 shadow-xs">
                        {article.category.name}
                      </span>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="px-6 space-y-4">
                    <div className="flex items-center space-x-3 text-[10px] text-text-tertiary">
                      <span className="flex items-center gap-1.5 font-body">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        <span>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : ""}
                        </span>
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border-editorial" />
                      <span className="flex items-center gap-1.5 font-body">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>{article.readingTime || "5"} min read</span>
                      </span>
                    </div>

                    <h2 className="font-heading text-2xl font-semibold text-forest leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed font-body">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-6">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-xs font-bold tracking-widest uppercase text-forest group-hover:text-gold inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1"
                  >
                    <span>Read Essay</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-20 text-text-tertiary font-heading text-lg">
          No articles match your query.
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-8 border-t border-border-editorial">
          <Link
            href={`/articles?category=${currentCategorySlug}&search=${currentSearch}&page=${currentPage - 1}`}
            className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border rounded-xs transition-all duration-300 ${
              currentPage <= 1
                ? "opacity-40 pointer-events-none border-border-editorial"
                : "border-border-editorial hover:border-forest text-text-secondary hover:text-forest bg-warm-white/50"
            }`}
          >
            Previous
          </Link>
          <span className="text-xs font-semibold text-text-tertiary font-body">
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={`/articles?category=${currentCategorySlug}&search=${currentSearch}&page=${currentPage + 1}`}
            className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border rounded-xs transition-all duration-300 ${
              currentPage >= totalPages
                ? "opacity-40 pointer-events-none border-border-editorial"
                : "border-border-editorial hover:border-forest text-text-secondary hover:text-forest bg-warm-white/50"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
