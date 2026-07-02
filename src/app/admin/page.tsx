"use client";

import { useState, useEffect } from "react";

type Tab = "courses" | "tags" | "topics" | "lessons" | "glossary";
type LessonType = "video" | "flashcards" | "drag_drop" | "reading" | "visio_acoustic" | "writing_challenges" | "mental_agility" | "closing_exam" | "grammar_guides" | "listening" | "icebreaker";

interface Course {
  slug: string;
  id: number;
  title: string;
  description?: string;
}

interface Tag {
  id: number;
  slug: string;
  name: string;
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

interface ReadingContent {
  id: number;
  lesson_id: number;
  text: string;
}

interface GlossaryItem {
  id: number;
  reading_id: number;
  word: string;
  definition: string;
  image_url?: string;
  synonym_english?: string;
  reading_contents?: ReadingContent & { lessons?: Lesson };
}

const lessonTypeOptions: Array<{ value: LessonType; label: string }> = [
  { value: "video", label: "Video" },
  { value: "flashcards", label: "Flashcards" },
  { value: "drag_drop", label: "Drag & Drop" },
  { value: "reading", label: "Lecturas Inmersivas" },
  { value: "visio_acoustic", label: "Audio-Visual Diagnostic" },
  { value: "writing_challenges", label: "Writing Challenges" },
  { value: "mental_agility", label: "Mental Agility" },
  { value: "closing_exam", label: "Closing Exam" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Course Form & Data
  const [courseForm, setCourseForm] = useState({ slug: "", title: "", description: "" });
  const [courses, setCourses] = useState<Course[]>([]);

  // Tag Form & Data
  const [tagForm, setTagForm] = useState({ slug: "", name: "" });
  const [tags, setTags] = useState<Tag[]>([]);

  // Topic Form & Data
  const [topicForm, setTopicForm] = useState({ slug: "", title: "", course_slug: "" });
  const [topics, setTopics] = useState<Topic[]>([]);

  // Lesson Form & Data
  const [lessonForm, setLessonForm] = useState({ topic_id: "", type: "video" as LessonType, title: "", tag_ids: [] as number[] });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType>("video");

  // Content Forms
  const [videoForm, setVideoForm] = useState({ lesson_id: "", url: "", description: "" });
  const [flashcardForm, setFlashcardForm] = useState({
    lesson_id: "",
    front_image: "",
    back_title: "",
    back_pronunciation: "",
    lang: "en-US",
  });
  const [dragdropForm, setDragdropForm] = useState({
    lesson_id: "",
    text: "",
    category: "",
    feedback_message_wrong: "",
  });
  const [readingForm, setReadingForm] = useState({
    lesson_id: "",
    text: "",
  });
  const [glossaryForm, setGlossaryForm] = useState({
    reading_id: "",
    word: "",
    definition: "",
    image_url: "",
    synonym_english: "",
  });
  const [glossaryItems, setGlossaryItems] = useState<GlossaryItem[]>([]);
  const [editingGlossaryItem, setEditingGlossaryItem] = useState<GlossaryItem | null>(null);
  const [editGlossaryForm, setEditGlossaryForm] = useState({
    word: "",
    definition: "",
    image_url: "",
    synonym_english: "",
  });
  const [readingContents, setReadingContents] = useState<ReadingContent[]>([]);

  // Edit states
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editCourseForm, setEditCourseForm] = useState({ slug: "", title: "", description: "" });

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagForm, setEditTagForm] = useState({ slug: "", name: "" });

  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTopicForm, setEditTopicForm] = useState({ slug: "", title: "", course_slug: "" });

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editLessonForm, setEditLessonForm] = useState({ topic_id: "", type: "video" as LessonType, title: "", tag_ids: [] as number[] });

  // Load initial data
  useEffect(() => {
    loadCourses();
    loadTags();
    loadTopics();
    loadLessons();
    loadGlossaryItems();
  }, []);

  const getLessonsForContentType = (contentType: LessonType) => {
    return lessons.filter((lesson) => lesson.type === contentType);
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

  const loadTags = async () => {
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading tags:", error);
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

  const loadReadingContents = async (lessonId?: string) => {
    if (!lessonId) {
      setReadingContents([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/reading-contents/list?lessonId=${lessonId}`);
      if (!res.ok) {
        setReadingContents([]);
        return;
      }
      const data = await res.json();
      setReadingContents(data);
    } catch (error) {
      console.error("Error loading reading contents:", error);
      setReadingContents([]);
    }
  };

  const loadGlossaryItems = async () => {
    try {
      const res = await fetch("/api/admin/glossary-items");
      if (!res.ok) return;
      const data = await res.json();
      setGlossaryItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading glossary items:", error);
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

  // Edit handlers
  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editingCourse.slug,
          newSlug: editCourseForm.slug,
          title: editCourseForm.title,
          description: editCourseForm.description,
        }),
      });
      if (res.ok) {
        showMessage("Curso actualizado exitosamente");
        setEditingCourse(null);
        loadCourses();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al actualizar curso", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTag.id,
          slug: editTagForm.slug,
          name: editTagForm.name,
        }),
      });
      if (res.ok) {
        showMessage("Etiqueta actualizada exitosamente");
        setEditingTag(null);
        loadTags();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al actualizar etiqueta", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTopic.id,
          slug: editTopicForm.slug,
          title: editTopicForm.title,
          course_slug: editTopicForm.course_slug,
        }),
      });
      if (res.ok) {
        showMessage("Tema actualizado exitosamente");
        setEditingTopic(null);
        loadTopics();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al actualizar tema", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingLesson.id,
          topic_id: parseInt(editLessonForm.topic_id),
          type: editLessonForm.type,
          title: editLessonForm.title,
          tag_ids: editLessonForm.tag_ids,
        }),
      });
      if (res.ok) {
        showMessage("Lección actualizada exitosamente");
        setEditingLesson(null);
        setEditLessonForm({ topic_id: "", type: "video", title: "", tag_ids: [] });
        loadLessons();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al actualizar lección", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseSlug: string, courseTitle: string) => {
    if (!confirm(`⚠️ ATENCIÓN: Esto eliminará el curso "${courseTitle}" y TODO su contenido (temas, lecciones, videos, etc.). ¿Estás seguro?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses?slug=${courseSlug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("Curso eliminado exitosamente");
        loadCourses();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al eliminar curso", "error");
    } finally {
      setLoading(false);
    }
  };

  // Tag handlers
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagForm),
      });
      if (res.ok) {
        showMessage("Etiqueta creada exitosamente");
        setTagForm({ slug: "", name: "" });
        loadTags();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear etiqueta", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: number, tagName: string) => {
    if (!confirm(`¿Eliminar la etiqueta "${tagName}"?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tags?id=${tagId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("Etiqueta eliminada exitosamente");
        loadTags();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al eliminar etiqueta", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    if (!confirm("¿Estás seguro que deseas eliminar este tema? Se eliminarán todas sus lecciones.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/topics?id=${topicId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("Tema eliminado exitosamente");
        loadTopics();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al eliminar tema", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("¿Estás seguro que deseas eliminar esta lección? Se eliminarán todos sus contenidos.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/lessons?id=${lessonId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("Lección eliminada exitosamente");
        loadLessons();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al eliminar lección", "error");
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
        body: JSON.stringify({
          slug: topicForm.slug,
          title: topicForm.title,
          course_slug: topicForm.course_slug,
        }),
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
          tag_ids: lessonForm.tag_ids,
        }),
      });
      if (res.ok) {
        showMessage("Lección creada exitosamente");
        setLessonForm({ topic_id: "", type: "video", title: "", tag_ids: [] });
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

  // Content creation handlers
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

  const handleCreateReadingContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reading-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: parseInt(readingForm.lesson_id),
          text: readingForm.text,
        }),
      });
      if (res.ok) {
        showMessage("Contenido de lectura creado exitosamente");
        setReadingForm({ lesson_id: "", text: "" });
        loadReadingContents(readingForm.lesson_id);
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear contenido de lectura", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGlossaryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/glossary-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reading_id: parseInt(glossaryForm.reading_id),
          word: glossaryForm.word,
          definition: glossaryForm.definition,
          image_url: glossaryForm.image_url,
          synonym_english: glossaryForm.synonym_english,
        }),
      });
      if (res.ok) {
        showMessage("Elemento de glosario creado exitosamente");
        setGlossaryForm({
          reading_id: glossaryForm.reading_id,
          word: "",
          definition: "",
          image_url: "",
          synonym_english: "",
        });
        loadGlossaryItems();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al crear elemento de glosario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGlossaryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGlossaryItem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/glossary-items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingGlossaryItem.id,
          word: editGlossaryForm.word,
          definition: editGlossaryForm.definition,
          image_url: editGlossaryForm.image_url,
          synonym_english: editGlossaryForm.synonym_english,
        }),
      });
      if (res.ok) {
        showMessage("Elemento de glosario actualizado exitosamente");
        setEditingGlossaryItem(null);
        setEditGlossaryForm({ word: "", definition: "", image_url: "", synonym_english: "" });
        loadGlossaryItems();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al actualizar elemento de glosario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGlossaryItem = async (itemId: number) => {
    if (!confirm("¿Estás seguro que deseas eliminar este elemento del glosario?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/glossary-items?id=${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("Elemento de glosario eliminado exitosamente");
        loadGlossaryItems();
      } else {
        const error = await res.json();
        showMessage(error.error, "error");
      }
    } catch (error) {
      showMessage("Error al eliminar elemento de glosario", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl dark:bg-blue-600/10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl dark:bg-blue-500/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-300 bg-clip-text text-transparent mb-3">
            Panel Administrativo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Gestión completa de cursos, temas, lecciones y contenido</p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg backdrop-blur-sm border animate-in slide-in-from-top-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border-emerald-500/30"
                : "bg-red-500/10 text-red-700 dark:text-red-200 border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-8 flex flex-wrap gap-1 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md rounded-xl p-2 border border-blue-200/50 dark:border-blue-500/20 shadow-lg">
          {[
            { id: "courses" as Tab, label: "📚 Cursos" },
            { id: "tags" as Tab, label: "🏷️ Etiquetas" },
            { id: "topics" as Tab, label: "📑 Temas" },
            { id: "lessons" as Tab, label: "📖 Lecciones" },
            { id: "glossary" as Tab, label: "📚 Glosario" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Container */}
        <div className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/30 dark:border-blue-500/20 shadow-2xl space-y-8">
          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-8">
                  Gestionar Cursos
                </h2>

                {/* Edit form */}
                {editingCourse && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-300/50 dark:border-blue-500/50 rounded-xl p-6 mb-8 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Editando: {editingCourse.title}</h4>
                      <button
                        onClick={() => setEditingCourse(null)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-bold text-2xl transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <form onSubmit={handleEditCourse} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                        <input
                          type="text"
                          value={editCourseForm.slug}
                          onChange={(e) => setEditCourseForm({ ...editCourseForm, slug: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Título</label>
                        <input
                          type="text"
                          value={editCourseForm.title}
                          onChange={(e) => setEditCourseForm({ ...editCourseForm, title: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                        <textarea
                          value={editCourseForm.description}
                          onChange={(e) => setEditCourseForm({ ...editCourseForm, description: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                          {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-6 py-3 bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <form onSubmit={handleCreateCourse} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-6 space-y-4 max-w-2xl mb-8 border border-blue-200/50 dark:border-blue-500/30 shadow-lg">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                    <input
                      type="text"
                      value={courseForm.slug}
                      onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="english"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Título</label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Inglés"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Descripción del curso"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-lg"
                  >
                    {loading ? "Creando..." : "Crear Curso"}
                  </button>
                </form>

                {courses.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Cursos Existentes</h3>
                    <div className="space-y-3">
                      {courses.map((course) => (
                        <div key={course.slug} className="p-5 bg-white dark:bg-slate-800/50 border-2 border-blue-200/50 dark:border-blue-500/30 rounded-lg flex justify-between items-start hover:shadow-lg transition-all group">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{course.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.slug}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingCourse(course);
                                setEditCourseForm({ slug: course.slug, title: course.title, description: course.description || "" });
                              }}
                              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-semibold text-sm rounded-lg transition-all"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.slug, course.title)}
                              disabled={loading}
                              className="px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 font-semibold text-sm rounded-lg transition-all"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-6">
                Gestionar Etiquetas
              </h2>

              {/* Edit form */}
              {editingTag && (
                <div className="bg-gradient-to-br from-primary-start/10 to-secondary-start/10 border border-primary-start/30 rounded-lg p-6 mb-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Editando: {editingTag.name}</h4>
                    <button
                      onClick={() => setEditingTag(null)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleEditTag} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                      <input
                        type="text"
                        value={editTagForm.slug}
                        onChange={(e) => setEditTagForm({ ...editTagForm, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={editTagForm.name}
                        onChange={(e) => setEditTagForm({ ...editTagForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTag(null)}
                        className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <form onSubmit={handleCreateTag} className="space-y-4 max-w-2xl mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                  <input
                    type="text"
                    value={tagForm.slug}
                    onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="beginner"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={tagForm.name}
                    onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="Principiante"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                >
                  {loading ? "Creando..." : "Crear Etiqueta"}
                </button>
              </form>

              {tags.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Etiquetas Existentes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {tags.map((tag) => (
                      <div key={tag.id} className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{tag.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tag.slug}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingTag(tag);
                              setEditTagForm({ slug: tag.slug, name: tag.name });
                            }}
                            className="px-2 py-1 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                            disabled={loading}
                            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition-colors"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Topics Tab */}
          {activeTab === "topics" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-6">
                Crear Tema
              </h2>
              <form onSubmit={handleCreateTopic} className="space-y-4 max-w-2xl mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Curso</label>
                  <select
                    value={topicForm.course_slug}
                    onChange={(e) => {
                      setTopicForm({ ...topicForm, course_slug: e.target.value });
                      loadTopics(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                  <input
                    type="text"
                    value={topicForm.slug}
                    onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                    placeholder="to-be"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                  <input
                    type="text"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temas Existentes</h3>
                  {editingTopic && (
                    <div className="bg-gradient-to-br from-primary-start/10 to-secondary-start/10 border border-primary-start/30 rounded-lg p-6 mb-6 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Editando: {editingTopic.title}</h4>
                        <button
                          onClick={() => setEditingTopic(null)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
                        >
                          ✕
                        </button>
                      </div>
                      <form onSubmit={handleEditTopic} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                          <input
                            type="text"
                            value={editTopicForm.slug}
                            onChange={(e) => setEditTopicForm({ ...editTopicForm, slug: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                          <input
                            type="text"
                            value={editTopicForm.title}
                            onChange={(e) => setEditTopicForm({ ...editTopicForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                          >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTopic(null)}
                            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <div key={topic.id} className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{topic.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{topic.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTopic(topic);
                              setEditTopicForm({ slug: topic.slug, title: topic.title, course_slug: topic.course_slug });
                            }}
                            className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            disabled={loading}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lessons Tab with Dynamic Content */}
          {activeTab === "lessons" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-6">
                Crear Lección y Contenido
              </h2>

              {/* Step 1: Create Lesson */}
              <div className="mb-8 p-4 border border-slate-600/30 rounded-lg bg-slate-800/10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Paso 1: Crear Lección</h3>
                <form onSubmit={handleCreateLesson} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
                    <select
                      value={lessonForm.topic_id}
                      onChange={(e) => {
                        setLessonForm({ ...lessonForm, topic_id: e.target.value });
                        loadLessons(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Lección</label>
                    <select
                      value={lessonForm.type}
                      onChange={(e) => {
                        const newType = e.target.value as LessonType;
                        setLessonForm({ ...lessonForm, type: newType });
                        setSelectedLessonType(newType);
                        // Reset content forms when switching lesson type
                        setVideoForm({ lesson_id: "", url: "", description: "" });
                        setFlashcardForm({ lesson_id: "", front_image: "", back_title: "", back_pronunciation: "", lang: "en-US" });
                        setDragdropForm({ lesson_id: "", text: "", category: "", feedback_message_wrong: "" });
                        setReadingForm({ lesson_id: "", text: "" });
                        setReadingContents([]);
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                      placeholder="Título de la lección"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Etiquetas (selecciona una o más)
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg max-h-40 overflow-y-auto">
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lessonForm.tag_ids.includes(tag.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setLessonForm({ ...lessonForm, tag_ids: [...lessonForm.tag_ids, tag.id] });
                                } else {
                                  setLessonForm({ ...lessonForm, tag_ids: lessonForm.tag_ids.filter(id => id !== tag.id) });
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-gray-900 dark:text-white text-sm">{tag.name}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm col-span-2">Crea etiquetas primero en la pestaña de Etiquetas</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                  >
                    {loading ? "Creando..." : "Crear Lección"}
                  </button>
                </form>
              </div>

              {lessons.length > 0 && (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lecciones Existentes</h3>
                    {editingLesson && (
                      <div className="bg-gradient-to-br from-primary-start/10 to-secondary-start/10 border border-primary-start/30 rounded-lg p-6 mb-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Editando: {editingLesson.title}</h4>
                          <button
                            onClick={() => setEditingLesson(null)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
                          >
                            ✕
                          </button>
                        </div>
                        <form onSubmit={handleEditLesson} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
                            <select
                              value={editLessonForm.topic_id}
                              onChange={(e) => setEditLessonForm({ ...editLessonForm, topic_id: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Lección</label>
                            <select
                              value={editLessonForm.type}
                              onChange={(e) => setEditLessonForm({ ...editLessonForm, type: e.target.value as LessonType })}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                            <input
                              type="text"
                              value={editLessonForm.title}
                              onChange={(e) => setEditLessonForm({ ...editLessonForm, title: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Etiquetas (selecciona una o más)
                            </label>
                            <div className="grid grid-cols-2 gap-2 p-3 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg max-h-40 overflow-y-auto">
                              {tags.length > 0 ? (
                                tags.map((tag) => (
                                  <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={editLessonForm.tag_ids.includes(tag.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEditLessonForm({ ...editLessonForm, tag_ids: [...editLessonForm.tag_ids, tag.id] });
                                        } else {
                                          setEditLessonForm({ ...editLessonForm, tag_ids: editLessonForm.tag_ids.filter(id => id !== tag.id) });
                                        }
                                      }}
                                      className="w-4 h-4"
                                    />
                                    <span className="text-gray-900 dark:text-white text-sm">{tag.name}</span>
                                  </label>
                                ))
                              ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm col-span-2">Crea etiquetas primero en la pestaña de Etiquetas</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                            >
                              {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingLesson(null)}
                              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{lesson.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {lesson.id} | Tipo: {lesson.type}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingLesson(lesson);
                                setEditLessonForm({ topic_id: lesson.topic_id.toString(), type: lesson.type, title: lesson.title, tag_ids: [] });
                              }}
                              className="px-2 py-1 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              disabled={loading}
                              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition-colors"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Add Content Based on Lesson Type */}
                  <div className="p-4 border border-slate-600/30 rounded-lg bg-slate-800/10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Paso 2: Agregar Contenido ({lessonTypeOptions.find(o => o.value === selectedLessonType)?.label})</h3>

                    {/* Video Content */}
                    {selectedLessonType === "video" && (
                      <form onSubmit={handleCreateVideoContent} className="space-y-4 max-w-2xl">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona la Lección</label>
                          <select
                            value={videoForm.lesson_id}
                            onChange={(e) => setVideoForm({ ...videoForm, lesson_id: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
                            required
                          >
                            <option value="">Selecciona una lección de video</option>
                            {getLessonsForContentType("video").map((lesson) => (
                              <option key={lesson.id} value={lesson.id}>
                                {lesson.title} (ID: {lesson.id})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL del Video</label>
                          <input
                            type="text"
                            value={videoForm.url}
                            onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="https://www.youtube.com/embed/..."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                          <textarea
                            value={videoForm.description}
                            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="Descripción del video"
                            rows={4}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                        >
                          {loading ? "Creando..." : "Crear Video"}
                        </button>
                      </form>
                    )}

                    {/* Flashcard Content */}
                    {selectedLessonType === "flashcards" && (
                      <form onSubmit={handleCreateFlashcard} className="space-y-4 max-w-2xl">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona la Lección</label>
                          <select
                            value={flashcardForm.lesson_id}
                            onChange={(e) => setFlashcardForm({ ...flashcardForm, lesson_id: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
                            required
                          >
                            <option value="">Selecciona una lección de flashcard</option>
                            {getLessonsForContentType("flashcards").map((lesson) => (
                              <option key={lesson.id} value={lesson.id}>
                                {lesson.title} (ID: {lesson.id})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen Frontal (URL)</label>
                          <input
                            type="text"
                            value={flashcardForm.front_image}
                            onChange={(e) => setFlashcardForm({ ...flashcardForm, front_image: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Palabra/Título</label>
                          <input
                            type="text"
                            value={flashcardForm.back_title}
                            onChange={(e) => setFlashcardForm({ ...flashcardForm, back_title: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="Palabra"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pronunciación (IPA)</label>
                          <input
                            type="text"
                            value={flashcardForm.back_pronunciation}
                            onChange={(e) => setFlashcardForm({ ...flashcardForm, back_pronunciation: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="/wɜrd/"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idioma</label>
                          <input
                            type="text"
                            value={flashcardForm.lang}
                            onChange={(e) => setFlashcardForm({ ...flashcardForm, lang: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="en-US"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                        >
                          {loading ? "Creando..." : "Crear Flashcard"}
                        </button>
                      </form>
                    )}

                    {/* Drag-Drop Content */}
                    {selectedLessonType === "drag_drop" && (
                      <form onSubmit={handleCreateDragdrop} className="space-y-4 max-w-2xl">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona la Lección</label>
                          <select
                            value={dragdropForm.lesson_id}
                            onChange={(e) => setDragdropForm({ ...dragdropForm, lesson_id: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
                            required
                          >
                            <option value="">Selecciona una lección de drag-drop</option>
                            {getLessonsForContentType("drag_drop").map((lesson) => (
                              <option key={lesson.id} value={lesson.id}>
                                {lesson.title} (ID: {lesson.id})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texto a Clasificar</label>
                          <input
                            type="text"
                            value={dragdropForm.text}
                            onChange={(e) => setDragdropForm({ ...dragdropForm, text: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="Palabra o frase"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría Correcta</label>
                          <input
                            type="text"
                            value={dragdropForm.category}
                            onChange={(e) => setDragdropForm({ ...dragdropForm, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="Categoría"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensaje de Feedback (opcional)</label>
                          <textarea
                            value={dragdropForm.feedback_message_wrong}
                            onChange={(e) => setDragdropForm({ ...dragdropForm, feedback_message_wrong: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                            placeholder="Feedback si es incorrecto"
                            rows={2}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                        >
                          {loading ? "Creando..." : "Crear Drag-Drop"}
                        </button>
                      </form>
                    )}

                    {/* Reading Content */}
                    {selectedLessonType === "reading" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agregar Texto de Lectura</h4>
                          <form onSubmit={handleCreateReadingContent} className="space-y-4 max-w-2xl">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona la Lección</label>
                              <select
                                value={readingForm.lesson_id}
                                onChange={(e) => {
                                  setReadingForm({ ...readingForm, lesson_id: e.target.value });
                                  loadReadingContents(e.target.value);
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
                                required
                              >
                                <option value="">Selecciona una lección de lectura</option>
                                {getLessonsForContentType("reading").map((lesson) => (
                                  <option key={lesson.id} value={lesson.id}>
                                    {lesson.title} (ID: {lesson.id})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texto</label>
                              <textarea
                                value={readingForm.text}
                                onChange={(e) => setReadingForm({ ...readingForm, text: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                                placeholder="Contenido de la lectura"
                                rows={6}
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                            >
                              {loading ? "Creando..." : "Crear Lectura"}
                            </button>
                          </form>
                        </div>

                        {readingContents.length > 0 && (
                          <div className="border-t border-slate-600/30 pt-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agregar Palabras al Glosario</h4>
                            <form onSubmit={handleCreateGlossaryItem} className="space-y-4 max-w-2xl">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contenido de Lectura</label>
                                <select
                                  value={glossaryForm.reading_id}
                                  onChange={(e) => setGlossaryForm({ ...glossaryForm, reading_id: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white focus:border-primary-start focus:outline-none transition-colors"
                                  required
                                >
                                  <option value="">Selecciona un texto de lectura</option>
                                  {readingContents.map((content) => (
                                    <option key={content.id} value={content.id}>
                                      ID: {content.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Palabra</label>
                                <input
                                  type="text"
                                  value={glossaryForm.word}
                                  onChange={(e) => setGlossaryForm({ ...glossaryForm, word: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                                  placeholder="Palabra"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Definición</label>
                                <textarea
                                  value={glossaryForm.definition}
                                  onChange={(e) => setGlossaryForm({ ...glossaryForm, definition: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                                  placeholder="Definición"
                                  rows={3}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL de Imagen (opcional)</label>
                                <input
                                  type="text"
                                  value={glossaryForm.image_url}
                                  onChange={(e) => setGlossaryForm({ ...glossaryForm, image_url: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                                  placeholder="https://..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sinónimo en Inglés (opcional)</label>
                                <input
                                  type="text"
                                  value={glossaryForm.synonym_english}
                                  onChange={(e) => setGlossaryForm({ ...glossaryForm, synonym_english: e.target.value })}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                                  placeholder="Sinónimo"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                              >
                                {loading ? "Creando..." : "Agregar al Glosario"}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "glossary" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent mb-6">
                Gestionar Glosario
              </h2>

              {/* Edit form */}
              {editingGlossaryItem && (
                <div className="bg-gradient-to-br from-primary-start/10 to-secondary-start/10 border border-primary-start/30 rounded-lg p-6 mb-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Editando: {editingGlossaryItem.word}</h4>
                    <button
                      onClick={() => {
                        setEditingGlossaryItem(null);
                        setEditGlossaryForm({ word: "", definition: "", image_url: "", synonym_english: "" });
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleEditGlossaryItem} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Palabra</label>
                      <input
                        type="text"
                        value={editGlossaryForm.word}
                        onChange={(e) => setEditGlossaryForm({ ...editGlossaryForm, word: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                        placeholder="Palabra"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Definición</label>
                      <textarea
                        value={editGlossaryForm.definition}
                        onChange={(e) => setEditGlossaryForm({ ...editGlossaryForm, definition: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                        placeholder="Definición"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL de Imagen (opcional)</label>
                      <input
                        type="text"
                        value={editGlossaryForm.image_url}
                        onChange={(e) => setEditGlossaryForm({ ...editGlossaryForm, image_url: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sinónimo en Inglés (opcional)</label>
                      <input
                        type="text"
                        value={editGlossaryForm.synonym_english}
                        onChange={(e) => setEditGlossaryForm({ ...editGlossaryForm, synonym_english: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg text-gray-900 dark:text-white placeholder-slate-500 focus:border-primary-start focus:outline-none transition-colors"
                        placeholder="English synonym"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                      >
                        {loading ? "Actualizando..." : "Guardar Cambios"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGlossaryItem(null);
                          setEditGlossaryForm({ word: "", definition: "", image_url: "", synonym_english: "" });
                        }}
                        className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Glossary items list */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Elementos del Glosario ({glossaryItems.length})</h4>
                {glossaryItems.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No hay elementos en el glosario aún.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {glossaryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="text-base font-semibold text-primary-start">{item.word}</h5>
                            {item.synonym_english && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic">({item.synonym_english})</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingGlossaryItem(item);
                                setEditGlossaryForm({
                                  word: item.word,
                                  definition: item.definition,
                                  image_url: item.image_url || "",
                                  synonym_english: item.synonym_english || "",
                                });
                              }}
                              className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded transition-all"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteGlossaryItem(item.id)}
                              disabled={loading}
                              className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm rounded transition-all disabled:opacity-50"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{item.definition}</p>
                        {item.image_url && (
                          <p className="text-slate-500 text-xs mb-2">Imagen: {item.image_url}</p>
                        )}
                        {item.reading_contents?.lessons && (
                          <p className="text-slate-500 text-xs">
                            Lección: {item.reading_contents.lessons.title}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

