import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Header } from "@/components/site/Header";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Skillnex" }, { name: "description", content: "Start your Skillnex journey." }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your inbox to confirm your account.");
    navigate({ to: "/login" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error(result.error.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-6 pt-40 pb-24">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">Begin Enrollment</span>
        <h1 className="text-5xl font-serif italic mt-3 mb-8">Start your journey.</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-background focus:outline-none focus:ring-foreground"
          />
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-3 rounded-lg ring-1 ring-border bg-background focus:outline-none focus:ring-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-foreground text-background font-medium disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
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
          Already have an account? <Link to="/login" className="underline text-foreground">Log in</Link>
        </p>
      </div>
    </div>
  );
}