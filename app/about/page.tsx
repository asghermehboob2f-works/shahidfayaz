import React from "react";
import { Award, GraduationCap, Globe, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export const revalidate = 0;

export default async function AboutPage() {
  const session = await getServerSession(authOptions);

  let aboutData = null;
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "about_page_data" },
    });
    if (setting && setting.value) {
      aboutData = JSON.parse(setting.value);
    }
  } catch (error) {
    console.error("Failed to load about page data:", error);
  }

  const data = aboutData || {
    bioLead: "Shahid Fayaz is a post-colonial philosopher, author, and cultural archivist whose work explores language loss, identity reconstruction, and political resistance in border regions.",
    bioBody1: "Born and raised in the mountain valleys, Shahid’s research and writing are deeply rooted in the oral stories, landscapes, and linguistic struggles of communities that exist on the periphery of state borders. His studies analyze silence as an active mechanism of cultural shields and political autonomy.",
    bioBody2: "After completing his doctoral thesis at the London School of Economics, he launched the Sub-Himalayan Oral Archive, which records languages, songs, and historical memories in border regions.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    quoteText: "“To record the history of a borderland is to write the history of silence itself. The language of hegemony seeks to define space; the language of survival retreats into the unspoken.”",
    quoteAuthor: "SHAHID FAYAZ",
    education: [
      { title: "PhD in Political Science", subtitle: "London School of Economics (LSE)" },
      { title: "MA in Social Theory & Linguistics", subtitle: "University of Cambridge" },
      { title: "BA in Humanities & Philosophy", subtitle: "Kashmir University" },
    ],
    fellowships: [
      { title: "Visiting Fellow", subtitle: "Oxford Institute of Social Theory" },
      { title: "Literary Excellence Award", subtitle: "Global Humanities Council" },
      { title: "Outstanding Research Prize", subtitle: "Academy of Political Studies" },
    ],
    socialWork: [
      { title: "Founder", subtitle: "Sub-Himalayan Language Archive" },
      { title: "Community Coordinator", subtitle: "Borderland Schools Initiative" },
      { title: "Advisory Board Member", subtitle: "Oral History Association International" },
    ],
    timeline: [
      { year: "2025", title: "Oxford Philosophical Fellowship", description: "Appointed visiting fellow at the Oxford Institute of Social Theory." },
      { year: "2024", title: "Global Humanities Council Prize", description: "Received the prestigious Literary Excellence Award for research contributions on border languages." },
      { year: "2023", title: "Publication of 'The Anatomy of Silences'", description: "His second book became an instant classic in political philosophy and language theory." },
      { year: "2020", title: "Oral Archives Project", description: "Founded the Sub-Himalayan Oral Archive to record rapidly disappearing languages and family oral stories." },
      { year: "2018", title: "Doctor of Philosophy (PhD) in Political Science", description: "Completed doctoral studies at the London School of Economics, focusing on border ethnography." },
    ]
  };

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-16 md:py-24 space-y-36">
      {/* ── 1. EDITORIAL HEADER & BIOGRAPHY SPREAD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
        <ScrollReveal variant="editorialReveal" className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <h1 className="text-editorial-hero font-heading text-forest font-medium">
              About Shahid Fayaz
            </h1>
          </div>

          <p className="text-editorial-lead text-text-primary leading-relaxed drop-cap-editorial font-heading italic">
            {data.bioLead}
          </p>

          <div className="space-y-6 text-editorial-body">
            {data.bioBody1 && <p>{data.bioBody1}</p>}
            {data.bioBody2 && <p>{data.bioBody2}</p>}
          </div>
        </ScrollReveal>

        {/* Editorial Photo Frame */}
        <ScrollReveal variant="blurIn" delay={0.2} className="lg:col-span-5 flex justify-center sticky top-32">
          <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden shadow-editorial-hover bg-soft-ivory rounded-xs border-2 border-gold/40 group">
            <img
              src={data.photoUrl}
              alt="Shahid Fayaz portrait"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-gold/50 pointer-events-none group-hover:border-gold transition-colors duration-500" />
          </div>
        </ScrollReveal>
      </div>

      {/* ── 2. PHILOSOPHICAL QUOTE CARD ── */}
      {(data.quoteText || data.quoteAuthor) && (
        <ScrollReveal variant="blurIn">
          <section className="bg-obsidian text-white py-24 px-8 text-center rounded-xs max-w-5xl mx-auto border border-gold/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 philosophy-dots opacity-25 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

            {data.quoteText && (
              <blockquote className="font-heading text-2xl md:text-4xl italic leading-relaxed text-warm-white font-light max-w-4xl mx-auto">
                {data.quoteText}
              </blockquote>
            )}
            {data.quoteAuthor && (
              <div className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-gold font-body">
                — {data.quoteAuthor}
              </div>
            )}
          </section>
        </ScrollReveal>
      )}

      {/* ── 3. ACADEMIC & SOCIAL REGISTRY ── */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
        <StaggerItem>
          <div className="border border-border-editorial/80 bg-warm-white/80 backdrop-blur-md p-8 rounded-xs space-y-6 hover:border-gold/60 transition-all duration-300 shadow-editorial hover:shadow-editorial-hover h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-gold">
                <GraduationCap className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest">Education</h3>
              <ul className="space-y-4 text-xs text-text-secondary leading-relaxed font-body">
                {data.education.map((item: any, idx: number) => (
                  <li key={idx} className="border-b border-border-editorial/40 pb-3 last:border-0">
                    <strong className="text-forest font-semibold block text-sm">{item.title}</strong>
                    <span className="text-text-tertiary">{item.subtitle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="border border-border-editorial/80 bg-warm-white/80 backdrop-blur-md p-8 rounded-xs space-y-6 hover:border-gold/60 transition-all duration-300 shadow-editorial hover:shadow-editorial-hover h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-gold">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest">Fellowships &amp; Prizes</h3>
              <ul className="space-y-4 text-xs text-text-secondary leading-relaxed font-body">
                {data.fellowships.map((item: any, idx: number) => (
                  <li key={idx} className="border-b border-border-editorial/40 pb-3 last:border-0">
                    <strong className="text-forest font-semibold block text-sm">{item.title}</strong>
                    <span className="text-text-tertiary">{item.subtitle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="border border-border-editorial/80 bg-warm-white/80 backdrop-blur-md p-8 rounded-xs space-y-6 hover:border-gold/60 transition-all duration-300 shadow-editorial hover:shadow-editorial-hover h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-gold">
                <Globe className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-forest">Social Work</h3>
              <ul className="space-y-4 text-xs text-text-secondary leading-relaxed font-body">
                {data.socialWork.map((item: any, idx: number) => (
                  <li key={idx} className="border-b border-border-editorial/40 pb-3 last:border-0">
                    <strong className="text-forest font-semibold block text-sm">{item.title}</strong>
                    <span className="text-text-tertiary">{item.subtitle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* ── 4. CHRONOLOGY TIMELINE ── */}
      <section className="space-y-12">
        <ScrollReveal variant="fadeUp" className="text-center space-y-2">
          <h2 className="text-editorial-title font-heading text-forest">Timeline of Milestones</h2>
        </ScrollReveal>

        <StaggerContainer className="max-w-4xl mx-auto relative border-l-2 border-border-editorial pl-8 md:pl-12 space-y-12" staggerDelay={0.12}>
          {data.timeline.map((event: any, idx: number) => (
            <StaggerItem key={idx}>
              <div className="relative group">
                {/* Year Badge Node */}
                <span className="absolute -left-[43px] md:-left-[59px] top-1.5 w-6 h-6 rounded-full bg-warm-white border-2 border-gold flex items-center justify-center shadow-sm" />

                <div className="space-y-2 bg-warm-white/70 backdrop-blur-md p-6 md:p-8 rounded-xs border border-border-editorial/70 shadow-editorial group-hover:border-gold/60 transition-all duration-300">
                  <span className="font-heading text-2xl font-bold text-gold">{event.year}</span>
                  <h4 className="font-heading text-2xl font-medium text-forest leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-body">
                    {event.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}


