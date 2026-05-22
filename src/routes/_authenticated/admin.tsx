import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminListCourses,
  adminListStudents,
  adminUpsertCourse,
  adminDeleteCourse,
  adminGetCourse,
  adminUpsertLesson,
  adminDeleteLesson,
} from "@/lib/admin.functions";
import { getMyContext } from "@/lib/auth.functions";

const coursesQ = queryOptions({ queryKey: ["admin-courses"], queryFn: () => adminListCourses() });
const studentsQ = queryOptions({ queryKey: ["admin-students"], queryFn: () => adminListStudents() });

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const me = await getMyContext();
    if (!me.isAdmin) throw redirect({ to: "/dashboard" });
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(coursesQ),
      context.queryClient.ensureQueryData(studentsQ),
    ]),
  head: () => ({ meta: [{ title: "Admin — Skillnex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"courses" | "students">("courses");
  const [editingId, setEditingId] = useState<string | null>(null);

  if (editingId) return <CourseEditor courseId={editingId} onClose={() => setEditingId(null)} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/admin" className="font-serif italic text-xl">Skillnex Admin</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Exit admin</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-8">
          {(["courses", "students"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                tab === t ? "bg-foreground text-background" : "ring-1 ring-border hover:bg-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "courses" ? <CoursesTab onEdit={setEditingId} /> : <StudentsTab />}
      </main>
    </div>
  );
}

function CoursesTab({ onEdit }: { onEdit: (id: string) => void }) {
  const { data } = useSuspenseQuery(coursesQ);
  const qc = useQueryClient();
  const upsert = useServerFn(adminUpsertCourse);
  const del = useServerFn(adminDeleteCourse);
  const [creating, setCreating] = useState(false);

  if (creating) {
    return (
      <CourseForm
        initial={{ slug: "", title: "", price_cents: 0, published: false }}
        onSave={async (vals) => {
          try {
            const res = await upsert({ data: vals });
            toast.success("Course created");
            setCreating(false);
            await qc.invalidateQueries({ queryKey: ["admin-courses"] });
            onEdit(res.course!.id);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed");
          }
        }}
        onCancel={() => setCreating(false)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif italic">Courses</h1>
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium">
          + New course
        </button>
      </div>
      <div className="space-y-2">
        {data.courses.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 rounded-xl ring-1 ring-border">
            <div>
              <p className="font-medium">{c.title} <span className="text-xs text-muted-foreground">/{c.slug}</span></p>
              <p className="text-xs text-muted-foreground">
                {c.published ? "Published" : "Draft"} · ${(c.price_cents / 100).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(c.id)} className="px-3 py-1.5 text-sm ring-1 ring-border rounded-full hover:bg-secondary">Edit</button>
              <button
                onClick={async () => {
                  if (!confirm("Delete this course?")) return;
                  await del({ data: { id: c.id } });
                  toast.success("Deleted");
                  qc.invalidateQueries({ queryKey: ["admin-courses"] });
                }}
                className="px-3 py-1.5 text-sm text-destructive rounded-full hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentsTab() {
  const { data } = useSuspenseQuery(studentsQ);
  return (
    <div>
      <h1 className="text-3xl font-serif italic mb-6">Students & enrollments</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-medium mb-3">Students ({data.profiles.length})</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {data.profiles.map((p) => (
              <div key={p.id} className="p-3 rounded-lg ring-1 ring-border text-sm">
                <p className="font-medium">{p.full_name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{p.email}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-medium mb-3">Recent enrollments ({data.enrollments.length})</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {data.enrollments.map((e, i) => (
              <div key={i} className="p-3 rounded-lg ring-1 ring-border text-sm">
                <p className="font-medium">{e.courses?.title}</p>
                <p className="text-xs text-muted-foreground">{e.source} · {new Date(e.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

type CourseVals = {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  category?: string | null;
  level?: string | null;
  price_cents: number;
  published: boolean;
};

function CourseForm({ initial, onSave, onCancel }: { initial: CourseVals; onSave: (v: CourseVals) => void; onCancel: () => void }) {
  const [v, setV] = useState<CourseVals>(initial);
  return (
    <div className="max-w-2xl mx-auto p-8 ring-1 ring-border rounded-xl">
      <h2 className="text-2xl font-serif italic mb-6">{v.id ? "Edit course" : "New course"}</h2>
      <div className="space-y-3">
        <Field label="Title"><input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} className="input" /></Field>
        <Field label="Slug (URL)"><input value={v.slug} onChange={(e) => setV({ ...v, slug: e.target.value.toLowerCase() })} className="input" placeholder="creator-program" /></Field>
        <Field label="Subtitle"><input value={v.subtitle ?? ""} onChange={(e) => setV({ ...v, subtitle: e.target.value })} className="input" /></Field>
        <Field label="Description"><textarea value={v.description ?? ""} onChange={(e) => setV({ ...v, description: e.target.value })} className="input min-h-32" /></Field>
        <Field label="Cover image URL"><input value={v.cover_image_url ?? ""} onChange={(e) => setV({ ...v, cover_image_url: e.target.value })} className="input" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category"><input value={v.category ?? ""} onChange={(e) => setV({ ...v, category: e.target.value })} className="input" /></Field>
          <Field label="Level"><input value={v.level ?? ""} onChange={(e) => setV({ ...v, level: e.target.value })} className="input" placeholder="Beginner" /></Field>
        </div>
        <Field label="Price (USD)">
          <input type="number" min={0} value={v.price_cents / 100} onChange={(e) => setV({ ...v, price_cents: Math.round(Number(e.target.value) * 100) })} className="input" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={v.published} onChange={(e) => setV({ ...v, published: e.target.checked })} /> Published
        </label>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(v)} className="px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium">Save</button>
        <button onClick={onCancel} className="px-5 py-2.5 ring-1 ring-border rounded-full text-sm">Cancel</button>
      </div>
      <style>{`.input{width:100%;padding:.6rem .75rem;border-radius:.5rem;background:transparent;outline:1px solid var(--color-border);}.input:focus{outline-color:var(--color-foreground);}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CourseEditor({ courseId, onClose }: { courseId: string; onClose: () => void }) {
  const detailQ = queryOptions({ queryKey: ["admin-course", courseId], queryFn: () => adminGetCourse({ data: { id: courseId } }) });
  const { data } = useSuspenseQuery(detailQ);
  const qc = useQueryClient();
  const upsertCourse = useServerFn(adminUpsertCourse);
  const upsertLesson = useServerFn(adminUpsertLesson);
  const deleteLesson = useServerFn(adminDeleteLesson);
  const course = data.course!;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">← Back to admin</button>
          <span className="font-serif italic">{course.title}</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <CourseForm
          initial={{
            id: course.id,
            slug: course.slug,
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            cover_image_url: course.cover_image_url,
            category: course.category,
            level: course.level,
            price_cents: course.price_cents,
            published: course.published,
          }}
          onSave={async (vals) => {
            try {
              await upsertCourse({ data: vals });
              toast.success("Saved");
              qc.invalidateQueries({ queryKey: ["admin-course", courseId] });
              qc.invalidateQueries({ queryKey: ["admin-courses"] });
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed");
            }
          }}
          onCancel={onClose}
        />

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif italic">Lessons</h2>
            <button
              onClick={async () => {
                await upsertLesson({
                  data: {
                    course_id: courseId,
                    title: "New lesson",
                    position: data.lessons.length,
                    is_free_preview: false,
                  },
                });
                qc.invalidateQueries({ queryKey: ["admin-course", courseId] });
              }}
              className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium"
            >
              + Add lesson
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Tip: Vimeo video ID is the number from the URL (e.g. https://vimeo.com/<b>76979871</b>). Configure domain restriction in your Vimeo Pro dashboard.
          </p>
          <div className="space-y-3">
            {data.lessons.map((l) => (
              <LessonRow
                key={l.id}
                lesson={l}
                onSave={async (vals) => {
                  await upsertLesson({ data: vals });
                  qc.invalidateQueries({ queryKey: ["admin-course", courseId] });
                }}
                onDelete={async () => {
                  if (!confirm("Delete lesson?")) return;
                  await deleteLesson({ data: { id: l.id } });
                  qc.invalidateQueries({ queryKey: ["admin-course", courseId] });
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function LessonRow({
  lesson,
  onSave,
  onDelete,
}: {
  lesson: { id: string; course_id: string; title: string; description: string | null; vimeo_video_id: string | null; duration_seconds: number | null; position: number; is_free_preview: boolean };
  onSave: (vals: { id: string; course_id: string; title: string; description?: string | null; vimeo_video_id?: string | null; position: number; is_free_preview: boolean }) => Promise<void>;
  onDelete: () => void;
}) {
  const [v, setV] = useState(lesson);
  return (
    <div className="p-4 rounded-xl ring-1 ring-border space-y-3">
      <div className="grid md:grid-cols-[1fr_180px_120px_auto] gap-3 items-center">
        <input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder="Lesson title" className="input" />
        <input value={v.vimeo_video_id ?? ""} onChange={(e) => setV({ ...v, vimeo_video_id: e.target.value.replace(/\D/g, "") })} placeholder="Vimeo ID (digits)" className="input" />
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={v.is_free_preview} onChange={(e) => setV({ ...v, is_free_preview: e.target.checked })} />
          Free preview
        </label>
        <div className="flex gap-2 justify-end">
          <button onClick={() => onSave({ id: v.id, course_id: v.course_id, title: v.title, description: v.description, vimeo_video_id: v.vimeo_video_id || null, position: v.position, is_free_preview: v.is_free_preview })} className="px-3 py-1.5 text-sm bg-foreground text-background rounded-full">Save</button>
          <button onClick={onDelete} className="px-3 py-1.5 text-sm text-destructive rounded-full hover:bg-destructive/10">Delete</button>
        </div>
      </div>
      <textarea value={v.description ?? ""} onChange={(e) => setV({ ...v, description: e.target.value })} placeholder="Description" className="input min-h-16 w-full" />
    </div>
  );
}