import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="ink-section pt-32 pb-12 mt-0">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-20">
          <div className="space-y-6">
            <Link to="/" className="font-serif text-7xl md:text-8xl leading-none block">
              Skillnex<span className="italic text-background/50">.</span>
            </Link>
            <p className="text-background/60 max-w-[36ch] text-lg leading-relaxed">
              A studio for the modern craftsman. Learn the disciplines that move the digital world.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-background/40">Library</p>
            <ul className="space-y-3 text-background/80">
              <li><Link to="/programs" className="hover:text-background hover:italic transition-all">Programs</Link></li>
              <li><Link to="/pricing" className="hover:text-background hover:italic transition-all">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-background hover:italic transition-all">About</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-background/40">Studio</p>
            <ul className="space-y-3 text-background/80">
              <li><Link to="/faq" className="hover:text-background hover:italic transition-all">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-background hover:italic transition-all">Contact</Link></li>
              <li><Link to="/login" className="hover:text-background hover:italic transition-all">Log in</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-background/40">Reach</p>
            <ul className="space-y-3 text-background/80 text-sm">
              <li><a href="mailto:skillnex@gmail.com" className="hover:text-background">skillnex@gmail.com</a></li>
              <li><a href="tel:+919799856328" className="hover:text-background">+91 9799856328</a></li>
              <li>Nashik · IN</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/15 pt-8 flex flex-wrap justify-between gap-4 text-xs text-background/50">
          <p>© 2026 Skillnex Academy. All chapters reserved.</p>
          <p className="italic">Begin chapter one.</p>
        </div>
      </div>
    </footer>
  );
}