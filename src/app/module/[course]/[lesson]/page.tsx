"use client";
import { use, useState, useEffect } from "react";
import { 
  lessonsTable, 
  topicsTable, 
  tagsTable, 
  mockUserPreferences, 
} from "@/data/lessons";
import VideoDiv from "../../../components/video/VideoDiv";
import FlashcardsDiv from "../../../components/flashcards/FlashcardsDiv";
import DragDropDiv from "../../../components/drag-drop/DragDropDiv";
import SidebarModuleToggle from "../../../components/ui/SidebarModuleToggle";
import ModuleList from "../../../components/ui/ModuleList";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ course: string; lesson: string }>;
  searchParams: Promise<{ id?: string }>;
}


export default function ModulePage({ params, searchParams }: PageProps) {
  const { course, lesson } = use(params);
  const { id: urlUuid } = use(searchParams);
    
  // 1. Buscamos la lección usando únicamente su identificador único (UUID)
  const lessonBase = lessonsTable.find((l) => l.uuid === urlUuid);
  
  // 2. Traemos el tema (Topic) al que pertenece esta lección para validar el idioma (course_slug)
  const topicBase = lessonBase 
    ? topicsTable.find((t) => t.id === lessonBase.topic_id) 
    : null;

  // 3. Obtenemos los slugs reales de todas las pasiones asignadas a esta lección
  // Filtramos la tagsTable para quedarnos solo con los tags cuyos IDs estén dentro de lessonBase.tag_ids
  const slugsDeLaLeccion = lessonBase
    ? tagsTable.filter((tag) => lessonBase.tag_ids.includes(tag.id)).map((tag) => tag.slug)
    : [];

  // 4. Verificamos si al menos una de las pasiones de la lección coincide con las del alumno
  const tieneAccesoPorPasion = slugsDeLaLeccion.some((slug) =>
    mockUserPreferences.chosen_tags.includes(slug)
  );

  const isEnrolled = mockUserPreferences.enrolled_courses.includes(course);

  // 5. Guardia de seguridad
  if (
    !lessonBase || 
    !topicBase || 
    topicBase.course_slug !== course || 
    !tieneAccesoPorPasion || 
    !isEnrolled // 👈 Si no está en el array de enrolled_courses, lo mandamos al 404
  ) {
    notFound();
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const storedValue = localStorage.getItem("sidebar_toggled");
    if (storedValue !== null) {
      setIsSidebarOpen(storedValue === "true");
    }
  }, []);

  const handleToggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebar_toggled", String(newState));
  };
  return (
    // main container
    <div className="min-h-screen bg-background p-5 flex items-start">
      <SidebarModuleToggle 
          isOpen={isSidebarOpen} 
          onToggle={handleToggleSidebar} 
        />

      {/* module container  */}
      <div className={`transition-all duration-500 ${isSidebarOpen ? "w-[70%]" : "w-full"}`}>


              
      {lesson === "video" && (
        <VideoDiv lessonId={lessonBase.id}/>
      )}

      {lesson === "flashcards" && (
        <FlashcardsDiv lessonId={lessonBase.id}/>
      )}

      {lesson === "drag-drop" && (
        <DragDropDiv lessonId={lessonBase.id}/>
      )}

      </div>

      {isSidebarOpen ? <ModuleList 
                          courseSlug={course}              // 'english'
                          currentLessonUuid={urlUuid ?? ""}
              /> : null}

    </div>
  );
}