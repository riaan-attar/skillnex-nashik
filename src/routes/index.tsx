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
      <PremiumPrograms courses={courses} />
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
            Skillnex is the operating system for the post-degree generation. We train marketers,
            creators, and operators with real briefs, working advisors, and an AI career engine that
            tells you exactly what to do next.
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
    "Brand Strategy",
    "Video Storytelling",
    "AI for Creators",
    "Product Design",
    "Growth Engineering",
    "Content Systems",
    "Studio Workflows",
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

/* ─── DEGREES VS SKILLS ─────────────────────────────── */
function DegreesVsSkills() {
  const old = [
    "Four years, zero portfolio",
    "Theory written before the internet",
    "Recruiters skip your resume",
    "You graduate, then you start learning",
  ];
  const skillnex = [
    "Ship a portfolio in 90 days",
    "Briefs from working operators",
    "AI engine that aims your trajectory",
    "You graduate already hired",
  ];
  return (
    <SectionShell index="02" kicker="The shift" title={<>Degrees Are <span className="italic text-foreground/55">No Longer Enough.</span></>}>
      <div className="grid md:grid-cols-2 gap-5">
        <ScrollReveal>
          <div className="relative rounded-sm border border-foreground/10 bg-card p-8 md:p-10 h-full overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-foreground/[0.03] blur-2xl" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6">The old operating system</p>
            <h3 className="font-serif text-3xl md:text-4xl mb-8">Inefficient · Outdated</h3>
            <ul className="space-y-4">
              {old.map((t) => (
                <li key={t} className="flex gap-3 items-start text-foreground/70">
                  <X className="size-4 mt-1 text-foreground/40 shrink-0" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="relative rounded-sm border border-foreground/15 bg-gradient-to-br from-card via-card to-foreground/[0.04] p-8 md:p-10 h-full overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 size-60 rounded-full bg-foreground/[0.06] blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-6">
              The Skillnex operating system
            </p>
            <h3 className="font-serif text-3xl md:text-4xl mb-8">
              Designed for the <span className="italic">work that exists.</span>
            </h3>
            <ul className="space-y-4">
              {skillnex.map((t) => (
                <li key={t} className="flex gap-3 items-start">
                  <Check className="size-4 mt-1 text-foreground shrink-0" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}

/* ─── ECOSYSTEM RING ───────────────────────────────── */
function Ecosystem() {
  const nodes = [
    { label: "Programs", icon: GraduationCap },
    { label: "AI Engine", icon: Brain },
    { label: "Advisors", icon: Users },
    { label: "Studio", icon: Palette },
    { label: "Portfolio", icon: Briefcase },
    { label: "Hiring", icon: Rocket },
  ];
  return (
    <SectionShell index="03" kicker="The architecture" title={<>Unified <span className="italic text-foreground/55">Learning Ecosystem.</span></>}>
      <div className="relative mx-auto aspect-square w-full max-w-[560px]">
        {/* rings */}
        {[0.4, 0.7, 1].map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 m-auto rounded-full border border-foreground/10"
            style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {/* center */}
        <motion.div
          animate={{ y: [0, -14, 0, -8, 0], scale: [1, 1.04, 1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto size-32 rounded-full bg-foreground text-background flex flex-col items-center justify-center shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="size-5 mb-1" />
          </motion.div>
          <span className="font-serif text-xl">Skillnex</span>
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 mt-0.5">Core</span>
        </motion.div>
        {/* orbiting nodes — wrapper rotates, inner counter-rotates */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
        {nodes.map((n, i) => {
          const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const r = 45;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          const Icon = n.icon;
          return (
            <motion.div
              key={n.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <motion.div
                animate={{ rotate: -360, y: [0, -6, 0] }}
                transition={{
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  y: { duration: 2.4 + i * 0.2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="size-14 rounded-full bg-card border border-foreground/15 flex items-center justify-center shadow-md">
                  <Icon className="size-5 text-foreground/80" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/60 whitespace-nowrap">
                  {n.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
        </motion.div>
      </div>
      <p className="text-center max-w-xl mx-auto mt-12 text-foreground/60 leading-relaxed">
        Every part of Skillnex feeds the next. Learn a discipline, ship a brief, get matched, get
        hired — one continuous loop.
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
    <SectionShell index="04" kicker="The map" title={<>Discover Your <span className="italic text-foreground/55">Career Track.</span></>}>
      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible -mx-6 px-6 md:m-0 md:p-0">
          {TRACKS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`group relative shrink-0 text-left px-4 py-4 rounded-sm border transition-all ${
                active === i
                  ? "border-foreground/40 bg-card text-foreground"
                  : "border-foreground/10 hover:border-foreground/25 text-foreground/60 hover:text-foreground/85"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="font-serif italic text-xs text-foreground/40 tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-sm whitespace-nowrap md:whitespace-normal">{t.name}</span>
              </span>
              {active === i && (
                <motion.span
                  layoutId="track-pill"
                  className="absolute left-0 top-0 bottom-0 w-px bg-foreground"
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
              <div className="size-10 rounded-sm bg-foreground/10 flex items-center justify-center">
                <Icon className="size-5" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                Track 0{active + 1}
              </span>
            </div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">{track.name}</h3>
            <p className="mt-4 text-foreground/65 max-w-[55ch] leading-relaxed">{track.blurb}</p>

            <div className="mt-10 grid sm:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                  Modules
                </p>
                <div className="flex flex-wrap gap-2">
                  {track.modules.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-3 py-1.5 rounded-full border border-foreground/15 text-foreground/75"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right max-w-xs">
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2">
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
    <section ref={ref} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="px-6 pt-24 pb-10">
          <div className="max-w-[1400px] mx-auto flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-px bg-foreground/40" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
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

        <div className="flex-1 flex items-center">
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
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">{tag}</span>
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
    <SectionShell index="06" kicker="The contract" title={<>Outcomes <span className="italic text-foreground/55">Over Promises.</span></>}>
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

/* ─── STUDENT WORK ───────────────────────────────── */
function StudentWork() {
  const tiles = [
    { tag: "Brand film", icon: Play, by: "Aarav · Cohort 03" },
    { tag: "Growth dashboard", icon: LineChart, by: "Mira · Cohort 02" },
    { tag: "Identity system", icon: Palette, by: "Kabir · Cohort 03" },
  ];
  return (
    <SectionShell index="07" kicker="The proof" title={<>Student Work & <span className="italic text-foreground/55">Client Previews.</span></>}>
      <div className="grid md:grid-cols-3 gap-5">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <ScrollReveal key={t.tag} delay={i * 0.1}>
              <div className="group relative aspect-[4/3] rounded-sm border border-foreground/10 bg-card overflow-hidden">
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
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
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
      index="08"
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

/* ─── ADVISORS ──────────────────────────────────── */
function Advisors() {
  const advisors = [
    { name: "Riya Mehta", role: "Head of Growth · D2C unicorn", initials: "RM" },
    { name: "Aditya Rao", role: "Creative Director · Studio Ten", initials: "AR" },
    { name: "Sana Iqbal", role: "Performance Lead · Fintech", initials: "SI" },
    { name: "Vikram Shah", role: "Founder · Modern brand co.", initials: "VS" },
  ];
  return (
    <SectionShell index="09" kicker="The faculty" title={<>Led by <span className="italic text-foreground/55">Working Advisors.</span></>}>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
        {advisors.map((a, i) => (
          <ScrollReveal key={a.name} delay={i * 0.08}>
            <div className="group rounded-sm border border-foreground/10 bg-card p-6 h-full">
              <div className="size-20 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center font-serif text-2xl mb-6 group-hover:bg-foreground/15 transition-colors">
                {a.initials}
              </div>
              <p className="font-serif text-xl leading-tight">{a.name}</p>
              <p className="text-sm text-foreground/55 mt-1">{a.role}</p>
              <div className="mt-6 flex items-center gap-1 text-foreground/40">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-3 fill-current" />
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─── AI CAREER ASSESSMENT ───────────────────────── */
function CareerAssessment() {
  const [step, setStep] = useState(0);
  const questions = [
    {
      q: "Where do you want to work?",
      options: ["Agency", "In-house brand", "Startup", "Freelance"],
    },
    {
      q: "Your strongest instinct?",
      options: ["Storytelling", "Numbers", "Design", "Systems"],
    },
    {
      q: "How fast do you want to ship?",
      options: ["8 weeks", "12 weeks", "6 months", "I'll pace myself"],
    },
  ];

  const terminal = [
    "> analyzing inputs ...",
    "> matching against 12,000 hiring signals",
    "> recommended track: Performance Marketing",
    "> est. portfolio in: 9 weeks",
    "> top employer matches: 14",
    "> confidence: 92%",
  ];

  return (
    <SectionShell index="10" kicker="The engine" title={<>AI <span className="italic text-foreground/55">Career Assessment.</span></>}>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-sm border border-foreground/10 bg-card p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">
            Step {step + 1} / {questions.length}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl leading-snug mb-8">
            {questions[step].q}
          </h3>
          <div className="space-y-2 mb-8">
            {questions[step].options.map((o) => (
              <button
                key={o}
                onClick={() => setStep((s) => Math.min(s + 1, questions.length - 1))}
                className="w-full text-left px-4 py-3 rounded-sm border border-foreground/10 hover:border-foreground/40 hover:bg-foreground/[0.04] transition-all text-foreground/80 hover:text-foreground"
              >
                {o}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-foreground/50 hover:text-foreground"
            >
              ← back
            </button>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`h-px w-8 ${i <= step ? "bg-foreground" : "bg-foreground/15"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-foreground/10 bg-ink-deep bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-foreground/10">
            <span className="size-2 rounded-full bg-foreground/30" />
            <span className="size-2 rounded-full bg-foreground/30" />
            <span className="size-2 rounded-full bg-foreground/30" />
            <span className="ml-3 text-xs text-foreground/50 flex items-center gap-2">
              <Terminal className="size-3" />
              skillnex@career-engine
            </span>
          </div>
          <div className="p-6 font-mono text-sm space-y-2 min-h-[260px]">
            {terminal.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.18 }}
                className={i >= terminal.length - 3 ? "text-foreground" : "text-foreground/60"}
              >
                {line}
              </motion.p>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-foreground align-middle"
            />
          </div>
        </div>
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

/* ─── ALUMNI GUILD ──────────────────────────────── */
function AlumniGuild() {
  return (
    <section className="px-6 py-24">
      <ScrollReveal>
        <div className="relative max-w-[1000px] mx-auto rounded-sm border border-foreground/15 bg-card p-10 md:p-16 text-center overflow-hidden">
          <motion.div
            className="absolute -top-24 -left-24 size-80 rounded-full bg-foreground/[0.06] blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50 mb-6">
            Lifelong access
          </p>
          <h3 className="font-serif text-4xl md:text-6xl leading-[1.02]">
            Skillnex <span className="italic text-foreground/60">Alumni Guild.</span>
          </h3>
          <p className="mt-6 text-foreground/65 max-w-xl mx-auto leading-relaxed">
            Once a Skillnex student, always inside. Curated job openings, advisor office hours,
            quarterly studio meets, and a private network of operators.
          </p>
          <MagneticButton asChild>
            <Link
              to="/signup"
              className="mt-10 inline-flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-sm text-sm hover:bg-foreground/90 transition-colors"
            >
              <span>Join the guild</span>
              <ArrowRight className="size-4" />
            </Link>
          </MagneticButton>
        </div>
      </ScrollReveal>
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
  children,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-px bg-foreground/40" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
              Chapter {index} · {kicker}
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[0.98] max-w-[20ch]">{title}</h2>
        </ScrollReveal>
        {children}
      </div>
    </section>
  );
}