"use client";

import { useState, useEffect } from "react";
import { fetchLessonWithGrammarGuides } from "@/app/actions/modules";
import type { lessons, grammar_guides_contents } from "@/generated/prisma/client";

interface GrammarGuidesDivProps {
  lessonId: number;
}

interface LessonData {
  lesson: (lessons & { grammar_guides_contents: grammar_guides_contents[] }) | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * GRAMMAR GUIDES COMPONENT
 * 
 * Provides interactive visual sentence structure guides with color-coded schemas.
 * Students learn grammar rules through visual representations and practical examples.
 * 
 * Features:
 * - Color-coded sentence structure diagrams
 * - Interactive schema visualization
 * - Multiple example sentences
 * - Difficulty level indicators
 * - Illustrated visual aids
 * 
 * @component
 * @param {GrammarGuidesDivProps} props - Component props
 * @returns {JSX.Element} Rendered grammar guide interface
 */
export default function GrammarGuidesDiv({ lessonId }: GrammarGuidesDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithGrammarGuides(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading grammar guides",
        });
      }
    };

    loadData();
  }, [lessonId]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Cargando guías de gramática...
      </div>
    );
  }

  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "No se pudieron cargar las guías de gramática"}
      </div>
    );
  }

  const guides = data.lesson.grammar_guides_contents || [];
  if (guides.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No hay guías de gramática disponibles para esta lección
      </div>
    );
  }

  const currentGuide = guides[currentGuideIndex];
  let structureData: any = { parts: [] };
  let examplesData: string[] = [];

  try {
    structureData = JSON.parse(currentGuide.structure_schema);
  } catch (e) {
    console.error("Error parsing structure schema:", e);
  }

  try {
    examplesData = JSON.parse(currentGuide.example_sentences);
  } catch (e) {
    console.error("Error parsing examples:", e);
  }

  const handleNext = () => {
    if (currentGuideIndex < guides.length - 1) {
      setCurrentGuideIndex(currentGuideIndex + 1);
      setShowExamples(false);
    }
  };

  const handlePrev = () => {
    if (currentGuideIndex > 0) {
      setCurrentGuideIndex(currentGuideIndex - 1);
      setShowExamples(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-300 mb-2">{currentGuide.title}</h2>
        <p className="text-slate-300">{currentGuide.description}</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-xs font-semibold px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full uppercase">
            Dificultad: {currentGuide.difficulty_level}
          </span>
          <span className="text-sm text-slate-400">
            Guía {currentGuideIndex + 1} de {guides.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Structure Diagram */}
        <div className="bg-slate-800/50 border border-blue-600/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-300 mb-4">Estructura Gramatical</h3>
          
          {currentGuide.image_url && (
            <div className="mb-4 flex justify-center">
              <img 
                src={currentGuide.image_url} 
                alt="Estructura gramatical" 
                className="max-w-md rounded-lg"
              />
            </div>
          )}

          {/* Color-coded parts */}
          <div className="flex flex-wrap gap-2 mb-4">
            {structureData.parts && Array.isArray(structureData.parts) ? (
              structureData.parts.map((part: any, idx: number) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-lg font-medium text-white"
                  style={{
                    backgroundColor: part.color || "#3b82f6",
                  }}
                  title={part.label}
                >
                  {part.text || part.label}
                </div>
              ))
            ) : (
              <p className="text-slate-400">Estructura no disponible</p>
            )}
          </div>

          {/* Structure explanation */}
          {structureData.explanation && (
            <p className="text-slate-300 text-sm italic bg-slate-700/50 p-3 rounded">
              {structureData.explanation}
            </p>
          )}
        </div>

        {/* Examples */}
        <div className="bg-slate-800/50 border border-green-600/30 rounded-lg p-6">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="w-full flex justify-between items-center font-semibold text-lg text-green-300 hover:text-green-200 transition"
          >
            <span>Ejemplos Prácticos</span>
            <span>{showExamples ? "▼" : "▶"}</span>
          </button>

          {showExamples && (
            <div className="mt-4 space-y-3">
              {examplesData && Array.isArray(examplesData) && examplesData.length > 0 ? (
                examplesData.map((example, idx) => (
                  <div
                    key={idx}
                    className="bg-green-900/20 border-l-4 border-green-500 p-3 rounded text-slate-200"
                  >
                    <p className="font-mono text-green-300">{example}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No hay ejemplos disponibles</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentGuideIndex === 0}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
        >
          ← Anterior
        </button>

        <div className="flex gap-2">
          {guides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentGuideIndex(idx);
                setShowExamples(false);
              }}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentGuideIndex ? "bg-blue-500 w-8" : "bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentGuideIndex === guides.length - 1}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
