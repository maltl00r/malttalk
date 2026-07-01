import Link from "next/link";
import { fetchCourses } from "@/app/actions/modules";

export default async function CoursesPage() {
  const courses = await fetchCourses();

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Cursos disponibles
          </p>
          <h1 className="text-4xl font-bold text-white">Explora tus cursos</h1>
          <p className="max-w-2xl text-zinc-400">
            Elige un curso para ver los módulos y lecciones disponibles en la base de datos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const lessonCount = course.topics.reduce(
              (total, topic) => total + topic.lessons.length,
              0
            );

            return (
              <Link
                key={course.slug}
                href={`/module/${course.slug}/dashboard`}
                className="group rounded-2xl border border-white/10 bg-[#151532] p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      {course.description || "Curso disponible en MaltTalk"}
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    {lessonCount} módulos
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
                  <span>Ver contenido</span>
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
