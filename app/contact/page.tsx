import React from "react";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const revalidate = 0;

export default async function ContactPage() {
  let contactEmail = "contact@shahidfayaz.com";
  let contactPhone = "";
  let contactAddress = "";
  let socials: any = {};

  try {
    const settings = await prisma.setting.findMany();
    contactEmail = settings.find((s) => s.key === "contact_email")?.value || contactEmail;
    contactPhone = settings.find((s) => s.key === "contact_phone")?.value || "";
    contactAddress = settings.find((s) => s.key === "contact_address")?.value || "";
    socials = {
      twitter: settings.find((s) => s.key === "social_twitter")?.value,
      instagram: settings.find((s) => s.key === "social_instagram")?.value,
      linkedin: settings.find((s) => s.key === "social_linkedin")?.value,
    };
  } catch (error) {
    console.error("Contact settings query error:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Contact Info Sidebar */}
      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-4">
          <span className="section-label">Get in Touch</span>
          <h1 className="text-editorial-title font-heading text-forest">
            Correspondence
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            For academic collaborations, lecturing schedules, publishing rights, or media inquiries, please get in touch.
          </p>
        </div>

        {/* Details List */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-full bg-soft-ivory border border-border-editorial flex items-center justify-center text-forest shrink-0">
              <Mail className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Email Address</span>
              <p className="text-sm font-semibold text-forest">
                <a href={`mailto:${contactEmail}`} className="hover:underline">
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>

          {contactPhone && (
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-soft-ivory border border-border-editorial flex items-center justify-center text-forest shrink-0">
                <Phone className="w-4 h-4" />
              </span>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Phone Number</span>
                <p className="text-sm font-semibold text-forest">{contactPhone}</p>
              </div>
            </div>
          )}

          {contactAddress && (
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-soft-ivory border border-border-editorial flex items-center justify-center text-forest shrink-0">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Mailing Address</span>
                <p className="text-sm font-semibold text-forest whitespace-pre-line">{contactAddress}</p>
              </div>
            </div>
          )}
        </div>

        {/* Socials Connection */}
        <div className="space-y-4 pt-6 border-t border-border-editorial">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-text-secondary">Digital Channels</h4>
          <div className="flex space-x-4">
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-soft-ivory border border-border-editorial flex items-center justify-center text-text-secondary hover:text-forest hover:border-forest transition-colors duration-300"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4.5 h-4.5" />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-soft-ivory border border-border-editorial flex items-center justify-center text-text-secondary hover:text-forest hover:border-forest transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-soft-ivory border border-border-editorial flex items-center justify-center text-text-secondary hover:text-forest hover:border-forest transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4.5 h-4.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="lg:col-span-7">
        <ContactForm />
      </div>
    </div>
  );
}
