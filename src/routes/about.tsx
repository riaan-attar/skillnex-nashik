import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BentoTile } from "@/components/site/BentoTile";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Skillnex" },
      { name: "description", content: "Skillnex bridges the gap between learning and real-world work through practical training and mentorship." },
      { property: "og:title", content: "About Skillnex" },
      { property: "og:description", content: "Building practical skills for real-world success." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { t: "Practical skill training", d: "Hands-on courses designed around industry demands." },
    { t: "Career guidance", d: "Personalized mentorship for your career path." },
    { t: "Industry exposure", d: "Connect with professionals and real workflows." },
    { t: "Real project experience", d: "Work on live projects that build your portfolio." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-40">
        <section className="max-w-[1400px] mx-auto px-6 pb-32">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">The Studio</span>
            </div>
            <h1 className="font-serif text-6xl md:text-[9rem] leading-[0.9] max-w-[14ch]">
              We teach what <span className="italic text-foreground/60">we ship.</span>
            </h1>
          </ScrollReveal>
        </section>

        <section className="bg-card border-y border-foreground/10">
          <div className="max-w-[1400px] mx-auto px-6 py-32 grid md:grid-cols-12 gap-12">
            <ScrollReveal className="md:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-6">Our Mission</p>
              <h2 className="font-serif text-4xl md:text-5xl italic leading-tight">
                To close the distance between learning and earning.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="md:col-span-7 md:pt-2">
              <p className="text-xl text-foreground/80 leading-relaxed text-pretty">
                <span className="font-serif text-6xl float-left mr-3 mt-1 leading-none">S</span>killnex is a digital education studio focused on real practice. We believe most courses fail not because of content, but because of context. So we built one that works the way modern studios work — short cycles, real briefs, working pros reviewing real output.
              </p>
              <p className="text-foreground/70 mt-6 leading-relaxed">
                Every program is paced like a magazine — chapters, kickers, and a finished portfolio piece at the end. Whether you're a college student exploring a stream or a working professional adding a discipline, the structure stays the same: ship something real.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 py-32">
          <ScrollReveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-6">What we do</p>
            <h2 className="font-serif text-5xl md:text-6xl mb-16 max-w-[16ch]">Four pillars. <span className="italic text-foreground/60">One outcome.</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-12 gap-4">
            {values.map((v, i) => (
              <ScrollReveal key={v.t} delay={i * 0.08} className="col-span-12 md:col-span-6 lg:col-span-3">
                <BentoTile className="p-8 h-full min-h-[260px] flex flex-col justify-between">
                  <p className="font-serif text-5xl text-foreground/15">0{i + 1}</p>
                  <div>
                    <h3 className="font-serif italic text-2xl mb-3">{v.t}</h3>
                    <p className="text-sm text-foreground/70">{v.d}</p>
                  </div>
                </BentoTile>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="ink-section py-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <ScrollReveal>
              <p className="text-[10px] uppercase tracking-[0.3em] text-background/60 mb-6">Our Approach</p>
              <h2 className="font-serif text-5xl md:text-6xl mb-16 max-w-[20ch]">From <span className="italic text-background/60">curious</span> to <span className="italic text-background/60">cashflow</span> in four moves.</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-4 gap-8">
              {["Learn by doing", "Build real projects", "Develop portfolio", "Seize opportunities"].map((step, i) => (
                <ScrollReveal key={step} delay={i * 0.08}>
                  <div className="border-t border-background/30 pt-6">
                    <p className="font-serif text-5xl text-background/40 mb-4">0{i + 1}</p>
                    <p className="font-serif italic text-2xl">{step}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}