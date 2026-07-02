"use client";

import { useState, useEffect } from "react";
import { fetchLessonWithIcebreaker } from "@/app/actions/modules";
import type { lessons, icebreaker_contents } from "@/generated/prisma/client";

interface IcebreakerDivProps {
  lessonId: number;
}

interface LessonData {
  lesson: (lessons & { icebreaker_contents: icebreaker_contents[] }) | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * ICEBREAKER DYNAMICS COMPONENT
 * 
 * Match English expressions with real-world situation illustrations.
 * Students learn practical communication through visual context matching.
 * 
 * Features:
 * - Expression-illustration matching game
 * - Detailed situation descriptions
 * - Real-world context learning
 * - Difficulty level indicators
 * - Interactive visual discovery
 * - Pairing mechanics
 * 
 * @component
 * @param {IcebreakerDivProps} props - Component props
 * @returns {JSX.Element} Rendered icebreaker interface
 */
export default function IcebreakerDiv({ lessonId }: IcebreakerDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSituation, setShowSituation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [learnedExpressions, setLearnedExpressions] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithIcebreaker(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading icebreaker dynamics",
        });
      }
    };

    loadData();
  }, [lessonId]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Cargando dinámica rompehielos...
      </div>
    );
  }

  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "No se pudieron cargar las dinámicas rompehielos"}
      </div>
    );
  }

  const expressions = data.lesson.icebreaker_contents || [];
  if (expressions.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No hay dinámicas rompehielos disponibles para esta lección
      </div>
    );
  }

  if (completed) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold text-cyan-200 mb-4">¡Felicidades!</h2>
        <p className="text-lg text-cyan-200 mb-2">
          Has aprendido {learnedExpressions.length} expresiones
        </p>
        <p className="text-slate-300 mb-6">
          Ahora estás listo para usar estas expresiones en situaciones reales
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setShowSituation(false);
            setCompleted(false);
            setLearnedExpressions([]);
          }}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition"
        >
          Comenzar de Nuevo
        </button>
      </div>
    );
  }

  const currentExpression = expressions[currentIndex];

  const handleMarkAsLearned = () => {
    if (!learnedExpressions.includes(currentIndex)) {
      setLearnedExpressions([...learnedExpressions, currentIndex]);
    }

    if (currentIndex < expressions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSituation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < expressions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSituation(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowSituation(false);
    }
  };

  const isLearned = learnedExpressions.includes(currentIndex);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">Dinámica Rompehielos</h2>
        <p className="text-slate-300">
          Aprende expresiones en situaciones reales con ejemplos visuales
        </p>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-xs font-semibold px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full uppercase">
            Dificultad: {currentExpression.difficulty_level}
          </span>
          <span className="text-sm text-slate-400">
            Expresión {currentIndex + 1} de {expressions.length}
          </span>
          <span className="text-sm text-slate-400">
            Aprendidas: {learnedExpressions.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Expression Card */}
        <div className="bg-slate-800/50 border border-cyan-600/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-cyan-200 mb-4">{currentExpression.title}</h3>
          <div className="text-4xl font-bold text-cyan-300 font-mono mb-4 p-4 bg-slate-700/50 rounded-lg">
            "{currentExpression.expression}"
          </div>
          <p className="text-slate-300 text-lg">{currentExpression.description}</p>
        </div>

        {/* Illustration Section */}
        <div className="bg-slate-800/50 border border-cyan-600/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-cyan-300 mb-4">Situación Real</h4>
          
          <div className="relative">
            <img
              src={currentExpression.illustration_url}
              alt="Situación"
              className="w-full rounded-lg max-h-80 object-cover"
            />
          </div>

          {/* Situation Description */}
          <button
            onClick={() => setShowSituation(!showSituation)}
            className="w-full mt-4 flex justify-between items-center font-semibold text-lg text-cyan-300 hover:text-cyan-200 transition p-3 bg-slate-700/50 rounded-lg"
          >
            <span>Ver descripción de la situación</span>
            <span className="text-xl">{showSituation ? "▼" : "▶"}</span>
          </button>

          {showSituation && (
            <div className="mt-4 p-4 bg-cyan-900/20 border-l-4 border-cyan-500 rounded text-slate-200">
              <p className="whitespace-pre-line">{currentExpression.situation_description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
        >
          ← Anterior
        </button>

        <div className="flex gap-2 flex-wrap justify-center">
          {expressions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setShowSituation(false);
              }}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentIndex
                  ? "bg-cyan-400 w-8"
                  : learnedExpressions.includes(idx)
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-slate-600 hover:bg-slate-500"
              }`}
              title={learnedExpressions.includes(idx) ? "Aprendida" : "Sin aprender"}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleMarkAsLearned}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              isLearned
                ? "bg-green-900 text-green-200 cursor-default"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {isLearned ? "✓ Aprendida" : "Marcar Aprendida"}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === expressions.length - 1 && !isLearned}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
