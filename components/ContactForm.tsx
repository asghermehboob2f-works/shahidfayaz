"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    else if (formData.subject.trim().length < 3) newErrors.subject = "Subject must be at least 3 characters";

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "An error occurred while submitting your message.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="bg-warm-white/70 backdrop-blur-md border border-border-editorial p-8 md:p-12 rounded-xs shadow-editorial hover:shadow-editorial-hover transition-all duration-500 hover:border-gold/60">
      {status === "success" ? (
        <div className="text-center py-12 space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center text-forest">
            <CheckCircle className="w-10 h-10 text-forest" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-forest">Message Sent Successfully</h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed font-body">
              Thank you for reaching out. Your message has been logged, and we will get back to you shortly.
            </p>
          </div>
          <button
            onClick={() => setStatus("idle")}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary font-body">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input rounded-xs"
                placeholder="e.g. John Doe"
                disabled={status === "submitting"}
              />
              {errors.name && <span className="text-[10px] text-red-700 font-bold block">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary font-body">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input rounded-xs"
                placeholder="e.g. john@example.com"
                disabled={status === "submitting"}
              />
              {errors.email && <span className="text-[10px] text-red-700 font-bold block">{errors.email}</span>}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary font-body">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-input rounded-xs"
              placeholder="e.g. Lecture booking query"
              disabled={status === "submitting"}
            />
            {errors.subject && <span className="text-[10px] text-red-700 font-bold block">{errors.subject}</span>}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-secondary font-body">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="form-input resize-none rounded-xs"
              placeholder="Write your correspondence details..."
              disabled={status === "submitting"}
            />
            {errors.message && <span className="text-[10px] text-red-700 font-bold block">{errors.message}</span>}
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-4 border border-red-200 rounded-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary w-full justify-center group"
            >
              <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span>{status === "submitting" ? "Sending correspondence..." : "Submit Correspondence"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
