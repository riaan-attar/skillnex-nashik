import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
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
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">Welcome back</span>
            <h1 className="text-5xl font-serif italic mt-3">{me.profile?.full_name ?? "Student"}.</h1>
          </div>
          <div className="flex gap-3">
            {me.isAdmin && (
              <Link to="/admin" className="px-4 py-2 rounded-full ring-1 ring-border text-sm font-medium hover:bg-secondary">
                Admin
              </Link>
            )}
            <Link to="/account" className="px-4 py-2 rounded-full ring-1 ring-border text-sm font-medium hover:bg-secondary">
              Account
            </Link>
          </div>
        </div>

        {subActive && (
          <div className="mb-12 p-6 rounded-xl bg-foreground text-background">
            <p className="text-xs uppercase tracking-widest mb-1 text-background/60">All-Access Active</p>
            <p className="font-serif italic text-2xl">You have access to every program.</p>
          </div>
        )}

        <h2 className="font-serif italic text-3xl mb-6">Your library</h2>
        {data.enrollments.length === 0 ? (
          <div className="p-10 rounded-xl ring-1 ring-border text-center">
            <p className="text-muted-foreground mb-4">You haven't enrolled in any programs yet.</p>
            <Link to="/programs" className="inline-flex bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium">
              Browse programs
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrollments.map((e) => (
              <Link
                key={e.course_id}
                to="/learn/$slug"
                params={{ slug: e.courses!.slug }}
                className="group p-6 rounded-xl ring-1 ring-border hover:ring-foreground transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {e.courses!.category ?? "Program"}
                </span>
                <h3 className="font-medium text-lg mt-2">{e.courses!.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.courses!.subtitle}</p>
                <p className="mt-4 text-xs underline text-foreground/70">Continue →</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}