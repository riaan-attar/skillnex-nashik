import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const navLinks = [
    { to: "/#programs", label: "Programs" },
    { to: "/#about", label: "About" },
    { to: "/#work", label: "Work" },
    { to: "/#testimonials", label: "Testimonials" },
    { to: "/#faq", label: "FAQ" },
  ] as const;

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-background/85 backdrop-blur-md border-b border-foreground/10" : "bg-transparent"
        }`}
        style={{ mixBlendMode: "normal" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-3xl tracking-tight text-foreground">Skillnex</span>
            <span className="font-serif italic text-xs hidden sm:inline neon-text">— est. 2024</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="relative px-3 py-2 text-foreground/70 hover:text-foreground transition-colors group"
              >
                <span>{l.label}</span>
                <span className="absolute left-3 right-3 bottom-1 h-px bg-foreground origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {loading ? null : user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline text-sm text-foreground/70 hover:text-foreground px-3 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onSignOut}
                  className="text-sm bg-foreground text-background px-4 py-2 rounded-sm hover:bg-foreground/90 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline text-sm text-foreground/70 hover:text-foreground px-3 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-foreground text-background px-4 py-2 rounded-sm hover:bg-foreground/90 transition-colors"
                >
                  Begin
                </Link>
              </>
            )}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 -mr-2 text-foreground"
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground text-background md:hidden"
          >
            <div className="flex justify-between items-center h-16 px-6 border-b border-background/10">
              <span className="font-serif text-3xl">Skillnex</span>
              <button onClick={() => setOpen(false)} className="p-2 -mr-2">✕</button>
            </div>
            <nav className="px-6 py-10 space-y-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                >
                  <a
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="block font-serif text-5xl py-2 hover:italic transition-all"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}