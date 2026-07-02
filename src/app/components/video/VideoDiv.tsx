"use client";
import { useEffect, useState } from "react";
import { fetchLessonWithVideoContent } from "@/app/actions/modules";
import ReactMarkdown from 'react-markdown';
import type { lessons, video_contents } from "@/generated/prisma/client";

interface VideoDivProps {
  lessonId: number;
}

interface LessonData {
  lesson: (lessons & { video_contents: video_contents[] }) | null;
  isLoading: boolean;
  error: string | null;
}

export default function VideoDiv({ lessonId }: VideoDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithVideoContent(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading video content",
        });
      }
    };

    loadData();
  }, [lessonId]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Cargando video...
      </div>
    );
  }

  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        Error cargando la lección.
      </div>
    );
  }

  const videoContent = data.lesson.video_contents?.[0];
  const hasValidUrl = videoContent?.url && videoContent.url.trim().length > 0;
  
  return (
    <div className="flex flex-col gap-6">
      {hasValidUrl ? (
        <iframe 
          className='rounded-md w-full aspect-video max-h-[90vh]'
          src={`${videoContent.url}?modestbranding=1&rel=0`} 
          title="YouTube video player" 
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        />
      ) : (
        <div className="rounded-md w-full aspect-video max-h-[90vh] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-slate-600">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400 text-sm">Contenido de aprendizaje</p>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-white mb-3">{data.lesson.title}</h2>
        {videoContent?.description && (
          <article className="prose prose-zinc prose-invert max-w-none p-4 bg-[#0F0F21] rounded-md border border-slate-700">
            <ReactMarkdown>{videoContent.description}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}