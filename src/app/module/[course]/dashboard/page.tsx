import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCourseBySlug, fetchModulesForCourse } from "@/app/actions/modules";

interface DashboardPageProps {
  params: Promise<{ course: string }>;
}

export default async function CourseDashboardPage({ params }: DashboardPageProps) {
  const { course } = await params;
  const courseData = await fetchCourseBySlug(course);

  if (!courseData) {
    notFound();
  }

  const modules = await fetchModulesForCourse(course);

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Dashboard del curso
          </p>
          <h1 className="text-4xl font-bold text-white">{courseData.title}</h1>
          <p className="max-w-2xl text-zinc-400">
            {courseData.description || "Explora los módulos disponibles para este curso."}
          </p>
        </div>

        <div className="space-y-6">
          {modules.topics.map((topic) => (
            <section
              key={topic.id}
              className="rounded-2xl border border-white/10 bg-[#151532] p-6 shadow-lg shadow-black/20"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
                <p className="text-sm text-zinc-400">{topic.lessons.length} lecciones disponibles</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {topic.lessons.map((lesson) => {
                  const lessonRoute =
                    lesson.type === "drag_drop"
                      ? "drag-drop"
                      : lesson.type === "flashcards"
                        ? "flashcards"
                        : lesson.type === "reading"
                          ? "reading"
                          : "video";

                  return (
                    <Link
                      key={lesson.id}
                      href={`/module/${course}/${lessonRoute}?id=${lesson.uuid}`}
                      className="rounded-xl border border-white/10 bg-[#1f1f3f] p-4 transition hover:border-cyan-400/50 hover:bg-[#25254a]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{lesson.title}</h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {lesson.type === "video"
                              ? "Video"
                              : lesson.type === "flashcards"
                                ? "Flashcards"
                                : "Drag & Drop"}
                          </p>
                        </div>
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                          {lesson.type === "drag_drop" ? "drag-drop" : lesson.type}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
