import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Skillnex" },
      { name: "description", content: "Buy individual Skillnex courses or subscribe to All-Access for the entire library." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">The Investment</span>
          <h1 className="text-5xl md:text-6xl font-serif italic mt-3 mb-4">Flexible paths to mastery.</h1>
          <p className="text-muted-foreground">Choose individual programs or unlock the full library.</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-2xl ring-1 ring-border bg-card">
            <h3 className="font-serif italic text-3xl mb-2">Single Course</h3>
            <p className="text-muted-foreground text-sm mb-8">Focused learning track.</p>
            <div className="text-5xl font-serif italic mb-2">from $149</div>
            <p className="text-muted-foreground text-sm mb-10">One-time payment per program. Lifetime access.</p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-10">
              <li>· Lifetime access to lessons</li>
              <li>· Course completion certificate</li>
              <li>· Community access</li>
            </ul>
            <Link to="/programs" className="block text-center w-full py-3 rounded-full ring-1 ring-foreground font-medium hover:bg-secondary">
              Browse Programs
            </Link>
          </div>

          <div className="p-10 rounded-2xl ring-2 ring-foreground bg-foreground text-background relative">
            <span className="absolute -top-3 right-6 bg-background text-foreground text-[10px] font-semibold px-3 py-1 rounded-full ring-1 ring-foreground uppercase tracking-widest">Most popular</span>
            <h3 className="font-serif italic text-3xl mb-2">All-Access</h3>
            <p className="text-background/70 text-sm mb-8">The craftsman's subscription.</p>
            <div className="text-5xl font-serif italic mb-2">$89<span className="text-base font-sans text-background/60 ml-2 italic">/ month</span></div>
            <p className="text-background/70 text-sm mb-10">Or $890/year — two months free.</p>
            <ul className="space-y-3 text-sm text-background/80 mb-10">
              <li>· Access to every program — current and future</li>
              <li>· Monthly live workshop sessions</li>
              <li>· Private community</li>
              <li>· Cancel anytime</li>
            </ul>
            <Link to="/signup" className="block text-center w-full py-3 rounded-full bg-background text-foreground font-medium">
              Start subscription
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}