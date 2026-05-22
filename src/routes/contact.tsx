import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Skillnex" },
      { name: "description", content: "Reach the Skillnex team — programs, partnerships, and college tie-ups." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">Get in touch</span>
        <h1 className="text-5xl font-serif italic mt-3 mb-6">Contact Skillnex</h1>
        <p className="text-muted-foreground mb-10">For program enquiries, firm training, and college partnerships.</p>
        <div className="space-y-4 text-sm">
          <p><span className="text-muted-foreground">Email · </span><a href="mailto:skillnex@gmail.com" className="underline">skillnex@gmail.com</a></p>
          <p><span className="text-muted-foreground">Phone · </span><a href="tel:+919799856328" className="underline">+91 9799856328</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}