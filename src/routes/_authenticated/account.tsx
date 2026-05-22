import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
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
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-5xl font-serif italic mb-12">Account.</h1>
        <section className="mb-12">
          <h2 className="font-medium mb-4">Profile</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Name</dt><dd>{me.profile?.full_name ?? "—"}</dd>
            <dt className="text-muted-foreground">Email</dt><dd>{me.profile?.email ?? "—"}</dd>
            <dt className="text-muted-foreground">Role</dt><dd>{me.roles.join(", ") || "student"}</dd>
          </dl>
        </section>
        <section>
          <h2 className="font-medium mb-4">Subscription</h2>
          {data.subscription ? (
            <div className="p-6 rounded-xl ring-1 ring-border">
              <p className="text-sm">Status: <span className="font-medium">{data.subscription.status}</span></p>
              {data.subscription.current_period_end && (
                <p className="text-sm text-muted-foreground mt-1">
                  Renews/ends: {new Date(data.subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl ring-1 ring-border">
              <p className="text-sm text-muted-foreground mb-4">No active subscription.</p>
              <Link to="/pricing" className="text-sm underline">View pricing</Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}