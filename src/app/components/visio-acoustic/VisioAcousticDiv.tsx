"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchLessonWithVisioAcousticContent } from "@/app/actions/modules";
import type { lessons, visio_acoustic_contents } from "@/generated/prisma/client";

/**
 * Props interface for VisioAcousticDiv component
 */
interface VisioAcousticDivProps {
  lessonId: number;
}

/**
 * State interface for lesson data
 */
interface LessonData {
  lesson: (lessons & { visio_acoustic_contents: visio_acoustic_contents[] }) | null;
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
 * VISIO-ACOUSTIC DIAGNOSTIC QUIZ COMPONENT
 */
export default function VisioAcousticDiv({ lessonId }: VisioAcousticDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  // Track current question index, answers, and score
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  /**
   * Load lesson and visio-acoustic content on component mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithVisioAcousticContent(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading visio-acoustic content",
        });
      }
    };

    loadData();
  }, [lessonId]);

  // ¡CORRECCIÓN!: Preparamos los datos ANTES de cualquier `return` (regla de los Hooks)
  const questions = data.lesson?.visio_acoustic_contents || [];
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Mezclar las opciones de respuesta cada vez que cambia la pregunta actual
  const answerOptions = useMemo(() => {
    if (!currentQuestion) return [];

    const options = [
      currentQuestion.correct_answer,
      currentQuestion.option_b,
      currentQuestion.option_c,
      ...(currentQuestion.option_d ? [currentQuestion.option_d] : []),
    ];

    const shuffled = shuffleArray(options);

    return shuffled.map((value, index) => ({
      label: String.fromCharCode(65 + index), // A, B, C, D
      value,
    }));
  }, [currentQuestion]);


  // ---- A partir de aquí ya podemos usar early returns ----

  // Show loading state
  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Loading audio-visual quiz...
      </div>
    );
  }

  // Show error state
  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "Failed to load quiz content"}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No questions available for this lesson
      </div>
    );
  }

  // Quiz completion screen
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl border border-green-700/50">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Quiz Complete! 🎉</h2>
          <div className="text-5xl font-black text-green-400">{percentage}%</div>
          <p className="text-xl text-gray-300">
            You got <span className="font-bold text-green-400">{score}</span> out of{" "}
            <span className="font-bold">{questions.length}</span> correct
          </p>
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setUserAnswers({});
              setScore(0);
              setQuizComplete(false);
              setSelectedAnswer(null);
              setAnswered(false);
            }}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header with progress */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{data.lesson.title}</h1>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question content */}
      <div className="bg-slate-800/50 rounded-xl p-8 space-y-6 border border-slate-700">
        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Difficulty:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentQuestion.difficulty_level === "beginner"
                ? "bg-green-500/20 text-green-300"
                : currentQuestion.difficulty_level === "intermediate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
            }`}
          >
            {currentQuestion.difficulty_level.charAt(0).toUpperCase() +
              currentQuestion.difficulty_level.slice(1)}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-2xl font-bold text-white">{currentQuestion.question_text}</h2>

        {/* Audio player */}
        <div className="space-y-3">
          <p className="text-sm text-gray-300">🎵 Listen to the audio:</p>
          <audio
            controls
            className="w-full rounded-lg bg-slate-900 accent-blue-500"
            controlsList="nodownload"
            key={currentQuestion.sound_url}
          >
            <source src={currentQuestion.sound_url} />
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* Image/Gesture display */}
        <div className="space-y-3">
          <p className="text-sm text-gray-300">👁️ Visual Reference:</p>
          <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700">
            <img
              src={currentQuestion.image_url}
              alt="Question reference"
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%239CA3AF' font-size='16' font-family='sans-serif'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Answer options */}
        <div className="space-y-3 mt-8">
          <p className="text-sm text-gray-300 font-semibold">Select your answer:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {answerOptions.map((option, index) => (
              <button
                key={`${option.label}-${index}`}
                disabled={answered}
                onClick={() => {
                  setSelectedAnswer(option.value);
                  setAnswered(true);
                  if (option.value === currentQuestion.correct_answer) {
                    setScore((prev) => prev + 1);
                  }
                  setUserAnswers((prev) => ({
                    ...prev,
                    [currentQuestionIndex]: option.value,
                  }));
                }}
                className={`p-4 rounded-lg text-left font-semibold transition ${
                  selectedAnswer === option.value
                    ? isAnswerCorrect
                      ? "bg-green-600/80 text-white border-2 border-green-400"
                      : "bg-red-600/80 text-white border-2 border-red-400"
                    : answered && option.value === currentQuestion.correct_answer
                      ? "bg-green-600/40 text-green-100 border-2 border-green-500"
                      : "bg-slate-700 text-slate-100 border-2 border-slate-600 hover:border-blue-500 cursor-pointer"
                }`}
              >
                <span className="font-bold text-lg">{option.label}.</span> {option.value}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className={`p-4 rounded-lg ${
              isAnswerCorrect
                ? "bg-green-900/40 border border-green-600 text-green-100"
                : "bg-red-900/40 border border-red-600 text-red-100"
            }`}
          >
            <p className="font-semibold">
              {isAnswerCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <p className="text-sm mt-1">
              {isAnswerCorrect
                ? currentQuestion.feedback_correct || "Great job!"
                : currentQuestion.feedback_incorrect ||
                  `The correct answer is: ${currentQuestion.correct_answer}`}
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 justify-between">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => {
            setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
            setSelectedAnswer(null);
            setAnswered(false);
          }}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
        >
          ← Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            disabled={!answered}
            onClick={() => setQuizComplete(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Finish Quiz
          </button>
        ) : (
          <button
            disabled={!answered}
            onClick={() => {
              setCurrentQuestionIndex((prev) => prev + 1);
              setSelectedAnswer(null);
              setAnswered(false);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Next →
          </button>
        )}
      </div>

      {/* Score display */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-gray-400">
          Current Score: <span className="font-bold text-cyan-400">{score}/{questions.length}</span>
        </p>
      </div>
    </div>
  );
}