import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { getCourseBySlug, enrollFree } from "@/lib/courses.functions";
import { useAuth } from "@/hooks/use-auth";

const courseQ = (slug: string) =>
  queryOptions({ queryKey: ["course", slug], queryFn: () => getCourseBySlug({ data: { slug } }) });

export const Route = createFileRoute("/programs/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(courseQ(params.slug));
    if (!data.course) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.course
      ? [
          { title: `${loaderData.course.title} — Skillnex` },
          { name: "description", content: loaderData.course.subtitle ?? loaderData.course.description?.slice(0, 150) ?? "Skillnex program" },
          { property: "og:title", content: `${loaderData.course.title} — Skillnex` },
          { property: "og:description", content: loaderData.course.subtitle ?? "" },
          ...(loaderData.course.cover_image_url
            ? [{ property: "og:image", content: loaderData.course.cover_image_url }]
            : []),
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p>Course not found.</p>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="text-sm underline">Try again</button>
    </div>
  ),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(courseQ(slug));
  const { user } = useAuth();
  const navigate = useNavigate();
  const enrollFreeFn = useServerFn(enrollFree);
  const [enrolling, setEnrolling] = useState(false);
  const course = data.course!;

  const onEnroll = async () => {
    if (!user) return navigate({ to: "/login" });
    if (course.price_cents === 0) {
      setEnrolling(true);
      try {
        await enrollFreeFn({ data: { courseId: course.id } });
        toast.success("Enrolled. Let's begin.");
        navigate({ to: "/learn/$slug", params: { slug: course.slug } });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not enroll");
      } finally {
        setEnrolling(false);
      }
    } else {
      toast.info("Stripe checkout will be enabled shortly — talk to your client.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <section className="max-w-[1400px] mx-auto px-6">
          <Link to="/programs" className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground inline-flex items-center gap-2">
            <span className="font-serif italic">←</span> All programs
          </Link>

          <ScrollReveal className="mt-8 grid lg:grid-cols-12 gap-12 items-end mb-16">
            <div className="lg:col-span-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">
                {course.category ?? "Program"} {course.level ? `· ${course.level}` : ""}
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] text-balance">{course.title}</h1>
              {course.subtitle && <p className="font-serif italic text-2xl text-foreground/60 mt-6 max-w-[36ch]">{course.subtitle}</p>}
            </div>
            <div className="lg:col-span-4">
              <p className="font-serif text-7xl">
                {course.price_cents === 0 ? <span className="italic">Free</span> : `$${(course.price_cents / 100).toFixed(0)}`}
              </p>
              <p className="text-foreground/60 text-sm">One-time · Lifetime access</p>
            </div>
          </ScrollReveal>
        </section>

        {course.cover_image_url && (
          <ScrollReveal className="mb-20">
            <div className="aspect-[21/9] overflow-hidden bg-card">
              <img src={course.cover_image_url} alt={course.title} className="w-full h-full object-cover" />
            </div>
          </ScrollReveal>
        )}

        <section className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {course.description && (
              <ScrollReveal>
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-6">Overview</p>
                <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground/85 whitespace-pre-line text-pretty">
                  {course.description}
                </p>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-8">The Syllabus</p>
              <ol>
                {data.lessons.map((l, i) => (
                  <li key={l.id} className="group border-t border-foreground/10 last:border-b py-6 grid grid-cols-[60px_1fr_auto] gap-6 items-start hover:bg-card/50 transition-colors px-2 -mx-2">
                    <span className="font-serif italic text-3xl text-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="font-serif text-2xl group-hover:italic transition-all">{l.title}</h4>
                      {l.description && <p className="text-sm text-foreground/60 mt-2 max-w-[60ch]">{l.description}</p>}
                    </div>
                    {l.is_free_preview && (
                      <span className="text-[10px] uppercase tracking-[0.25em] bg-foreground text-background px-2 py-1 self-start">Free preview</span>
                    )}
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>

          <aside className="lg:sticky lg:top-32 self-start">
            <div className="ink-section p-8 rounded-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-background/50 mb-4">Enroll</p>
              <p className="font-serif text-6xl mb-2">
                {course.price_cents === 0 ? <span className="italic">Free</span> : `$${(course.price_cents / 100).toFixed(0)}`}
              </p>
              <p className="text-background/60 text-sm mb-8 border-b border-background/15 pb-6">
                Lifetime access · Certificate · Community
              </p>
              <MagneticButton asChild>
                <button
                  onClick={onEnroll}
                  disabled={enrolling}
                  className="w-full py-4 rounded-sm bg-background text-foreground disabled:opacity-60 flex items-center justify-between px-6 group"
                >
                  <span>{enrolling ? "Enrolling…" : user ? (course.price_cents === 0 ? "Enroll now" : "Buy course") : "Sign in to enroll"}</span>
                  <span className="font-serif italic text-xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </MagneticButton>
              <Link
                to="/pricing"
                className="block text-center w-full mt-3 py-4 rounded-sm border border-background/20 hover:border-background/60 text-sm transition-colors"
              >
                Or get All-Access
              </Link>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}