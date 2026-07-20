import React from "react";
import { prisma } from "@/lib/prisma";
import AboutSettingsForm from "@/components/AboutSettingsForm";

export const revalidate = 0;

export default async function AdminAboutSettingsPage() {
  let aboutData = null;

  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "about_page_data" },
    });

    if (setting && setting.value) {
      aboutData = JSON.parse(setting.value);
    }
  } catch (error) {
    console.error("Failed to load about page settings:", error);
  }

  const defaultData = {
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

  const initialData = aboutData || defaultData;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">About Page Settings</h1>
        <p className="text-xs text-text-secondary">
          Manage the content of the About page including biography, photo, credentials, and timeline.
        </p>
      </div>

      <AboutSettingsForm initialData={initialData} />
    </div>
  );
}
