import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Skillnex" },
      { name: "description", content: "Reach the Skillnex team — programs, partnerships, and college tie-ups." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-40 pb-24">
        <section className="max-w-[1400px] mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">Reach the studio</span>
            </div>
            <h1 className="font-serif text-6xl md:text-[9rem] leading-[0.9] max-w-[12ch]">
              Say <span className="italic text-foreground/60">hello.</span>
            </h1>
          </ScrollReveal>

          <div className="mt-24 grid md:grid-cols-2 gap-16">
            <ScrollReveal>
              <p className="font-serif italic text-2xl md:text-3xl text-foreground/80 leading-snug max-w-[36ch]">
                For program enquiries, corporate workshops, and college partnerships — we read every note.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="space-y-8">
              <div className="border-b border-foreground/15 pb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">Email</p>
                <a href="mailto:skillnex@gmail.com" className="font-serif text-3xl hover:italic transition-all">skillnex@gmail.com</a>
              </div>
              <div className="border-b border-foreground/15 pb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">Phone</p>
                <a href="tel:+919799856328" className="font-serif text-3xl hover:italic transition-all">+91 97998 56328</a>
              </div>
              <div className="border-b border-foreground/15 pb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">Studio</p>
                <p className="font-serif text-3xl">Nashik · India</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}