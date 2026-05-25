import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Skillnex" },
      { name: "description", content: "Buy individual Skillnex courses or subscribe to All-Access for the entire library." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-40 pb-0">
        <section className="max-w-[1400px] mx-auto px-6 mb-24">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">The Investment</span>
            </div>
            <h1 className="font-serif text-6xl md:text-[8rem] leading-[0.9] max-w-[14ch]">
              Two ways <span className="italic text-foreground/60">in.</span>
            </h1>
          </ScrollReveal>
        </section>

        <section className="ink-section py-32 px-6">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
            <ScrollReveal>
              <div className="p-10 md:p-14 border border-background/20 rounded-sm min-h-[560px] flex flex-col justify-between hover:bg-background/5 transition-colors">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-background/50">Per program</p>
                  <h2 className="font-serif text-5xl mt-4 italic">Single course</h2>
                  <p className="font-serif text-9xl mt-10">from <span className="italic text-background/70">$149</span></p>
                  <p className="text-background/60 mt-4">One-time. Yours forever.</p>
                </div>
                <div>
                  <ul className="space-y-3 text-background/80 mb-10 border-t border-background/15 pt-8">
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Lifetime access to lessons</li>
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Completion certificate</li>
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Community access</li>
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Project reviews</li>
                  </ul>
                  <MagneticButton asChild>
                    <Link to="/programs" className="group flex items-center justify-between bg-background text-foreground px-6 py-4 rounded-sm">
                      Browse programs <span className="font-serif italic text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="p-10 md:p-14 bg-background text-foreground rounded-sm min-h-[560px] flex flex-col justify-between relative">
                <span className="absolute -top-3 right-8 bg-foreground text-background text-[10px] px-3 py-1 uppercase tracking-[0.25em]">Editor's pick</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">All-Access</p>
                  <h2 className="font-serif text-5xl mt-4 italic">Full library</h2>
                  <p className="font-serif text-9xl mt-10">$89<span className="text-3xl italic text-foreground/50">/mo</span></p>
                  <p className="text-foreground/60 mt-4">Or $890/year — two months free.</p>
                </div>
                <div>
                  <ul className="space-y-3 text-foreground/80 mb-10 border-t border-foreground/15 pt-8">
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Every current and future program</li>
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Monthly live workshops</li>
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Private community</li>
                    <li className="flex items-baseline gap-3"><span className="font-serif italic">+</span>Cancel anytime</li>
                  </ul>
                  <MagneticButton asChild>
                    <Link to="/signup" className="group flex items-center justify-between bg-foreground text-background px-6 py-4 rounded-sm">
                      Start subscription <span className="font-serif italic text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}