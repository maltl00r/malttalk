"use client";

import { useState, useEffect } from "react";
import { fetchLessonWithClosingExam } from "@/app/actions/modules";
import type { lessons, closing_exam_contents } from "@/generated/prisma/client";

interface ClosingExamDivProps {
  lessonId: number;
}

interface LessonData {
  lesson: (lessons & { closing_exam_contents: closing_exam_contents[] }) | null;
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
 * CLOSING EXAM COMPONENT
 * 
 * Provides timed unit closing assessments to measure overall comprehension.
 * Students take a chronometer-based test with multiple choice questions.
 * 
 * Features:
 * - Countdown timer for entire exam
 * - Multiple choice questions with feedback
 * - Score tracking and percentage calculation
 * - Passing score requirements
 * - Points per question
 * - Progress indication
 * - Randomized answer options
 * 
 * @component
 * @param {ClosingExamDivProps} props - Component props
 * @returns {JSX.Element} Rendered closing exam interface
 */
export default function ClosingExamDiv({ lessonId }: ClosingExamDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  // Nuevo estado para guardar las opciones mezcladas de la pregunta actual
  const [shuffledOptions, setShuffledOptions] = useState<{ value: string; isCorrect: boolean }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithClosingExam(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
        if (lesson?.closing_exam_contents?.[0]) {
          setTimeRemaining(lesson.closing_exam_contents[0].time_limit);
          const total = lesson.closing_exam_contents.reduce((sum, q) => sum + q.points_value, 0);
          setTotalPoints(total);
        }
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading closing exam",
        });
      }
    };

    loadData();
  }, [lessonId]);

  // Efecto para mezclar las opciones cada vez que cambia la pregunta actual
  useEffect(() => {
    if (data.lesson?.closing_exam_contents) {
      const currentQ = data.lesson.closing_exam_contents[currentQuestionIndex];
      if (currentQ) {
        const options = [
          { value: currentQ.correct_answer, isCorrect: true },
          { value: currentQ.option_b, isCorrect: false },
          { value: currentQ.option_c, isCorrect: false },
          ...(currentQ.option_d ? [{ value: currentQ.option_d, isCorrect: false }] : []),
        ];
        setShuffledOptions(shuffleArray(options));
      }
    }
  }, [currentQuestionIndex, data.lesson]);

  // Timer countdown
  useEffect(() => {
    if (!completed && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !completed) {
      setCompleted(true);
    }
  }, [timeRemaining, completed]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Loading closing exam...
      </div>
    );
  }

  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "Failed to load closing exam"}
      </div>
    );
  }

  const questions = data.lesson.closing_exam_contents || [];
  if (questions.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No closing exam questions available for this lesson
      </div>
    );
  }

  if (completed) {
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passingScore = questions[0]?.passing_score || 70;
    const passed = percentage >= passingScore;

    return (
      <div className={`max-w-2xl mx-auto p-8 rounded-2xl border ${
        passed
          ? "bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700/50"
          : "bg-gradient-to-br from-red-900/20 to-blue-900/20 border-red-700/50"
      }`}>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">
            {passed ? "✓ Exam Passed! 🎉" : "✗ Exam Failed"}
          </h2>
          <div className={`text-5xl font-black ${passed ? "text-green-400" : "text-red-400"}`}>
            {percentage}%
          </div>
          <p className="text-xl text-gray-300">
            Score: <span className="font-bold">{score}/{totalPoints}</span> points
          </p>
          <p className={`text-lg ${passed ? "text-green-300" : "text-red-300"}`}>
            {passed
              ? `Excellent! You passed with ${percentage}% (required: ${passingScore}%)`
              : `You need ${passingScore}% to pass. You scored ${percentage}%`}
          </p>
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setAnswered(false);
              setScore(0);
              setCompleted(false);
              setTimeRemaining(questions[0].time_limit);
            }}
            className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg transition ${
              passed
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
  const formattedTime = `${Math.floor(timeRemaining! / 60)}:${String(timeRemaining! % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header with timer */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{currentQuestion.title}</h1>
            {currentQuestion.description && (
              <p className="text-purple-100 text-sm">{currentQuestion.description}</p>
            )}
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-3xl ${
            timeRemaining! <= 60 ? "bg-red-600 animate-pulse" : "bg-white/20"
          }`}>
            ⏱️ {formattedTime}
          </div>
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
        <p className="text-sm text-purple-100 mt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
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
          <span className="ml-auto text-sm font-semibold text-gray-400">
            Points: <span className="text-purple-300">{currentQuestion.points_value}</span>
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>

        {/* Answer options */}
        <div className="space-y-3 mt-8">
          <p className="text-sm text-gray-300 font-semibold">Select your answer:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shuffledOptions.map((option, index) => {
              const label = String.fromCharCode(65 + index); // A, B, C, D dinámicamente
              return (
                <button
                  key={index}
                  disabled={answered}
                  onClick={() => {
                    setSelectedAnswer(option.value);
                    setAnswered(true);
                    if (option.isCorrect) {
                      setScore((prev) => prev + currentQuestion.points_value);
                    }
                  }}
                  className={`p-4 rounded-lg text-left font-semibold transition ${
                    selectedAnswer === option.value
                      ? option.isCorrect
                        ? "bg-green-600/80 text-white border-2 border-green-400"
                        : "bg-red-600/80 text-white border-2 border-red-400"
                      : answered && option.isCorrect
                        ? "bg-green-600/40 text-green-100 border-2 border-green-500"
                        : "bg-slate-700 text-slate-100 border-2 border-slate-600 hover:border-purple-500 cursor-pointer"
                  }`}
                >
                  <span className="font-bold text-lg">{label}.</span> {option.value}
                </button>
              );
            })}
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
              {isAnswerCorrect ? `✓ Correct! +${currentQuestion.points_value} points` : "✗ Incorrect"}
            </p>
            <p className="text-sm mt-1">
              {isAnswerCorrect
                ? currentQuestion.feedback_correct || "Well done!"
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
            onClick={() => setCompleted(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Submit Exam
          </button>
        ) : (
          <button
            disabled={!answered}
            onClick={() => {
              setCurrentQuestionIndex((prev) => prev + 1);
              setSelectedAnswer(null);
              setAnswered(false);
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Score display */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-gray-400">
          Current Score: <span className="font-bold text-purple-400">{score}/{totalPoints}</span> points
        </p>
      </div>
    </div>
  );
}