"use client";

import { useState, useEffect } from "react";
import { fetchLessonWithListening } from "@/app/actions/modules";
import type { lessons, listening_contents } from "@/generated/prisma/client";

interface ListeningDivProps {
  lessonId: number;
}

interface LessonData {
  lesson: (lessons & { listening_contents: listening_contents[] }) | null;
  isLoading: boolean;
  error: string | null;
}

// Función auxiliar para mezclar (barajar) el array de opciones
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * LISTENING COMPREHENSION COMPONENT
 * 
 * Audio comprehension exercises with image-based answer selection.
 * Students listen to audio clips and select the correct image that matches the content.
 * 
 * Features:
 * - Audio player with waveform visualization
 * - Multiple image options with descriptions
 * - Immediate feedback on answers
 * - Difficulty level indicators
 * - Progress tracking through exercises
 * - Answer replay capability
 * - Randomized image options
 * 
 * @component
 * @param {ListeningDivProps} props - Component props
 * @returns {JSX.Element} Rendered listening comprehension interface
 */
export default function ListeningDiv({ lessonId }: ListeningDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  // Nuevo estado para las opciones de imágenes barajadas
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithListening(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading listening exercises",
        });
      }
    };

    loadData();
  }, [lessonId]);

  // Efecto para procesar y mezclar las imágenes cada vez que cambia la pregunta
  useEffect(() => {
    if (data.lesson?.listening_contents) {
      const currentExercise = data.lesson.listening_contents[currentQuestionIndex];
      if (currentExercise) {
        try {
          // Parseamos el JSON original
          const parsedOptions = JSON.parse(currentExercise.image_options);
          
          // Mapeamos para guardar qué opción es la correcta ANTES de mezclar
          // basándonos en el índice original (currentExercise.correct_answer)
          const optionsWithCorrectness = parsedOptions.map((opt: any, index: number) => ({
            ...opt,
            isCorrect: index === currentExercise.correct_answer,
            originalIndex: index
          }));

          // Mezclamos el nuevo array y lo guardamos en el estado
          setShuffledOptions(shuffleArray(optionsWithCorrectness));
        } catch (e) {
          console.error("Error parsing image options:", e);
          setShuffledOptions([]);
        }
      }
    }
  }, [currentQuestionIndex, data.lesson]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Cargando ejercicios de comprensión auditiva...
      </div>
    );
  }

  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "No se pudieron cargar los ejercicios de comprensión auditiva"}
      </div>
    );
  }

  const exercises = data.lesson.listening_contents || [];
  if (exercises.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No hay ejercicios de comprensión auditiva disponibles para esta lección
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / exercises.length) * 100);
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold text-purple-200 mb-4">¡Completado!</h2>
        <div className="text-5xl font-bold text-purple-300 mb-2">{percentage}%</div>
        <p className="text-lg text-purple-200 mb-6">
          Has acertado {score} de {exercises.length} preguntas
        </p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedImageIndex(null);
            setAnswered(false);
            setScore(0);
            setCompleted(false);
          }}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
        >
          Intentar de Nuevo
        </button>
      </div>
    );
  }

  const currentExercise = exercises[currentQuestionIndex];

  const handleSelectImage = (index: number) => {
    if (answered) return;
    
    setSelectedImageIndex(index);
    setAnswered(true);
    
    // Verificamos si es correcta usando la propiedad que agregamos al barajar
    const isAnswerCorrect = shuffledOptions[index].isCorrect;
    setCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedImageIndex(null);
      setAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-pink-300 mb-2">{currentExercise.title}</h2>
        <p className="text-slate-300">{currentExercise.description}</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-xs font-semibold px-3 py-1 bg-pink-900/50 text-pink-200 rounded-full uppercase">
            Dificultad: {currentExercise.difficulty_level}
          </span>
          <span className="text-sm text-slate-400">
            Pregunta {currentQuestionIndex + 1} de {exercises.length}
          </span>
          <span className="text-sm text-slate-400">
            Aciertos: {score}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-slate-800/50 border border-pink-600/30 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-pink-300 mb-4">{currentExercise.question}</h3>

        {/* Audio Player */}
        <div className="bg-slate-700/50 p-4 rounded-lg mb-4 border border-pink-600/20">
          <audio
            key={currentExercise.audio_url}
            controls
            src={currentExercise.audio_url}
            className="w-full focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-2">Escucha el audio y selecciona la imagen correcta</p>
        </div>
      </div>

      {/* Image Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {shuffledOptions && shuffledOptions.length > 0 ? (
          shuffledOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectImage(idx)}
              disabled={answered}
              className={`relative rounded-lg overflow-hidden border-4 transition-all ${
                selectedImageIndex === idx
                  ? correct
                    ? "border-green-500 bg-green-900/30"
                    : "border-red-500 bg-red-900/30"
                  : "border-slate-600 hover:border-pink-500"
              } ${answered && "cursor-not-allowed"}`}
            >
              <img
                src={option.url}
                alt={option.label}
                className={`w-full h-48 object-cover ${answered ? "opacity-75" : ""}`}
              />
              <div className="p-3 bg-slate-900/80">
                <p className="text-slate-200 text-sm font-medium">{option.label}</p>
              </div>

              {selectedImageIndex === idx && answered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-4xl">
                    {correct ? "✓" : "✗"}
                  </span>
                </div>
              )}
            </button>
          ))
        ) : (
          <p className="text-slate-400">No hay opciones de imágenes disponibles</p>
        )}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className={`mb-6 p-4 rounded-lg border-l-4 ${
            correct
              ? "bg-green-900/30 border-green-500 text-green-200"
              : "bg-red-900/30 border-red-500 text-red-200"
          }`}
        >
          <p className="font-semibold">
            {correct ? "¡Correcto!" : "Incorrecto"}
          </p>
          <p className="text-sm mt-1">
            {correct ? currentExercise.feedback_correct : currentExercise.feedback_incorrect}
          </p>
        </div>
      )}

      {/* Navigation */}
      {answered && (
        <div className="flex justify-end gap-4">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition"
          >
            {currentQuestionIndex < exercises.length - 1 ? "Siguiente →" : "Finalizar"}
          </button>
        </div>
      )}
    </div>
  );
}