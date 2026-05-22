import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listPublishedCourses = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("id, slug, title, subtitle, description, cover_image_url, category, level, price_cents")
    .eq("published", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return { courses: data ?? [] };
});

export const getCourseBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: course, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!course) return { course: null, lessons: [] };
    const { data: lessons } = await supabaseAdmin
      .from("lessons")
      .select("id, title, description, position, duration_seconds, is_free_preview")
      .eq("course_id", course.id)
      .order("position", { ascending: true });
    return { course, lessons: lessons ?? [] };
  });

// Authenticated: returns lessons + access flag + my progress
export const getCourseForLearning = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: course, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!course) return { course: null, lessons: [], hasAccess: false, progress: [] };

    const [{ data: lessons }, { data: enrollment }, { data: sub }, { data: progress }] =
      await Promise.all([
        supabaseAdmin
          .from("lessons")
          .select("id, title, description, position, duration_seconds, is_free_preview, vimeo_video_id")
          .eq("course_id", course.id)
          .order("position", { ascending: true }),
        supabaseAdmin
          .from("enrollments")
          .select("id")
          .eq("user_id", userId)
          .eq("course_id", course.id)
          .maybeSingle(),
        supabaseAdmin
          .from("subscriptions")
          .select("status, current_period_end")
          .eq("user_id", userId)
          .maybeSingle(),
        supabaseAdmin
          .from("lesson_progress")
          .select("lesson_id, completed_at, last_position_seconds")
          .eq("user_id", userId),
      ]);

    const subActive =
      !!sub &&
      ["active", "trialing"].includes(sub.status) &&
      (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
    const hasAccess = !!enrollment || subActive;

    const gatedLessons = (lessons ?? []).map((l) => ({
      ...l,
      vimeo_video_id: hasAccess || l.is_free_preview ? l.vimeo_video_id : null,
    }));

    return { course, lessons: gatedLessons, hasAccess, progress: progress ?? [] };
  });

export const listMyEnrollments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("course_id, created_at, source, courses(id, slug, title, subtitle, cover_image_url, category, level)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, current_period_end, stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();
    return { enrollments: enrollments ?? [], subscription: sub };
  });

export const markLessonProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        lessonId: z.string().uuid(),
        completed: z.boolean().optional(),
        positionSeconds: z.number().int().min(0).max(86400).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const payload: Record<string, unknown> = {
      user_id: userId,
      lesson_id: data.lessonId,
    };
    if (data.completed !== undefined) payload.completed_at = data.completed ? new Date().toISOString() : null;
    if (data.positionSeconds !== undefined) payload.last_position_seconds = data.positionSeconds;
    const { error } = await supabaseAdmin
      .from("lesson_progress")
      .upsert(payload, { onConflict: "user_id,lesson_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Free enrollment (demo)
export const enrollFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ courseId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("id, price_cents, published")
      .eq("id", data.courseId)
      .maybeSingle();
    if (!course || !course.published) throw new Error("Course not available");
    if (course.price_cents > 0) throw new Error("This course is paid — use checkout instead");
    const { error } = await supabaseAdmin.from("enrollments").upsert(
      { user_id: userId, course_id: course.id, source: "free" },
      { onConflict: "user_id,course_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });