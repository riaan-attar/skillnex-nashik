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

  const completedCount = data.lessons.filter(l => completedSet.has(l.id)).length;
  const progressPct = data.lessons.length ? Math.round((completedCount / data.lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-foreground text-background">
      <Header />
      <main className="pt-20">
        <div className="grid lg:grid-cols-[1fr_400px] min-h-[calc(100vh-5rem)]">
          <div>
            <div className="p-6 lg:p-10">
              <div className="flex items-center justify-between mb-8 text-xs">
                <Link to="/dashboard" className="text-background/50 hover:text-background uppercase tracking-[0.3em]">
                  ← Dashboard
                </Link>
                <span className="text-background/40 uppercase tracking-[0.3em]">
                  {completedCount} / {data.lessons.length} · {progressPct}%
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-background/50 mb-2">Now reading</p>
              <h1 className="font-serif text-4xl md:text-5xl italic mb-8">{data.course!.title}</h1>
              {active?.vimeo_video_id ? (
                <div className="aspect-video overflow-hidden ring-1 ring-background/10 bg-black">
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
                <div className="aspect-video bg-background/5 border border-background/10 grid place-items-center text-background/40 text-sm">
                  {data.hasAccess
                    ? "Video coming soon — your instructor will publish this lesson shortly."
                    : "Enroll or subscribe to unlock this lesson."}
                </div>
              )}
              {active && (
                <div className="mt-8 flex items-start justify-between gap-6 border-t border-background/10 pt-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-background/40">Chapter {String((data.lessons.findIndex(l => l.id === active.id) + 1)).padStart(2, "0")}</p>
                    <h2 className="font-serif text-3xl italic mt-2">{active.title}</h2>
                    {active.description && <p className="text-sm text-background/60 mt-3 max-w-2xl leading-relaxed">{active.description}</p>}
                  </div>
                  {data.hasAccess && active.vimeo_video_id && (
                    <button onClick={onComplete} className="shrink-0 px-5 py-3 rounded-sm bg-background text-foreground text-sm hover:bg-background/90 transition-colors">
                      {completedSet.has(active.id) ? "Completed ✓" : "Mark complete →"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="bg-background text-foreground border-l border-foreground/10">
            <div className="p-6 lg:sticky lg:top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-6">The Syllabus</p>
              <ol>
                {data.lessons.map((l, i) => {
                  const playable = !!l.vimeo_video_id;
                  const isActive = active?.id === l.id;
                  const done = completedSet.has(l.id);
                  return (
                    <li key={l.id} className="border-b border-foreground/10 last:border-b-0">
                      <button
                        onClick={() => playable && setActiveId(l.id)}
                        disabled={!playable}
                        className={`w-full text-left py-4 px-2 flex items-start gap-4 transition-colors ${
                          isActive ? "bg-foreground text-background -mx-2 px-4" : "hover:bg-card"
                        } ${!playable ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <span className={`font-serif italic text-2xl shrink-0 w-8 ${isActive ? "text-background/60" : "text-foreground/30"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span className="font-serif text-lg leading-tight block">{l.title}</span>
                          <span className="text-[10px] uppercase tracking-[0.25em] mt-1 inline-flex gap-2 opacity-60">
                            {l.is_free_preview && !data.hasAccess && <span>Free preview</span>}
                            {done && <span>· Done</span>}
                          </span>
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