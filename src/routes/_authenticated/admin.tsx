import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { getMyContext } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const me = await getMyContext();
    if (!me.isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/admin" className="font-serif italic text-xl">Skillnex Admin</Link>
          <nav className="flex gap-6 text-sm">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>Courses</Link>
            <Link to="/admin/students" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>Students</Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Exit</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}