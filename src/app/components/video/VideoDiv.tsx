"use client";
import { tablaVideosContent, lessonsTable } from '@/data/lessons';
import ReactMarkdown from 'react-markdown';

interface VideoDivProps {
  lessonId: number; // Recibe el ID numérico interno (1, 2, 3...) desde la página padre
}

export default function VideoDiv({ lessonId }: VideoDivProps) {
  // 1. Buscamos los datos específicos del video (URL y descripción)
  const videoContenido = tablaVideosContent.find((v) => v.lesson_id === lessonId);
  
  // 2. Buscamos el título en la tabla principal de lecciones
  const infoGeneral = lessonsTable.find((l) => l.id === lessonId);

  // Si no encuentra el video o la lección, evitamos que la app rompa
  if (!videoContenido || !infoGeneral) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        Video no encontrado o ID no válido.
      </div>
    );
  }

  // Creamos un objeto que combine ambos datos para mantener tu código idéntico
  const currentVideo = {
    url: videoContenido.url,
    title: infoGeneral.title,
    description: videoContenido.description
  };
  
  return (
    <>
      <iframe 
        className='rounded-md w-full aspect-video max-h-[90vh]'
        src={`${currentVideo.url}?modestbranding=1&rel=0`} 
        title="YouTube video player" 
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen
      />
      <h2 className="text-xl font-bold m-3">{currentVideo.title}</h2>
      <article className="prose prose-zinc prose-invert max-w-none p-3 bg-[#0F0F21] rounded-md">
        <ReactMarkdown>{currentVideo.description}</ReactMarkdown>
      </article>
    </>
  );
}