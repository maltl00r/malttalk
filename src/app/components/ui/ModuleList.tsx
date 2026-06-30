"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { fetchModulesForCourse } from "@/app/actions/modules";
import type { topics, lessons, video_contents } from "@/generated/prisma/models";

interface SidebarContainerProps {
  courseSlug: string;
  currentLessonUuid: string;
}

interface ModuleData {
  topics: (topics & { lessons: (lessons & { video_contents: video_contents[] })[] })[];
}

type ModulosAgrupados = Record<string, (lessons & { video_contents: video_contents[] })[]>;

const getThumbnailUrl = (url: string): string => {
  const videoId = url.split('/').pop()?.replace('watch?v=', '').split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export default function ModuleList({ courseSlug, currentLessonUuid }: SidebarContainerProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [modulos, setModulos] = useState<ModulosAgrupados>({});
  const [isLoading, setIsLoading] = useState(true);
  const currentModuleRef = useRef<HTMLDivElement | null>(null);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("openModules");
    if (saved) {
      setOpenModules(JSON.parse(saved));
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("openModules", JSON.stringify(openModules));
  }, [openModules]);

  // Fetch data from database
  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      try {
        const data = await fetchModulesForCourse(courseSlug);
        
        // Group lessons by topic slug
        const grouped: ModulosAgrupados = {};
        data.topics.forEach(topic => {
          grouped[topic.slug] = topic.lessons || [];
        });
        
        setModulos(grouped);
      } catch (error) {
        console.error("Failed to load modules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModules();
  }, [courseSlug]);

  const toggleModule = (slug: string, isCurrentModule: boolean) => {
    if (isCurrentModule) return; // current module never closes
    setOpenModules(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Auto-open modules and scroll to current
  useEffect(() => {
    Object.entries(modulos).forEach(([slug, lecciones]) => {
      const isCurrentModule = lecciones.some(l => l.uuid === currentLessonUuid);

      setOpenModules(prev => {
        const alreadySet = slug in prev;
        return {
          ...prev,
          [slug]: isCurrentModule ? true : (alreadySet ? prev[slug] : true)
        };
      });

      if (isCurrentModule && currentModuleRef.current) {
        currentModuleRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [modulos, currentLessonUuid]);

  return (
    <aside className="p-4 w-full md:w-[30%] md:ml-5 bg-[#1B1B38] rounded-md transition-all duration-300 ease-in-out h-auto">
      <div className="min-w-[280px] flex flex-col h-auto">
        <h3 className="text-lg font-bold mb-4">Lista de módulos</h3>
        
        {isLoading && <p className="text-zinc-400">Cargando módulos...</p>}
        
        {/* Scroll only on desktop */}
        <div className="space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto md:pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#272727] [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500">
          {Object.entries(modulos).map(([topicSlug, lecciones]) => {
            const isCurrentModule = lecciones.some(l => l.uuid === currentLessonUuid);
            const isOpen = isCurrentModule ? true : (openModules[topicSlug] ?? true);
            const topicTitle = lecciones[0]?.topics?.title || topicSlug; // Get title from first lesson's topic relation

            return (
              <div
                key={topicSlug}
                className="space-y-2"
                ref={isCurrentModule ? currentModuleRef : null}
              >
                <button
                  onClick={() => toggleModule(topicSlug, isCurrentModule)}
                  className={`w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    isCurrentModule 
                      ? "bg-purple-700 text-white cursor-default" 
                      : "bg-zinc-700 text-secondary-start"
                  }`}
                >
                  {topicTitle}
                  {!isCurrentModule && <span>{isOpen ? "▲" : "▼"}</span>}
                </button>

                {isOpen && (
                  <div className="space-y-2">
                    {lecciones.map((leccion) => {
                      const videoContent = leccion.video_contents?.[0];
                      const thumbnail = videoContent ? getThumbnailUrl(videoContent.url) : null;
                      const lessonType = leccion.type === "drag_drop" ? "drag-drop" : leccion.type;

                      return (
                        <a 
                          key={leccion.uuid}
                          href={`/module/${courseSlug}/${lessonType}?id=${leccion.uuid}`}
                          className={`flex gap-3 p-2 rounded-lg transition-all duration-200 ${
                            leccion.uuid === currentLessonUuid 
                              ? "bg-zinc-800 border-l-4 border-purple-500" 
                              : "hover:bg-zinc-800"
                          }`}
                        >
                          <div className="relative w-24 h-14 flex-shrink-0 bg-zinc-700 rounded overflow-hidden">
                            {thumbnail ? (
                              <img 
                                src={thumbnail} 
                                alt={leccion.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                                {leccion.type === "video" ? "📺" : "📖"}
                              </div>
                            )}
                            {leccion.type === "video" && (
                              <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white">
                                10:00
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col justify-center overflow-hidden">
                            <h5 className="text-sm font-medium text-zinc-200 truncate leading-tight">
                              {leccion.title}
                            </h5>
                            <p className="text-[11px] text-zinc-500 mt-0.5">
                              {leccion.type.toUpperCase()}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
