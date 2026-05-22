import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
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
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <Link to="/programs" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Back to programs
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">
                {course.category ?? "Program"} {course.level ? `· ${course.level}` : ""}
              </span>
              <h1 className="text-5xl md:text-6xl font-serif italic mt-3 leading-tight text-balance">{course.title}</h1>
              {course.subtitle && <p className="text-xl text-muted-foreground mt-4">{course.subtitle}</p>}
            </div>

            {course.cover_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-black/5">
                <img src={course.cover_image_url} alt={course.title} className="w-full h-full object-cover" />
              </div>
            )}

            {course.description && (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>
            )}

            <section>
              <h2 className="text-2xl font-serif italic mb-6">The Syllabus</h2>
              <ol className="space-y-3">
                {data.lessons.map((l, i) => (
                  <li key={l.id} className="flex items-start gap-4 p-4 rounded-lg ring-1 ring-border bg-card">
                    <span className="font-serif italic text-2xl text-muted-foreground/60 w-10 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{l.title}</h4>
                        {l.is_free_preview && (
                          <span className="text-[10px] uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded">
                            Free preview
                          </span>
                        )}
                      </div>
                      {l.description && <p className="text-sm text-muted-foreground mt-1">{l.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="p-6 rounded-xl ring-1 ring-border bg-card">
              <div className="text-3xl font-serif italic mb-2">
                {course.price_cents === 0 ? "Free" : `$${(course.price_cents / 100).toFixed(0)}`}
              </div>
              <p className="text-xs text-muted-foreground mb-6">Lifetime access · Certificate · Community</p>
              <button
                onClick={onEnroll}
                disabled={enrolling}
                className="w-full py-3 rounded-full bg-foreground text-background font-medium disabled:opacity-60"
              >
                {enrolling ? "Enrolling…" : user ? (course.price_cents === 0 ? "Enroll now" : "Buy course") : "Sign in to enroll"}
              </button>
              <Link
                to="/pricing"
                className="block text-center w-full mt-3 py-3 rounded-full ring-1 ring-border font-medium text-sm hover:bg-secondary"
              >
                Or get All-Access
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}