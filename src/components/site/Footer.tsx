import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-4">
          <span className="font-serif text-3xl italic">Skillnex</span>
          <p className="text-sm text-muted-foreground max-w-[30ch]">
            The editorial standard for modern digital education.
          </p>
          <p className="text-xs text-muted-foreground">skillnex@gmail.com · +91 9799856328</p>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest font-semibold">Library</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/programs" className="hover:text-foreground">All Programs</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest font-semibold">Studio</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/login" className="hover:text-foreground">Log in</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2026 Skillnex Academy. Designed for the ambitious.</p>
      </div>
    </footer>
  );
}