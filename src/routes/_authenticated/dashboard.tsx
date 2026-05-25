import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BentoTile } from "@/components/site/BentoTile";
import { listMyEnrollments } from "@/lib/courses.functions";
import { getMyContext } from "@/lib/auth.functions";

const enrollQ = queryOptions({ queryKey: ["my-enrollments"], queryFn: () => listMyEnrollments() });
const meQ = queryOptions({ queryKey: ["me-ctx"], queryFn: () => getMyContext() });

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Skillnex" }] }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(enrollQ),
      context.queryClient.ensureQueryData(meQ),
    ]);
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useSuspenseQuery(enrollQ);
  const { data: me } = useSuspenseQuery(meQ);
  const subActive =
    !!data.subscription &&
    ["active", "trialing"].includes(data.subscription.status) &&
    (!data.subscription.current_period_end || new Date(data.subscription.current_period_end) > new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
        <ScrollReveal className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">Welcome back,</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95]">
              {(me.profile?.full_name ?? "Student").split(" ")[0]}<span className="italic text-foreground/60">.</span>
            </h1>
            <div className="flex gap-2">
              {me.isAdmin && (
                <Link to="/admin" className="px-4 py-2 border border-foreground/20 hover:border-foreground/60 text-sm rounded-sm transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/account" className="px-4 py-2 border border-foreground/20 hover:border-foreground/60 text-sm rounded-sm transition-colors">
                Account
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-12 gap-4 mb-16">
          {subActive && (
            <ScrollReveal className="col-span-12 md:col-span-8">
              <BentoTile tone="ink" className="p-10 h-full min-h-[200px] flex flex-col justify-between">
                <p className="text-[10px] uppercase tracking-[0.3em] text-background/50">All-Access · Active</p>
                <div>
                  <p className="font-serif text-4xl md:text-5xl italic">Every chapter, unlocked.</p>
                  <p className="text-background/60 mt-2 text-sm">Browse the full library and start any program.</p>
                </div>
              </BentoTile>
            </ScrollReveal>
          )}
          <ScrollReveal delay={0.1} className={subActive ? "col-span-12 md:col-span-4" : "col-span-12 md:col-span-5"}>
            <BentoTile className="p-10 h-full min-h-[200px] flex flex-col justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Your library</p>
              <p className="font-serif text-7xl">{data.enrollments.length}</p>
              <p className="text-foreground/60 text-sm">programs enrolled</p>
            </BentoTile>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-4xl md:text-5xl">Your <span className="italic">library</span></h2>
            <Link to="/programs" className="text-sm border-b border-foreground/40 hover:border-foreground pb-0.5">Browse more →</Link>
          </div>
        </ScrollReveal>

        {data.enrollments.length === 0 ? (
          <div className="p-16 border border-dashed border-foreground/20 text-center rounded-sm">
            <p className="font-serif italic text-2xl mb-6">Your library is empty.</p>
            <Link to="/programs" className="inline-flex bg-foreground text-background px-6 py-3 rounded-sm text-sm">
              Browse programs →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.enrollments.map((e, i) => (
              <ScrollReveal key={e.course_id} delay={i * 0.05}>
                <Link to="/learn/$slug" params={{ slug: e.courses!.slug }} className="block group">
                  <BentoTile className="p-6 h-full min-h-[220px] flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">{e.courses!.category ?? "Program"}</p>
                      <h3 className="font-serif text-2xl mt-3 group-hover:italic transition-all">{e.courses!.title}</h3>
                      <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{e.courses!.subtitle}</p>
                    </div>
                    <p className="mt-6 text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Continue <span className="font-serif italic">→</span></p>
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