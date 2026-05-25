import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChapterRail } from "@/components/motion/ChapterRail";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { Marquee } from "@/components/motion/Marquee";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PinnedHorizontal } from "@/components/motion/PinnedHorizontal";
import { BentoTile } from "@/components/site/BentoTile";
import { listPublishedCourses } from "@/lib/courses.functions";

const coursesQuery = queryOptions({
  queryKey: ["public-courses"],
  queryFn: () => listPublishedCourses(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skillnex — A studio for the modern craftsman" },
      { name: "description", content: "Skillnex is an editorial school for digital marketing, video, and creator skills. Learn from real briefs and graduate with a portfolio." },
      { property: "og:title", content: "Skillnex — A studio for the modern craftsman" },
      { property: "og:description", content: "Editorial school for digital marketing, video, and creator skills." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Index,
});

const STREAMS = [
  {
    no: "01",
    title: "Social Media Management",
    kicker: "The discipline of attention.",
    body: "Build, schedule, and measure content systems that compound. From content calendars to community ops.",
    skills: ["Content systems", "Community", "Analytics", "Brand voice"],
  },
  {
    no: "02",
    title: "Performance Marketing",
    kicker: "The science of return.",
    body: "Paid acquisition the way operators actually do it — Meta, Google, creative testing, and clean attribution.",
    skills: ["Meta ads", "Google ads", "Creative testing", "Attribution"],
  },
  {
    no: "03",
    title: "Video Editing Mastery",
    kicker: "The craft of pacing.",
    body: "From short-form hooks to long-form narrative. Premiere, DaVinci, sound, and the rhythm that holds a viewer.",
    skills: ["Premiere", "DaVinci", "Sound design", "Story rhythm"],
  },
];

function Index() {
  const { data } = useSuspenseQuery(coursesQuery);
  const courses = data.courses;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <ChapterRail />
      <Header />
      <HeroChapter />
      <TickerStrip />
      <ManifestoChapter />
      <StreamsChapter />
      <CourseShowcase courses={courses} />
      <MethodChapter />
      <OutcomesChapter />
      <PricingTeaser />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

/* ─── HERO ───────────────────────────────────────────── */
function HeroChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} className="relative min-h-[110vh] flex items-end pb-20 pt-40 overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-10 md:right-20 font-serif text-[18vw] md:text-[14vw] leading-none italic text-foreground/[0.04] select-none">
          chapter
        </div>
        <div className="absolute bottom-10 left-10 font-serif text-[20vw] md:text-[16vw] leading-none text-foreground/[0.05] select-none">
          01
        </div>
      </motion.div>

      <div className="relative max-w-[1400px] mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="grid lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-9">
            <div className="flex items-center gap-3 mb-12">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                Chapter 01 · The Studio
              </span>
            </div>
            <KineticHeadline
              className="text-[14vw] md:text-[9vw] lg:text-[7.5vw]"
              words={[
                { text: "Learn" },
                { text: "the" },
                { text: "craft", italic: true },
                { text: "of" },
                { text: "modern" },
                { text: "marketing." },
              ]}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="lg:col-span-3 space-y-8"
          >
            <p className="text-foreground/70 text-lg leading-relaxed text-pretty">
              Skillnex is an editorial school. We teach digital disciplines through real briefs, paced like chapters.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <MagneticButton asChild>
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-between gap-4 bg-foreground text-background px-6 py-4 rounded-sm text-sm w-full"
                >
                  <span>Begin enrollment</span>
                  <span className="font-serif italic text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </MagneticButton>
              <MagneticButton asChild>
                <Link
                  to="/programs"
                  className="group inline-flex items-center justify-between gap-4 border border-foreground/20 hover:border-foreground/60 transition-colors px-6 py-4 rounded-sm text-sm w-full"
                >
                  <span>Browse programs</span>
                  <span className="font-serif italic text-lg">↗</span>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-24 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-foreground/40"
        >
          <span>Scroll to begin</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          <span className="hidden sm:inline">est. 2024 — Nashik, IN</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── TICKER STRIP ───────────────────────────────────── */
function TickerStrip() {
  const items = [
    "Social Media Management",
    "Performance Marketing",
    "Video Editing",
    "Brand Strategy",
    "Content Systems",
    "Creator Economy",
    "Paid Acquisition",
    "Studio Workflows",
  ];
  return (
    <div className="py-8 border-y border-foreground/10 bg-card">
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

/* ─── MANIFESTO BENTO ────────────────────────────────── */
function ManifestoChapter() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal className="mb-16 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                Chapter 02 · The Why
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl max-w-[18ch] leading-[0.95]">
              Most courses teach syllabus. <span className="italic text-foreground/60">We teach the work.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-12 gap-4">
          <ScrollReveal className="col-span-12 md:col-span-7">
            <BentoTile tone="ink" className="p-10 md:p-14 h-full min-h-[360px] flex flex-col justify-between">
              <p className="font-serif text-3xl md:text-5xl italic leading-tight text-balance">
                "I went from making reels for friends to running paid creative for a D2C brand. Inside one season."
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="size-12 rounded-full bg-background/10" />
                <div>
                  <p className="text-sm">Aarav K.</p>
                  <p className="text-xs text-background/60">Cohort 03 — Performance</p>
                </div>
              </div>
            </BentoTile>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="col-span-12 md:col-span-5">
            <BentoTile className="p-10 h-full min-h-[360px] flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Year one</span>
              <div>
                <p className="font-serif text-[8rem] md:text-[10rem] leading-none">
                  92<span className="italic text-foreground/40">%</span>
                </p>
                <p className="text-foreground/70 mt-2 max-w-[28ch]">
                  of students ship a portfolio project before chapter four.
                </p>
              </div>
            </BentoTile>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="col-span-12 md:col-span-4">
            <BentoTile className="aspect-square overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-foreground/80 via-foreground to-foreground/90 flex items-end p-6">
                <p className="font-serif italic text-background text-2xl">In the studio.</p>
              </div>
            </BentoTile>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="col-span-12 md:col-span-4">
            <BentoTile className="p-8 h-full aspect-square flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Founder note</span>
              <p className="font-serif italic text-2xl md:text-3xl leading-snug">
                "We don't believe in 100-hour courses. We believe in the right hour, repeated."
              </p>
              <p className="text-xs text-foreground/60">— Skillnex editorial</p>
            </BentoTile>
          </ScrollReveal>

          <ScrollReveal delay={0.25} className="col-span-12 md:col-span-4">
            <BentoTile className="p-8 h-full aspect-square flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Format</span>
              <ul className="space-y-3 text-lg">
                <li className="flex items-baseline gap-3">
                  <span className="font-serif italic text-foreground/40 text-sm">01</span>
                  <span>Tightly produced lessons</span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="font-serif italic text-foreground/40 text-sm">02</span>
                  <span>Real client briefs</span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="font-serif italic text-foreground/40 text-sm">03</span>
                  <span>Reviews by working pros</span>
                </li>
                <li className="flex items-baseline gap-3">
                  <span className="font-serif italic text-foreground/40 text-sm">04</span>
                  <span>A portfolio you can ship</span>
                </li>
              </ul>
            </BentoTile>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── STREAMS — PINNED HORIZONTAL ───────────────────── */
function StreamsChapter() {
  return (
    <>
      <div className="px-6 pt-24 pb-8 max-w-[1400px] mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-foreground" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
              Chapter 03 · The Disciplines
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl max-w-[20ch] leading-[0.95]">
            Three streams. <span className="italic text-foreground/60">One craft.</span>
          </h2>
        </ScrollReveal>
      </div>

      <div className="hidden md:block">
        <PinnedHorizontal panelCount={STREAMS.length}>
          {STREAMS.map((s) => (
            <StreamPanel key={s.no} stream={s} />
          ))}
        </PinnedHorizontal>
      </div>

      {/* mobile fallback: stack */}
      <div className="md:hidden flex flex-col">
        {STREAMS.map((s) => (
          <div key={s.no} className="px-6 py-16 border-t border-foreground/10">
            <p className="font-serif text-7xl text-foreground/15">{s.no}</p>
            <p className="font-serif italic text-lg text-foreground/60 mt-4">{s.kicker}</p>
            <h3 className="font-serif text-4xl mt-2">{s.title}</h3>
            <p className="mt-4 text-foreground/70">{s.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function StreamPanel({ stream }: { stream: (typeof STREAMS)[number] }) {
  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center px-6 md:px-20">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 md:col-span-2">
          <p className="font-serif text-[12rem] md:text-[16rem] leading-none text-foreground/10">{stream.no}</p>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p className="font-serif italic text-2xl text-foreground/60 mb-4">{stream.kicker}</p>
          <h3 className="font-serif text-6xl md:text-8xl leading-none mb-8">{stream.title}</h3>
          <p className="text-lg md:text-xl text-foreground/70 max-w-[50ch] leading-relaxed">{stream.body}</p>
        </div>
        <div className="col-span-12 md:col-span-3 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-4">You'll master</p>
          {stream.skills.map((sk) => (
            <div key={sk} className="flex items-center gap-3 py-2 border-b border-foreground/10">
              <span className="font-serif italic text-foreground/40 text-sm">+</span>
              <span className="text-sm">{sk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── COURSE SHOWCASE ─────────────────────────────────── */
function CourseShowcase({ courses }: { courses: Array<{ id: string; slug: string; title: string; subtitle: string | null; description: string | null; cover_image_url: string | null; category: string | null; price_cents: number }> }) {
  const sizes = ["col-span-12 md:col-span-7 row-span-2", "col-span-12 md:col-span-5", "col-span-12 md:col-span-5"];
  return (
    <section className="px-6 py-32">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal className="mb-16 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                Chapter 04 · The Catalog
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl max-w-[18ch] leading-[0.95]">
              Current <span className="italic text-foreground/60">issue.</span>
            </h2>
          </div>
          <Link to="/programs" className="group flex items-center gap-2 text-sm">
            <span className="border-b border-foreground/40 group-hover:border-foreground pb-0.5">View all programs</span>
            <span className="font-serif italic">→</span>
          </Link>
        </ScrollReveal>

        {courses.length === 0 ? (
          <p className="text-foreground/60">Programs launching soon.</p>
        ) : (
          <div className="grid grid-cols-12 gap-4 auto-rows-[260px]">
            {courses.slice(0, 3).map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.1} className={sizes[i] ?? "col-span-12 md:col-span-6"}>
                <Link to="/programs/$slug" params={{ slug: c.slug }} className="block h-full group">
                  <BentoTile className="h-full" tone={i === 0 ? "linen" : i === 1 ? "ink" : "paper"}>
                    <div className="relative h-full p-8 flex flex-col justify-between overflow-hidden">
                      {c.cover_image_url && (
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                          <img src={c.cover_image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                      )}
                      <div className="relative flex items-start justify-between">
                        <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">{c.category ?? "Program"}</span>
                        <span className="font-serif italic text-2xl">
                          {c.price_cents === 0 ? "Free" : `$${(c.price_cents / 100).toFixed(0)}`}
                        </span>
                      </div>
                      <div className="relative">
                        <h3 className={`font-serif leading-tight ${i === 0 ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"}`}>
                          {c.title}
                        </h3>
                        {c.subtitle && <p className="mt-3 opacity-70 max-w-[40ch]">{c.subtitle}</p>}
                        <span className="mt-6 inline-flex items-center gap-2 text-sm group-hover:gap-3 transition-all">
                          Read syllabus <span className="font-serif italic">→</span>
                        </span>
                      </div>
                    </div>
                  </BentoTile>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── METHOD CHAPTER ─────────────────────────────────── */
function MethodChapter() {
  const steps = [
    { n: "01", t: "Enroll", d: "Pick the discipline that fits the work you want to do." },
    { n: "02", t: "Learn", d: "Watch tightly produced lessons and follow real briefs." },
    { n: "03", t: "Build", d: "Ship real projects, reviewed by working professionals." },
    { n: "04", t: "Earn", d: "Walk away with a portfolio and a pipeline." },
  ];
  return (
    <section className="px-6 py-32 border-t border-foreground/10 bg-card">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-foreground" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
              Chapter 05 · The Method
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl max-w-[20ch] leading-[0.95]">
            How a student <span className="italic text-foreground/60">transforms.</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-px bg-foreground/10">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 0.08}>
              <div className="bg-card p-8 h-full min-h-[280px] flex flex-col justify-between group hover:bg-background transition-colors duration-500">
                <p className="font-serif text-7xl text-foreground/15 group-hover:text-foreground/30 transition-colors">{s.n}</p>
                <div>
                  <h4 className="font-serif text-3xl italic">{s.t}</h4>
                  <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{s.d}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OUTCOMES ────────────────────────────────────────── */
function OutcomesChapter() {
  const wins = [
    "Aarav landed his first paid ad role",
    "Meera shipped 12 brand reels in 30 days",
    "Rohan booked $4,200 freelance in month two",
    "Ishaan went from intern to lead editor",
    "Sara built a client roster of six",
    "Karan now runs paid for two D2C brands",
  ];
  return (
    <section className="py-32">
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-foreground" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
              Chapter 06 · The Receipts
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl max-w-[20ch] leading-[0.95]">
            Where they <span className="italic text-foreground/60">went next.</span>
          </h2>
        </ScrollReveal>
      </div>

      <Marquee
        className="py-6 border-y border-foreground/10"
        separator="✦"
        items={wins.map((w) => (
          <span className="font-serif text-2xl md:text-3xl">{w}</span>
        ))}
      />

      <div className="max-w-[1400px] mx-auto px-6 mt-16 grid grid-cols-12 gap-4">
        {[
          { q: "Skillnex is the only course where I felt like I was apprenticing, not studying.", a: "Meera", r: "Cohort 02" },
          { q: "The briefs were so close to real client work, my portfolio doubled as case studies.", a: "Rohan", r: "Cohort 04" },
          { q: "I stopped consuming content and started producing systems. That was the whole shift.", a: "Sara", r: "Cohort 03" },
        ].map((t, i) => (
          <ScrollReveal key={i} delay={i * 0.1} className="col-span-12 md:col-span-4">
            <BentoTile className="p-8 h-full min-h-[280px] flex flex-col justify-between">
              <p className="font-serif italic text-xl md:text-2xl leading-snug">"{t.q}"</p>
              <div className="mt-6 pt-6 border-t border-foreground/10">
                <p className="font-medium">{t.a}</p>
                <p className="text-xs text-foreground/60">{t.r}</p>
              </div>
            </BentoTile>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ─── PRICING TEASER (INK) ────────────────────────────── */
function PricingTeaser() {
  return (
    <section className="ink-section py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-end mb-16">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-background" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-background/60">
                Chapter 07 · The Investment
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] max-w-[16ch]">
              Pay per <span className="italic text-background/60">chapter,</span> or read the whole library.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-background/70 text-lg max-w-[44ch]">
              Two ways in. Buy a single program for life, or subscribe for everything we publish — past, present, and future.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ScrollReveal>
            <div className="p-10 md:p-12 border border-background/20 rounded-sm min-h-[420px] flex flex-col justify-between hover:bg-background/5 transition-colors">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-background/50">Per program</p>
                <p className="font-serif text-8xl mt-6">from $149</p>
                <p className="font-serif italic text-background/60 mt-4 text-xl">One-time. Forever yours.</p>
              </div>
              <Link to="/programs" className="group inline-flex items-center justify-between border-t border-background/20 pt-6 mt-10">
                <span>Browse programs</span>
                <span className="font-serif italic text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="p-10 md:p-12 bg-background text-foreground rounded-sm min-h-[420px] flex flex-col justify-between relative">
              <span className="absolute -top-3 right-8 bg-foreground text-background text-[10px] px-3 py-1 uppercase tracking-[0.25em]">Editor's pick</span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">All-Access</p>
                <p className="font-serif text-8xl mt-6">$89<span className="text-2xl italic text-foreground/50">/mo</span></p>
                <p className="font-serif italic text-foreground/60 mt-4 text-xl">Every current and future chapter.</p>
              </div>
              <Link to="/pricing" className="group inline-flex items-center justify-between border-t border-foreground/20 pt-6 mt-10">
                <span>Subscribe</span>
                <span className="font-serif italic text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── CLOSING CTA ─────────────────────────────────────── */
function ClosingCTA() {
  return (
    <section className="py-40 px-6 text-center relative overflow-hidden">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-8">Chapter 08 · Begin</p>
        <h2 className="font-serif text-[14vw] md:text-[10vw] leading-[0.9] mb-12">
          Begin chapter <span className="italic">one.</span>
        </h2>
        <MagneticButton asChild>
          <Link
            to="/signup"
            className="inline-flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-sm text-base"
          >
            Create your account
            <span className="font-serif italic text-xl">→</span>
          </Link>
        </MagneticButton>
        <p className="text-xs text-foreground/50 mt-6">Free to start. No card required.</p>
      </ScrollReveal>
    </section>
  );
}