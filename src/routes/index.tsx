import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { listPublishedCourses } from "@/lib/courses.functions";

const coursesQuery = queryOptions({
  queryKey: ["public-courses"],
  queryFn: () => listPublishedCourses(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skillnex — Digital skills that prepare you for the real industry" },
      { name: "description", content: "Learn practical digital skills with real projects, mentorship, and a path to income. Programs in video, design, marketing, and more." },
      { property: "og:title", content: "Skillnex — Future skills start here" },
      { property: "og:description", content: "Skillnex teaches digital skills that pay. Build a portfolio with real projects." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(coursesQuery);
  const courses = data.courses;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-foreground/5">
      <Header />

      {/* Hero — Chapter 01 */}
      <section className="pt-40 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-12"
          >
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">
                Chapter 01 — The Spark
              </span>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif italic leading-none max-w-[20ch] text-balance">
                Your talent is raw. Let's add the precision.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[48ch] text-pretty">
                More than a course, this is a transition. Move from consuming content to creating systems that drive income and influence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-foreground text-background py-2.5 pr-5 pl-4 rounded-full text-sm font-medium ring-1 ring-foreground hover:scale-[1.02] transition-transform"
              >
                <span className="size-4 flex items-center justify-center shrink-0">+</span>
                Begin Enrollment
              </Link>
              <a
                href="#demo"
                className="flex items-center gap-2 bg-background text-foreground py-2.5 pr-5 pl-4 rounded-full text-sm font-medium ring-1 ring-black/10 hover:bg-secondary transition-colors"
              >
                Watch the Film
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Theatrical Player */}
      <section id="demo" className="py-12 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden ring-1 ring-black/5 shadow-2xl">
            {/* Placeholder Vimeo demo — admin can swap */}
            <iframe
              src="https://player.vimeo.com/video/76979871?dnt=1&title=0&byline=0"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Introductory Chapter"
            />
          </div>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Introductory Chapter — A glimpse inside the studio
          </p>
        </div>
      </section>

      {/* Programs — Chapter 02 */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-between items-end mb-16 border-b border-border pb-8"
          >
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">
                Chapter 02 — The Disciplines
              </span>
              <h2 className="text-4xl md:text-5xl font-serif italic max-w-[24ch] leading-tight">
                Craft the modern stack.
              </h2>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {courses.length} Programs
            </span>
          </motion.div>

          {courses.length === 0 ? (
            <p className="text-muted-foreground">Courses launching soon. Check back shortly.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course) => (
                <Link
                  key={course.id}
                  to="/programs/$slug"
                  params={{ slug: course.slug }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/5 bg-secondary">
                    {course.cover_image_url ? (
                      <img
                        src={course.cover_image_url}
                        alt={course.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-background text-[10px] font-semibold uppercase tracking-wider rounded ring-1 ring-black/5">
                        {course.price_cents === 0
                          ? "Free"
                          : `$${(course.price_cents / 100).toFixed(0)}`}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-1 group-hover:underline underline-offset-4 decoration-foreground/20">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.subtitle ?? course.description}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground border-b border-foreground/20 pb-1 hover:border-foreground"
            >
              Browse the full library →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">
              The Method
            </span>
            <h2 className="text-4xl md:text-5xl font-serif italic max-w-[20ch] leading-tight mt-4">
              How a Skillnex student transforms.
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Enroll", d: "Pick the discipline that fits the work you want to do." },
              { n: "02", t: "Learn", d: "Watch tightly produced lessons and follow real briefs." },
              { n: "03", t: "Build", d: "Ship real projects, reviewed by working professionals." },
              { n: "04", t: "Earn", d: "Walk away with a portfolio and a pipeline." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <span className="font-serif italic text-5xl text-muted-foreground/40">{s.n}</span>
                <h4 className="font-medium text-lg">{s.t}</h4>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Chapter 03 */}
      <section className="py-32 bg-neutral-900 text-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mb-6">
                Chapter 03 — The Investment
              </span>
              <h2 className="text-4xl md:text-5xl font-serif italic mb-8 max-w-[20ch] leading-tight">
                Flexible paths to mastery.
              </h2>
              <p className="text-neutral-400 text-lg mb-12 max-w-[40ch] text-pretty">
                Choose individual programs that fit your current needs, or unlock the full library for ongoing evolution.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Alumni</p>
                  <p className="text-2xl font-serif italic">12,000+</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Instructors</p>
                  <p className="text-2xl font-serif italic">40+</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="p-8 bg-neutral-800 rounded-xl ring-1 ring-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-medium">Full Access Pass</h4>
                    <p className="text-sm text-neutral-400">The craftsman's subscription</p>
                  </div>
                  <span className="text-2xl font-serif italic">
                    $89<span className="text-sm text-neutral-500 italic">/mo</span>
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="text-sm flex items-center gap-3 text-neutral-300"><span className="size-1 bg-neutral-500 rounded-full" /> Every current & future course</li>
                  <li className="text-sm flex items-center gap-3 text-neutral-300"><span className="size-1 bg-neutral-500 rounded-full" /> Monthly live workshop sessions</li>
                  <li className="text-sm flex items-center gap-3 text-neutral-300"><span className="size-1 bg-neutral-500 rounded-full" /> Private community access</li>
                </ul>
                <Link
                  to="/pricing"
                  className="block text-center w-full py-2 bg-neutral-100 text-neutral-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                  Subscribe Now
                </Link>
              </div>

              <div className="p-8 bg-neutral-800/40 rounded-xl ring-1 ring-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-medium">Single Course</h4>
                    <p className="text-sm text-neutral-400">Focused learning track</p>
                  </div>
                  <span className="text-2xl font-serif italic">from $149</span>
                </div>
                <Link
                  to="/programs"
                  className="block text-center w-full py-2 bg-neutral-900 text-neutral-100 rounded-full text-sm font-medium ring-1 ring-white/10 hover:bg-neutral-800 transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">
            Closing Thoughts
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic mt-4 mb-6">
            Still turning the page?
          </h2>
          <p className="text-muted-foreground mb-8">
            We answer the questions students, firms, and colleges ask most often.
          </p>
          <Link
            to="/faq"
            className="inline-flex bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium ring-1 ring-foreground"
          >
            Read the FAQ
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
