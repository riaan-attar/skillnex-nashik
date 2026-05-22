import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">About Skillnex</span>
        <h1 className="text-5xl md:text-6xl font-serif italic mt-3 mb-6">Building practical skills for real-world success.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-16">
          Skillnex is a digital education platform focused on helping students and beginners learn practical, job-ready skills through real projects and mentorship.
        </p>

        <section className="mb-20">
          <h2 className="font-serif italic text-3xl mb-4">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl">
            To bridge the gap between learning and real-world work by providing practical training and hands-on experience.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="font-serif italic text-3xl mb-8">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.t} className="p-6 rounded-xl ring-1 ring-border">
                <h3 className="font-medium mb-2">{v.t}</h3>
                <p className="text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif italic text-3xl mb-8">Our Approach</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Learn by doing", "Build real projects", "Develop portfolio", "Seize opportunities"].map((step, i) => (
              <div key={step} className="space-y-2">
                <span className="size-8 rounded-full bg-foreground text-background grid place-items-center text-xs font-medium">{i + 1}</span>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}