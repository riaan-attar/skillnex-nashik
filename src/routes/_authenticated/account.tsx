import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getMyContext } from "@/lib/auth.functions";
import { listMyEnrollments } from "@/lib/courses.functions";

const meQ = queryOptions({ queryKey: ["me-ctx"], queryFn: () => getMyContext() });
const enrollQ = queryOptions({ queryKey: ["my-enrollments"], queryFn: () => listMyEnrollments() });

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — Skillnex" }] }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(meQ), context.queryClient.ensureQueryData(enrollQ)]),
  component: AccountPage,
});

function AccountPage() {
  const { data: me } = useSuspenseQuery(meQ);
  const { data } = useSuspenseQuery(enrollQ);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[900px] mx-auto px-6 pt-32 pb-24">
        <ScrollReveal>
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">Your details</p>
          <h1 className="font-serif text-6xl md:text-8xl mb-16">Account<span className="italic">.</span></h1>
        </ScrollReveal>

        <section className="mb-16">
          <h2 className="font-serif italic text-3xl mb-6">Profile</h2>
          <dl className="border-t border-foreground/10">
            {([
              ["Name", me.profile?.full_name ?? "—"],
              ["Email", me.profile?.email ?? "—"],
              ["Role", me.roles.join(", ") || "student"],
            ] as const).map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 py-4 border-b border-foreground/10">
                <dt className="text-foreground/60">{k}</dt>
                <dd className="font-serif text-lg">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="font-serif italic text-3xl mb-6">Subscription</h2>
          {data.subscription ? (
            <div className="p-8 border border-foreground/10 rounded-sm">
              <p className="text-sm text-foreground/60">Status</p>
              <p className="font-serif text-3xl italic mt-1">{data.subscription.status}</p>
              {data.subscription.current_period_end && (
                <p className="text-sm text-foreground/60 mt-4">
                  Renews / ends {new Date(data.subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-foreground/20 rounded-sm">
              <p className="font-serif italic text-xl mb-4">No active subscription.</p>
              <Link to="/pricing" className="text-sm border-b border-foreground/40 hover:border-foreground pb-0.5">View pricing →</Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}