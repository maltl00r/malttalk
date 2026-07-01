"use client";

import { useState, useEffect } from "react";

type Tab = "courses" | "topics" | "lessons" | "video" | "flashcards" | "dragdrop";
type LessonType = "video" | "flashcards" | "drag_drop";

interface Course {
  slug: string;
  id: number;
  title: string;
  description?: string;
}

interface Topic {
  id: number;
  slug: string;
  title: string;
  course_slug: string;
}

interface Lesson {
  id: number;
  uuid?: string;
  topic_id: number;
  type: LessonType;
  title: string;
}

const lessonTypeOptions: Array<{ value: LessonType; label: string }> = [
  { value: "video", label: "Video" },
  { value: "flashcards", label: "Flashcards" },
  { value: "drag_drop", label: "Drag & Drop" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Course Form
  const [courseForm, setCourseForm] = useState({ slug: "", title: "", description: "" });
  const [courses, setCourses] = useState<Course[]>([]);

  // Topic Form
  const [topicForm, setTopicForm] = useState({ slug: "", title: "", course_slug: "" });
  const [topics, setTopics] = useState<Topic[]>([]);

  // Lesson Form
  const [lessonForm, setLessonForm] = useState({ topic_id: "", type: "video", title: "" });
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Video Content Form
  const [videoForm, setVideoForm] = useState({ lesson_id: "", url: "", description: "" });

  // Flashcard Form
  const [flashcardForm, setFlashcardForm] = useState({
    lesson_id: "",
    front_image: "",
    back_title: "",
    back_pronunciation: "",
    lang: "en-US",
  });

  // Drag-drop Form
  const [dragdropForm, setDragdropForm] = useState({
    lesson_id: "",
    text: "",
    category: "",
    feedback_message_wrong: "",
  });

  // Load initial data
  useEffect(() => {
    loadCourses();
    loadTopics();
    loadLessons();
  }, []);

  const getLessonsForContentType = (contentType: "video" | "flashcards" | "dragdrop") => {
    const expectedType: LessonType =
      contentType === "dragdrop" ? "drag_drop" : contentType === "flashcards" ? "flashcards" : "video";

    return lessons.filter((lesson) => lesson.type === expectedType);
  };

  const loadCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const loadTopics = async (courseSlug?: string) => {
    try {
      const url = courseSlug ? `/api/admin/topics?courseSlug=${courseSlug}` : "/api/admin/topics";
      const res = await fetch(url);
      const data = await res.json();
      setTopics(data);
    } catch (error) {
      console.error("Error loading topics:", error);
    }
  };

  const loadLessons = async (topicId?: string) => {
    try {
      const url = topicId ? `/api/admin/lessons?topicId=${topicId}` : "/api/admin/lessons";
      const res = await fetch(url);
      const data = await res.json();
      setLessons(data);
    } catch (error) {
      console.error("Error loading lessons:", error);
    }
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Course handlers
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });
      if (res.ok) {
        showMessage("Curso creado exitosamente");
        setCourseForm({ slug: "", title: "", description: "" });
        loadCourses();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear curso", "error");
    } finally {
      setLoading(false);
    }
  };

  // Topic handlers
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicForm),
      });
      if (res.ok) {
        showMessage("Tema creado exitosamente");
        setTopicForm({ slug: "", title: "", course_slug: "" });
        loadTopics(topicForm.course_slug);
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear tema", "error");
    } finally {
      setLoading(false);
    }
  };

  // Lesson handlers
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const topicId = lessonForm.topic_id.trim();
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: Number(topicId),
          type: lessonForm.type,
          title: lessonForm.title.trim(),
        }),
      });
      if (res.ok) {
        showMessage("Lección creada exitosamente");
        setLessonForm({ topic_id: "", type: "video", title: "" });
        loadLessons(topicId);
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear lección", "error");
    } finally {
      setLoading(false);
    }
  };

  // Video Content handlers
  const handleCreateVideoContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/video-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: parseInt(videoForm.lesson_id),
          url: videoForm.url,
          description: videoForm.description,
        }),
      });
      if (res.ok) {
        showMessage("Contenido de video creado exitosamente");
        setVideoForm({ lesson_id: "", url: "", description: "" });
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear contenido de video", "error");
    } finally {
      setLoading(false);
    }
  };

  // Flashcard handlers
  const handleCreateFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/flashcard-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: parseInt(flashcardForm.lesson_id),
          front_image: flashcardForm.front_image,
          back_title: flashcardForm.back_title,
          back_pronunciation: flashcardForm.back_pronunciation,
          lang: flashcardForm.lang,
        }),
      });
      if (res.ok) {
        showMessage("Flashcard creada exitosamente");
        setFlashcardForm({
          lesson_id: "",
          front_image: "",
          back_title: "",
          back_pronunciation: "",
          lang: "en-US",
        });
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear flashcard", "error");
    } finally {
      setLoading(false);
    }
  };

  // Drag-drop handlers
  const handleCreateDragdrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drag-drop-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: parseInt(dragdropForm.lesson_id),
          text: dragdropForm.text,
          category: dragdropForm.category,
          feedback_message_wrong: dragdropForm.feedback_message_wrong,
        }),
      });
      if (res.ok) {
        showMessage("Elemento drag-drop creado exitosamente");
        setDragdropForm({
          lesson_id: "",
          text: "",
          category: "",
          feedback_message_wrong: "",
        });
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear elemento drag-drop", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Gradient decorations */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[100px] mix-blend-screen" />
      <div className="pointer-events-none absolute top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-2">
            Panel Administrativo
          </h1>
          <p className="text-slate-400 text-lg">Crear y gestionar contenido educativo</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg backdrop-blur-sm border ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/30"
                : "bg-red-500/10 text-red-200 border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700/50 backdrop-blur-sm">
          {[
            { id: "courses" as Tab, label: "📚 Cursos" },
            { id: "topics" as Tab, label: "📑 Temas" },
            { id: "lessons" as Tab, label: "📖 Lecciones" },
            { id: "video" as Tab, label: "🎬 Videos" },
            { id: "flashcards" as Tab, label: "🎴 Flashcards" },
            { id: "dragdrop" as Tab, label: "🎯 Drag-Drop" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-primary-start border-b-2 border-primary-start"
                  : "text-slate-400 hover:text-slate-300 border-b-2 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
          {/* Courses */}
          {activeTab === "courses" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-6">
                Crear Curso
              </h2>
              <form onSubmit={handleCreateCourse} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
                  <input
                    type="text"
                    value={courseForm.slug}
                    onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="english"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Inglés"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Descripción del curso"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Curso"}
                </button>
              </form>

              {courses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Cursos Existentes</h3>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <div key={course.slug} className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:border-slate-600/50 transition-colors">
                        <p className="font-semibold text-slate-100">{course.title}</p>
                        <p className="text-sm text-slate-400">{course.slug}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Topics */}
          {activeTab === "topics" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-6">
                Crear Tema
              </h2>
              <form onSubmit={handleCreateTopic} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Curso
                  </label>
                  <select
                    value={topicForm.course_slug}
                    onChange={(e) => {
                      setTopicForm({ ...topicForm, course_slug: e.target.value });
                      loadTopics(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 focus:border-primary-start focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Selecciona un curso</option>
                    {courses.map((course) => (
                      <option key={course.slug} value={course.slug}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
                  <input
                    type="text"
                    value={topicForm.slug}
                    onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="to-be"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
                  <input
                    type="text"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="El Verbo To Be"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Tema"}
                </button>
              </form>

              {topics.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Temas Existentes</h3>
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <div key={topic.id} className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:border-slate-600/50 transition-colors">
                        <p className="font-semibold text-slate-100">{topic.title}</p>
                        <p className="text-sm text-slate-400">{topic.slug}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lessons */}
          {activeTab === "lessons" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-6">
                Crear Lección
              </h2>
              <form onSubmit={handleCreateLesson} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tema</label>
                  <select
                    value={lessonForm.topic_id}
                    onChange={(e) => {
                      setLessonForm({ ...lessonForm, topic_id: e.target.value });
                      loadLessons(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 focus:border-primary-start focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Selecciona un tema</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as LessonType })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 focus:border-primary-start focus:outline-none transition-colors"
                    required
                  >
                    {lessonTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Título de la lección"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Lección"}
                </button>
              </form>

              {lessons.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Lecciones Existentes</h3>
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:border-slate-600/50 transition-colors">
                        <p className="font-semibold text-slate-100">{lesson.title}</p>
                        <p className="text-sm text-slate-400">
                          ID: {lesson.id} | Tipo: {lesson.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Content */}
          {activeTab === "video" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-6">
                Crear Contenido de Video
              </h2>
              <form onSubmit={handleCreateVideoContent} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Lección
                  </label>
                  <select
                    value={videoForm.lesson_id}
                    onChange={(e) => setVideoForm({ ...videoForm, lesson_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 focus:border-primary-start focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Selecciona una lección</option>
                    {getLessonsForContentType("video").map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title} (ID: {lesson.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL del Video
                  </label>
                  <input
                    type="text"
                    value={videoForm.url}
                    onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Descripción del video (soporta Markdown)"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Contenido de Video"}
                </button>
              </form>
            </div>
          )}

          {/* Flashcards */}
          {activeTab === "flashcards" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-6">
                Crear Flashcard
              </h2>
              <form onSubmit={handleCreateFlashcard} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Lección
                  </label>
                  <select
                    value={flashcardForm.lesson_id}
                    onChange={(e) =>
                      setFlashcardForm({ ...flashcardForm, lesson_id: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 focus:border-primary-start focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Selecciona una lección</option>
                    {getLessonsForContentType("flashcards").map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title} (ID: {lesson.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Imagen Frontal (URL)
                  </label>
                  <input
                    type="text"
                    value={flashcardForm.front_image}
                    onChange={(e) =>
                      setFlashcardForm({ ...flashcardForm, front_image: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Título/Palabra
                  </label>
                  <input
                    type="text"
                    value={flashcardForm.back_title}
                    onChange={(e) =>
                      setFlashcardForm({ ...flashcardForm, back_title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Palabra o frase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pronunciación (IPA)
                  </label>
                  <input
                    type="text"
                    value={flashcardForm.back_pronunciation}
                    onChange={(e) =>
                      setFlashcardForm({
                        ...flashcardForm,
                        back_pronunciation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="/wɜrd/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Idioma</label>
                  <input
                    type="text"
                    value={flashcardForm.lang}
                    onChange={(e) =>
                      setFlashcardForm({ ...flashcardForm, lang: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="en-US"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Flashcard"}
                </button>
              </form>
            </div>
          )}

          {/* Drag-Drop */}
          {activeTab === "dragdrop" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent mb-6">
                Crear Elemento Drag-Drop
              </h2>
              <form onSubmit={handleCreateDragdrop} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Lección
                  </label>
                  <select
                    value={dragdropForm.lesson_id}
                    onChange={(e) =>
                      setDragdropForm({ ...dragdropForm, lesson_id: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 focus:border-primary-start focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Selecciona una lección</option>
                    {getLessonsForContentType("dragdrop").map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title} (ID: {lesson.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Texto</label>
                  <input
                    type="text"
                    value={dragdropForm.text}
                    onChange={(e) =>
                      setDragdropForm({ ...dragdropForm, text: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Palabra o frase para clasificar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={dragdropForm.category}
                    onChange={(e) =>
                      setDragdropForm({ ...dragdropForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Categoría correcta"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Mensaje de Feedback (opcional)
                  </label>
                  <textarea
                    value={dragdropForm.feedback_message_wrong}
                    onChange={(e) =>
                      setDragdropForm({
                        ...dragdropForm,
                        feedback_message_wrong: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Mensaje si se clasifica incorrectamente"
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Elemento Drag-Drop"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
