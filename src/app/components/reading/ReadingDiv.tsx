"use client";
import { useEffect, useState } from "react";
import { fetchLessonWithReadingContent } from "@/app/actions/modules";
import type { lessons, reading_contents, glossary_items } from "@/generated/prisma/client";

interface ReadingDivProps {
  lessonId: number;
}

interface GlossaryItem extends glossary_items {
  word: string;
  definition: string;
  image_url: string | null;
  synonym_english: string | null;
}

interface ReadingContent extends reading_contents {
  glossary_items: GlossaryItem[];
}

interface LessonData {
  lesson: (lessons & { reading_contents: ReadingContent[] }) | null;
  isLoading: boolean;
  error: string | null;
}

export default function ReadingDiv({ lessonId }: ReadingDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });
  const [selectedWord, setSelectedWord] = useState<GlossaryItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithReadingContent(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading reading content",
        });
      }
    };

    loadData();
  }, [lessonId]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Cargando lectura...
      </div>
    );
  }

  if (data.error || !data.lesson || !data.lesson.reading_contents?.[0]) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        Error cargando el contenido de lectura.
      </div>
    );
  }

  const reading = data.lesson.reading_contents[0];
  const glossary = reading.glossary_items || [];

  const handleWordClick = (
    word: GlossaryItem,
    e: React.MouseEvent<HTMLSpanElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left,
      y: rect.top - 10,
    });
    setSelectedWord(word);
  };

  // Parse the text and create interactive words
  const renderText = () => {
    const words = reading.text.split(/(\s+)/);
    return words.map((word, idx) => {
      const glossaryWord = glossary.find(
        (g) => g.word.toLowerCase() === word.toLowerCase()
      );

      if (glossaryWord) {
        return (
          <span
            key={idx}
            onClick={(e) => handleWordClick(glossaryWord, e)}
            className="relative cursor-help font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-dotted"
            title={glossaryWord.definition}
          >
            {word}
          </span>
        );
      }

      return <span key={idx}>{word}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {data.lesson.title}
        </h2>

        {/* Main text */}
        <div className="prose prose-zinc prose-invert max-w-none p-6 bg-[#0F0F21] rounded-lg border border-slate-700 leading-relaxed text-lg text-gray-100">
          {renderText()}
        </div>

        <p className="text-sm text-slate-400 mt-3">
          💡 Haz clic en las palabras destacadas en cian para ver definiciones
        </p>
      </div>

      {/* Glossary Section */}
      {glossary.length > 0 && (
        <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Vocabulario</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer border border-slate-600"
                onClick={() => {
                  setSelectedWord(item);
                  setTooltipPos({ x: 0, y: 0 });
                }}
              >
                <p className="font-semibold text-cyan-400">{item.word}</p>
                <p className="text-xs text-slate-400 mt-1">{item.definition}</p>
                {item.synonym_english && (
                  <p className="text-xs text-slate-300 mt-1">
                    📌 {item.synonym_english}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip/Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-slate-900 rounded-lg border border-cyan-500/30 p-6 w-full max-w-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-cyan-400">
                {selectedWord.word}
              </h3>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Image if available */}
            {selectedWord.image_url && (
              <div className="mb-4">
                <img
                  src={selectedWord.image_url}
                  alt={selectedWord.word}
                  className="w-full aspect-video object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Definition */}
            <div className="mb-4">
              <p className="text-sm text-slate-400 font-semibold mb-1">
                Definition:
              </p>
              <p className="text-base text-white">{selectedWord.definition}</p>
            </div>

            {/* Synonym */}
            {selectedWord.synonym_english && (
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-400 font-semibold mb-1">
                  Similar word:
                </p>
                <p className="text-base font-semibold text-cyan-300">
                  {selectedWord.synonym_english}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
