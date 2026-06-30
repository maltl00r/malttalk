"use client";
import { useEffect, useState } from "react";
import { fetchLessonWithVideoContent } from "@/app/actions/modules";
import ReactMarkdown from 'react-markdown';
import type { lessons, video_contents } from "@/generated/prisma/models";

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
        setData({ lesson, isLoading: false, error: null });
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

  if (data.error || !data.lesson || !data.lesson.video_contents?.[0]) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        Video no encontrado o ID no válido.
      </div>
    );
  }

  const videoContent = data.lesson.video_contents[0];
  const currentVideo = {
    url: videoContent.url,
    title: data.lesson.title,
    description: videoContent.description || "",
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