"use client";

import { useState, useEffect } from "react";
import { fetchLessonWithMentalAgility } from "@/app/actions/modules";
import type { lessons, mental_agility_contents } from "@/generated/prisma/client";

interface MentalAgilityDivProps {
  lessonId: number;
}

interface LessonData {
  lesson: (lessons & { mental_agility_contents: mental_agility_contents[] }) | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * MENTAL AGILITY CHALLENGES COMPONENT
 * 
 * Provides timed mental agility challenges where students identify correct terms.
 * Students race against time to complete sequences or patterns.
 * 
 * Features:
 * - Countdown timer for each challenge
 * - Visual pattern/sequence display
 * - Multiple choice answers (A, B, C, D)
 * - Score tracking
 * - Time-based feedback
 * - Progress indication
 * 
 * @component
 * @param {MentalAgilityDivProps} props - Component props
 * @returns {JSX.Element} Rendered mental agility challenge interface
 */
export default function MentalAgilityDiv({ lessonId }: MentalAgilityDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeoutAnswered, setTimeoutAnswered] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithMentalAgility(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
        if (lesson?.mental_agility_contents?.[0]) {
          setTimeRemaining(lesson.mental_agility_contents[0].time_limit);
        }
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading mental agility challenges",
        });
      }
    };

    loadData();
  }, [lessonId]);

  // Timer countdown
  useEffect(() => {
    if (!answered && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !answered) {
      setTimeoutAnswered(true);
      setAnswered(true);
    }
  }, [timeRemaining, answered]);

  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Loading mental agility challenges...
      </div>
    );
  }

  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "Failed to load mental agility challenges"}
      </div>
    );
  }

  const challenges = data.lesson.mental_agility_contents || [];
  if (challenges.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No mental agility challenges available for this lesson
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / challenges.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-orange-900/20 to-blue-900/20 rounded-2xl border border-orange-700/50">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Mental Agility Quiz Complete! 🧠</h2>
          <div className="text-5xl font-black text-orange-400">{percentage}%</div>
          <p className="text-xl text-gray-300">
            You got <span className="font-bold text-orange-400">{score}</span> out of{" "}
            <span className="font-bold">{challenges.length}</span> correct
          </p>
          <button
            onClick={() => {
              setCurrentChallengeIndex(0);
              setSelectedAnswer(null);
              setAnswered(false);
              setScore(0);
              setCompleted(false);
              setTimeoutAnswered(false);
              setTimeRemaining(challenges[0].time_limit);
            }}
            className="mt-6 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];
  const isAnswerCorrect = selectedAnswer === currentChallenge.correct_answer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header with timer */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{data.lesson.title}</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Challenge {currentChallengeIndex + 1} of {challenges.length}
            </span>
            <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${
              timeRemaining! <= 5 ? "bg-red-600" : "bg-white/20"
            }`}>
              ⏱️ {timeRemaining}s
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Challenge content */}
      <div className="bg-slate-800/50 rounded-xl p-8 space-y-6 border border-slate-700">
        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Difficulty:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentChallenge.difficulty_level === "beginner"
                ? "bg-green-500/20 text-green-300"
                : currentChallenge.difficulty_level === "intermediate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
            }`}
          >
            {currentChallenge.difficulty_level.charAt(0).toUpperCase() +
              currentChallenge.difficulty_level.slice(1)}
          </span>
        </div>

        {/* Challenge title and prompt */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">{currentChallenge.title}</h2>
          <p className="text-gray-200 text-lg leading-relaxed">{currentChallenge.prompt}</p>
        </div>

        {/* Challenge image if available */}
        {currentChallenge.image_url && (
          <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-600">
            <img
              src={currentChallenge.image_url}
              alt="Challenge visual"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23374151' width='400' height='200'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%239CA3AF' font-size='16' font-family='sans-serif'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        )}

        {/* Answer options */}
        <div className="space-y-3 mt-8">
          <p className="text-sm text-gray-300 font-semibold">Select the correct answer:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "A", value: currentChallenge.correct_answer },
              { label: "B", value: currentChallenge.option_b },
              { label: "C", value: currentChallenge.option_c },
              ...(currentChallenge.option_d
                ? [{ label: "D", value: currentChallenge.option_d }]
                : []),
            ].map((option) => (
              <button
                key={option.label}
                disabled={answered}
                onClick={() => {
                  setSelectedAnswer(option.value);
                  setAnswered(true);
                  if (option.value === currentChallenge.correct_answer) {
                    setScore((prev) => prev + 1);
                  }
                }}
                className={`p-4 rounded-lg text-left font-semibold transition ${
                  selectedAnswer === option.value
                    ? isAnswerCorrect
                      ? "bg-green-600/80 text-white border-2 border-green-400"
                      : "bg-red-600/80 text-white border-2 border-red-400"
                    : answered && option.value === currentChallenge.correct_answer
                      ? "bg-green-600/40 text-green-100 border-2 border-green-500"
                      : "bg-slate-700 text-slate-100 border-2 border-slate-600 hover:border-orange-500 cursor-pointer"
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
              timeoutAnswered
                ? "bg-gray-900/40 border border-gray-600 text-gray-100"
                : isAnswerCorrect
                  ? "bg-green-900/40 border border-green-600 text-green-100"
                  : "bg-red-900/40 border border-red-600 text-red-100"
            }`}
          >
            <p className="font-semibold">
              {timeoutAnswered
                ? "⏰ Time's up!"
                : isAnswerCorrect
                  ? "✓ Correct! Fast reaction!"
                  : "✗ Incorrect"}
            </p>
            <p className="text-sm mt-1">
              {timeoutAnswered
                ? "You ran out of time. The correct answer was: " + currentChallenge.correct_answer
                : isAnswerCorrect
                  ? currentChallenge.feedback_correct || "Excellent speed and accuracy!"
                  : currentChallenge.feedback_incorrect ||
                    `The correct answer is: ${currentChallenge.correct_answer}`}
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 justify-between">
        <button
          disabled={currentChallengeIndex === 0}
          onClick={() => {
            setCurrentChallengeIndex((prev) => Math.max(0, prev - 1));
            setSelectedAnswer(null);
            setAnswered(false);
            setTimeoutAnswered(false);
            setTimeRemaining(challenges[Math.max(0, currentChallengeIndex - 1)].time_limit);
          }}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
        >
          ← Previous
        </button>

        {currentChallengeIndex === challenges.length - 1 ? (
          <button
            disabled={!answered}
            onClick={() => setCompleted(true)}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Finish Challenge
          </button>
        ) : (
          <button
            disabled={!answered}
            onClick={() => {
              setCurrentChallengeIndex((prev) => prev + 1);
              setSelectedAnswer(null);
              setAnswered(false);
              setTimeoutAnswered(false);
              setTimeRemaining(challenges[currentChallengeIndex + 1].time_limit);
            }}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Next Challenge →
          </button>
        )}
      </div>

      {/* Score display */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-gray-400">
          Score: <span className="font-bold text-orange-400">{score}/{challenges.length}</span>
        </p>
      </div>
    </div>
  );
}
