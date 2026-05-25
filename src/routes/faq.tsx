import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

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
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const items = FAQS[tab];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-40 pb-24">
        <section className="max-w-[1400px] mx-auto px-6 mb-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">Appendix</span>
            </div>
            <h1 className="font-serif text-6xl md:text-[8rem] leading-[0.9] max-w-[16ch]">
              Questions, <span className="italic text-foreground/60">answered.</span>
            </h1>
          </ScrollReveal>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-[200px_1fr] gap-16">
          <aside className="md:sticky md:top-32 self-start">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">Audience</p>
            <nav className="flex md:flex-col gap-1">
              {(Object.keys(FAQS) as Array<keyof typeof FAQS>).map((k) => (
                <button
                  key={k}
                  onClick={() => { setTab(k); setOpenIdx(0); }}
                  className={`text-left font-serif text-2xl py-2 transition-colors ${
                    tab === k ? "italic text-foreground" : "text-foreground/40 hover:text-foreground"
                  }`}
                >
                  {k}
                </button>
              ))}
            </nav>
          </aside>

          <div>
            {items.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={item.q} className="border-b border-foreground/10">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full text-left py-8 flex items-start justify-between gap-6 group"
                  >
                    <div className="flex items-baseline gap-6">
                      <span className="font-serif italic text-foreground/30 text-lg">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="font-serif text-2xl md:text-3xl group-hover:italic transition-all">{item.q}</h3>
                    </div>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="font-serif text-3xl shrink-0">+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 pl-12 text-foreground/70 text-lg max-w-[60ch] leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 mt-32 text-center">
          <ScrollReveal>
            <h3 className="font-serif text-5xl md:text-6xl">Still <span className="italic">turning</span> the page?</h3>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-sm">
              Reach the studio <span className="font-serif italic text-xl">→</span>
            </Link>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}