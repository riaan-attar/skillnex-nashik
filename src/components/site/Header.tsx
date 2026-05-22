import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl italic tracking-tight text-foreground">
          Skillnex
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/programs" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              Programs
            </Link>
            <Link to="/about" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              The Method
            </Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              Pricing
            </Link>
            <Link to="/faq" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              FAQ
            </Link>
          </div>
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <button
                onClick={onSignOut}
                className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full ring-1 ring-foreground hover:scale-[1.02] transition-transform"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-full ring-1 ring-foreground hover:scale-[1.02] transition-transform"
              >
                Start Journey
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}