"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { 
  ModulosAgrupados, 
  topicsTable, 
  lessonsTable, 
  tagsTable, 
  mockUserPreferences,
  tablaVideosContent
} from "@/data/lessons";

interface SidebarContainerProps {
  courseSlug: string;
  currentLessonUuid: string;
}

const getThumbnailUrl = (url: string): string => {
  const videoId = url.split('/').pop()?.replace('watch?v=', '').split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export default function ModuleList({ courseSlug, currentLessonUuid }: SidebarContainerProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const currentModuleRef = useRef<HTMLDivElement | null>(null);

  // Cargar estado desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("openModules");
    if (saved) {
      setOpenModules(JSON.parse(saved));
    }
  }, []);

  // Guardar estado en localStorage
  useEffect(() => {
    localStorage.setItem("openModules", JSON.stringify(openModules));
  }, [openModules]);

  const toggleModule = (slug: string, isCurrentModule: boolean) => {
    if (isCurrentModule) return; // el módulo actual nunca se cierra
    setOpenModules(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const modulos: ModulosAgrupados = useMemo(() => {
    const idsPasionesUsuario = tagsTable
      .filter(tag => mockUserPreferences.chosen_tags.includes(tag.slug))
      .map(tag => tag.id);

    const leccionesPermitidas = lessonsTable.filter((l) => {
      const topic = topicsTable.find(t => t.id === l.topic_id);
      return topic?.course_slug === courseSlug && 
             l.tag_ids.some(id => idsPasionesUsuario.includes(id));
    });

    return leccionesPermitidas.reduce((acc, leccion) => {
      const topic = topicsTable.find(t => t.id === leccion.topic_id);
      const key = topic?.slug || "general";
      if (!acc[key]) acc[key] = [];
      acc[key].push(leccion);
      return acc;
    }, {} as ModulosAgrupados);
  }, [courseSlug]);

  // Abrir módulos por defecto y asegurar que el actual esté abierto + scroll interno
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
        
        {/* Scroll solo en escritorio */}
        <div className="space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto md:pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#272727] [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500">
          {Object.entries(modulos).map(([topicSlug, lecciones]) => {
            const topicInfo = topicsTable.find(t => t.slug === topicSlug);
            const isCurrentModule = lecciones.some(l => l.uuid === currentLessonUuid);
            const isOpen = isCurrentModule ? true : (openModules[topicSlug] ?? true);

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
                  {topicInfo?.title}
                  {!isCurrentModule && <span>{isOpen ? "▲" : "▼"}</span>}
                </button>

                {isOpen && (
                  <div className="space-y-2">
                    {lecciones.map((leccion) => {
                      const contenido = tablaVideosContent.find(c => c.lesson_id === leccion.id);
                      const thumbnail = contenido ? getThumbnailUrl(contenido.url) : null;

                      return (
                        <a 
                          key={leccion.uuid}
                          href={`/module/${courseSlug}/${leccion.tipo}?id=${leccion.uuid}`}
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
                                {leccion.tipo === "video" ? "📺" : "📖"}
                              </div>
                            )}
                            {leccion.tipo === "video" && (
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
                              {leccion.tipo.toUpperCase()}
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
