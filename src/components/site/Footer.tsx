import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-foreground/10 pt-32 pb-12 mt-0">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 pb-20">
          <div className="space-y-6">
            <Link to="/" className="font-serif text-7xl md:text-8xl leading-none block">
              Skillnex<span className="italic text-foreground/50">.</span>
            </Link>
            <p className="text-foreground/60 max-w-[36ch] text-lg leading-relaxed">
              Skill-focused career counselling, real execution, and mentorship — building clarity and skills that move your career forward.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Company</p>
            <ul className="space-y-3 text-foreground/80">
              <li><Link to="/about" className="hover:text-foreground hover:italic transition-all">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground hover:italic transition-all">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-foreground hover:italic transition-all">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Programs</p>
            <ul className="space-y-3 text-foreground/80 text-sm">
              <li><Link to="/programs" className="hover:text-foreground hover:italic transition-all">Social Media Management</Link></li>
              <li><Link to="/programs" className="hover:text-foreground hover:italic transition-all">Video Editing</Link></li>
              <li><Link to="/programs" className="hover:text-foreground hover:italic transition-all">Graphic Design & UI/UX</Link></li>
              <li><Link to="/programs" className="hover:text-foreground hover:italic transition-all">Performance Marketing</Link></li>
              <li><Link to="/programs" className="hover:text-foreground hover:italic transition-all">Full Stack Development</Link></li>
              <li><Link to="/programs" className="hover:text-foreground hover:italic transition-all">Soft Skill Learning</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Students</p>
            <ul className="space-y-3 text-foreground/80">
              <li><Link to="/login" className="hover:text-foreground hover:italic transition-all">Login</Link></li>
              <li><Link to="/signup" className="hover:text-foreground hover:italic transition-all">Sign Up</Link></li>
              <li><Link to="/contact" className="hover:text-foreground hover:italic transition-all">Talk to a Counsellor</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground hover:italic transition-all">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Partners</p>
            <ul className="space-y-3 text-foreground/80">
              <li><Link to="/contact" className="hover:text-foreground hover:italic transition-all">Colleges</Link></li>
              <li><Link to="/contact" className="hover:text-foreground hover:italic transition-all">Corporates</Link></li>
            </ul>
            <div className="pt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-3">Reach</p>
              <ul className="space-y-2 text-foreground/80 text-sm">
                <li><a href="mailto:skillnex@gmail.com" className="hover:text-foreground">skillnex@gmail.com</a></li>
                <li><a href="tel:+919799856328" className="hover:text-foreground">+91 9799856328</a></li>
                <li>Nashik · IN</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/15 pt-8 flex flex-wrap justify-between gap-4 text-xs text-foreground/50">
          <p className="neon-text">© 2026 Skillnex. All rights reserved.</p>
          <p className="italic neon-text">Start with clarity, build with execution.</p>
        </div>
      </div>
    </footer>
  );
}