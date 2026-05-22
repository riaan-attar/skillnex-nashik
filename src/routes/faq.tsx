import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Skillnex" },
      { name: "description", content: "Answers to common questions about Skillnex programs, firms partnerships, and college tie-ups." },
    ],
  }),
  component: FaqPage,
});

const FAQS = {
  Students: [
    { q: "How do I start learning?", a: "Create an account, browse programs, and enroll in your first course. You can start watching lessons immediately." },
    { q: "Do I need prior experience?", a: "No. Most programs are designed to take complete beginners to a job-ready level." },
    { q: "Will I get practical projects?", a: "Yes. Every program is built around real briefs that become portfolio pieces." },
    { q: "What skills will I learn?", a: "Depends on the program — from video editing and graphic design to social media management and performance marketing." },
  ],
  Firms: [
    { q: "Can Skillnex train our team?", a: "Yes — we run custom workshops and ongoing programs for corporate teams. Reach out via the contact page." },
    { q: "What's included in a corporate program?", a: "Discovery, syllabus, live sessions, project reviews, and outcome tracking." },
  ],
  "College Tie-ups": [
    { q: "How do campus programs work?", a: "We offer 15-day live workshops, 1-day seminars, and student-specific cohorts inside colleges." },
    { q: "Who teaches?", a: "Working professionals from across the digital industry." },
  ],
};

function FaqPage() {
  const [tab, setTab] = useState<keyof typeof FAQS>("Students");
  const items = FAQS[tab];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 text-center">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">Skillnex</span>
        <h1 className="text-5xl md:text-6xl font-serif italic mt-3 mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-10">Find answers to common questions about Skillnex.</p>

        <div className="inline-flex gap-2 rounded-full p-1 ring-1 ring-border bg-secondary/50 mb-12">
          {(Object.keys(FAQS) as Array<keyof typeof FAQS>).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="space-y-3 text-left">
          {items.map((item) => (
            <details key={item.q} className="group rounded-xl ring-1 ring-border p-5 open:bg-secondary/30">
              <summary className="cursor-pointer flex justify-between items-center font-medium">
                {item.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">⌃</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-24">
          <h3 className="text-3xl font-serif italic mb-6">Still have questions?</h3>
          <Link to="/contact" className="inline-flex bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium">
            Contact us
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}