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
  Overview: [
    { q: "What is Skillnex?", a: "Skillnex is a skill-focused ecosystem that bridges the gap between learning and real-world execution. We help students build practical skills, colleges create industry-ready talent, and companies build strong in-house teams." },
    { q: "How is Skillnex different from traditional learning platforms?", a: "We start with skill-focused counselling to help you find the right path, then move into real execution through projects and mentorship — not just video courses." },
  ],
  "Skill Counselling": [
    { q: "How does skill-focused counselling work at Skillnex?", a: "We offer free 1-on-1 sessions to understand your strengths, interests, and career goals, then create a structured path based on real market demand." },
    { q: "How do I choose the right niche or skill?", a: "Our counsellors help you identify your niche based on strengths, market demand, and career opportunities so you avoid wasting time on random learning." },
  ],
  "Learning & Execution": [
    { q: "What kind of skills can I learn on Skillnex?", a: "Performance Marketing, Video Editing, Graphic Design, UI/UX, Full Stack Development, Social Media Management, and Soft Skills — all focused on practical, job-ready execution." },
    { q: "Do I get real projects or just training?", a: "You work on real projects, live briefs, and simulations to build actual experience and a portfolio that stands out." },
    { q: "How does Skillnex help in real-world execution?", a: "Every program is designed around hands-on work, not just theory. You learn by doing, building a portfolio as you progress." },
  ],
  "Mentorship & Growth": [
    { q: "Will I get mentorship from industry experts?", a: "Yes. You'll receive guidance from working professionals who understand real industry needs and help you grow through your learning journey." },
    { q: "How does Skillnex support my growth after learning?", a: "We provide continued mentorship, career guidance, and pathways to internships, freelance work, or placements." },
  ],
  Opportunities: [
    { q: "How does Skillnex help me get internships or jobs?", a: "Top performers get matched to our hiring partner network with real introductions and portfolio reviews, not just job board listings." },
    { q: "Can I work on real client projects?", a: "Yes. Many programs include live client briefs so you gain real-world experience while learning." },
  ],
  Colleges: [
    { q: "How can colleges partner with Skillnex?", a: "We deliver campus-ready training programs, workshops, and webinars to make your students industry-ready. Contact us to discuss a partnership." },
    { q: "How does Skillnex help make students industry-ready?", a: "We focus on practical skills, real projects, and execution over theory — preparing students for actual jobs, not just exams." },
  ],
  Corporates: [
    { q: "How does Skillnex help companies build in-house teams?", a: "We assess skill gaps, design customized training plans, and deliver hands-on programs that train your team through real business challenges." },
    { q: "Do you provide corporate training and team management?", a: "Yes. We offer skill gap assessments, role-specific training, hands-on execution, and performance tracking to ensure real ROI." },
  ],
  General: [
    { q: "Is Skillnex suitable for beginners?", a: "Absolutely. Most programs are designed to take complete beginners to job-ready levels through structured, practical learning." },
    { q: "How do I get started with Skillnex?", a: "Create an account, book a free skill counselling session, or browse programs and enroll directly. You can start learning immediately." },
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