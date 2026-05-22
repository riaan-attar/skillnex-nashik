import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
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
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">The Disciplines</span>
        <h1 className="text-5xl md:text-6xl font-serif italic mt-3 mb-12">Programs</h1>

        {courses.length === 0 ? (
          <p className="text-muted-foreground">No programs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((c) => (
              <Link key={c.id} to="/programs/$slug" params={{ slug: c.slug }} className="group">
                <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/5 bg-secondary">
                  {c.cover_image_url ? (
                    <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                  )}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-background text-[10px] font-semibold uppercase tracking-wider rounded ring-1 ring-black/5">
                      {c.price_cents === 0 ? "Free" : `$${(c.price_cents / 100).toFixed(0)}`}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-1 group-hover:underline underline-offset-4 decoration-foreground/20">{c.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.subtitle ?? c.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}