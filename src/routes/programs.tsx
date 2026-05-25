import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BentoTile } from "@/components/site/BentoTile";
import { listPublishedCourses } from "@/lib/courses.functions";

const q = queryOptions({ queryKey: ["public-courses"], queryFn: () => listPublishedCourses() });

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Skillnex" },
      { name: "description", content: "Browse Skillnex programs across video, design, marketing, and creator skills." },
      { property: "og:title", content: "Programs — Skillnex" },
      { property: "og:description", content: "Browse all Skillnex digital programs." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: ProgramsPage,
});

function ProgramsPage() {
  const { data } = useSuspenseQuery(q);
  const courses = data.courses;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 pt-40 pb-24">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-foreground" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">The Catalog</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-20">
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95]">
              All <span className="italic text-foreground/60">programs.</span>
            </h1>
            <p className="font-serif italic text-foreground/60 text-lg">{courses.length} chapters available</p>
          </div>
        </ScrollReveal>

        {courses.length === 0 ? (
          <p className="text-foreground/60">No programs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.05}>
                <Link to="/programs/$slug" params={{ slug: c.slug }} className="block group">
                  <BentoTile className="overflow-hidden">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {c.cover_image_url ? (
                        <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[1200ms]" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-foreground/10 to-foreground/30" />
                      )}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-background bg-foreground/80 backdrop-blur px-2 py-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif italic text-2xl text-background bg-foreground/80 backdrop-blur px-3 py-1">
                          {c.price_cents === 0 ? "Free" : `$${(c.price_cents / 100).toFixed(0)}`}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">{c.category ?? "Program"}</p>
                      <h3 className="font-serif text-3xl leading-tight">{c.title}</h3>
                      <p className="text-sm text-foreground/70 mt-3 line-clamp-2">{c.subtitle ?? c.description}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm group-hover:gap-3 transition-all">
                        Read syllabus <span className="font-serif italic">→</span>
                      </span>
                    </div>
                  </BentoTile>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}