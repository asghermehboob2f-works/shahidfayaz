import React from "react";
import { Award, BookOpen, GraduationCap, MapPin, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24">
      {/* 1. Page Header / Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        <div className="lg:col-span-7 space-y-6">
          <span className="section-label">Biography</span>
          <h1 className="text-editorial-title font-heading text-forest">
            About Shahid Fayaz
          </h1>

          <p className="text-editorial-lead text-text-secondary leading-relaxed">
            {data.bioLead}
          </p>
          <div className="space-y-4 text-editorial-body">
            {data.bioBody1 && <p>{data.bioBody1}</p>}
            {data.bioBody2 && <p>{data.bioBody2}</p>}
          </div>
        </div>

        {/* Editorial Photo */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] overflow-hidden shadow-editorial bg-soft-ivory">
            <img
              src={data.photoUrl}
              alt="Shahid Fayaz working in study"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-forest/5" />
          </div>
        </div>
      </div>

      {/* 2. Signature Philosophy Quote */}
      {(data.quoteText || data.quoteAuthor) && (
        <section className="bg-soft-ivory py-16 px-8 text-center rounded-sm max-w-4xl mx-auto border border-border-editorial">
          {data.quoteText && (
            <blockquote className="font-heading text-xl md:text-2xl italic leading-relaxed text-forest">
              {data.quoteText}
            </blockquote>
          )}
          {data.quoteAuthor && (
            <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-gold">
              — {data.quoteAuthor}
            </div>
          )}
        </section>
      )}

      {/* 3. Credentials & Areas Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-border-editorial p-8 rounded-sm space-y-4">
          <GraduationCap className="w-8 h-8 text-gold" />
          <h3 className="font-heading text-xl font-semibold text-forest">Education</h3>
          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed font-body">
            {data.education.map((item: any, idx: number) => (
              <li key={idx}><strong>{item.title}</strong><br />{item.subtitle}</li>
            ))}
          </ul>
        </div>

        <div className="border border-border-editorial p-8 rounded-sm space-y-4">
          <Award className="w-8 h-8 text-gold" />
          <h3 className="font-heading text-xl font-semibold text-forest">Fellowships &amp; Prizes</h3>
          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed font-body">
            {data.fellowships.map((item: any, idx: number) => (
              <li key={idx}><strong>{item.title}</strong><br />{item.subtitle}</li>
            ))}
          </ul>
        </div>

        <div className="border border-border-editorial p-8 rounded-sm space-y-4">
          <Globe className="w-8 h-8 text-gold" />
          <h3 className="font-heading text-xl font-semibold text-forest">Social Work</h3>
          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed font-body">
            {data.socialWork.map((item: any, idx: number) => (
              <li key={idx}><strong>{item.title}</strong><br />{item.subtitle}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Timeline Milestone Section */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="section-label">Chronology</span>
          <h2 className="text-editorial-title font-heading text-forest">Timeline of Milestones</h2>
        </div>

        <div className="max-w-3xl mx-auto relative border-l border-border-editorial pl-8 ml-4 space-y-12">
          {data.timeline.map((event: any, idx: number) => (
            <div key={idx} className="relative">
              {/* Dot indicator */}
              <span className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-warm-white border-2 border-gold flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-forest" />
              </span>
              <div className="space-y-1">
                <span className="font-heading text-lg font-bold text-gold">{event.year}</span>
                <h4 className="font-heading text-lg font-semibold text-forest leading-snug">
                  {event.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-body">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
