import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Sparkles,
  Target,
  Rocket,
  Briefcase,
  Trophy,
  GraduationCap,
  Brain,
  LineChart,
  Video,
  Code2,
  Palette,
  Megaphone,
  Play,
  Terminal,
  Users,
  Star,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { Marquee } from "@/components/motion/Marquee";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { listPublishedCourses } from "@/lib/courses.functions";

const coursesQuery = queryOptions({
  queryKey: ["public-courses"],
  queryFn: () => listPublishedCourses(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skillnex — Skills That Make You Irreplaceable" },
      {
        name: "description",
        content:
          "The future doesn't hire degrees, it hires skills. Skillnex trains creators, marketers and operators with industry-grade programs and an AI career engine.",
      },
      { property: "og:title", content: "Skillnex — Skills That Make You Irreplaceable" },
      {
        property: "og:description",
        content:
          "Industry-grade programs in Performance Marketing, Video, Brand & AI — built with working advisors.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(coursesQuery);
  const courses = data.courses;
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <ScrollProgress />
      <Header />
      <Hero />
      <Ticker />
      <DegreesVsSkills />
      <Ecosystem />
      <CareerTracks />
      <MakeCampusSkillFocused />
      <WorkshopAddOn />
      <PremiumPrograms courses={courses} />
      <CorporateOffering />
      <OutcomesOverPromises />
      <StudentWork />
      <NumbersStrip />
      <Advisors />
      <CareerAssessment />
      <RoadmapToHire />
      <AlumniGuild />
      <DeveloperAssets />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ─── SCROLL PROGRESS BAR ───────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground origin-left z-[60]"
    />
  );
}

/* ─── HERO ──────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden grain"
    >
      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-foreground/[0.04] blur-[120px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative w-full max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="w-12 h-px bg-foreground/40" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
              Skillnex · The skills institute
            </span>
          </div>
        </ScrollReveal>

        <KineticHeadline
          className="text-[12vw] md:text-[7.5vw] lg:text-[6.4vw] text-foreground"
          words={[
            { text: "The" },
            { text: "Future" },
            { text: "Doesn't" },
            { text: "Hire" },
            { text: "Degrees.", italic: true },
          ]}
        />
        <KineticHeadline
          className="text-[12vw] md:text-[7.5vw] lg:text-[6.4vw] text-foreground/80 mt-2"
          words={[{ text: "It" }, { text: "Hires" }, { text: "Skills.", italic: true }]}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-14 grid md:grid-cols-[1fr_auto] gap-10 items-end"
        >
          <p className="text-lg md:text-xl text-foreground/65 max-w-[58ch] leading-relaxed text-pretty">
            Skillnex starts with skill-focused career counselling — helping you choose the right path early so you don't waste time or stay confused. Then you move into real execution through projects and mentorship, building practical skills that actually move your career forward.
          </p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton asChild>
              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-sm text-sm hover:bg-foreground/90 transition-colors"
              >
                <span>Start your track</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild>
              <Link
                to="/programs"
                className="inline-flex items-center gap-3 border border-foreground/20 hover:border-foreground/60 px-6 py-4 rounded-sm text-sm transition-colors"
              >
                <span>Explore programs</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-20 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-foreground/40"
        >
          <span>Scroll · the chapter begins</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          <span className="hidden sm:inline">v. 2026 — Nashik, IN</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── TICKER ────────────────────────────────────────── */
function Ticker() {
  const items = [
    "Performance Marketing",
    "Video Production",
    "Branding",
    "UI/UX",
    "Engineering Program",
  ];
  return (
    <div className="py-6 border-y border-foreground/10 bg-card/40">
      <Marquee
        className="text-foreground/80"
        separator="✦"
        items={items.map((it) => (
          <span className="font-serif text-2xl md:text-3xl italic">{it}</span>
        ))}
      />
    </div>
  );
}

/* ─── BUILD SKILLS THROUGH EXECUTION ────────────────── */
function DegreesVsSkills() {
  const courses = [
    {
      title: "Social Media Management",
      description: "Strategy, calendars, content and community — run brand pages that actually grow.",
      category: "Operator",
    },
    {
      title: "Video Editing (Basic to Advance)",
      description: "Cut, color and score films that hold the scroll — Premiere, DaVinci, sound and finishing.",
      category: "Studio",
    },
    {
      title: "Graphic Designing and UI/UX",
      description: "Identity, type, layout and design systems for the modern internet.",
      category: "Design",
    },
    {
      title: "Performance Marketing",
      description: "Meta, Google, creative testing and attribution — paid acquisition end-to-end.",
      category: "Flagship",
    },
    {
      title: "Full Stack Development",
      description: "Build responsive, scalable applications from database to deployment.",
      category: "Engineering",
    },
    {
      title: "Soft Skill Learning",
      description: "Communication, leadership and professional skills that make you stand out.",
      category: "Foundation",
    },
  ];
  
  return (
    <SectionShell 
      index="02" 
      kicker="Learn by doing" 
      title={<>Build Skills Through <span className="italic text-foreground/55">Execution.</span></>}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, i) => (
          <ScrollReveal key={course.title} delay={i * 0.05}>
            <div className="relative rounded-sm border border-foreground/10 bg-card p-6 md:p-8 h-full flex flex-col overflow-hidden group hover:border-foreground/20 transition-colors">
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-foreground/[0.03] blur-2xl group-hover:bg-foreground/[0.06] transition-colors" />
              
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                {course.category}
              </p>
              
              <h3 className="font-serif text-2xl md:text-3xl mb-3 relative z-10">
                {course.title}
              </h3>
              
              <p className="text-sm text-foreground/60 leading-relaxed mb-6 flex-1 relative z-10">
                {course.description}
              </p>
              
              <Link 
                to="/programs"
                className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground group/link relative z-10"
              >
                <span className="border-b border-foreground/40 group-hover/link:border-foreground pb-0.5">
                  Explore
                </span>
                <ArrowRight className="size-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}


/* ─── ECOSYSTEM RING ───────────────────────────────── */
function Ecosystem() {
  // Outer ring nodes
  const outerNodes = [
    { label: "Programs", radius: 47, duration: 38, direction: 1 },
    { label: "Hiring", radius: 48, duration: 40, direction: -1 },
    { label: "AI Engine", radius: 46, duration: 42, direction: 1 },
  ];
  
  // Inner ring nodes
  const innerNodes = [
    { label: "Skill Counselling" },
    { label: "Practical Learning" },
    { label: "Practice" },
    { label: "Real Project" },
    { label: "Execution" },
    { label: "Mentorship" },
  ];
  
  return (
    <SectionShell 
      index="03" 
      kicker="The Architecture" 
      title={<>Unified Learning <span className="italic text-foreground/55">Ecosystem.</span></>}
      subtitle="One Ecosystem. All Your Growth."
    >
      <div className="relative mx-auto aspect-square w-full max-w-[700px] bg-black/95 rounded-2xl p-12">
        {/* rings */}
        {[0.3, 0.5, 0.75, 1].map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 m-auto rounded-full border border-white/5"
            style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 50 + i * 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
        
        {/* center with glow */}
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto size-40 rounded-full bg-white flex flex-col items-center justify-center shadow-[0_0_80px_40px_rgba(255,255,255,0.15)]"
        >
          <span className="font-serif text-3xl text-black">Skillnex</span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-black/60 mt-1">Core</span>
        </motion.div>
        
        {/* Inner ring orbiting nodes */}
        {innerNodes.map((n, i) => {
          const angle = (i / innerNodes.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 32; // closer to center
          return (
            <motion.div
              key={n.label + '-inner'}
              className="absolute inset-0 m-auto"
              style={{ width: '100%', height: '100%' }}
              animate={{ rotate: -360 }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${50 + Math.cos(angle) * radius}%`, 
                  top: `${50 + Math.sin(angle) * radius}%` 
                }}
                animate={{ 
                  rotate: 360,
                  y: [0, -5, 0],
                }}
                transition={{
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  y: { duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 shadow-lg">
                  <span className="text-xs font-medium text-white whitespace-nowrap">
                    {n.label}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
        
        {/* Outer ring orbiting nodes */}
        {outerNodes.map((n, i) => {
          const startAngle = (i / outerNodes.length) * Math.PI * 2;
          return (
            <motion.div
              key={n.label}
              className="absolute inset-0 m-auto"
              style={{ width: '100%', height: '100%' }}
              animate={{ rotate: n.direction * 360 }}
              transition={{ 
                duration: n.duration, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${50 + Math.cos(startAngle) * n.radius}%`, 
                  top: `${50 + Math.sin(startAngle) * n.radius}%` 
                }}
                animate={{ 
                  rotate: n.direction * -360,
                  y: [0, -8, 0],
                  x: [0, Math.random() > 0.5 ? 3 : -3, 0]
                }}
                transition={{
                  rotate: { duration: n.duration, repeat: Infinity, ease: "linear" },
                  y: { duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    {n.label}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
        
        {/* small red dot accent (top left) */}
        <motion.div 
          className="absolute top-16 left-16 w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="text-center max-w-xl mx-auto mt-12 text-foreground/60 leading-relaxed">
        Skillnex is one continuous loop — learn, execute, get matched, get hired, and grow.
      </p>
    </SectionShell>
  );
}

/* ─── CAREER TRACKS — tabs + horizontal scroll ──── */
const TRACKS = [
  {
    name: "Performance Marketing",
    icon: LineChart,
    blurb: "Run paid acquisition the way operators actually do — Meta, Google, creative testing, attribution.",
    modules: ["Meta Ads Lab", "Google Ads Engine", "Creative Testing", "Attribution Stack", "Reporting"],
    outcome: "Run a paid creative for a real D2C brand by week 6.",
  },
  {
    name: "Video Storytelling",
    icon: Video,
    blurb: "From short-form hooks to long-form narrative. Premiere, DaVinci, sound, and the rhythm that holds a viewer.",
    modules: ["Shot grammar", "Edit room", "Sound design", "Color & finishing", "Distribution"],
    outcome: "Cut a brand film with sound and color graded.",
  },
  {
    name: "AI for Creators",
    icon: Brain,
    blurb: "Use modern AI as a co-pilot for ideation, production, and growth without sounding like a robot.",
    modules: ["Prompt craft", "Agents", "Content pipelines", "Custom GPTs", "Ethics"],
    outcome: "Ship a working AI workflow that saves 10 hrs/week.",
  },
  {
    name: "Brand & Design",
    icon: Palette,
    blurb: "Identity, type, and motion for the modern internet. Build brands that survive the scroll.",
    modules: ["Identity systems", "Type & layout", "Motion", "Web kits", "Case studies"],
    outcome: "Design a full brand identity and present it to a panel.",
  },
  {
    name: "Growth Engineering",
    icon: Code2,
    blurb: "No-code, scripts, automations, analytics. Be the operator who actually builds the funnel.",
    modules: ["No-code stacks", "Automations", "SQL basics", "Tracking", "Experiment design"],
    outcome: "Build and instrument a live growth experiment.",
  },
];

function CareerTracks() {
  const [active, setActive] = useState(0);
  const track = TRACKS[active];
  const Icon = track.icon;
  return (
    <SectionShell 
      index="04" 
      kicker="For colleges" 
      title={<>Campus-Ready <span className="italic text-foreground/55">Career Tracks.</span></>}
      subtitle="Tracks Skillnex delivers on campus to build industry-ready talent."
    >
      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible -mx-6 px-6 md:m-0 md:p-0">
          {TRACKS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`group relative shrink-0 text-left px-4 py-4 rounded-sm border transition-all ${
                active === i
                  ? "border-neon/60 bg-card text-foreground shadow-neon"
                  : "border-foreground/10 hover:border-foreground/25 text-foreground/60 hover:text-foreground/85"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`font-serif italic text-xs tabular-nums ${active === i ? "text-neon" : "text-foreground/40"}`}>
                  0{i + 1}
                </span>
                <span className="text-sm whitespace-nowrap md:whitespace-normal">{t.name}</span>
              </span>
              {active === i && (
                <motion.span
                  layoutId="track-pill"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-neon shadow-neon"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div
          key={track.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-sm border border-foreground/10 bg-card overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-foreground/[0.05] blur-3xl" />
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-sm bg-neon-soft border border-neon/40 flex items-center justify-center">
                <Icon className="size-5 text-neon" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-neon font-medium">
                Track 0{active + 1}
              </span>
            </div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">{track.name}</h3>
            <p className="mt-4 text-foreground/65 max-w-[55ch] leading-relaxed">{track.blurb}</p>

            <div className="mt-10 grid sm:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neon/80 font-medium mb-4">
                  Modules
                </p>
                <div className="flex flex-wrap gap-2">
                  {track.modules.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-3 py-1.5 rounded-full border border-neon/40 text-foreground/85 hover:border-neon hover:text-neon transition-colors"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right max-w-xs">
                <p className="text-[10px] uppercase tracking-[0.3em] text-neon/80 font-medium mb-2">
                  Outcome
                </p>
                <p className="font-serif italic text-lg leading-snug">{track.outcome}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

/* ─── MAKE YOUR CAMPUS SKILL-FOCUSED ───────────── */
function MakeCampusSkillFocused() {
  const steps = [
    {
      number: "01",
      title: "Skill-Focused Counselling",
      subtitle: "Clarity before action",
      description: "Students identify the right skill path based on strengths, interests, and market demand, removing confusion early.",
    },
    {
      number: "02",
      title: "Structured Learning",
      subtitle: "Learn what actually matters",
      description: "Focused, practical training designed around real industry needs, not outdated theory.",
    },
    {
      number: "03",
      title: "Real-World Execution",
      subtitle: "Learn by doing",
      description: "Students work on live briefs, projects, and simulations to build actual experience and confidence.",
    },
    {
      number: "04",
      title: "Mentorship to Opportunities",
      subtitle: "From skills to outcomes",
      description: "Guidance from industry experts plus pathways to internships, freelance work, or placements.",
    },
  ];

  return (
    <SectionShell 
      index="05" 
      kicker="For institutions" 
      title={<>Make Your Campus <span className="italic text-foreground/55">Skill-Focused.</span></>}
      subtitle="Equip your students with practical skills that make them job-ready from day one."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <ScrollReveal key={step.number} delay={i * 0.08}>
            <div className="relative rounded-sm border border-foreground/10 bg-card p-6 md:p-8 h-full overflow-hidden group hover:border-foreground/20 transition-colors">
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-foreground/[0.03] blur-2xl group-hover:bg-foreground/[0.06] transition-colors" />
              
              <span className="font-serif text-5xl md:text-6xl text-foreground/10 relative z-10">
                {step.number}
              </span>
              
              <div className="mt-6 relative z-10">
                <h3 className="font-serif text-xl md:text-2xl mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neon font-medium mb-3 italic">
                  {step.subtitle}
                </p>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─── WORKSHOP/COLLEGE ADD-ON ──────────────────── */
function WorkshopAddOn() {
  const features = [
    { label: "Workshop Support", icon: Users },
    { label: "Skillnex Tie-Up", icon: Briefcase },
    { label: "Webinar Hosting", icon: Video },
  ];

  return (
    <div className="py-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.label} delay={i * 0.1}>
                <div className="flex items-center gap-4 rounded-sm border border-foreground/10 bg-card px-6 py-5 hover:border-foreground/20 transition-colors">
                  <div className="size-10 rounded-sm bg-neon-soft border border-neon/40 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-neon" />
                  </div>
                  <span className="font-medium">{feature.label}</span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── PREMIUM PROGRAMS — horizontal scroll ──────── */
function PremiumPrograms(_props: {
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    cover_image_url: string | null;
    category: string | null;
    price_cents: number;
  }>;
}) {
  const items = [
    {
      title: "Video Editing",
      subtitle: "Cut, color and score films that hold the scroll — Premiere, DaVinci, sound and finishing.",
      tag: "Studio · 12 weeks",
      slug: "video-editing",
    },
    {
      title: "Graphic Designing",
      subtitle: "Identity, type, layout and motion — design systems for the modern internet.",
      tag: "Studio · 10 weeks",
      slug: "graphic-designing",
    },
    {
      title: "Social Media Management",
      subtitle: "Strategy, calendars, content and community — run brand pages that actually grow.",
      tag: "Operator · 8 weeks",
      slug: "social-media-management",
    },
    {
      title: "Performance Marketing",
      subtitle: "Meta, Google, creative testing and attribution — paid acquisition end-to-end.",
      tag: "Flagship · 12 weeks",
      slug: "performance-marketing",
    },
    {
      title: "AI In Digital Marketing",
      subtitle: "Use modern AI as a co-pilot for ideation, production and growth pipelines.",
      tag: "New · 8 weeks",
      slug: "ai-in-digital-marketing",
    },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackW = trackRef.current.scrollWidth;
      const viewW = window.innerWidth;
      setDistance(Math.max(0, trackW - viewW));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -distance]);

  // dynamic section height — enough vertical scroll to pan the full track
  const sectionHeight = `calc(100vh + ${distance}px)`;

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="px-6 pt-24 pb-10">
          <div className="max-w-[1400px] mx-auto flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-px bg-neon" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-neon font-medium">
                  Chapter 05 · The catalog
                </span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl leading-[0.95]">
                Premium <span className="italic text-foreground/60">Programs.</span>
              </h2>
            </div>
            <p className="text-sm text-foreground/50 italic">scroll →</p>
          </div>
        </div>

        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 px-6 will-change-transform"
          >
            {items.map((c, i) => (
              <ProgramCard key={c.slug + i} index={i} {...c} />
            ))}
            <div className="w-[6vw] shrink-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProgramCard({
  index,
  title,
  subtitle,
  tag,
  slug,
}: {
  index: number;
  title: string;
  subtitle: string;
  tag: string;
  slug: string;
}) {
  return (
    <Link
      to="/programs/$slug"
      params={{ slug }}
      className="group relative shrink-0 w-[78vw] sm:w-[480px] aspect-[3/4] rounded-sm border border-foreground/12 bg-card overflow-hidden glow-ring"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.04] via-transparent to-foreground/[0.08]" />
      <motion.div
        className="absolute -top-20 -right-20 size-72 rounded-full bg-foreground/[0.06] blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 8 + index, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative h-full p-8 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neon font-medium">{tag}</span>
          <span className="font-serif italic text-foreground/30 tabular-nums">0{index + 1}</span>
        </div>
        <div>
          <h3 className="font-serif text-4xl md:text-5xl leading-[1.02] mb-4">{title}</h3>
          <p className="text-foreground/65 leading-relaxed line-clamp-3">{subtitle}</p>
          <div className="mt-8 inline-flex items-center gap-2 text-sm">
            <span className="border-b border-foreground/40 group-hover:border-foreground pb-0.5">
              View program
            </span>
            <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── CORPORATE OFFERING ────────────────────────── */
function CorporateOffering() {
  const offerings = [
    {
      number: "01",
      title: "Skill Gap Assessment",
      subtitle: "Identify what's missing",
      description: "Analyze team capabilities to pinpoint exact skill gaps aligned with business goals.",
      icon: Target,
    },
    {
      number: "02",
      title: "Customized Training Plan",
      subtitle: "Built for your team",
      description: "Design role-specific training programs focused on practical, high-impact skills.",
      icon: Briefcase,
    },
    {
      number: "03",
      title: "Hands-On Execution",
      subtitle: "Train through real work",
      description: "Teams learn by solving real business challenges, not just attending sessions.",
      icon: Rocket,
    },
    {
      number: "04",
      title: "Performance & Growth Tracking",
      subtitle: "Measure what matters",
      description: "Track improvement, productivity, and outcomes to ensure real ROI from training.",
      icon: LineChart,
    },
  ];

  return (
    <SectionShell 
      index="06" 
      kicker="For companies" 
      title={<>Build High-Performing <span className="italic text-foreground/55">Teams.</span></>}
      subtitle="Build, train, and manage your in-house marketing team so you stay in control while we ensure performance."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {offerings.map((item, i) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={item.number} delay={i * 0.08}>
              <div className="relative rounded-sm border border-foreground/10 bg-card p-8 h-full overflow-hidden group hover:border-foreground/20 transition-colors">
                <div className="absolute -top-10 -right-10 size-40 rounded-full bg-foreground/[0.03] blur-2xl group-hover:bg-foreground/[0.06] transition-colors" />
                
                <div className="flex items-start justify-between mb-6">
                  <span className="font-serif text-4xl text-foreground/10 relative z-10">
                    {item.number}
                  </span>
                  <div className="size-10 rounded-sm bg-neon-soft border border-neon/40 flex items-center justify-center">
                    <Icon className="size-5 text-neon" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl md:text-3xl mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neon font-medium mb-3 italic">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ─── OUTCOMES OVER PROMISES ────────────────────── */
function OutcomesOverPromises() {
  const cards = [
    {
      tag: "Real briefs",
      title: "Every week is a brief.",
      body: "We don't review hypothetical work. You ship against constraints from companies actively hiring.",
    },
    {
      tag: "Real reviews",
      title: "Working operators grade you.",
      body: "Feedback from people who do the job today. Not adjunct professors. Not theorists.",
    },
    {
      tag: "Real placements",
      title: "We don't promise jobs — we route them.",
      body: "Top performers get matched into our hiring partner network with introductions, not job boards.",
    },
  ];
  return (
    <SectionShell index="07" kicker="The contract" title={<>Outcomes <span className="italic text-foreground/55">Over Promises.</span></>}>
      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <ScrollReveal key={c.tag} delay={i * 0.1}>
            <div className="relative rounded-sm border border-foreground/10 bg-card p-8 h-full overflow-hidden">
              <Target className="size-5 text-foreground/40 mb-8" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                {c.tag}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl leading-snug mb-4">{c.title}</h3>
              <p className="text-foreground/65 leading-relaxed">{c.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─── PROOF THROUGH EXECUTION ───────────────────────────────── */
function StudentWork() {
  const tiles = [
    { tag: "Brand film", icon: Play, by: "Student · Marketing Cohort" },
    { tag: "Growth dashboard", icon: LineChart, by: "Student · Performance Track" },
    { tag: "Identity system", icon: Palette, by: "Student · Design Program" },
    { tag: "Web application", icon: Code2, by: "Student · Engineering Track" },
    { tag: "Social campaign", icon: Megaphone, by: "Student · Social Media Mgmt" },
    { tag: "Video edit", icon: Video, by: "Student · Video Production" },
  ];
  return (
    <SectionShell 
      index="08" 
      kicker="Real work" 
      title={<>Proof Through <span className="italic text-foreground/55">Execution.</span></>}
      subtitle="Built through real projects, real work, and real growth."
    >
      <div className="grid md:grid-cols-3 gap-5">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <ScrollReveal key={t.tag} delay={i * 0.1}>
              <div className="group relative aspect-[4/3] rounded-sm border border-foreground/10 bg-card overflow-hidden hover:border-foreground/20 transition-colors">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-foreground/[0.06] via-transparent to-foreground/[0.1]"
                  whileHover={{ opacity: 1 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="size-16 rounded-full border border-foreground/30 flex items-center justify-center bg-background/40 backdrop-blur"
                  >
                    <Icon className="size-5" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-[0.25em] text-foreground/60">{t.tag}</span>
                  <span className="font-serif italic text-foreground/50">{t.by}</span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ─── NUMBERS STRIP ─────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) {
      setVal(0);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function NumbersStrip() {
  const stats = [
    { v: 1000, s: "+", label: "Students trained" },
    { v: 300, s: "+", label: "Real briefs shipped" },
    { v: 100, s: "+", label: "Hiring partners" },
    { v: 85, s: "%", label: "Placement rate" },
  ];
  return (
    <SectionShell
      index="09"
      kicker="The receipts"
      title={<>The Numbers Behind <span className="italic text-foreground/55">Skillnex.</span></>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-foreground/10">
        {stats.map((s, i) => (
          <ScrollReveal
            key={s.label}
            delay={i * 0.08}
            className={`p-8 md:p-10 border-b border-foreground/10 ${
              i !== stats.length - 1 ? "md:border-r border-foreground/10" : ""
            }`}
          >
            <p className="font-serif text-6xl md:text-7xl leading-none">
              <Counter to={s.v} suffix={s.s} />
            </p>
            <p className="mt-4 text-foreground/60 text-sm uppercase tracking-[0.2em]">{s.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─── MEET THE FOUNDER ──────────────────────────────── */
function Advisors() {
  return (
    <SectionShell 
      index="10" 
      kicker="The founder" 
      title={<>Meet the <span className="italic text-foreground/55">Founder.</span></>}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="relative rounded-sm border border-foreground/10 bg-card p-8 md:p-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-foreground/[0.05] blur-3xl" />
            
            <div className="relative z-10">
              <div className="size-24 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center font-serif text-3xl mb-8">
                SK
              </div>
              
              <p className="text-lg md:text-xl text-foreground/75 leading-relaxed max-w-3xl">
                I'm the founder of Skillnex, focused on bridging the gap between learning and real-world execution. I help students find their niche, build the right skills, and grow through real work and mentorship so they move forward with clarity, not confusion.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm border-b border-foreground/40 hover:border-foreground pb-0.5 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <span>Read full story</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}

/* ─── TALK TO A SKILL COUNSELLOR ───────────────────────── */
function CareerAssessment() {
  const benefits = [
    "Clear direction on what skills to focus on",
    "Identify your niche based on strengths and demand",
    "Save time by avoiding random learning",
    "Get a structured path toward real execution",
  ];

  return (
    <SectionShell 
      index="11" 
      kicker="Get guidance" 
      title={<>Talk to a Skill <span className="italic text-foreground/55">Counsellor.</span></>}
      subtitle="Free skill counselling to find your niche and next steps."
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="relative rounded-sm border border-foreground/10 bg-card p-8 md:p-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-foreground/[0.05] blur-3xl" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl mb-6">
                  Start with <span className="italic text-foreground/60">clarity.</span>
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-8">
                  Book a free 1-on-1 session with our skill counsellors to understand where you are, where you want to go, and the exact path to get there.
                </p>
                <MagneticButton asChild>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-sm text-sm hover:bg-foreground/90 transition-colors"
                  >
                    <span>Book free session</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </MagneticButton>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-4">
                  What you'll get
                </p>
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Check className="size-5 mt-0.5 text-neon shrink-0" />
                    <span className="text-foreground/75 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}

/* ─── ROADMAP ───────────────────────────────────── */
function RoadmapToHire() {
  const steps = [
    { icon: Sparkles, t: "Assess", d: "AI maps your strengths" },
    { icon: GraduationCap, t: "Train", d: "Tightly produced lessons" },
    { icon: Megaphone, t: "Brief", d: "Real client briefs" },
    { icon: Briefcase, t: "Ship", d: "Portfolio reviewed by pros" },
    { icon: Trophy, t: "Match", d: "Routed to hiring partners" },
    { icon: Rocket, t: "Hire", d: "Onboard your first role" },
  ];
  return (
    <SectionShell index="11" kicker="The path" title={<>The Roadmap <span className="italic text-foreground/55">to Hire.</span></>}>
      <div className="relative">
        <div className="absolute left-0 right-0 top-7 h-px bg-foreground/10 hidden md:block" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={s.t} delay={i * 0.06} className="text-center">
                <div className="mx-auto size-14 rounded-full bg-card border border-foreground/15 flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <p className="font-serif text-xl">{s.t}</p>
                <p className="text-xs text-foreground/55 mt-1">{s.d}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────── */
function AlumniGuild() {
  const companyReviews = [
    { name: "Rajesh Kumar", role: "CEO, Tech Startup", quote: "Skillnex helped us build a high-performing marketing team from scratch. Their training is practical and focused on real outcomes." },
    { name: "Priya Sharma", role: "Marketing Director, E-commerce", quote: "The customized training plan was exactly what our team needed. We saw immediate improvements in campaign performance." },
  ];

  const internReviews = [
    { name: "Aarav Patel", role: "Performance Marketing Intern", quote: "Skillnex gave me real project experience that made me stand out in interviews. I got hired within 2 months of completing the program." },
    { name: "Meera Singh", role: "Video Editing Student", quote: "The mentorship and hands-on projects helped me build a portfolio I'm proud of. Best investment in my career." },
    { name: "Kabir Desai", role: "UI/UX Designer", quote: "From confusion to clarity — Skillnex's counselling helped me find my niche, and their program gave me the skills to land my first role." },
  ];

  const collegeReviews = [
    { name: "Dr. Anjali Mehta", role: "HOD, Commerce College", quote: "Our students are now industry-ready thanks to Skillnex's practical approach. The partnership has been transformative for our placement rates." },
    { name: "Prof. Vikram Rao", role: "Dean, Engineering College", quote: "Skillnex bridges the gap between academic learning and industry needs. Their focus on execution over theory is exactly what education needs today." },
  ];

  return (
    <section className="px-6 py-24">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12">
        {/* Left: Static heading */}
        <ScrollReveal>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50 mb-6">
              Trusted by all
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-6">
              Real Stories, Real <span className="italic text-foreground/60">Outcomes.</span>
            </h2>
            <p className="text-foreground/65 leading-relaxed max-w-md">
              Skillnex is a skill-focused ecosystem that turns learning into real-world execution. It helps students build skills, colleges create industry-ready talent, and companies build strong in-house teams — all through one connected system focused on real outcomes.
            </p>
          </div>
        </ScrollReveal>

        {/* Right: Categorized reviews */}
        <div className="space-y-12">
          {/* Company Owner Reviews */}
          <div>
            <ScrollReveal>
              <h3 className="font-serif text-2xl mb-2">Company Owner Reviews</h3>
              <p className="text-sm text-foreground/60 mb-6">Feedback from business owners who built and scaled their teams with Skillnex.</p>
            </ScrollReveal>
            <div className="space-y-4">
              {companyReviews.map((review, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="rounded-sm border border-foreground/10 bg-card p-6">
                    <p className="text-foreground/75 leading-relaxed mb-4 italic">"{review.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center font-serif text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.name}</p>
                        <p className="text-xs text-foreground/60">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Interns Reviews */}
          <div>
            <ScrollReveal>
              <h3 className="font-serif text-2xl mb-2">Interns Reviews</h3>
              <p className="text-sm text-foreground/60 mb-6">Experiences from students who learned, executed, and grew through real work.</p>
            </ScrollReveal>
            <div className="space-y-4">
              {internReviews.map((review, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="rounded-sm border border-foreground/10 bg-card p-6">
                    <p className="text-foreground/75 leading-relaxed mb-4 italic">"{review.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center font-serif text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.name}</p>
                        <p className="text-xs text-foreground/60">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* College Reviews */}
          <div>
            <ScrollReveal>
              <h3 className="font-serif text-2xl mb-2">College Reviews</h3>
              <p className="text-sm text-foreground/60 mb-6">Insights from institutions that partnered to build skill-focused student ecosystems.</p>
            </ScrollReveal>
            <div className="space-y-4">
              {collegeReviews.map((review, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="rounded-sm border border-foreground/10 bg-card p-6">
                    <p className="text-foreground/75 leading-relaxed mb-4 italic">"{review.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center font-serif text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.name}</p>
                        <p className="text-xs text-foreground/60">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── DEVELOPER & DESIGN ASSETS ─────────────────── */
function DeveloperAssets() {
  const items = [
    {
      tag: "Templates",
      t: "Brief deck templates",
      d: "The same docs our advisors review against — Figma & Keynote.",
    },
    {
      tag: "Stack",
      t: "No-code starter kits",
      d: "Automations, dashboards, and tracking blueprints to ship faster.",
    },
    {
      tag: "Library",
      t: "Swipe & study files",
      d: "Curated ads, films, identities — annotated by working operators.",
    },
  ];
  return (
    <SectionShell index="12" kicker="The toolkit" title={<>Developer & <span className="italic text-foreground/55">Design Assets.</span></>}>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <ScrollReveal key={it.t} delay={i * 0.08}>
            <div className="group rounded-sm border border-foreground/10 bg-card p-8 h-full hover:border-foreground/30 transition-colors">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">
                {it.tag}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl leading-snug mb-4">{it.t}</h3>
              <p className="text-foreground/65 leading-relaxed">{it.d}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm text-foreground/70 group-hover:text-foreground">
                <span className="border-b border-foreground/30 pb-0.5">Explore</span>
                <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─── FINAL CTA ─────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative px-6 py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-foreground/[0.06] blur-[120px]" />
      </div>
      <ScrollReveal className="relative max-w-[1100px] mx-auto text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50 mb-8">
          Begin chapter one
        </p>
        <h2 className="font-serif text-6xl md:text-[10vw] lg:text-[8vw] leading-[0.95]">
          Ready To Become
          <br />
          <span className="italic text-foreground/65">Irreplaceable?</span>
        </h2>
        <p className="mt-10 text-foreground/65 max-w-xl mx-auto leading-relaxed">
          A new cohort opens every season. Reserve your seat in 2 minutes.
        </p>
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <MagneticButton asChild>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 rounded-sm text-sm hover:bg-foreground/90 transition-colors"
            >
              <span>Begin enrollment</span>
              <ArrowRight className="size-4" />
            </Link>
          </MagneticButton>
          <MagneticButton asChild>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-3 border border-foreground/20 hover:border-foreground/60 px-7 py-4 rounded-sm text-sm transition-colors"
            >
              <span>See pricing</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </MagneticButton>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ─── SECTION SHELL ────────────────────────────── */
function SectionShell({
  index,
  kicker,
  title,
  subtitle,
  children,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-px bg-neon" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-neon font-medium">
              Chapter {index} · {kicker}
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[0.98] max-w-[20ch]">{title}</h2>
          {subtitle && (
            <p className="text-lg text-foreground/65 mt-4 max-w-[60ch]">{subtitle}</p>
          )}
        </ScrollReveal>
        {children}
      </div>
    </section>
  );
}