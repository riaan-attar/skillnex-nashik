import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

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
    <div className="min-h-screen grid md:grid-cols-2">
      <aside className="hidden md:flex relative ink-section p-12 flex-col justify-between">
        <Link to="/" className="font-serif text-4xl">Skillnex</Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-background/50 mb-6">New chapter</p>
          <p className="font-serif text-5xl italic leading-tight max-w-[18ch]">
            "The best time to start was a season ago. The second best is now."
          </p>
        </div>
        <p className="text-xs text-background/40">Free to begin · No card required</p>
      </aside>
      <main className="p-8 md:p-16 flex flex-col justify-center max-w-[480px] mx-auto w-full">
        <Link to="/" className="md:hidden font-serif text-3xl mb-12">Skillnex</Link>
        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">Begin enrollment</p>
        <h1 className="font-serif text-6xl mb-10">Start your <span className="italic">journey.</span></h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <FloatInput type="text" label="Full name" value={fullName} onChange={setFullName} />
          <FloatInput type="email" label="Email" value={email} onChange={setEmail} />
          <FloatInput type="password" label="Password (min 6)" value={password} onChange={setPassword} minLength={6} />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-sm bg-foreground text-background disabled:opacity-60 mt-2 group flex items-center justify-between px-6"
          >
            <span>{loading ? "Creating…" : "Create account"}</span>
            <span className="font-serif italic text-xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </form>
        <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-foreground/40">
          <span className="h-px flex-1 bg-foreground/15" /> or <span className="h-px flex-1 bg-foreground/15" />
        </div>
        <button onClick={onGoogle} className="w-full py-4 rounded-sm border border-foreground/20 hover:border-foreground/60 transition-colors">
          Continue with Google
        </button>
        <p className="text-sm text-foreground/60 mt-8">
          Already have an account? <Link to="/login" className="text-foreground italic underline-offset-4 hover:underline">Log in</Link>
        </p>
      </main>
    </div>
  );
}

function FloatInput({ type, label, value, onChange, minLength }: { type: string; label: string; value: string; onChange: (v: string) => void; minLength?: number }) {
  return (
    <label className="relative block">
      <input
        type={type}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full bg-transparent border-b border-foreground/20 py-3 px-0 focus:outline-none focus:border-foreground transition-colors"
      />
      <span className="absolute left-0 top-3 text-foreground/50 transition-all peer-focus:-translate-y-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-xs">
        {label}
      </span>
    </label>
  );
}