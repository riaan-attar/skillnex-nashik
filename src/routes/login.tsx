import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Header } from "@/components/site/Header";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Skillnex" }, { name: "description", content: "Sign in to Skillnex to continue your learning." }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back.");
    navigate({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error(result.error.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-6 pt-40 pb-24">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">Welcome back</span>
        <h1 className="text-5xl font-serif italic mt-3 mb-8">Log in.</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-background focus:outline-none focus:ring-foreground"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-background focus:outline-none focus:ring-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-foreground text-background font-medium disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="relative my-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          <span className="bg-background px-3 relative z-10">or</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>
        <button onClick={onGoogle} className="w-full py-3 rounded-full ring-1 ring-border font-medium hover:bg-secondary">
          Continue with Google
        </button>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          New to Skillnex? <Link to="/signup" className="underline text-foreground">Create an account</Link>
        </p>
      </div>
    </div>
  );
}