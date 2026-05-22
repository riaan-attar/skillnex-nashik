import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin only");
}

export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { courses: data ?? [] };
  });

const courseInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  cover_image_url: z.string().url().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  level: z.string().max(50).optional().nullable(),
  price_cents: z.number().int().min(0).max(10000000),
  published: z.boolean(),
});

export const adminUpsertCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => courseInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: result, error } = await supabaseAdmin
      .from("courses")
      .upsert(data, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { course: result };
  });

export const adminDeleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetCourse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: course } = await supabaseAdmin.from("courses").select("*").eq("id", data.id).maybeSingle();
    const { data: lessons } = await supabaseAdmin
      .from("lessons")
      .select("*")
      .eq("course_id", data.id)
      .order("position", { ascending: true });
    return { course, lessons: lessons ?? [] };
  });

const lessonInput = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  vimeo_video_id: z.string().max(50).regex(/^\d+$/).optional().nullable(),
  duration_seconds: z.number().int().min(0).max(86400).optional().nullable(),
  position: z.number().int().min(0).max(1000),
  is_free_preview: z.boolean(),
});

export const adminUpsertLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => lessonInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: result, error } = await supabaseAdmin
      .from("lessons")
      .upsert(data, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { lesson: result };
  });

export const adminDeleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("lessons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("user_id, course_id, created_at, source, courses(title)")
      .order("created_at", { ascending: false })
      .limit(200);
    return { profiles: profiles ?? [], enrollments: enrollments ?? [] };
  });