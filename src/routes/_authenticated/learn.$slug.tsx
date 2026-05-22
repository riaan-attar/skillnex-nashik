import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { getCourseForLearning, markLessonProgress } from "@/lib/courses.functions";

const learnQ = (slug: string) =>
  queryOptions({ queryKey: ["learn", slug], queryFn: () => getCourseForLearning({ data: { slug } }) });

export const Route = createFileRoute("/_authenticated/learn/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Learning — Skillnex` }] }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(learnQ(params.slug));
    if (!data.course) throw notFound();
    return data;
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center"><p>Course not found.</p></div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="underline text-sm">Try again</button>
    </div>
  ),
  component: LearnPage,
});

function LearnPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(learnQ(slug));
  const qc = useQueryClient();
  const markFn = useServerFn(markLessonProgress);
  const firstPlayable = data.lessons.find((l) => l.vimeo_video_id) ?? data.lessons[0];
  const [activeId, setActiveId] = useState<string | null>(firstPlayable?.id ?? null);
  const active = data.lessons.find((l) => l.id === activeId) ?? firstPlayable;
  const completedSet = new Set(data.progress.filter((p) => p.completed_at).map((p) => p.lesson_id));

  const onComplete = async () => {
    if (!active) return;
    await markFn({ data: { lessonId: active.id, completed: true } });
    qc.invalidateQueries({ queryKey: ["learn", slug] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-0 min-h-[calc(100vh-5rem)]">
          <div className="bg-neutral-950 text-neutral-100">
            <div className="p-6 lg:p-10">
              <Link to="/dashboard" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-300">
                ← Dashboard
              </Link>
              <h1 className="text-3xl font-serif italic mt-4 mb-6">{data.course!.title}</h1>
              {active?.vimeo_video_id ? (
                <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-white/10">
                  <iframe
                    key={active.id}
                    src={`https://player.vimeo.com/video/${active.vimeo_video_id}?dnt=1&title=0&byline=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={active.title}
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-neutral-900 grid place-items-center text-neutral-500 text-sm">
                  {data.hasAccess
                    ? "Video coming soon — your instructor will publish this lesson shortly."
                    : "Enroll or subscribe to unlock this lesson."}
                </div>
              )}
              {active && (
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h2 className="font-serif italic text-2xl mb-2">{active.title}</h2>
                    {active.description && <p className="text-sm text-neutral-400 max-w-2xl">{active.description}</p>}
                  </div>
                  {data.hasAccess && active.vimeo_video_id && (
                    <button onClick={onComplete} className="shrink-0 px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 text-sm font-medium">
                      {completedSet.has(active.id) ? "Completed ✓" : "Mark complete"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="bg-background border-l border-border">
            <div className="p-6 sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Syllabus</p>
              <ol className="space-y-1">
                {data.lessons.map((l, i) => {
                  const playable = !!l.vimeo_video_id;
                  const isActive = active?.id === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => playable && setActiveId(l.id)}
                        disabled={!playable}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                          isActive ? "bg-foreground text-background" : "hover:bg-secondary"
                        } ${!playable ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className={`font-serif italic text-lg shrink-0 w-6 ${isActive ? "text-background/60" : "text-muted-foreground"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {l.title}
                          {l.is_free_preview && !data.hasAccess && (
                            <span className="block text-[10px] uppercase tracking-widest mt-1 opacity-60">Free preview</span>
                          )}
                          {completedSet.has(l.id) && <span className="ml-2">✓</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}