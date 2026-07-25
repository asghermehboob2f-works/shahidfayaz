import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, Book, FileText, Briefcase, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  let bookResults: any[] = [];
  let articleResults: any[] = [];
  let workResults: any[] = [];

  if (q.trim()) {
    try {
      // Query Books
      bookResults = await prisma.book.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q } },
            { subtitle: { contains: q } },
            { description: { contains: q } },
            { synopsis: { contains: q } },
          ],
        },
      });

      // Query Articles
      articleResults = await prisma.article.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { body: { contains: q } },
          ],
        },
      });

      // Query Works
      workResults = await prisma.work.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { tags: { contains: q } },
          ],
        },
      });
    } catch (error) {
      console.error("Search query error:", error);
    }
  }

  const totalResults = bookResults.length + articleResults.length + workResults.length;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 space-y-12">
      {/* Page Header */}
      <ScrollReveal variant="fadeUp" className="space-y-4 text-center">
        <span className="section-label justify-center">Archive Search</span>
        <h1 className="text-editorial-title font-heading text-forest">
          Search the Literary Portal
        </h1>
      </ScrollReveal>

      {/* Search Input Box */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <form method="GET" action="/search" className="relative max-w-2xl mx-auto">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by title, keywords, essays, concepts..."
            className="w-full bg-warm-white/80 backdrop-blur-md border border-border-editorial text-sm px-6 py-4 pr-12 focus:outline-none focus:border-forest transition-colors font-semibold uppercase tracking-wider shadow-editorial rounded-xs"
          />
          <button
            type="submit"
            className="absolute right-4 top-4 text-text-secondary hover:text-forest transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </ScrollReveal>

      {/* Search Results Display */}
      {q.trim() ? (
        <ScrollReveal variant="fadeUp" delay={0.2} className="space-y-10 pt-4">
          <p className="text-xs text-text-tertiary text-center uppercase tracking-widest font-bold font-body">
            Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </p>

          {/* Books Section */}
          {bookResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider flex items-center gap-2">
                <Book className="w-4 h-4 text-gold" />
                <span>Books ({bookResults.length})</span>
              </h2>
              <div className="divide-y divide-border-editorial">
                {bookResults.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.slug}`}
                    className="py-4 block hover:bg-soft-ivory/40 px-4 transition-colors group rounded-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-forest group-hover:text-gold transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-1 font-body">{book.subtitle || book.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-forest transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles Section */}
          {articleResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                <span>Essays &amp; Articles ({articleResults.length})</span>
              </h2>
              <div className="divide-y divide-border-editorial">
                {articleResults.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="py-4 block hover:bg-soft-ivory/40 px-4 transition-colors group rounded-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-forest group-hover:text-gold transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-1 font-body">{article.excerpt}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-forest transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Works Section */}
          {workResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-forest border-b border-border-editorial pb-2 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold" />
                <span>Contributions &amp; Works ({workResults.length})</span>
              </h2>
              <div className="divide-y divide-border-editorial">
                {workResults.map((work) => (
                  <div
                    key={work.id}
                    className="py-4 px-4 block hover:bg-soft-ivory/40 transition-colors rounded-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-forest">
                          {work.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-1 font-body">{work.description}</p>
                      </div>
                      {work.externalLink ? (
                        <a
                          href={work.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-forest hover:text-gold flex items-center gap-1 uppercase font-body"
                        >
                          <span>Link</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm font-body">
              No matching records found. Try other keywords or review spelling.
            </div>
          )}
        </ScrollReveal>
      ) : (
        <div className="text-center py-20 text-text-tertiary text-sm font-body">
          Enter search terms above to start querying the database.
        </div>
      )}
    </div>
  );
}
