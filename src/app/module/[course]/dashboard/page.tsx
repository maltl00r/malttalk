import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCourseBySlug, fetchModulesForCourse } from "@/app/actions/modules";

interface DashboardPageProps {
  params: Promise<{ course: string }>;
}

// Emojis para diferentes tipos de lecciones
const LESSON_ICONS = {
  video: "🎬",
  flashcards: "🎴",
  drag_drop: "🎯",
  reading: "📖",
  visio_acoustic: "🎵",
};

// Colores por tipo de lección
const LESSON_COLORS = {
  video: {
    bg: "from-violet-600 to-violet-700",
    light: "from-violet-100 to-violet-200",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700",
  },
  flashcards: {
    bg: "from-amber-600 to-amber-700",
    light: "from-amber-100 to-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
  drag_drop: {
    bg: "from-emerald-600 to-emerald-700",
    light: "from-emerald-100 to-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
  reading: {
    bg: "from-blue-600 to-blue-700",
    light: "from-blue-100 to-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  visio_acoustic: {
    bg: "from-pink-600 to-rose-700",
    light: "from-pink-100 to-rose-200",
    text: "text-pink-700",
    badge: "bg-pink-100 text-pink-700",
  },
};

export default async function CourseDashboardPage({ params }: DashboardPageProps) {
  const { course } = await params;
  const courseData = await fetchCourseBySlug(course);

  if (!courseData) {
    notFound();
  }

  const modules = await fetchModulesForCourse(course);
  
  // Calcular estadísticas
  const totalLessons = modules && modules.topics ? modules.topics.reduce((sum, topic) => sum + topic.lessons.length, 0) : 0;
  const totalTopics = modules && modules.topics ? modules.topics.length : 0;
  const progressPercentage = 0; // En el futuro se puede tracking de progreso real

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        
        {/* HEADER ATRACTIVO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 p-8 md:p-12 shadow-2xl">
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full -ml-36 -mb-36"></div>
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-2">
                  🎓 Tu Curso de Aprendizaje
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{courseData.title}</h1>
                <p className="text-blue-50 text-lg max-w-2xl">
                  {courseData.description || "Comienza tu viaje de aprendizaje hoy mismo"}
                </p>
              </div>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm font-semibold">📚 Temas</p>
                <p className="text-3xl font-bold text-white mt-1">{totalTopics}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm font-semibold">🎯 Lecciones</p>
                <p className="text-3xl font-bold text-white mt-1">{totalLessons}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm font-semibold">⚡ Progreso</p>
                <p className="text-3xl font-bold text-white mt-1">{progressPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESO GENERAL */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-600/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tu Progreso General</h2>
            <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            ¡Continúa aprendiendo! Cada lección te acerca más a tu objetivo. 🚀
          </p>
        </div>

        {/* SECCIÓN DE TEMAS Y LECCIONES */}
        <div className="space-y-8">
          {modules && modules.topics && modules.topics.map((topic, topicIndex) => (
            <section key={topic.id} className="space-y-4">
              {/* Encabezado del tema con badge */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-3 text-white text-xl">
                      {String(topicIndex + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {topic.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {topic.lessons.length} {topic.lessons.length === 1 ? "lección" : "lecciones"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Comienza en</p>
                  <p className="text-2xl font-bold text-blue-600">30 min</p>
                </div>
              </div>

              {/* Grilla de lecciones */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topic.lessons.map((lesson) => {
                  const lessonRoute =
                    lesson.type === "drag_drop"
                      ? "drag-drop"
                      : lesson.type === "flashcards"
                        ? "flashcards"
                        : lesson.type === "reading"
                          ? "reading"
                          : lesson.type === "visio_acoustic"
                            ? "visio-acoustic"
                            : "video";

                  const colors = LESSON_COLORS[lesson.type as keyof typeof LESSON_COLORS] || LESSON_COLORS.video;
                  const icon = LESSON_ICONS[lesson.type as keyof typeof LESSON_ICONS] || "📚";

                  const lessonTypeLabel = 
                    lesson.type === "drag_drop" ? "Interactivo"
                    : lesson.type === "video" ? "Video"
                    : lesson.type === "flashcards" ? "Tarjetas"
                    : lesson.type === "reading" ? "Lectura"
                    : lesson.type === "visio_acoustic" ? "Quiz Audio"
                    : "Contenido";

                  return (
                    <Link
                      key={lesson.id}
                      href={`/module/${course}/${lessonRoute}?id=${lesson.uuid}`}
                      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      {/* Fondo gradiente */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`}></div>
                      
                      {/* Patrón decorativo */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                      </div>

                      {/* Contenido */}
                      <div className="relative p-6 h-full flex flex-col justify-between">
                        <div>
                          {/* Icono y tipo */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">{icon}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge} backdrop-blur-sm bg-opacity-80`}>
                              {lessonTypeLabel}
                            </span>
                          </div>
                          
                          {/* Título */}
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:translate-y-0 transition-transform">
                            {lesson.title}
                          </h3>
                          
                          {/* Descripción */}
                          <p className="text-white/80 text-sm mb-4">
                            Aprende de forma {lesson.type === "video" ? "visual" : lesson.type === "flashcards" ? "interactiva" : "inmersiva"}
                          </p>
                        </div>

                        {/* Pie con CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/30">
                          <span className="text-white/70 text-sm font-semibold">⏱️ ~10 min</span>
                          <span className="text-white font-bold text-lg transform group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </div>

                      {/* Efecto hover overlay */}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* SECCIÓN DE CONSEJOS Y MOTIVACIÓN */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-8 border-2 border-amber-200/50 dark:border-amber-700/50">
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Consejo de Aprendizaje</h3>
                <p className="text-amber-800 dark:text-amber-200">
                  Dedica 30 minutos diarios a una sola lección. La consistencia es la clave para dominar un nuevo idioma.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 border-2 border-green-200/50 dark:border-green-700/50">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎯</span>
              <div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Tu Meta Hoy</h3>
                <p className="text-green-800 dark:text-green-200">
                  Completa al menos una lección hoy. ¡Cada paso te acerca a tu objetivo! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN FLOTANTE */}
        <div className="flex justify-center mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full p-1 shadow-2xl">
            <button className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform duration-200">
              📖 Comenzar Primera Lección
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
