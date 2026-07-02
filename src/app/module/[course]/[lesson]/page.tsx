"use client";
import { use, useState, useEffect } from "react";
import VideoDiv from "../../../components/video/VideoDiv";
import FlashcardsDiv from "../../../components/flashcards/FlashcardsDiv";
import DragDropDiv from "../../../components/drag-drop/DragDropDiv";
import ReadingDiv from "../../../components/reading/ReadingDiv";
import VisioAcousticDiv from "../../../components/visio-acoustic/VisioAcousticDiv";
import WritingChallengesDiv from "../../../components/writing-challenges/WritingChallengesDiv";
import MentalAgilityDiv from "../../../components/mental-agility/MentalAgilityDiv";
import ClosingExamDiv from "../../../components/closing-exam/ClosingExamDiv";
import GrammarGuidesDiv from "../../../components/grammar-guides/GrammarGuidesDiv";
import ListeningDiv from "../../../components/listening/ListeningDiv";
import IcebreakerDiv from "../../../components/icebreaker/IcebreakerDiv";
import SidebarModuleToggle from "../../../components/ui/SidebarModuleToggle";
import ModuleList from "../../../components/ui/ModuleList";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ course: string; lesson: string }>;
  searchParams: Promise<{ id?: string }>;
}

interface LessonData {
  id: number;
  uuid: string;
  title: string;
  type: string;
  topic_id: number;
  topics: {
    course_slug: string;
    title: string;
  };
}

export default function ModulePage({ params, searchParams }: PageProps) {
  const { course, lesson } = use(params);
  const { id: urlUuid } = use(searchParams);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!urlUuid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/lessons/${urlUuid}`);
        if (!response.ok) {
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Validate the lesson belongs to the correct course
        if (data.topics?.course_slug === course) {
          setLessonData(data);
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [urlUuid, course]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-5 flex items-center justify-center">
        <p className="text-zinc-400">Cargando lección...</p>
      </div>
    );
  }

  if (!hasAccess || !lessonData) {
    notFound();
  }

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
          <VideoDiv lessonId={lessonData.id}/>
        )}

        {lesson === "flashcards" && (
          <FlashcardsDiv lessonId={lessonData.id}/>
        )}

        {lesson === "drag-drop" && (
          <DragDropDiv lessonId={lessonData.id}/>
        )}

        {lesson === "reading" && (
          <ReadingDiv lessonId={lessonData.id}/>
        )}

        {lesson === "visio-acoustic" && (
          <VisioAcousticDiv lessonId={lessonData.id}/>
        )}

        {lesson === "writing-challenges" && (
          <WritingChallengesDiv lessonId={lessonData.id}/>
        )}

        {lesson === "mental-agility" && (
          <MentalAgilityDiv lessonId={lessonData.id}/>
        )}

        {lesson === "closing-exam" && (
          <ClosingExamDiv lessonId={lessonData.id}/>
        )}

        {lesson === "grammar-guides" && (
          <GrammarGuidesDiv lessonId={lessonData.id}/>
        )}

        {lesson === "listening" && (
          <ListeningDiv lessonId={lessonData.id}/>
        )}

        {lesson === "icebreaker" && (
          <IcebreakerDiv lessonId={lessonData.id}/>
        )}
      </div>

      {isSidebarOpen ? <ModuleList 
                          courseSlug={course}
                          currentLessonUuid={urlUuid ?? ""}
              /> : null}
    </div>
  );
}